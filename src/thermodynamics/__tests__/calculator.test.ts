/**
 * Tests for ThermodynamicsCalculator
 */

import { ThermodynamicsCalculator } from '../calculator';
import { BalancedEquation } from '../../types';

describe('ThermodynamicsCalculator', () => {
  let calculator: ThermodynamicsCalculator;
  
  beforeEach(() => {
    calculator = new ThermodynamicsCalculator();
  });

  describe('calculateThermodynamics', () => {
    it('should calculate thermodynamics for water formation', async () => {
      // Balanced equation: 2 H2 + O2 = 2 H2O
      const equation: BalancedEquation = {
        equation: '2 H2 + O2 = 2 H2O',
        coefficients: [2, 1, 2],
        reactants: ['H2', 'O2'],
        products: ['H2O']
      };

      const result = await calculator.calculateThermodynamics(equation);

      // Water formation is exothermic (negative ΔH)
      expect(result.deltaH).toBeLessThan(0);
      
      // Should be spontaneous at room temperature
      expect(result.spontaneity).toBe('spontaneous');
      
      // Should have valid equilibrium constant
      expect(result.equilibriumConstant).toBeGreaterThan(0);
      
      // Temperature dependence should be defined
      expect(result.temperatureDependence.range).toEqual([200, 800]);
      expect(result.temperatureDependence.deltaGvsT.length).toBeGreaterThan(0);
    });

    it('should calculate thermodynamics for methane combustion', async () => {
      // Balanced equation: CH4 + 2 O2 = CO2 + 2 H2O
      const equation: BalancedEquation = {
        equation: 'CH4 + 2 O2 = CO2 + 2 H2O',
        coefficients: [1, 2, 1, 2],
        reactants: ['CH4', 'O2'],
        products: ['CO2', 'H2O']
      };

      const result = await calculator.calculateThermodynamics(equation);

      // Combustion is highly exothermic
      expect(result.deltaH).toBeLessThan(-500); // kJ/mol
      
      // Should be spontaneous
      expect(result.spontaneity).toBe('spontaneous');
      
      // Should have very large equilibrium constant
      expect(result.equilibriumConstant).toBeGreaterThan(1e10);
    });

    it('should handle custom temperature and pressure conditions', async () => {
      const equation: BalancedEquation = {
        equation: '2 H2 + O2 = 2 H2O',
        coefficients: [2, 1, 2],
        reactants: ['H2', 'O2'],
        products: ['H2O']
      };

      const conditions = {
        temperature: 500, // K
        pressure: 200000  // Pa
      };

      const result = await calculator.calculateThermodynamics(equation, conditions);

      expect(result.conditions.temperature).toBe(500);
      expect(result.conditions.pressure).toBe(200000);
      
      // ΔG should be different at higher temperature
      expect(result.deltaG).toBeDefined();
    });

    it('should generate temperature dependence profile', async () => {
      const equation: BalancedEquation = {
        equation: '2 H2 + O2 = 2 H2O',
        coefficients: [2, 1, 2],
        reactants: ['H2', 'O2'],
        products: ['H2O']
      };

      const result = await calculator.calculateThermodynamics(equation);
      const profile = result.temperatureDependence;

      expect(profile.range).toEqual([200, 800]);
      expect(profile.deltaGvsT.length).toBeGreaterThan(10);
      
      // Each point should have temperature and deltaG
      profile.deltaGvsT.forEach(point => {
        expect(point.temperature).toBeGreaterThanOrEqual(200);
        expect(point.temperature).toBeLessThanOrEqual(800);
        expect(typeof point.deltaG).toBe('number');
      });
    });

    it('should handle unknown compounds gracefully', async () => {
      const equation: BalancedEquation = {
        equation: 'UnknownA + UnknownB = UnknownC',
        coefficients: [1, 1, 1],
        reactants: ['UnknownA', 'UnknownB'],
        products: ['UnknownC']
      };

      const result = await calculator.calculateThermodynamics(equation);

      // Should complete without throwing error (using estimates)
      expect(result.deltaH).toBeDefined();
      expect(result.deltaS).toBeDefined();
      expect(result.deltaG).toBeDefined();
    });

    it('should calculate thermodynamics for glucose combustion (cellular respiration)', async () => {
      // Balanced equation: C6H12O6 + 6 O2 = 6 CO2 + 6 H2O
      const equation: BalancedEquation = {
        equation: 'C6H12O6 + 6 O2 = 6 CO2 + 6 H2O',
        coefficients: [1, 6, 6, 6],
        reactants: ['C6H12O6', 'O2'],
        products: ['CO2', 'H2O']
      };

      const result = await calculator.calculateThermodynamics(equation);

      // Glucose combustion should be highly exothermic
      expect(result.deltaH).toBeLessThan(-1000); // Very negative ΔH
      
      // Should be spontaneous (biological reactions must be!)
      expect(result.spontaneity).toBe('spontaneous');
      expect(result.deltaG).toBeLessThan(0);
      
      // Should have large equilibrium constant
      expect(result.equilibriumConstant).toBeGreaterThan(1e100);
      
      // Entropy should increase (1 solid + 6 gases → 12 gases)
      expect(result.deltaS).toBeGreaterThan(0);
      
      // Temperature dependence should be defined
      expect(result.temperatureDependence.range).toEqual([200, 800]);
      expect(result.temperatureDependence.deltaGvsT.length).toBeGreaterThan(0);
      
      console.log('🍯 Glucose Combustion Results:');
      console.log(`   ΔH = ${result.deltaH.toFixed(1)} kJ/mol (highly exothermic)`);
      console.log(`   ΔG = ${result.deltaG.toFixed(1)} kJ/mol (${result.spontaneity})`);
      console.log(`   K = ${result.equilibriumConstant.toExponential(2)} (essentially complete)`);
      console.log(`   This is the reaction that powers all aerobic life! 🧬`);
    });
  });

  describe('thermodynamic calculations', () => {
    it('should correctly calculate Gibbs free energy', async () => {
      const equation: BalancedEquation = {
        equation: '2 H2 + O2 = 2 H2O',
        coefficients: [2, 1, 2],
        reactants: ['H2', 'O2'],
        products: ['H2O']
      };

      const result = await calculator.calculateThermodynamics(equation);
      
      // ΔG = ΔH - TΔS (at 298.15 K)
      const expectedDeltaG = result.deltaH - (298.15 * result.deltaS);
      expect(Math.abs(result.deltaG - expectedDeltaG)).toBeLessThan(0.1);
    });

    it('should determine spontaneity correctly', async () => {
      const equation: BalancedEquation = {
        equation: 'CH4 + 2 O2 = CO2 + 2 H2O',
        coefficients: [1, 2, 1, 2],
        reactants: ['CH4', 'O2'],
        products: ['CO2', 'H2O']
      };

      const result = await calculator.calculateThermodynamics(equation);
      
      // Combustion should be spontaneous (ΔG < 0)
      expect(result.deltaG).toBeLessThan(0);
      expect(result.spontaneity).toBe('spontaneous');
    });

    it('should calculate equilibrium constant from Gibbs energy', async () => {
      const equation: BalancedEquation = {
        equation: '2 H2 + O2 = 2 H2O',
        coefficients: [2, 1, 2],
        reactants: ['H2', 'O2'],
        products: ['H2O']
      };

      const result = await calculator.calculateThermodynamics(equation);
      
      // K = exp(-ΔG / RT)
      const R = 8.314; // J/(mol·K)
      const T = 298.15; // K
      const expectedK = Math.exp(-(result.deltaG * 1000) / (R * T));
      
      expect(Math.abs(result.equilibriumConstant - expectedK)).toBeLessThan(expectedK * 0.01);
    });
  });
});
