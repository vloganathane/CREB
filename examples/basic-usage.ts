import { ChemicalEquationBalancer, Stoichiometry, SpeciesData } from '../src';

// Example usage of the CREB library

console.log('=== Chemical Equation Balancer Examples ===\n');

const balancer = new ChemicalEquationBalancer();

// Simple equations
const equations = [
  'H2 + O2 = H2O',
  'Fe + O2 = Fe2O3', 
  'C + O2 = CO2',
  'Ca(OH)2 + HCl = CaCl2 + H2O',
  'Al + HCl = AlCl3 + H2'
];

equations.forEach(eq => {
  try {
    const balanced = balancer.balance(eq);
    console.log(`Original: ${eq}`);
    console.log(`Balanced: ${balanced}\n`);
  } catch (error) {
    console.log(`Failed to balance: ${eq} - ${error}\n`);
  }
});

console.log('=== Stoichiometry Examples ===\n');

// Stoichiometry calculations
const stoich = new Stoichiometry('2 H2 + O2 = 2 H2O');

console.log('Equation:', stoich.getBalancedEquation());
console.log('Species info:', stoich.getSpeciesInfo());

// Calculate from moles
console.log('\nCalculating from 4 moles of H2:');
const fromMoles = stoich.calculateFromMoles('H2', 4);
console.log('Reactants:');
Object.entries(fromMoles.reactants).forEach(([species, data]: [string, SpeciesData]) => {
  console.log(`  ${species}: ${data.moles} mol, ${data.grams} g`);
});
console.log('Products:');
Object.entries(fromMoles.products).forEach(([species, data]: [string, SpeciesData]) => {
  console.log(`  ${species}: ${data.moles} mol, ${data.grams} g`);
});

// Calculate from grams
console.log('\nCalculating from 36.03 grams of H2O:');
const fromGrams = stoich.calculateFromGrams('H2O', 36.03);
console.log('Reactants needed:');
Object.entries(fromGrams.reactants).forEach(([species, data]: [string, SpeciesData]) => {
  console.log(`  ${species}: ${data.moles} mol, ${data.grams} g`);
});

console.log('\n=== Molar Weight Examples ===\n');

const compounds = ['H2O', 'CO2', 'Ca(OH)2', 'Al2(SO4)3', 'C6H12O6'];
compounds.forEach(compound => {
  const mw = Stoichiometry.calculateMolarWeight(compound);
  console.log(`${compound}: ${mw} g/mol`);
});
