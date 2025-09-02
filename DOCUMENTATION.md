# CREB-JS Documentation

## Overview

CREB-JS is a JavaScript/TypeScript library for balancing chemical equations and performing stoichiometric calculations. It's a complete port of the original [CREB Python project](https://github.com/LastChemist/CREB-Chemical_Reaction_Equation_Balancer) by LastChemist.

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

// Calculate molar weights
const molarWeight = Stoichiometry.calculateMolarWeight('H2O');
console.log(molarWeight); // 18.015

// Perform stoichiometric calculations
const stoich = new Stoichiometry('H2 + O2 = H2O');
const result = stoich.calculateFromMoles('H2', 2);
console.log(result);
```

## API Reference

### ChemicalEquationBalancer

The main class for balancing chemical equations.

#### Constructor

```typescript
const balancer = new ChemicalEquationBalancer();
```

#### Methods

##### `balance(equation: string): string`

Balances a chemical equation and returns the balanced equation as a string.

**Parameters:**
- `equation` (string): The unbalanced chemical equation (e.g., "H2 + O2 = H2O")

**Returns:**
- `string`: The balanced chemical equation (e.g., "2 H2 + O2 = 2 H2O")

**Example:**
```javascript
const balancer = new ChemicalEquationBalancer();
const result = balancer.balance('Fe + O2 = Fe2O3');
console.log(result); // "4 Fe + 3 O2 = 2 Fe2O3"
```

##### `balanceDetailed(equation: string): BalancedEquation`

Balances a chemical equation and returns detailed information including coefficients.

**Parameters:**
- `equation` (string): The unbalanced chemical equation

**Returns:**
- `BalancedEquation`: Object containing:
  - `equation` (string): The balanced equation
  - `coefficients` (number[]): Array of coefficients
  - `reactants` (string[]): Array of reactant species
  - `products` (string[]): Array of product species

**Example:**
```javascript
const result = balancer.balanceDetailed('H2 + O2 = H2O');
console.log(result);
// {
//   equation: "2 H2 + O2 = 2 H2O",
//   coefficients: [2, 1, 2],
//   reactants: ["H2", "O2"],
//   products: ["H2O"]
// }
```

### Stoichiometry

Class for performing stoichiometric calculations and molar weight calculations.

#### Constructor

```typescript
const stoich = new Stoichiometry(equation?: string);
```

**Parameters:**
- `equation` (optional string): Chemical equation to use for calculations

#### Static Methods

##### `Stoichiometry.calculateMolarWeight(formula: string): number`

Calculates the molar weight of a chemical formula.

**Parameters:**
- `formula` (string): The chemical formula (e.g., "Ca(OH)2")

**Returns:**
- `number`: The molar weight in g/mol

**Example:**
```javascript
const mw = Stoichiometry.calculateMolarWeight('Ca(OH)2');
console.log(mw); // 74.092
```

#### Instance Methods

##### `calculateMolarWeight(formula: string): number`

Instance method for calculating molar weights (same as static method).

##### `calculateFromMoles(species: string, moles: number): StoichiometryResult`

Performs stoichiometric calculations starting from a given number of moles.

**Parameters:**
- `species` (string): The species to start calculation from
- `moles` (number): Number of moles of the species

**Returns:**
- `StoichiometryResult`: Object containing reactants and products data

**Example:**
```javascript
const stoich = new Stoichiometry('H2 + O2 = H2O');
const result = stoich.calculateFromMoles('H2', 2);
console.log(result);
// {
//   reactants: {
//     H2: { moles: 2, grams: 4.032, molarWeight: 2.016 },
//     O2: { moles: 1, grams: 31.998, molarWeight: 31.998 }
//   },
//   products: {
//     H2O: { moles: 2, grams: 36.03, molarWeight: 18.015 }
//   },
//   totalMolarMass: { reactants: 36.03, products: 36.03 }
// }
```

##### `calculateFromGrams(species: string, grams: number): StoichiometryResult`

Performs stoichiometric calculations starting from a given mass in grams.

**Parameters:**
- `species` (string): The species to start calculation from
- `grams` (number): Mass in grams of the species

**Returns:**
- `StoichiometryResult`: Object containing reactants and products data

##### `calculateRatios(selectedSpecies: string): number[]`

Calculates stoichiometric ratios relative to a selected species.

**Parameters:**
- `selectedSpecies` (string): The reference species

**Returns:**
- `number[]`: Array of ratios

##### `getBalancedEquation(): string`

Returns the balanced equation.

##### `getSpeciesInfo(): object`

Returns information about all species in the reaction including their molar weights and types (reactant/product).

## Types

### StoichiometryResult

```typescript
interface StoichiometryResult {
  reactants: Record<string, SpeciesData>;
  products: Record<string, SpeciesData>;
  totalMolarMass: {
    reactants: number;
    products: number;
  };
}
```

### SpeciesData

```typescript
interface SpeciesData {
  moles: number;
  grams: number;
  molarWeight: number;
}
```

### BalancedEquation

```typescript
interface BalancedEquation {
  equation: string;
  coefficients: number[];
  reactants: string[];
  products: string[];
}
```

## Supported Features

### Chemical Formula Parsing

The library supports complex chemical formulas including:

- Simple compounds: `H2O`, `CO2`, `NaCl`
- Compounds with parentheses: `Ca(OH)2`, `Al2(SO4)3`
- Large organic molecules: `C6H12O6`, `C8H18`

### Equation Balancing

Supports balancing of:

- Simple reactions: `H2 + O2 = H2O`
- Complex reactions: `C8H18 + O2 = CO2 + H2O`
- Acid-base reactions: `HCl + NaOH = NaCl + H2O`
- Precipitation reactions: `AgNO3 + NaCl = AgCl + NaNO3`

### Stoichiometric Calculations

- Mole-to-mole conversions
- Mass-to-mass conversions
- Mole-to-mass conversions
- Mass-to-mole conversions
- Ratio calculations

## Examples

### Advanced Balancing

```javascript
const balancer = new ChemicalEquationBalancer();

