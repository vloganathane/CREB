/**
 * Thermodynamics calculation types and interfaces
 * Part of CREB-JS v1.3.0 development
 */
export interface ThermodynamicProperties {
    /** Standard enthalpy of formation (kJ/mol) */
    deltaHf: number;
    /** Standard entropy (J/(mol·K)) */
    entropy: number;
    /** Heat capacity at constant pressure (J/(mol·K)) */
    heatCapacity: number;
    /** Temperature range where properties are valid (K) */
    temperatureRange: [number, number];
}
export interface ReactionConditions {
    /** Temperature in Kelvin */
    temperature: number;
    /** Pressure in Pa */
    pressure: number;
    /** Phase of each compound */
    phases?: ('solid' | 'liquid' | 'gas' | 'aqueous')[];
}
export interface ThermodynamicsResult {
    /** Change in enthalpy (kJ/mol) */
    deltaH: number;
    /** Change in entropy (J/(mol·K)) */
    deltaS: number;
    /** Change in Gibbs free energy (kJ/mol) */
    deltaG: number;
    /** Equilibrium constant */
    equilibriumConstant: number;
    /** Reaction spontaneity */
    spontaneity: 'spontaneous' | 'non-spontaneous' | 'equilibrium';
    /** Temperature dependence profile */
    temperatureDependence: TemperatureProfile;
    /** Calculation conditions */
    conditions: ReactionConditions;
    /** Standard enthalpy change (alias for deltaH) */
    enthalpy: number;
    /** Gibbs free energy change (alias for deltaG) */
    gibbsFreeEnergy: number;
    /** Whether reaction is spontaneous */
    isSpontaneous: boolean;
}
export interface TemperatureProfile {
    /** Temperature range analyzed (K) */
    range: [number, number];
    /** Delta G values at different temperatures */
    deltaGvsT: Array<{
        temperature: number;
        deltaG: number;
    }>;
    /** Temperature where reaction becomes spontaneous (K) */
    spontaneityThreshold?: number;
}
export interface EnthalpyData {
    compound: string;
    formula: string;
    deltaHf: number;
    phase: 'solid' | 'liquid' | 'gas' | 'aqueous';
    source: 'pubchem' | 'nist' | 'calculated';
}
export interface EntropyData {
    compound: string;
    formula: string;
    entropy: number;
    temperature: number;
    phase: 'solid' | 'liquid' | 'gas' | 'aqueous';
    source: 'pubchem' | 'nist' | 'calculated';
}
export interface KineticsData {
    /** Activation energy (kJ/mol) */
    activationEnergy: number;
    /** Pre-exponential factor */
    preExponentialFactor: number;
    /** Rate constant at given temperature */
    rateConstant: number;
    /** Temperature for rate constant (K) */
    temperature: number;
    /** Reaction order */
    reactionOrder: number;
    /** Catalyst effects */
    catalystEffects?: CatalystEffect[];
}
export interface CatalystEffect {
    name: string;
    /** Reduction in activation energy (kJ/mol) */
    activationEnergyReduction: number;
    /** Rate enhancement factor */
    rateEnhancement: number;
}
export interface ThermodynamicsConfig {
    /** Default temperature for calculations (K) */
    defaultTemperature: number;
    /** Default pressure for calculations (Pa) */
    defaultPressure: number;
    /** Data sources priority */
    dataSources: ('pubchem' | 'nist' | 'calculated')[];
    /** Enable temperature-dependent calculations */
    temperatureDependence: boolean;
    /** Precision for calculations */
    precision: number;
}
export interface ReactionData {
    reactants: Array<{
        formula: string;
        coefficient: number;
    }>;
    products: Array<{
        formula: string;
        coefficient: number;
    }>;
}
export interface CompoundThermodynamics {
    formula: string;
    deltaHf: number;
    entropy: number;
    heatCapacity: number;
}
/**
 * Energy Profile Visualization Data Types
 * For generating energy diagrams and reaction coordinate plots
 */
export interface EnergyProfilePoint {
    /** Reaction coordinate (0-1, where 0 = reactants, 1 = products) */
    coordinate: number;
    /** Energy relative to reactants (kJ/mol) */
    energy: number;
    /** Point type */
    type: 'reactant' | 'transition-state' | 'intermediate' | 'product';
    /** Optional label for the point */
    label?: string;
    /** Species present at this point */
    species?: string[];
}
export interface EnergyProfile {
    /** Array of energy points along reaction coordinate */
    points: EnergyProfilePoint[];
    /** Overall energy change (kJ/mol) */
    deltaE: number;
    /** Activation energy for forward reaction (kJ/mol) */
    activationEnergyForward: number;
    /** Activation energy for reverse reaction (kJ/mol) */
    activationEnergyReverse: number;
    /** Number of elementary steps */
    steps: number;
    /** Rate-determining step index */
    rateDeterminingStep: number;
    /** Temperature for the profile (K) */
    temperature: number;
    /** Pressure for the profile (Pa) */
    pressure: number;
    /** Whether the reaction is exothermic */
    isExothermic: boolean;
}
export interface TransitionState {
    /** Reaction coordinate position (0-1) */
    coordinate: number;
    /** Energy relative to reactants (kJ/mol) */
    energy: number;
    /** Transition state structure description */
    structure?: string;
    /** Species involved in transition */
    involvedSpecies: string[];
    /** Bond breaking/forming information */
    bondChanges?: BondChange[];
}
export interface BondChange {
    /** Type of bond change */
    type: 'breaking' | 'forming' | 'stretching' | 'compressing';
    /** Atoms involved */
    atoms: [string, string];
    /** Bond order change */
    bondOrderChange: number;
    /** Energy contribution (kJ/mol) */
    energyContribution: number;
}
export interface ReactionCoordinate {
    /** Description of the reaction coordinate */
    description: string;
    /** Units of measurement */
    units: string;
    /** Physical meaning of the coordinate */
    physicalMeaning: string;
    /** Range of coordinate values */
    range: [number, number];
}
//# sourceMappingURL=types.d.ts.map