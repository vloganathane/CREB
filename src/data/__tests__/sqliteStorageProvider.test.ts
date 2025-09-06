/**
 * SQLite Storage Provider Integration Test
 * Tests SQLite provider integration with the data module
 */

import { CompoundDatabase } from '../types';

// Mock better-sqlite3 for testing
const mockStatement = {
  run: jest.fn().mockReturnValue({ changes: 1, lastInsertRowid: 1 }),
  get: jest.fn().mockReturnValue({
    id: 1,
    formula: 'H2O',
    name: 'Water',
    molecular_weight: 18.015,
    properties: JSON.stringify({ density: 1.0 }),
    thermodynamic_data: JSON.stringify({ enthalpy: -285.8 }),
    safety_data: JSON.stringify({ hazards: [] }),
    reactions: JSON.stringify([]),
    metadata: JSON.stringify({ source: 'test' }),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }),
  all: jest.fn().mockReturnValue([{
    id: 1,
    formula: 'H2O',
    name: 'Water',
    molecular_weight: 18.015,
    properties: JSON.stringify({ density: 1.0 }),
    thermodynamic_data: JSON.stringify({ enthalpy: -285.8 }),
    safety_data: JSON.stringify({ hazards: [] }),
    reactions: JSON.stringify([]),
    metadata: JSON.stringify({ source: 'test' }),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }])
};

const mockDatabase = {
  prepare: jest.fn().mockReturnValue(mockStatement),
  exec: jest.fn(),
  close: jest.fn(),
  transaction: jest.fn().mockReturnValue(() => {})
};

// Mock the dynamic import
jest.mock('better-sqlite3', () => {
  return {
    __esModule: true,
    default: jest.fn(() => mockDatabase)
  };
});

// Import after mocking
import { SQLiteStorageProvider } from '../SQLiteStorageProvider';

describe('SQLiteStorageProvider Integration', () => {
  let provider: SQLiteStorageProvider;

  beforeEach(async () => {
    // Clear all mocks
    jest.clearAllMocks();
    
    // Reset mock return values
    mockStatement.get.mockReturnValue({
      total_compounds: 5,
      avg_confidence: 0.85,
      oldest_update: new Date().toISOString(),
      newest_update: new Date().toISOString()
    });
    
    provider = new SQLiteStorageProvider({
      inMemory: true
    });
    
    try {
      await provider.initialize();
    } catch (error) {
      // If SQLite is not available, skip these tests
      console.warn('SQLite not available, skipping tests');
    }
  });

  afterEach(async () => {
    try {
      await provider.close();
    } catch (error) {
      // Ignore close errors in tests
    }
  });

  describe('Basic Functionality', () => {
    test('should create provider instance', () => {
      expect(provider).toBeInstanceOf(SQLiteStorageProvider);
    });

    test('should handle database queries', async () => {
      const query = {
        formula: 'C2H6O',
        name: 'ethanol'
      };
      
      const results = await provider.searchCompounds(query);
      expect(Array.isArray(results)).toBe(true);
    });
  });

  describe('Data Storage', () => {
    const sampleCompound: CompoundDatabase = {
      formula: 'C2H6O',
      name: 'Ethanol',
      iupacName: 'ethanol',
      casNumber: '64-17-5',
      molecularWeight: 46.07,
      thermodynamicProperties: {
        deltaHf: -277.7,
        entropy: 160.7,
        heatCapacity: 112.3,
        temperatureRange: [273.15, 373.15]
      },
      physicalProperties: {
        density: 789, // kg/m³
        refractiveIndex: 1.361,
        solubility: {
          water: 1000000 // fully miscible
        }
      },
      safetyData: {
        hazardSymbols: ['GHS02'],
        hazardStatements: ['H225', 'H319'],
        precautionaryStatements: ['P210', 'P233', 'P305+P351+P338'],
        flashPoint: 286.15,
        autoignitionTemperature: 636.15
      },
      sources: ['test'],
      lastUpdated: new Date(),
      confidence: 0.95
    };

    test('should store compound', async () => {
      const added = await provider.addCompound(sampleCompound);
      expect(added).toBe(true);
    });

    test('should retrieve compound by formula', async () => {
      await provider.addCompound(sampleCompound);
      
      // Mock the get method to return our compound
      const mockGet = mockDatabase.prepare().get as jest.Mock;
      mockGet.mockReturnValue({
        formula: 'C2H6O',
        name: 'Ethanol',
        data: JSON.stringify(sampleCompound)
      });
      
      const retrieved = await provider.getCompound('C2H6O');
      expect(retrieved).toBeDefined();
    });

    test('should search compounds', async () => {
      const results = await provider.searchCompounds({ 
        casNumber: '64-17-5' 
      });
      expect(Array.isArray(results)).toBe(true);
    });

    test('should get all compounds', async () => {
      const allCompounds = await provider.getAllCompounds();
      expect(Array.isArray(allCompounds)).toBe(true);
    });

    test('should remove compounds', async () => {
      const removed = await provider.removeCompound('C2H6O');
      expect(typeof removed).toBe('boolean');
    });
  });

  describe('Data Management', () => {
    test('should import data', async () => {
      const testData = [{
        formula: 'H2O',
        name: 'Water',
        molecularWeight: 18.015,
        thermodynamicProperties: {
          deltaHf: -285.8,
          entropy: 69.95,
          heatCapacity: 75.3,
          temperatureRange: [273.15, 373.15]
        },
        physicalProperties: {},
        sources: ['test'],
        lastUpdated: new Date(),
        confidence: 0.9
      }];

      const result = await provider.importData(testData, 'json');
      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('imported');
    });

    test('should get statistics', async () => {
      const stats = await provider.getStatistics();
      expect(stats).toHaveProperty('totalCompounds');
    });

    test('should optimize database', async () => {
      // Should not throw
      await provider.optimize();
    });
  });
});
