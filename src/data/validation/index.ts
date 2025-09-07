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

// Core Pipeline and Types
export * from './types';
export { ValidationPipeline } from './ValidationPipeline';

// Import types for use in factory functions
import { 
  ValidationResult,
  ValidationError,
  ValidationContext,
  ChemicalFormulaConfig,
  ThermodynamicProperties,
  ValidationSeverity
} from './types';
import { ValidationPipeline } from './ValidationPipeline';
import { ChemicalFormulaValidator } from './validators/ChemicalFormulaValidator';
import { ThermodynamicPropertiesValidator } from './validators/ThermodynamicPropertiesValidator';

// Validators
export { 
  BaseValidator,
  CompositeValidator,
  FluentValidationBuilder,
  ChemistryValidator,
  AsyncValidator,
  createValidator,
  createCompositeValidator,
  createChemistryValidator
} from './validators/BaseValidator';

export { ChemicalFormulaValidator } from './validators/ChemicalFormulaValidator';
export { ThermodynamicPropertiesValidator } from './validators/ThermodynamicPropertiesValidator';

// Rules
export {
  BaseRule,
  SyncRule,
  AsyncRule,
  CompositeRule,
  ConditionalRule,
  RangeRule,
  PatternRule,
  createRangeRule,
  createPatternRule,
  createAndRule,
  createOrRule,
  createConditionalRule
} from './rules/BaseRule';

export {
  ChemicalFormulaFormatRule,
  ValidElementSymbolsRule,
  MolecularWeightConsistencyRule,
  GHSClassificationRule,
  FlashPointValidationRule,
  PhaseTransitionConsistencyRule,
  CASNumberValidationRule,
  createChemicalFormulaFormatRule,
  createValidElementSymbolsRule,
  createMolecularWeightConsistencyRule,
  createGHSClassificationRule,
  createFlashPointValidationRule,
  createPhaseTransitionConsistencyRule,
  createCASNumberValidationRule,
  getChemicalFormulaRules,
  getSafetyDataRules,
  getCompoundValidationRules
} from './rules/ChemistryRules';

// Metrics and Dashboard
export {
  ValidationMetricsDashboard,
  createValidationDashboard,
  globalValidationDashboard,
  formatMetricsForConsole
} from './metrics/ValidationMetricsDashboard';

/**
 * Creates a new validation pipeline with common defaults
 */
export function createValidationPipeline(): ValidationPipeline {
  return new ValidationPipeline({
    timeout: 30000,
    enableCaching: true,
    cacheTTL: 300000,
    maxCacheSize: 1000,
    continueOnError: true,
    parallel: {
      enabled: true,
      maxConcurrency: 10
    },
    monitoring: {
      enabled: true,
      sampleRate: 1.0
    }
  });
}

/**
 * Creates a performance-optimized validation pipeline
 */
export function createFastValidationPipeline(): ValidationPipeline {
  return new ValidationPipeline({
    timeout: 10000,
    enableCaching: true,
    cacheTTL: 600000,
    maxCacheSize: 5000,
    continueOnError: false,
    parallel: {
      enabled: true,
      maxConcurrency: 20
    },
    monitoring: {
      enabled: true,
      sampleRate: 0.1
    }
  });
}

/**
 * Creates a thorough validation pipeline for comprehensive checks
 */
export function createThoroughValidationPipeline(): ValidationPipeline {
  return new ValidationPipeline({
    timeout: 120000,
    enableCaching: false,
    cacheTTL: 0,
    maxCacheSize: 0,
    continueOnError: true,
    parallel: {
      enabled: false,
      maxConcurrency: 1
    },
    monitoring: {
      enabled: true,
      sampleRate: 1.0
    }
  });
}

/**
 * Quick validation for chemical formulas
 */
export async function validateChemicalFormula(
  formula: string,
  config?: Partial<ChemicalFormulaConfig>
): Promise<ValidationResult> {
  const validator = new ChemicalFormulaValidator(undefined, config);
  const context: ValidationContext = {
    path: ['formula'],
    root: { formula },
    config: {
      enabled: true,
      priority: 1,
      cacheable: true
    },
    shared: new Map(),
    metrics: {
      duration: 0,
      rulesExecuted: 0,
      validatorsUsed: 1,
      cacheStats: {
        hits: 0,
        misses: 0,
        hitRate: 0
      }
    }
  };
  
  return validator.validate(formula, context);
}

/**
 * Quick validation for thermodynamic properties
 */
export async function validateThermodynamicProperties(
  properties: ThermodynamicProperties
): Promise<ValidationResult> {
  const validator = new ThermodynamicPropertiesValidator();
  const context: ValidationContext = {
    path: ['thermodynamics'],
    root: properties,
    config: {
      enabled: true,
      priority: 1,
      cacheable: true
    },
    shared: new Map(),
    metrics: {
      duration: 0,
      rulesExecuted: 0,
      validatorsUsed: 1,
      cacheStats: {
        hits: 0,
        misses: 0,
        hitRate: 0
      }
    }
  };
  
  return validator.validate(properties, context);
}

/**
 * Formats validation errors for display
 */
export function formatValidationErrors(errors: ValidationError[]): string {
  if (errors.length === 0) {
    return 'No validation errors found.';
  }
  
  return errors.map((error, index) => {
    const prefix = `${index + 1}. `;
    const location = error.path ? ` (at ${error.path.join('.')})` : '';
    const code = error.code ? ` [${error.code}]` : '';
    const suggestions = error.suggestions.length > 0 ? `\n   Suggestions: ${error.suggestions.join(', ')}` : '';
    
    return `${prefix}${error.severity.toUpperCase()}: ${error.message}${location}${code}${suggestions}`;
  }).join('\n');
}

/**
 * Creates a summary of validation results
 */
export function summarizeValidationResult(result: ValidationResult): string {
  const { isValid, errors, warnings } = result;
  
  const status = isValid ? 'PASSED' : 'FAILED';
  const errorCount = errors.length;
  const warningCount = warnings.length;
  
  let summary = `Validation ${status}\n`;
  
  if (errorCount > 0) {
    summary += `Errors: ${errorCount}\n`;
  }
  
  if (warningCount > 0) {
    summary += `Warnings: ${warningCount}\n`;
  }
  
  if (errorCount === 0 && warningCount === 0) {
    summary += 'No issues found.';
  }
  
  return summary;
}

/**
 * Utility to check if a validation result has only warnings
 */
export function hasOnlyWarnings(result: ValidationResult): boolean {
  return result.errors.length === 0 && result.warnings.length > 0;
}

/**
 * Utility to get the most severe error from a validation result
 */
export function getMostSevereError(result: ValidationResult): ValidationError | null {
  if (result.errors.length === 0) {
    return null;
  }
  
  const errorsByPriority = result.errors.sort((a, b) => {
    const priorities = { 
      [ValidationSeverity.CRITICAL]: 4,
      [ValidationSeverity.ERROR]: 3, 
      [ValidationSeverity.WARNING]: 2, 
      [ValidationSeverity.INFO]: 1 
    };
    return priorities[b.severity] - priorities[a.severity];
  });
  
  return errorsByPriority[0];
}
