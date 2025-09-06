/**
 * CREB Reaction Kinetics Calculator
 * Core calculator for reaction kinetics analysis
 */

import { 
  ReactionConditions, 
  ArrheniusData, 
  KineticsResult, 
  TemperatureProfile,
  ReactionClass,
  RateLawType,
  ReactionStep,
  CatalystData
} from './types';
import { EquationParser } from '../utils';

export class ReactionKinetics {
  private static readonly GAS_CONSTANT = 8.314; // J/(mol·K)
  private static readonly KELVIN_CELSIUS_OFFSET = 273.15;

  /**
   * Calculate reaction rate constant using Arrhenius equation
   * k = A * exp(-Ea / (R * T))
   */
  static calculateRateConstant(
    arrhenius: ArrheniusData, 
    temperature: number
  ): number {
    const { preExponentialFactor, activationEnergy } = arrhenius;
    const energyJoules = activationEnergy * 1000; // Convert kJ/mol to J/mol
    
    return preExponentialFactor * Math.exp(
      -energyJoules / (this.GAS_CONSTANT * temperature)
    );
  }

  /**
   * Calculate activation energy from rate constants at two temperatures
   * Ea = R * ln(k2/k1) / (1/T1 - 1/T2)
   */
  static calculateActivationEnergy(
    k1: number, T1: number,
    k2: number, T2: number
  ): number {
    const lnRatio = Math.log(k2 / k1);
    const tempTerm = (1 / T1) - (1 / T2);
    
    return (this.GAS_CONSTANT * lnRatio / tempTerm) / 1000; // Convert to kJ/mol
  }

  /**
   * Generate temperature profile for reaction kinetics
   */
  static generateTemperatureProfile(
    arrhenius: ArrheniusData,
    tempRange: [number, number],
    points: number = 20
  ): TemperatureProfile[] {
    const [minTemp, maxTemp] = tempRange;
    const step = (maxTemp - minTemp) / (points - 1);
    
    return Array.from({ length: points }, (_, i) => {
      const temperature = minTemp + (i * step);
      const rateConstant = this.calculateRateConstant(arrhenius, temperature);
      
      return {
        temperature,
        rateConstant,
        reactionRate: rateConstant // Base rate (will be modified by concentrations)
      };
    });
  }

  /**
   * Determine reaction class from chemical equation
   */
  static classifyReaction(equation: string): ReactionClass {
    try {
      const parser = new EquationParser(equation);
      const parsed = parser.parse();
      const reactantCount = parsed.reactants.length;
      
      // Basic classification based on number of reactants
      if (reactantCount === 1) return 'unimolecular';
      if (reactantCount === 2) return 'bimolecular';
      if (reactantCount === 3) return 'termolecular';
      
      return 'complex';
    } catch {
      return 'complex';
    }
  }

  /**
   * Calculate half-life for first-order reactions
   * t₁/₂ = ln(2) / k
   */
  static calculateHalfLife(rateConstant: number, order: number = 1): number {
    if (order === 1) {
      return Math.log(2) / rateConstant;
    }
    
    // For other orders, half-life depends on initial concentration
    // Return NaN to indicate additional parameters needed
    return NaN;
  }

  /**
   * Estimate pre-exponential factor using transition state theory
   * A ≈ (kB * T / h) * exp(ΔS‡ / R)
   */
  static estimatePreExponentialFactor(
    temperature: number,
    entropyOfActivation: number = 0 // J/(mol·K), default assumes no entropy change
  ): number {
    const kB = 1.381e-23; // Boltzmann constant (J/K)
    const h = 6.626e-34;  // Planck constant (J·s)
    
    const frequencyFactor = (kB * temperature) / h;
    const entropyTerm = Math.exp(entropyOfActivation / this.GAS_CONSTANT);
    
    return frequencyFactor * entropyTerm;
  }

