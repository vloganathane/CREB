/**
 * Enhanced Chemical Database Manager
 * Provides comprehensive data integration and management capabilities
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { AdvancedCache } from '../performance/cache/AdvancedCache';
import { Injectable } from '../core/decorators/Injectable';
import { createValidationPipeline, ChemicalFormulaValidator, ThermodynamicPropertiesValidator } from './validation';
import { ValidationError } from '../core/errors/CREBError';
let ChemicalDatabaseManager = class ChemicalDatabaseManager {
    constructor() {
        this.compounds = new Map();
        this.sources = new Map();
        this.validationRules = [];
        this.cache = new AdvancedCache({
            maxSize: 1000,
            defaultTtl: 1800000, // 30 minutes
            enableMetrics: true
        });
        this.validationPipeline = this.initializeValidationPipeline();
        this.initializeDefaultSources();
        this.initializeValidationRules();
        this.loadDefaultCompounds();
    }
    /**
     * Initialize the validation pipeline with chemistry validators
     */
    initializeValidationPipeline() {
        const pipeline = createValidationPipeline();
        // Add chemical formula validator
        pipeline.addValidator(new ChemicalFormulaValidator());
        // Add thermodynamic properties validator
        pipeline.addValidator(new ThermodynamicPropertiesValidator());
        return pipeline;
    }
    /**
     * Initialize default database sources
     */
    initializeDefaultSources() {
        const defaultSources = [
            {
                id: 'nist',
                name: 'NIST WebBook',
                url: 'https://webbook.nist.gov/chemistry/',
                priority: 1,
                enabled: true,
                cacheTimeout: 86400 // 24 hours
            },
            {
                id: 'pubchem',
                name: 'PubChem',
                url: 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/',
                priority: 2,
                enabled: true,
                cacheTimeout: 43200 // 12 hours
            },
            {
                id: 'local',
                name: 'Local Database',
                priority: 3,
                enabled: true,
                cacheTimeout: 0 // No cache timeout for local data
            }
        ];
        defaultSources.forEach(source => {
            this.sources.set(source.id, source);
        });
    }
    /**
     * Initialize data validation rules
     */
    initializeValidationRules() {
        this.validationRules = [
            {
                field: 'formula',
                type: 'required',
                rule: true,
                message: 'Chemical formula is required'
            },
            {
                field: 'molecularWeight',
                type: 'range',
                rule: { min: 0.1, max: 10000 },
                message: 'Molecular weight must be between 0.1 and 10000 g/mol'
            },
            {
                field: 'thermodynamicProperties.deltaHf',
                type: 'range',
                rule: { min: -5000, max: 5000 },
                message: 'Enthalpy of formation must be between -5000 and 5000 kJ/mol'
            },
            {
                field: 'thermodynamicProperties.entropy',
                type: 'range',
                rule: { min: 0, max: 1000 },
                message: 'Entropy must be between 0 and 1000 J/(mol·K)'
            },
            {
                field: 'thermodynamicProperties.temperatureRange',
                type: 'custom',
                rule: (range) => range[0] < range[1] && range[0] > 0,
                message: 'Temperature range must be valid (min < max, both > 0)'
            }
        ];
    }
    /**
     * Load default compound database
     */
    loadDefaultCompounds() {
        const defaultCompounds = [
            {
                formula: 'H2O',
                name: 'Water',
                commonName: 'Water',
                casNumber: '7732-18-5',
                smiles: 'O',
                molecularWeight: 18.015,
                thermodynamicProperties: {
                    deltaHf: -285.8,
                    deltaGf: -237.1,
                    entropy: 69.95,
                    heatCapacity: 75.3,
                    temperatureRange: [273.15, 647.1],
                    meltingPoint: 273.15,
                    boilingPoint: 373.15,
                    criticalTemperature: 647.1,
                    criticalPressure: 22064000,
                    vaporPressure: [
                        { temperature: 273.15, pressure: 611.7 },
                        { temperature: 298.15, pressure: 3173 },
                        { temperature: 373.15, pressure: 101325 }
                    ]
                },
                physicalProperties: {
                    density: 997.0,
                    viscosity: 0.001,
                    thermalConductivity: 0.606,
                    refractiveIndex: 1.333,
                    dielectricConstant: 80.1,
                    surfaceTension: 0.0728
                },
                sources: ['nist', 'local'],
                lastUpdated: new Date(),
                confidence: 1.0
            },
            {
                formula: 'CO2',
                name: 'Carbon dioxide',
                commonName: 'Carbon dioxide',
                casNumber: '124-38-9',
                smiles: 'O=C=O',
                molecularWeight: 44.010,
                thermodynamicProperties: {
                    deltaHf: -393.5,
                    deltaGf: -394.4,
                    entropy: 213.8,
                    heatCapacity: 37.1,
                    temperatureRange: [200, 2000],
                    meltingPoint: 216.6,
                    boilingPoint: 194.7, // Sublimation point at 1 atm
                    criticalTemperature: 304.13,
                    criticalPressure: 7375000
                },
                physicalProperties: {
                    density: 1.98, // gas at STP
                    thermalConductivity: 0.0146,
                    solubility: {
                        water: 1.7 // g/L at 20°C
                    }
                },
                sources: ['nist', 'local'],
                lastUpdated: new Date(),
                confidence: 1.0
            },
            {
                formula: 'CH4',
                name: 'Methane',
                commonName: 'Methane',
                casNumber: '74-82-8',
                smiles: 'C',
                molecularWeight: 16.043,
                thermodynamicProperties: {
                    deltaHf: -74.6,
                    deltaGf: -50.5,
                    entropy: 186.3,
                    heatCapacity: 35.7,
                    temperatureRange: [200, 1500],
                    meltingPoint: 90.7,
                    boilingPoint: 111.7,
                    criticalTemperature: 190.6,
                    criticalPressure: 4599000
                },
                physicalProperties: {
                    density: 0.717, // gas at STP
                    viscosity: 0.0000103,
                    thermalConductivity: 0.0332
                },
                safetyData: {
                    hazardSymbols: ['GHS02', 'GHS04'],
                    hazardStatements: ['H220', 'H280'],
                    precautionaryStatements: ['P210', 'P377', 'P381'],
                    autoignitionTemperature: 810,
                    explosiveLimits: {
                        lower: 5.0,
                        upper: 15.0
                    }
                },
                sources: ['nist', 'local'],
                lastUpdated: new Date(),
                confidence: 1.0
            }
        ];
        defaultCompounds.forEach((compound, index) => {
            if (compound.formula) {
                this.compounds.set(compound.formula, compound);
            }
        });
    }
    /**
     * Query compounds from the database
     */
    async query(query) {
        const results = [];
        // Search local database first
        for (const [formula, compound] of this.compounds) {
            if (this.matchesQuery(compound, query)) {
                results.push(compound);
            }
        }
        // If no local results and external providers are requested
        if (results.length === 0 && query.provider && query.provider !== 'local') {
            try {
                const externalResults = await this.queryExternalSource(query);
                results.push(...externalResults);
            }
            catch (error) {
                console.warn(`External database query failed: ${error}`);
            }
        }
        // Sort by confidence and limit results
        results.sort((a, b) => b.confidence - a.confidence);
        if (query.maxResults) {
            return results.slice(0, query.maxResults);
        }
        return results;
    }
    /**
     * Check if compound matches query criteria
     */
    matchesQuery(compound, query) {
        if (query.formula && compound.formula !== query.formula)
            return false;
        if (query.name && !compound.name.toLowerCase().includes(query.name.toLowerCase()))
            return false;
        if (query.casNumber && compound.casNumber !== query.casNumber)
            return false;
        if (query.smiles && compound.smiles !== query.smiles)
            return false;
        if (query.inchi && compound.inchi !== query.inchi)
            return false;
        if (!query.includeUncertain && compound.confidence < 0.8)
            return false;
        return true;
    }
    /**
     * Query external data sources
     */
    async queryExternalSource(query) {
        // This would implement actual API calls to NIST, PubChem, etc.
        // For now, return empty array as placeholder
        return [];
    }
    /**
     * Add or update a compound in the database
     */
    async addCompound(compound) {
        try {
            // Validate the compound data
            const validationErrors = await this.validateCompound(compound);
            if (validationErrors.length > 0) {
                throw new ValidationError(`Validation failed: ${validationErrors.join(', ')}`, {
                    errors: validationErrors,
                    compound: compound.formula || 'unknown'
                });
            }
            // Fill in missing fields
            const fullCompound = {
                formula: compound.formula,
                name: compound.name || compound.formula,
                molecularWeight: compound.molecularWeight || 0,
                thermodynamicProperties: compound.thermodynamicProperties || this.getDefaultThermodynamicProperties(),
                physicalProperties: compound.physicalProperties || {},
                sources: compound.sources || ['custom'],
                lastUpdated: new Date(),
                confidence: compound.confidence || 0.8,
                ...compound
            };
            this.compounds.set(fullCompound.formula, fullCompound);
            return true;
        }
        catch (error) {
            console.error(`Failed to add compound: ${error}`);
            return false;
        }
    }
    /**
     * Get default thermodynamic properties for validation
     */
    getDefaultThermodynamicProperties() {
        return {
            deltaHf: 0,
            entropy: 0,
            heatCapacity: 25, // Approximate value for many compounds
            temperatureRange: [298, 1000]
        };
    }
    /**
     * Validate compound data using the advanced validation pipeline
     */
    async validateCompound(compound) {
        const errors = [];
        try {
            // Validate chemical formula if present
            if (compound.formula) {
                const formulaResult = await this.validationPipeline.validate(compound.formula, ['ChemicalFormulaValidator']);
                if (!formulaResult.isValid) {
                    errors.push(...formulaResult.errors.map(e => e.message));
                }
            }
            // Validate thermodynamic properties if present
            if (compound.thermodynamicProperties) {
                const thermoResult = await this.validationPipeline.validate(compound.thermodynamicProperties, ['ThermodynamicPropertiesValidator']);
                if (!thermoResult.isValid) {
                    errors.push(...thermoResult.errors.map(e => e.message));
                }
            }
            // Legacy validation rules for backward compatibility
            for (const rule of this.validationRules) {
                const value = this.getNestedProperty(compound, rule.field);
                switch (rule.type) {
                    case 'required':
                        if (value === undefined || value === null) {
                            errors.push(rule.message);
                        }
                        break;
                    case 'range':
                        if (typeof value === 'number') {
                            const { min, max } = rule.rule;
                            if (value < min || value > max) {
                                errors.push(rule.message);
                            }
                        }
                        break;
                    case 'custom':
                        if (value !== undefined && !rule.rule(value)) {
                            errors.push(rule.message);
                        }
                        break;
                }
            }
        }
        catch (error) {
            errors.push(`Validation failed: ${error instanceof Error ? error.message : String(error)}`);
        }
        return errors;
    }
    /**
     * Get nested property value by dot notation
     */
    getNestedProperty(obj, path) {
        return path.split('.').reduce((current, key) => current?.[key], obj);
    }
    /**
     * Import compounds from various data formats
     */
    async importData(data, format) {
        const result = {
            success: true,
            imported: 0,
            failed: 0,
            errors: [],
            warnings: []
        };
        try {
            let compounds = [];
            switch (format) {
                case 'json':
                    compounds = Array.isArray(data) ? data : [data];
                    break;
                case 'csv':
                    compounds = this.parseCSV(data);
                    break;
                case 'sdf':
                    compounds = this.parseSDF(data);
                    break;
                default:
                    throw new Error(`Unsupported format: ${format}`);
            }
            for (const compound of compounds) {
                try {
                    const success = await this.addCompound(compound);
                    if (success) {
                        result.imported++;
                    }
                    else {
                        result.failed++;
                        result.errors.push({
                            compound: compound.formula || 'unknown',
                            error: 'Failed to add compound'
                        });
                    }
                }
                catch (error) {
                    result.failed++;
                    result.errors.push({
                        compound: compound.formula || 'unknown',
                        error: error instanceof Error ? error.message : 'Unknown error'
                    });
                }
            }
            result.success = result.failed === 0;
        }
        catch (error) {
            result.success = false;
            result.errors.push({
                compound: 'all',
                error: error instanceof Error ? error.message : 'Import failed'
            });
        }
        return result;
    }
    /**
     * Parse CSV data into compound objects
     */
    parseCSV(csvData) {
        const lines = csvData.split('\n');
        const headers = lines[0].split(',').map(h => h.trim());
        const compounds = [];
        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',').map(v => v.trim());
            if (values.length === headers.length) {
                const compound = {};
                headers.forEach((header, index) => {
                    const value = values[index];
                    // Map common CSV headers to compound properties
                    switch (header.toLowerCase()) {
                        case 'formula':
                            compound.formula = value;
                            break;
                        case 'name':
                            compound.name = value;
                            break;
                        case 'molecular_weight':
                        case 'molecularweight':
                            compound.molecularWeight = parseFloat(value);
                            break;
                        case 'deltahf':
                        case 'enthalpy_formation':
                            compound.thermodynamicProperties = compound.thermodynamicProperties || {};
                            compound.thermodynamicProperties.deltaHf = parseFloat(value);
                            break;
                        case 'entropy':
                            compound.thermodynamicProperties = compound.thermodynamicProperties || {};
                            compound.thermodynamicProperties.entropy = parseFloat(value);
                            break;
                        case 'heat_capacity':
                        case 'heatcapacity':
                            compound.thermodynamicProperties = compound.thermodynamicProperties || {};
                            compound.thermodynamicProperties.heatCapacity = parseFloat(value);
                            break;
                    }
                });
                if (compound.formula) {
                    compounds.push(compound);
                }
            }
        }
        return compounds;
    }
    /**
     * Parse SDF (Structure Data File) format
     */
    parseSDF(sdfData) {
        // Basic SDF parsing - would need more sophisticated implementation for production
        const compounds = [];
        const molecules = sdfData.split('$$$$');
        for (const molecule of molecules) {
            if (molecule.trim()) {
                const compound = {};
                // Extract name from first line
                const lines = molecule.split('\n');
                if (lines.length > 0) {
                    compound.name = lines[0].trim();
                }
                // Look for additional properties in the data fields
                const dataSection = molecule.split('> <');
                for (const section of dataSection) {
                    if (section.includes('MOLECULAR_FORMULA')) {
                        const formula = section.split('\n')[1]?.trim();
                        if (formula)
                            compound.formula = formula;
                    }
                    if (section.includes('MOLECULAR_WEIGHT')) {
                        const weight = parseFloat(section.split('\n')[1]?.trim() || '0');
                        if (weight > 0)
                            compound.molecularWeight = weight;
                    }
                }
                if (compound.formula) {
                    compounds.push(compound);
                }
            }
        }
        return compounds;
    }
    /**
     * Export compound data in various formats
     */
    exportData(options) {
        let compounds = Array.from(this.compounds.values());
        // Apply filter if provided
        if (options.filter) {
            compounds = compounds.filter(options.filter);
        }
        switch (options.format) {
            case 'json':
                return this.exportJSON(compounds, options);
            case 'csv':
                return this.exportCSV(compounds, options);
            case 'xlsx':
                return this.exportXLSX(compounds, options);
            default:
                throw new Error(`Unsupported export format: ${options.format}`);
        }
    }
    /**
     * Export as JSON
     */
    exportJSON(compounds, options) {
        const data = options.fields ?
            compounds.map(c => this.selectFields(c, options.fields)) :
            compounds;
        const exportData = {
            metadata: options.includeMetadata ? {
                exportDate: new Date().toISOString(),
                totalCompounds: compounds.length,
                version: '1.0'
            } : undefined,
            compounds: data
        };
        return JSON.stringify(exportData, null, 2);
    }
    /**
     * Export as CSV
     */
    exportCSV(compounds, options) {
        if (compounds.length === 0)
            return '';
        const fields = options.fields || ['formula', 'name', 'molecularWeight'];
        const headers = fields.join(',');
        const rows = compounds.map(compound => {
            return fields.map(field => {
                const value = this.getNestedProperty(compound, field);
                return typeof value === 'string' ? `"${value}"` : value || '';
            }).join(',');
        });
        return [headers, ...rows].join('\n');
    }
    /**
     * Export as XLSX (placeholder - would need external library)
     */
    exportXLSX(compounds, options) {
        // This would require a library like xlsx or exceljs
        throw new Error('XLSX export not yet implemented - use JSON or CSV');
    }
    /**
     * Select specific fields from compound
     */
    selectFields(compound, fields) {
        const result = {};
        for (const field of fields) {
            const value = this.getNestedProperty(compound, field);
            if (value !== undefined) {
                this.setNestedProperty(result, field, value);
            }
        }
        return result;
    }
    /**
     * Set nested property value by dot notation
     */
    setNestedProperty(obj, path, value) {
        const keys = path.split('.');
        const lastKey = keys.pop();
        let current = obj;
        for (const key of keys) {
            if (!(key in current)) {
                current[key] = {};
            }
            current = current[key];
        }
        current[lastKey] = value;
    }
    /**
     * Get compound by formula with backward compatibility
     */
    async getCompound(formula) {
        const compounds = await this.query({ formula, maxResults: 1 });
        if (compounds.length > 0) {
            const compound = compounds[0];
            // Convert to legacy format for backward compatibility
            return {
                deltaHf: compound.thermodynamicProperties.deltaHf,
                entropy: compound.thermodynamicProperties.entropy,
                heatCapacity: compound.thermodynamicProperties.heatCapacity,
                temperatureRange: compound.thermodynamicProperties.temperatureRange
            };
        }
        return null;
    }
    /**
     * Get all available compounds
     */
    getAllCompounds() {
        return Array.from(this.compounds.values());
    }
    /**
     * Get database statistics
     */
    getStatistics() {
        const compounds = this.getAllCompounds();
        const sourceCounts = {};
        const confidenceDistribution = {
            'high': 0, // > 0.8
            'medium': 0, // 0.6-0.8
            'low': 0 // < 0.6
        };
        let lastUpdate = new Date(0);
        compounds.forEach(compound => {
            // Count sources
            compound.sources.forEach(source => {
                sourceCounts[source] = (sourceCounts[source] || 0) + 1;
            });
            // Confidence distribution
            if (compound.confidence > 0.8) {
                confidenceDistribution.high++;
            }
            else if (compound.confidence > 0.6) {
                confidenceDistribution.medium++;
            }
            else {
                confidenceDistribution.low++;
            }
            // Track latest update
            if (compound.lastUpdated > lastUpdate) {
                lastUpdate = compound.lastUpdated;
            }
        });
        return {
            totalCompounds: compounds.length,
            sourceCounts,
            confidenceDistribution,
            lastUpdate
        };
    }
};
ChemicalDatabaseManager = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [])
], ChemicalDatabaseManager);
export { ChemicalDatabaseManager };
//# sourceMappingURL=ChemicalDatabaseManager.js.map