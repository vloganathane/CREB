# CREB-JS Documentation

## Overview

CREB-JS is a comprehensive TypeScript/JavaScript library for advanced chemistry computations, including chemical equation balancing, thermodynamic analysis, reaction kinetics, and safety assessments. Originally based on the [CREB Python project](https://github.com/LastChemist/CREB-Chemical_Reaction_Equation_Balancer) by LastChemist, it has evolved into a complete chemistry platform.

**Current Version:** v1.5.0  
**Latest Features:** Advanced kinetics, safety analysis, virtual lab environment

## Installation

```bash
# Core CREB library
npm install creb-js

# PubChem integration (optional)
npm install creb-pubchem-js
```

## Quick Start

```javascript
import { 
  ChemicalEquationBalancer, 
  Stoichiometry, 
  ThermodynamicsCalculator,
  ReactionKinetics,
  SafetyAnalyzer 
} from 'creb-js';

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

// Thermodynamic analysis
const thermo = new ThermodynamicsCalculator();
const thermoResult = thermo.calculateReactionThermodynamics({
  reactants: [{ formula: 'H2', coefficient: 2 }, { formula: 'O2', coefficient: 1 }],
  products: [{ formula: 'H2O', coefficient: 2 }]
}, 298.15);

// Kinetics analysis
const kinetics = new ReactionKinetics();
const kineticResult = kinetics.analyze('H2 + O2 = H2O', {
  temperature: 298.15,
  pressure: 1.0
});

// Safety assessment
const safety = new SafetyAnalyzer();
const safetyReport = safety.analyze(['H2', 'O2'], 'combustion');
```

## Core Modules

### ChemicalEquationBalancer

The main class for balancing chemical equations with enhanced features.

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

### EnhancedChemicalEquationBalancer

Advanced balancer with PubChem integration and compound validation.

#### Constructor

```typescript
import { EnhancedChemicalEquationBalancer } from 'creb-js';
const enhancedBalancer = new EnhancedChemicalEquationBalancer();
```

#### Methods

##### `balanceWithValidation(equation: string): Promise<EnhancedBalanceResult>`

Balances equations with compound validation and suggestions.

**Parameters:**
- `equation` (string): Chemical equation to balance

**Returns:**
- `Promise<EnhancedBalanceResult>`: Enhanced result with validation data

**Example:**
```typescript
const result = await enhancedBalancer.balanceWithValidation('H2 + O2 = H2O');
console.log(result.balancedEquation);
console.log(result.compoundValidation);
console.log(result.suggestions);
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

## Type Definitions

### Core Types

```typescript
interface StoichiometryResult {
  reactants: Record<string, SpeciesData>;
  products: Record<string, SpeciesData>;
  totalMolarMass: {
    reactants: number;
    products: number;
  };
}

interface SpeciesData {
  moles: number;
  grams: number;
  molarWeight: number;
}

interface BalancedEquation {
  equation: string;
  coefficients: number[];
  reactants: string[];
  products: string[];
}
```

### Thermodynamics Types

```typescript
interface ReactionData {
  reactants: Array<{
    formula: string;
    coefficient: number;
  }>;
  products: Array<{
    formula: string;
    coefficient: number;
  }>;
}

interface ThermodynamicsResult {
  enthalpy: number;          // ΔH° in kJ/mol
  entropy: number;           // ΔS° in J/(mol·K)
  gibbsFreeEnergy: number;   // ΔG° in kJ/mol
  isSpontaneous: boolean;    // True if ΔG° < 0
  temperature: number;       // Temperature in K
}

interface CompoundThermodynamics {
  formula: string;
  standardFormationEnthalpy: number;  // ΔHf° in kJ/mol
  standardEntropy: number;            // S° in J/(mol·K)
  heatCapacity: number;               // Cp in J/(mol·K)
}
```

### Kinetics Types

```typescript
interface ReactionConditions {
  temperature: number;       // Kelvin
  pressure: number;         // atm
  catalyst?: string;        // optional catalyst
  solvent?: string;         // optional solvent
  concentration?: Record<string, number>; // concentrations
}

interface KineticsResult {
  rateConstant: number;
  activationEnergy: number;  // kJ/mol
  reactionOrder: number;
  mechanism: ReactionStep[];
  temperatureDependence: ArrheniusData;
  halfLife?: number;        // for first-order reactions
}

interface ReactionStep {
  equation: string;
  rateConstant: number;
  activationEnergy: number;
  isElementary: boolean;
}

interface MechanismResult {
  elementarySteps: ReactionStep[];
  rateDeterminingStep: ReactionStep;
  intermediates: string[];
  catalysts: string[];
  overallReaction: string;
}
```

### Safety Types

```typescript
interface SafetyReport {
  hazardLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'EXTREME';
  recommendations: string[];
  requiredPPE: string[];
  emergencyProcedures: string[];
  hazards: HazardType[];
  storageRequirements: string[];
  disposalInstructions: string[];
}

interface HazardAssessment {
  flammability: number;     // 0-4 scale
  toxicity: number;         // 0-4 scale
  reactivity: number;       // 0-4 scale
  corrosivity: number;      // 0-4 scale
  environmental: number;    // 0-4 scale
}

interface SafetyProtocol {
  preReactionChecks: string[];
  duringReaction: string[];
  postReaction: string[];
  emergencyResponse: string[];
  equipment: string[];
}

type HazardType = 'FLAMMABLE' | 'TOXIC' | 'CORROSIVE' | 'EXPLOSIVE' | 'ENVIRONMENTAL' | 'OXIDIZING';
```

### Enhanced Types

```typescript
interface EnhancedBalanceResult {
  balancedEquation: string;
  coefficients: number[];
  compoundValidation: CompoundValidation[];
  suggestions: string[];
  confidence: number;       // 0-1 scale
}

interface CompoundValidation {
  formula: string;
  isValid: boolean;
  alternativeNames: string[];
  pubchemCID?: number;
  warnings: string[];
}

interface IntegratedResult {
  balanced: BalancedEquation;
  thermodynamics: ThermodynamicsResult;
  kinetics: KineticsResult;
  safety: SafetyReport;
  optimization: OptimizationSuggestions;
}

interface OptimizationSuggestions {
  optimalTemperature: number;
  optimalPressure: number;
  recommendedCatalyst?: string;
  yieldImprovement: string[];
  energyEfficiency: string[];
}
```

## Supported Features

### Chemical Formula Parsing

The library supports complex chemical formulas including:

- **Simple compounds**: `H2O`, `CO2`, `NaCl`, `NH3`
- **Compounds with parentheses**: `Ca(OH)2`, `Al2(SO4)3`, `Mg3(PO4)2`
- **Large organic molecules**: `C6H12O6`, `C8H18`, `C20H25N3O`
- **Complex pharmaceuticals**: `C9H8O4` (aspirin), `C8H9NO2` (acetaminophen)
- **Coordination compounds**: `[Cu(NH3)4]SO4`, `K3[Fe(CN)6]`

### Equation Balancing

Supports balancing of:

- **Simple reactions**: `H2 + O2 = H2O`
- **Complex combustion**: `C8H18 + O2 = CO2 + H2O`
- **Acid-base reactions**: `HCl + NaOH = NaCl + H2O`
- **Precipitation reactions**: `AgNO3 + NaCl = AgCl + NaNO3`
- **Redox reactions**: `Fe + O2 = Fe2O3`
- **Organic synthesis**: `C7H6O3 + C4H6O3 = C9H8O4 + C2H4O2`
- **Biochemical pathways**: `C6H12O6 + 6O2 = 6CO2 + 6H2O`

### Advanced Calculations

- **Stoichiometric conversions**: Mole-to-mole, mass-to-mass, mole-to-mass
- **Thermodynamic analysis**: ΔH°, ΔS°, ΔG°, spontaneity prediction
- **Kinetic analysis**: Rate constants, activation energies, reaction mechanisms
- **Safety assessment**: Hazard evaluation, PPE requirements, protocols
- **Temperature effects**: How conditions affect reaction feasibility
- **Optimization**: Yield improvement and energy efficiency suggestions

### Real-World Applications

- **Educational**: Chemistry courses, homework validation, concept learning
- **Research**: Reaction feasibility, optimization, safety planning
- **Industrial**: Process optimization, safety protocols, yield improvement
- **Pharmaceutical**: Drug synthesis, reaction validation, safety assessment
- **Environmental**: Pollution analysis, remediation reactions, impact assessment

## Framework Integration

### React Integration (Coming v1.6.0)

```bash
npm install @creb/react
```

```tsx
import { useEquationBalancer, useThermodynamics } from '@creb/react';

function ChemistryCalculator() {
  const { balance, result, loading } = useEquationBalancer();
  const { analyze, thermoResult } = useThermodynamics();
  
  return (
    <div>
      <input 
        placeholder="Enter equation..."
        onChange={(e) => balance(e.target.value)} 
      />
      {loading ? (
        <div>Calculating...</div>
      ) : (
        <div>
          <p>Balanced: {result?.balanced}</p>
          <p>ΔG°: {thermoResult?.gibbsFreeEnergy} kJ/mol</p>
        </div>
      )}
    </div>
  );
}
```

### Vue Integration (Coming v1.6.0)

```bash
npm install @creb/vue
```

```vue
<template>
  <div>
    <input v-model="equation" @input="balance" />
    <div v-if="loading">Calculating...</div>
    <div v-else>
      <p>Balanced: {{ result.balanced }}</p>
      <p>Spontaneous: {{ result.spontaneous }}</p>
    </div>
  </div>
</template>

<script setup>
import { useEquationBalancer } from '@creb/vue';

const { equation, balance, result, loading } = useEquationBalancer();
</script>
```

### Node.js Server Utilities (Coming v1.6.0)

```bash
npm install @creb/node
```

```javascript
import { createChemistryAPI } from '@creb/node';

const app = createChemistryAPI({
  rateLimit: 100, // requests per minute
  cache: true,
  apiKey: process.env.CREB_API_KEY
});

app.listen(3000, () => {
  console.log('Chemistry API server running on port 3000');
});

// Endpoints automatically created:
// POST /api/balance - Balance equations
// POST /api/thermodynamics - Thermodynamic analysis
// POST /api/kinetics - Kinetics analysis
// POST /api/safety - Safety assessment
```

## Performance Optimization

### WebAssembly Core (Coming v1.6.0)

For high-performance calculations:

```typescript
import { initializeWebAssembly } from 'creb-js/wasm';

// Initialize WebAssembly for critical calculations
await initializeWebAssembly();

// 10x faster calculations for complex equations
const balancer = new ChemicalEquationBalancer({ useWASM: true });
const result = balancer.balance('C100H202 + O2 = CO2 + H2O');
```

### Caching Strategies

```typescript
import { ChemicalEquationBalancer } from 'creb-js';

const balancer = new ChemicalEquationBalancer({
  cache: {
    enabled: true,
    maxSize: 1000,    // Cache 1000 calculations
    ttl: 3600000      // 1 hour TTL
  }
});

// Subsequent identical calculations return instantly
const result1 = balancer.balance('H2 + O2 = H2O'); // ~2ms
const result2 = balancer.balance('H2 + O2 = H2O'); // ~0.1ms (cached)
```

## Cloud API Service (Coming v2.0.0)

### Free Tier
- 1,000 calculations per month
- Basic equation balancing
- Standard thermodynamics
- Community support

### Professional Tier
- 50,000 calculations per month
- Advanced kinetics analysis
- Safety assessments
- Priority support
- 99.9% SLA

### Enterprise Tier
- Unlimited calculations
- Custom integrations
- Dedicated support
- On-premise deployment
- White-label options

```javascript
// Cloud API usage
import { CREBCloudAPI } from 'creb-js/cloud';

const api = new CREBCloudAPI({
  apiKey: 'your-api-key',
  tier: 'professional'
});

const result = await api.analyzeReaction({
  equation: 'C6H12O6 + O2 = CO2 + H2O',
  analysis: ['balance', 'thermodynamics', 'kinetics', 'safety'],
  conditions: { temperature: 310.15, pressure: 1.0 }
});
```

## Thermodynamics Module

### ThermodynamicsCalculator

The `ThermodynamicsCalculator` class provides powerful tools for analyzing the energy changes in chemical reactions.

#### Constructor

```typescript
import { ThermodynamicsCalculator } from 'creb-js';
const calculator = new ThermodynamicsCalculator();
```

#### Methods

##### `calculateReactionThermodynamics(reaction: ReactionData, temperature: number): ThermodynamicsResult`

Calculates the thermodynamic properties of a chemical reaction at a given temperature.

**Parameters:**
- `reaction`: Object containing reactants and products with their coefficients
- `temperature`: Temperature in Kelvin (default: 298.15 K)

**Returns:**
- `ThermodynamicsResult` object containing enthalpy, entropy, Gibbs free energy, and spontaneity

**Example:**

```typescript
const reaction = {
    reactants: [
        { formula: 'C6H12O6', coefficient: 1 },
        { formula: 'O2', coefficient: 6 }
    ],
    products: [
        { formula: 'CO2', coefficient: 6 },
        { formula: 'H2O', coefficient: 6 }
    ]
};

const result = calculator.calculateReactionThermodynamics(reaction, 298.15);
console.log('ΔH°:', result.enthalpy, 'kJ/mol');
console.log('ΔS°:', result.entropy, 'J/(mol·K)');
console.log('ΔG°:', result.gibbsFreeEnergy, 'kJ/mol');
console.log('Spontaneous:', result.isSpontaneous);
```

##### `getCompoundThermodynamics(formula: string): CompoundThermodynamics`

Retrieves standard thermodynamic data for a given compound.

**Parameters:**
- `formula`: Chemical formula (e.g., 'H2O', 'CO2', 'C6H12O6')

**Returns:**
- `CompoundThermodynamics` object with standard formation enthalpy, entropy, and heat capacity

##### `calculateTemperatureDependence(reaction: ReactionData, temperatures: number[]): TemperatureAnalysis[]`

Analyzes how thermodynamic properties change with temperature.

**Parameters:**
- `reaction`: Reaction data object
- `temperatures`: Array of temperatures in Kelvin

**Returns:**
- Array of thermodynamic results at each temperature

### Thermodynamic Data Types

#### `ReactionData`

```typescript
interface ReactionData {
    reactants: Array<{
        formula: string;
        coefficient: number;
    }>;
    products: Array<{
        formula: string;
        coefficient: number;
    }>;
}
```

#### `ThermodynamicsResult`

```typescript
interface ThermodynamicsResult {
    enthalpy: number;          // ΔH° in kJ/mol
    entropy: number;           // ΔS° in J/(mol·K)
    gibbsFreeEnergy: number;   // ΔG° in kJ/mol
    isSpontaneous: boolean;    // True if ΔG° < 0
    temperature: number;       // Temperature in K
}
```

#### `CompoundThermodynamics`

```typescript
interface CompoundThermodynamics {
    formula: string;
    standardFormationEnthalpy: number;  // ΔHf° in kJ/mol
    standardEntropy: number;            // S° in J/(mol·K)
    heatCapacity: number;               // Cp in J/(mol·K)
}
```

## Kinetics Module

### ReactionKinetics

Advanced reaction kinetics analysis including rate constants, activation energies, and mechanism studies.

#### Constructor

```typescript
import { ReactionKinetics } from 'creb-js';
const kinetics = new ReactionKinetics();
```

#### Methods

##### `analyze(equation: string, conditions: ReactionConditions): KineticsResult`

Performs comprehensive kinetics analysis of a chemical reaction.

**Parameters:**
- `equation` (string): Balanced chemical equation
- `conditions` (ReactionConditions): Reaction conditions including temperature, pressure, catalyst

**Returns:**
- `KineticsResult`: Complete kinetics analysis

**Example:**
```typescript
const conditions = {
  temperature: 298.15,  // Kelvin
  pressure: 1.0,        // atm
  catalyst: 'Pt',       // optional
  solvent: 'water'      // optional
};

const result = kinetics.analyze('2 H2 + O2 = 2 H2O', conditions);
console.log('Rate constant:', result.rateConstant);
console.log('Activation energy:', result.activationEnergy);
console.log('Reaction order:', result.reactionOrder);
```

##### `calculateRateConstant(equation: string, temperature: number): number`

Calculates the rate constant using the Arrhenius equation.

**Parameters:**
- `equation` (string): Chemical equation
- `temperature` (number): Temperature in Kelvin

**Returns:**
- `number`: Rate constant value

##### `analyzeMechanism(equation: string): MechanismResult`

Analyzes possible reaction mechanisms and pathways.

**Parameters:**
- `equation` (string): Overall chemical equation

**Returns:**
- `MechanismResult`: Mechanism analysis including elementary steps

**Example:**
```typescript
const mechanism = kinetics.analyzeMechanism('2 NO + O2 = 2 NO2');
console.log('Elementary steps:', mechanism.elementarySteps);
console.log('Rate-determining step:', mechanism.rateDeterminingStep);
console.log('Intermediates:', mechanism.intermediates);
```

### SafetyAnalyzer

Comprehensive safety assessment for chemical reactions and compounds.

#### Constructor

```typescript
import { SafetyAnalyzer } from 'creb-js';
const safety = new SafetyAnalyzer();
```

#### Methods

##### `analyze(compounds: string[], reactionType: string): SafetyReport`

Performs safety analysis for given compounds and reaction type.

**Parameters:**
- `compounds` (string[]): Array of chemical formulas
- `reactionType` (string): Type of reaction ('combustion', 'synthesis', 'decomposition', etc.)

**Returns:**
- `SafetyReport`: Comprehensive safety assessment

**Example:**
```typescript
const report = safety.analyze(['H2', 'O2', 'C8H18'], 'combustion');
console.log('Hazard level:', report.hazardLevel);
console.log('Safety recommendations:', report.recommendations);
console.log('Required PPE:', report.requiredPPE);
console.log('Emergency procedures:', report.emergencyProcedures);
```

##### `assessHazards(formula: string): HazardAssessment`

Assesses individual compound hazards.

**Parameters:**
- `formula` (string): Chemical formula

**Returns:**
- `HazardAssessment`: Individual compound hazard data

##### `generateSafetyProtocol(equation: string): SafetyProtocol`

Generates comprehensive safety protocol for a reaction.

**Parameters:**
- `equation` (string): Chemical equation

**Returns:**
- `SafetyProtocol`: Complete safety protocol including procedures and equipment

## Enhanced Features

### ThermodynamicsIntegratedBalancer

Revolutionary tool combining equation balancing with comprehensive thermodynamic analysis.

#### Constructor

```typescript
import { ThermodynamicsIntegratedBalancer } from 'creb-js';
const integrator = new ThermodynamicsIntegratedBalancer();
```

#### Methods

##### `balanceWithThermodynamics(equation: string, conditions?: ReactionConditions): IntegratedResult`

Performs equation balancing with complete thermodynamic and kinetic analysis.

**Parameters:**
- `equation` (string): Unbalanced chemical equation
- `conditions` (optional): Reaction conditions

**Returns:**
- `IntegratedResult`: Complete analysis including balancing, thermodynamics, kinetics, and safety

**Example:**
```typescript
const result = integrator.balanceWithThermodynamics(
  'C6H12O6 + O2 = CO2 + H2O',
  { temperature: 310.15, pressure: 1.0 }
);

console.log('Balanced:', result.balanced);
console.log('ΔG°:', result.thermodynamics.gibbsFreeEnergy);
console.log('Spontaneous:', result.thermodynamics.isSpontaneous);
console.log('Rate constant:', result.kinetics.rateConstant);
console.log('Safety level:', result.safety.hazardLevel);
```

### Virtual Laboratory

Simulated laboratory environment for chemistry experiments.

#### Constructor

```typescript
import { VirtualLab } from 'creb-js';
const lab = new VirtualLab();
```

#### Methods

##### `createExperiment(type: string, parameters: ExperimentParams): Experiment`

Creates a virtual chemistry experiment.

**Parameters:**
- `type` (string): Experiment type ('titration', 'synthesis', 'kinetics', etc.)
- `parameters` (ExperimentParams): Experiment configuration

**Returns:**
- `Experiment`: Virtual experiment instance

**Example:**
```typescript
const experiment = lab.createExperiment('titration', {
  analyte: 'HCl',
  titrant: 'NaOH',
  concentration: 0.1,
  volume: 25.0,
  indicator: 'phenolphthalein'
});

const results = experiment.run();
console.log('Equivalence point:', results.equivalencePoint);
console.log('pH curve:', results.phCurve);
```

##### `simulateReaction(equation: string, conditions: ReactionConditions): SimulationResult`

Simulates a chemical reaction in virtual environment.

**Parameters:**
- `equation` (string): Chemical equation
- `conditions` (ReactionConditions): Simulation conditions

**Returns:**
- `SimulationResult`: Detailed simulation data

### PubChem Integration

Enhanced chemical data access through PubChem database.

#### Installation

```bash
npm install creb-pubchem-js
```

#### Usage

```typescript
import { Compound, CompoundSearch } from 'creb-pubchem-js';

// Search for compounds
const search = new CompoundSearch();
const compounds = await search.searchByName('caffeine');

// Get compound details
const compound = new Compound();
const data = await compound.getByName('aspirin');
console.log('Molecular weight:', data.molecularWeight);
console.log('Formula:', data.molecularFormula);
console.log('IUPAC name:', data.iupacName);

// Enhanced stoichiometry with real data
import { EnhancedStoichiometry } from 'creb-js';
const enhanced = new EnhancedStoichiometry('aspirin + NaOH = sodium_salicylate + H2O');
const result = await enhanced.calculateWithValidation('aspirin', 1.0, 'moles');
```

## Comprehensive Examples

### Basic Equation Balancing

```javascript
import { ChemicalEquationBalancer } from 'creb-js';

const balancer = new ChemicalEquationBalancer();

// Simple reactions
console.log(balancer.balance('H2 + O2 = H2O'));
// Output: "2 H2 + O2 = 2 H2O"

// Complex organic reactions
console.log(balancer.balance('C8H18 + O2 = CO2 + H2O'));
// Output: "2 C8H18 + 25 O2 = 16 CO2 + 18 H2O"

// Acid-base reactions
console.log(balancer.balance('Ca(OH)2 + HCl = CaCl2 + H2O'));
// Output: "Ca(OH)2 + 2 HCl = CaCl2 + 2 H2O"
```

### Advanced Thermodynamic Analysis

```typescript
import { ThermodynamicsCalculator } from 'creb-js';

const calculator = new ThermodynamicsCalculator();

// Glucose combustion (cellular respiration model)
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

const result = calculator.calculateReactionThermodynamics(glucoseReaction, 310.15);
console.log(`ΔH° = ${result.enthalpy} kJ/mol`);         // ~-2803 kJ/mol
console.log(`ΔS° = ${result.entropy} J/(mol·K)`);       // ~182 J/(mol·K)
console.log(`ΔG° = ${result.gibbsFreeEnergy} kJ/mol`);  // ~-2879 kJ/mol
console.log(`Spontaneous: ${result.isSpontaneous}`);    // true

// Temperature dependence analysis
const temperatures = [273.15, 298.15, 310.15, 373.15, 500];
const tempAnalysis = calculator.calculateTemperatureDependence(glucoseReaction, temperatures);

tempAnalysis.forEach(data => {
  console.log(`T: ${data.temperature}K, ΔG: ${data.gibbsFreeEnergy.toFixed(1)} kJ/mol`);
});
```

### Reaction Kinetics Analysis

```typescript
import { ReactionKinetics } from 'creb-js';

const kinetics = new ReactionKinetics();

// Hydrogen-oxygen reaction kinetics
const conditions = {
  temperature: 298.15,
  pressure: 1.0,
  catalyst: 'Pt'
};

const kineticResult = kinetics.analyze('2 H2 + O2 = 2 H2O', conditions);
console.log('Rate constant:', kineticResult.rateConstant);
console.log('Activation energy:', kineticResult.activationEnergy, 'kJ/mol');
console.log('Reaction order:', kineticResult.reactionOrder);

// Mechanism analysis
const mechanism = kinetics.analyzeMechanism('2 NO + O2 = 2 NO2');
console.log('Elementary steps:');
mechanism.elementarySteps.forEach((step, i) => {
  console.log(`${i + 1}: ${step.equation} (Ea = ${step.activationEnergy} kJ/mol)`);
});
console.log('Rate-determining step:', mechanism.rateDeterminingStep.equation);
```

### Safety Assessment

```typescript
import { SafetyAnalyzer } from 'creb-js';

const safety = new SafetyAnalyzer();

// Combustion safety analysis
const combustionReport = safety.analyze(['C8H18', 'O2'], 'combustion');
console.log('Hazard level:', combustionReport.hazardLevel);
console.log('Required PPE:', combustionReport.requiredPPE);
console.log('Safety recommendations:');
combustionReport.recommendations.forEach(rec => console.log(`- ${rec}`));

// Individual compound hazards
const ethaneHazards = safety.assessHazards('C2H6');
console.log('Flammability:', ethaneHazards.flammability);
console.log('Toxicity:', ethaneHazards.toxicity);

// Generate safety protocol
const protocol = safety.generateSafetyProtocol('2 H2 + O2 = 2 H2O');
console.log('Pre-reaction checks:');
protocol.preReactionChecks.forEach(check => console.log(`- ${check}`));
```

### Integrated Analysis

```typescript
import { ThermodynamicsIntegratedBalancer } from 'creb-js';

const integrator = new ThermodynamicsIntegratedBalancer();

// Complete analysis of methane combustion
const result = integrator.balanceWithThermodynamics(
  'CH4 + O2 = CO2 + H2O',
  { temperature: 298.15, pressure: 1.0 }
);

console.log('=== COMPLETE ANALYSIS ===');
console.log('Balanced equation:', result.balanced.equation);
console.log('');
console.log('THERMODYNAMICS:');
console.log(`ΔH° = ${result.thermodynamics.enthalpy} kJ/mol`);
console.log(`ΔG° = ${result.thermodynamics.gibbsFreeEnergy} kJ/mol`);
console.log(`Spontaneous: ${result.thermodynamics.isSpontaneous}`);
console.log('');
console.log('KINETICS:');
console.log(`Rate constant: ${result.kinetics.rateConstant}`);
console.log(`Activation energy: ${result.kinetics.activationEnergy} kJ/mol`);
console.log('');
console.log('SAFETY:');
console.log(`Hazard level: ${result.safety.hazardLevel}`);
console.log('Required PPE:', result.safety.requiredPPE.join(', '));
console.log('');
console.log('OPTIMIZATION:');
console.log(`Optimal temperature: ${result.optimization.optimalTemperature}K`);
console.log('Yield improvements:', result.optimization.yieldImprovement.join(', '));
```

### Virtual Laboratory Experiments

```typescript
import { VirtualLab } from 'creb-js';

const lab = new VirtualLab();

// Acid-base titration
const titration = lab.createExperiment('titration', {
  analyte: 'HCl',
  analyteConcen: 0.1,
  analyteVolume: 25.0,
  titrant: 'NaOH',
  titrantConcen: 0.1,
  indicator: 'phenolphthalein'
});

const titrationResult = titration.run();
console.log('Equivalence point:', titrationResult.equivalencePoint);
console.log('Volume at equivalence:', titrationResult.volumeAtEquivalence);
console.log('pH at equivalence:', titrationResult.pHAtEquivalence);

// Kinetics experiment
const kineticsExp = lab.createExperiment('kinetics', {
  equation: 'N2O5 = 2 NO2 + 0.5 O2',
  initialConcentration: 0.1,
  temperature: 298.15,
  timePoints: [0, 10, 20, 30, 60, 120, 300] // seconds
});

const kineticData = kineticsExp.run();
console.log('Concentration vs time:', kineticData.concentrationProfile);
console.log('Rate constant:', kineticData.rateConstant);
console.log('Half-life:', kineticData.halfLife);
```

### PubChem Enhanced Calculations

```typescript
import { EnhancedStoichiometry } from 'creb-js';
import { Compound } from 'creb-pubchem-js';

// Enhanced stoichiometry with real compound data
const enhanced = new EnhancedStoichiometry();

// Pharmaceutical synthesis calculation
const aspirinSynthesis = 'C7H6O3 + C4H6O3 = C9H8O4 + C2H4O2';
const result = await enhanced.calculateWithValidation(aspirinSynthesis, {
  startingMaterial: 'C7H6O3',
  amount: 10.0,
  unit: 'grams'
});

console.log('=== ASPIRIN SYNTHESIS ===');
console.log('Validated equation:', result.validatedEquation);
console.log('Mass balance error:', result.massBalanceError);
console.log('');
console.log('STARTING MATERIALS NEEDED:');
Object.entries(result.reactants).forEach(([formula, data]) => {
  console.log(`${formula}: ${data.grams.toFixed(2)} g (${data.moles.toFixed(4)} mol)`);
});
console.log('');
console.log('PRODUCTS FORMED:');
Object.entries(result.products).forEach(([formula, data]) => {
  console.log(`${formula}: ${data.grams.toFixed(2)} g (${data.moles.toFixed(4)} mol)`);
});
console.log('');
console.log('THEORETICAL YIELD:', result.theoreticalYield.toFixed(2), 'g');
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

## Deployment and Production

### Browser Usage

The library works seamlessly in modern browsers:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Chemistry Calculator</title>
</head>
<body>
    <input id="equation" placeholder="Enter chemical equation..." />
    <button onclick="calculateReaction()">Balance & Analyze</button>
    <div id="results"></div>

    <script type="module">
        import { 
            ChemicalEquationBalancer, 
            ThermodynamicsCalculator 
        } from 'https://cdn.skypack.dev/creb-js';

        window.calculateReaction = async function() {
            const equation = document.getElementById('equation').value;
            const balancer = new ChemicalEquationBalancer();
            const thermo = new ThermodynamicsCalculator();
            
            try {
                const balanced = balancer.balance(equation);
                const analysis = balancer.balanceDetailed(equation);
                
                // Convert to reaction data for thermodynamics
                const reactionData = {
                    reactants: analysis.reactants.map((r, i) => ({
                        formula: r,
                        coefficient: analysis.coefficients[i]
                    })),
                    products: analysis.products.map((p, i) => ({
                        formula: p,
                        coefficient: analysis.coefficients[analysis.reactants.length + i]
                    }))
                };
                
                const thermoResult = thermo.calculateReactionThermodynamics(reactionData);
                
                document.getElementById('results').innerHTML = `
                    <h3>Results:</h3>
                    <p><strong>Balanced:</strong> ${balanced}</p>
                    <p><strong>ΔH°:</strong> ${thermoResult.enthalpy.toFixed(2)} kJ/mol</p>
                    <p><strong>ΔG°:</strong> ${thermoResult.gibbsFreeEnergy.toFixed(2)} kJ/mol</p>
                    <p><strong>Spontaneous:</strong> ${thermoResult.isSpontaneous ? 'Yes' : 'No'}</p>
                `;
            } catch (error) {
                document.getElementById('results').innerHTML = `
                    <p style="color: red;">Error: ${error.message}</p>
                `;
            }
        };
    </script>
</body>
</html>
```

### Node.js Server Deployment

```javascript
// server.js
import express from 'express';
import { 
    ChemicalEquationBalancer, 
    ThermodynamicsCalculator,
    ReactionKinetics,
    SafetyAnalyzer 
} from 'creb-js';

const app = express();
app.use(express.json());

const balancer = new ChemicalEquationBalancer();
const thermo = new ThermodynamicsCalculator();
const kinetics = new ReactionKinetics();
const safety = new SafetyAnalyzer();

// Balance equation endpoint
app.post('/api/balance', (req, res) => {
    try {
        const { equation } = req.body;
        const result = balancer.balanceDetailed(equation);
        res.json({ success: true, data: result });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Complete analysis endpoint
app.post('/api/analyze', async (req, res) => {
    try {
        const { equation, conditions = {} } = req.body;
        
        // Balance equation
        const balanced = balancer.balanceDetailed(equation);
        
        // Thermodynamic analysis
        const reactionData = {
            reactants: balanced.reactants.map((r, i) => ({
                formula: r,
                coefficient: balanced.coefficients[i]
            })),
            products: balanced.products.map((p, i) => ({
                formula: p,
                coefficient: balanced.coefficients[balanced.reactants.length + i]
            }))
        };
        
        const thermoResult = thermo.calculateReactionThermodynamics(
            reactionData, 
            conditions.temperature || 298.15
        );
        
        // Kinetics analysis
        const kineticResult = kinetics.analyze(balanced.equation, {
            temperature: conditions.temperature || 298.15,
            pressure: conditions.pressure || 1.0,
            ...conditions
        });
        
        // Safety assessment
        const compounds = [...balanced.reactants, ...balanced.products];
        const safetyReport = safety.analyze(compounds, conditions.reactionType || 'general');
        
        res.json({
            success: true,
            data: {
                balanced,
                thermodynamics: thermoResult,
                kinetics: kineticResult,
                safety: safetyReport
            }
        });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

app.listen(3000, () => {
    console.log('CREB Chemistry API running on port 3000');
});
```

## Error Handling

The library provides comprehensive error handling:

```javascript
import { ChemicalEquationBalancer, CREBError } from 'creb-js';

const balancer = new ChemicalEquationBalancer();

try {
    const result = balancer.balance('Invalid equation format');
} catch (error) {
    if (error instanceof CREBError) {
        console.log('Error type:', error.type);
        console.log('Message:', error.message);
        console.log('Suggestions:', error.suggestions);
    }
}

// Common error types:
// - INVALID_EQUATION_FORMAT
// - UNKNOWN_ELEMENT  
// - UNBALANCEABLE_EQUATION
// - INVALID_FORMULA
// - THERMODYNAMIC_DATA_UNAVAILABLE
// - KINETIC_CALCULATION_ERROR
// - SAFETY_DATA_UNAVAILABLE
```

## Testing

Run the comprehensive test suite:

```bash
# Run all tests
npm test

# Run specific test suites
npm run test:unit
npm run test:integration
npm run test:performance

# Test with coverage
npm run test:coverage

# Test specific modules
npm run test:thermodynamics
npm run test:kinetics
npm run test:safety
```

## Contributing

We welcome contributions! Here's how to get started:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/new-feature`
3. **Run tests**: `npm test`
4. **Commit changes**: `git commit -am 'Add new feature'`
5. **Push to branch**: `git push origin feature/new-feature`
6. **Submit a Pull Request**

### Development Setup

```bash
git clone https://github.com/vloganathane/CREB.git
cd CREB
npm install
npm run build
npm test
```

### Contribution Areas

- **Core algorithms**: Improve balancing and calculation accuracy
- **New features**: Add support for new reaction types
- **Performance**: Optimize calculations and memory usage
- **Documentation**: Improve examples and tutorials
- **Testing**: Add test cases for edge scenarios
- **Framework integrations**: Create packages for React, Vue, Angular
- **Educational content**: Develop interactive tutorials

## License

This project is licensed under the **AGPL-3.0 License**, maintaining the same open-source spirit as the original CREB project.

### Key Points:
- ✅ **Free for educational and research use**
- ✅ **Open source contributions welcomed**
- ✅ **Commercial use permitted with compliance**
- ❗ **Modifications must be shared under AGPL-3.0**
- ❗ **Network use triggers copyleft requirements**

For commercial licensing options, contact: [partnerships@creb.dev](mailto:partnerships@creb.dev)

## Acknowledgments

### Original Work
This library builds upon the excellent foundation of the [CREB Python project](https://github.com/LastChemist/CREB-Chemical_Reaction_Equation_Balancer) by **LastChemist**. We deeply appreciate the original author's contribution to the chemistry community.

### Scientific Data Sources
- **NIST Chemistry WebBook**: Thermodynamic data
- **CRC Handbook**: Physical and chemical properties
- **PubChem Database**: Compound information and validation
- **JANAF Tables**: High-temperature thermodynamic data

### Community
Special thanks to our contributors, testers, and the broader chemistry education community for their valuable feedback and support.

### Development Tools
- **TypeScript**: Type-safe chemistry computations
- **Jest**: Comprehensive testing framework
- **Rollup**: Efficient bundling and distribution
- **GitHub Actions**: Continuous integration and deployment

---

## Getting Help

### Documentation
- **[Quick Start Guide](https://github.com/vloganathane/CREB#quick-start)**
- **[API Reference](https://github.com/vloganathane/CREB/blob/main/DOCUMENTATION.md)**
- **[Interactive Demo](https://vloganathane.github.io/CREB)**
- **[Examples Repository](https://github.com/vloganathane/CREB/tree/main/examples)**

### Community Support
- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: Questions and community help
- **Stack Overflow**: Tag your questions with `creb-js`

### Professional Support
- **Email**: [support@creb.dev](mailto:support@creb.dev)
- **Consulting**: Custom integrations and enterprise support
- **Training**: Workshops and educational programs

---

**Ready to revolutionize chemistry computation?** Start with CREB-JS today and join the growing community of educators, researchers, and developers advancing chemistry through technology!

**GitHub**: [github.com/vloganathane/CREB](https://github.com/vloganathane/CREB)  
**Demo**: [Interactive Chemistry Calculator](https://vloganathane.github.io/CREB)  
**NPM**: [creb-js](https://www.npmjs.com/package/creb-js) | [creb-pubchem-js](https://www.npmjs.com/package/creb-pubchem-js)
