/**
 * @fileoverview Base validator classes and validator composition utilities
 *
 * Provides foundation classes for building custom validators:
 * - BaseValidator: Abstract base class with common functionality
 * - CompositeValidator: Combines multiple validators
 * - ValidatorBuilder: Fluent API for building validators
 * - SpecializedValidators: Chemistry-specific validator helpers
 *
 * @version 1.0.0
 * @author CREB Team
 */
import { ValidationSeverity } from '../types';
import { ValidationError as CREBValidationError } from '../../../core/errors/CREBError';
// ============================================================================
// Base Validator
// ============================================================================
/**
 * Abstract base class for all validators
 */
export class BaseValidator {
    constructor(name, config = {}, dependencies = []) {
        this.name = name;
        this.dependencies = dependencies;
        this.config = {
            enabled: true,
            priority: 0,
            timeout: 5000,
            cacheable: true,
            ...config
        };
        this.schema = this.createSchema();
    }
    /**
     * Create validation schema - can be overridden by subclasses
     */
    createSchema() {
        return {
            name: this.name,
            version: '1.0.0',
            description: `Schema for ${this.name} validator`,
            types: ['any'],
            requiredValidators: [],
            optionalValidators: [],
            properties: {}
        };
    }
    /**
     * Get validation schema
     */
    getSchema() {
        return { ...this.schema };
    }
    /**
     * Create a validation error
     */
    createError(code, message, path, severity = ValidationSeverity.ERROR, suggestions = [], context, value) {
        return {
            code,
            message,
            path,
            severity,
            suggestions,
            context,
            value
        };
    }
    /**
     * Create a successful validation result
     */
    createSuccessResult(context, warnings = []) {
        return {
            isValid: true,
            errors: [],
            warnings,
            metrics: {
                duration: 0,
                rulesExecuted: 0,
                validatorsUsed: 1,
                cacheStats: { hits: 0, misses: 0, hitRate: 0 }
            },
            timestamp: new Date()
        };
    }
    /**
     * Create a failed validation result
     */
    createFailureResult(errors, context, warnings = []) {
        return {
            isValid: false,
            errors,
            warnings,
            metrics: {
                duration: 0,
                rulesExecuted: 0,
                validatorsUsed: 1,
                cacheStats: { hits: 0, misses: 0, hitRate: 0 }
            },
            timestamp: new Date()
        };
    }
    /**
     * Validate configuration
     */
    validateConfig() {
        if (this.config.timeout && this.config.timeout <= 0) {
            throw new CREBValidationError('Validator timeout must be positive', { validator: this.name, timeout: this.config.timeout });
        }
    }
}
// ============================================================================
// Composite Validator
// ============================================================================
/**
 * Validator that combines multiple validators
 */
