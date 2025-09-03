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
    safetyWarnings?: SafetyWarning[];
}
export interface SafetyWarning {
    compound: string;
    hazard: string;
    severity: 'low' | 'medium' | 'high' | 'extreme';
    ghsClassification?: string;
    precautionaryStatements?: string[];
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
    originalName?: string;
    safetyInfo?: SafetyInfo;
}
export interface SafetyInfo {
    ghsClassifications: string[];
    hazardStatements: string[];
    precautionaryStatements: string[];
    physicalHazards: string[];
    healthHazards: string[];
    environmentalHazards: string[];
    signalWord?: 'Danger' | 'Warning';
}
export declare class EnhancedChemicalEquationBalancer extends ChemicalEquationBalancer {
    private compoundCache;
    /**
     * Balance equation with safety and hazard information
     */
    balanceWithSafety(equation: string): Promise<EnhancedBalancedEquation>;
    /**
     * Get safety information for a compound
     */
    private getSafetyInfo;
    /**
     * Generate safety warnings from safety information
     */
    private generateSafetyWarnings;
    /**
     * Determine severity level from hazard description
     */
    private determineSeverity;
    /**
     * Knowledge base of known chemical safety information
     */
    private getKnownSafetyInfo;
    /**
     * Infer basic safety information from compound properties
     */
    private inferSafetyFromProperties;
    /**
     * Balance equation using common chemical names
     * Converts compound names to formulas using PubChem, then balances
     */
    balanceByName(commonNameEquation: string): Promise<EnhancedBalancedEquation>;
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
     * Parse equation with compound names to extract reactant and product names
     */
    private parseEquationNames;
    /**
     * Clean compound name by removing coefficients and standardizing format
     */
    private cleanCompoundName;
    /**
     * Reconstruct equation using chemical formulas instead of names
     */
    private reconstructEquationWithFormulas;
    /**
     * Get common names for simple chemical formulas or alternative names for compounds
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