/**
 * @fileoverview Chemistry-specific validation rules
 *
 * Provides specialized validation rules for chemistry data:
 * - Chemical formula validation rules
 * - Molecular weight consistency rules
 * - Stoichiometry validation rules
 * - Chemical property correlation rules
 *
 * @version 1.0.0
 * @author CREB Team
 */
import { ValidationContext, RuleResult, ChemicalCompound } from '../types';
import { SyncRule, AsyncRule } from './BaseRule';
/**
 * Rule to validate basic chemical formula format
 */
export declare class ChemicalFormulaFormatRule extends SyncRule<string> {
    constructor();
    appliesTo(value: any): boolean;
    protected validateSync(value: string, context: ValidationContext): RuleResult;
}
/**
 * Rule to validate element symbols in formulas
 */
export declare class ValidElementSymbolsRule extends SyncRule<string> {
    private readonly validElements;
    constructor();
    appliesTo(value: any): boolean;
    protected validateSync(value: string, context: ValidationContext): RuleResult;
}
/**
 * Rule to validate molecular weight consistency
 */
export declare class MolecularWeightConsistencyRule extends SyncRule<ChemicalCompound> {
    private readonly atomicWeights;
    constructor();
    appliesTo(value: any): boolean;
    protected validateSync(value: ChemicalCompound, context: ValidationContext): RuleResult;
    private calculateMolecularWeight;
}
/**
 * Rule to validate GHS classification format
 */
export declare class GHSClassificationRule extends SyncRule<string[]> {
    private readonly validGHSCodes;
    constructor();
    appliesTo(value: any): boolean;
    protected validateSync(value: string[], context: ValidationContext): RuleResult;
}
/**
 * Rule to validate flash point reasonableness
 */
export declare class FlashPointValidationRule extends SyncRule<number> {
    constructor();
    appliesTo(value: any): boolean;
    protected validateSync(value: number, context: ValidationContext): RuleResult;
}
/**
 * Rule to validate boiling point vs melting point relationship
 */
export declare class PhaseTransitionConsistencyRule extends SyncRule<ChemicalCompound> {
    constructor();
    appliesTo(value: any): boolean;
    protected validateSync(value: ChemicalCompound, context: ValidationContext): RuleResult;
}
/**
 * Async rule to validate CAS number format and check registry
 */
export declare class CASNumberValidationRule extends AsyncRule<string> {
    constructor();
    appliesTo(value: any): boolean;
    protected validateAsync(value: string, context: ValidationContext): Promise<RuleResult>;
    private validateCASFormat;
    private validateCASChecksum;
}
/**
 * Create chemical formula format rule
 */
export declare function createChemicalFormulaFormatRule(): ChemicalFormulaFormatRule;
/**
 * Create valid element symbols rule
 */
export declare function createValidElementSymbolsRule(): ValidElementSymbolsRule;
/**
 * Create molecular weight consistency rule
 */
export declare function createMolecularWeightConsistencyRule(): MolecularWeightConsistencyRule;
/**
 * Create GHS classification rule
 */
export declare function createGHSClassificationRule(): GHSClassificationRule;
/**
 * Create flash point validation rule
 */
export declare function createFlashPointValidationRule(): FlashPointValidationRule;
/**
 * Create phase transition consistency rule
 */
export declare function createPhaseTransitionConsistencyRule(): PhaseTransitionConsistencyRule;
/**
 * Create CAS number validation rule
 */
export declare function createCASNumberValidationRule(): CASNumberValidationRule;
/**
 * Get standard chemical formula validation rules
 */
export declare function getChemicalFormulaRules(): (ChemicalFormulaFormatRule | ValidElementSymbolsRule)[];
/**
 * Get standard safety data validation rules
 */
export declare function getSafetyDataRules(): (GHSClassificationRule | FlashPointValidationRule)[];
/**
 * Get standard compound validation rules
 */
export declare function getCompoundValidationRules(): (MolecularWeightConsistencyRule | PhaseTransitionConsistencyRule | CASNumberValidationRule)[];
//# sourceMappingURL=ChemistryRules.d.ts.map