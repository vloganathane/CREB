/**
 * Tests for Safety Analyzer
 */

import { ReactionSafetyAnalyzer } from '../safetyAnalyzer';
import { ReactionConditions } from '../types';

describe('ReactionSafetyAnalyzer', () => {
  
  describe('assessReactionSafety', () => {
    it('should assess safety for simple reaction', () => {
      const equation = 'H2 + Cl2 = 2HCl';
      const conditions: ReactionConditions = {
        temperature: 298,
        pressure: 1,
        concentration: { H2: 1.0, Cl2: 1.0 }
      };
      
      const assessment = ReactionSafetyAnalyzer.assessReactionSafety(equation, conditions);
      
      expect(assessment.equation).toBe(equation);
      expect(assessment.conditions).toEqual(conditions);
      expect(assessment.overallRiskLevel).toBeDefined();
      expect(['low', 'moderate', 'high', 'extreme']).toContain(assessment.overallRiskLevel);
      expect(assessment.riskScore).toBeGreaterThanOrEqual(0);
      expect(assessment.riskScore).toBeLessThanOrEqual(100);
      expect(assessment.requiredPPE).toBeInstanceOf(Array);
      expect(assessment.recommendations).toBeInstanceOf(Array);
      expect(assessment.monitoringParameters).toBeInstanceOf(Array);
      expect(assessment.emergencyProcedures).toBeInstanceOf(Array);
      expect(['standard', 'enhanced', 'specialized']).toContain(assessment.containmentLevel);
    });
    
    it('should identify high-risk reactions with known hazardous compounds', () => {
      const equation = 'H2 + Cl2 = 2HCl';
      const conditions: ReactionConditions = {
        temperature: 298,
        pressure: 1,
        concentration: { H2: 1.0, Cl2: 1.0 }
      };
      
      const assessment = ReactionSafetyAnalyzer.assessReactionSafety(equation, conditions);
      
      // Should detect Cl2 as hazardous
      expect(assessment.overallRiskLevel).toBe('extreme');
      expect(assessment.riskScore).toBeGreaterThan(50);
      expect(assessment.requiredPPE).toContain('Respirator');
      expect(assessment.containmentLevel).toBe('specialized');
    });
    
    it('should identify thermal hazards at high temperature', () => {
      const equation = 'A = B';
      const conditions: ReactionConditions = {
        temperature: 650, // High temperature (377°C)
        pressure: 1,
        concentration: { A: 1.0 }
      };
      
      const assessment = ReactionSafetyAnalyzer.assessReactionSafety(equation, conditions);
      
      expect(assessment.hazards.thermal.length).toBeGreaterThan(0);
      expect(assessment.hazards.thermal[0].type).toBe('exothermic');
      expect(assessment.hazards.thermal[0].severity).toBe('high');
    });
    
    it('should identify pressure hazards at high pressure', () => {
      const equation = 'A = B';
      const conditions: ReactionConditions = {
        temperature: 298,
        pressure: 25, // High pressure
        concentration: { A: 1.0 }
      };
      
      const assessment = ReactionSafetyAnalyzer.assessReactionSafety(equation, conditions);
      
      expect(assessment.hazards.thermal.length).toBeGreaterThan(0);
      expect(assessment.hazards.physical.length).toBeGreaterThan(0);
      
      const pressureHazard = assessment.hazards.physical.find(h => h.type === 'pressure');
      expect(pressureHazard).toBeDefined();
      expect(pressureHazard?.severity).toBe('high');
    });
    
    it('should provide appropriate PPE recommendations', () => {
      const equation = 'HF = H + F';
      const conditions: ReactionConditions = {
        temperature: 298,
        pressure: 1,
        concentration: { HF: 1.0 }
      };
      
      const assessment = ReactionSafetyAnalyzer.assessReactionSafety(equation, conditions);
      
      // HF is extremely hazardous
      expect(assessment.overallRiskLevel).toBe('extreme');
      expect(assessment.requiredPPE).toContain('Full chemical suit');
      expect(assessment.requiredPPE).toContain('Self-contained breathing apparatus');
    });
    
    it('should generate relevant safety recommendations', () => {
      const equation = 'Cl2 + H2O = HCl + HClO';
      const conditions: ReactionConditions = {
        temperature: 298,
        pressure: 1,
        concentration: { Cl2: 1.0, H2O: 1.0 }
      };
      
      const assessment = ReactionSafetyAnalyzer.assessReactionSafety(equation, conditions);
      
      expect(assessment.recommendations.length).toBeGreaterThan(0);
      
      const criticalRecs = assessment.recommendations.filter(r => r.priority === 'critical');
      expect(criticalRecs.length).toBeGreaterThan(0);
      
      const emergencyRecs = assessment.recommendations.filter(r => r.category === 'emergency');
      expect(emergencyRecs.length).toBeGreaterThan(0);
    });
    
    it('should identify monitoring parameters for toxic compounds', () => {
      const equation = 'Cl2 + NaOH = NaCl + NaClO + H2O';
      const conditions: ReactionConditions = {
        temperature: 298,
        pressure: 1,
        concentration: { Cl2: 1.0, NaOH: 1.0 }
      };
      
      const assessment = ReactionSafetyAnalyzer.assessReactionSafety(equation, conditions);
      
      expect(assessment.monitoringParameters).toContain('Temperature');
      expect(assessment.monitoringParameters).toContain('Cl2 concentration');
      expect(assessment.monitoringParameters).toContain('Gas leak detection');
    });
    
    it('should provide emergency procedures for high-risk reactions', () => {
      const equation = 'HF + SiO2 = SiF4 + H2O';
      const conditions: ReactionConditions = {
        temperature: 298,
        pressure: 1,
        concentration: { HF: 1.0, SiO2: 1.0 }
      };
      
      const assessment = ReactionSafetyAnalyzer.assessReactionSafety(equation, conditions);
      
      expect(assessment.emergencyProcedures).toContain('Know location of emergency equipment');
      expect(assessment.emergencyProcedures).toContain('Know evacuation routes');
      expect(assessment.emergencyProcedures).toContain('Emergency decontamination procedures');
      expect(assessment.emergencyProcedures).toContain('Exposure response procedures');
    });
    
    it('should handle low-risk reactions appropriately', () => {
      const equation = 'C + O2 = CO2';
      const conditions: ReactionConditions = {
        temperature: 298,
        pressure: 1,
        concentration: { C: 1.0, O2: 1.0 }
      };
      
      const assessment = ReactionSafetyAnalyzer.assessReactionSafety(equation, conditions);
      
      // Should be relatively low risk
      expect(['low', 'moderate']).toContain(assessment.overallRiskLevel);
      expect(assessment.containmentLevel).toBe('standard');
      
      // Should still have basic PPE
      expect(assessment.requiredPPE).toContain('Safety glasses');
      expect(assessment.requiredPPE).toContain('Lab coat');
    });
    
    it('should estimate safety data for unknown compounds', () => {
      const equation = 'UnknownCompoundX = UnknownCompoundY';
      const conditions: ReactionConditions = {
        temperature: 298,
        pressure: 1,
        concentration: { UnknownCompoundX: 1.0 }
      };
      
      const assessment = ReactionSafetyAnalyzer.assessReactionSafety(equation, conditions);
      
      // Should still provide an assessment
      expect(assessment.overallRiskLevel).toBeDefined();
      expect(assessment.riskScore).toBeGreaterThanOrEqual(0);
      expect(assessment.requiredPPE.length).toBeGreaterThan(0);
      expect(assessment.recommendations.length).toBeGreaterThan(0);
    });
  });
  
  describe('Risk Level Calculation', () => {
    it('should calculate appropriate risk scores', () => {
      // Test multiple scenarios
      const lowRiskEquation = 'NaCl + H2O = Na+ + Cl- + H2O';
      const lowRiskConditions: ReactionConditions = {
        temperature: 298,
        pressure: 1,
        concentration: { NaCl: 1.0, H2O: 55.6 }
      };
      
      const highRiskEquation = 'HF + Cl2 = HCl + ClF';
      const highRiskConditions: ReactionConditions = {
        temperature: 500,
        pressure: 10,
        concentration: { HF: 1.0, Cl2: 1.0 }
      };
      
      const lowRiskAssessment = ReactionSafetyAnalyzer.assessReactionSafety(
        lowRiskEquation, 
        lowRiskConditions
      );
      
      const highRiskAssessment = ReactionSafetyAnalyzer.assessReactionSafety(
        highRiskEquation, 
        highRiskConditions
      );
      
      expect(highRiskAssessment.riskScore).toBeGreaterThan(lowRiskAssessment.riskScore);
      expect(highRiskAssessment.overallRiskLevel).toBe('extreme');
      expect(lowRiskAssessment.overallRiskLevel).not.toBe('extreme');
    });
  });
});
