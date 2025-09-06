/**
 * Enhanced Chemical Equation Balancer with Advanced TypeScript Support
 * Provides superior type safety and IntelliSense support
 */

import {
  ChemicalFormula,
  ElementSymbol,
  BalancedEquationString,
  ValidElement,
  TypedElementCount,
  TypedEquationData,
  TypedBalancedEquation,
  TypedCompound,
  TypedReaction,
  ReactionType,
  PhaseState,
  isChemicalFormula,
  isElementSymbol,
  createChemicalFormula,
  ChemicalFormulaError,
  EquationBalancingError
} from './advancedTypes';

import { ChemicalEquationBalancer } from './balancer';
import { ElementCounter, EquationParser } from './utils';
import { BalancedEquation } from './types';

/**
 * Enhanced Chemical Equation Balancer with Advanced TypeScript Support
 */
export class TypeSafeChemicalEquationBalancer {
  private readonly baseBalancer: ChemicalEquationBalancer;

  constructor() {
    this.baseBalancer = new ChemicalEquationBalancer();
  }

  /**
   * Parse and validate chemical formulas with type safety
   */
  public parseFormula<T extends string>(
    formula: T
  ): T extends string ? TypedElementCount : never {
    if (!isChemicalFormula(formula)) {
      throw new ChemicalFormulaError(formula, 'invalid-syntax');
    }

    const elementCounter = new ElementCounter(formula);
    const elements = elementCounter.parseFormula();
    const typedElements: TypedElementCount = {};

    for (const [element, count] of Object.entries(elements)) {
      if (!isElementSymbol(element)) {
        throw new ChemicalFormulaError(formula, 'unknown-element');
      }
      (typedElements as any)[element] = count;
    }

    return typedElements as any;
  }

  /**
   * Balance equation with enhanced type safety
   */
  public balance<
    TReactants extends string,
    TProducts extends string
  >(equation: string): TypedBalancedEquation {
    try {
      // Validate input equation format
      if (!equation.includes('->') && !equation.includes('→')) {
        throw new EquationBalancingError(equation, 'invalid-reactants');
      }

      // Use base balancer with detailed result
      const result = this.baseBalancer.balanceDetailed(equation);

      // result is a BalancedEquation object
      const balancedEq = result;

      // Validate all formulas
      const reactants = balancedEq.reactants.map((formula: string) => {
        if (!isChemicalFormula(formula)) {
          throw new ChemicalFormulaError(formula, 'invalid-syntax');
        }
        return formula;
      });

      const products = balancedEq.products.map((formula: string) => {
        if (!isChemicalFormula(formula)) {
          throw new ChemicalFormulaError(formula, 'invalid-syntax');
        }
        return formula;
      });

      // Parse equation data
      const equationParser = new EquationParser(equation);
      const equationData = equationParser.parse();
      const allElements = new Set<string>();

      // Collect all elements
      Object.values(equationData.parsedReactants).forEach((elementCount: any) => {
        if (elementCount && typeof elementCount === 'object') {
          Object.keys(elementCount).forEach(element => {
            if (isElementSymbol(element)) {
              allElements.add(element);
            }
          });
        }
      });

      Object.values(equationData.parsedProducts).forEach((elementCount: any) => {
        if (elementCount && typeof elementCount === 'object') {
          Object.keys(elementCount).forEach(element => {
            if (isElementSymbol(element)) {
              allElements.add(element);
            }
          });
        }
      });

      // Verify elemental balance
      const elementalBalance: Record<string, number> = {};
      
      for (const element of allElements) {
        let reactantCount = 0;
        let productCount = 0;

        // Count in reactants
        reactants.forEach((formula: string, index: number) => {
          const elementCounter = new ElementCounter(formula);
          const elementCount = elementCounter.parseFormula();
          reactantCount += (elementCount[element] || 0) * balancedEq.coefficients[index];
        });

        // Count in products
        products.forEach((formula: string, index: number) => {
          const elementCounter = new ElementCounter(formula);
          const elementCount = elementCounter.parseFormula();
          productCount += (elementCount[element] || 0) * balancedEq.coefficients[reactants.length + index];
        });

        elementalBalance[element] = reactantCount - productCount;
      }

      // Verify balance
      const isBalanced = Object.values(elementalBalance).every(diff => Math.abs(diff) < 1e-10);
      
      if (!isBalanced) {
        throw new EquationBalancingError(equation, 'impossible-balance');
      }

      return {
        equation: balancedEq.equation as BalancedEquationString,
        coefficients: balancedEq.coefficients,
        reactants,
        products,
        elementalBalance: elementalBalance as Record<ValidElement, number>,
        isBalanced: true
      };

    } catch (error) {
      if (error instanceof ChemicalFormulaError || error instanceof EquationBalancingError) {
        throw error;
      }
      throw new EquationBalancingError(equation, 'impossible-balance');
    }
  }

