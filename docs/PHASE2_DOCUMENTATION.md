# CREB-JS Phase 2: Enhanced PubChem Integration

## Overview

Phase 2 of CREB-JS introduces enhanced functionality that integrates PubChem data to provide:

- **Compound validation** and verification
- **Accurate molecular weights** from PubChem database
- **Enhanced stoichiometric calculations** with real compound data
- **Mass balance verification** using PubChem molecular weights
- **Compound comparison** and analysis
- **Error handling** with graceful fallbacks

## New Classes

### EnhancedChemicalEquationBalancer

An enhanced version of the standard `ChemicalEquationBalancer` that integrates PubChem data for compound validation and enrichment.

#### Key Features

- **PubChem Integration**: Automatically looks up compound data during balancing
- **Mass Balance Validation**: Verifies mass conservation using accurate molecular weights
- **Compound Caching**: Intelligent caching to minimize API calls
- **Error Handling**: Graceful degradation when PubChem data is unavailable
- **Alternative Suggestions**: Provides suggestions for unknown compounds

#### Usage Example

```typescript
import { EnhancedChemicalEquationBalancer } from 'creb-js';

const balancer = new EnhancedChemicalEquationBalancer();

// Balance equation with PubChem data enrichment
const result = await balancer.balanceWithPubChemData('C6H12O6 + O2 = CO2 + H2O');

console.log('Balanced equation:', result.equation);
console.log('Mass balanced:', result.validation?.massBalanced);

// Display compound information
if (result.compoundData) {
  for (const [species, info] of Object.entries(result.compoundData)) {
    if (info.isValid) {
      console.log(`${species}: MW=${info.molecularWeight}, Formula=${info.molecularFormula}`);
    }
  }
}
```

#### API Reference

##### `balanceWithPubChemData(equation: string): Promise<EnhancedBalancedEquation>`

Balances a chemical equation and enriches it with PubChem compound data.

**Returns:**
- `equation`: The balanced equation string
- `compoundData`: Detailed information for each compound
- `validation`: Mass balance and other validation results
- `coefficients`, `reactants`, `products`: Standard balancing results

##### `getCompoundInfo(compoundName: string): Promise<CompoundInfo>`

Retrieves detailed information about a compound from PubChem.

**Returns:**
- `name`: Compound name as provided
- `cid`: PubChem Compound ID
- `molecularWeight`: Accurate molecular weight from PubChem
- `molecularFormula`: Molecular formula
- `iupacName`: IUPAC nomenclature name
- `isValid`: Whether the compound was found
- `error`: Error message if compound not found

##### `suggestAlternatives(compoundName: string): Promise<string[]>`

Provides alternative spellings or names for unknown compounds.

##### `clearCache(): void`

Clears the compound information cache.

### EnhancedStoichiometry

An enhanced version of the standard `Stoichiometry` class that provides PubChem-integrated calculations.

#### Key Features

- **PubChem-Enhanced Calculations**: Uses accurate molecular weights from PubChem
- **Molecular Weight Validation**: Compares calculated vs. PubChem molecular weights
- **Compound Analysis**: Detailed compound information and validation
- **Reaction Analysis**: Comprehensive analysis of chemical reactions
- **Compound Comparison**: Side-by-side comparison of compounds

#### Usage Example

```typescript
import { EnhancedStoichiometry } from 'creb-js';

const stoich = new EnhancedStoichiometry();

// Initialize with equation validation
const analysis = await stoich.initializeWithValidation('2 H2 + O2 = 2 H2O');
console.log('Mass balanced:', analysis.molecularWeightValidation.isBalanced);

// Enhanced calculation from moles
const result = await stoich.calculateFromMolesEnhanced('H2', 2);

// Display results with PubChem validation
console.log('Reactants:');
for (const [species, data] of Object.entries(result.reactants)) {
  console.log(`  ${species}: ${data.moles} mol, ${data.grams} g`);
}

// Show molecular weight accuracy
if (result.validation?.molecularWeightAccuracy) {
  for (const [species, accuracy] of Object.entries(result.validation.molecularWeightAccuracy)) {
    console.log(`${species} MW accuracy: ${accuracy.accuracy}`);
  }
}
```

#### API Reference

##### `initializeWithValidation(equation: string): Promise<ReactionAnalysis>`

Initializes the stoichiometry calculator with PubChem validation.

**Returns:**
- `equation`: The balanced equation
- `balanced`: Whether the equation is balanced
- `molecularWeightValidation`: Mass balance validation results
- `compoundInfo`: Detailed compound information
- `suggestions`: Alternative names for unknown compounds

##### `calculateFromMolesEnhanced(species: string, moles: number): Promise<EnhancedStoichiometryResult>`

Performs stoichiometric calculation with PubChem data enhancement.

**Returns:**
- Standard stoichiometry results (`reactants`, `products`, `totalMolarMass`)
- `compoundData`: PubChem compound information
- `pubchemMolarWeights`: Molecular weights from PubChem
- `validation`: Molecular weight accuracy and warnings

##### `calculateFromGramsEnhanced(species: string, grams: number): Promise<EnhancedStoichiometryResult>`

Performs stoichiometric calculation from grams with PubChem enhancement.

##### `calculateMolarWeightEnhanced(formula: string): Promise<MolarWeightResult>`

Calculates molar weight with PubChem verification.

