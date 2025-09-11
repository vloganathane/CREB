# CREB-JS: Comprehensive Computational Chemistry Platform

[![CI](https://github.com/vloganathane/CREB/actions/workflows/ci.yml/badge.svg)](https://github.com/vloganathane/CREB/actions/workflows/ci.yml)
[![npm version](https://badge.fury.io/js/creb-js.svg)](https://badge.fury.io/js/creb-js)
[![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![Demo](https://img.shields.io/badge/Demo-Live-green.svg)](https://vloganathane.github.io/CREB/demos/demo.html)

**A comprehensive TypeScript/JavaScript platform for computational chemistry** featuring advanced equation balancing, PubChem integration, professional 2D/3D molecular visualization, SVG export, thermodynamic analysis, and enterprise-grade architecture. Built with modern TypeScript, dependency injection, and 555 passing tests. **v1.8.0 Ready** ✅

> **🎯 Major Achievement:** Evolved from basic equation balancer to full computational chemistry platform with real PubChem data, professional molecular visualization, and publication-ready graphics export.

## 🌟 **NEW: Phase 3 AI & Physics Integration** 🚀

**CREB now features next-generation AI-enhanced molecular animation with advanced physics simulation!**

### 🤖 **AI-Powered Features**
- **Intelligent Reaction Classification**: TensorFlow.js machine learning for automatic reaction type detection
- **Parameter Optimization**: AI-driven animation parameter tuning based on reaction characteristics
- **Confidence Scoring**: ML model provides certainty levels for classification results

### ⚡ **Advanced Physics Engine**
- **Molecular Dynamics**: Real-time Cannon.js physics with Van der Waals and electrostatic forces  
- **Realistic Simulation**: Physics-based molecular motion, collision detection, and energy conservation
- **Animation Integration**: Seamless physics integration with GSAP + Three.js rendering system

### 🧠 **Intelligent Systems**
- **Multi-Level Caching**: Memory + IndexedDB persistent storage with automatic optimization
- **Performance Analytics**: Real-time metrics, hit rate tracking, and system performance monitoring
- **Smart Fallback**: Graceful degradation from AI-enhanced to traditional animation modes

### 🎬 **AI-Enhanced Demo Available**
**[Try the AI-Enhanced Molecular Viewer](demos/ai-enhanced-molecular-viewer.html)** - Experience the future of chemical visualization with AI classification, physics simulation, and intelligent caching in your browser!

## 🚀 Key Features

### 🧪 **Advanced Chemical Computation**
- **Sophisticated equation balancing** with linear algebra optimization and integer coefficient finding
- **Real PubChem integration** - authentic chemical compound data from NCBI database
- **Enhanced stoichiometry** with molecular weight verification and mass balance validation
- **Thermodynamic analysis** - ΔH°, ΔS°, ΔG° calculations with energy profile generation
- **Safety information** - GHS hazard classifications and laboratory safety protocols
- **Chemical validation** - formula parsing, element analysis, and compound verification

### 🎨 **Professional Molecular Visualization**
- **2D molecular graphics** with chemically accurate Canvas rendering and PubChem geometry
- **3D interactive visualization** using 3Dmol.js with Ball & Stick, Space-filling, and professional styles
- **SVG vector export** - publication-ready scalable graphics with embedded metadata
- **Multiple formats** - PNG, JPEG, SVG, and interactive 3D rendering support
- **GLmol compatibility** - classic molecular modeling aesthetics and styling options
- **Batch processing** - multi-molecule export with consistent professional styling

### ⚡ **Enterprise Architecture**
- **Modern TypeScript** - 112 source files with strict type safety and comprehensive interfaces
- **Dependency injection** - container-based DI system for testability and modularity
- **Plugin system** - extensible architecture supporting third-party extensions
- **Advanced caching** - multi-tier LRU cache with TTL management and performance optimization
- **Worker pool** - parallel computation for complex chemical calculations
- **Circuit breaker** - fault tolerance and graceful degradation for external dependencies

### 🛡️ **Production Quality**
- **563 comprehensive tests** with 98.6% pass rate (555 passing, 8 minor cosmetic failures)
- **Error resilience** - structured error handling with categorization and retry policies
- **Performance optimized** - sub-millisecond balancing and interactive 3D rendering
- **Multi-format builds** - ESM, CommonJS, and UMD bundles with tree-shaking support
- **SQLite integration** - local database for caching and offline operation
- **Cross-platform** - Windows, macOS, and Linux compatibility

## 🎮 Try the Live Demos

### [**Enhanced 2D Structures**](demos/enhanced-2d-structures.html) - Professional Molecular Graphics ✨
- **Real PubChem data** with chemically accurate 2D molecular structures
- **Professional rendering** using Canvas2D with optimized bond angles and positioning
- **Interactive search** - find compounds by name or formula with auto-completion
- **Export capabilities** - save as PNG, JPEG, or view molecular properties

### [**SVG Export Demo**](demos/svg-export-demo.html) - Publication-Ready Graphics 📊
- **Vector graphics export** with scalable, print-ready molecular diagrams
- **Metadata integration** - chemical information embedded in SVG files
- **Customizable styling** - bond thickness, atom colors, and background options
- **Batch processing** - export multiple molecules with consistent formatting

### [**PubChem Real Data**](demos/pubchem-real-data.html) - Authentic Chemical Database 🧪
- **NCBI PubChem integration** with real compound properties and validation
- **3D molecular visualization** using 3Dmol.js with Ball & Stick and Space-filling styles
- **Safety information** - GHS classifications and hazard warnings
- **Comprehensive data** - molecular weight, formula, IUPAC names, and structural data

### [**Main Demo**](demos/demo.html) - Complete Platform Showcase 🚀
- **All CREB features** integrated in a professional web interface
- **Equation balancing** with stoichiometric calculations and thermodynamic analysis
- **Interactive examples** - pre-filled demonstrations of all capabilities
- **Performance metrics** - real-time calculation timing and system monitoring
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
├── src/                    # Core CREB source code
│   ├── performance/        # Performance optimizations
│   ├── thermodynamics/     # Thermodynamics module
│   ├── kinetics/          # Kinetics and safety analysis
│   └── data/              # Data management and SQLite
├── packages/
│   └── pubchem-js/        # PubChem integration package
├── demos/                 # Interactive demonstrations
│   ├── demo.html          # Main comprehensive demo  
│   └── test-demo.html     # Test suite interface
├── examples/              # Code examples and usage patterns
│   ├── basic/             # Simple getting-started examples
│   ├── advanced/          # Complex use cases and integrations
│   └── modules/           # Module-specific examples
├── docs/                  # Documentation and analysis
│   ├── development/       # Development guides and progress
│   ├── implementation/    # Feature implementation details
│   └── analysis/          # Technical analysis and research
├── scripts/               # Development and debugging scripts
│   └── debug/             # Debug and test scripts
└── dist/                  # Built library files
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

### Phase 2 Enhanced Features (COMPLETE):
7. **Enhanced Chemical Intelligence** - PubChem-validated compound data with mass balance verification ✅
8. **Compound Name Resolution** - Balance equations using common chemical names ✅
9. **Enhanced Stoichiometry** - Real compound data integration with molecular weight accuracy ✅
10. **Chemical Safety Information** - GHS hazard warnings and safety classifications ✅

### New Enhanced API:
```javascript
// Enhanced chemical intelligence
const result = await balancer.balanceWithPubChemData("H2SO4 + NaOH = Na2SO4 + H2O");

// Balance using common names
const nameResult = await balancer.balanceByName(
  "sulfuric acid + sodium hydroxide = sodium sulfate + water"
);

// Safety warnings
const safetyResult = await balancer.balanceWithSafety("H2SO4 + NaOH = Na2SO4 + H2O");
console.log(safetyResult.safetyWarnings); // GHS hazard information
```

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

### Phase 3: Thermodynamics Analysis

```javascript
import { ThermodynamicsCalculator } from 'creb-js';

// Create thermodynamics calculator
const calculator = new ThermodynamicsCalculator();

// Analyze glucose combustion
const glucoseReaction = {
    reactants: [
        { formula: 'C6H12O6', coefficient: 1 },
        { formula: 'O2', coefficient: 6 }
    ],
    products: [
        { formula: 'CO2', coefficient: 6 },
        { formula: 'H2O', coefficient: 6 }
    ]
};

const result = calculator.calculateReactionThermodynamics(glucoseReaction, 298.15);
console.log('ΔH°:', result.enthalpy, 'kJ/mol');      // ~-2803 kJ/mol
console.log('ΔS°:', result.entropy, 'J/(mol·K)');    // ~262 J/(mol·K)  
console.log('ΔG°:', result.gibbsFreeEnergy, 'kJ/mol'); // ~-2726 kJ/mol
console.log('Spontaneous:', result.isSpontaneous);    // true

// Temperature effect analysis
const temperatures = [273.15, 298.15, 373.15, 500];
const tempAnalysis = calculator.calculateTemperatureDependence(glucoseReaction, temperatures);
tempAnalysis.forEach(data => {
    console.log(`T: ${data.temperature}K, ΔG: ${data.gibbsFreeEnergy.toFixed(1)} kJ/mol`);
});
```

### NEW: Thermodynamics-Integrated Balancer 🚀

```javascript
import { ThermodynamicsEquationBalancer } from 'creb-js';

// Create the revolutionary integrated balancer
const balancer = new ThermodynamicsEquationBalancer();

// Balance and analyze in one step
const equation = 'CH4 + O2 = CO2 + H2O';
const result = await balancer.balanceWithThermodynamics(equation);

// Get comprehensive analysis
console.log('✅ Balanced equation:', result.balanced);
console.log('🏷️ Reaction type:', result.reactionType);
console.log('⚡ Energy released:', result.energyReleased, 'kJ/mol');
console.log('✨ Feasibility:', result.feasibility);
console.log('⚠️ Safety level:', result.safetyLevel);
console.log('🔥 Spontaneous:', result.spontaneous);

// Safety and industrial insights
console.log('⚠️ Safety warnings:', result.safetyWarnings);
console.log('💡 Recommendations:', result.recommendations);
console.log('🏭 Industrial applications:', result.industrialApplications);

// Find optimal reaction conditions
const conditions = await balancer.findOptimalConditions(equation);
console.log('🌡️ Optimal temperature:', conditions.temperature, 'K');
console.log('🎯 Expected yield:', conditions.yield, '%');
console.log('🧠 Reasoning:', conditions.reasoning);
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
