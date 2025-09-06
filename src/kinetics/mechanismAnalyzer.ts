/**
 * CREB Reaction Mechanism Analyzer
 * Analyzes complex reaction mechanisms and pathways
 */

import { 
  ReactionStep, 
  ReactionConditions, 
  KineticsResult,
  ArrheniusData,
  ReactionClass 
} from './types';
import { ReactionKinetics } from './calculator';
import { EquationParser } from '../utils';

export interface MechanismStep {
  stepNumber: number;
  equation: string;
  type: 'elementary' | 'fast-equilibrium' | 'rate-determining' | 'pre-equilibrium';
  intermediates: string[];
  rateConstant: number;
  reverseRateConstant?: number;
  steadyStateSpecies?: string[];
}

export interface MechanismAnalysis {
  mechanism: MechanismStep[];
  overallReaction: string;
  rateExpression: string;
  rateDeterminingStep: number;
  intermediates: string[];
  catalysts: string[];
  approximations: string[];
  validity: {
    steadyState: boolean;
    preEquilibrium: boolean;
    rateApproximation: boolean;
  };
  confidence: number;
}

export interface PathwayComparison {
  pathway1: MechanismAnalysis;
  pathway2: MechanismAnalysis;
  preferredPathway: 1 | 2;
  reasons: string[];
  selectivityFactor: number;
}

export class MechanismAnalyzer {
  
  /**
   * Analyze a multi-step reaction mechanism
   */
  static analyzeMechanism(
    steps: MechanismStep[],
    conditions: ReactionConditions
  ): MechanismAnalysis {
    // Find intermediates (species that appear as both products and reactants)
    const intermediates = this.findIntermediates(steps);
    
    // Find catalysts (species that appear on both sides but are not consumed)
    const catalysts = this.findCatalysts(steps);
    
    // Determine rate-determining step
    const rateDeterminingStep = this.findRateDeterminingStep(steps);
    
    // Generate overall reaction equation
    const overallReaction = this.deriveOverallReaction(steps);
    
    // Apply steady-state approximation
    const rateExpression = this.deriveSteadyStateRateExpression(steps, intermediates);
    
    // Determine valid approximations
    const approximations = this.identifyValidApproximations(steps, conditions);
    
    return {
      mechanism: steps,
      overallReaction,
      rateExpression,
      rateDeterminingStep,
      intermediates,
      catalysts,
      approximations,
      validity: {
        steadyState: intermediates.length > 0,
        preEquilibrium: this.hasPreEquilibrium(steps),
        rateApproximation: rateDeterminingStep >= 0
      },
      confidence: this.calculateMechanismConfidence(steps, approximations)
    };
  }

  /**
   * Compare two competing reaction pathways
   */
  static comparePathways(
    pathway1: MechanismStep[],
    pathway2: MechanismStep[],
    conditions: ReactionConditions
  ): PathwayComparison {
    const analysis1 = this.analyzeMechanism(pathway1, conditions);
    const analysis2 = this.analyzeMechanism(pathway2, conditions);
    
    // Calculate overall rate constants for comparison
    const rate1 = this.calculateOverallRate(pathway1, conditions);
    const rate2 = this.calculateOverallRate(pathway2, conditions);
    
    const selectivityFactor = rate1 / rate2;
    const preferredPathway = rate1 > rate2 ? 1 : 2;
    
    const reasons = this.generateComparisonReasons(analysis1, analysis2, rate1, rate2);
    
    return {
      pathway1: analysis1,
      pathway2: analysis2,
      preferredPathway,
      reasons,
      selectivityFactor
    };
  }

  /**
   * Apply pre-equilibrium approximation
   */
  static applyPreEquilibriumApproximation(
    steps: MechanismStep[],
    equilibriumSteps: number[]
  ): string {
    // For fast pre-equilibrium steps, assume rapid equilibrium
    // K_eq = k_forward / k_reverse
    
    let rateExpression = "Rate = ";
    const slowStep = steps.find(step => !equilibriumSteps.includes(step.stepNumber));
    
    if (slowStep) {
      rateExpression += `k${slowStep.stepNumber}`;
      
      // Add concentration terms modified by equilibrium constants
      equilibriumSteps.forEach(stepNum => {
        const step = steps.find(s => s.stepNumber === stepNum);
        if (step && step.reverseRateConstant) {
          const keq = step.rateConstant / step.reverseRateConstant;
          rateExpression += ` × K${stepNum}(${keq.toExponential(2)})`;
        }
      });
    }
    
    return rateExpression;
  }

