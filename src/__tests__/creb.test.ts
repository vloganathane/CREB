import { ChemicalEquationBalancer } from '../balancer';
import { Stoichiometry } from '../stoichiometry';
import { calculateMolarWeight } from '../utils';

describe('ChemicalEquationBalancer', () => {
  let balancer: ChemicalEquationBalancer;

  beforeEach(() => {
    balancer = new ChemicalEquationBalancer();
  });

  test('should balance simple equations', () => {
    const result = balancer.balance('H2 + O2 = H2O');
    expect(result).toBe('2 H2 + O2 = 2 H2O');
  });

  test('should balance more complex equations', () => {
    const result = balancer.balance('Fe + O2 = Fe2O3');
    expect(result).toBe('4 Fe + 3 O2 = 2 Fe2O3');
  });

  test('should handle equations with different formulations', () => {
    const result = balancer.balance('C + O2 = CO2');
    expect(result).toBe('C + O2 = CO2');
  });

  test('should return detailed balance information', () => {
    const result = balancer.balanceDetailed('H2 + O2 = H2O');
    expect(result.coefficients).toEqual([2, 1, 2]);
    expect(result.reactants).toEqual(['H2', 'O2']);
    expect(result.products).toEqual(['H2O']);
  });

  test('should handle equations with existing coefficients', () => {
    // Should ignore existing coefficients and calculate correct ones
    const result1 = balancer.balance('CuSO4 + 4 NH3 = [Cu(NH3)4]SO4');
    expect(result1).toBe('CuSO4 + 4 NH3 = [Cu(NH3)4]SO4');
    
    const result2 = balancer.balance('2 H2 + O2 = 2 H2O');
    expect(result2).toBe('2 H2 + O2 = 2 H2O');
    
    // Should work the same without existing coefficients
    const result3 = balancer.balance('CuSO4 + NH3 = [Cu(NH3)4]SO4');
    expect(result3).toBe('CuSO4 + 4 NH3 = [Cu(NH3)4]SO4');
  });

  test('should handle coordination complexes', () => {
    const result = balancer.balance('CuSO4 + NH3 = [Cu(NH3)4]SO4');
    expect(result).toBe('CuSO4 + 4 NH3 = [Cu(NH3)4]SO4');
  });
});

describe('Stoichiometry', () => {
  test('should calculate molar weight correctly', () => {
    expect(calculateMolarWeight('H2O')).toBe(18.015);
    expect(calculateMolarWeight('CO2')).toBe(44.009);
    expect(calculateMolarWeight('Ca(OH)2')).toBe(74.092);
  });

  test('should perform stoichiometric calculations from moles', () => {
    const stoich = new Stoichiometry('H2 + O2 = H2O');
    const result = stoich.calculateFromMoles('H2', 2);
    
    expect(result.reactants['H2'].moles).toBe(2);
    expect(result.reactants['O2'].moles).toBe(1);
    expect(result.products['H2O'].moles).toBe(2);
    
    // Check mass calculations
    expect(result.reactants['H2'].grams).toBeCloseTo(4.032, 1);
    expect(result.products['H2O'].grams).toBeCloseTo(36.03, 1);
  });

  test('should perform stoichiometric calculations from grams', () => {
    const stoich = new Stoichiometry('H2 + O2 = H2O');
    const result = stoich.calculateFromGrams('H2O', 18.015);
    
    expect(result.products['H2O'].moles).toBe(1);
    expect(result.reactants['H2'].moles).toBe(1);
    expect(result.reactants['O2'].moles).toBe(0.5);
  });

  test('should get species information', () => {
    const stoich = new Stoichiometry('H2 + O2 = H2O');
    const info = stoich.getSpeciesInfo();
    
    expect(info['H2'].type).toBe('reactant');
    expect(info['H2O'].type).toBe('product');
    expect(info['H2O'].molarWeight).toBe(18.015);
  });

  test('should calculate ratios correctly', () => {
    const stoich = new Stoichiometry('H2 + O2 = H2O');
    const ratios = stoich.calculateRatios('H2');
    
    expect(ratios).toEqual([1, 0.5, 1]);
  });
});

describe('Utility Functions', () => {
  test('calculateMolarWeight should handle complex formulas', () => {
    expect(calculateMolarWeight('CaCl2')).toBeCloseTo(110.98, 2);
    expect(calculateMolarWeight('Ca(OH)2')).toBeCloseTo(74.092, 2);
    expect(calculateMolarWeight('Al2(SO4)3')).toBeCloseTo(342.132, 2);
  });

  test('should throw error for unknown elements', () => {
    expect(() => calculateMolarWeight('Xx')).toThrow('Unknown element: Xx');
  });
});
