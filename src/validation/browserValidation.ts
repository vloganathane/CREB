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
export function validateChemicalFormula(formula: string): SimpleValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Basic validation rules
  if (!formula || typeof formula !== 'string') {
    errors.push('Formula must be a non-empty string');
    return { isValid: false, errors, warnings };
  }
  
  if (formula.trim().length === 0) {
    errors.push('Formula cannot be empty');
    return { isValid: false, errors, warnings };
  }
  
  // Check for valid chemical formula pattern
  const formulaPattern = /^[A-Z][a-z]?(\d+)?(\([A-Z][a-z]?(\d+)?\)\d*)*$/;
  if (!formulaPattern.test(formula.replace(/\s+/g, ''))) {
    // More lenient check for complex formulas
    const basicElementPattern = /^[A-Z][a-z]?\d*$/;
    const complexPattern = /^([A-Z][a-z]?\d*)+(\([A-Z][a-z]?\d*\)\d*)*$/;
    const cleanFormula = formula.replace(/\s+/g, '');
    
    if (!basicElementPattern.test(cleanFormula) && !complexPattern.test(cleanFormula)) {
      warnings.push('Formula may not follow standard chemical notation');
    }
  }
  
  // Check for common issues
  if (formula.includes('..')) {
    errors.push('Formula contains invalid character sequence (..)');
  }
  
  if (formula.match(/\d{4,}/)) {
    warnings.push('Formula contains unusually large numbers');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * ValidationResult type alias for compatibility
 */
export type ValidationResult = SimpleValidationResult;
