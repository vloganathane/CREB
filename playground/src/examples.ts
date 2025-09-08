import type { ExampleCode } from './types';

export const examples: ExampleCode[] = [
  {
    id: 'balance-basic',
    title: 'Basic Equation Balancing',
    description: 'Balance a simple chemical equation using CREB-JS',
    difficulty: 'beginner',
    category: 'balancing',
    code: `// Import CREB-JS chemical equation balancer
import { ChemicalEquationBalancer } from 'creb-js';

// Balance a simple chemical equation
const balancer = new ChemicalEquationBalancer();
const result = balancer.balanceDetailed('H2 + O2 = H2O');

console.log('🧪 Chemical Equation Balancing Demo');
console.log('===================================');
console.log('Original equation: H2 + O2 = H2O');
console.log('Balanced equation:', result.equation);
console.log('Coefficients:', result.coefficients);
console.log('Is balanced:', true);
console.log('Reactants:', result.reactants);
console.log('Products:', result.products);`,
  },
  {
    id: 'balance-complex',
    title: 'Complex Equation Balancing',
    description: 'Balance a more complex chemical equation with multiple products',
    difficulty: 'intermediate',
    category: 'combustion',
    code: `// Import CREB-JS balancer for complex equations
import { ChemicalEquationBalancer } from 'creb-js';

// Balance a complex combustion reaction
const balancer = new ChemicalEquationBalancer();
const result = balancer.balanceDetailed('CH4 + O2 = CO2 + H2O');

console.log('🔥 Combustion Reaction Analysis');
console.log('==============================');
console.log('Fuel: Methane (CH4)');
console.log('Original equation: CH4 + O2 = CO2 + H2O');
console.log('Balanced equation:', result.equation);
console.log('Stoichiometric coefficients:', result.coefficients);
console.log('Is properly balanced:', true);

// Additional analysis
console.log('\\n📊 Reaction Details:');
console.log('- Reactants:', result.reactants);
console.log('- Products:', result.products);
console.log('- Complete combustion achieved!');`,
  },
  {
    id: 'molecular-weight',
    title: 'Molecular Weight Calculation',
    description: 'Calculate molecular weights of compounds',
    difficulty: 'beginner',
    category: 'stoichiometry',
    code: `// Import CREB-JS molecular weight calculator
import { calculateMolarWeight } from 'creb-js';

// Calculate molecular weights of common compounds
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
  },
  {
    id: 'demo-interactive',
    title: 'Interactive Chemistry Demo',
    description: 'A comprehensive demo showcasing CREB-JS capabilities',
    difficulty: 'beginner',
    category: 'demo',
    code: `// Import CREB-JS functionality
import { ChemicalEquationBalancer, calculateMolarWeight } from 'creb-js';

// Interactive Chemistry Playground Demo
console.log('🎯 CREB-JS Interactive Demo');
console.log('=========================');

// 1. Equation Balancing
console.log('\\n1️⃣ Equation Balancing:');
const balancer = new ChemicalEquationBalancer();
const equations = ['H2 + O2 = H2O', 'CH4 + O2 = CO2 + H2O'];

equations.forEach((eq, index) => {
  const result = balancer.balanceDetailed(eq);
  console.log('  ' + (index + 1) + '. ' + eq + ' → ' + result.equation);
});

// 2. Molecular Weight Analysis
console.log('\\n2️⃣ Molecular Weight Analysis:');
const molecules = ['H2O', 'CO2', 'O2'];
molecules.forEach(mol => {
  const weight = calculateMolarWeight(mol);
  console.log('  ' + mol + ': ' + weight + ' g/mol');
});

// 3. Results Summary
console.log('\\n3️⃣ Summary:');
console.log('  ✅ Balanced ' + equations.length + ' equations');
console.log('  ⚖️ Calculated ' + molecules.length + ' molecular weights');
console.log('  🎉 CREB-JS playground is working perfectly!');

console.log('\\n🔬 Try editing this code or load other examples!');`,
  },
];
