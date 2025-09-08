/**
 * Browser-compatible CREB-JS entry point
 * This file excludes Node.js-specific functionality to ensure browser compatibility
 */

// Core chemistry functionality (browser-compatible)
export { ChemicalEquationBalancer } from './balancer';
export { Stoichiometry } from './stoichiometry';
export { ElementCounter, EquationParser, calculateMolarWeight } from './utils';
export * from './types';
export * from './constants';

// Enhanced TypeScript Support (browser-compatible)
export {
  // Branded Types
  type ChemicalFormula,
  type ElementSymbol,
  type BalancedEquationString,
  type SMILESNotation,
  type InChINotation,
  type CASNumber,
  
  // Advanced Types
  type ValidElement,
  type TypedElementCount,
  type TypedCompound,
  type TypedReaction,
  type ReactionType,
  type PhaseState,
  
  // Type Guards
  isChemicalFormula,
  isElementSymbol,
  isBalancedEquation,
  
  // Utility Functions
  parseFormula,
  createChemicalFormula,
  createElementSymbol,
  
  // Error Types
  ChemicalFormulaError,
  EquationBalancingError
} from './advancedTypes';

export { EnhancedBalancer } from './enhancedBalancerSimple';

// Enhanced PubChem-integrated classes (browser-compatible version)
export { 
  EnhancedChemicalEquationBalancer,
  type EnhancedBalancedEquation,
  type CompoundInfo 
} from './enhancedBalancer';

// Browser-compatible visualization - import specific components
export { Canvas2DRenderer } from './visualization/Canvas2DRenderer';
export { SVGRenderer } from './visualization/SVGRenderer';
export { 
  MolecularVisualization,
  type MolecularVisualizationConfig,
  type MolecularStyleOptions,
  type MoleculeVisualizationData
} from './visualization/SimplifiedMolecularVisualization';

// Import the class for use in factory function
import { MolecularVisualization as MolViz } from './visualization/SimplifiedMolecularVisualization';

// Re-export specific visualization types and functions
export type MoleculeForVisualization = {
  elements: string[];
  formula?: string;
};

export function convertMoleculeToVisualization(molecule: MoleculeForVisualization) {
  const atoms = molecule.elements.map((element: string, index: number) => ({
    element,
    x: Math.random() * 4 - 2,
    y: Math.random() * 4 - 2,
    z: Math.random() * 4 - 2
  }));

  const bonds = [];
  for (let i = 0; i < atoms.length - 1; i++) {
    bonds.push({
      atom1: i,
      atom2: i + 1,
      order: 1
    });
  }

  return {
    atoms,
    bonds,
    smiles: molecule.formula || `${molecule.elements.join('')}`
  };
}

// Simple factory function that can be tree-shaken if not used
export function createMolecularVisualization(container: any, options: any = {}) {
  return new MolViz({ container, ...options });
}

// Browser polyfill for EventEmitter
export class EventEmitter {
  private events: { [key: string]: Function[] } = {};

  on(event: string, listener: Function): this {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(listener);
    return this;
  }

  emit(event: string, ...args: any[]): boolean {
    if (this.events[event]) {
      this.events[event].forEach(listener => listener(...args));
      return true;
    }
    return false;
  }

  removeListener(event: string, listener: Function): this {
    if (this.events[event]) {
      this.events[event] = this.events[event].filter(l => l !== listener);
    }
    return this;
  }

  removeAllListeners(event?: string): this {
    if (event) {
      delete this.events[event];
    } else {
      this.events = {};
    }
    return this;
  }
}
