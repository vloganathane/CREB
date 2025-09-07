/**
 * @fileoverview Type definitions for the CREB Validation Pipeline
 *
 * Provides comprehensive type definitions for:
 * - Validation results and errors
 * - Validator interfaces and compositions
 * - Rule definitions and dependencies
 * - Performance metrics and caching
 * - Chemical-specific validation types
 *
 * @version 1.0.0
 * @author CREB Team
 */
import { CREBError } from '../../core/errors/CREBError';
/**
 * Severity levels for validation errors
 */
export declare enum ValidationSeverity {
    INFO = "info",
    WARNING = "warning",
    ERROR = "error",
    CRITICAL = "critical"
}
/**
 * Validation error with context and suggested fixes
 */
export interface ValidationError {
    /** Error code for programmatic handling */
    code: string;
    /** Human-readable error message */
    message: string;
    /** Path to the invalid field/property */
    path: string[];
    /** Severity level of the error */
    severity: ValidationSeverity;
    /** Suggested fixes or corrections */
    suggestions: string[];
    /** Additional context data */
    context?: Record<string, any>;
    /** Original invalid value */
    value?: any;
}
/**
 * Result of a validation operation
 */
export interface ValidationResult {
    /** Whether validation passed */
    isValid: boolean;
    /** List of validation errors */
    errors: ValidationError[];
    /** Warnings that don't prevent validation */
    warnings: ValidationError[];
    /** Performance metrics */
    metrics: ValidationMetrics;
    /** Cached result indicator */
    fromCache?: boolean;
    /** Validation timestamp */
    timestamp: Date;
}
/**
 * Performance metrics for validation operations
 */
export interface ValidationMetrics {
    /** Total validation time in milliseconds */
    duration: number;
    /** Number of rules executed */
    rulesExecuted: number;
    /** Number of validators used */
    validatorsUsed: number;
    /** Cache hit/miss information */
    cacheStats: {
        hits: number;
        misses: number;
        hitRate: number;
    };
    /** Memory usage during validation */
    memoryUsage?: number;
}
/**
 * Configuration for a validator
 */
export interface ValidatorConfig {
    /** Whether validator is enabled */
    enabled: boolean;
    /** Priority for execution order */
    priority: number;
    /** Timeout in milliseconds */
    timeout?: number;
    /** Whether to cache results */
    cacheable: boolean;
    /** Custom configuration options */
    options?: Record<string, any>;
}
/**
 * Context passed to validators during execution
 */
export interface ValidationContext {
    /** Path to current property being validated */
    path: string[];
    /** Root object being validated */
    root: any;
    /** Parent object of current property */
    parent?: any;
    /** Validation configuration */
    config: ValidatorConfig;
    /** Shared context data */
    shared: Map<string, any>;
    /** Performance tracker */
    metrics: ValidationMetrics;
}
/**
 * Base validator interface
 */
export interface IValidator<T = any> {
    /** Unique validator identifier */
    readonly name: string;
    /** Validator configuration */
    readonly config: ValidatorConfig;
    /** Dependencies on other validators */
    readonly dependencies: string[];
    /**
     * Validate a value
     * @param value Value to validate
     * @param context Validation context
     * @returns Promise resolving to validation result
     */
    validate(value: T, context: ValidationContext): Promise<ValidationResult>;
    /**
     * Check if validator can handle the given value type
     * @param value Value to check
     * @returns Whether validator can validate this value
     */
    canValidate(value: any): value is T;
    /**
     * Get validation schema/metadata
     * @returns Schema information
     */
    getSchema(): ValidationSchema;
}
/**
 * Composite validator that combines multiple validators
 */
export interface ICompositeValidator extends IValidator {
    /** Child validators */
    readonly validators: IValidator[];
    /**
     * Add a validator to the composition
     * @param validator Validator to add
     */
    addValidator(validator: IValidator): void;
    /**
     * Remove a validator from the composition
     * @param name Name of validator to remove
     */
    removeValidator(name: string): void;
    /**
     * Get a specific validator by name
     * @param name Validator name
     */
    getValidator(name: string): IValidator | undefined;
}
/**
 * Validation rule definition
 */
