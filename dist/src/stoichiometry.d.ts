import { StoichiometryResult } from './types';
/**
 * Stoichiometry calculator
 * Based on the Stoichiometry class from the original CREB project
 */
export declare class Stoichiometry {
    private equation?;
    private reactants;
    private products;
    private coefficients;
    private balancer;
    constructor(equation?: string);
    private initializeFromEquation;
    /**
     * Calculates the molar weight of a chemical formula
     */
    calculateMolarWeight(formula: string): number;
    /**
     * Calculates stoichiometric ratios relative to a selected species
     */
    calculateRatios(selectedSpecies: string): number[];
    /**
     * Performs stoichiometric calculations starting from moles
     */
    calculateFromMoles(selectedSpecies: string, moles: number): StoichiometryResult;
    /**
     * Performs stoichiometric calculations starting from grams
     */
    calculateFromGrams(selectedSpecies: string, grams: number): StoichiometryResult;
    /**
     * Gets the balanced equation
     */
    getBalancedEquation(): string;
    /**
     * Gets all species in the reaction with their molar weights
     */
    getSpeciesInfo(): {
        [species: string]: {
            molarWeight: number;
            type: 'reactant' | 'product';
        };
    };
    /**
     * Static method to calculate molar weight without instantiating the class
     */
    static calculateMolarWeight(formula: string): number;
}
//# sourceMappingURL=stoichiometry.d.ts.map