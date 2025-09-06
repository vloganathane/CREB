/**
 * CREB Advanced Kinetics & Analytics Module
 * Entry point for reaction kinetics analysis, mechanism studies, and safety assessment
 */
export { ReactionKinetics } from './calculator';
export { MechanismAnalyzer, type MechanismStep, type MechanismAnalysis, type PathwayComparison } from './mechanismAnalyzer';
export { ReactionSafetyAnalyzer, type SafetyData, type ToxicityData, type ReactivityData, type ReactionSafetyAssessment, type ThermalHazard, type ChemicalHazard, type PhysicalHazard, type EnvironmentalHazard, type SafetyRecommendation } from './safetyAnalyzer';
export { type ReactionConditions, type ArrheniusData, type ReactionStep, type KineticsResult, type CatalystData, type TemperatureProfile, type KineticsDatabase, type ReactionClass, type RateLawType } from './types';
import { ReactionConditions } from './types';
/**
 * Comprehensive Kinetics Analysis Suite
 * Combines kinetics, mechanism, and safety analysis
 */
export declare class AdvancedKineticsAnalyzer {
    /**
     * Perform comprehensive analysis of a chemical reaction
     * Includes kinetics, mechanism analysis, and safety assessment
     */
    static analyzeReaction(equation: string, conditions: ReactionConditions, options?: {
        includeKinetics?: boolean;
        includeMechanism?: boolean;
        includeSafety?: boolean;
        mechanismSteps?: any[];
    }): Promise<any>;
    /**
     * Compare multiple reaction pathways
     */
    static compareReactionPathways(pathways: Array<{
        equation: string;
        conditions: ReactionConditions;
        mechanismSteps?: any[];
    }>): Promise<{
        pathways: any[];
        recommendation: {
            index: number;
            analysis: any;
            score: number;
        };
        comparison: string;
    }>;
    /**
     * Generate temperature-dependent kinetics profile
     */
    static generateTemperatureProfile(equation: string, temperatureRange: [number, number], baseConditions: ReactionConditions, points?: number): Promise<{
        equation: string;
        temperatureRange: [number, number];
        profile: {
            temperature: number;
            temperatureCelsius: number;
            rateConstant: number;
            halfLife: number | undefined;
            activationEnergy: number;
        }[];
        summary: {
            temperatureRangeCelsius: number[];
            rateConstantRange: number[];
            averageActivationEnergy: number;
        };
    }>;
    /**
     * Generate analysis summary
     */
    private static generateAnalysisSummary;
    /**
     * Calculate pathway score for comparison
     */
    private static calculatePathwayScore;
    /**
     * Generate pathway comparison summary
     */
    private static generatePathwayComparison;
}
//# sourceMappingURL=index.d.ts.map