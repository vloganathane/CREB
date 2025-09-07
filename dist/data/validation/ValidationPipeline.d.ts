/**
 * @fileoverview ValidationPipeline - Core validation orchestration system
 *
 * The ValidationPipeline provides a comprehensive data validation framework with:
 * - Validator composition and dependency management
 * - Async validation support with timeout handling
 * - Rule dependency resolution and execution ordering
 * - Performance optimization with caching and parallelization
 * - Chemical-specific validation capabilities
 * - Extensible architecture for custom validators and rules
 *
 * @version 1.0.0
 * @author CREB Team
 */
import { EventEmitter } from 'events';
import { IValidator, ValidationResult, ValidationPipelineConfig, ValidationRule } from './types';
/**
 * Core validation pipeline for orchestrating complex validation workflows
 */
export declare class ValidationPipeline extends EventEmitter {
    private readonly validators;
    private readonly rules;
    private readonly dependencyGraph;
    private readonly cache;
    private readonly config;
    private readonly performanceMetrics;
    constructor(config?: Partial<ValidationPipelineConfig>);
    /**
     * Register a validator with the pipeline
     * @param validator Validator to register
     */
    addValidator(validator: IValidator): void;
    /**
     * Remove a validator from the pipeline
     * @param name Name of validator to remove
     */
    removeValidator(name: string): boolean;
    /**
     * Get a registered validator
     * @param name Validator name
     */
    getValidator(name: string): IValidator | undefined;
    /**
     * Get all registered validators
     */
    getValidators(): IValidator[];
    /**
     * Register a validation rule
     * @param rule Rule to register
     */
    addRule(rule: ValidationRule): void;
    /**
     * Remove a validation rule
     * @param name Name of rule to remove
     */
    removeRule(name: string): boolean;
    /**
     * Get a registered rule
     * @param name Rule name
     */
    getRule(name: string): ValidationRule | undefined;
    /**
     * Get all registered rules
     */
    getRules(): ValidationRule[];
    /**
     * Validate a value using all applicable validators and rules
     * @param value Value to validate
     * @param validatorNames Specific validators to use (optional)
     * @returns Promise resolving to validation result
     */
    validate<T = any>(value: T, validatorNames?: string[]): Promise<ValidationResult>;
    /**
     * Validate multiple values in parallel
     * @param values Values to validate
     * @param validatorNames Specific validators to use (optional)
     * @returns Promise resolving to array of validation results
     */
    validateBatch<T = any>(values: T[], validatorNames?: string[]): Promise<ValidationResult[]>;
    private getApplicableValidators;
    private executeValidators;
    private executeRules;
    private validateDependencies;
    private updateDependencyGraph;
    private recomputeDependencyOrder;
    private sortRulesByDependencies;
    private createCacheKey;
    private createRuleCacheKey;
    private getCachedResult;
    private getCachedRuleResult;
    private cacheResult;
    private cacheRuleResult;
    private createValidationContext;
    private combineResults;
    private createSuccessResult;
    private executeWithTimeout;
    private hashValue;
    private recordPerformanceMetrics;
    private setupErrorHandling;
    /**
     * Get pipeline statistics
     */
    getStats(): {
        validators: number;
        rules: number;
        cacheSize: number;
        cacheHitRate: number;
        avgDuration: number;
    };
    /**
     * Clear all caches
     */
    clearCache(): Promise<void>;
    /**
     * Get pipeline configuration
     */
    getConfig(): ValidationPipelineConfig;
    /**
     * Create a validation error
     */
    private createError;
    /**
     * Create a failed validation result
     */
    private createFailureResult;
}
//# sourceMappingURL=ValidationPipeline.d.ts.map