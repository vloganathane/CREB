import { PERIODIC_TABLE } from './constants';
import { ElementCount } from './types';

/**
 * Utility functions for chemical formula parsing and calculations
 */

/**
 * Counts elements in a chemical formula
 * Based on the ElementCounter class from the original CREB project
 */
export class ElementCounter {
  private formula: string;

  constructor(chemicalFormula: string) {
    this.formula = chemicalFormula;
  }

  /**
   * Parses the chemical formula and returns element counts
   * Handles parentheses and multipliers
   */
  parseFormula(): ElementCount {
    let formula = this.formula;
    
    // Expand parentheses
    while (formula.includes('(')) {
      formula = formula.replace(/\(([^()]+)\)(\d*)/g, (match, group, multiplier) => {
        const mult = multiplier ? parseInt(multiplier) : 1;
        return this.expandGroup(group, mult);
      });
    }

    // Count elements
    const elementCounts: ElementCount = {};
    const matches = formula.match(/([A-Z][a-z]*)(\d*)/g) || [];
    
    for (const match of matches) {
      const elementMatch = match.match(/([A-Z][a-z]*)(\d*)/);
      if (elementMatch) {
        const element = elementMatch[1];
        const count = elementMatch[2] ? parseInt(elementMatch[2]) : 1;
        elementCounts[element] = (elementCounts[element] || 0) + count;
      }
    }

    return elementCounts;
  }

  private expandGroup(group: string, multiplier: number): string {
    const matches = group.match(/([A-Z][a-z]*)(\d*)/g) || [];
    let expanded = '';
    
    for (const match of matches) {
      const elementMatch = match.match(/([A-Z][a-z]*)(\d*)/);
      if (elementMatch) {
        const element = elementMatch[1];
        const count = elementMatch[2] ? parseInt(elementMatch[2]) : 1;
        const newCount = count * multiplier;
        expanded += element + (newCount > 1 ? newCount : '');
      }
    }
    
    return expanded;
  }
}

/**
 * Parses a chemical equation into reactants and products
 * Based on the EquationParser class from the original CREB project
 */
export class EquationParser {
  private equation: string;
  private equationSplitter = '=';
  private speciesSplitter = '+';

  constructor(chemicalEquation: string) {
    this.equation = chemicalEquation.replace(/\s/g, ''); // Remove all spaces
  }

  /**
   * Parses the equation and returns structured data
   */
  parse() {
    const { reactants, products } = this.splitIntoSpecies();
    const parsedReactants = this.parseSpecies(reactants);
    const parsedProducts = this.parseSpecies(products);

    return {
      reactants,
      products,
      parsedReactants,
      parsedProducts
    };
  }

  private splitIntoSpecies() {
    // Check if equation is empty or only whitespace
    if (!this.equation || this.equation.length === 0) {
      throw new Error('Empty equation provided. Please enter a valid chemical equation.');
    }
    
    const sides = this.equation.split(this.equationSplitter);
    if (sides.length !== 2) {
      throw new Error('Invalid equation format. Must contain exactly one "=" sign.');
    }
    
    // Check if either side is empty
    if (!sides[0].trim() || !sides[1].trim()) {
      throw new Error('Both sides of the equation must contain chemical species.');
    }

    const cleanSpecies = (speciesString: string): string[] => {
      return speciesString.split(this.speciesSplitter)
        .map(species => species.trim())
        .filter(species => species.length > 0)
        .map(species => {
          // Remove existing coefficients (numbers at the beginning)
          return species.replace(/^\d+\s*/, '');
        });
    };

    const reactants = cleanSpecies(sides[0]);
    const products = cleanSpecies(sides[1]);

    return { reactants, products };
  }

  private parseSpecies(species: string[]) {
    const parsed: { [species: string]: ElementCount } = {};
    
    for (const specie of species) {
      const counter = new ElementCounter(specie);
      parsed[specie] = counter.parseFormula();
    }
    
    return parsed;
  }
}

/**
 * Calculates molar weight of a chemical formula
 */
export function calculateMolarWeight(formula: string): number {
  const counter = new ElementCounter(formula);
  const elementCounts = counter.parseFormula();
  
  let molarWeight = 0;
  for (const element in elementCounts) {
    if (!(element in PERIODIC_TABLE)) {
      throw new Error(`Unknown element: ${element}`);
    }
    molarWeight += elementCounts[element] * PERIODIC_TABLE[element];
  }
  
  return parseFloat(molarWeight.toFixed(3));
}

/**
 * Gets all unique elements present in a reaction
 */
export function getElementsInReaction(parsedReactants: any, parsedProducts: any): string[] {
  const elements = new Set<string>();
  
  // Add elements from reactants
  Object.values(parsedReactants).forEach((species: any) => {
    Object.keys(species).forEach(element => elements.add(element));
  });
  
  // Add elements from products
  Object.values(parsedProducts).forEach((species: any) => {
    Object.keys(species).forEach(element => elements.add(element));
  });
  
  return Array.from(elements);
}