// Combustion reaction
const combustion = balancer.balance('C8H18 + O2 = CO2 + H2O');
console.log(combustion); // "2 C8H18 + 25 O2 = 16 CO2 + 18 H2O"

// Acid-base reaction
const acidBase = balancer.balance('Ca(OH)2 + HCl = CaCl2 + H2O');
console.log(acidBase); // "Ca(OH)2 + 2 HCl = CaCl2 + 2 H2O"
```

### Complex Stoichiometry

```javascript
const stoich = new Stoichiometry('C8H18 + O2 = CO2 + H2O');

// Calculate how much oxygen is needed for 1 mole of octane
const result = stoich.calculateFromMoles('C8H18', 1);
console.log(`Oxygen needed: ${result.reactants['O2'].moles} mol`);
console.log(`CO2 produced: ${result.products['CO2'].moles} mol`);
console.log(`H2O produced: ${result.products['H2O'].moles} mol`);
```

## Error Handling

The library provides informative error messages for common issues:

```javascript
try {
  const result = balancer.balance('Invalid equation');
} catch (error) {
  console.log(error.message); // "Invalid equation format. Must contain exactly one "=" sign."
}

try {
  const mw = Stoichiometry.calculateMolarWeight('Xx');
} catch (error) {
  console.log(error.message); // "Unknown element: Xx"
}
```

## Browser Usage

The library can be used directly in browsers with ES modules:

```html
<script type="module">
  import { ChemicalEquationBalancer, Stoichiometry } from './node_modules/creb-js/dist/index.esm.js';
  
  const balancer = new ChemicalEquationBalancer();
  const result = balancer.balance('H2 + O2 = H2O');
  console.log(result);
</script>
```

## Contributing

Contributions are welcome! Please see the [GitHub repository](https://github.com/yourusername/creb-js) for guidelines.

## License

This project is licensed under the AGPL-3.0 License, same as the original CREB project.

## Acknowledgments

This library is based on the original [CREB](https://github.com/LastChemist/CREB-Chemical_Reaction_Equation_Balancer) Python project by LastChemist. Special thanks to the original author for creating such a useful tool for the chemistry community.
