/**
 * Browser-compatible chemical formula validation
 * Simplified version that doesn't depend on ValidationPipeline or events
 */
/**
 * Basic validation result interface
 */
export interface SimpleValidationResult {
    isValid: boolean;
    errors: string[];
    warnings: string[];
}
/**
 * Simple chemical formula validator for browser use
 */
export declare function validateChemicalFormula(formula: string): SimpleValidationResult;
/**
 * ValidationResult type alias for compatibility
 */
export type ValidationResult = SimpleValidationResult;
//# sourceMappingURL=browserValidation.d.ts.map