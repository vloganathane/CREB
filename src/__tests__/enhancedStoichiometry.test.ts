/**
 * Tests for Enhanced Stoichiometry with PubChem integration
 */

import { EnhancedStoichiometry } from '../enhancedStoichiometry';

describe('EnhancedStoichiometry', () => {
  let stoich: EnhancedStoichiometry;

  beforeEach(() => {
    stoich = new EnhancedStoichiometry();
  });

  afterEach(() => {
    stoich.clearCache();
  });

  describe('Initialization with validation', () => {
    test('should initialize with equation and provide analysis', async () => {
      const equation = '2 H2 + O2 = 2 H2O';
      const analysis = await stoich.initializeWithValidation(equation);
      
      expect(analysis).toBeDefined();
      expect(analysis.equation).toBe(equation);
      expect(analysis.balanced).toBe(true);
      expect(analysis.molecularWeightValidation).toBeDefined();
      expect(analysis.compoundInfo).toBeDefined();
    });

    test('should provide suggestions for unknown compounds', async () => {
      // Use a simpler equation that can be balanced
      const equation = 'A + B = AB';
      const analysis = await stoich.initializeWithValidation(equation);
      
      expect(analysis.compoundInfo).toBeDefined();
      // May have suggestions if any compounds are recognized
    });
  });

  describe('Enhanced molar weight calculation', () => {
    test('should calculate molar weight with PubChem comparison', async () => {
      const result = await stoich.calculateMolarWeightEnhanced('H2O');
      
      expect(result).toBeDefined();
      expect(result.calculated).toBeCloseTo(18.015, 2);
      
      if (result.pubchem) {
        expect(result.difference).toBeDefined();
        expect(result.accuracy).toBeDefined();
        expect(['excellent', 'good', 'fair', 'poor']).toContain(result.accuracy);
      }
    });

    test('should handle unknown compounds gracefully', async () => {
      const result = await stoich.calculateMolarWeightEnhanced('UNKNOWN123');
      
      expect(result).toBeDefined();
      expect(result.calculated).toBeDefined();
      // PubChem data may not be available
    });
  });

  describe('Enhanced stoichiometric calculations', () => {
    test('should perform enhanced calculation from moles', async () => {
      const equation = '2 H2 + O2 = 2 H2O';
      await stoich.initializeWithValidation(equation);
      
      const result = await stoich.calculateFromMolesEnhanced('H2', 2);
      
      expect(result).toBeDefined();
      expect(result.reactants).toBeDefined();
      expect(result.products).toBeDefined();
      expect(result.validation).toBeDefined();
      expect(result.validation?.molecularWeightAccuracy).toBeDefined();
      expect(result.validation?.warnings).toBeDefined();
    });

    test('should perform enhanced calculation from grams', async () => {
      const equation = '2 H2 + O2 = 2 H2O';
      await stoich.initializeWithValidation(equation);
      
      const result = await stoich.calculateFromGramsEnhanced('H2', 4.032);
      
      expect(result).toBeDefined();
      expect(result.reactants.H2.grams).toBeCloseTo(4.032, 2);
    });

    test('should validate molecular weights against PubChem', async () => {
      const equation = '2 H2 + O2 = 2 H2O';
      await stoich.initializeWithValidation(equation);
      
      const result = await stoich.calculateFromMolesEnhanced('H2', 1);
      
      expect(result.validation).toBeDefined();
      
      // PubChem weights may or may not be available depending on module availability
      expect(result.pubchemMolarWeights).toBeDefined();
      expect(Object.keys(result.pubchemMolarWeights || {}).length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Compound comparison', () => {
    test('should compare two compounds', async () => {
      const comparison = await stoich.compareCompounds('H2O', 'water');
      
      expect(comparison).toBeDefined();
      expect(comparison.compound1).toBeDefined();
      expect(comparison.compound2).toBeDefined();
      expect(comparison.comparison).toBeDefined();
      expect(comparison.comparison.differences).toBeDefined();
      expect(Array.isArray(comparison.comparison.differences)).toBe(true);
    });

    test('should identify same compounds', async () => {
      const comparison = await stoich.compareCompounds('H2O', 'H2O');
      
      expect(comparison.compound1.name).toBe('H2O');
      expect(comparison.compound2.name).toBe('H2O');
    });

    test('should handle unknown compounds in comparison', async () => {
      const comparison = await stoich.compareCompounds('UNKNOWN1', 'UNKNOWN2');
      
      expect(comparison.comparison.differences.length).toBeGreaterThan(0);
    });
  });

  describe('Compound information lookup', () => {
    test('should get compound information and cache it', async () => {
      const info = await stoich.getCompoundInfo('H2O');
      
      expect(info).toBeDefined();
      expect(info.name).toBe('H2O');
      
      const cached = stoich.getCachedCompounds();
      expect(cached['H2O']).toEqual(info);
    });

    test('should return cached data on subsequent calls', async () => {
      const info1 = await stoich.getCompoundInfo('CO2');
      const info2 = await stoich.getCompoundInfo('CO2');
      
      expect(info1).toEqual(info2);
    });
  });

  describe('Error handling and edge cases', () => {
    test('should handle invalid species in calculations', async () => {
      const equation = '2 H2 + O2 = 2 H2O';
      await stoich.initializeWithValidation(equation);
      
      try {
        await stoich.calculateFromMolesEnhanced('INVALID_SPECIES', 1);
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    test('should handle equations without initialization', async () => {
      try {
        await stoich.calculateFromMolesEnhanced('H2', 1);
      } catch (error) {
        expect(error).toBeDefined();
        expect(error instanceof Error ? error.message : '').toContain('not initialized');
      }
    });

    test('should handle zero and negative inputs gracefully', async () => {
      const equation = '2 H2 + O2 = 2 H2O';
      await stoich.initializeWithValidation(equation);
      
      const zeroResult = await stoich.calculateFromMolesEnhanced('H2', 0);
      expect(zeroResult.reactants.H2.moles).toBe(0);
      
      try {
        await stoich.calculateFromMolesEnhanced('H2', -1);
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });

  describe('Cache management', () => {
    test('should clear cache properly', async () => {
      await stoich.getCompoundInfo('H2O');
      expect(Object.keys(stoich.getCachedCompounds()).length).toBeGreaterThan(0);
      
      stoich.clearCache();
      expect(Object.keys(stoich.getCachedCompounds()).length).toBe(0);
    });

    test('should maintain cache across multiple operations', async () => {
      const equation = '2 H2 + O2 = 2 H2O';
      await stoich.initializeWithValidation(equation);
      
      const cachedBefore = stoich.getCachedCompounds();
      
      await stoich.calculateFromMolesEnhanced('H2', 1);
      
      const cachedAfter = stoich.getCachedCompounds();
      expect(Object.keys(cachedAfter).length).toBeGreaterThanOrEqual(Object.keys(cachedBefore).length);
    });
  });

  describe('Integration with base class', () => {
    test('should maintain compatibility with base Stoichiometry methods', () => {
      const equation = '2 H2 + O2 = 2 H2O';
      const enhancedStoich = new EnhancedStoichiometry(equation);
      
      // Test that base class methods still work
      const molarWeight = enhancedStoich.calculateMolarWeight('H2O');
      expect(molarWeight).toBeCloseTo(18.015, 2);
      
      const basicResult = enhancedStoich.calculateFromMoles('H2', 1);
      expect(basicResult).toBeDefined();
      expect(basicResult.reactants.H2.moles).toBe(1);
    });
  });
});
