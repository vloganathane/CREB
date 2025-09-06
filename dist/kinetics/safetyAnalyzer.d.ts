/**
 * CREB Reaction Safety Analyzer
 * Analyzes reaction safety and provides hazard assessments
 */
import { ReactionConditions, KineticsResult } from './types';
export interface SafetyData {
    compound: string;
    hazardClass: 'low' | 'moderate' | 'high' | 'extreme';
    flashPoint?: number;
    autoIgnitionTemp?: number;
    explosiveLimits?: [number, number];
    toxicity: ToxicityData;
    reactivity: ReactivityData;
    physicalHazards: string[];
    healthHazards: string[];
    environmentalHazards: string[];
}
export interface ToxicityData {
    ld50Oral?: number;
    ld50Dermal?: number;
    lc50Inhalation?: number;
    carcinogen: boolean;
    mutagen: boolean;
    teratogen: boolean;
    classification: 'non-toxic' | 'harmful' | 'toxic' | 'very-toxic';
}
export interface ReactivityData {
    incompatibilities: string[];
    hazardousDecomposition: string[];
    polymerization: 'stable' | 'may-occur' | 'hazardous';
    waterReactive: boolean;
    airSensitive: boolean;
    lightSensitive: boolean;
    shockSensitive: boolean;
}
export interface ReactionSafetyAssessment {
    equation: string;
    overallRiskLevel: 'low' | 'moderate' | 'high' | 'extreme';
    conditions: ReactionConditions;
    hazards: {
        thermal: ThermalHazard[];
        chemical: ChemicalHazard[];
        physical: PhysicalHazard[];
        environmental: EnvironmentalHazard[];
    };
    recommendations: SafetyRecommendation[];
    requiredPPE: string[];
    containmentLevel: 'standard' | 'enhanced' | 'specialized';
    monitoringParameters: string[];
    emergencyProcedures: string[];
    riskScore: number;
}
export interface ThermalHazard {
    type: 'exothermic' | 'endothermic' | 'runaway' | 'explosion';
    severity: 'low' | 'moderate' | 'high' | 'extreme';
    description: string;
    mitigationStrategies: string[];
}
export interface ChemicalHazard {
    type: 'toxic-gas' | 'corrosive' | 'incompatible' | 'unstable';
    compounds: string[];
    severity: 'low' | 'moderate' | 'high' | 'extreme';
    description: string;
    mitigationStrategies: string[];
}
export interface PhysicalHazard {
    type: 'pressure' | 'temperature' | 'mechanical' | 'electrical';
    severity: 'low' | 'moderate' | 'high' | 'extreme';
    description: string;
    mitigationStrategies: string[];
}
export interface EnvironmentalHazard {
    type: 'aquatic-toxic' | 'air-pollutant' | 'soil-contaminant' | 'persistent';
    compounds: string[];
    severity: 'low' | 'moderate' | 'high' | 'extreme';
    description: string;
    mitigationStrategies: string[];
}
export interface SafetyRecommendation {
    category: 'equipment' | 'procedure' | 'monitoring' | 'emergency';
    priority: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    implementation: string;
}
export declare class ReactionSafetyAnalyzer {
    private static readonly HAZARDOUS_COMPOUNDS;
    /**
     * Perform comprehensive safety assessment of a reaction
     */
    static assessReactionSafety(equation: string, conditions: ReactionConditions, kineticsData?: KineticsResult): ReactionSafetyAssessment;
    /**
     * Extract all chemical compounds from equation
     */
    private static extractCompoundsFromEquation;
    /**
     * Get safety data for a specific compound
     */
    private static getCompoundSafetyData;
    /**
     * Estimate safety data for unknown compounds
     */
    private static estimateCompoundSafety;
    /**
     * Assess thermal hazards
     */
    private static assessThermalHazards;
    /**
     * Assess chemical hazards
     */
    private static assessChemicalHazards;
    /**
     * Assess physical hazards
     */
    private static assessPhysicalHazards;
    /**
     * Assess environmental hazards
     */
    private static assessEnvironmentalHazards;
    /**
     * Calculate overall risk score
     */
    private static calculateRiskScore;
    /**
     * Determine overall risk level from score
     */
    private static determineRiskLevel;
    /**
     * Generate safety recommendations
     */
    private static generateSafetyRecommendations;
    /**
     * Determine required PPE
     */
    private static determineRequiredPPE;
    /**
     * Determine containment level
     */
    private static determineContainmentLevel;
    /**
     * Identify monitoring parameters
     */
    private static identifyMonitoringParameters;
    /**
     * Generate emergency procedures
     */
    private static generateEmergencyProcedures;
}
//# sourceMappingURL=safetyAnalyzer.d.ts.map