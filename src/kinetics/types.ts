/**
 * CREB Kinetics Types
 * Type definitions for reaction kinetics calculations
 */

export interface ReactionConditions {
  temperature: number;      // Temperature in Kelvin
  pressure?: number;        // Pressure in atm (optional)
  concentration: Record<string, number>; // Initial concentrations in M
  catalysts?: string[];     // Optional catalyst compounds
  solvent?: string;         // Solvent information
}

export interface ArrheniusData {
  preExponentialFactor: number;  // A in Arrhenius equation (s⁻¹ or M⁻¹s⁻¹)
  activationEnergy: number;      // Ea in kJ/mol
  temperatureRange: [number, number]; // Valid temperature range [min, max] in K
  rSquared?: number;             // Correlation coefficient for fit
}

export interface ReactionStep {
  equation: string;              // Elementary reaction equation
  type: 'elementary' | 'fast-equilibrium' | 'rate-determining';
  rateConstant: number;          // Rate constant at given conditions
  order: Record<string, number>; // Reaction order for each reactant
  mechanism: string;             // Description of the step
}

export interface KineticsResult {
  equation: string;              // Original chemical equation
  rateConstant: number;          // Overall rate constant
  activationEnergy: number;      // Activation energy in kJ/mol
  reactionOrder: number;         // Overall reaction order
  mechanism: ReactionStep[];     // Elementary reaction steps
  temperatureDependence: ArrheniusData;
  rateLaw: string;              // Rate law expression
  conditions: ReactionConditions; // Conditions used for calculation
  halfLife?: number;             // Half-life if applicable (s)
  catalystEffect?: CatalystData; // Catalyst analysis
  confidence: number;            // Confidence in prediction (0-1)
  dataSource: 'experimental' | 'estimated' | 'literature';
}

export interface CatalystData {
  catalyst: string;              // Catalyst compound
  effectOnRate: number;          // Rate enhancement factor
  effectOnActivationEnergy: number; // Change in Ea (kJ/mol)
  mechanism: string;             // Catalytic mechanism description
  efficiency: number;            // Catalytic efficiency (0-1)
}

export interface TemperatureProfile {
  temperature: number;           // Temperature in K
  rateConstant: number;          // Rate constant at this temperature
  reactionRate: number;          // Reaction rate at this temperature
  equilibriumConstant?: number;  // Equilibrium constant if applicable
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

export type ReactionClass = 
  | 'unimolecular'     // A → products
  | 'bimolecular'      // A + B → products  
  | 'termolecular'     // A + B + C → products (rare)
  | 'enzyme-catalyzed' // Michaelis-Menten kinetics
  | 'autocatalytic'    // Product catalyzes its own formation
  | 'chain-reaction'   // Free radical or chain mechanism
  | 'oscillating'      // Belousov-Zhabotinsky type
  | 'complex';         // Multi-step complex mechanism

export type RateLawType =
  | 'elementary'       // Rate = k[A]^m[B]^n
  | 'michaelis-menten' // Rate = Vmax[S]/(Km + [S])
  | 'langmuir'         // Surface catalysis
  | 'power-law'        // Rate = k[A]^m
  | 'complex';         // Non-standard rate law