  /**
   * Apply catalyst effect to reaction kinetics
   */
  static applyCatalystEffect(
    baseKinetics: Partial<KineticsResult>,
    catalyst: CatalystData
  ): Partial<KineticsResult> {
    const { effectOnRate, effectOnActivationEnergy } = catalyst;
    
    return {
      ...baseKinetics,
      rateConstant: (baseKinetics.rateConstant || 0) * effectOnRate,
      activationEnergy: (baseKinetics.activationEnergy || 0) + effectOnActivationEnergy,
      catalystEffect: catalyst
    };
  }

  /**
   * Generate rate law expression
   */
  static generateRateLaw(
    equation: string,
    orders: Record<string, number>,
    rateConstant: number
  ): string {
    try {
      const parser = new EquationParser(equation);
      const parsed = parser.parse();
      const reactants = parsed.reactants;
      
      let rateLaw = `Rate = ${rateConstant.toExponential(3)}`;
      
      for (const reactant of reactants) {
        const order = orders[reactant] || 1;
        if (order === 1) {
          rateLaw += `[${reactant}]`;
        } else if (order !== 0) {
          rateLaw += `[${reactant}]^${order}`;
        }
      }
      
      return rateLaw;
    } catch {
      return `Rate = ${rateConstant.toExponential(3)}[A]^n[B]^m`;
    }
  }

  /**
   * Comprehensive kinetics analysis
   */
  static analyzeKinetics(
    equation: string,
    conditions: ReactionConditions,
    arrheniusData?: ArrheniusData
  ): KineticsResult {
    const reactionClass = this.classifyReaction(equation);
    
    // If no Arrhenius data provided, estimate based on reaction type
    const arrhenius = arrheniusData || this.estimateArrheniusParameters(equation, reactionClass);
    
    const rateConstant = this.calculateRateConstant(arrhenius, conditions.temperature);
    const halfLife = this.calculateHalfLife(rateConstant);
    
    // Generate basic reaction orders (1 for each reactant by default)
    const parser = new EquationParser(equation);
    const parsed = parser.parse();
    const orders = parsed.reactants.reduce((acc, reactant) => {
      acc[reactant] = 1; // Assume first order in each reactant
      return acc;
    }, {} as Record<string, number>);
    
    const overallOrder = Object.values(orders).reduce((sum, order) => sum + order, 0);
    const rateLaw = this.generateRateLaw(equation, orders, rateConstant);
    
    return {
      equation,
      rateConstant,
      activationEnergy: arrhenius.activationEnergy,
      reactionOrder: overallOrder,
      mechanism: [{
        equation,
        type: 'elementary',
        rateConstant,
        order: orders,
        mechanism: 'Single-step elementary reaction'
      }],
      temperatureDependence: arrhenius,
      rateLaw,
      conditions,
      halfLife: isFinite(halfLife) ? halfLife : undefined,
      confidence: arrheniusData ? 0.8 : 0.5, // Lower confidence for estimates
      dataSource: arrheniusData ? 'literature' : 'estimated'
    };
  }

  /**
   * Estimate Arrhenius parameters for unknown reactions
   */
  private static estimateArrheniusParameters(
    equation: string,
    reactionClass: ReactionClass
  ): ArrheniusData {
    // Rough estimates based on reaction class
    const estimates = {
      unimolecular: { A: 1e13, Ea: 150 },      // s⁻¹, kJ/mol
      bimolecular: { A: 1e10, Ea: 50 },       // M⁻¹s⁻¹, kJ/mol
      termolecular: { A: 1e6, Ea: 25 },       // M⁻²s⁻¹, kJ/mol
      'enzyme-catalyzed': { A: 1e7, Ea: 40 },
      autocatalytic: { A: 1e8, Ea: 60 },
      'chain-reaction': { A: 1e12, Ea: 30 },
      oscillating: { A: 1e9, Ea: 70 },
      complex: { A: 1e9, Ea: 80 }
    };
    
    const { A, Ea } = estimates[reactionClass] || estimates.complex;
    
    return {
      preExponentialFactor: A,
      activationEnergy: Ea,
      temperatureRange: [250, 500], // K
      rSquared: 0.5 // Low confidence for estimates
    };
  }
}
