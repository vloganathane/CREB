/**
 * Energy Profile Generator
 * Creates visualization-ready energy profile data for chemical reactions
 * Part of CREB-JS v1.6.0 - Energy Profile Visualization Feature
 */
import { EnergyProfile, TransitionState, ReactionCoordinate, BondChange, ThermodynamicsResult } from './types';
import { KineticsResult, ReactionStep } from '../kinetics/types';
export declare class EnergyProfileGenerator {
    private temperature;
    private pressure;
    /**
     * Generate energy profile from thermodynamics and kinetics data
     */
    generateProfile(thermodynamics: ThermodynamicsResult, kinetics?: KineticsResult, customSteps?: TransitionState[]): EnergyProfile;
    /**
     * Generate energy profile for multi-step mechanism
     */
    generateMechanismProfile(mechanism: ReactionStep[], overallThermodynamics: ThermodynamicsResult): EnergyProfile;
    /**
     * Generate temperature-dependent energy profiles
     */
    generateTemperatureProfiles(thermodynamics: ThermodynamicsResult, temperatures: number[], kinetics?: KineticsResult): Array<{
        temperature: number;
        profile: EnergyProfile;
    }>;
    /**
     * Generate reaction coordinate data
     */
    generateReactionCoordinate(reactionType: 'SN1' | 'SN2' | 'E1' | 'E2' | 'addition' | 'elimination' | 'substitution'): ReactionCoordinate;
    /**
     * Export profile data for visualization libraries
     */
    exportForVisualization(profile: EnergyProfile, format: 'plotly' | 'chartjs' | 'd3' | 'csv'): any;
    private addMechanismSteps;
    private addCustomSteps;
    private addSimpleTransitionState;
    private estimateActivationEnergy;
    private estimateStepActivationEnergy;
    private findRateDeterminingStep;
    private extractReactants;
    private extractProducts;
    private extractSpeciesFromEquation;
    private adjustThermodynamicsForTemperature;
    private adjustKineticsForTemperature;
    private exportForPlotly;
    private exportForChartJS;
    private exportForD3;
    private exportForCSV;
    /**
     * Set calculation conditions
     */
    setConditions(temperature: number, pressure: number): void;
    /**
     * Generate energy profile with bond-by-bond analysis
     */
    generateDetailedProfile(thermodynamics: ThermodynamicsResult, bondChanges: BondChange[]): EnergyProfile & {
        bondAnalysis: BondChange[];
    };
}
/**
 * Convenience function to create energy profile
 */
export declare function createEnergyProfile(thermodynamics: ThermodynamicsResult, kinetics?: KineticsResult, options?: {
    temperature?: number;
    pressure?: number;
}): EnergyProfile;
/**
 * Export energy profile for popular visualization libraries
 */
export declare function exportEnergyProfile(profile: EnergyProfile, format: 'plotly' | 'chartjs' | 'd3' | 'csv'): any;
//# sourceMappingURL=energyProfile.d.ts.map