/**
 * Thermodynamics-Integrated Chemical Equation Balancer
 * Combines chemical equation balancing with comprehensive thermodynamic analysis
 *
 * @author Loganathane Virassamy
 * @version 1.4.0-alpha
 */
import { ThermodynamicsResult } from './types';
/**
 * Classification of chemical reactions based on thermodynamic properties
 */
export declare enum ReactionType {
    COMBUSTION = "combustion",
    SYNTHESIS = "synthesis",
    DECOMPOSITION = "decomposition",
    SINGLE_REPLACEMENT = "single_replacement",
    DOUBLE_REPLACEMENT = "double_replacement",
    ACID_BASE = "acid_base",
    REDOX = "redox",
    BIOLOGICAL = "biological",
    INDUSTRIAL = "industrial"
}
/**
 * Reaction feasibility assessment
 */
export declare enum ReactionFeasibility {
    HIGHLY_FAVORABLE = "highly_favorable",// ΔG° < -100 kJ/mol
    FAVORABLE = "favorable",// -100 < ΔG° < -20 kJ/mol  
    MARGINALLY_FAVORABLE = "marginally_favorable",// -20 < ΔG° < 0 kJ/mol
    EQUILIBRIUM = "equilibrium",// ΔG° ≈ 0 kJ/mol
    UNFAVORABLE = "unfavorable",// 0 < ΔG° < 20 kJ/mol
    HIGHLY_UNFAVORABLE = "highly_unfavorable"
}
/**
 * Safety classification based on energy release
 */
export declare enum SafetyLevel {
    SAFE = "safe",// |ΔH°| < 100 kJ/mol
    CAUTION = "caution",// 100 < |ΔH°| < 500 kJ/mol
    WARNING = "warning",// 500 < |ΔH°| < 1000 kJ/mol
    DANGER = "danger",// 1000 < |ΔH°| < 2000 kJ/mol
    EXTREME_DANGER = "extreme_danger"
}
/**
 * Comprehensive thermodynamic balancing result
 */
export interface ThermodynamicsBalanceResult {
    balanced: string;
    coefficients: Record<string, number>;
    thermodynamics: ThermodynamicsResult;
    reactionType: ReactionType;
    feasibility: ReactionFeasibility;
    safetyLevel: SafetyLevel;
    energyReleased?: number;
    energyRequired?: number;
    spontaneous: boolean;
    equilibriumConstant: number;
    optimalTemperature?: number;
    temperatureRange: {
        min: number;
        max: number;
    };
    pressureEffects: string;
    safetyWarnings: string[];
    recommendations: string[];
    industrialApplications: string[];
    reactionMechanism?: string;
    realWorldExamples: string[];
}
/**
 * Optimal reaction conditions
 */
export interface OptimalConditions {
    temperature: number;
    pressure: number;
    yield: number;
    reasoning: string[];
}
/**
 * Thermodynamics-Integrated Chemical Equation Balancer
 * Revolutionary chemistry tool combining balancing with energy analysis
 */
export declare class ThermodynamicsEquationBalancer {
    private balancer;
    private thermoCalculator;
    constructor();
    /**
     * Balance equation with comprehensive thermodynamic analysis
     */
    balanceWithThermodynamics(equation: string, temperature?: number, pressure?: number): Promise<ThermodynamicsBalanceResult>;
    /**
     * Find optimal reaction conditions for maximum yield
     */
    findOptimalConditions(equation: string): Promise<OptimalConditions>;
    /**
     * Classify reaction type based on equation pattern and thermodynamics
     */
    private classifyReaction;
    /**
     * Assess reaction feasibility based on Gibbs free energy
     */
    private assessFeasibility;
    /**
     * Assess safety level based on enthalpy change
     */
    private assessSafety;
    /**
     * Generate comprehensive analysis and recommendations
     */
    private generateAnalysis;
    /**
     * Calculate equilibrium constant from Gibbs free energy
     */
    private calculateEquilibriumConstant;
    /**
     * Parse chemical equation to reaction data format
     */
    private parseEquationToReactionData;
    /**
     * Extract coefficients from balanced equation
     */
    private extractCoefficients;
    /**
     * Analyze pressure effects on reaction
     */
    private analyzePressureEffects;
    /**
     * Estimate yield from equilibrium constant
     */
    private estimateYieldFromK;
    /**
     * Get optimal pressure based on reaction stoichiometry
     */
    private getOptimalPressure;
    /**
     * Generate optimization reasoning
     */
    private generateOptimizationReasoning;
}
//# sourceMappingURL=thermodynamicsBalancer.d.ts.map