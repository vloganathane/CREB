/**
 * Enhanced Data Integration Module for CREB-JS
 * Provides comprehensive data management and integration capabilities
 */
// Core data management
export { ChemicalDatabaseManager } from './ChemicalDatabaseManager';
export { NISTWebBookIntegration } from './NISTIntegration';
export { DataValidationService } from './DataValidationService';
// Advanced Validation Pipeline (VP-001)
export { ValidationPipeline, createValidationPipeline, createFastValidationPipeline, createThoroughValidationPipeline, validateChemicalFormula, validateThermodynamicProperties, ChemicalFormulaValidator, ThermodynamicPropertiesValidator, FluentValidationBuilder, createValidator, createCompositeValidator, createChemistryValidator } from './validation';
// SQLite storage provider (optional)
export { SQLiteStorageProvider } from './SQLiteStorageProvider';
//# sourceMappingURL=index.js.map