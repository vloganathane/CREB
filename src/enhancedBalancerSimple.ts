/**
 * Enhanced Chemical Equation Balancer with Advanced TypeScript Support
 * Simplified version that provides compound analysis and type safety
 */

import { ChemicalEquationBalancer } from './balancer';
import { ElementCounter } from './utils';
import { 
  ChemicalFormula, 
  ElementSymbol, 
  ValidElement,
  TypedElementCount,
  isChemicalFormula,
  isElementSymbol,
  parseFormula,
  createChemicalFormula
} from './advancedTypes';

/**
 * Enhanced chemical compound information
 */
export interface EnhancedCompoundInfo {
  formula: string;
  molarMass: number;
  elements: string[];
  elementCount: Record<string, number>;
}

/**
 * Enhanced balanced equation result with compound analysis
 */
export interface EnhancedBalanceResult {
  equation: string;
  isBalanced: boolean;
  compounds: EnhancedCompoundInfo[];
  coefficients?: number[];
  reactants?: string[];
  products?: string[];
}

/**
 * Enhanced balancer with type-safe compound analysis
 */
export class EnhancedBalancer {
  private balancer: ChemicalEquationBalancer;

  constructor() {
    this.balancer = new ChemicalEquationBalancer();
  }

  /**
   * Balance equation with enhanced compound information
   */
  balance(equation: string): EnhancedBalanceResult {
    try {
      // Use the detailed balancer for more information
      const result = this.balancer.balanceDetailed(equation);
      
      // Extract all unique formulas from reactants and products
      const allFormulas = new Set<string>();
      
      // Add formulas from the result structure
      if (result.reactants && result.reactants.length > 0) {
        result.reactants.forEach((formula: string) => allFormulas.add(formula));
      }
      if (result.products && result.products.length > 0) {
        result.products.forEach((formula: string) => allFormulas.add(formula));
      }

      // Analyze each compound
      const compounds = Array.from(allFormulas).map(formula => 
        this.analyzeCompound(formula)
      ).filter(compound => compound.formula !== ''); // Filter out empty results

      // Determine if the equation was balanced by checking if it changed OR if coefficients are all 1 (already balanced)
      const coefficientsAllOne = result.coefficients && result.coefficients.every(coeff => coeff === 1);
      const wasBalanced = result.equation !== equation || coefficientsAllOne;

      return {
        equation: result.equation,
        isBalanced: wasBalanced,
        compounds,
        coefficients: result.coefficients,
        reactants: result.reactants,
        products: result.products
      };

    } catch (error) {
      // Note: Error in enhanced balancer - using fallback
      return {
        equation,
        isBalanced: false,
        compounds: [],
        coefficients: [],
        reactants: [],
        products: []
      };
    }
  }

  /**
   * Analyze a single compound for detailed information
   */
  private analyzeCompound(formula: string): EnhancedCompoundInfo {
    try {
      const elementCounter = new ElementCounter(formula);
      const elementCount = elementCounter.parseFormula();
      
      const elements = Object.keys(elementCount);
      const molarMass = this.calculateMolarMass(elementCount);

      return {
        formula,
        molarMass,
        elements,
        elementCount
      };
    } catch (error) {
      return {
        formula,
        molarMass: 0,
        elements: [],
        elementCount: {}
      };
    }
  }

  /**
   * Calculate molar mass from element count
   */
  private calculateMolarMass(elementCount: Record<string, number>): number {
    // Atomic masses (simplified)
    const atomicMasses: Record<string, number> = {
      'H': 1.008, 'He': 4.003, 'Li': 6.941, 'Be': 9.012, 'B': 10.811,
      'C': 12.011, 'N': 14.007, 'O': 15.999, 'F': 18.998, 'Ne': 20.180,
      'Na': 22.990, 'Mg': 24.305, 'Al': 26.982, 'Si': 28.086, 'P': 30.974,
      'S': 32.065, 'Cl': 35.453, 'Ar': 39.948, 'K': 39.098, 'Ca': 40.078,
      'Fe': 55.845, 'Cu': 63.546, 'Zn': 65.38, 'Ag': 107.868, 'Au': 196.966
      // Add more as needed
    };

    let totalMass = 0;
    for (const [element, count] of Object.entries(elementCount)) {
      const atomicMass = atomicMasses[element];
      if (atomicMass) {
        totalMass += atomicMass * (count || 0);
      }
    }

    return totalMass;
  }

  /**
   * Simple formula validation
   */
  private isValidFormula(formula: string): boolean {
    // Basic validation - contains at least one capital letter
    return /[A-Z]/.test(formula) && formula.length > 0;
  }
}
