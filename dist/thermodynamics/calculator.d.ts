/**
 * Core thermodynamics calculator for CREB-JS
 * Implements standard thermodynamic calculations for chemical reactions
 */
import { ThermodynamicsResult, ReactionConditions } from './types';
import { BalancedEquation } from '../types';
export declare class ThermodynamicsCalculator {
    private readonly R;
    private readonly standardTemperature;
    private readonly standardPressure;
    /**
     * Calculate thermodynamic properties for a balanced chemical equation
     */
    calculateThermodynamics(equation: BalancedEquation, conditions?: ReactionConditions): Promise<ThermodynamicsResult>;
    /**
     * Calculate enthalpy change (ΔH) for the reaction
     * ΔH = Σ(coefficients × ΔHf products) - Σ(coefficients × ΔHf reactants)
     */
    private calculateEnthalpyChange;
    /**
     * Calculate entropy change (ΔS) for the reaction
     * ΔS = Σ(coefficients × S products) - Σ(coefficients × S reactants)
     */
    private calculateEntropyChange;
    /**
     * Calculate Gibbs free energy change (ΔG)
     * ΔG = ΔH - T×ΔS
     */
    private calculateGibbsChange;
    /**
     * Calculate equilibrium constant from Gibbs free energy
     * K = exp(-ΔG / RT)
     */
    private calculateEquilibriumConstant;
    /**
     * Determine reaction spontaneity based on Gibbs free energy
     */
    private determineSpontaneity;
    /**
     * Generate temperature dependence profile
     */
    private generateTemperatureProfile;
    /**
     * Get thermodynamic data for compounds in the equation
     * This would integrate with PubChem and NIST databases
     */
    private getCompoundThermodynamicData;
    /**
     * Fetch thermodynamic properties from external databases
     * TODO: Implement PubChem/NIST integration
     */
    private fetchThermodynamicProperties;
    /**
     * Estimate thermodynamic properties using group contribution methods
     * TODO: Implement Joback and Reid group contribution method
     */
    private estimateThermodynamicProperties;
    /**
     * Calculate thermodynamics for reaction data format (used by integrated balancer)
     */
    calculateReactionThermodynamics(reactionData: import('./types').ReactionData, temperature?: number): Promise<ThermodynamicsResult>;
}
//# sourceMappingURL=calculator.d.ts.map