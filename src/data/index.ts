/**
 * Enhanced Data Integration Module for CREB-JS
 * Provides comprehensive data management and integration capabilities
 */

// Core data management
export { ChemicalDatabaseManager } from './ChemicalDatabaseManager';
export { NISTWebBookIntegration } from './NISTIntegration';
export { DataValidationService } from './DataValidationService';

// Advanced Validation Pipeline (VP-001)
export {
  ValidationPipeline,
  createValidationPipeline,
  createFastValidationPipeline,
  createThoroughValidationPipeline,
  validateChemicalFormula,
  validateThermodynamicProperties,
  ChemicalFormulaValidator,
  ThermodynamicPropertiesValidator,
  FluentValidationBuilder,
  createValidator,
  createCompositeValidator,
  createChemistryValidator
} from './validation';

// Export all validation types
export type {
  IValidator,
  ICompositeValidator,
  ValidationRule,
  ValidationContext,
  ValidationPipelineConfig,
  ValidationMetrics,
  ValidationEvents,
  RuleResult,
  ValidationSeverity
} from './validation';

// SQLite storage provider (optional)
export { SQLiteStorageProvider } from './SQLiteStorageProvider';
export type { SQLiteConfig, SQLiteQuery } from './SQLiteStorageProvider';

// Type definitions from types.ts
export type {
  CompoundDatabase,
  ExtendedThermodynamicProperties,
  PhysicalProperties,
  SafetyProperties,
  DatabaseSource,
  DatabaseQuery,
  DataImportResult,
  DataExportOptions,
  DataValidationRule,
  DatabaseProvider
} from './types';

// Validation types from DataValidationService.ts
export type {
  ValidationResult,
  ValidationError,
  ValidationWarning,
  ValidationConfig
} from './DataValidationService';