  /**
   * Create a typed compound with validation
   */
  public createCompound<T extends ChemicalFormula>(
    formula: T,
    options: {
      name?: string;
      phase?: PhaseState;
      coefficient?: number;
    } = {}
  ): TypedCompound<T> {
    const validFormula = createChemicalFormula(formula);
    const elementCount = this.parseFormula(validFormula);
    const molarMass = this.calculateMolarMass(elementCount);

    return {
      formula: validFormula as T,
      name: options.name,
      phase: options.phase,
      coefficient: options.coefficient || 1,
      composition: {
        elements: elementCount,
        molecularWeight: molarMass,
        formula: validFormula
      },
      properties: {
        molarMass
      }
    };
  }

  /**
   * Create a typed reaction with validation
   */
  public createReaction<
    TReactants extends ChemicalFormula,
    TProducts extends ChemicalFormula
  >(
    reactants: TypedCompound<TReactants>[],
    products: TypedCompound<TProducts>[],
    options: {
      type?: ReactionType;
      conditions?: {
        temperature?: number;
        pressure?: number;
        catalyst?: string;
        solvent?: string;
      };
    } = {}
  ): TypedReaction<TReactants, TProducts> {
    // Build equation string
    const reactantStrings = reactants.map(r => 
      r.coefficient > 1 ? `${r.coefficient}${r.formula}` : r.formula
    );
    const productStrings = products.map(p => 
      p.coefficient > 1 ? `${p.coefficient}${p.formula}` : p.formula
    );
    
    const equationString = `${reactantStrings.join(' + ')} -> ${productStrings.join(' + ')}`;

    // Attempt to balance
    let balancedEquation: TypedBalancedEquation | undefined;
    let isBalanced = false;

    try {
      balancedEquation = this.balance(equationString);
      isBalanced = true;
    } catch (error) {
      // Equation is not balanced
      isBalanced = false;
    }

    return {
      reactants,
      products,
      type: options.type || this.classifyReactionType(reactants, products),
      isBalanced,
      balancedEquation,
      conditions: options.conditions
    };
  }

  /**
   * Auto-classify reaction type based on reactants and products
   */
  private classifyReactionType<
    TReactants extends ChemicalFormula,
    TProducts extends ChemicalFormula
  >(
    reactants: TypedCompound<TReactants>[],
    products: TypedCompound<TProducts>[]
  ): ReactionType {
    // Simple heuristics for reaction classification
    if (reactants.length === 1 && products.length > 1) {
      return 'decomposition';
    }
    
    if (reactants.length > 1 && products.length === 1) {
      return 'synthesis';
    }

    // Check for combustion (O2 reactant, CO2 and H2O products)
    const hasOxygen = reactants.some(r => r.formula.includes('O2'));
    const hasCO2 = products.some(p => p.formula === 'CO2');
    const hasH2O = products.some(p => p.formula === 'H2O');
    
    if (hasOxygen && hasCO2 && hasH2O) {
      return 'combustion';
    }

    // Check for acid-base (H+ transfer indicators)
    const hasAcid = reactants.some(r => r.formula.includes('H') && r.name?.toLowerCase().includes('acid'));
    const hasBase = reactants.some(r => r.formula.includes('OH') || r.name?.toLowerCase().includes('base'));
    
    if (hasAcid && hasBase) {
      return 'acid-base';
    }

    // Default to general classification
    if (reactants.length === 2 && products.length === 2) {
      return 'double-replacement';
    }

    return 'synthesis'; // Default fallback
  }

  /**
   * Calculate molar mass from element count
   */
  private calculateMolarMass(elementCount: TypedElementCount): number {
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
   * Validate chemical equation syntax
   */
  public validateEquation(equation: string): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];

    try {
      // Check basic format
      if (!equation.includes('->') && !equation.includes('→')) {
        errors.push('Equation must contain "->" or "→" separator');
      }

      // Parse and validate each formula
      const parts = equation.split(/->|→/);
      if (parts.length !== 2) {
        errors.push('Equation must have exactly one arrow separator');
      }

      const [reactantSide, productSide] = parts;
      
      // Validate reactants
      const reactants = reactantSide.split('+').map(s => s.trim());
      for (const reactant of reactants) {
        const formula = reactant.replace(/^\d+/, '').trim();
        if (!isChemicalFormula(formula)) {
          errors.push(`Invalid reactant formula: ${formula}`);
        }
      }

      // Validate products
      const products = productSide.split('+').map(s => s.trim());
      for (const product of products) {
        const formula = product.replace(/^\d+/, '').trim();
        if (!isChemicalFormula(formula)) {
          errors.push(`Invalid product formula: ${formula}`);
        }
      }

      // Try to balance
      if (errors.length === 0) {
        try {
          this.balance(equation);
        } catch (error) {
          if (error instanceof EquationBalancingError) {
            warnings.push(`Equation may not be balanceable: ${error.reason}`);
          }
        }
      }

    } catch (error) {
      errors.push(`Unexpected error during validation: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }
}

// Export enhanced types and classes
export {
  TypeSafeChemicalEquationBalancer as EnhancedBalancer,
  type TypedBalancedEquation as EnhancedBalancedEquation,
  type TypedCompound as EnhancedCompound,
  type TypedReaction as EnhancedReaction,
  ChemicalFormulaError,
  EquationBalancingError
};
