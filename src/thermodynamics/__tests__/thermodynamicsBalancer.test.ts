import { ThermodynamicsEquationBalancer } from '../thermodynamicsBalancer';

describe('ThermodynamicsEquationBalancer', () => {
  let balancer: ThermodynamicsEquationBalancer;

  beforeEach(() => {
    balancer = new ThermodynamicsEquationBalancer();
  });

  describe('balanceWithThermodynamics', () => {
    it('should balance a simple combustion reaction with thermodynamic analysis', async () => {
      const equation = 'C2H6 + O2 = CO2 + H2O';
      const result = await balancer.balanceWithThermodynamics(equation);

      expect(result.balanced).toBeDefined();
      expect(result.coefficients).toBeDefined();
      expect(result.thermodynamics).toBeDefined();
      expect(result.reactionType).toBeDefined();
      expect(result.feasibility).toBeDefined();
      expect(result.safetyLevel).toBeDefined();
      expect(result.spontaneous).toBeDefined();
      expect(result.equilibriumConstant).toBeDefined();
    });

    it('should classify combustion reactions correctly', async () => {
      const equation = 'CH4 + O2 = CO2 + H2O';
      const result = await balancer.balanceWithThermodynamics(equation);

      expect(result.reactionType).toBe('combustion');
      expect(result.safetyWarnings.length).toBeGreaterThan(0);
      expect(result.industrialApplications).toContain('Power generation');
    });

    it('should assess reaction feasibility based on thermodynamics', async () => {
      const equation = 'N2 + H2 = NH3';
      const result = await balancer.balanceWithThermodynamics(equation);

      expect(['highly_favorable', 'favorable', 'marginally_favorable', 'equilibrium', 'unfavorable', 'highly_unfavorable'])
        .toContain(result.feasibility);
    });

    it('should provide safety assessment', async () => {
      const equation = 'H2 + O2 = H2O';
      const result = await balancer.balanceWithThermodynamics(equation);

      expect(['safe', 'caution', 'warning', 'danger', 'extreme_danger'])
        .toContain(result.safetyLevel);
    });

    it('should calculate equilibrium constant', async () => {
      const equation = 'H2 + Cl2 = HCl';
      const result = await balancer.balanceWithThermodynamics(equation);

      expect(result.equilibriumConstant).toBeGreaterThan(0);
      expect(typeof result.equilibriumConstant).toBe('number');
    });

    it('should analyze pressure effects', async () => {
      const equation = 'N2 + H2 = NH3';
      const result = await balancer.balanceWithThermodynamics(equation);

      expect(result.pressureEffects).toBeDefined();
      expect(typeof result.pressureEffects).toBe('string');
    });

    it('should provide recommendations', async () => {
      const equation = 'CaCO3 = CaO + CO2';
      const result = await balancer.balanceWithThermodynamics(equation);

      expect(Array.isArray(result.recommendations)).toBe(true);
      expect(Array.isArray(result.safetyWarnings)).toBe(true);
      expect(Array.isArray(result.realWorldExamples)).toBe(true);
    });
  });

  describe('findOptimalConditions', () => {
    it('should find optimal conditions for a reaction', async () => {
      const equation = 'N2 + H2 = NH3';
      const conditions = await balancer.findOptimalConditions(equation);

      expect(conditions.temperature).toBeGreaterThan(0);
      expect(conditions.pressure).toBeGreaterThan(0);
      expect(conditions.yield).toBeGreaterThanOrEqual(0);
      expect(conditions.yield).toBeLessThanOrEqual(100);
      expect(Array.isArray(conditions.reasoning)).toBe(true);
    });

    it('should provide reasoning for optimal conditions', async () => {
      const equation = 'H2 + I2 = HI';
      const conditions = await balancer.findOptimalConditions(equation);

      expect(conditions.reasoning.length).toBeGreaterThan(0);
      expect(conditions.reasoning[0]).toContain('temperature');
    });
  });

  describe('reaction classification', () => {
    it('should classify synthesis reactions', async () => {
      const equation = 'Na + Cl2 = NaCl';
      const result = await balancer.balanceWithThermodynamics(equation);

      expect(result.reactionType).toBe('synthesis');
    });

    it('should classify decomposition reactions', async () => {
      const equation = 'CaCO3 = CaO + CO2';
      const result = await balancer.balanceWithThermodynamics(equation);

      expect(result.reactionType).toBe('decomposition');
    });

    it('should classify biological reactions', async () => {
      const equation = 'C6H12O6 + O2 = CO2 + H2O';
      const result = await balancer.balanceWithThermodynamics(equation);

      expect(result.reactionType).toBe('biological');
      expect(result.industrialApplications).toContain('Biofuel production');
    });
  });

  describe('error handling', () => {
    it('should handle invalid equations gracefully', async () => {
      const equation = 'invalid equation';
      
      await expect(balancer.balanceWithThermodynamics(equation))
        .rejects.toThrow();
    });

    it('should handle empty equations', async () => {
      const equation = '';
      
      await expect(balancer.balanceWithThermodynamics(equation))
        .rejects.toThrow();
    });
  });

  describe('temperature and pressure analysis', () => {
    it('should provide temperature range recommendations', async () => {
      const equation = 'SO2 + O2 = SO3';
      const result = await balancer.balanceWithThermodynamics(equation);

      expect(result.temperatureRange.min).toBeLessThan(result.temperatureRange.max);
      expect(result.temperatureRange.min).toBeGreaterThan(0);
    });

    it('should calculate optimal temperature', async () => {
      const equation = 'CO + H2 = CH3OH';
      const result = await balancer.balanceWithThermodynamics(equation);

      if (result.optimalTemperature) {
        expect(result.optimalTemperature).toBeGreaterThan(0);
        expect(result.optimalTemperature).toBeLessThan(1000);
      }
    });
  });
});
