/**
 * CREB Data Validation Module
 *
 * Provides comprehensive validation capabilities for chemistry data:
 * - Composable validator architecture
 * - Async validation support with dependency management
 * - Performance optimization with caching and parallelization
 * - Chemical-specific validation capabilities
 *
 * @version 1.0.0
 * @author CREB Team
 */
export * from './types';
export { ValidationPipeline } from './ValidationPipeline';
import { ValidationResult, ValidationError, ChemicalFormulaConfig, ThermodynamicProperties } from './types';
import { ValidationPipeline } from './ValidationPipeline';
export { BaseValidator, CompositeValidator, FluentValidationBuilder, ChemistryValidator, AsyncValidator, createValidator, createCompositeValidator, createChemistryValidator } from './validators/BaseValidator';
export { ChemicalFormulaValidator } from './validators/ChemicalFormulaValidator';
export { ThermodynamicPropertiesValidator } from './validators/ThermodynamicPropertiesValidator';
export { BaseRule, SyncRule, AsyncRule, CompositeRule, ConditionalRule, RangeRule, PatternRule, createRangeRule, createPatternRule, createAndRule, createOrRule, createConditionalRule } from './rules/BaseRule';
export { ChemicalFormulaFormatRule, ValidElementSymbolsRule, MolecularWeightConsistencyRule, GHSClassificationRule, FlashPointValidationRule, PhaseTransitionConsistencyRule, CASNumberValidationRule, createChemicalFormulaFormatRule, createValidElementSymbolsRule, createMolecularWeightConsistencyRule, createGHSClassificationRule, createFlashPointValidationRule, createPhaseTransitionConsistencyRule, createCASNumberValidationRule, getChemicalFormulaRules, getSafetyDataRules, getCompoundValidationRules } from './rules/ChemistryRules';
export { ValidationMetricsDashboard, createValidationDashboard, globalValidationDashboard, formatMetricsForConsole } from './metrics/ValidationMetricsDashboard';
/**
 * Creates a new validation pipeline with common defaults
 */
export declare function createValidationPipeline(): ValidationPipeline;
/**
 * Creates a performance-optimized validation pipeline
 */
export declare function createFastValidationPipeline(): ValidationPipeline;
/**
 * Creates a thorough validation pipeline for comprehensive checks
 */
export declare function createThoroughValidationPipeline(): ValidationPipeline;
/**
 * Quick validation for chemical formulas
 */
export declare function validateChemicalFormula(formula: string, config?: Partial<ChemicalFormulaConfig>): Promise<ValidationResult>;
/**
 * Quick validation for thermodynamic properties
 */
export declare function validateThermodynamicProperties(properties: ThermodynamicProperties): Promise<ValidationResult>;
/**
 * Formats validation errors for display
 */
export declare function formatValidationErrors(errors: ValidationError[]): string;
/**
 * Creates a summary of validation results
 */
export declare function summarizeValidationResult(result: ValidationResult): string;
/**
 * Utility to check if a validation result has only warnings
 */
export declare function hasOnlyWarnings(result: ValidationResult): boolean;
/**
 * Utility to get the most severe error from a validation result
 */
export declare function getMostSevereError(result: ValidationResult): ValidationError | null;
//# sourceMappingURL=index.d.ts.map