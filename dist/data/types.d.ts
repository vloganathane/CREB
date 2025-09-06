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
    cacheTimeout: number;
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
    sources: string[];
    lastUpdated: Date;
    confidence: number;
}
export interface ExtendedThermodynamicProperties {
    deltaHf: number;
    deltaGf?: number;
    entropy: number;
    heatCapacity: number;
    temperatureRange: [number, number];
    cpCoefficients?: number[];
    meltingPoint?: number;
    boilingPoint?: number;
    vaporPressure?: Array<{
        temperature: number;
        pressure: number;
    }>;
    criticalTemperature?: number;
    criticalPressure?: number;
    criticalDensity?: number;
    acentricFactor?: number;
    uncertainties?: {
        deltaHf?: number;
        entropy?: number;
        heatCapacity?: number;
    };
}
export interface PhysicalProperties {
    density?: number;
    viscosity?: number;
    thermalConductivity?: number;
    refractiveIndex?: number;
    dielectricConstant?: number;
    surfaceTension?: number;
    solubility?: {
        water?: number;
        organic?: Array<{
            solvent: string;
            solubility: number;
        }>;
    };
}
export interface SafetyProperties {
    hazardSymbols: string[];
    hazardStatements: string[];
    precautionaryStatements: string[];
    flashPoint?: number;
    autoignitionTemperature?: number;
    explosiveLimits?: {
        lower: number;
        upper: number;
    };
    toxicity?: {
        ld50?: number;
        lc50?: number;
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
    errors: Array<{
        compound: string;
        error: string;
    }>;
    warnings: Array<{
        compound: string;
        warning: string;
    }>;
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
//# sourceMappingURL=types.d.ts.map