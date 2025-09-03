/**
 * Enhanced Chemical Equation Balancer with PubChem integration
 * Provides compound validation, molecular weight verification, and enriched data
 */
import { ChemicalEquationBalancer } from './balancer';
import { BalancedEquation } from './types';
interface PubChemCompound {
    cid: number;
    molecularWeight: number | null;
    molecularFormula: string | null;
    iupacName: string | null;
    isomericSmiles?: string | null;
}
export interface EnhancedBalancedEquation extends BalancedEquation {
    compoundData?: Record<string, CompoundInfo>;
    validation?: {
        massBalanced: boolean;
        chargeBalanced: boolean;
        warnings: string[];
    };
}
export interface CompoundInfo {
    name: string;
    cid?: number;
    molecularWeight?: number;
    molecularFormula?: string;
    iupacName?: string;
    canonicalSmiles?: string;
    isValid: boolean;
    error?: string;
    pubchemData?: PubChemCompound;
}
export declare class EnhancedChemicalEquationBalancer extends ChemicalEquationBalancer {
    private compoundCache;
    /**
     * Balance equation with PubChem data enrichment
     */
    balanceWithPubChemData(equation: string): Promise<EnhancedBalancedEquation>;
    /**
     * Get compound information from PubChem
     */
    getCompoundInfo(compoundName: string): Promise<CompoundInfo>;
    /**
     * Dynamically load PubChem module if available
     */
    private loadPubChemModule;
    /**
     * Get common names for simple chemical formulas
     */
    private getCommonNames;
    /**
     * Check if a string looks like a chemical formula
     */
    private isLikelyFormula;
    /**
     * Validate mass balance using PubChem molecular weights
     */
    private validateMassBalance;
    /**
     * Suggest alternative compound names or formulas
     */
    suggestAlternatives(compoundName: string): Promise<string[]>;
    /**
     * Clear the compound cache
     */
    clearCache(): void;
    /**
     * Get cached compound info without making new requests
     */
    getCachedCompoundInfo(compoundName: string): CompoundInfo | undefined;
}
export {};
//# sourceMappingURL=enhancedBalancer.d.ts.map