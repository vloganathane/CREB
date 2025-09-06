/**
 * CREB Reaction Mechanism Analyzer
 * Analyzes complex reaction mechanisms and pathways
 */
import { ReactionConditions } from './types';
export interface MechanismStep {
    stepNumber: number;
    equation: string;
    type: 'elementary' | 'fast-equilibrium' | 'rate-determining' | 'pre-equilibrium';
    intermediates: string[];
    rateConstant: number;
    reverseRateConstant?: number;
    steadyStateSpecies?: string[];
}
export interface MechanismAnalysis {
    mechanism: MechanismStep[];
    overallReaction: string;
    rateExpression: string;
    rateDeterminingStep: number;
    intermediates: string[];
    catalysts: string[];
    approximations: string[];
    validity: {
        steadyState: boolean;
        preEquilibrium: boolean;
        rateApproximation: boolean;
    };
    confidence: number;
}
export interface PathwayComparison {
    pathway1: MechanismAnalysis;
    pathway2: MechanismAnalysis;
    preferredPathway: 1 | 2;
    reasons: string[];
    selectivityFactor: number;
}
export declare class MechanismAnalyzer {
    /**
     * Analyze a multi-step reaction mechanism
     */
    static analyzeMechanism(steps: MechanismStep[], conditions: ReactionConditions): MechanismAnalysis;
    /**
     * Compare two competing reaction pathways
     */
    static comparePathways(pathway1: MechanismStep[], pathway2: MechanismStep[], conditions: ReactionConditions): PathwayComparison;
    /**
     * Apply pre-equilibrium approximation
     */
    static applyPreEquilibriumApproximation(steps: MechanismStep[], equilibriumSteps: number[]): string;
    /**
     * Apply steady-state approximation
     */
    static applySteadyStateApproximation(steps: MechanismStep[], steadyStateSpecies: string[]): string;
    /**
     * Find species that appear as both products and reactants (intermediates)
     */
    private static findIntermediates;
    /**
     * Find species that appear on both sides but are not consumed (catalysts)
     */
    private static findCatalysts;
    /**
     * Identify the rate-determining step (slowest step)
     */
    private static findRateDeterminingStep;
    /**
     * Derive overall reaction from mechanism steps
     */
    private static deriveOverallReaction;
    /**
     * Derive rate expression using steady-state approximation
     */
    private static deriveSteadyStateRateExpression;
    /**
     * Check if mechanism has pre-equilibrium steps
     */
    private static hasPreEquilibrium;
    /**
     * Identify valid approximations for the mechanism
     */
    private static identifyValidApproximations;
    /**
     * Calculate overall reaction rate for pathway comparison
     */
    private static calculateOverallRate;
    /**
     * Generate reasons for pathway preference
     */
    private static generateComparisonReasons;
    /**
     * Calculate confidence in mechanism analysis
     */
    private static calculateMechanismConfidence;
}
//# sourceMappingURL=mechanismAnalyzer.d.ts.map