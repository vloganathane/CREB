import type { ExampleCode } from './types';

export const examples:  {
    id: 'molecular-weight',
    title: 'Molecular Weight Calculation',
    description: 'Calculate molecular weights of compounds',
    difficulty: 'beginner',
    category: 'stoichiometry',
    code: `// Calculate molecular weights of common compounds
console.log('⚗️ Molecular Weight Calculator');
console.log('============================');

const compounds = ['H2O', 'CO2', 'C6H12O6', 'NaCl', 'CaCO3'];
const results = [];

compounds.forEach(formula => {
  const weight = calculateMolarWeight(formula);
  console.log(formula + ': ' + weight.toFixed(3) + ' g/mol');
  results.push({ formula, weight });
});

console.log('\\n📋 Summary:');
console.log('Total compounds analyzed: ' + results.length);
const avgWeight = results.reduce((sum, item) => sum + item.weight, 0) / results.length;
console.log('Average molecular weight: ' + avgWeight.toFixed(2) + ' g/mol');

// Find heaviest and lightest
const heaviest = results.reduce((max, item) => item.weight > max.weight ? item : max);
const lightest = results.reduce((min, item) => item.weight < min.weight ? item : min);

console.log('\\n🏆 Heaviest: ' + heaviest.formula + ' (' + heaviest.weight + ' g/mol)');
console.log('🪶 Lightest: ' + lightest.formula + ' (' + lightest.weight + ' g/mol)');`,
  },= [
  {
    id: 'balance-basic',
    title: 'Basic Equation Balancing',
    description: 'Balance a simple chemical equation using CREB-JS',
    difficulty: 'beginner',
    category: 'balancing',
    code: `// Balance a simple chemical equation
const balancer = new ChemicalEquationBalancer();
const result = balancer.balance('H2 + O2 = H2O');

console.log('🧪 Chemical Equation Balancing Demo');
console.log('===================================');
console.log('Original equation: H2 + O2 = H2O');
console.log('Balanced equation:', result.equation);
console.log('Coefficients:', result.coefficients);
console.log('Is balanced:', result.isBalanced);
console.log('Reactants:', result.reactants);
console.log('Products:', result.products);`,
  },
  {
    id: 'balance-complex',
    title: 'Complex Equation Balancing',
    description: 'Balance a more complex chemical equation with multiple products',
    difficulty: 'intermediate',
    category: 'combustion',
    code: `// Balance a complex combustion reaction
const balancer = new ChemicalEquationBalancer();
const result = balancer.balance('CH4 + O2 = CO2 + H2O');

console.log('🔥 Combustion Reaction Analysis');
console.log('==============================');
console.log('Fuel: Methane (CH4)');
console.log('Original equation: CH4 + O2 = CO2 + H2O');
console.log('Balanced equation:', result.equation);
console.log('Stoichiometric coefficients:', result.coefficients);
console.log('Is properly balanced:', result.isBalanced);

// Additional analysis
console.log('\\n📊 Reaction Details:');
console.log('- Reactants:', result.reactants);
console.log('- Products:', result.products);
console.log('- Complete combustion achieved!');`,
  },
  {
    id: 'balance-complex',
    title: 'Complex Equation Balancing',
    description: 'Balance a more complex chemical equation with multiple products',
    difficulty: 'intermediate',
    category: 'combustion',
    code: `// Balance a complex combustion reaction
const balancer = new ChemicalEquationBalancer();
const result = balancer.balance('CH4 + O2 = CO2 + H2O');

console.log('Balanced equation:', result.equation);
console.log('Coefficients:', result.coefficients);
console.log('Is balanced:', result.isBalanced);
console.log('Result:', result);`,
  },
  {
    id: 'molecular-weight',
    title: 'Molecular Weight Calculation',
    description: 'Calculate molecular weights of compounds',
    difficulty: 'beginner',
    category: 'stoichiometry',
    code: `// Calculate molecular weights
const compounds = ['H2O', 'CO2', 'C6H12O6', 'NaCl', 'CaCO3'];
const results = [];

compounds.forEach(formula => {
  const weight = calculateMolarWeight(formula);
  console.log(\`\${formula}: \${weight.toFixed(2)} g/mol\`);
  results.push({ formula, weight });
});

const summary = {
  compounds: results,
  total: results.reduce((sum, item) => sum + item.weight, 0)
};
console.log('Summary:', summary);`,
  },
  {
    id: 'demo-playground',
    title: 'Playground Demo',
    description: 'Demonstrate the interactive capabilities of the playground',
    difficulty: 'beginner',
    category: 'demo',
    code: `// Welcome to CREB-JS Playground!
// This is a demonstration of chemical computation

console.log('🧪 CREB-JS Playground Demo');
console.log('==========================');

// Example 1: Balance a chemical equation
const balancer = new ChemicalEquationBalancer();
const waterFormation = balancer.balance('H2 + O2 = H2O');

console.log('\\n1. Chemical Equation Balancing:');
console.log('Original: H2 + O2 = H2O');
console.log('Balanced:', waterFormation.equation);

// Example 2: Calculate molecular weights
console.log('\\n2. Molecular Weight Calculations:');
const molecules = ['H2O', 'CO2', 'CH4'];
molecules.forEach(mol => {
  const weight = calculateMolarWeight(mol);
  console.log(\`\${mol}: \${weight} g/mol\`);
});

// Summary
const summary = {
  demo: 'CREB-JS Playground',
  features: ['Equation Balancing', 'Molecular Weights', 'Interactive Execution'],
  status: 'Working perfectly! 🎉'
};
console.log('\\nSummary:', summary);`,
  },
];

export const getExamplesByDifficulty = (difficulty: string) => {
  return examples.filter(example => example.difficulty === difficulty);
};

export const getExampleById = (id: string) => {
  return examples.find(example => example.id === id);
};
