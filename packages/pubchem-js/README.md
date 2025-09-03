# @creb-js/pubchem

A JavaScript/TypeScript port of [PubChemPy](https://github.com/mcs07/PubChemPy) for accessing chemical compound data from the [PubChem](https://pubchem.ncbi.nlm.nih.gov/) database.

## Features

- 🧪 **Compound Data Access**: Retrieve comprehensive chemical compound information from PubChem
- 🔍 **Multiple Search Methods**: Search by CID, name, SMILES, molecular formula, and InChI
- 📊 **Rich Compound Properties**: Access molecular formulas, weights, SMILES, InChI, and more
- 🌐 **HTTP Client**: Built-in caching and rate limiting for API requests
- 🔒 **Type Safe**: Full TypeScript support with comprehensive type definitions
- ⚡ **Modern**: ESM/CJS dual package with tree-shaking support

## Installation

```bash
npm install @creb-js/pubchem
```

## Quick Start

```typescript
import { Compound } from '@creb-js/pubchem';

// Get compound by CID
const benzene = await Compound.fromCid(241);
console.log(benzene.molecularFormula); // "C6H6"
console.log(benzene.molecularWeight);   // 78.11

// Search by name
const compounds = await Compound.fromName('aspirin');
console.log(compounds[0].smiles); // "CC(=O)OC1=CC=CC=C1C(=O)O"

// Search by SMILES
const results = await Compound.fromSmiles('C1=CC=CC=C1');
console.log(results[0].cid); // 241 (benzene)
```

## API Reference

### Compound Class

The main class for working with chemical compounds.

#### Static Methods

- `Compound.fromCid(cid: number)` - Get compound by CID
- `Compound.fromName(name: string)` - Search compounds by name
- `Compound.fromSmiles(smiles: string)` - Search compounds by SMILES
- `Compound.fromFormula(formula: string)` - Search compounds by molecular formula
- `Compound.fromInchi(inchi: string)` - Search compounds by InChI

#### Properties

- `cid: number` - PubChem Compound ID
- `molecularFormula: string` - Molecular formula
- `molecularWeight: number` - Molecular weight
- `smiles: string` - SMILES notation
- `isomericSmiles: string` - Isomeric SMILES
- `inchi: string` - InChI identifier
- `inchiKey: string` - InChI Key
- `iupacName: string` - IUPAC name
- `atoms: AtomData[]` - Atom information
- `bonds: BondData[]` - Bond information

## Integration with CREB

This package is designed to work seamlessly with [CREB](https://github.com/vloganathane/CREB) for enhanced chemical equation balancing with real compound data:

```typescript
import { balanceEquation } from 'creb-js';
import { Compound } from '@creb-js/pubchem';

// Get compound data
const water = await Compound.fromName('water');
const glucose = await Compound.fromName('glucose');

// Balance equation with real molecular data
const result = balanceEquation('C6H12O6 + O2 -> CO2 + H2O');
```

## 🎯 Demos & Examples

The package includes comprehensive demos to help you get started:

```bash
# Run basic demo with examples
npm run demo

# Interactive TypeScript demo
npm run demo:interactive

# Performance benchmark
npm run demo:benchmark

# Serve browser demo
npm run demo:serve
# Then open http://localhost:8000/demo/browser.html
```

**Available demos:**
- 📝 **Basic Demo** (`demo/basic.js`) - Core functionality examples
- 🎯 **Interactive Demo** (`demo/interactive.ts`) - CLI interface with commands
- 🌐 **Browser Demo** (`demo/browser.html`) - Full web interface
- ⚡ **Benchmark Demo** (`demo/benchmark.js`) - Performance testing

See [`demo/README.md`](./demo/README.md) for detailed instructions.

## Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Build package
npm run build

# Type check
npm run typecheck
```

## License

MIT

## Credits

- Based on [PubChemPy](https://github.com/mcs07/PubChemPy) by Matt Swain
- Part of the [CREB](https://github.com/vloganathane/CREB) project
