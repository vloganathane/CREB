/**
 * @fileoverview Chemical Formula Validator
 *
 * Validates chemical formulas with support for:
 * - Basic chemical formulas (H2O, C6H12O6)
 * - Isotope notation (13C, 2H)
 * - Charge notation (+, -, 2+, 3-)
 * - Complex notation ([Cu(NH3)4]2+)
 * - Radical notation (•)
 *
 * @version 1.0.0
 * @author CREB Team
 */
import { ValidationSeverity } from '../types';
import { ChemistryValidator } from './BaseValidator';
/**
 * Validator for chemical formulas
 */
export class ChemicalFormulaValidator extends ChemistryValidator {
    constructor(config = {}, formulaConfig = {}) {
        super('chemical-formula', config);
        this.formulaConfig = {
            allowIsotopes: true,
            allowRadicals: false,
            allowCharges: true,
            allowComplexes: true,
            maxAtoms: 1000,
            allowedElements: [], // Empty = all elements allowed
            ...formulaConfig
        };
    }
    /**
     * Check if validator can handle the given value
     */
    canValidate(value) {
        return typeof value === 'string' && value.trim().length > 0;
    }
    /**
     * Validate chemical formula
     */
    async validate(value, context) {
        const startTime = Date.now();
        const errors = [];
        const warnings = [];
        try {
            const formula = value.trim();
            // Basic format validation
            if (!this.hasValidFormat(formula)) {
                // Check for specific types of invalid format
                const invalidCharPattern = /[^A-Za-z0-9\(\)\[\]\+\-\s\•]/;
                const unicodePattern = /[₀-₉⁰-⁹]/;
                let errorMessage = `Invalid chemical formula format: ${formula}`;
                let suggestions = [
                    'Use standard chemical notation (e.g., H2O, CaCl2)',
                    'Ensure element symbols start with uppercase letter',
                    'Use numbers for atom counts, not letters'
                ];
                if (invalidCharPattern.test(formula)) {
                    errorMessage = `Formula contains invalid character(s): ${formula}`;
                    suggestions = [
                        'Remove special characters like !, @, #, $, %, etc.',
                        'Use only letters, numbers, parentheses, brackets, and +/- signs'
                    ];
                }
                else if (unicodePattern.test(formula)) {
                    errorMessage = `Formula contains invalid character(s) (Unicode subscripts/superscripts): ${formula}`;
                    suggestions = [
                        'Use regular numbers instead of subscript/superscript characters',
                        'Example: Use H2O instead of H₂O'
                    ];
                }
                errors.push(this.createError('INVALID_FORMULA_FORMAT', errorMessage, context.path, ValidationSeverity.ERROR, suggestions, { formula }, value));
            }
            else {
                // Detailed validation
                const validationResults = this.validateFormulaComponents(formula, context.path);
                errors.push(...validationResults.errors);
                warnings.push(...validationResults.warnings);
            }
            const duration = Date.now() - startTime;
            const isValid = errors.length === 0;
            return {
                isValid,
                errors,
                warnings,
                metrics: {
                    duration,
                    rulesExecuted: 1,
                    validatorsUsed: 1,
                    cacheStats: { hits: 0, misses: 1, hitRate: 0 }
                },
                timestamp: new Date()
            };
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            return this.createFailureResult([
                this.createError('FORMULA_VALIDATION_ERROR', `Formula validation failed: ${errorMessage}`, context.path, ValidationSeverity.ERROR, ['Check formula syntax', 'Verify element symbols'], { error: errorMessage }, value)
            ], context);
        }
    }
    /**
     * Basic format validation
     */
    hasValidFormat(formula) {
        // Check for invalid characters first
        const invalidCharPattern = /[^A-Za-z0-9\(\)\[\]\+\-\s\•]/;
        if (invalidCharPattern.test(formula)) {
            return false;
        }
        // Check for Unicode subscript/superscript characters
        const unicodePattern = /[₀-₉⁰-⁹]/;
        if (unicodePattern.test(formula)) {
            return false;
        }
        // Basic regex for chemical formula validation
        // Allows: Element symbols, numbers, brackets, charges, isotopes
        const basicPattern = /^[A-Z][a-z]?(\d*[A-Z][a-z]?\d*)*(\[.*\])?[+-]?\d*[+-]?$/;
        return basicPattern.test(formula.replace(/[\(\)\[\]]/g, ''));
    }
    /**
     * Detailed component validation
     */
    validateFormulaComponents(formula, path) {
        const errors = [];
        const warnings = [];
        try {
            // Handle complex formulas with brackets
            if (this.hasComplexNotation(formula)) {
                if (!this.formulaConfig.allowComplexes) {
                    errors.push(this.createError('COMPLEX_NOTATION_NOT_ALLOWED', 'Complex notation with brackets is not allowed', path, ValidationSeverity.ERROR, ['Use simple formula notation without brackets'], { formula }));
                    return { errors, warnings };
                }
                return this.validateComplexFormula(formula, path);
            }
            // Handle charged formulas
            if (this.hasChargeNotation(formula)) {
                if (!this.formulaConfig.allowCharges) {
                    errors.push(this.createError('CHARGE_NOTATION_NOT_ALLOWED', 'Charge notation is not allowed', path, ValidationSeverity.ERROR, ['Remove charge notation from formula'], { formula }));
                    return { errors, warnings };
                }
                return this.validateChargedFormula(formula, path);
            }
            // Validate simple formula
            return this.validateSimpleFormula(formula, path);
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            errors.push(this.createError('COMPONENT_VALIDATION_ERROR', `Component validation failed: ${errorMessage}`, path, ValidationSeverity.ERROR, ['Check formula structure'], { error: errorMessage }));
            return { errors, warnings };
        }
    }
    /**
     * Validate simple chemical formula
     */
    validateSimpleFormula(formula, path) {
        const errors = [];
        const warnings = [];
        // Extract elements and counts
        const elementPattern = /([A-Z][a-z]?)(\d*)/g;
        const elements = new Map();
        let totalAtoms = 0;
        let match;
        while ((match = elementPattern.exec(formula)) !== null) {
            const element = match[1];
            const count = parseInt(match[2] || '1', 10);
            // Validate element symbol
            if (!this.isValidElement(element)) {
                errors.push(this.createError('INVALID_ELEMENT', `Invalid element symbol: ${element}`, path, ValidationSeverity.ERROR, [
                    'Check periodic table for correct element symbols',
                    'Ensure proper capitalization (first letter uppercase, second lowercase)'
                ], { element, formula }));
            }
            // Check if element is allowed
            if (this.formulaConfig.allowedElements.length > 0 &&
                !this.formulaConfig.allowedElements.includes(element)) {
                errors.push(this.createError('ELEMENT_NOT_ALLOWED', `Element ${element} is not allowed`, path, ValidationSeverity.ERROR, [`Use only allowed elements: ${this.formulaConfig.allowedElements.join(', ')}`], { element, allowedElements: this.formulaConfig.allowedElements }));
            }
            // Check for isotope notation
            if (/^\d+[A-Z]/.test(element)) {
                if (!this.formulaConfig.allowIsotopes) {
                    errors.push(this.createError('ISOTOPE_NOTATION_NOT_ALLOWED', 'Isotope notation is not allowed', path, ValidationSeverity.ERROR, ['Remove isotope numbers from element symbols'], { element, formula }));
                }
            }
            elements.set(element, count);
            totalAtoms += count;
        }
        // Check maximum atoms limit
        if (totalAtoms > this.formulaConfig.maxAtoms) {
            errors.push(this.createError('TOO_MANY_ATOMS', `Formula contains ${totalAtoms} atoms, maximum allowed is ${this.formulaConfig.maxAtoms}`, path, ValidationSeverity.ERROR, ['Simplify the formula', 'Use smaller atom counts'], { totalAtoms, maxAtoms: this.formulaConfig.maxAtoms }));
        }
        // Warnings for unusual patterns
        if (totalAtoms > 100) {
            warnings.push(this.createError('LARGE_MOLECULE', `Formula contains ${totalAtoms} atoms, which is unusually large`, path, ValidationSeverity.WARNING, ['Verify the formula is correct', 'Consider if this represents a polymer unit'], { totalAtoms }));
        }
        return { errors, warnings };
    }
    /**
     * Validate charged formula
     */
    validateChargedFormula(formula, path) {
        const errors = [];
        const warnings = [];
        // Extract charge part
        const chargeMatch = formula.match(/([+-]\d*|\d*[+-])$/);
        if (!chargeMatch) {
            errors.push(this.createError('INVALID_CHARGE_FORMAT', 'Invalid charge notation format', path, ValidationSeverity.ERROR, ['Use format like +, -, 2+, 3- for charges'], { formula }));
            return { errors, warnings };
        }
        const charge = chargeMatch[1];
        const neutralFormula = formula.replace(chargeMatch[0], '');
        // Validate the neutral part
        const neutralResults = this.validateSimpleFormula(neutralFormula, path);
        errors.push(...neutralResults.errors);
        warnings.push(...neutralResults.warnings);
        // Validate charge format
        if (!/^[+-]\d*$|^\d*[+-]$/.test(charge)) {
            errors.push(this.createError('INVALID_CHARGE_VALUE', `Invalid charge value: ${charge}`, path, ValidationSeverity.ERROR, ['Use valid charge notation (e.g., +, -, 2+, 3-)'], { charge, formula }));
        }
        return { errors, warnings };
    }
    /**
     * Validate complex formula with brackets
     */
    validateComplexFormula(formula, path) {
        const errors = [];
        const warnings = [];
        // Check bracket balance
        if (!this.areBracketsBalanced(formula)) {
            errors.push(this.createError('UNBALANCED_BRACKETS', 'Unbalanced brackets in complex formula', path, ValidationSeverity.ERROR, ['Ensure all brackets are properly paired', 'Check for missing opening or closing brackets'], { formula }));
            return { errors, warnings };
        }
        // For complex formulas, we would need more sophisticated parsing
        // This is a simplified validation
        warnings.push(this.createError('COMPLEX_FORMULA_LIMITED_VALIDATION', 'Limited validation for complex formulas', path, ValidationSeverity.WARNING, ['Complex formulas receive basic validation only'], { formula }));
        return { errors, warnings };
    }
    /**
     * Check if formula has complex notation
     */
    hasComplexNotation(formula) {
        return /[\[\]]/.test(formula);
    }
    /**
     * Check if formula has charge notation
     */
    hasChargeNotation(formula) {
        return /[+-]\d*$|\d*[+-]$/.test(formula);
    }
    /**
     * Check if brackets are balanced
     */
    areBracketsBalanced(formula) {
        const stack = [];
        const pairs = { '[': ']', '(': ')' };
        for (const char of formula) {
            if (char in pairs) {
                stack.push(char);
            }
            else if (Object.values(pairs).includes(char)) {
                const last = stack.pop();
                if (!last || pairs[last] !== char) {
                    return false;
                }
            }
        }
        return stack.length === 0;
    }
    /**
     * Create validation schema
     */
    createSchema() {
        return {
            name: this.name,
            version: '1.0.0',
            description: 'Chemical formula validation schema',
            types: ['string'],
            requiredValidators: [],
            optionalValidators: [],
            properties: {
                config: this.formulaConfig,
                examples: ['H2O', 'CaCl2', 'C6H12O6', '[Cu(NH3)4]2+'],
                patterns: [
                    'Simple formulas: ElementCount (e.g., H2O)',
                    'Charged formulas: Formula+/- (e.g., Ca2+)',
                    'Complex formulas: [Formula]Charge (e.g., [Cu(NH3)4]2+)'
                ]
            }
        };
    }
}
//# sourceMappingURL=ChemicalFormulaValidator.js.map