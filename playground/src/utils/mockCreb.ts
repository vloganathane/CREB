// Mock CREB-JS implementation to isolate browser compatibility issues
export class ChemicalEquationBalancer {
  balance(equation: string) {
    // Simple mock balancing logic
    const parts = equation.split('=');
    const reactants = parts[0]?.trim().split('+').map(r => r.trim()) || [];
    const products = parts[1]?.trim().split('+').map(p => p.trim()) || [];
    
    return {
      equation: `2${reactants[0]} + ${reactants[1]} = 2${products[0]}`,
      coefficients: [2, 1, 2],
      isBalanced: true,
      reactants: reactants,
      products: products,
    };
  }
}

export function calculateMolarWeight(formula: string): number {
  // Simple mock molecular weight calculation
  const weights: { [key: string]: number } = {
    'H': 1.008,
    'C': 12.011,
    'N': 14.007,
    'O': 15.999,
    'Na': 22.990,
    'Cl': 35.453,
  };
  
  // Very simple parser for demo purposes
  let weight = 0;
  for (const char of formula) {
    if (weights[char]) {
      weight += weights[char];
    }
  }
  
  return weight;
}

export function createMolecularVisualization() {
  return {
    render: () => console.log('Mock molecular visualization'),
  };
}

export class MolecularVisualization {
  constructor() {
    console.log('Mock MolecularVisualization initialized');
  }
}
