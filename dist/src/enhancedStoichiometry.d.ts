/**
 * Enhanced Stoichiometry calculator with PubChem integration
 * Provides accurate molecular weights, compound validation, and enriched calculations
 */
import { Stoichiometry } from './stoichiometry';
import { CompoundInfo } from './enhancedBalancer';
import { StoichiometryResult } from './types';
export interface EnhancedStoichiometryResult extends StoichiometryResult {
    compoundData?: Record<string, CompoundInfo>;
    pubchemMolarWeights?: Record<string, number>;
    validation?: {
        molecularWeightAccuracy: Record<string, {
            calculated: number;
            pubchem: number;
            difference: number;
            accuracy: string;
        }>;
        warnings: string[];
    };
}
export interface ReactionAnalysis {
    equation: string;
    balanced: boolean;
    molecularWeightValidation: {
        reactants: number;
        products: number;
        difference: number;
        isBalanced: boolean;
    };
    compoundInfo: Record<string, CompoundInfo>;
    suggestions?: Record<string, string[]>;
}
export declare class EnhancedStoichiometry extends Stoichiometry {
    private enhancedBalancer;
    private compoundDataCache;
    private initializedStoich?;
    constructor(equation?: string);
    /**
     * Initialize with compound validation and enrichment
     */
    initializeWithValidation(equation: string): Promise<ReactionAnalysis>;
    /**
     * Enhanced stoichiometric calculation with PubChem data
     */
    calculateFromMolesEnhanced(selectedSpecies: string, moles: number): Promise<EnhancedStoichiometryResult>;
    /**
     * Enhanced calculation from grams with PubChem data
     */
    calculateFromGramsEnhanced(selectedSpecies: string, grams: number): Promise<EnhancedStoichiometryResult>;
    /**
     * Get compound information with PubChem enrichment
     */
    getCompoundInfo(compoundName: string): Promise<CompoundInfo>;
    /**
     * Calculate molar weight with PubChem verification
     */
    calculateMolarWeightEnhanced(formula: string): Promise<{
        calculated: number;
        pubchem?: number;
        difference?: number;
        accuracy?: string;
        compoundInfo?: CompoundInfo;
    }>;
    /**
     * Compare two compounds using PubChem data
     */
    compareCompounds(compound1: string, compound2: string): Promise<{
        compound1: CompoundInfo;
        compound2: CompoundInfo;
        comparison: {
            molecularWeightRatio: number;
            formulasSimilar: boolean;
            sameCompound: boolean;
            differences: string[];
        };
    }>;
    /**
     * Calculate molecular weight validation for balanced equation
     */
    private calculateMolecularWeightValidation;
    /**
     * Clear cached compound data
     */
    clearCache(): void;
    /**
     * Get all cached compound data
     */
    getCachedCompounds(): Record<string, CompoundInfo>;
}
//# sourceMappingURL=enhancedStoichiometry.d.ts.map