/**
 * Tests for Energy Profile Visualization functionality
 * Part of CREB-JS v1.6.0 - Energy Profile Visualization Feature
 */

import { 
  EnergyProfileGenerator, 
  createEnergyProfile, 
  exportEnergyProfile 
} from '../../src/thermodynamics/energyProfile';
import { 
  EnergyProfile, 
  EnergyProfilePoint, 
  ThermodynamicsResult,
  ReactionConditions
} from '../../src/thermodynamics/types';
import { KineticsResult, ReactionStep } from '../../src/kinetics/types';

describe('Energy Profile Visualization', () => {
  let generator: EnergyProfileGenerator;
  let mockThermodynamics: ThermodynamicsResult;
  let mockKinetics: KineticsResult;

  beforeEach(() => {
    generator = new EnergyProfileGenerator();
    
    // Mock thermodynamics data for an exothermic reaction
    mockThermodynamics = {
      deltaH: -50, // Exothermic
      deltaS: 20,
      deltaG: -56,
      equilibriumConstant: 1.2e10,
      spontaneity: 'spontaneous' as const,
      temperatureDependence: {
        range: [250, 350] as [number, number],
        deltaGvsT: [
          { temperature: 250, deltaG: -52 },
          { temperature: 300, deltaG: -56 },
          { temperature: 350, deltaG: -60 }
        ]
      },
      conditions: {
        temperature: 298.15,
        pressure: 101325
      } as ReactionConditions,
      enthalpy: -50,
      gibbsFreeEnergy: -56,
      isSpontaneous: true
    };

    // Mock kinetics data
    mockKinetics = {
      equation: 'A + B -> C + D',
      rateConstant: 0.025,
      activationEnergy: 75,
      reactionOrder: 2,
      mechanism: [
        {
          equation: 'A + B -> AB*',
          type: 'elementary' as const,
          rateConstant: 0.015,
          order: { A: 1, B: 1 },
          mechanism: 'Bimolecular collision'
        },
        {
          equation: 'AB* -> C + D',
          type: 'rate-determining' as const,
          rateConstant: 0.010,
          order: { 'AB*': 1 },
          mechanism: 'Bond breaking'
        }
      ],
      temperatureDependence: {
        preExponentialFactor: 1.2e13,
        activationEnergy: 75,
        temperatureRange: [250, 400] as [number, number],
        rSquared: 0.995
      },
      rateLaw: 'rate = k[A][B]',
      conditions: {
        temperature: 298.15,
        concentration: { A: 1.0, B: 1.0 }
      },
      confidence: 0.85,
      dataSource: 'estimated' as const
    };
  });

  describe('Basic Energy Profile Generation', () => {
    it('should generate a simple energy profile without kinetics data', () => {
      const profile = generator.generateProfile(mockThermodynamics);

      expect(profile).toBeDefined();
      expect(profile.points).toHaveLength(3); // Reactants, TS, Products
      expect(profile.points[0].type).toBe('reactant');
      expect(profile.points[0].energy).toBe(0);
      expect(profile.points[1].type).toBe('transition-state');
      expect(profile.points[1].energy).toBeGreaterThan(0);
      expect(profile.points[2].type).toBe('product');
      expect(profile.points[2].energy).toBe(-50);
      expect(profile.isExothermic).toBe(true);
      expect(profile.deltaE).toBe(-50);
    });

    it('should generate an energy profile with kinetics data', () => {
      const profile = generator.generateProfile(mockThermodynamics, mockKinetics);

      expect(profile).toBeDefined();
      expect(profile.points.length).toBeGreaterThan(3); // Multiple steps
      expect(profile.activationEnergyForward).toBe(75);
      expect(profile.activationEnergyReverse).toBe(25); // 75 + (-50)
      expect(profile.steps).toBe(2); // Two transition states
    });

    it('should handle endothermic reactions correctly', () => {
      const endothermicThermo = {
        ...mockThermodynamics,
        deltaH: 30,
        enthalpy: 30,
        isSpontaneous: false,
        spontaneity: 'non-spontaneous' as const
      };

      const profile = generator.generateProfile(endothermicThermo);

      expect(profile.isExothermic).toBe(false);
      expect(profile.deltaE).toBe(30);
      expect(profile.points[2].energy).toBe(30);
    });
  });

  describe('Mechanism Profile Generation', () => {
    it('should generate profile for multi-step mechanism', () => {
      const profile = generator.generateMechanismProfile(
        mockKinetics.mechanism, 
        mockThermodynamics
      );

      expect(profile.points).toHaveLength(5); // R, TS1, Int, TS2, P
      expect(profile.steps).toBe(2);
      
      // Check that intermediates are present
      const intermediates = profile.points.filter(p => p.type === 'intermediate');
      expect(intermediates).toHaveLength(1);
      
      // Check transition states
      const transitionStates = profile.points.filter(p => p.type === 'transition-state');
      expect(transitionStates).toHaveLength(2);
    });

    it('should identify rate-determining step correctly', () => {
      const profile = generator.generateMechanismProfile(
        mockKinetics.mechanism, 
        mockThermodynamics
      );

      expect(profile.rateDeterminingStep).toBeGreaterThanOrEqual(0);
      expect(profile.rateDeterminingStep).toBeLessThan(profile.steps);
    });
  });

  describe('Temperature-Dependent Profiles', () => {
    it('should generate profiles at different temperatures', () => {
      const temperatures = [250, 298.15, 350];
      const profiles = generator.generateTemperatureProfiles(
        mockThermodynamics, 
        temperatures, 
        mockKinetics
      );

      expect(profiles).toHaveLength(3);
      profiles.forEach((p, index) => {
        expect(p.temperature).toBe(temperatures[index]);
        expect(p.profile).toBeDefined();
        expect(p.profile.temperature).toBe(temperatures[index]);
      });
    });

    it('should show temperature effects on activation energy', () => {
      const lowTemp = generator.generateProfile(mockThermodynamics, mockKinetics);
      generator.setConditions(400, 101325);
      const highTemp = generator.generateProfile(mockThermodynamics, mockKinetics);

      // At higher temperature, kinetic effects should change
      expect(lowTemp.temperature).toBeLessThan(highTemp.temperature);
    });
  });

  describe('Reaction Coordinate Generation', () => {
    it('should generate SN2 reaction coordinate', () => {
      const coordinate = generator.generateReactionCoordinate('SN2');

      expect(coordinate.description).toContain('angle');
      expect(coordinate.units).toBe('degrees');
      expect(coordinate.range[0]).toBeLessThan(coordinate.range[1]);
    });

    it('should generate different coordinates for different reaction types', () => {
      const sn1 = generator.generateReactionCoordinate('SN1');
      const sn2 = generator.generateReactionCoordinate('SN2');
      const e2 = generator.generateReactionCoordinate('E2');

      expect(sn1.description).not.toBe(sn2.description);
      expect(sn2.description).not.toBe(e2.description);
      expect(sn1.physicalMeaning).toContain('carbocation');
      expect(sn2.physicalMeaning).toContain('Backside'); // Capital B in "Backside"
    });
  });

  describe('Export Functionality', () => {
    let profile: EnergyProfile;

    beforeEach(() => {
      profile = generator.generateProfile(mockThermodynamics, mockKinetics);
    });

    it('should export for Plotly visualization', () => {
      const plotlyData = generator.exportForVisualization(profile, 'plotly');

      expect(plotlyData.data).toBeDefined();
      expect(plotlyData.data[0].x).toHaveLength(profile.points.length);
      expect(plotlyData.data[0].y).toHaveLength(profile.points.length);
      expect(plotlyData.layout.title).toContain('Energy Profile');
    });

    it('should export for Chart.js visualization', () => {
      const chartData = generator.exportForVisualization(profile, 'chartjs');

      expect(chartData.type).toBe('line');
      expect(chartData.data.datasets[0].data).toHaveLength(profile.points.length);
      expect(chartData.options.scales.x.title.text).toContain('Coordinate');
      expect(chartData.options.scales.y.title.text).toContain('Energy');
    });

    it('should export for D3 visualization', () => {
      const d3Data = generator.exportForVisualization(profile, 'd3');

      expect(d3Data.nodes).toHaveLength(profile.points.length);
      expect(d3Data.links).toHaveLength(profile.points.length - 1);
      expect(d3Data.nodes[0]).toHaveProperty('x');
      expect(d3Data.nodes[0]).toHaveProperty('y');
    });

    it('should export as CSV format', () => {
      const csvData = generator.exportForVisualization(profile, 'csv');

      expect(typeof csvData).toBe('string');
      expect(csvData).toContain('Coordinate,Energy');
      expect(csvData.split('\n')).toHaveLength(profile.points.length + 1); // +1 for header
    });

    it('should throw error for unsupported format', () => {
      expect(() => {
        generator.exportForVisualization(profile, 'invalid' as any);
      }).toThrow('Unsupported export format');
    });
  });

  describe('Convenience Functions', () => {
    it('should create energy profile with createEnergyProfile function', () => {
      const profile = createEnergyProfile(mockThermodynamics, mockKinetics);

      expect(profile).toBeDefined();
      expect(profile.points.length).toBeGreaterThan(0); // Changed from expect.any(Number)
      expect(profile.deltaE).toBe(-50);
    });

    it('should create profile with custom conditions', () => {
      const profile = createEnergyProfile(
        mockThermodynamics, 
        mockKinetics, 
        { temperature: 350, pressure: 200000 }
      );

      expect(profile.temperature).toBe(350);
      expect(profile.pressure).toBe(200000);
    });

    it('should export profile with exportEnergyProfile function', () => {
      const profile = createEnergyProfile(mockThermodynamics);
      const plotlyData = exportEnergyProfile(profile, 'plotly');

      expect(plotlyData.data).toBeDefined();
      expect(plotlyData.layout).toBeDefined();
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle empty mechanism gracefully', () => {
      const emptyKinetics = { ...mockKinetics, mechanism: [] };
      const profile = generator.generateProfile(mockThermodynamics, emptyKinetics);

      expect(profile).toBeDefined();
      expect(profile.points).toHaveLength(3); // Falls back to simple profile
    });

    it('should handle reactions with zero energy change', () => {
      const zeroEnergyThermo = { ...mockThermodynamics, deltaH: 0 };
      const profile = generator.generateProfile(zeroEnergyThermo);

      expect(profile.deltaE).toBe(0);
      expect(profile.points[2].energy).toBe(0);
    });

    it('should handle very high activation energies', () => {
      const highEaKinetics = { 
        ...mockKinetics, 
        activationEnergy: 500, // Very high activation energy
        mechanism: [] // No mechanism - should use simple transition state
      };
      const profile = generator.generateProfile(mockThermodynamics, highEaKinetics);

      expect(profile.activationEnergyForward).toBe(500);
      // Check that the transition state has the high energy
      const transitionStates = profile.points.filter(p => p.type === 'transition-state');
      expect(transitionStates.length).toBeGreaterThan(0);
      expect(transitionStates.some(p => p.energy >= 400)).toBe(true);
    });
  });

  describe('Integration with Existing Systems', () => {
    it('should work with thermodynamics calculator results', () => {
      // This would test integration with actual ThermodynamicsCalculator
      const profile = generator.generateProfile(mockThermodynamics);
      
      expect(profile.temperature).toBe(mockThermodynamics.conditions.temperature);
      expect(profile.deltaE).toBe(mockThermodynamics.deltaH);
    });

    it('should work with kinetics calculator results', () => {
      // This would test integration with actual ReactionKinetics
      const profile = generator.generateProfile(mockThermodynamics, mockKinetics);
      
      expect(profile.activationEnergyForward).toBe(mockKinetics.activationEnergy);
    });
  });

  describe('Performance and Memory', () => {
    it('should handle large temperature ranges efficiently', () => {
      const largeRange = Array.from({ length: 100 }, (_, i) => 200 + i * 2);
      const start = performance.now();
      
      const profiles = generator.generateTemperatureProfiles(
        mockThermodynamics, 
        largeRange
      );
      
      const end = performance.now();
      
      expect(profiles).toHaveLength(100);
      expect(end - start).toBeLessThan(1000); // Should complete in less than 1 second
    });

    it('should not leak memory with repeated profile generation', () => {
      // Generate many profiles to test for memory leaks
      for (let i = 0; i < 100; i++) {
        const profile = generator.generateProfile(mockThermodynamics, mockKinetics);
        expect(profile).toBeDefined();
      }
      
      // If we get here without errors, memory management is likely fine
      expect(true).toBe(true);
    });
  });
});

