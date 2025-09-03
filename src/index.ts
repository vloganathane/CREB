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
