/**
 * CREB Kinetics Types
 * Type definitions for reaction kinetics calculations
 */
export interface ReactionConditions {
    temperature: number;
    pressure?: number;
    concentration: Record<string, number>;
    catalysts?: string[];
    solvent?: string;
}
export interface ArrheniusData {
    preExponentialFactor: number;
    activationEnergy: number;
    temperatureRange: [number, number];
    rSquared?: number;
}
export interface ReactionStep {
    equation: string;
    type: 'elementary' | 'fast-equilibrium' | 'rate-determining';
    rateConstant: number;
    order: Record<string, number>;
    mechanism: string;
}
export interface KineticsResult {
    equation: string;
    rateConstant: number;
    activationEnergy: number;
    reactionOrder: number;
    mechanism: ReactionStep[];
    temperatureDependence: ArrheniusData;
    rateLaw: string;
    conditions: ReactionConditions;
    halfLife?: number;
    catalystEffect?: CatalystData;
    confidence: number;
    dataSource: 'experimental' | 'estimated' | 'literature';
}
export interface CatalystData {
    catalyst: string;
    effectOnRate: number;
    effectOnActivationEnergy: number;
    mechanism: string;
    efficiency: number;
}
export interface TemperatureProfile {
    temperature: number;
    rateConstant: number;
    reactionRate: number;
    equilibriumConstant?: number;
}
export interface KineticsDatabase {
    equation: string;
    arrheniusParameters: ArrheniusData;
    mechanism: ReactionStep[];
    experimentalConditions: ReactionConditions[];
    literature: {
        doi?: string;
        title?: string;
        authors?: string[];
        year?: number;
    };
}
export type ReactionClass = 'unimolecular' | 'bimolecular' | 'termolecular' | 'enzyme-catalyzed' | 'autocatalytic' | 'chain-reaction' | 'oscillating' | 'complex';
export type RateLawType = 'elementary' | 'michaelis-menten' | 'langmuir' | 'power-law' | 'complex';
//# sourceMappingURL=types.d.ts.map