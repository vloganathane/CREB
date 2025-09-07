/**
 * @fileoverview Base Validation Rule Classes
 *
 * Provides foundation classes for building validation rules:
 * - BaseRule: Abstract base class for all rules
 * - SyncRule: For synchronous validation rules
 * - AsyncRule: For asynchronous validation rules
 * - CompositeRule: Combines multiple rules
 * - ConditionalRule: Rules that apply based on conditions
 *
 * @version 1.0.0
 * @author CREB Team
 */
import { ValidationSeverity } from '../types';
import { ValidationError as CREBValidationError } from '../../../core/errors/CREBError';
// ============================================================================
// Base Rule
// ============================================================================
/**
 * Abstract base class for all validation rules
 */
export class BaseRule {
    constructor(name, description, options = {}) {
        this.name = name;
        this.description = description;
        this.dependencies = options.dependencies || [];
        this.priority = options.priority || 0;
        this.cacheable = options.cacheable !== false;
    }
    /**
     * Check if rule applies to the given value - can be overridden
     */
    appliesTo(value) {
        return true; // By default, rules apply to all values
    }
    /**
     * Create a successful rule result
     */
    createSuccess(metadata) {
        return {
            passed: true,
            duration: 0,
            cached: false,
            metadata
        };
    }
    /**
     * Create a failed rule result
     */
    createFailure(code, message, path, severity = ValidationSeverity.ERROR, suggestions = [], context, value, metadata) {
        const error = {
            code,
            message,
            path,
            severity,
            suggestions,
            context,
            value
        };
        return {
            passed: false,
            error,
            duration: 0,
            cached: false,
            metadata
        };
    }
}
// ============================================================================
// Synchronous Rule
// ============================================================================
/**
 * Base class for synchronous validation rules
 */
export class SyncRule extends BaseRule {
    /**
     * Execute synchronous validation
     */
    async execute(value, context) {
        const startTime = Date.now();
        try {
            const result = this.validateSync(value, context);
            result.duration = Date.now() - startTime;
            return result;
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            return this.createFailure('RULE_EXECUTION_ERROR', `Rule '${this.name}' failed: ${errorMessage}`, context.path, ValidationSeverity.ERROR, ['Check rule configuration', 'Verify input data'], { rule: this.name, error: errorMessage });
        }
    }
}
// ============================================================================
// Asynchronous Rule
// ============================================================================
/**
 * Base class for asynchronous validation rules
 */
export class AsyncRule extends BaseRule {
    constructor(name, description, options = {}) {
        super(name, description, options);
        this.timeout = options.timeout || 5000;
    }
    /**
     * Execute asynchronous validation with timeout
     */
    async execute(value, context) {
        const startTime = Date.now();
        try {
            const result = await this.executeWithTimeout(() => this.validateAsync(value, context), this.timeout);
            result.duration = Date.now() - startTime;
            return result;
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            return this.createFailure('ASYNC_RULE_ERROR', `Async rule '${this.name}' failed: ${errorMessage}`, context.path, ValidationSeverity.ERROR, ['Check network connectivity', 'Verify external service availability'], { rule: this.name, error: errorMessage });
        }
    }
    /**
     * Execute operation with timeout
     */
    async executeWithTimeout(operation, timeout) {
        return new Promise((resolve, reject) => {
            const timer = setTimeout(() => {
                reject(new CREBValidationError(`Async rule '${this.name}' timed out after ${timeout}ms`, { rule: this.name, timeout }));
            }, timeout);
            operation()
                .then(result => {
                clearTimeout(timer);
                resolve(result);
            })
                .catch(error => {
                clearTimeout(timer);
                reject(error);
            });
        });
    }
}
// ============================================================================
// Composite Rule
// ============================================================================
/**
 * Rule that combines multiple rules with logical operators
 */
export class CompositeRule extends BaseRule {
    constructor(name, description, rules, operator = 'AND', options = {}) {
        super(name, description, options);
        this.rules = rules;
        this.operator = operator;
    }
    /**
     * Check if composite rule applies
     */
    appliesTo(value) {
        return this.rules.some(rule => rule.appliesTo(value));
    }
    /**
     * Execute composite rule
     */
    async execute(value, context) {
        const startTime = Date.now();
        const results = [];
        const errors = [];
        try {
            // Execute all applicable rules
            for (const rule of this.rules) {
                if (rule.appliesTo(value)) {
                    const result = await rule.execute(value, context);
                    results.push(result);
                    if (!result.passed && result.error) {
                        errors.push(result.error);
                    }
                }
            }
            // Apply logical operator
            let passed;
            if (this.operator === 'AND') {
                passed = results.every(r => r.passed);
            }
            else { // OR
                passed = results.some(r => r.passed);
            }
            const duration = Date.now() - startTime;
            const totalDuration = results.reduce((sum, r) => sum + r.duration, 0);
            if (passed) {
                return {
                    passed: true,
                    duration: duration,
                    cached: false,
                    metadata: {
                        operator: this.operator,
                        rulesExecuted: results.length,
                        totalDuration
                    }
                };
            }
            else {
                // For AND: return first error, for OR: return all errors
                const error = this.operator === 'AND'
                    ? errors[0]
                    : {
                        code: 'COMPOSITE_RULE_FAILURE',
                        message: `All rules in ${this.operator} composite failed`,
                        path: context.path,
                        severity: ValidationSeverity.ERROR,
                        suggestions: ['Check individual rule failures'],
                        context: { operator: this.operator, errors: errors.length }
                    };
                return {
                    passed: false,
                    error,
                    duration: duration,
                    cached: false,
                    metadata: {
                        operator: this.operator,
                        rulesExecuted: results.length,
                        totalDuration,
                        allErrors: errors
                    }
                };
            }
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            return this.createFailure('COMPOSITE_RULE_ERROR', `Composite rule execution failed: ${errorMessage}`, context.path, ValidationSeverity.ERROR, ['Check individual rules', 'Verify rule composition'], { error: errorMessage });
        }
    }
}
// ============================================================================
// Conditional Rule
// ============================================================================
/**
 * Rule that applies based on a condition
 */