  /**
   * Apply steady-state approximation
   */
  static applySteadyStateApproximation(
    steps: MechanismStep[],
    steadyStateSpecies: string[]
  ): string {
    // For steady-state species: d[I]/dt = 0
    // Rate of formation = Rate of consumption
    
    let rateExpression = "Rate = ";
    
    // Simplified: find the slowest step
    const slowestStep = steps.reduce((prev, current) => 
      prev.rateConstant < current.rateConstant ? prev : current
    );
    
    rateExpression += `k${slowestStep.stepNumber}`;
    
    // Add pre-equilibrium factors if applicable
    steadyStateSpecies.forEach(species => {
      rateExpression += `[${species}]_ss`;
    });
    
    return rateExpression;
  }

  /**
   * Find species that appear as both products and reactants (intermediates)
   */
  private static findIntermediates(steps: MechanismStep[]): string[] {
    const products = new Set<string>();
    const reactants = new Set<string>();
    
    steps.forEach(step => {
      try {
        const parser = new EquationParser(step.equation);
        const parsed = parser.parse();
        
        parsed.reactants.forEach(r => reactants.add(r));
        parsed.products.forEach(p => products.add(p));
      } catch {
        // Skip invalid equations
      }
    });
    
    // Intermediates appear in both sets
    return Array.from(products).filter(species => reactants.has(species));
  }

  /**
   * Find species that appear on both sides but are not consumed (catalysts)
   */
  private static findCatalysts(steps: MechanismStep[]): string[] {
    const speciesBalance: Record<string, number> = {};
    
    steps.forEach(step => {
      try {
        const parser = new EquationParser(step.equation);
        const parsed = parser.parse();
        
        // Subtract reactants, add products
        parsed.reactants.forEach(r => {
          speciesBalance[r] = (speciesBalance[r] || 0) - 1;
        });
        
        parsed.products.forEach(p => {
          speciesBalance[p] = (speciesBalance[p] || 0) + 1;
        });
      } catch {
        // Skip invalid equations
      }
    });
    
    // Catalysts have net balance of zero
    return Object.keys(speciesBalance).filter(species => speciesBalance[species] === 0);
  }

  /**
   * Identify the rate-determining step (slowest step)
   */
  private static findRateDeterminingStep(steps: MechanismStep[]): number {
    let slowestStep = steps[0];
    let slowestIndex = 0;
    
    steps.forEach((step, index) => {
      if (step.rateConstant < slowestStep.rateConstant) {
        slowestStep = step;
        slowestIndex = index;
      }
    });
    
    return slowestIndex;
  }

  /**
   * Derive overall reaction from mechanism steps
   */
  private static deriveOverallReaction(steps: MechanismStep[]): string {
    const netReactants: Record<string, number> = {};
    const netProducts: Record<string, number> = {};
    
    steps.forEach(step => {
      try {
        const parser = new EquationParser(step.equation);
        const parsed = parser.parse();
        
        parsed.reactants.forEach(r => {
          netReactants[r] = (netReactants[r] || 0) + 1;
        });
        
        parsed.products.forEach(p => {
          netProducts[p] = (netProducts[p] || 0) + 1;
        });
      } catch {
        // Skip invalid equations
      }
    });
    
    // Remove intermediates (species that appear on both sides)
    const allSpecies = new Set([...Object.keys(netReactants), ...Object.keys(netProducts)]);
    allSpecies.forEach(species => {
      const reactantCount = netReactants[species] || 0;
      const productCount = netProducts[species] || 0;
      
      if (reactantCount > 0 && productCount > 0) {
        const minCount = Math.min(reactantCount, productCount);
        netReactants[species] -= minCount;
        netProducts[species] -= minCount;
        
        if (netReactants[species] === 0) delete netReactants[species];
        if (netProducts[species] === 0) delete netProducts[species];
      }
    });
    
    // Build equation string
    const reactantStr = Object.entries(netReactants)
      .filter(([_, count]) => count > 0)
      .map(([species, count]) => count > 1 ? `${count}${species}` : species)
      .join(' + ');
      
    const productStr = Object.entries(netProducts)
      .filter(([_, count]) => count > 0)
      .map(([species, count]) => count > 1 ? `${count}${species}` : species)
      .join(' + ');
    
    return `${reactantStr} = ${productStr}`;
  }