export interface ValidationRule<T = any> {
    /** Unique rule identifier */
    name: string;
    /** Human-readable description */
    description: string;
    /** Rule dependencies */
    dependencies: string[];
    /** Rule priority (higher = earlier execution) */
    priority: number;
    /** Whether rule can be cached */
    cacheable: boolean;
    /**
     * Execute the validation rule
     * @param value Value to validate
     * @param context Validation context
     * @returns Promise resolving to rule result
     */
    execute(value: T, context: ValidationContext): Promise<RuleResult>;
    /**
     * Check if rule applies to the given value
     * @param value Value to check
     * @returns Whether rule should be executed
     */
    appliesTo(value: any): boolean;
}
/**
 * Result of executing a validation rule
 */
export interface RuleResult {
    /** Whether rule passed */
    passed: boolean;
    /** Error if rule failed */
    error?: ValidationError;
    /** Execution time in milliseconds */
    duration: number;
    /** Whether result was cached */
    cached: boolean;
    /** Additional metadata */
    metadata?: Record<string, any>;
}
/**
 * Rule dependency graph node
 */
export interface RuleDependencyNode {
    /** Rule name */
    name: string;
    /** Dependent rules */
    dependencies: string[];
    /** Rules that depend on this one */
    dependents: string[];
    /** Execution order */
    order: number;
}
/**
 * Chemical formula validation configuration
 */
export interface ChemicalFormulaConfig {
    /** Allow isotope notation (e.g., 13C) */
    allowIsotopes: boolean;
    /** Allow radical notation (e.g., •) */
    allowRadicals: boolean;
    /** Allow charge notation (e.g., +, -, 2+) */
    allowCharges: boolean;
    /** Allow complex notation (e.g., [Cu(NH3)4]2+) */
    allowComplexes: boolean;
    /** Maximum allowed atoms per formula */
    maxAtoms: number;
    /** Allowed elements (empty = all) */
    allowedElements: string[];
}
/**
 * Thermodynamic property validation configuration
 */
export interface ThermodynamicConfig {
    /** Temperature range in Kelvin */
    temperatureRange: {
        min: number;
        max: number;
    };
    /** Pressure range in Pa */
    pressureRange: {
        min: number;
        max: number;
    };
    /** Enthalpy range in kJ/mol */
    enthalpyRange: {
        min: number;
        max: number;
    };
    /** Entropy range in J/(mol·K) */
    entropyRange: {
        min: number;
        max: number;
    };
    /** Heat capacity range in J/(mol·K) */
    heatCapacityRange: {
        min: number;
        max: number;
    };
}
/**
 * Safety data validation configuration
 */
export interface SafetyDataConfig {
    /** Required safety properties */
    requiredProperties: string[];
    /** GHS classification validation */
    validateGHS: boolean;
    /** UN number validation */
    validateUN: boolean;
    /** Flash point validation */
    validateFlashPoint: boolean;
    /** Autoignition temperature validation */
    validateAutoignition: boolean;
}
/**
 * Chemical compound data for validation
 */
export interface ChemicalCompound {
    /** Chemical formula */
    formula: string;
    /** IUPAC name */
    name?: string;
    /** CAS registry number */
    cas?: string;
    /** SMILES notation */
    smiles?: string;
    /** InChI identifier */
    inchi?: string;
    /** Molecular weight in g/mol */
    molecularWeight?: number;
    /** Thermodynamic properties */
    thermodynamics?: ThermodynamicProperties;
    /** Safety data */
    safety?: SafetyData;
}
/**
 * Thermodynamic properties
 */
export interface ThermodynamicProperties {
    /** Standard enthalpy of formation (kJ/mol) */
    enthalpyFormation?: number;
    /** Standard entropy (J/(mol·K)) */
    entropy?: number;
    /** Heat capacity at constant pressure (J/(mol·K)) */
    heatCapacity?: number;
    /** Standard Gibbs free energy (kJ/mol) */
    gibbsEnergy?: number;
    /** Melting point (K) */
    meltingPoint?: number;
    /** Boiling point (K) */
    boilingPoint?: number;
    /** Density (g/cm³) */
    density?: number;
}
/**
 * Safety data
 */