**Returns:**
- `calculated`: Calculated molecular weight
- `pubchem`: PubChem molecular weight (if available)
- `difference`: Absolute difference
- `accuracy`: Accuracy rating (excellent/good/fair/poor)
- `compoundInfo`: Full compound information

##### `compareCompounds(compound1: string, compound2: string): Promise<ComparisonResult>`

Compares two compounds using PubChem data.

## Data Types

### EnhancedBalancedEquation

```typescript
interface EnhancedBalancedEquation extends BalancedEquation {
  compoundData?: Record<string, CompoundInfo>;
  validation?: {
    massBalanced: boolean;
    chargeBalanced: boolean;
    warnings: string[];
  };
}
```

### CompoundInfo

```typescript
interface CompoundInfo {
  name: string;
  cid?: number;
  molecularWeight?: number;
  molecularFormula?: string;
  iupacName?: string;
  canonicalSmiles?: string;
  isValid: boolean;
  error?: string;
}
```

### EnhancedStoichiometryResult

```typescript
interface EnhancedStoichiometryResult extends StoichiometryResult {
  compoundData?: Record<string, CompoundInfo>;
  pubchemMolarWeights?: Record<string, number>;
  validation?: {
    molecularWeightAccuracy: Record<string, {
      calculated: number;
      pubchem: number;
      difference: number;
      accuracy: string;
    }>;
    warnings: string[];
  };
}
```

## Installation and Dependencies

Phase 2 functionality requires the optional PubChem integration package:

```bash
npm install creb-js creb-pubchem-js
```

The enhanced classes work with graceful degradation:
- **With PubChem package**: Full functionality with compound validation and enrichment
- **Without PubChem package**: Standard balancing/stoichiometry with warning messages

## Error Handling

Enhanced classes provide robust error handling:

1. **Network Errors**: Graceful fallback to standard calculations
2. **Unknown Compounds**: Warning messages with suggested alternatives
3. **API Failures**: Detailed error messages and continued operation
4. **Invalid Input**: Clear validation and error reporting

## Performance Considerations

- **Caching**: Compound data is cached to minimize API calls
- **Rate Limiting**: Built-in rate limiting for PubChem API
- **Async Operations**: All PubChem operations are asynchronous
- **Fallback Mode**: Immediate fallback to standard calculations if PubChem unavailable

## Examples

### Complete Workflow Example

```typescript
import { EnhancedChemicalEquationBalancer, EnhancedStoichiometry } from 'creb-js';

async function completeAnalysis(equation: string) {
  // 1. Enhanced balancing with validation
  const balancer = new EnhancedChemicalEquationBalancer();
  const balanced = await balancer.balanceWithPubChemData(equation);
  
  console.log('Balanced:', balanced.equation);
  console.log('Mass balanced:', balanced.validation?.massBalanced);
  
  // 2. Enhanced stoichiometry
  const stoich = new EnhancedStoichiometry();
  const analysis = await stoich.initializeWithValidation(equation);
  
  // 3. Calculate with PubChem data
  const result = await stoich.calculateFromMolesEnhanced('H2', 2);
  
  // 4. Display enhanced results
  console.log('Enhanced Results:');
  console.log('- Reactants:', Object.keys(result.reactants));
  console.log('- Products:', Object.keys(result.products));
  
  if (result.validation?.warnings.length) {
    console.log('Warnings:', result.validation.warnings);
  }
}

// Run analysis
completeAnalysis('2 H2 + O2 = 2 H2O');
```

### Compound Comparison Example

```typescript
async function compareGlucoseTypes() {
  const stoich = new EnhancedStoichiometry();
  
  const comparison = await stoich.compareCompounds('glucose', 'C6H12O6');
  
  console.log('Same compound:', comparison.comparison.sameCompound);
  console.log('Molecular weight ratio:', comparison.comparison.molecularWeightRatio);
  
  if (comparison.comparison.differences.length > 0) {
    console.log('Differences:', comparison.comparison.differences);
  }
}
```

## Browser Integration

Enhanced classes work in both Node.js and browser environments:

```html
<script src="creb-js.umd.js"></script>
<script src="creb-pubchem-js.umd.js"></script>
<script>
  // Enhanced functionality available globally
  const balancer = new CREB.EnhancedChemicalEquationBalancer();
  // ... use as normal
</script>
```

## Migration from Standard Classes

Enhanced classes are drop-in compatible with standard classes:

```typescript
// Standard usage still works
const stoich = new EnhancedStoichiometry('2 H2 + O2 = 2 H2O');
const standardResult = stoich.calculateFromMoles('H2', 2);

// Enhanced usage adds new capabilities
const enhancedResult = await stoich.calculateFromMolesEnhanced('H2', 2);
```

## Future Enhancements

Phase 2 sets the foundation for:
- **Phase 3**: Reaction mechanism analysis
- **Phase 4**: Thermodynamics integration
- **Phase 5**: Kinetics calculations
- **Phase 6**: Advanced chemical property predictions

## Support and Documentation

- **GitHub Repository**: [https://github.com/vloganathane/CREB](https://github.com/vloganathane/CREB)
- **Examples**: See `examples/enhanced-usage.ts`
- **API Documentation**: Complete TypeScript definitions included
- **Demo**: Try the live demo with enhanced features at [https://vloganathane.github.io/CREB/demos/demo.html](https://vloganathane.github.io/CREB/demos/demo.html)
