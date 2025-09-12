/**
 * @fileoverview Enhanced Features System Tests
 * @module @creb/enhancements/__tests__/EnhancedFeaturesSystem.test
 * @version 1.0.0
 */

import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { EnhancedFeaturesSystem, FeatureConfig } from '../EnhancedFeaturesSystem';

describe('EnhancedFeaturesSystem', () => {
  let featuresSystem: EnhancedFeaturesSystem;
  let config: FeatureConfig;

  beforeEach(() => {
    config = {
      supportedFormats: ['sdf', 'mol', 'xyz', 'json'],
      enableCloudSync: false,
      enableCollaboration: false,
      showStepByStep: true,
      enableQuizMode: false,
      provideTutorials: true,
      trackProgress: true,
      enableVRMode: false,
      enableARMode: false,
      enable3DPrinting: false,
      enableMolecularDynamics: false,
      enableAnalytics: true,
      provideInsights: true,
      enableComparisons: true,
      showStatistics: true
    };

    jest.clearAllMocks();
  });

  afterEach(() => {
    if (featuresSystem) {
      // Cleanup if needed
    }
  });

  describe('Initialization', () => {
    test('should initialize with default config', () => {
      expect(() => {
        featuresSystem = new EnhancedFeaturesSystem();
      }).not.toThrow();
      expect(featuresSystem).toBeDefined();
    });

    test('should initialize with custom config', () => {
      expect(() => {
        featuresSystem = new EnhancedFeaturesSystem(config);
      }).not.toThrow();
      expect(featuresSystem).toBeDefined();
    });
  });

  describe('Equation Parsing', () => {
    beforeEach(() => {
      featuresSystem = new EnhancedFeaturesSystem(config);
    });

    test('should parse simple equations', async () => {
      const equation = 'H2 + O2 = H2O';
      const result = await featuresSystem.parseEquation(equation);
      
      expect(result).toBeDefined();
      expect(result.isValid).toBe(true);
      expect(Array.isArray(result.reactants)).toBe(true);
      expect(Array.isArray(result.products)).toBe(true);
    });

    test('should parse complex equations', async () => {
      const equation = 'C6H12O6 + 6O2 = 6CO2 + 6H2O';
      const result = await featuresSystem.parseEquation(equation);
      
      expect(result).toBeDefined();
      expect(result.isValid).toBe(true);
      expect(result.reactants.length).toBeGreaterThan(0);
      expect(result.products.length).toBeGreaterThan(0);
    });

    test('should handle invalid equations gracefully', async () => {
      const invalidEquation = 'invalid equation string';
      const result = await featuresSystem.parseEquation(invalidEquation);
      
      expect(result).toBeDefined();
      expect(result.isValid).toBe(false);
      expect(Array.isArray(result.errors)).toBe(true);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    test('should handle empty equations', async () => {
      const result = await featuresSystem.parseEquation('');
      
      expect(result).toBeDefined();
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Empty equation');
    });

    test('should handle equations with special characters', async () => {
      const equation = 'NaCl + H₂SO₄ = Na₂SO₄ + HCl';
      const result = await featuresSystem.parseEquation(equation);
      
      expect(result).toBeDefined();
      // Should handle unicode characters gracefully
    });
  });

  describe('Step-by-Step Analysis', () => {
    beforeEach(() => {
      featuresSystem = new EnhancedFeaturesSystem(config);
    });

    test('should provide step-by-step explanation when enabled', async () => {
      const equation = '2H2 + O2 = 2H2O';
      
      const explanation = await featuresSystem.getStepByStepExplanation(equation);
      
      expect(explanation).toBeDefined();
      expect(Array.isArray(explanation.steps)).toBe(true);
      
      if (explanation.steps.length > 0) {
        explanation.steps.forEach(step => {
          expect(step).toHaveProperty('description');
          expect(typeof step.description).toBe('string');
        });
      }
    });

    test('should handle complex multi-step reactions', async () => {
      const equation = 'C6H12O6 + 6O2 = 6CO2 + 6H2O';
      
      const explanation = await featuresSystem.getStepByStepExplanation(equation);
      
      expect(explanation).toBeDefined();
      expect(Array.isArray(explanation.steps)).toBe(true);
    });
  });

  describe('Insights Generation', () => {
    beforeEach(() => {
      featuresSystem = new EnhancedFeaturesSystem(config);
    });

    test('should provide reaction insights when enabled', async () => {
      const equation = 'CH4 + 2O2 = CO2 + 2H2O';
      
      const insights = await featuresSystem.getReactionInsights(equation);
      
      expect(insights).toBeDefined();
      expect(insights).toHaveProperty('reactionType');
      expect(insights).toHaveProperty('energyChange');
      expect(insights).toHaveProperty('mechanisms');
    });

    test('should identify reaction types', async () => {
      const combustionEquation = 'CH4 + 2O2 = CO2 + 2H2O';
      const insights = await featuresSystem.getReactionInsights(combustionEquation);
      
      expect(insights).toBeDefined();
      expect(typeof insights.reactionType).toBe('string');
    });

    test('should provide detailed insights', async () => {
      const exothermicEquation = 'H2 + 0.5O2 = H2O';
      const insights = await featuresSystem.getReactionInsights(exothermicEquation);
      
      expect(insights).toBeDefined();
      expect(Array.isArray(insights.keyFeatures)).toBe(true);
      expect(insights.mechanism).toBeDefined();
    });
  });

  describe('Quiz Mode', () => {
    beforeEach(() => {
      config.enableQuizMode = true;
      featuresSystem = new EnhancedFeaturesSystem(config);
    });

    test('should generate quiz questions when enabled', async () => {
      const quiz = await featuresSystem.generateQuiz('combustion', 'beginner');
      
      expect(quiz).toBeDefined();
      expect(Array.isArray(quiz.questions)).toBe(true);
      
      if (quiz.questions.length > 0) {
        quiz.questions.forEach(question => {
          expect(question).toHaveProperty('question');
          expect(question).toHaveProperty('type');
          expect(question).toHaveProperty('options');
          expect(question).toHaveProperty('correctAnswer');
        });
      }
    });

    test('should generate different difficulty levels', async () => {
      const beginnerQuiz = await featuresSystem.generateQuiz('balancing', 'beginner');
      const advancedQuiz = await featuresSystem.generateQuiz('balancing', 'advanced');
      
      expect(beginnerQuiz).toBeDefined();
      expect(advancedQuiz).toBeDefined();
    });
  });

  describe('Comparison Features', () => {
    beforeEach(() => {
      featuresSystem = new EnhancedFeaturesSystem(config);
    });

    test('should compare similar reactions when enabled', async () => {
      const equations = [
        'CH4 + 2O2 = CO2 + 2H2O',
        'C2H6 + 3.5O2 = 2CO2 + 3H2O'
      ];
      
      const comparison = await featuresSystem.compareReactions(equations);
      
      expect(comparison).toBeDefined();
      expect(comparison).toHaveProperty('similarities');
      expect(comparison).toHaveProperty('differences');
      expect(Array.isArray(comparison.similarities)).toBe(true);
      expect(Array.isArray(comparison.differences)).toBe(true);
    });

    test('should handle single reaction arrays', async () => {
      const equations = ['CH4 + 2O2 = CO2 + 2H2O'];
      
      const comparison = await featuresSystem.compareReactions(equations);
      
      expect(comparison).toBeDefined();
    });
  });

  describe('Educational Features', () => {
    beforeEach(() => {
      featuresSystem = new EnhancedFeaturesSystem(config);
    });

    test('should provide tutorials for reaction types', async () => {
      const tutorial = await featuresSystem.getTutorial('combustion');
      
      expect(tutorial).toBeDefined();
      expect(tutorial).toHaveProperty('title');
      expect(tutorial).toHaveProperty('content');
      expect(tutorial).toHaveProperty('examples');
    });

    test('should track progress when enabled', () => {
      const progressReport = featuresSystem.getProgressReport();
      
      expect(progressReport).toBeDefined();
      expect(progressReport).toHaveProperty('completedLessons');
      expect(progressReport).toHaveProperty('quizScores');
      expect(progressReport).toHaveProperty('timeSpent');
    });

    test('should provide usage statistics', () => {
      const stats = featuresSystem.getUsageStatistics();
      
      expect(stats).toBeDefined();
      expect(stats).toHaveProperty('reactionsBalanced');
      expect(stats).toHaveProperty('timeSpent');
      expect(stats).toHaveProperty('featuresUsed');
    });
  });

  describe('File Import/Export', () => {
    beforeEach(() => {
      featuresSystem = new EnhancedFeaturesSystem(config);
    });

    test('should get supported formats', () => {
      const formats = featuresSystem.getSupportedFormats();
      
      expect(Array.isArray(formats)).toBe(true);
      if (formats.length > 0) {
        formats.forEach(format => {
          expect(format).toHaveProperty('extension');
          expect(format).toHaveProperty('name');
          expect(format).toHaveProperty('description');
        });
      }
    });

    test('should handle file import', async () => {
      const mockFile = new File(['mock content'], 'test.sdf', { type: 'chemical/x-mdl-sdfile' });
      
      const result = await featuresSystem.importReaction(mockFile);
      
      expect(result).toBeDefined();
      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('reaction');
    });

    test('should handle export to different formats', async () => {
      const mockReaction = {
        equation: 'H2 + O2 = H2O',
        reactants: [],
        products: []
      };
      
      const result = await featuresSystem.exportReaction(mockReaction as any, 'sdf');
      
      expect(result).toBeDefined();
      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('data');
    });
  });

  describe('Error Handling', () => {
    beforeEach(() => {
      featuresSystem = new EnhancedFeaturesSystem(config);
    });

    test('should handle malformed equations gracefully', async () => {
      const malformedEquations = [
        'H2 +',
        '= H2O',
        'H2 O2',
        'H2 ++ O2 == H2O'
      ];

      for (const equation of malformedEquations) {
        const result = await featuresSystem.parseEquation(equation);
        expect(result.isValid).toBe(false);
        expect(result.errors.length).toBeGreaterThan(0);
      }
    });

    test('should handle null/undefined inputs', async () => {
      await expect(featuresSystem.parseEquation(null as any)).rejects.toThrow();
      await expect(featuresSystem.parseEquation(undefined as any)).rejects.toThrow();
    });

    test('should handle very long equations', async () => {
      const longEquation = 'H2'.repeat(1000) + ' + O2 = H2O';
      
      const result = await featuresSystem.parseEquation(longEquation);
      
      // Should handle gracefully, either parse or reject with appropriate error
      expect(result).toBeDefined();
      expect(typeof result.isValid).toBe('boolean');
    });

    test('should handle special characters in equations', async () => {
      const specialChars = 'H₂ + O₂ → H₂O';
      
      const result = await featuresSystem.parseEquation(specialChars);
      
      // Should handle unicode characters gracefully
      expect(result).toBeDefined();
    });
  });

  describe('Performance', () => {
    beforeEach(() => {
      featuresSystem = new EnhancedFeaturesSystem(config);
    });

    test('should parse equations efficiently', async () => {
      const equation = '2H2 + O2 = 2H2O';
      const startTime = performance.now();
      
      await featuresSystem.parseEquation(equation);
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      // Should complete within reasonable time
      expect(duration).toBeLessThan(1000); // 1 second
    });

    test('should handle multiple concurrent operations', async () => {
      const equations = [
        'H2 + O2 = H2O',
        'CH4 + O2 = CO2 + H2O',
        'C6H12O6 + O2 = CO2 + H2O'
      ];

      const promises = equations.map(eq => featuresSystem.parseEquation(eq));
      
      await expect(Promise.all(promises)).resolves.toBeDefined();
    });
  });
});
