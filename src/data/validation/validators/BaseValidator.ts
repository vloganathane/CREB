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

import {
  IValidator,
  ICompositeValidator,
  ValidationResult,
  ValidationContext,
  ValidatorConfig,
  ValidationSchema,
  ValidationError,
  ValidationSeverity,
  ValidationBuilder
} from '../types';
import { CREBError, ValidationError as CREBValidationError } from '../../../core/errors/CREBError';

// ============================================================================
// Base Validator
// ============================================================================

/**
 * Abstract base class for all validators
 */
export abstract class BaseValidator<T = any> implements IValidator<T> {
  public readonly name: string;
  public readonly config: ValidatorConfig;
  public readonly dependencies: string[];
  protected readonly schema: ValidationSchema;

  constructor(
    name: string,
    config: Partial<ValidatorConfig> = {},
    dependencies: string[] = []
  ) {
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
  protected createSchema(): ValidationSchema {
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
  getSchema(): ValidationSchema {
    return { ...this.schema };
  }

  /**
   * Create a validation error
   */
  protected createError(
    code: string,
    message: string,
    path: string[],
    severity: ValidationSeverity = ValidationSeverity.ERROR,
    suggestions: string[] = [],
    context?: Record<string, any>,
    value?: any
  ): ValidationError {
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
  protected createSuccessResult(
    context: ValidationContext,
    warnings: ValidationError[] = []
  ): ValidationResult {
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
  protected createFailureResult(
    errors: ValidationError[],
    context: ValidationContext,
    warnings: ValidationError[] = []
  ): ValidationResult {
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
  protected validateConfig(): void {
    if (this.config.timeout && this.config.timeout <= 0) {
      throw new CREBValidationError(
        'Validator timeout must be positive',
        { validator: this.name, timeout: this.config.timeout }
      );
    }
  }
}

// ============================================================================
// Composite Validator
// ============================================================================

/**
 * Validator that combines multiple validators
 */
export class CompositeValidator extends BaseValidator implements ICompositeValidator {
  public readonly validators: IValidator[] = [];
  private readonly validatorMap = new Map<string, IValidator>();

  constructor(
    name: string,
    validators: IValidator[] = [],
    config: Partial<ValidatorConfig> = {}
  ) {
    super(name, config);
    
    for (const validator of validators) {
      this.addValidator(validator);
    }
  }

  /**
   * Add a validator to the composition
   */
  addValidator(validator: IValidator): void {
    if (this.validatorMap.has(validator.name)) {
      throw new CREBValidationError(
        `Validator '${validator.name}' already exists in composite`,
        { composite: this.name, validator: validator.name }
      );
    }

    this.validators.push(validator);
    this.validatorMap.set(validator.name, validator);
  }

  /**
   * Remove a validator from the composition
   */
  removeValidator(name: string): void {
    const index = this.validators.findIndex(v => v.name === name);
    if (index !== -1) {
      this.validators.splice(index, 1);
      this.validatorMap.delete(name);
    }
  }

  /**
   * Get a specific validator by name
   */
  getValidator(name: string): IValidator | undefined {
    return this.validatorMap.get(name);
  }

  /**
   * Check if composite can validate the value
   */
  canValidate(value: any): value is any {
    return this.validators.some(validator => validator.canValidate(value));
  }

  /**
   * Validate using all applicable validators
   */
  async validate(value: any, context: ValidationContext): Promise<ValidationResult> {
    const startTime = Date.now();
    const applicableValidators = this.validators.filter(v => v.canValidate(value));

    if (applicableValidators.length === 0) {
      return this.createSuccessResult(context);
    }

    const results: ValidationResult[] = [];
    const allErrors: ValidationError[] = [];
    const allWarnings: ValidationError[] = [];

    // Execute all applicable validators
    for (const validator of applicableValidators) {
      try {
        const result = await validator.validate(value, context);
        results.push(result);
        allErrors.push(...result.errors);
        allWarnings.push(...result.warnings);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        const validationError = this.createError(
          'COMPOSITE_VALIDATOR_ERROR',
          `Validator '${validator.name}' failed: ${errorMessage}`,
          context.path,
          ValidationSeverity.ERROR,
          ['Check validator configuration', 'Verify input data'],
          { validator: validator.name, error: errorMessage }
        );
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
  protected createSchema(): ValidationSchema {
    const childSchemas = this.validators.map(v => v.getSchema());
    const allTypes = new Set<string>();
    const allRequired = new Set<string>();
    const allOptional = new Set<string>();

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
export class FluentValidationBuilder<T> implements ValidationBuilder<T> {
  private readonly validators: IValidator<T>[] = [];
  private readonly rules: any[] = []; // ValidationRule<T>[] - avoiding circular dependency
  private config: Partial<ValidatorConfig> = {};
  private name: string;

  constructor(name: string) {
    this.name = name;
  }

  /**
   * Add a validator to the builder
   */
  addValidator(validator: IValidator<T>): ValidationBuilder<T> {
    this.validators.push(validator);
    return this;
  }

  /**
   * Add a rule to the builder
   */
  addRule(rule: any): ValidationBuilder<T> { // ValidationRule<T>
    this.rules.push(rule);
    return this;
  }

  /**
   * Set configuration for the validator
   */
  withConfig(config: Partial<ValidatorConfig>): ValidationBuilder<T> {
    this.config = { ...this.config, ...config };
    return this;
  }

  /**
   * Set validator name
   */
  withName(name: string): ValidationBuilder<T> {
    this.name = name;
    return this;
  }

  /**
   * Set validator priority
   */
  withPriority(priority: number): ValidationBuilder<T> {
    this.config.priority = priority;
    return this;
  }

  /**
   * Enable/disable caching
   */
  withCaching(enabled: boolean): ValidationBuilder<T> {
    this.config.cacheable = enabled;
    return this;
  }

  /**
   * Set validator timeout
   */
  withTimeout(timeout: number): ValidationBuilder<T> {
    this.config.timeout = timeout;
    return this;
  }

  /**
   * Build the composite validator
   */
  build(): IValidator<T> {
    if (this.validators.length === 0) {
      throw new CREBValidationError(
        'Cannot build validator without any validators',
        { name: this.name }
      );
    }

    if (this.validators.length === 1) {
      return this.validators[0];
    }

    return new CompositeValidator(this.name, this.validators, this.config) as IValidator<T>;
  }
}

// ============================================================================
// Specialized Validator Helpers
// ============================================================================

/**
 * Base class for chemistry-specific validators
 */
export abstract class ChemistryValidator<T> extends BaseValidator<T> {
  protected readonly elementSymbols = new Set([
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

  /**
   * Validate element symbol
   */
  protected isValidElement(symbol: string): boolean {
    return this.elementSymbols.has(symbol);
  }

  /**
   * Parse chemical formula into elements and counts
   */
  protected parseFormula(formula: string): Map<string, number> {
    const elements = new Map<string, number>();
    const regex = /([A-Z][a-z]?)(\d*)/g;
    let match;

    while ((match = regex.exec(formula)) !== null) {
      const element = match[1];
      const count = parseInt(match[2] || '1', 10);
      
      if (!this.isValidElement(element)) {
        throw new CREBValidationError(
          `Invalid element symbol: ${element}`,
          { element, formula }
        );
      }

      elements.set(element, (elements.get(element) || 0) + count);
    }

    return elements;
  }

  /**
   * Calculate molecular weight from formula
   */
  protected calculateMolecularWeight(elements: Map<string, number>): number {
    // Simplified atomic weights (should be imported from constants)
    const atomicWeights: Record<string, number> = {
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
        throw new CREBValidationError(
          `Atomic weight not available for element: ${element}`,
          { element }
        );
      }
      totalWeight += weight * count;
    }

    return totalWeight;
  }
}

/**
 * Async validator base class
 */
export abstract class AsyncValidator<T> extends BaseValidator<T> {
  protected readonly concurrencyLimit: number;
  private activeTasks = 0;

  constructor(
    name: string,
    config: Partial<ValidatorConfig> = {},
    dependencies: string[] = [],
    concurrencyLimit = 5
  ) {
    super(name, config, dependencies);
    this.concurrencyLimit = concurrencyLimit;
  }

  /**
   * Execute async validation with concurrency control
   */
  async validate(value: T, context: ValidationContext): Promise<ValidationResult> {
    await this.waitForSlot();
    this.activeTasks++;

    try {
      return await this.performAsyncValidation(value, context);
    } finally {
      this.activeTasks--;
    }
  }

  /**
   * Perform the actual async validation - must be implemented by subclasses
   */
  protected abstract performAsyncValidation(
    value: T,
    context: ValidationContext
  ): Promise<ValidationResult>;

  /**
   * Wait for an available slot
   */
  private async waitForSlot(): Promise<void> {
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
export function createValidator<T>(name: string): ValidationBuilder<T> {
  return new FluentValidationBuilder<T>(name);
}

/**
 * Create a composite validator
 */
export function createCompositeValidator(
  name: string,
  validators: IValidator[],
  config?: Partial<ValidatorConfig>
): ICompositeValidator {
  return new CompositeValidator(name, validators, config);
}

/**
 * Create a chemistry validator (helper for common chemistry validations)
 */
export function createChemistryValidator<T>(
  name: string,
  validationFn: (value: T, context: ValidationContext) => Promise<ValidationResult>,
  canValidateFn: (value: any) => value is T,
  config?: Partial<ValidatorConfig>
): IValidator<T> {
  return new (class extends ChemistryValidator<T> {
    canValidate = canValidateFn;
    validate = validationFn;
  })(name, config);
}
