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
import { ValidationResult, ValidationContext, ValidatorConfig, ValidationSchema, ChemicalFormulaConfig } from '../types';
import { ChemistryValidator } from './BaseValidator';
/**
 * Validator for chemical formulas
 */
export declare class ChemicalFormulaValidator extends ChemistryValidator<string> {
    private readonly formulaConfig;
    constructor(config?: Partial<ValidatorConfig>, formulaConfig?: Partial<ChemicalFormulaConfig>);
    /**
     * Check if validator can handle the given value
     */
    canValidate(value: any): value is string;
    /**
     * Validate chemical formula
     */
    validate(value: string, context: ValidationContext): Promise<ValidationResult>;
    /**
     * Basic format validation
     */
    private hasValidFormat;
    /**
     * Detailed component validation
     */
    private validateFormulaComponents;
    /**
     * Validate simple chemical formula
     */
    private validateSimpleFormula;
    /**
     * Validate charged formula
     */
    private validateChargedFormula;
    /**
     * Validate complex formula with brackets
     */
    private validateComplexFormula;
    /**
     * Check if formula has complex notation
     */
    private hasComplexNotation;
    /**
     * Check if formula has charge notation
     */
    private hasChargeNotation;
    /**
     * Check if brackets are balanced
     */
    private areBracketsBalanced;
    /**
     * Create validation schema
     */
    protected createSchema(): ValidationSchema;
}
//# sourceMappingURL=ChemicalFormulaValidator.d.ts.map