export class ConditionalRule extends BaseRule {
    constructor(name, description, condition, rule, options = {}) {
        super(name, description, options);
        this.condition = condition;
        this.rule = rule;
    }
    /**
     * Check if conditional rule applies
     */
    appliesTo(value) {
        try {
            return this.rule.appliesTo(value);
        }
        catch {
            return false;
        }
    }
    /**
     * Execute conditional rule
     */
    async execute(value, context) {
        const startTime = Date.now();
        try {
            // Check condition first
            if (!this.condition(value, context)) {
                return {
                    passed: true,
                    duration: Date.now() - startTime,
                    cached: false,
                    metadata: { conditionMet: false, skipped: true }
                };
            }
            // Execute the actual rule
            const result = await this.rule.execute(value, context);
            result.metadata = {
                ...result.metadata,
                conditionMet: true,
                parentRule: this.name
            };
            return result;
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            return this.createFailure('CONDITIONAL_RULE_ERROR', `Conditional rule execution failed: ${errorMessage}`, context.path, ValidationSeverity.ERROR, ['Check condition logic', 'Verify rule implementation'], { error: errorMessage });
        }
    }
}
// ============================================================================
// Range Validation Rule
// ============================================================================
/**
 * Rule for validating numeric ranges
 */
export class RangeRule extends SyncRule {
    constructor(name, min, max, options = {}) {
        super(name, `Validate value is between ${min} and ${max}`, {
            priority: options.priority,
            cacheable: options.cacheable
        });
        this.min = min;
        this.max = max;
        this.inclusive = options.inclusive !== false;
    }
    /**
     * Check if rule applies to numeric values
     */
    appliesTo(value) {
        return typeof value === 'number' && isFinite(value);
    }
    /**
     * Validate range
     */
    validateSync(value, context) {
        const inRange = this.inclusive
            ? (value >= this.min && value <= this.max)
            : (value > this.min && value < this.max);
        if (inRange) {
            return this.createSuccess({ min: this.min, max: this.max, value });
        }
        else {
            const operator = this.inclusive ? '≤' : '<';
            return this.createFailure('VALUE_OUT_OF_RANGE', `Value ${value} is not in range ${this.min} ${operator} x ${operator} ${this.max}`, context.path, ValidationSeverity.ERROR, [`Provide value between ${this.min} and ${this.max}`], { min: this.min, max: this.max, inclusive: this.inclusive }, value);
        }
    }
}
// ============================================================================
// Pattern Validation Rule
// ============================================================================
/**
 * Rule for validating string patterns using regex
 */
export class PatternRule extends SyncRule {
    constructor(name, pattern, patternName, options = {}) {
        super(name, `Validate string matches ${patternName} pattern`, {
            priority: options.priority,
            cacheable: options.cacheable
        });
        this.pattern = pattern;
        this.patternName = patternName;
    }
    /**
     * Check if rule applies to strings
     */
    appliesTo(value) {
        return typeof value === 'string';
    }
    /**
     * Validate pattern
     */
    validateSync(value, context) {
        if (this.pattern.test(value)) {
            return this.createSuccess({ pattern: this.pattern.source, value });
        }
        else {
            return this.createFailure('PATTERN_MISMATCH', `Value "${value}" does not match ${this.patternName} pattern`, context.path, ValidationSeverity.ERROR, [`Ensure value matches the required ${this.patternName} format`], { pattern: this.pattern.source, patternName: this.patternName }, value);
        }
    }
}
// ============================================================================
// Factory Functions
// ============================================================================
/**
 * Create a range validation rule
 */
export function createRangeRule(name, min, max, options) {
    return new RangeRule(name, min, max, options);
}
/**
 * Create a pattern validation rule
 */
export function createPatternRule(name, pattern, patternName, options) {
    return new PatternRule(name, pattern, patternName, options);
}
/**
 * Create a composite AND rule
 */
export function createAndRule(name, description, rules, options) {
    return new CompositeRule(name, description, rules, 'AND', options);
}
/**
 * Create a composite OR rule
 */
export function createOrRule(name, description, rules, options) {
    return new CompositeRule(name, description, rules, 'OR', options);
}
/**
 * Create a conditional rule
 */
export function createConditionalRule(name, description, condition, rule, options) {
    return new ConditionalRule(name, description, condition, rule, options);
}
//# sourceMappingURL=BaseRule.js.map