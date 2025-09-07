/**
 * Core thermodynamics calculator for CREB-JS
 * Implements standard thermodynamic calculations for chemical reactions
 */

import { ThermodynamicsResult, ReactionConditions, ThermodynamicProperties, TemperatureProfile } from './types';
import { BalancedEquation } from '../types';
import { Injectable } from '../core/decorators/Injectable';

interface CompoundData {
  formula: string;
  coefficient: number;
}

@Injectable()
export class ThermodynamicsCalculator {
  private readonly R = 8.314; // Gas constant J/(mol·K)
  private readonly standardTemperature = 298.15; // K
  private readonly standardPressure = 101325; // Pa

  /**
   * Calculate thermodynamic properties for a balanced chemical equation
   */
  async calculateThermodynamics(
    equation: BalancedEquation,
    conditions: ReactionConditions = {
      temperature: this.standardTemperature,
      pressure: this.standardPressure
    }
  ): Promise<ThermodynamicsResult> {
    try {
      // Get thermodynamic data for all compounds
      const compoundData = await this.getCompoundThermodynamicData(equation);
      
      // Calculate standard enthalpy change
      const deltaH = this.calculateEnthalpyChange(equation, compoundData);
      
      // Calculate standard entropy change
      const deltaS = this.calculateEntropyChange(equation, compoundData);
      
      // Calculate Gibbs free energy change
      const deltaG = this.calculateGibbsChange(deltaH, deltaS, conditions.temperature);
      
      // Calculate equilibrium constant
      const equilibriumConstant = this.calculateEquilibriumConstant(deltaG, conditions.temperature);
      
      // Determine spontaneity
      const spontaneity = this.determineSpontaneity(deltaG);
      
      // Generate temperature dependence profile
      const temperatureDependence = this.generateTemperatureProfile(deltaH, deltaS);

      return {
        deltaH,
        deltaS,
        deltaG,
        equilibriumConstant,
        spontaneity,
        temperatureDependence,
        conditions,
        // Alias properties for integrated balancer
        enthalpy: deltaH,
        gibbsFreeEnergy: deltaG,
        isSpontaneous: spontaneity === 'spontaneous'
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Thermodynamics calculation failed: ${errorMessage}`);
    }
  }

  /**
   * Calculate enthalpy change (ΔH) for the reaction
   * ΔH = Σ(coefficients × ΔHf products) - Σ(coefficients × ΔHf reactants)
   */
  private calculateEnthalpyChange(
    equation: BalancedEquation,
    compoundData: Map<string, ThermodynamicProperties>
  ): number {
    let deltaH = 0;

    // Products (positive contribution)
    equation.products.forEach((formula, index) => {
      const data = compoundData.get(formula);
      if (data) {
        const coefficient = equation.coefficients[equation.reactants.length + index];
        deltaH += coefficient * data.deltaHf;
      }
    });

    // Reactants (negative contribution)
    equation.reactants.forEach((formula, index) => {
      const data = compoundData.get(formula);
      if (data) {
        const coefficient = equation.coefficients[index];
        deltaH -= coefficient * data.deltaHf;
      }
    });

    return deltaH;
  }

  /**
   * Calculate entropy change (ΔS) for the reaction
   * ΔS = Σ(coefficients × S products) - Σ(coefficients × S reactants)
   */
  private calculateEntropyChange(
    equation: BalancedEquation,
    compoundData: Map<string, ThermodynamicProperties>
  ): number {
    let deltaS = 0;

    // Products (positive contribution)
    equation.products.forEach((formula, index) => {
      const data = compoundData.get(formula);
      if (data) {
        const coefficient = equation.coefficients[equation.reactants.length + index];
        deltaS += coefficient * data.entropy;
      }
    });

    // Reactants (negative contribution)
    equation.reactants.forEach((formula, index) => {
      const data = compoundData.get(formula);
      if (data) {
        const coefficient = equation.coefficients[index];
        deltaS -= coefficient * data.entropy;
      }
    });

    return deltaS / 1000; // Convert J/mol·K to kJ/mol·K
  }

  /**
   * Calculate Gibbs free energy change (ΔG)
   * ΔG = ΔH - T×ΔS
   */
  private calculateGibbsChange(deltaH: number, deltaS: number, temperature: number): number {
    return deltaH - (temperature * deltaS);
  }

  /**
   * Calculate equilibrium constant from Gibbs free energy
   * K = exp(-ΔG / RT)
   */
  private calculateEquilibriumConstant(deltaG: number, temperature: number): number {
    const exponent = -(deltaG * 1000) / (this.R * temperature); // Convert kJ to J
    return Math.exp(exponent);
  }

  /**
   * Determine reaction spontaneity based on Gibbs free energy
   */
  private determineSpontaneity(deltaG: number): 'spontaneous' | 'non-spontaneous' | 'equilibrium' {
    const tolerance = 0.1; // kJ/mol tolerance for equilibrium
    
    if (deltaG < -tolerance) {
      return 'spontaneous';
    } else if (deltaG > tolerance) {
      return 'non-spontaneous';
    } else {
      return 'equilibrium';
    }
  }

  /**
   * Generate temperature dependence profile
   */
  private generateTemperatureProfile(deltaH: number, deltaS: number): TemperatureProfile {
    const tempRange: [number, number] = [200, 800]; // K
    const points: Array<{ temperature: number; deltaG: number }> = [];
    
    // Calculate ΔG at different temperatures
    for (let T = tempRange[0]; T <= tempRange[1]; T += 50) {
      const deltaG = this.calculateGibbsChange(deltaH, deltaS, T);
      points.push({ temperature: T, deltaG });
    }

    // Find spontaneity threshold (where ΔG = 0)
    let spontaneityThreshold: number | undefined;
    if (deltaS !== 0) {
      const threshold = deltaH / deltaS; // T = ΔH / ΔS when ΔG = 0
      if (threshold > 0 && threshold >= tempRange[0] && threshold <= tempRange[1]) {
        spontaneityThreshold = threshold;
      }
    }

    return {
      range: tempRange,
      deltaGvsT: points,
      spontaneityThreshold
    };
  }

  /**
   * Get thermodynamic data for compounds in the equation
   * This would integrate with PubChem and NIST databases
   */
  private async getCompoundThermodynamicData(
    equation: BalancedEquation
  ): Promise<Map<string, ThermodynamicProperties>> {
    const data = new Map<string, ThermodynamicProperties>();
    
    // Collect all unique formulas
    const allCompounds = [
      ...equation.reactants,
      ...equation.products
    ];
    const uniqueFormulas = [...new Set(allCompounds)];

    // Fetch data for each compound
    for (const formula of uniqueFormulas) {
      try {
        const properties = await this.fetchThermodynamicProperties(formula);
        data.set(formula, properties);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.warn(`Could not fetch thermodynamic data for ${formula}: ${errorMessage}`);
        // Use estimated values or throw error
        data.set(formula, this.estimateThermodynamicProperties(formula));
      }
    }

    return data;
  }

  /**
   * Fetch thermodynamic properties from external databases
   * TODO: Implement PubChem/NIST integration
   */
  private async fetchThermodynamicProperties(formula: string): Promise<ThermodynamicProperties> {
    // This is a placeholder - actual implementation would query PubChem/NIST
    // For now, return some common compound values for demonstration
    
    const commonCompounds: Record<string, ThermodynamicProperties> = {
      'H2O': {
        deltaHf: -285.8, // kJ/mol
        entropy: 69.95, // J/(mol·K)
        heatCapacity: 75.3, // J/(mol·K)
        temperatureRange: [273, 373]
      },
      'CO2': {
        deltaHf: -393.5,
        entropy: 213.8,
        heatCapacity: 37.1,
        temperatureRange: [200, 800]
      },
      'H2': {
        deltaHf: 0,
        entropy: 130.7,
        heatCapacity: 28.8,
        temperatureRange: [200, 800]
      },
      'O2': {
        deltaHf: 0,
        entropy: 205.2,
        heatCapacity: 29.4,
        temperatureRange: [200, 800]
      },
      'CH4': {
        deltaHf: -74.6,
        entropy: 186.3,
        heatCapacity: 35.7,
        temperatureRange: [200, 800]
      }
    };

    if (commonCompounds[formula]) {
      return commonCompounds[formula];
    }

    throw new Error(`Thermodynamic data not available for ${formula}`);
  }

  /**
   * Estimate thermodynamic properties using group contribution methods
   * TODO: Implement Joback and Reid group contribution method
   */
  private estimateThermodynamicProperties(formula: string): ThermodynamicProperties {
    // Placeholder estimation - would use actual group contribution methods
    return {
      deltaHf: 0, // Assume elements in standard state
      entropy: 100, // Rough estimate
      heatCapacity: 30, // Rough estimate
      temperatureRange: [298, 500]
    };
  }

  /**
   * Calculate thermodynamics for reaction data format (used by integrated balancer)
   */
  async calculateReactionThermodynamics(
    reactionData: import('./types').ReactionData,
    temperature: number = this.standardTemperature
  ): Promise<ThermodynamicsResult> {
    // Convert ReactionData to BalancedEquation format
    const reactants = reactionData.reactants.map(r => r.formula);
    const products = reactionData.products.map(p => p.formula);
    const coefficients = [
      ...reactionData.reactants.map(r => r.coefficient),
      ...reactionData.products.map(p => p.coefficient)
    ];

    // Create equation string for BalancedEquation
    const reactantString = reactionData.reactants
      .map(r => `${r.coefficient > 1 ? r.coefficient : ''}${r.formula}`)
      .join(' + ');
    const productString = reactionData.products
      .map(p => `${p.coefficient > 1 ? p.coefficient : ''}${p.formula}`)
      .join(' + ');
    const equationString = `${reactantString} = ${productString}`;

    const equation: BalancedEquation = {
      equation: equationString,
      reactants,
      products,
      coefficients
    };

    const conditions: ReactionConditions = {
      temperature,
      pressure: this.standardPressure
    };

    return this.calculateThermodynamics(equation, conditions);
  }
}
