export { ChemicalEquationBalancer } from './balancer';
export { Stoichiometry } from './stoichiometry';
export { ElementCounter, EquationParser, calculateMolarWeight } from './utils';
export * from './types';
export * from './constants';

// Enhanced TypeScript Support (NEW) - Selective exports to avoid conflicts
export {
  // Branded Types
  type ChemicalFormula,
  type ElementSymbol,
  type BalancedEquationString,
  type SMILESNotation,
  type InChINotation,
  type CASNumber,
  
  // Advanced Types
  type ValidElement,
  type TypedElementCount,
  type TypedCompound,
  type TypedReaction,
  type ReactionType,
  type PhaseState,
  
  // Type Guards
  isChemicalFormula,
  isElementSymbol,
  isBalancedEquation,
  
  // Utility Functions
  parseFormula,
  createChemicalFormula,
  createElementSymbol,
  
  // Error Types
  ChemicalFormulaError,
  EquationBalancingError
} from './advancedTypes';

export { EnhancedBalancer } from './enhancedBalancerSimple';

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
  EnergyProfileGenerator,
  createEnergyProfile,
  exportEnergyProfile,
  type ThermodynamicsResult,
  type ReactionConditions,
  type ThermodynamicProperties,
  type TemperatureProfile,
  type EnergyProfile,
  type EnergyProfilePoint,
  type TransitionState,
  type ReactionCoordinate,
  type BondChange
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

// Enhanced Data Integration Module (Phase 2 - v1.6.0)
export {
  ChemicalDatabaseManager,
  NISTWebBookIntegration,
  DataValidationService,
  type CompoundDatabase,
  type ExtendedThermodynamicProperties,
  type PhysicalProperties,
  type SafetyProperties,
  type DatabaseSource,
  type DatabaseQuery,
  type DataImportResult,
  type DataExportOptions,
  type ValidationResult,
  type ValidationError,
  type ValidationWarning,
  type DatabaseProvider
} from './data';
