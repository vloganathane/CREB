import { EnhancedBalancer } from '../enhancedBalancerSimple';
import { 
  ChemicalFormula, 
  ElementSymbol, 
  isElementSymbol, 
  isChemicalFormula,
  TypedElementCount,
  TypedCompound,
  parseFormula,
  createChemicalFormula
} from '../advancedTypes';

describe('Enhanced Balancer with Advanced TypeScript Support', () => {
  let balancer: EnhancedBalancer;

  beforeEach(() => {
    balancer = new EnhancedBalancer();
  });

  describe('Type Safety Features', () => {
    test('validates element symbols', () => {
      expect(isElementSymbol('H')).toBe(true);
      expect(isElementSymbol('O')).toBe(true);
      expect(isElementSymbol('Carbon')).toBe(false);
      expect(isElementSymbol('xyz')).toBe(false);
    });

    test('validates chemical formulas', () => {
      expect(isChemicalFormula('H2O')).toBe(true);
      expect(isChemicalFormula('CO2')).toBe(true);
      expect(isChemicalFormula('H2SO4')).toBe(true);
      expect(isChemicalFormula('invalid')).toBe(false);
      expect(isChemicalFormula('')).toBe(false);
    });

    test('type guards work correctly', () => {
      const formula = 'H2O' as string;
      if (isChemicalFormula(formula)) {
        // TypeScript should know this is now a ChemicalFormula
        const typedFormula = createChemicalFormula(formula);
        expect(typedFormula).toBe('H2O');
      }
    });
  });

  describe('Enhanced Balancing', () => {
    test('balances simple equations with enhanced features', () => {
      const result = balancer.balance('H2 + O2 = H2O');
      
      expect(result.isBalanced).toBe(true);
      expect(result.equation).toBe('2 H2 + O2 = 2 H2O');
      expect(result.compounds).toBeDefined();
      expect(result.compounds.length).toBe(3);
      
      // Check compound analysis
      const water = result.compounds.find(c => c.formula === 'H2O');
      expect(water).toBeDefined();
      expect(water?.molarMass).toBeCloseTo(18.015, 2);
      expect(water?.elements).toEqual(['H', 'O']);
    });

    test('provides detailed compound information', () => {
      const result = balancer.balance('CH4 + O2 = CO2 + H2O');
      
      expect(result.isBalanced).toBe(true);
      expect(result.compounds).toBeDefined();
      
      const methane = result.compounds.find(c => c.formula === 'CH4');
      expect(methane).toBeDefined();
      expect(methane?.molarMass).toBeCloseTo(16.043, 2);
      expect(methane?.elements).toContain('C');
      expect(methane?.elements).toContain('H');
      
      const co2 = result.compounds.find(c => c.formula === 'CO2');
      expect(co2).toBeDefined();
      expect(co2?.molarMass).toBeCloseTo(44.009, 2);
    });

    test('handles complex equations', () => {
      const result = balancer.balance('Ca(OH)2 + HCl = CaCl2 + H2O');
      
      expect(result.isBalanced).toBe(true);
      expect(result.compounds).toBeDefined();
      
      const calcium_hydroxide = result.compounds.find(c => c.formula === 'Ca(OH)2');
      expect(calcium_hydroxide).toBeDefined();
      expect(calcium_hydroxide?.elements).toContain('Ca');
      expect(calcium_hydroxide?.elements).toContain('O');
      expect(calcium_hydroxide?.elements).toContain('H');
    });
  });

  describe('Formula Parsing with Types', () => {
    test('parses formulas correctly', () => {
      const h2o = parseFormula('H2O' as ChemicalFormula);
      expect(h2o).toEqual({
        H: 2,
        O: 1
      });

      const h2so4 = parseFormula('H2SO4' as ChemicalFormula);
      expect(h2so4).toEqual({
        H: 2,
        S: 1,
        O: 4
      });
    });

    test('handles complex formulas with parentheses', () => {
      const caoh2 = parseFormula('Ca(OH)2' as ChemicalFormula);
      expect(caoh2).toEqual({
        Ca: 1,
        O: 2,
        H: 2
      });
    });
  });

  describe('Type-Safe Chemical Data', () => {
    test('provides type-safe compound data structure', () => {
      const result = balancer.balance('NaCl + AgNO3 = AgCl + NaNO3');
      
      expect(result.isBalanced).toBe(true);
      
      // Verify the TypedCompoundInfo structure
      result.compounds.forEach(compound => {
        expect(typeof compound.formula).toBe('string');
        expect(typeof compound.molarMass).toBe('number');
        expect(Array.isArray(compound.elements)).toBe(true);
        expect(compound.molarMass).toBeGreaterThan(0);
        
        // Each element should be a valid element symbol
        compound.elements.forEach(element => {
          expect(isElementSymbol(element)).toBe(true);
        });
      });
    });

    test('maintains consistency across balance operations', () => {
      const equations = [
        'H2 + Cl2 = HCl',
        'Na + Cl2 = NaCl',
        'Mg + O2 = MgO'
      ];

      equations.forEach(eq => {
        const result = balancer.balance(eq);
        expect(result.isBalanced).toBe(true);
        expect(result.compounds).toBeDefined();
        expect(result.compounds.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Error Handling', () => {
    test('handles invalid equations gracefully', () => {
      const result = balancer.balance('invalid equation');
      
      // Should not throw, but should indicate failure
      expect(result.isBalanced).toBe(false);
      expect(result.equation).toBe('invalid equation'); // Returns original
    });

    test('provides meaningful error information', () => {
      // Test with malformed equation
      const result = balancer.balance('H2 +');
      expect(result.isBalanced).toBe(false);
    });
  });
});

describe('Advanced Type Features Demonstration', () => {
  test('demonstrates branded types in action', () => {
    // These are compile-time checks, but we can test runtime behavior
    const validFormula = 'H2O';
    const invalidFormula = 'invalid';

    if (isChemicalFormula(validFormula)) {
      // TypeScript knows this is now ChemicalFormula
      const elements = parseFormula(validFormula);
      expect(elements).toBeDefined();
    }

    expect(isChemicalFormula(invalidFormula)).toBe(false);
  });

  test('demonstrates generic constraints', () => {
    // The parseFormula function only accepts ChemicalFormula
    const formula = 'CO2' as ChemicalFormula;
    const elements = parseFormula(formula);
    
    expect(elements.C).toBe(1);
    expect(elements.O).toBe(2);
  });

  test('demonstrates type-safe data structures', () => {
    const balancer = new EnhancedBalancer();
    const result = balancer.balance('H2 + O2 = H2O');

    // TypeScript ensures these properties exist and have correct types
    expect(typeof result.isBalanced).toBe('boolean');
    expect(typeof result.equation).toBe('string');
    expect(Array.isArray(result.compounds)).toBe(true);

    if (result.compounds.length > 0) {
      const compound = result.compounds[0];
      expect(typeof compound.formula).toBe('string');
      expect(typeof compound.molarMass).toBe('number');
      expect(Array.isArray(compound.elements)).toBe(true);
    }
  });
});