export class CompositeValidator extends BaseValidator {
    constructor(name, validators = [], config = {}) {
        super(name, config);
        this.validators = [];
        this.validatorMap = new Map();
        for (const validator of validators) {
            this.addValidator(validator);
        }
    }
    /**
     * Add a validator to the composition
     */
    addValidator(validator) {
        if (this.validatorMap.has(validator.name)) {
            throw new CREBValidationError(`Validator '${validator.name}' already exists in composite`, { composite: this.name, validator: validator.name });
        }
        this.validators.push(validator);
        this.validatorMap.set(validator.name, validator);
    }
    /**
     * Remove a validator from the composition
     */
    removeValidator(name) {
        const index = this.validators.findIndex(v => v.name === name);
        if (index !== -1) {
            this.validators.splice(index, 1);
            this.validatorMap.delete(name);
        }
    }
    /**
     * Get a specific validator by name
     */
    getValidator(name) {
        return this.validatorMap.get(name);
    }
    /**
     * Check if composite can validate the value
     */
    canValidate(value) {
        return this.validators.some(validator => validator.canValidate(value));
    }
    /**
     * Validate using all applicable validators
     */
    async validate(value, context) {
        const startTime = Date.now();
        const applicableValidators = this.validators.filter(v => v.canValidate(value));
        if (applicableValidators.length === 0) {
            return this.createSuccessResult(context);
        }
        const results = [];
        const allErrors = [];
        const allWarnings = [];
        // Execute all applicable validators
        for (const validator of applicableValidators) {
            try {
                const result = await validator.validate(value, context);
                results.push(result);
                allErrors.push(...result.errors);
                allWarnings.push(...result.warnings);
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : String(error);
                const validationError = this.createError('COMPOSITE_VALIDATOR_ERROR', `Validator '${validator.name}' failed: ${errorMessage}`, context.path, ValidationSeverity.ERROR, ['Check validator configuration', 'Verify input data'], { validator: validator.name, error: errorMessage });
                allErrors.push(validationError);
            }
        }
        const duration = Date.now() - startTime;
        const totalRules = results.reduce((sum, r) => sum + r.metrics.rulesExecuted, 0);
        const totalCacheHits = results.reduce((sum, r) => sum + r.metrics.cacheStats.hits, 0);
        const totalCacheMisses = results.reduce((sum, r) => sum + r.metrics.cacheStats.misses, 0);
        const totalCache = totalCacheHits + totalCacheMisses;
        return {
            isValid: allErrors.length === 0,
            errors: allErrors,
            warnings: allWarnings,
            metrics: {
                duration,
                rulesExecuted: totalRules,
                validatorsUsed: applicableValidators.length,
                cacheStats: {
                    hits: totalCacheHits,
                    misses: totalCacheMisses,
                    hitRate: totalCache > 0 ? totalCacheHits / totalCache : 0
                }
            },
            timestamp: new Date()
        };
    }
    /**
     * Create composite schema
     */
    createSchema() {
        const childSchemas = this.validators.map(v => v.getSchema());
        const allTypes = new Set();
        const allRequired = new Set();
        const allOptional = new Set();
        for (const schema of childSchemas) {
            schema.types.forEach(type => allTypes.add(type));
            schema.requiredValidators.forEach(req => allRequired.add(req));
            schema.optionalValidators.forEach(opt => allOptional.add(opt));
        }
        return {
            name: this.name,
            version: '1.0.0',
            description: `Composite schema for ${this.name}`,
            types: Array.from(allTypes),
            requiredValidators: Array.from(allRequired),
            optionalValidators: Array.from(allOptional),
            properties: {
                compositeOf: this.validators.map(v => v.name),
                childSchemas
            }
        };
    }
}
// ============================================================================
// Validation Builder
// ============================================================================
/**
 * Fluent API for building validators
 */
export class FluentValidationBuilder {
    constructor(name) {
        this.validators = [];
        this.rules = []; // ValidationRule<T>[] - avoiding circular dependency
        this.config = {};
        this.name = name;
    }
    /**
     * Add a validator to the builder
     */
    addValidator(validator) {
        this.validators.push(validator);
        return this;
    }
    /**
     * Add a rule to the builder
     */
    addRule(rule) {
        this.rules.push(rule);
        return this;
    }
    /**
     * Set configuration for the validator
     */
    withConfig(config) {
        this.config = { ...this.config, ...config };
        return this;
    }
    /**
     * Set validator name
     */
    withName(name) {
        this.name = name;
        return this;
    }
    /**
     * Set validator priority
     */
    withPriority(priority) {
        this.config.priority = priority;
        return this;
    }
    /**
     * Enable/disable caching
     */
    withCaching(enabled) {
        this.config.cacheable = enabled;
        return this;
    }
    /**
     * Set validator timeout
     */
    withTimeout(timeout) {
        this.config.timeout = timeout;
        return this;
    }
    /**
     * Build the composite validator
     */
    build() {
        if (this.validators.length === 0) {
            throw new CREBValidationError('Cannot build validator without any validators', { name: this.name });
        }
        if (this.validators.length === 1) {
            return this.validators[0];
        }
        return new CompositeValidator(this.name, this.validators, this.config);
    }
}
// ============================================================================
// Specialized Validator Helpers
// ============================================================================
/**
 * Base class for chemistry-specific validators
 */
