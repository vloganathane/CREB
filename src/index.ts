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
  ThermodynamicsEquationBalancer,
  type ThermodynamicsResult,
  type ReactionConditions,
  type ThermodynamicProperties,
  type TemperatureProfile
} from './thermodynamics';

// Advanced Kinetics & Analytics Module (Phase 2 - v1.5.0)
export {
  ReactionKinetics,
  MechanismAnalyzer,
  ReactionSafetyAnalyzer,
  AdvancedKineticsAnalyzer,
  type ArrheniusData,
  type KineticsResult,
  type CatalystData,
  type MechanismStep,
  type MechanismAnalysis,
  type PathwayComparison,
  type SafetyData,
  type ToxicityData,
  type ReactivityData,
  type ReactionSafetyAssessment,
  type ThermalHazard,
  type ChemicalHazard,
  type PhysicalHazard,
  type EnvironmentalHazard,
  type SafetyRecommendation,
  type ReactionClass,
  type RateLawType
} from './kinetics';
