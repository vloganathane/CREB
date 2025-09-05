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
}

export interface TemperatureProfile {
  /** Temperature range analyzed (K) */
  range: [number, number];
  /** Delta G values at different temperatures */
  deltaGvsT: Array<{ temperature: number; deltaG: number }>;
  /** Temperature where reaction becomes spontaneous (K) */
  spontaneityThreshold?: number;
}

export interface EnthalpyData {
  compound: string;
  formula: string;
  deltaHf: number; // kJ/mol
  phase: 'solid' | 'liquid' | 'gas' | 'aqueous';
  source: 'pubchem' | 'nist' | 'calculated';
}

export interface EntropyData {
  compound: string;
  formula: string;
  entropy: number; // J/(mol·K)
  temperature: number; // K
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
