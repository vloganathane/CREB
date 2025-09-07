import { EquationParser, getElementsInReaction } from './utils';
import { EquationData, LinearSystem, BalancedEquation } from './types';
import { ComputationError } from './core/errors/CREBError';
import { Injectable } from './core/decorators/Injectable';

/**
 * Linear equation system generator and solver
 * Based on the Generator and FileMaker classes from the original CREB project
 */
export class LinearEquationSolver {
  private equationData: EquationData;
  private allSpecies: string[];
  private elements: string[];

  constructor(chemicalEquation: string) {
    const parser = new EquationParser(chemicalEquation);
    this.equationData = parser.parse();
    this.allSpecies = [...this.equationData.reactants, ...this.equationData.products];
    this.elements = getElementsInReaction(
      this.equationData.parsedReactants,
      this.equationData.parsedProducts
    );
  }

  /**
   * Generates the system of linear equations representing the chemical balance
   */
  generateLinearSystem(): LinearSystem {
    const equations = [];
    
    // Create one equation for each element
    for (const element of this.elements) {
      const coefficients = [];
      
      // For each species in the reaction
      for (const species of this.allSpecies) {
        let coefficient = 0;
        
        // Check if this species contains the current element
        if (this.equationData.reactants.includes(species)) {
          // Reactants have positive coefficients
          const elementCount = this.equationData.parsedReactants[species][element] || 0;
          coefficient = elementCount;
        } else if (this.equationData.products.includes(species)) {
          // Products have negative coefficients
          const elementCount = this.equationData.parsedProducts[species][element] || 0;
          coefficient = -elementCount;
        }
        
        coefficients.push(coefficient);
      }
      
      equations.push({
        coefficients,
        constant: 0 // All equations equal zero (balanced)
      });
    }

    return {
      equations,
      variables: this.allSpecies.map((_, i) => `x${i}`)
    };
  }

  /**
   * Solves the linear system to find coefficients
   */
  solve(): number[] {
    const system = this.generateLinearSystem();
    
    // For simple equations, try a brute force approach with small integer coefficients
    const maxCoeff = 10;
    const numSpecies = this.allSpecies.length;
    
    // Try different combinations of coefficients
    for (let attempt = 1; attempt <= maxCoeff; attempt++) {
      const coefficients = this.findCoefficients(system, attempt);
      if (coefficients) {
        return coefficients;
      }
    }
    
    throw new ComputationError(
      'Unable to balance equation: Could not find integer coefficients',
      { maxCoeff, numSpecies, operation: 'equation_balancing' }
    );
  }

  /**
   * Tries to find valid coefficients using a systematic approach
   */
  private findCoefficients(system: LinearSystem, maxVal: number): number[] | null {
    const numSpecies = this.allSpecies.length;
    
    // Generate all possible combinations
    const generateCombinations = (length: number, max: number): number[][] => {
      const results: number[][] = [];
      
      const generate = (current: number[], remaining: number) => {
        if (remaining === 0) {
          results.push([...current]);
          return;
        }
        
        for (let i = 1; i <= max; i++) {
          current.push(i);
          generate(current, remaining - 1);
          current.pop();
        }
      };
      
      generate([], length);
      return results;
    };
    
    const combinations = generateCombinations(numSpecies, maxVal);
    
    for (const coeffs of combinations) {
      if (this.checkBalance(system, coeffs)) {
        return coeffs;
      }
    }
    
    return null;
  }

  /**
   * Checks if given coefficients balance the equation
   */
  private checkBalance(system: LinearSystem, coefficients: number[]): boolean {
    for (const equation of system.equations) {
      let sum = 0;
      for (let i = 0; i < coefficients.length; i++) {
        sum += equation.coefficients[i] * coefficients[i];
      }
      if (Math.abs(sum) > 1e-10) { // Allow for small floating point errors
        return false;
      }
    }
    return true;
  }

  /**
   * Normalizes coefficients to positive integers
   */
  private normalizeCoefficients(coefficients: number[]): number[] {
    // Convert to positive numbers
    const positiveCoeffs = coefficients.map(c => Math.abs(c));
    
    // Find a common denominator and convert to integers
    const precision = 1000; // For handling decimal coefficients
    const intCoeffs = positiveCoeffs.map(c => Math.round(c * precision));
    
    // Find GCD and simplify
    const gcd = this.findGCD(intCoeffs.filter(c => c !== 0));
    const simplified = intCoeffs.map(c => c / gcd);
    
    // Ensure all coefficients are at least 1
    const minCoeff = Math.min(...simplified.filter(c => c > 0));
    const scaled = simplified.map(c => Math.round(c / minCoeff));
    
    return scaled.map(c => c === 0 ? 1 : c);
  }

  /**
   * Finds the greatest common divisor of an array of numbers
   */
  private findGCD(numbers: number[]): number {
    const gcdTwo = (a: number, b: number): number => {
      return b === 0 ? a : gcdTwo(b, a % b);
    };
    
    return numbers.reduce((acc, num) => gcdTwo(acc, Math.abs(num)));
  }
}

/**
 * Chemical equation balancer
 * Based on the main CREB functionality
 */
@Injectable()
export class ChemicalEquationBalancer {
  /**
   * Balances a chemical equation and returns the balanced equation string
   */
  balance(equation: string): string {
    try {
      const solver = new LinearEquationSolver(equation);
      const coefficients = solver.solve();
      
      const parser = new EquationParser(equation);
      const { reactants, products } = parser.parse();
      
      return this.formatBalancedEquation(reactants, products, coefficients);
    } catch (error) {
      throw new ComputationError(
        `Failed to balance equation "${equation}": ${error}`,
        { equation, operation: 'equation_balancing', originalError: error }
      );
    }
  }

  /**
   * Balances a chemical equation and returns detailed result
   */
  balanceDetailed(equation: string): BalancedEquation {
    const solver = new LinearEquationSolver(equation);
    const coefficients = solver.solve();
    
    const parser = new EquationParser(equation);
    const { reactants, products } = parser.parse();
    
    return {
      equation: this.formatBalancedEquation(reactants, products, coefficients),
      coefficients,
      reactants,
      products
    };
  }

  private formatBalancedEquation(reactants: string[], products: string[], coefficients: number[]): string {
    const formatSide = (species: string[], startIndex: number): string => {
      return species.map((specie, index) => {
        const coeff = coefficients[startIndex + index];
        return coeff === 1 ? specie : `${coeff} ${specie}`;
      }).join(' + ');
    };

    const reactantSide = formatSide(reactants, 0);
    const productSide = formatSide(products, reactants.length);
    
    return `${reactantSide} = ${productSide}`;
  }
}
