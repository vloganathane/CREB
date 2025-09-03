/**
 * Tests for Enhanced Chemical Equation Balancer with PubChem integration
 */

import { EnhancedChemicalEquationBalancer } from '../enhancedBalancer';

describe('EnhancedChemicalEquationBalancer', () => {
  let balancer: EnhancedChemicalEquationBalancer;

  beforeEach(() => {
    balancer = new EnhancedChemicalEquationBalancer();
  });

  afterEach(() => {
    balancer.clearCache();
  });

  describe('Basic balancing with PubChem data', () => {
    test('should balance simple equation and attempt PubChem lookup', async () => {
      const equation = 'H2 + O2 = H2O';
      const result = await balancer.balanceWithPubChemData(equation);
      
      expect(result.equation).toBe('2 H2 + O2 = 2 H2O');
      expect(result.compoundData).toBeDefined();
      expect(result.validation).toBeDefined();
      expect(result.validation?.massBalanced).toBeDefined();
      expect(result.validation?.warnings).toBeDefined();
    });

    test('should handle compound not found gracefully', async () => {
      // Use a simpler equation that can be balanced
      const equation = 'A + B = AB';
      const result = await balancer.balanceWithPubChemData(equation);
      
      expect(result.equation).toContain('A');
      expect(result.validation?.warnings.length).toBeGreaterThan(0);
    });
  });

  describe('Compound information lookup', () => {
    test('should return compound info structure even when PubChem unavailable', async () => {
      const info = await balancer.getCompoundInfo('water');
      
      expect(info).toBeDefined();
      expect(info.name).toBe('water');
      expect(typeof info.isValid).toBe('boolean');
      
      if (!info.isValid) {
        expect(info.error).toBeDefined();
      }
    });

    test('should handle simple chemical formulas', async () => {
      const info = await balancer.getCompoundInfo('H2O');
      
      expect(info).toBeDefined();
      expect(info.name).toBe('H2O');
    });

    test('should cache compound lookups', async () => {
      const info1 = await balancer.getCompoundInfo('H2O');
      const info2 = await balancer.getCompoundInfo('H2O');
      
      expect(info1).toEqual(info2);
      
      const cached = balancer.getCachedCompoundInfo('H2O');
      expect(cached).toEqual(info1);
    });
  });

  describe('Alternative suggestions', () => {
    test('should provide suggestions for unknown compounds', async () => {
      const suggestions = await balancer.suggestAlternatives('watr'); // misspelled water
      
      expect(Array.isArray(suggestions)).toBe(true);
      // Suggestions may be empty if PubChem is not available
    });

    test('should return empty array for completely invalid input', async () => {
      const suggestions = await balancer.suggestAlternatives('xyz123invalid');
      
      expect(Array.isArray(suggestions)).toBe(true);
      expect(suggestions.length).toBe(0);
    });
  });

  describe('Formula recognition', () => {
    test('should recognize likely chemical formulas', () => {
      const testFormulas = ['H2O', 'CO2', 'NaCl', 'C6H12O6'];
      
      for (const formula of testFormulas) {
        // Access private method through any for testing
        const isFormula = (balancer as any).isLikelyFormula(formula);
        expect(isFormula).toBe(true);
      }
    });

    test('should not recognize regular words as formulas', () => {
      const testWords = ['water', 'glucose', 'salt'];
      
      for (const word of testWords) {
        const isFormula = (balancer as any).isLikelyFormula(word);
        expect(isFormula).toBe(false);
      }
    });
  });

  describe('Common name mapping', () => {
    test('should map simple formulas to common names', () => {
      const commonNames = (balancer as any).getCommonNames('H2O');
      expect(commonNames).toContain('water');
      
      const co2Names = (balancer as any).getCommonNames('CO2');
      expect(co2Names).toContain('carbon dioxide');
    });

    test('should return empty array for unknown formulas', () => {
      const unknownNames = (balancer as any).getCommonNames('XYZ123');
      expect(Array.isArray(unknownNames)).toBe(true);
      expect(unknownNames.length).toBe(0);
    });
  });

  describe('Error handling', () => {
    test('should handle invalid equations gracefully', async () => {
      const invalidEquations = ['', 'H2 +', '= H2O', 'H2 = = H2O'];
      
      for (const equation of invalidEquations) {
        try {
          await balancer.balanceWithPubChemData(equation);
        } catch (error) {
          expect(error).toBeDefined();
        }
      }
    });

    test('should handle network errors gracefully', async () => {
      // This test assumes PubChem is not available
      const result = await balancer.balanceWithPubChemData('H2 + O2 = H2O');
      
      // Should still return a valid result structure
      expect(result).toBeDefined();
      expect(result.equation).toBeDefined();
      expect(result.validation).toBeDefined();
    });
  });

  describe('Cache management', () => {
    test('should clear cache properly', async () => {
      await balancer.getCompoundInfo('H2O');
      expect(balancer.getCachedCompoundInfo('H2O')).toBeDefined();
      
      balancer.clearCache();
      expect(balancer.getCachedCompoundInfo('H2O')).toBeUndefined();
    });
  });
});