  /**
   * Derive rate expression using steady-state approximation
   */
  private static deriveSteadyStateRateExpression(
    steps: MechanismStep[], 
    intermediates: string[]
  ): string {
    if (intermediates.length === 0) {
      // Simple elementary reaction
      const step = steps[0];
      return `Rate = k${step.stepNumber}[reactants]`;
    }
    
    // Complex mechanism - simplified steady-state treatment
    const rateDeterminingStep = this.findRateDeterminingStep(steps);
    const rdsStep = steps[rateDeterminingStep];
    
    return `Rate = k${rdsStep.stepNumber}[reactants] (steady-state approximation)`;
  }

  /**
   * Check if mechanism has pre-equilibrium steps
   */
  private static hasPreEquilibrium(steps: MechanismStep[]): boolean {
    return steps.some(step => step.type === 'fast-equilibrium' || step.reverseRateConstant !== undefined);
  }

  /**
   * Identify valid approximations for the mechanism
   */
  private static identifyValidApproximations(
    steps: MechanismStep[], 
    conditions: ReactionConditions
  ): string[] {
    const approximations: string[] = [];
    
    // Check for pre-equilibrium
    if (this.hasPreEquilibrium(steps)) {
      approximations.push('Pre-equilibrium approximation');
    }
    
    // Check for steady-state intermediates
    const intermediates = this.findIntermediates(steps);
    if (intermediates.length > 0) {
      approximations.push('Steady-state approximation');
    }
    
    // Check for rate-determining step
    const rateDeterminingStep = this.findRateDeterminingStep(steps);
    if (rateDeterminingStep >= 0) {
      approximations.push('Rate-determining step approximation');
    }
    
    return approximations;
  }

  /**
   * Calculate overall reaction rate for pathway comparison
   */
  private static calculateOverallRate(
    steps: MechanismStep[], 
    conditions: ReactionConditions
  ): number {
    // Simplified: use the slowest step as the overall rate
    const rateDeterminingStep = this.findRateDeterminingStep(steps);
    const rdsStep = steps[rateDeterminingStep];
    
    // Apply temperature dependence (simplified)
    const temperatureFactor = Math.exp(-50000 / (8.314 * conditions.temperature)); // Rough estimate
    
    return rdsStep.rateConstant * temperatureFactor;
  }

  /**
   * Generate reasons for pathway preference
   */
  private static generateComparisonReasons(
    analysis1: MechanismAnalysis,
    analysis2: MechanismAnalysis,
    rate1: number,
    rate2: number
  ): string[] {
    const reasons: string[] = [];
    
    if (rate1 > rate2) {
      reasons.push(`Pathway 1 is ${(rate1/rate2).toFixed(2)}x faster`);
    } else {
      reasons.push(`Pathway 2 is ${(rate2/rate1).toFixed(2)}x faster`);
    }
    
    if (analysis1.intermediates.length < analysis2.intermediates.length) {
      reasons.push('Pathway 1 has fewer intermediates');
    } else if (analysis2.intermediates.length < analysis1.intermediates.length) {
      reasons.push('Pathway 2 has fewer intermediates');
    }
    
    if (analysis1.confidence > analysis2.confidence) {
      reasons.push('Pathway 1 has higher mechanistic confidence');
    } else if (analysis2.confidence > analysis1.confidence) {
      reasons.push('Pathway 2 has higher mechanistic confidence');
    }
    
    return reasons;
  }

  /**
   * Calculate confidence in mechanism analysis
   */
  private static calculateMechanismConfidence(
    steps: MechanismStep[], 
    approximations: string[]
  ): number {
    let confidence = 0.5; // Base confidence
    
    // Higher confidence for well-defined mechanisms
    if (steps.length > 1 && steps.length <= 5) confidence += 0.2;
    
    // Higher confidence if approximations are valid
    if (approximations.length > 0) confidence += 0.1 * approximations.length;
    
    // Lower confidence for complex mechanisms
    if (steps.length > 5) confidence -= 0.1;
    
    return Math.min(Math.max(confidence, 0), 1);
  }
}
