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
import { IValidator, ICompositeValidator, ValidationResult, ValidationContext, ValidatorConfig, ValidationSchema, ValidationError, ValidationSeverity, ValidationBuilder } from '../types';
/**
 * Abstract base class for all validators
 */
export declare abstract class BaseValidator<T = any> implements IValidator<T> {
    readonly name: string;
    readonly config: ValidatorConfig;
    readonly dependencies: string[];
    protected readonly schema: ValidationSchema;
    constructor(name: string, config?: Partial<ValidatorConfig>, dependencies?: string[]);
    /**
     * Validate a value - must be implemented by subclasses
     */
    abstract validate(value: T, context: ValidationContext): Promise<ValidationResult>;
    /**
     * Check if validator can handle the given value type
     */
    abstract canValidate(value: any): value is T;
    /**
     * Create validation schema - can be overridden by subclasses
     */
    protected createSchema(): ValidationSchema;
    /**
     * Get validation schema
     */
    getSchema(): ValidationSchema;
    /**
     * Create a validation error
     */
    protected createError(code: string, message: string, path: string[], severity?: ValidationSeverity, suggestions?: string[], context?: Record<string, any>, value?: any): ValidationError;
    /**
     * Create a successful validation result
     */
    protected createSuccessResult(context: ValidationContext, warnings?: ValidationError[]): ValidationResult;
    /**
     * Create a failed validation result
     */
    protected createFailureResult(errors: ValidationError[], context: ValidationContext, warnings?: ValidationError[]): ValidationResult;
    /**
     * Validate configuration
     */
    protected validateConfig(): void;
}
/**
 * Validator that combines multiple validators
 */
export declare class CompositeValidator extends BaseValidator implements ICompositeValidator {
    readonly validators: IValidator[];
    private readonly validatorMap;
    constructor(name: string, validators?: IValidator[], config?: Partial<ValidatorConfig>);
    /**
     * Add a validator to the composition
     */
    addValidator(validator: IValidator): void;
    /**
     * Remove a validator from the composition
     */
    removeValidator(name: string): void;
    /**
     * Get a specific validator by name
     */
    getValidator(name: string): IValidator | undefined;
    /**
     * Check if composite can validate the value
     */
    canValidate(value: any): value is any;
    /**
     * Validate using all applicable validators
     */
    validate(value: any, context: ValidationContext): Promise<ValidationResult>;
    /**
     * Create composite schema
     */
    protected createSchema(): ValidationSchema;
}
/**
 * Fluent API for building validators
 */
export declare class FluentValidationBuilder<T> implements ValidationBuilder<T> {
    private readonly validators;
    private readonly rules;
    private config;
    private name;
    constructor(name: string);
    /**
     * Add a validator to the builder
     */
    addValidator(validator: IValidator<T>): ValidationBuilder<T>;
    /**
     * Add a rule to the builder
     */
    addRule(rule: any): ValidationBuilder<T>;
    /**
     * Set configuration for the validator
     */
    withConfig(config: Partial<ValidatorConfig>): ValidationBuilder<T>;
    /**
     * Set validator name
     */
    withName(name: string): ValidationBuilder<T>;
    /**
     * Set validator priority
     */
    withPriority(priority: number): ValidationBuilder<T>;
    /**
     * Enable/disable caching
     */
    withCaching(enabled: boolean): ValidationBuilder<T>;
    /**
     * Set validator timeout
     */
    withTimeout(timeout: number): ValidationBuilder<T>;
    /**
     * Build the composite validator
     */
    build(): IValidator<T>;
}
/**
 * Base class for chemistry-specific validators
 */
export declare abstract class ChemistryValidator<T> extends BaseValidator<T> {
    protected readonly elementSymbols: Set<string>;
    /**
     * Validate element symbol
     */
    protected isValidElement(symbol: string): boolean;
    /**
     * Parse chemical formula into elements and counts
     */
    protected parseFormula(formula: string): Map<string, number>;
    /**
     * Calculate molecular weight from formula
     */
    protected calculateMolecularWeight(elements: Map<string, number>): number;
}
/**
 * Async validator base class
 */
export declare abstract class AsyncValidator<T> extends BaseValidator<T> {
    protected readonly concurrencyLimit: number;
    private activeTasks;
    constructor(name: string, config?: Partial<ValidatorConfig>, dependencies?: string[], concurrencyLimit?: number);
    /**
     * Execute async validation with concurrency control
     */
    validate(value: T, context: ValidationContext): Promise<ValidationResult>;
    /**
     * Perform the actual async validation - must be implemented by subclasses
     */
    protected abstract performAsyncValidation(value: T, context: ValidationContext): Promise<ValidationResult>;
    /**
     * Wait for an available slot
     */
    private waitForSlot;
}
/**
 * Create a validation builder
 */
export declare function createValidator<T>(name: string): ValidationBuilder<T>;
/**
 * Create a composite validator
 */
export declare function createCompositeValidator(name: string, validators: IValidator[], config?: Partial<ValidatorConfig>): ICompositeValidator;
/**
 * Create a chemistry validator (helper for common chemistry validations)
 */
export declare function createChemistryValidator<T>(name: string, validationFn: (value: T, context: ValidationContext) => Promise<ValidationResult>, canValidateFn: (value: any) => value is T, config?: Partial<ValidatorConfig>): IValidator<T>;
//# sourceMappingURL=BaseValidator.d.ts.map