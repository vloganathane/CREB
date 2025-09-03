import { calculateMolarWeight, EquationParser } from './utils';
import { ChemicalEquationBalancer } from './balancer';
import { StoichiometryResult, SpeciesData } from './types';

/**
 * Stoichiometry calculator
 * Based on the Stoichiometry class from the original CREB project
 */
export class Stoichiometry {
  private equation?: string;
  private reactants: string[] = [];
  private products: string[] = [];
  private coefficients: number[] = [];
  private balancer: ChemicalEquationBalancer;

  constructor(equation?: string) {
    this.balancer = new ChemicalEquationBalancer();
    
    if (equation) {
      this.equation = equation;
      this.initializeFromEquation(equation);
    }
  }

  private initializeFromEquation(equation: string) {
    // First, parse the raw equation (without coefficients) to get species names
    const rawParser = new EquationParser(equation);
    const rawData = rawParser.parse();
    
    // Balance the equation to get coefficients
    const balanced = this.balancer.balanceDetailed(equation);
    this.reactants = rawData.reactants;
    this.products = rawData.products;
    this.coefficients = balanced.coefficients;
  }

  /**
   * Calculates the molar weight of a chemical formula
   */
  calculateMolarWeight(formula: string): number {
    return calculateMolarWeight(formula);
  }

  /**
   * Calculates stoichiometric ratios relative to a selected species
   */
  calculateRatios(selectedSpecies: string): number[] {
    if (!this.equation) {
      throw new Error('No equation provided. Initialize with an equation first.');
    }

    const allSpecies = [...this.reactants, ...this.products];
    const selectedIndex = allSpecies.indexOf(selectedSpecies);
    
    if (selectedIndex === -1) {
      const availableSpecies = allSpecies.join(', ');
      throw new Error(`Species "${selectedSpecies}" not found in the equation. Available species: ${availableSpecies}`);
    }

    const selectedCoefficient = this.coefficients[selectedIndex];
    return this.coefficients.map(coeff => coeff / selectedCoefficient);
  }

  /**
   * Performs stoichiometric calculations starting from moles
   */
  calculateFromMoles(selectedSpecies: string, moles: number): StoichiometryResult {
    if (!this.equation) {
      throw new Error('No equation provided. Initialize with an equation first.');
    }

    const ratios = this.calculateRatios(selectedSpecies);
    const allSpecies = [...this.reactants, ...this.products];
    
    const result: StoichiometryResult = {
      reactants: {},
      products: {},
      totalMolarMass: { reactants: 0, products: 0 }
    };

    // Calculate for all species
    allSpecies.forEach((species, index) => {
      const speciesMoles = ratios[index] * moles;
      const molarWeight = this.calculateMolarWeight(species);
      const grams = speciesMoles * molarWeight;

      const speciesData: SpeciesData = {
        moles: parseFloat(speciesMoles.toFixed(3)),
        grams: parseFloat(grams.toFixed(3)),
        molarWeight: molarWeight
      };

      if (this.reactants.includes(species)) {
        result.reactants[species] = speciesData;
        result.totalMolarMass.reactants += grams;
      } else {
        result.products[species] = speciesData;
        result.totalMolarMass.products += grams;
      }
    });

    // Round total molar masses
    result.totalMolarMass.reactants = parseFloat(result.totalMolarMass.reactants.toFixed(3));
    result.totalMolarMass.products = parseFloat(result.totalMolarMass.products.toFixed(3));

    return result;
  }

  /**
   * Performs stoichiometric calculations starting from grams
   */
  calculateFromGrams(selectedSpecies: string, grams: number): StoichiometryResult {
    if (!this.equation) {
      throw new Error('No equation provided. Initialize with an equation first.');
    }

    const molarWeight = this.calculateMolarWeight(selectedSpecies);
    const moles = grams / molarWeight;
    
    return this.calculateFromMoles(selectedSpecies, moles);
  }

  /**
   * Gets the balanced equation
   */
  getBalancedEquation(): string {
    if (!this.equation) {
      throw new Error('No equation provided.');
    }
    return this.balancer.balance(this.equation);
  }

  /**
   * Gets all species in the reaction with their molar weights
   */
  getSpeciesInfo(): { [species: string]: { molarWeight: number; type: 'reactant' | 'product' } } {
    const result: { [species: string]: { molarWeight: number; type: 'reactant' | 'product' } } = {};
    
    this.reactants.forEach(species => {
      result[species] = {
        molarWeight: this.calculateMolarWeight(species),
        type: 'reactant'
      };
    });

    this.products.forEach(species => {
      result[species] = {
        molarWeight: this.calculateMolarWeight(species),
        type: 'product'
      };
    });

    return result;
  }

  /**
   * Static method to calculate molar weight without instantiating the class
   */
  static calculateMolarWeight(formula: string): number {
    return calculateMolarWeight(formula);
  }
}