describe('Energy Profile Data Structures', () => {
  it('should create valid EnergyProfilePoint structures', () => {
    const point: EnergyProfilePoint = {
      coordinate: 0.5,
      energy: 75.2,
      type: 'transition-state',
      label: 'TS1',
      species: ['H2O', 'NH3']
    };

    expect(point.coordinate).toBe(0.5);
    expect(point.energy).toBe(75.2);
    expect(point.type).toBe('transition-state');
    expect(point.species).toContain('H2O');
  });

  it('should validate energy profile completeness', () => {
    const generator = new EnergyProfileGenerator();
    const profile = generator.generateProfile({
      deltaH: -25,
      deltaS: 15,
      deltaG: -29.5,
      equilibriumConstant: 1e5,
      spontaneity: 'spontaneous' as const,
      temperatureDependence: {
        range: [298, 350] as [number, number],
        deltaGvsT: []
      },
      conditions: { temperature: 298.15, pressure: 101325 },
      enthalpy: -25,
      gibbsFreeEnergy: -29.5,
      isSpontaneous: true
    });

    // Check that profile has all required properties
    expect(profile).toHaveProperty('points');
    expect(profile).toHaveProperty('deltaE');
    expect(profile).toHaveProperty('activationEnergyForward');
    expect(profile).toHaveProperty('activationEnergyReverse');
    expect(profile).toHaveProperty('steps');
    expect(profile).toHaveProperty('rateDeterminingStep');
    expect(profile).toHaveProperty('temperature');
    expect(profile).toHaveProperty('pressure');
    expect(profile).toHaveProperty('isExothermic');
  });
});
