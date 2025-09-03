# CREB-JS: Chemical Reaction Equation Balancer

[![CI](https://github.com/vloganathane/CREB/actions/workflows/ci.yml/badge.svg)](https://github.com/vloganathane/CREB/actions/workflows/ci.yml)
[![npm version](https://badge.fury.io/js/creb-js.svg)](https://badge.fury.io/js/creb-js)
[![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![Demo](https://img.shields.io/badge/Demo-Live-green.svg)](https://vloganathane.github.io/CREB/demos/demo.html)

A comprehensive TypeScript/JavaScript library for balancing chemical equations, performing stoichiometric calculations, and accessing chemical compound data through PubChem integration. **All features are fully functional with robust validation and user-friendly interfaces.**

## 🚀 Features

### Core CREB Features
- 🧪 **Balance chemical equations** automatically with advanced algorithms
- ⚖️ **Calculate stoichiometric ratios** for complex reactions  
- 🧮 **Compute molar weights** for any chemical formula
- 📊 **Perform mole and mass calculations** with detailed results
- 🔬 **Support for complex formulas** with parentheses and nested groups
- ✅ **Robust validation** with helpful error messages and pre-filled examples

### Enhanced PubChem Integration (`@creb-js/pubchem`)
- 🧬 **Search compounds** by name, CID, SMILES, or InChI
- 📋 **Retrieve detailed properties** (molecular weight, formula, IUPAC names)
- 🔍 **Compare compounds** with side-by-side analysis
- ⚗️ **Enhanced stoichiometry** with real compound data
- 🌐 **Type-safe API** with comprehensive error handling
- 🎯 **Smart auto-population** between related features

## 🎮 Try the Live Demos

### [**Main Demo**](demos/demo.html) - Interactive Web Interface ✨
- **Professional UI** with navigation menu and responsive design
- **All CREB features** working seamlessly with pre-filled examples
- **PubChem integration** for compound search, comparison, and analysis
- **Real-time calculations** with comprehensive error handling
- **Immediate testing** - all features have working examples ready to use

### [**Test Suite**](demos/test-demo.html) - Comprehensive Testing
- Automated test runner for all features
- Manual testing interface
- Integration and unit test results

## 📦 Installation

```bash
# Core CREB library
npm install creb-js

# PubChem integration (optional)  
npm install @creb-js/pubchem
```

## 🏗️ Project Structure

```
CREB/
├── src/                 # Core CREB source code
├── packages/
│   └── pubchem-js/     # PubChem integration package
├── demos/              # Interactive demonstrations
│   ├── demo.html       # Main comprehensive demo
│   └── test-demo.html  # Test suite interface
├── examples/           # Code examples and usage patterns  
├── docs/              # Documentation and analysis
└── dist/              # Built library files
```

## 🎮 Try the Live Demos

### [**Main Demo**](demos/demo.html) - Interactive Web Interface ✨
- **Professional UI** with navigation menu and responsive design
- **All CREB features** working seamlessly with pre-filled examples
- **PubChem integration** for compound search, comparison, and analysis
- **Real-time calculations** with comprehensive error handling
- **Immediate testing** - all features have working examples ready to use

### [**Test Suite**](demos/test-demo.html) - Comprehensive Testing
- Automated test runner for all features
- Manual testing interface
- Integration and unit test results

## ✨ Recent Updates

**Latest Release**: All demo features are now fully functional with enhanced user experience!

- 🔧 **Fixed all demo functionality** with robust validation and error handling
- ⚡ **Pre-filled working examples** for immediate testing of all features
- 🎯 **Smart auto-population** between equation balancer and stoichiometry calculator
- 🛡️ **Comprehensive input validation** with helpful error messages
- 📚 **Improved library exports** ensuring proper browser compatibility
- 🌟 **Enhanced PubChem integration** with compound search, comparison, and analysis

### Demo Features Ready to Use:
1. **Balance Chemical Equations** - Pre-filled with `Al + CuSO4 = Al2(SO4)3 + Cu`
2. **Calculate Stoichiometry** - Auto-populated from balanced equations
3. **Molar Weight Calculator** - Ready with `H2SO4` example
4. **PubChem Compound Search** - Search by CID (2244), Name (aspirin), or SMILES
5. **Enhanced Stoichiometry** - Glucose combustion with PubChem data
6. **Compound Comparison** - Compare glucose vs fructose with detailed analysis

## Quick Start

### Core CREB Usage

```javascript
import { ChemicalEquationBalancer, Stoichiometry } from 'creb-js';

// Balance a chemical equation
const balancer = new ChemicalEquationBalancer();
const balanced = balancer.balance('H2 + O2 = H2O');
console.log(balanced); // "2 H2 + O2 = 2 H2O"

// Calculate molar weight
const molarWeight = Stoichiometry.calculateMolarWeight('H2O');
console.log(molarWeight); // 18.015

// Perform stoichiometric calculations
const stoich = new Stoichiometry('2 H2 + O2 = 2 H2O');
const results = stoich.calculateFromMoles('H2', 2);
console.log(results);
```

### Enhanced PubChem Integration

```javascript
import { Compound } from '@creb-js/pubchem';

// Search compound by name
const compounds = await Compound.fromName('aspirin');
console.log(compounds[0].molecularFormula); // C9H8O4

// Get compound by CID
const water = await Compound.fromCid(962);
console.log(water.molecularWeight); // 18.015

// Search by SMILES
const benzene = await Compound.fromSmiles('C1=CC=CC=C1');
console.log(benzene[0].iupacName); // benzene
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

## Connect & Contribute

👨‍💻 **Author**: [Loganathane Virassamy](https://www.linkedin.com/in/loganathane-virassamy/)  
🍴 **Fork this project**: [GitHub Repository](https://github.com/vloganathane/CREB)  
⭐ **Like this project?** Give it a star on GitHub!

## License

This project is licensed under the AGPL-3.0 License - see the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Acknowledgments

Based on the original [CREB](https://github.com/LastChemist/CREB-Chemical_Reaction_Equation_Balancer) Python project by LastChemist.