export interface SafetyData {
    /** GHS hazard classifications */
    ghsClassifications?: string[];
    /** Hazard statements */
    hazardStatements?: string[];
    /** Precautionary statements */
    precautionaryStatements?: string[];
    /** UN number */
    unNumber?: string;
    /** Flash point (°C) */
    flashPoint?: number;
    /** Autoignition temperature (°C) */
    autoignitionTemperature?: number;
    /** Vapor pressure (Pa) */
    vaporPressure?: number;
    /** Water solubility (g/L) */
    waterSolubility?: number;
}
/**
 * Validation pipeline configuration
 */
export interface ValidationPipelineConfig {
    /** Maximum validation time in milliseconds */
    timeout: number;
    /** Whether to enable caching */
    enableCaching: boolean;
    /** Cache TTL in milliseconds */
    cacheTTL: number;
    /** Maximum cache size */
    maxCacheSize: number;
    /** Whether to continue on errors */
    continueOnError: boolean;
    /** Parallel execution settings */
    parallel: {
        enabled: boolean;
        maxConcurrency: number;
    };
    /** Performance monitoring settings */
    monitoring: {
        enabled: boolean;
        sampleRate: number;
    };
}
/**
 * Validation schema definition
 */
export interface ValidationSchema {
    /** Schema name */
    name: string;
    /** Schema version */
    version: string;
    /** Schema description */
    description: string;
    /** Supported data types */
    types: string[];
    /** Required validators */
    requiredValidators: string[];
    /** Optional validators */
    optionalValidators: string[];
    /** Custom properties */
    properties: Record<string, any>;
}
/**
 * Cache key for validation results
 */
export interface ValidationCacheKey {
    /** Validator name */
    validator: string;
    /** Value hash */
    valueHash: string;
    /** Config hash */
    configHash: string;
    /** Schema version */
    schemaVersion: string;
}
/**
 * Cached validation result
 */
export interface CachedValidationResult {
    /** Validation result */
    result: ValidationResult;
    /** Cache creation timestamp */
    createdAt: Date;
    /** Cache expiration timestamp */
    expiresAt: Date;
    /** Number of cache hits */
    hitCount: number;
}
/**
 * Validation pipeline events
 */
export interface ValidationEvents {
    'validation:started': {
        target: any;
        validators: string[];
    };
    'validation:completed': {
        result: ValidationResult;
    };
    'validation:error': {
        error: CREBError;
    };
    'validator:executed': {
        validator: string;
        result: ValidationResult;
    };
    'rule:executed': {
        rule: string;
        result: RuleResult;
    };
    'cache:hit': {
        key: ValidationCacheKey;
    };
    'cache:miss': {
        key: ValidationCacheKey;
    };
    'performance:threshold': {
        metric: string;
        value: number;
        threshold: number;
    };
}
/**
 * Validation builder for fluent API
 */
export interface ValidationBuilder<T> {
    /** Add a validator */
    addValidator(validator: IValidator<T>): ValidationBuilder<T>;
    /** Add a rule */
    addRule(rule: ValidationRule<T>): ValidationBuilder<T>;
    /** Set configuration */
    withConfig(config: Partial<ValidationPipelineConfig>): ValidationBuilder<T>;
    /** Build the validator */
    build(): IValidator<T>;
}
/**
 * Validator factory function type
 */
export type ValidatorFactory<T = any> = (config?: any) => IValidator<T>;
/**
 * Rule factory function type
 */
export type RuleFactory<T = any> = (config?: any) => ValidationRule<T>;
/**
 * Type guard for validation results
 */
export declare function isValidationResult(obj: any): obj is ValidationResult;
/**
 * Type guard for validation errors
 */
export declare function isValidationError(obj: any): obj is ValidationError;
/**
 * Type guard for validators
 */
export declare function isValidator(obj: any): obj is IValidator;
/**
 * Type guard for validation rules
 */
export declare function isValidationRule(obj: any): obj is ValidationRule;
//# sourceMappingURL=types.d.ts.map