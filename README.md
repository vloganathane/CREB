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

### Enhanced PubChem Integration (`creb-pubchem-js`)
- 🧬 **Search compounds** by name, CID, SMILES, or InChI
- 📋 **Retrieve detailed properties** (molecular weight, formula, IUPAC names)
- 🔍 **Compare compounds** with side-by-side analysis
- ⚗️ **Enhanced stoichiometry** with real compound data
- 🌐 **Type-safe API** with comprehensive error handling
- 🎯 **Smart auto-population** between related features

### Phase 2: Enhanced Classes (NEW!)
- 🆕 **EnhancedChemicalEquationBalancer** - PubChem-integrated balancing with compound validation
- 🆕 **EnhancedStoichiometry** - Advanced calculations with real compound data and accuracy verification
- ✅ **Mass balance validation** using accurate PubChem molecular weights
- 🏪 **Intelligent caching** to minimize API calls and improve performance
- 🔄 **Graceful degradation** - works with or without PubChem package installed
- 💡 **Alternative suggestions** for unknown or misspelled compounds

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

### [**Enhanced Demo**](demos/enhanced-demo.js) - Phase 2 Showcase
- Interactive Node.js demonstration of enhanced features
- PubChem integration examples with graceful fallbacks
- Compound validation and molecular weight verification
- Run with: `node demos/enhanced-demo.js`

## 📦 Installation

```bash
# Core CREB library
npm install creb-js

# PubChem integration (optional)  
npm install creb-pubchem-js
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

**Phase 2 Release**: Enhanced CREB with PubChem Integration! 🎉

- 🆕 **New Enhanced Classes** - `EnhancedChemicalEquationBalancer` and `EnhancedStoichiometry`
- 🧬 **PubChem Integration** - Real compound data, molecular weight verification, and validation
- ✅ **Mass Balance Validation** - Verify conservation using accurate PubChem molecular weights
- 🏪 **Smart Caching** - Intelligent compound data caching to minimize API calls
- 🔄 **Graceful Degradation** - Full functionality with or without PubChem package
- 💡 **Compound Suggestions** - Alternative names for unknown or misspelled compounds
- 📊 **Molecular Weight Accuracy** - Compare calculated vs. PubChem values with accuracy ratings
- 🔬 **Compound Comparison** - Side-by-side analysis of chemical compounds

**Previous Updates**: All demo features are fully functional with enhanced user experience!

- 🔧 **Fixed all demo functionality** with robust validation and error handling
- ⚡ **Pre-filled working examples** for immediate testing of all features
- 🎯 **Smart auto-population** between equation balancer and stoichiometry calculator
- 🛡️ **Comprehensive input validation** with helpful error messages
- 📚 **Improved library exports** ensuring proper browser compatibility

### Demo Features Ready to Use:
1. **Balance Chemical Equations** - Pre-filled with `Al + CuSO4 = Al2(SO4)3 + Cu`
2. **Calculate Stoichiometry** - Auto-populated from balanced equations
3. **Molar Weight Calculator** - Ready with `H2SO4` example
4. **PubChem Compound Search** - Search by CID (2244), Name (aspirin), or SMILES
5. **Enhanced Stoichiometry** - Glucose combustion with PubChem data
6. **Compound Comparison** - Compare glucose vs fructose with detailed analysis

### Phase 2 Enhanced Features:
7. **Enhanced Equation Balancing** - PubChem-validated compound data with mass balance verification
8. **Enhanced Stoichiometry** - Real compound data integration with molecular weight accuracy assessment
9. **Compound Information Lookup** - Detailed PubChem data retrieval with intelligent caching
10. **Alternative Compound Suggestions** - Smart suggestions for unknown or misspelled compounds

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
import { Compound } from 'creb-pubchem-js';

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

### Phase 2: Enhanced Classes with PubChem Integration

```javascript
import { 
  EnhancedChemicalEquationBalancer, 
  EnhancedStoichiometry 
} from 'creb-js';

// Enhanced equation balancing with compound validation
const balancer = new EnhancedChemicalEquationBalancer();
const result = await balancer.balanceWithPubChemData('C6H12O6 + O2 = CO2 + H2O');

console.log('Balanced:', result.equation);
console.log('Mass balanced:', result.validation?.massBalanced);

// Display compound information
if (result.compoundData) {
  for (const [species, info] of Object.entries(result.compoundData)) {
    console.log(`${species}: MW=${info.molecularWeight}, CID=${info.cid}`);
  }
}

// Enhanced stoichiometry with PubChem data
const stoich = new EnhancedStoichiometry();
await stoich.initializeWithValidation('2 H2 + O2 = 2 H2O');

const enhanced = await stoich.calculateFromMolesEnhanced('H2', 2);
console.log('Enhanced results with PubChem validation:', enhanced);

// Molecular weight with PubChem verification
const mwResult = await stoich.calculateMolarWeightEnhanced('H2O');
console.log(`H2O: Calculated=${mwResult.calculated}, PubChem=${mwResult.pubchem}`);
console.log(`Accuracy: ${mwResult.accuracy}`);
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

### Enhanced Classes (Phase 2)

#### EnhancedChemicalEquationBalancer

#### `balanceWithPubChemData(equation: string): Promise<EnhancedBalancedEquation>`
Balances a chemical equation with PubChem compound validation and enrichment.

#### `getCompoundInfo(compoundName: string): Promise<CompoundInfo>`
Retrieves detailed compound information from PubChem with caching.

#### EnhancedStoichiometry

#### `initializeWithValidation(equation: string): Promise<ReactionAnalysis>`
Initializes stoichiometry with PubChem compound validation and mass balance verification.

#### `calculateFromMolesEnhanced(species: string, moles: number): Promise<EnhancedStoichiometryResult>`
Enhanced calculation with PubChem molecular weight validation and accuracy assessment.

#### `calculateMolarWeightEnhanced(formula: string): Promise<MolarWeightResult>`
Calculates molecular weight with PubChem verification and accuracy rating.

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

## 🧪 Testing & Demos

### Running Tests

```bash
# Run all tests (CREB + PubChem)
npm test

# Run only CREB tests
npm run test:creb

# Run only PubChem tests
npm run test:pubchem
```

### Interactive Demos

#### Web-based Demos
- **[Main Demo](demos/demo.html)** - Complete web interface with all features
- **[Test Suite](demos/test-demo.html)** - Automated testing interface

#### Node.js Demos
```bash
# Enhanced Phase 2 demonstration
node demos/enhanced-demo.js

# Run TypeScript examples
npx ts-node examples/enhanced-usage.ts
```

### Test Coverage
- ✅ **57 tests** covering all functionality
- ✅ **Enhanced classes** with comprehensive test suites
- ✅ **Error handling** and edge case validation
- ✅ **PubChem integration** with graceful fallback testing
- ✅ **Browser compatibility** testing

### Demo Features
1. **Interactive Web Interface** - Real-time calculations with instant feedback
2. **Enhanced Node.js Demo** - Showcase of Phase 2 PubChem integration
3. **Automated Test Runner** - Comprehensive validation of all features
4. **TypeScript Examples** - Complete code examples with type safety
5. **Error Handling Demo** - Graceful degradation when dependencies unavailable

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
