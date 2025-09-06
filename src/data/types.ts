/**
 * Enhanced Data Integration System for CREB-JS
 * Provides comprehensive chemical database management and integration
 */

export interface DatabaseSource {
  id: string;
  name: string;
  url?: string;
  apiKey?: string;
  priority: number;
  enabled: boolean;
  cacheTimeout: number; // seconds
}

export interface CompoundDatabase {
  formula: string;
  name: string;
  iupacName?: string;
  commonName?: string;
  casNumber?: string;
  smiles?: string;
  inchi?: string;
  molecularWeight: number;
  thermodynamicProperties: ExtendedThermodynamicProperties;
  physicalProperties: PhysicalProperties;
  safetyData?: SafetyProperties;
  sources: string[]; // Which databases provided this data
  lastUpdated: Date;
  confidence: number; // 0-1 scale
}

export interface ExtendedThermodynamicProperties {
  // Standard formation properties
  deltaHf: number; // kJ/mol - enthalpy of formation
  deltaGf?: number; // kJ/mol - Gibbs free energy of formation
  entropy: number; // J/(mol·K) - standard entropy
  heatCapacity: number; // J/(mol·K) - heat capacity
  
  // Temperature dependence
  temperatureRange: [number, number]; // [min, max] in K
  cpCoefficients?: number[]; // Heat capacity polynomial coefficients
  
  // Phase properties
  meltingPoint?: number; // K
  boilingPoint?: number; // K
  vaporPressure?: Array<{ temperature: number; pressure: number }>; // Pa
  
  // Additional properties from NIST WebBook
  criticalTemperature?: number; // K
  criticalPressure?: number; // Pa
  criticalDensity?: number; // kg/m³
  acentricFactor?: number;
  
  // Experimental uncertainty
  uncertainties?: {
    deltaHf?: number;
    entropy?: number;
    heatCapacity?: number;
  };
}

export interface PhysicalProperties {
  density?: number; // kg/m³ at STP
  viscosity?: number; // Pa·s at 298K
  thermalConductivity?: number; // W/(m·K)
  refractiveIndex?: number;
  dielectricConstant?: number;
  surfaceTension?: number; // N/m
  solubility?: {
    water?: number; // g/L at 298K
    organic?: Array<{ solvent: string; solubility: number }>;
  };
}

export interface SafetyProperties {
  hazardSymbols: string[];
  hazardStatements: string[];
  precautionaryStatements: string[];
  flashPoint?: number; // K
  autoignitionTemperature?: number; // K
  explosiveLimits?: {
    lower: number; // vol%
    upper: number; // vol%
  };
  toxicity?: {
    ld50?: number; // mg/kg
    lc50?: number; // mg/L
  };
}

export interface DataValidationRule {
  field: string;
  type: 'range' | 'required' | 'format' | 'custom';
  rule: any;
  message: string;
}

export interface DataImportResult {
  success: boolean;
  imported: number;
  failed: number;
  errors: Array<{ compound: string; error: string }>;
  warnings: Array<{ compound: string; warning: string }>;
}

export interface DataExportOptions {
  format: 'json' | 'csv' | 'xlsx' | 'sdf' | 'xml';
  fields?: string[];
  filter?: (compound: CompoundDatabase) => boolean;
  includeMetadata?: boolean;
}

export type DatabaseProvider = 'nist' | 'pubchem' | 'chemspider' | 'custom' | 'local';

export interface DatabaseQuery {
  formula?: string;
  name?: string;
  casNumber?: string;
  smiles?: string;
  inchi?: string;
  provider?: DatabaseProvider;
  includeUncertain?: boolean;
  maxResults?: number;
}
