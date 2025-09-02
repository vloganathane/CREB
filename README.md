# CREB-JS: Chemical Reaction Equation Balancer

A TypeScript/JavaScript library for balancing chemical equations and performing stoichiometric calculations.

## Features

- 🧪 Balance chemical equations automatically
- ⚖️ Calculate stoichiometric ratios
- 🧮 Compute molar weights
- 📊 Perform mole and mass calculations
- 🔬 Support for complex chemical formulas with parentheses
- 📦 TypeScript support with full type definitions

## Installation

```bash
npm install creb-js
```

## Quick Start

```javascript
import { ChemicalEquationBalancer, Stoichiometry } from 'creb-js';

// Balance a chemical equation
const balancer = new ChemicalEquationBalancer();
const balanced = balancer.balance('H2 + O2 = H2O');
console.log(balanced); // "2 H2 + O2 = 2 H2O"

// Calculate molar weight
const stoich = new Stoichiometry();
const molarWeight = stoich.calculateMolarWeight('H2O');
console.log(molarWeight); // 18.015

// Perform stoichiometric calculations
const equation = '2 H2 + O2 = 2 H2O';
const calculator = new Stoichiometry(equation);
const results = calculator.calculateFromMoles('H2', 2);
console.log(results);
```

## API Reference

### ChemicalEquationBalancer

#### `balance(equation: string): string`
Balances a chemical equation and returns the balanced equation string.

### Stoichiometry

#### `calculateMolarWeight(formula: string): number`
Calculates the molar weight of a chemical formula.

#### `calculateFromMoles(species: string, moles: number): StoichiometryResult`
Performs stoichiometric calculations starting from a given number of moles.

#### `calculateFromGrams(species: string, grams: number): StoichiometryResult`
Performs stoichiometric calculations starting from a given mass in grams.

## Examples

### Balance Complex Equations

```javascript
const balancer = new ChemicalEquationBalancer();

// Simple equation
console.log(balancer.balance('Fe + O2 = Fe2O3'));
// Output: "4 Fe + 3 O2 = 2 Fe2O3"

// Complex equation with parentheses
console.log(balancer.balance('Ca(OH)2 + HCl = CaCl2 + H2O'));
// Output: "Ca(OH)2 + 2 HCl = CaCl2 + 2 H2O"
```

### Stoichiometric Calculations

```javascript
const stoich = new Stoichiometry('2 H2 + O2 = 2 H2O');

// Calculate from moles
const fromMoles = stoich.calculateFromMoles('H2', 4);
console.log(fromMoles);
// {
//   reactants: { H2: { moles: 4, grams: 8.064 }, O2: { moles: 2, grams: 63.998 } },
//   products: { H2O: { moles: 4, grams: 72.06 } }
// }

// Calculate from grams
const fromGrams = stoich.calculateFromGrams('O2', 32);
console.log(fromGrams);
```

## License

This project is licensed under the AGPL-3.0 License - see the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Acknowledgments

Based on the original [CREB](https://github.com/LastChemist/CREB-Chemical_Reaction_Equation_Balancer) Python project by LastChemist.
