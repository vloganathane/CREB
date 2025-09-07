# WebAssembly Optimization Module

High-performance WebAssembly implementation for critical CREB-JS chemistry calculations.

## Features

- **Matrix Operations**: Optimized Gaussian elimination for equation balancing
- **Thermodynamic Calculations**: Fast Gibbs free energy computations
- **Molecular Weight**: Efficient atomic weight calculations
- **Stoichiometry**: High-speed stoichiometric calculations
- **Automatic Fallback**: JavaScript fallback when WebAssembly is unavailable
- **Performance Monitoring**: Built-in metrics and monitoring

## Usage

```typescript
import { wasmManager, WasmEquationBalancer } from '@creb-js/wasm';

// Check if WebAssembly is available
if (wasmManager.isAvailable()) {
  console.log('WebAssembly acceleration enabled');
}

// Optimized equation balancing
const coefficients = await wasmManager.balanceEquationOptimized([
  [1, 0, -1],
  [0, 2, -1],
  [1, -1, 0]
]);

// Optimized thermodynamics
const gibbs = await wasmManager.calculateThermodynamicsOptimized(-285.8, -163.2, 298.15);

// Optimized molecular weight
const weight = await wasmManager.calculateMolecularWeightOptimized('H2O');
```

## Performance

The WebAssembly module provides significant performance improvements for:

- Large matrix operations (10-100x faster)
- Complex thermodynamic calculations (5-20x faster)  
- Bulk molecular weight calculations (3-10x faster)
- Stoichiometric batch processing (5-15x faster)

## Browser Support

- Chrome 57+
- Firefox 52+
- Safari 11+
- Edge 16+

Automatic fallback to JavaScript for unsupported browsers.

## Development

```bash
npm run build    # Build TypeScript
npm run dev      # Watch mode
npm run clean    # Clean build files
```