export class ChemistryValidator extends BaseValidator {
    constructor() {
        super(...arguments);
        this.elementSymbols = new Set([
            'H', 'He', 'Li', 'Be', 'B', 'C', 'N', 'O', 'F', 'Ne',
            'Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl', 'Ar', 'K', 'Ca',
            'Sc', 'Ti', 'V', 'Cr', 'Mn', 'Fe', 'Co', 'Ni', 'Cu', 'Zn',
            'Ga', 'Ge', 'As', 'Se', 'Br', 'Kr', 'Rb', 'Sr', 'Y', 'Zr',
            'Nb', 'Mo', 'Tc', 'Ru', 'Rh', 'Pd', 'Ag', 'Cd', 'In', 'Sn',
            'Sb', 'Te', 'I', 'Xe', 'Cs', 'Ba', 'La', 'Ce', 'Pr', 'Nd',
            'Pm', 'Sm', 'Eu', 'Gd', 'Tb', 'Dy', 'Ho', 'Er', 'Tm', 'Yb',
            'Lu', 'Hf', 'Ta', 'W', 'Re', 'Os', 'Ir', 'Pt', 'Au', 'Hg',
            'Tl', 'Pb', 'Bi', 'Po', 'At', 'Rn', 'Fr', 'Ra', 'Ac', 'Th',
            'Pa', 'U', 'Np', 'Pu', 'Am', 'Cm', 'Bk', 'Cf', 'Es', 'Fm',
            'Md', 'No', 'Lr', 'Rf', 'Db', 'Sg', 'Bh', 'Hs', 'Mt', 'Ds',
            'Rg', 'Cn', 'Nh', 'Fl', 'Mc', 'Lv', 'Ts', 'Og'
        ]);
    }
    /**
     * Validate element symbol
     */
    isValidElement(symbol) {
        return this.elementSymbols.has(symbol);
    }
    /**
     * Parse chemical formula into elements and counts
     */
    parseFormula(formula) {
        const elements = new Map();
        const regex = /([A-Z][a-z]?)(\d*)/g;
        let match;
        while ((match = regex.exec(formula)) !== null) {
            const element = match[1];
            const count = parseInt(match[2] || '1', 10);
            if (!this.isValidElement(element)) {
                throw new CREBValidationError(`Invalid element symbol: ${element}`, { element, formula });
            }
            elements.set(element, (elements.get(element) || 0) + count);
        }
        return elements;
    }
    /**
     * Calculate molecular weight from formula
     */
    calculateMolecularWeight(elements) {
        // Simplified atomic weights (should be imported from constants)
        const atomicWeights = {
            'H': 1.008, 'C': 12.011, 'N': 14.007, 'O': 15.999,
            'F': 18.998, 'P': 30.974, 'S': 32.06, 'Cl': 35.45,
            'K': 39.098, 'Ca': 40.078, 'Fe': 55.845, 'Cu': 63.546,
            'Zn': 65.38, 'Br': 79.904, 'Ag': 107.868, 'I': 126.90
            // Add more as needed
        };
        let totalWeight = 0;
        for (const [element, count] of elements) {
            const weight = atomicWeights[element];
            if (weight === undefined) {
                throw new CREBValidationError(`Atomic weight not available for element: ${element}`, { element });
            }
            totalWeight += weight * count;
        }
        return totalWeight;
    }
}
/**
 * Async validator base class
 */
export class AsyncValidator extends BaseValidator {
    constructor(name, config = {}, dependencies = [], concurrencyLimit = 5) {
        super(name, config, dependencies);
        this.activeTasks = 0;
        this.concurrencyLimit = concurrencyLimit;
    }
    /**
     * Execute async validation with concurrency control
     */
    async validate(value, context) {
        await this.waitForSlot();
        this.activeTasks++;
        try {
            return await this.performAsyncValidation(value, context);
        }
        finally {
            this.activeTasks--;
        }
    }
    /**
     * Wait for an available slot
     */
    async waitForSlot() {
        while (this.activeTasks >= this.concurrencyLimit) {
            await new Promise(resolve => setTimeout(resolve, 10));
        }
    }
}
// ============================================================================
// Factory Functions
// ============================================================================
/**
 * Create a validation builder
 */
export function createValidator(name) {
    return new FluentValidationBuilder(name);
}
/**
 * Create a composite validator
 */
export function createCompositeValidator(name, validators, config) {
    return new CompositeValidator(name, validators, config);
}
/**
 * Create a chemistry validator (helper for common chemistry validations)
 */
export function createChemistryValidator(name, validationFn, canValidateFn, config) {
    return new (class extends ChemistryValidator {
        constructor() {
            super(...arguments);
            this.canValidate = canValidateFn;
            this.validate = validationFn;
        }
    })(name, config);
}
//# sourceMappingURL=BaseValidator.js.map