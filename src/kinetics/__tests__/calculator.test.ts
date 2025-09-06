/**
 * Tests for Reaction Kinetics Calculator
 */

import { ReactionKinetics } from '../calculator';
import { ArrheniusData, ReactionConditions } from '../types';

describe('ReactionKinetics', () => {
  
  describe('calculateRateConstant', () => {
    it('should calculate rate constant using Arrhenius equation', () => {
      const arrhenius: ArrheniusData = {
        preExponentialFactor: 1e10,
        activationEnergy: 50, // kJ/mol
        temperatureRange: [250, 500]
      };
      
      const temperature = 298; // K (25°C)
      const result = ReactionKinetics.calculateRateConstant(arrhenius, temperature);
      
      expect(result).toBeGreaterThan(0);
      expect(result).toBeLessThan(arrhenius.preExponentialFactor);
    });
    
    it('should give higher rate constant at higher temperature', () => {
      const arrhenius: ArrheniusData = {
        preExponentialFactor: 1e10,
        activationEnergy: 50,
        temperatureRange: [250, 500]
      };
      
      const k1 = ReactionKinetics.calculateRateConstant(arrhenius, 298);
      const k2 = ReactionKinetics.calculateRateConstant(arrhenius, 350);
      
      expect(k2).toBeGreaterThan(k1);
    });
  });
  
  describe('calculateActivationEnergy', () => {
    it('should calculate activation energy from two rate constants', () => {
      const k1 = 1e-5;
      const T1 = 298;
      const k2 = 1e-3;
      const T2 = 350;
      
      const Ea = ReactionKinetics.calculateActivationEnergy(k1, T1, k2, T2);
      
      expect(Ea).toBeGreaterThan(0);
      expect(Ea).toBeLessThan(200); // Reasonable activation energy
    });
  });
  
  describe('generateTemperatureProfile', () => {
    it('should generate temperature profile with correct number of points', () => {
      const arrhenius: ArrheniusData = {
        preExponentialFactor: 1e10,
        activationEnergy: 50,
        temperatureRange: [250, 500]
      };
      
      const profile = ReactionKinetics.generateTemperatureProfile(
        arrhenius, 
        [250, 350], 
        5
      );
      
      expect(profile).toHaveLength(5);
      expect(profile[0].temperature).toBe(250);
      expect(profile[4].temperature).toBe(350);
      
      // Rate constants should increase with temperature
      for (let i = 1; i < profile.length; i++) {
        expect(profile[i].rateConstant).toBeGreaterThan(profile[i-1].rateConstant);
      }
    });
  });
  
  describe('classifyReaction', () => {
    it('should classify unimolecular reactions', () => {
      const equation = 'N2O4 = 2NO2';
      const classification = ReactionKinetics.classifyReaction(equation);
      expect(classification).toBe('unimolecular');
    });
    
    it('should classify bimolecular reactions', () => {
      const equation = 'H2 + Cl2 = 2HCl';
      const classification = ReactionKinetics.classifyReaction(equation);
      expect(classification).toBe('bimolecular');
    });
    
    it('should classify termolecular reactions', () => {
      const equation = 'A + B + C = D';
      const classification = ReactionKinetics.classifyReaction(equation);
      expect(classification).toBe('termolecular');
    });
    
    it('should handle invalid equations', () => {
      const equation = 'invalid equation';
      const classification = ReactionKinetics.classifyReaction(equation);
      expect(classification).toBe('complex');
    });
  });
  
  describe('calculateHalfLife', () => {
    it('should calculate half-life for first-order reactions', () => {
      const rateConstant = 0.693; // s^-1
      const halfLife = ReactionKinetics.calculateHalfLife(rateConstant, 1);
      
      expect(halfLife).toBeCloseTo(1, 2); // Should be approximately 1 second
    });
    
    it('should return NaN for non-first-order reactions', () => {
      const rateConstant = 0.693;
      const halfLife = ReactionKinetics.calculateHalfLife(rateConstant, 2);
      
      expect(halfLife).toBeNaN();
    });
  });
  
  describe('estimatePreExponentialFactor', () => {
    it('should estimate reasonable pre-exponential factor', () => {
      const temperature = 298;
      const A = ReactionKinetics.estimatePreExponentialFactor(temperature);
      
      expect(A).toBeGreaterThan(0);
      expect(A).toBeLessThan(1e20); // Reasonable upper bound
    });
    
    it('should give higher factor at higher temperature', () => {
      const A1 = ReactionKinetics.estimatePreExponentialFactor(298);
      const A2 = ReactionKinetics.estimatePreExponentialFactor(350);
      
      expect(A2).toBeGreaterThan(A1);
    });
  });
  
  describe('generateRateLaw', () => {
    it('should generate correct rate law for simple reaction', () => {
      const equation = 'A + B = C';
      const orders = { A: 1, B: 1 };
      const rateConstant = 1.5e-3;
      
      const rateLaw = ReactionKinetics.generateRateLaw(equation, orders, rateConstant);
      
      expect(rateLaw).toContain('Rate =');
      expect(rateLaw).toContain('1.500e-3');
      expect(rateLaw).toContain('[A]');
      expect(rateLaw).toContain('[B]');
    });
    
    it('should handle fractional orders', () => {
      const equation = 'A + B = C';
      const orders = { A: 0.5, B: 2 };
      const rateConstant = 1.0;
      
      const rateLaw = ReactionKinetics.generateRateLaw(equation, orders, rateConstant);
      
      expect(rateLaw).toContain('[A]^0.5');
      expect(rateLaw).toContain('[B]^2');
    });
    
    it('should handle invalid equations gracefully', () => {
      const equation = 'invalid';
      const orders = {};
      const rateConstant = 1.0;
      
      const rateLaw = ReactionKinetics.generateRateLaw(equation, orders, rateConstant);
      
      expect(rateLaw).toContain('Rate =');
      expect(rateLaw).toContain('[A]^n[B]^m');
    });
  });
  
  describe('analyzeKinetics', () => {
    it('should perform comprehensive kinetics analysis', () => {
      const equation = 'H2 + Cl2 = 2HCl';
      const conditions: ReactionConditions = {
        temperature: 298,
        pressure: 1,
        concentration: {
          H2: 1.0,
          Cl2: 1.0
        }
      };
      
      const result = ReactionKinetics.analyzeKinetics(equation, conditions);
      
      expect(result.equation).toBe(equation);
      expect(result.rateConstant).toBeGreaterThan(0);
      expect(result.activationEnergy).toBeGreaterThan(0);
      expect(result.reactionOrder).toBeGreaterThan(0);
      expect(result.rateLaw).toContain('Rate =');
      expect(result.conditions).toEqual(conditions);
      expect(result.mechanism).toHaveLength(1);
      expect(result.confidence).toBeGreaterThan(0);
      expect(result.confidence).toBeLessThanOrEqual(1);
      expect(result.dataSource).toBe('estimated');
    });
    
    it('should use provided Arrhenius data when available', () => {
      const equation = 'A = B';
      const conditions: ReactionConditions = {
        temperature: 298,
        concentration: { A: 1.0 }
      };
      const arrhenius: ArrheniusData = {
        preExponentialFactor: 1e12,
        activationEnergy: 75,
        temperatureRange: [250, 400],
        rSquared: 0.95
      };
      
      const result = ReactionKinetics.analyzeKinetics(equation, conditions, arrhenius);
      
      expect(result.activationEnergy).toBe(75);
      expect(result.temperatureDependence.preExponentialFactor).toBe(1e12);
      expect(result.confidence).toBe(0.8); // Higher confidence for literature data
      expect(result.dataSource).toBe('literature');
    });
  });
  
  describe('applyCatalystEffect', () => {
    it('should apply catalyst effect to kinetics', () => {
      const baseKinetics = {
        rateConstant: 1e-5,
        activationEnergy: 100
      };
      
      const catalyst = {
        catalyst: 'Pt',
        effectOnRate: 1000, // 1000x rate enhancement
        effectOnActivationEnergy: -30, // 30 kJ/mol reduction
        mechanism: 'Heterogeneous catalysis',
        efficiency: 0.9
      };
      
      const result = ReactionKinetics.applyCatalystEffect(baseKinetics, catalyst);
      
      expect(result.rateConstant).toBe(1e-2); // 1000x enhancement
      expect(result.activationEnergy).toBe(70); // 30 kJ/mol reduction
      expect(result.catalystEffect).toEqual(catalyst);
    });
  });
});
