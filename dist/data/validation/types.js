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
// ============================================================================
// Core Validation Types
// ============================================================================
/**
 * Severity levels for validation errors
 */
export var ValidationSeverity;
(function (ValidationSeverity) {
    ValidationSeverity["INFO"] = "info";
    ValidationSeverity["WARNING"] = "warning";
    ValidationSeverity["ERROR"] = "error";
    ValidationSeverity["CRITICAL"] = "critical";
})(ValidationSeverity || (ValidationSeverity = {}));
// ============================================================================
// Type Guards
// ============================================================================
/**
 * Type guard for validation results
 */
export function isValidationResult(obj) {
    return obj &&
        typeof obj.isValid === 'boolean' &&
        Array.isArray(obj.errors) &&
        Array.isArray(obj.warnings) &&
        obj.metrics &&
        obj.timestamp instanceof Date;
}
/**
 * Type guard for validation errors
 */
export function isValidationError(obj) {
    return obj &&
        typeof obj.code === 'string' &&
        typeof obj.message === 'string' &&
        Array.isArray(obj.path) &&
        Object.values(ValidationSeverity).includes(obj.severity) &&
        Array.isArray(obj.suggestions);
}
/**
 * Type guard for validators
 */
export function isValidator(obj) {
    return obj &&
        typeof obj.name === 'string' &&
        obj.config &&
        Array.isArray(obj.dependencies) &&
        typeof obj.validate === 'function' &&
        typeof obj.canValidate === 'function' &&
        typeof obj.getSchema === 'function';
}
/**
 * Type guard for validation rules
 */
export function isValidationRule(obj) {
    return obj &&
        typeof obj.name === 'string' &&
        typeof obj.description === 'string' &&
        Array.isArray(obj.dependencies) &&
        typeof obj.priority === 'number' &&
        typeof obj.execute === 'function' &&
        typeof obj.appliesTo === 'function';
}
//# sourceMappingURL=types.js.map