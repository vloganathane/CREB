/**
 * Tests for Enhanced Data Integration System
 */

import {
  ChemicalDatabaseManager,
  NISTWebBookIntegration,
  DataValidationService,
  CompoundDatabase,
  DatabaseQuery,
  ValidationResult
} from '../data';

describe('Enhanced Data Integration', () => {
  describe('ChemicalDatabaseManager', () => {
    let dbManager: ChemicalDatabaseManager;

    beforeEach(() => {
      dbManager = new ChemicalDatabaseManager();
    });

    test('should initialize with default compounds', () => {
      const stats = dbManager.getStatistics();
      expect(stats.totalCompounds).toBeGreaterThan(0);
      expect(stats.sourceCounts.local).toBeGreaterThan(0);
    });

    test('should query compounds by formula', async () => {
      const query: DatabaseQuery = { formula: 'H2O' };
      const results = await dbManager.query(query);
      
      expect(results).toHaveLength(1);
      expect(results[0].formula).toBe('H2O');
      expect(results[0].name).toBe('Water');
      expect(results[0].thermodynamicProperties.deltaHf).toBe(-285.8);
    });

    test('should query compounds by name', async () => {
      const query: DatabaseQuery = { name: 'water' };
      const results = await dbManager.query(query);
      
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].name.toLowerCase()).toContain('water');
    });

    test('should add custom compound', async () => {
      const customCompound: Partial<CompoundDatabase> = {
        formula: 'C2H6',
        name: 'Ethane',
        molecularWeight: 30.069,
        thermodynamicProperties: {
          deltaHf: -84.0,
          entropy: 229.2,
          heatCapacity: 52.5,
          temperatureRange: [200, 1500]
        },
        confidence: 0.9
      };

      const success = await dbManager.addCompound(customCompound);
      expect(success).toBe(true);

      const query: DatabaseQuery = { formula: 'C2H6' };
      const results = await dbManager.query(query);
      expect(results).toHaveLength(1);
      expect(results[0].name).toBe('Ethane');
    });

    test('should handle invalid compound data', async () => {
      const invalidCompound: Partial<CompoundDatabase> = {
        formula: '', // Invalid: empty formula
        name: 'Invalid Compound',
        molecularWeight: -10 // Invalid: negative molecular weight
      };

      const success = await dbManager.addCompound(invalidCompound);
      expect(success).toBe(false);
    });

    test('should export data as JSON', () => {
      const jsonData = dbManager.exportData({
        format: 'json',
        fields: ['formula', 'name', 'molecularWeight'],
        includeMetadata: true
      });

      const parsed = JSON.parse(jsonData);
      expect(parsed.metadata).toBeDefined();
      expect(parsed.compounds).toBeInstanceOf(Array);
      expect(parsed.compounds.length).toBeGreaterThan(0);
      expect(parsed.compounds[0]).toHaveProperty('formula');
      expect(parsed.compounds[0]).toHaveProperty('name');
    });

    test('should export data as CSV', () => {
      const csvData = dbManager.exportData({
        format: 'csv',
        fields: ['formula', 'name', 'molecularWeight']
      });

      const lines = csvData.split('\n');
      expect(lines[0]).toBe('formula,name,molecularWeight');
      expect(lines.length).toBeGreaterThan(1);
    });

    test('should import data from JSON', async () => {
      const importData = [
        {
          formula: 'C3H8',
          name: 'Propane',
          molecularWeight: 44.096,
          thermodynamicProperties: {
            deltaHf: -103.8,
            entropy: 269.9,
            heatCapacity: 73.5,
            temperatureRange: [200, 1500]
          }
        }
      ];

      const result = await dbManager.importData(importData, 'json');
      
      expect(result.success).toBe(true);
      expect(result.imported).toBe(1);
      expect(result.failed).toBe(0);

      const query: DatabaseQuery = { formula: 'C3H8' };
      const compounds = await dbManager.query(query);
      expect(compounds).toHaveLength(1);
      expect(compounds[0].name).toBe('Propane');
    });

    test('should import data from CSV', async () => {
      const csvData = `formula,name,molecular_weight,deltahf,entropy,heat_capacity
C4H10,Butane,58.122,-126.2,310.2,97.5`;

      const result = await dbManager.importData(csvData, 'csv');
      
      expect(result.success).toBe(true);
      expect(result.imported).toBe(1);

      const query: DatabaseQuery = { formula: 'C4H10' };
      const compounds = await dbManager.query(query);
      expect(compounds).toHaveLength(1);
      expect(compounds[0].name).toBe('Butane');
      expect(compounds[0].thermodynamicProperties.deltaHf).toBe(-126.2);
    });

    test('should provide backward compatibility', async () => {
      const thermoProps = await dbManager.getCompound('CO2');
      
      expect(thermoProps).not.toBeNull();
      expect(thermoProps!.deltaHf).toBe(-393.5);
      expect(thermoProps!.entropy).toBe(213.8);
      expect(thermoProps!.heatCapacity).toBe(37.1);
      expect(thermoProps!.temperatureRange).toEqual([200, 2000]);
    });

    test('should handle filter queries', async () => {
      const exportData = dbManager.exportData({
        format: 'json',
        filter: (compound) => compound.molecularWeight < 50
      });

      const parsed = JSON.parse(exportData);
      parsed.compounds.forEach((compound: any) => {
        expect(compound.molecularWeight).toBeLessThan(50);
      });
    });

    test('should provide statistics', () => {
      const stats = dbManager.getStatistics();
      
      expect(stats.totalCompounds).toBeGreaterThan(0);
      expect(stats.sourceCounts).toHaveProperty('local');
      expect(stats.confidenceDistribution).toHaveProperty('high');
      expect(stats.confidenceDistribution).toHaveProperty('medium');
      expect(stats.confidenceDistribution).toHaveProperty('low');
      expect(stats.lastUpdate).toBeInstanceOf(Date);
    });
  });

  describe('NISTWebBookIntegration', () => {
    let nistIntegration: NISTWebBookIntegration;

    beforeEach(() => {
      nistIntegration = new NISTWebBookIntegration();
    });

    test('should query compound by formula', async () => {
      const compound = await nistIntegration.queryCompound('H2O', 'formula');
      
      expect(compound).not.toBeNull();
      expect(compound!.formula).toBe('H2O');
      expect(compound!.name).toBe('Water');
      expect(compound!.sources).toContain('nist');
      expect(compound!.confidence).toBe(0.95);
    });

    test('should query compound by name', async () => {
      const compound = await nistIntegration.queryCompound('methane', 'name');
      
      // Should return null for name queries in mock implementation
      // In real implementation, this would search by name
      expect(compound).toBeNull();
    });

    test('should batch query multiple compounds', async () => {
      const identifiers = ['H2O', 'CO2', 'CH4'];
      const compounds = await nistIntegration.batchQuery(identifiers, 'formula');
      
      expect(compounds.length).toBe(3);
      expect(compounds.map(c => c.formula)).toEqual(['H2O', 'CO2', 'CH4']);
    });

    test('should handle unknown compounds', async () => {
      const compound = await nistIntegration.queryCompound('UnknownFormula', 'formula');
      expect(compound).toBeNull();
    });

    test('should manage cache', () => {
      const initialStats = nistIntegration.getCacheStats();
      expect(initialStats.size).toBe(0);

      nistIntegration.clearCache();
      const clearedStats = nistIntegration.getCacheStats();
      expect(clearedStats.size).toBe(0);
    });

    test('should calculate molecular weight correctly', async () => {
      const compound = await nistIntegration.queryCompound('CH4', 'formula');
      
      expect(compound).not.toBeNull();
      // CH4 = 12.011 + 4*1.008 = 16.043
      expect(compound!.molecularWeight).toBeCloseTo(16.043, 2);
    });

    test('should include uncertainties in NIST data', async () => {
      const compound = await nistIntegration.queryCompound('H2O', 'formula');
      
      expect(compound).not.toBeNull();
      expect(compound!.thermodynamicProperties.uncertainties).toBeDefined();
      expect(compound!.thermodynamicProperties.uncertainties!.deltaHf).toBe(0.4);
    });
  });

  describe('DataValidationService', () => {
    let validator: DataValidationService;

    beforeEach(() => {
      validator = new DataValidationService();
    });

    test('should validate valid compound', () => {
      const validCompound: CompoundDatabase = {
        formula: 'H2O',
        name: 'Water',
        molecularWeight: 18.015,
        thermodynamicProperties: {
          deltaHf: -285.8,
          entropy: 69.95,
          heatCapacity: 75.3,
          temperatureRange: [273, 373]
        },
        physicalProperties: {},
        sources: ['nist'],
        lastUpdated: new Date(),
        confidence: 0.9
      };

      const result = validator.validateCompound(validCompound);
      
      expect(result.isValid).toBe(true);
      expect(result.errors.filter(e => e.severity === 'critical')).toHaveLength(0);
      expect(result.score).toBeGreaterThan(70);
    });

    test('should detect missing required fields', () => {
      const invalidCompound: CompoundDatabase = {
        formula: '', // Invalid: empty formula
        name: 'Test',
        molecularWeight: 18.015,
        thermodynamicProperties: {
          deltaHf: -285.8,
          entropy: 69.95,
          heatCapacity: 75.3,
          temperatureRange: [273, 373]
        },
        physicalProperties: {},
        sources: ['test'],
        lastUpdated: new Date(),
        confidence: 0.9
      };

      const result = validator.validateCompound(invalidCompound);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.field === 'formula' && e.severity === 'critical')).toBe(true);
    });

    test('should detect invalid chemical formulas', () => {
      const invalidCompound: CompoundDatabase = {
        formula: 'H2O@#$', // Invalid: contains special characters
        name: 'Invalid Water',
        molecularWeight: 18.015,
        thermodynamicProperties: {
          deltaHf: -285.8,
          entropy: 69.95,
          heatCapacity: 75.3,
          temperatureRange: [273, 373]
        },
        physicalProperties: {},
        sources: ['test'],
        lastUpdated: new Date(),
        confidence: 0.9
      };

      const result = validator.validateCompound(invalidCompound);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.field === 'formula' && e.message.includes('invalid characters'))).toBe(true);
    });

    test('should detect unbalanced parentheses', () => {
      const invalidCompound: CompoundDatabase = {
        formula: 'Ca(OH2', // Invalid: unbalanced parentheses
        name: 'Invalid Calcium Hydroxide',
        molecularWeight: 74.093,
        thermodynamicProperties: {
          deltaHf: -985.2,
          entropy: 83.4,
          heatCapacity: 87.5,
          temperatureRange: [298, 1000]
        },
        physicalProperties: {},
        sources: ['test'],
        lastUpdated: new Date(),
        confidence: 0.9
      };

      const result = validator.validateCompound(invalidCompound);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.field === 'formula' && e.message.includes('parentheses'))).toBe(true);
    });

    test('should validate thermodynamic property ranges', () => {
      const invalidCompound: CompoundDatabase = {
        formula: 'TestCompound',
        name: 'Test Compound',
        molecularWeight: 100,
        thermodynamicProperties: {
          deltaHf: -10000, // Invalid: outside reasonable range
          entropy: -50, // Invalid: negative entropy
          heatCapacity: 75.3,
          temperatureRange: [273, 373]
        },
        physicalProperties: {},
        sources: ['test'],
        lastUpdated: new Date(),
        confidence: 0.9
      };

      const result = validator.validateCompound(invalidCompound);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.field.includes('deltaHf'))).toBe(true);
      expect(result.errors.some(e => e.field.includes('entropy'))).toBe(true);
    });

    test('should validate temperature ranges', () => {
      const invalidCompound: CompoundDatabase = {
        formula: 'TestCompound',
        name: 'Test Compound',
        molecularWeight: 100,
        thermodynamicProperties: {
          deltaHf: -100,
          entropy: 50,
          heatCapacity: 75.3,
          temperatureRange: [500, 300] // Invalid: min > max
        },
        physicalProperties: {},
        sources: ['test'],
        lastUpdated: new Date(),
        confidence: 0.9
      };

      const result = validator.validateCompound(invalidCompound);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.field.includes('temperatureRange'))).toBe(true);
    });

    test('should validate phase transition consistency', () => {
      const invalidCompound: CompoundDatabase = {
        formula: 'TestCompound',
        name: 'Test Compound',
        molecularWeight: 100,
        thermodynamicProperties: {
          deltaHf: -100,
          entropy: 50,
          heatCapacity: 75.3,
          temperatureRange: [200, 500],
          meltingPoint: 400,
          boilingPoint: 300 // Invalid: boiling point < melting point
        },
        physicalProperties: {},
        sources: ['test'],
        lastUpdated: new Date(),
        confidence: 0.9
      };

      const result = validator.validateCompound(invalidCompound);
      
      expect(result.isValid).toBe(false);
      const hasMeltingPointError = result.errors.some(e => 
        e.field.includes('meltingPoint') || e.message.includes('melting point')
      );
      expect(hasMeltingPointError).toBe(true);
    });

    test('should validate molecular weight consistency', () => {
      const invalidCompound: CompoundDatabase = {
        formula: 'H2O',
        name: 'Water',
        molecularWeight: 50.0, // Invalid: should be ~18.015
        thermodynamicProperties: {
          deltaHf: -285.8,
          entropy: 69.95,
          heatCapacity: 75.3,
          temperatureRange: [273, 373]
        },
        physicalProperties: {},
        sources: ['test'],
        lastUpdated: new Date(),
        confidence: 0.9
      };

      const result = validator.validateCompound(invalidCompound);
      
      expect(result.isValid).toBe(false);
      const hasMolecularWeightError = result.errors.some(e => 
        e.field === 'molecularWeight' || e.message.includes('molecular weight')
      );
      expect(hasMolecularWeightError).toBe(true);
    });

    test('should batch validate compounds', () => {
      const compounds: CompoundDatabase[] = [
        {
          formula: 'H2O',
          name: 'Water',
          molecularWeight: 18.015,
          thermodynamicProperties: {
            deltaHf: -285.8,
            entropy: 69.95,
            heatCapacity: 75.3,
            temperatureRange: [273, 373]
          },
          physicalProperties: {},
          sources: ['test'],
          lastUpdated: new Date(),
          confidence: 0.9
        },
        {
          formula: '', // Invalid
          name: 'Invalid',
          molecularWeight: 0,
          thermodynamicProperties: {
            deltaHf: -10000, // Invalid
            entropy: 50,
            heatCapacity: 75.3,
            temperatureRange: [273, 373]
          },
          physicalProperties: {},
          sources: ['test'],
          lastUpdated: new Date(),
          confidence: 0.9
        }
      ];

      const results = validator.batchValidate(compounds);
      
      expect(results.size).toBe(2);
      expect(results.get('H2O')?.isValid).toBe(true);
      expect(results.get('')?.isValid).toBe(false);
    });

    test('should provide validation summary', () => {
      const compounds: CompoundDatabase[] = [
        {
          formula: 'H2O',
          name: 'Water',
          molecularWeight: 18.015,
          thermodynamicProperties: {
            deltaHf: -285.8,
            entropy: 69.95,
            heatCapacity: 75.3,
            temperatureRange: [273, 373]
          },
          physicalProperties: {},
          sources: ['test'],
          lastUpdated: new Date(),
          confidence: 0.9
        },
        {
          formula: 'Invalid',
          name: 'Invalid',
          molecularWeight: -1, // Invalid
          thermodynamicProperties: {
            deltaHf: -10000, // Invalid
            entropy: 50,
            heatCapacity: 75.3,
            temperatureRange: [273, 373]
          },
          physicalProperties: {},
          sources: ['test'],
          lastUpdated: new Date(),
          confidence: 0.9
        }
      ];

      const results = validator.batchValidate(compounds);
      const summary = validator.getValidationSummary(results);
      
      expect(summary.totalCompounds).toBe(2);
      expect(summary.validCompounds).toBe(1);
      expect(summary.averageScore).toBeGreaterThan(0);
      expect(summary.averageScore).toBeLessThan(100);
    });
  });

  describe('Integration Tests', () => {
    test('should integrate database manager with NIST integration', async () => {
      const dbManager = new ChemicalDatabaseManager();
      const nistIntegration = new NISTWebBookIntegration();

      // Query NIST for a compound
      const nistCompound = await nistIntegration.queryCompound('O2', 'formula');
      expect(nistCompound).not.toBeNull();

      // Add to database
      const success = await dbManager.addCompound(nistCompound!);
      expect(success).toBe(true);

      // Verify it's in the database
      const query = await dbManager.query({ formula: 'O2' });
      expect(query).toHaveLength(1);
      expect(query[0].sources).toContain('nist');
    });

    test('should validate compounds from database manager', async () => {
      const dbManager = new ChemicalDatabaseManager();
      const validator = new DataValidationService();

      const compounds = dbManager.getAllCompounds();
      expect(compounds.length).toBeGreaterThan(0);

      const results = validator.batchValidate(compounds);
      const summary = validator.getValidationSummary(results);

      expect(summary.totalCompounds).toBe(compounds.length);
      expect(summary.validCompounds).toBeGreaterThan(0);
      expect(summary.averageScore).toBeGreaterThan(70); // Default compounds should be high quality
    });
  });
});
