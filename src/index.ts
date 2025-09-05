export { ChemicalEquationBalancer } from './balancer';
export { Stoichiometry } from './stoichiometry';
export { ElementCounter, EquationParser, calculateMolarWeight } from './utils';
export * from './types';
export * from './constants';

// Enhanced PubChem-integrated classes (Phase 2)
export { 
  EnhancedChemicalEquationBalancer,
  type EnhancedBalancedEquation,
  type CompoundInfo 
} from './enhancedBalancer';
export { 
  EnhancedStoichiometry,
  type EnhancedStoichiometryResult,
  type ReactionAnalysis 
} from './enhancedStoichiometry';

// Thermodynamics module (Phase 2 - Advanced Chemistry)
export { 
  ThermodynamicsCalculator,
  type ThermodynamicsResult,
  type ReactionConditions,
  type ThermodynamicProperties,
  type TemperatureProfile
} from './thermodynamics';
