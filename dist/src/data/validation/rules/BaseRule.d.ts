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
import { ValidationRule, RuleResult, ValidationContext, ValidationSeverity } from '../types';
/**
 * Abstract base class for all validation rules
 */
export declare abstract class BaseRule<T = any> implements ValidationRule<T> {
    readonly name: string;
    readonly description: string;
    readonly dependencies: string[];
    readonly priority: number;
    readonly cacheable: boolean;
    constructor(name: string, description: string, options?: {
        dependencies?: string[];
        priority?: number;
        cacheable?: boolean;
    });
    /**
     * Execute the validation rule - must be implemented by subclasses
     */
    abstract execute(value: T, context: ValidationContext): Promise<RuleResult>;
    /**
     * Check if rule applies to the given value - can be overridden
     */
    appliesTo(value: any): boolean;
    /**
     * Create a successful rule result
     */
    protected createSuccess(metadata?: Record<string, any>): RuleResult;
    /**
     * Create a failed rule result
     */
    protected createFailure(code: string, message: string, path: string[], severity?: ValidationSeverity, suggestions?: string[], context?: Record<string, any>, value?: any, metadata?: Record<string, any>): RuleResult;
}
/**
 * Base class for synchronous validation rules
 */
export declare abstract class SyncRule<T = any> extends BaseRule<T> {
    /**
     * Execute synchronous validation
     */
    execute(value: T, context: ValidationContext): Promise<RuleResult>;
    /**
     * Perform synchronous validation - must be implemented by subclasses
     */
    protected abstract validateSync(value: T, context: ValidationContext): RuleResult;
}
/**
 * Base class for asynchronous validation rules
 */
export declare abstract class AsyncRule<T = any> extends BaseRule<T> {
    private readonly timeout;
    constructor(name: string, description: string, options?: {
        dependencies?: string[];
        priority?: number;
        cacheable?: boolean;
        timeout?: number;
    });
    /**
     * Execute asynchronous validation with timeout
     */
    execute(value: T, context: ValidationContext): Promise<RuleResult>;
    /**
     * Perform asynchronous validation - must be implemented by subclasses
     */
    protected abstract validateAsync(value: T, context: ValidationContext): Promise<RuleResult>;
    /**
     * Execute operation with timeout
     */
    private executeWithTimeout;
}
/**
 * Rule that combines multiple rules with logical operators
 */
export declare class CompositeRule<T = any> extends BaseRule<T> {
    private readonly rules;
    private readonly operator;
    constructor(name: string, description: string, rules: ValidationRule<T>[], operator?: 'AND' | 'OR', options?: {
        dependencies?: string[];
        priority?: number;
        cacheable?: boolean;
    });
    /**
     * Check if composite rule applies
     */
    appliesTo(value: any): boolean;
    /**
     * Execute composite rule
     */
    execute(value: T, context: ValidationContext): Promise<RuleResult>;
}
/**
 * Rule that applies based on a condition
 */
export declare class ConditionalRule<T = any> extends BaseRule<T> {
    private readonly condition;
    private readonly rule;
    constructor(name: string, description: string, condition: (value: T, context: ValidationContext) => boolean, rule: ValidationRule<T>, options?: {
        dependencies?: string[];
        priority?: number;
        cacheable?: boolean;
    });
    /**
     * Check if conditional rule applies
     */
    appliesTo(value: any): boolean;
    /**
     * Execute conditional rule
     */
    execute(value: T, context: ValidationContext): Promise<RuleResult>;
}
/**
 * Rule for validating numeric ranges
 */
export declare class RangeRule extends SyncRule<number> {
    private readonly min;
    private readonly max;
    private readonly inclusive;
    constructor(name: string, min: number, max: number, options?: {
        inclusive?: boolean;
        priority?: number;
        cacheable?: boolean;
    });
    /**
     * Check if rule applies to numeric values
     */
    appliesTo(value: any): boolean;
    /**
     * Validate range
     */
    protected validateSync(value: number, context: ValidationContext): RuleResult;
}
/**
 * Rule for validating string patterns using regex
 */
export declare class PatternRule extends SyncRule<string> {
    private readonly pattern;
    private readonly patternName;
    constructor(name: string, pattern: RegExp, patternName: string, options?: {
        priority?: number;
        cacheable?: boolean;
    });
    /**
     * Check if rule applies to strings
     */
    appliesTo(value: any): boolean;
    /**
     * Validate pattern
     */
    protected validateSync(value: string, context: ValidationContext): RuleResult;
}
/**
 * Create a range validation rule
 */
export declare function createRangeRule(name: string, min: number, max: number, options?: {
    inclusive?: boolean;
    priority?: number;
    cacheable?: boolean;
}): RangeRule;
/**
 * Create a pattern validation rule
 */
export declare function createPatternRule(name: string, pattern: RegExp, patternName: string, options?: {
    priority?: number;
    cacheable?: boolean;
}): PatternRule;
/**
 * Create a composite AND rule
 */
export declare function createAndRule<T>(name: string, description: string, rules: ValidationRule<T>[], options?: {
    dependencies?: string[];
    priority?: number;
    cacheable?: boolean;
}): CompositeRule<T>;
/**
 * Create a composite OR rule
 */
export declare function createOrRule<T>(name: string, description: string, rules: ValidationRule<T>[], options?: {
    dependencies?: string[];
    priority?: number;
    cacheable?: boolean;
}): CompositeRule<T>;
/**
 * Create a conditional rule
 */
export declare function createConditionalRule<T>(name: string, description: string, condition: (value: T, context: ValidationContext) => boolean, rule: ValidationRule<T>, options?: {
    dependencies?: string[];
    priority?: number;
    cacheable?: boolean;
}): ConditionalRule<T>;
//# sourceMappingURL=BaseRule.d.ts.map