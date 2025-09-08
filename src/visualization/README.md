# CREB Molecular Visualization Integration

## Overview

This directory contains the complete integration of **RDKit.js** and **3Dmol.js** into the CREB visualization system, providing powerful cheminformatics and 3D molecular visualization capabilities.

## Features

### RDKit.js Integration
- **Official WASM Loading**: Uses the recommended `initRDKitModule()` pattern
- **2D Structure Generation**: High-quality SVG rendering with customizable parameters
- **Molecular Properties**: MW, LogP, TPSA, H-bond donors/acceptors, and more
- **SMILES Processing**: Parsing, validation, and canonicalization
- **Substructure Matching**: Advanced chemical search capabilities
- **Export Capabilities**: SVG export with publication-quality rendering

### 3Dmol.js Integration
- **WebGL-based 3D Rendering**: Hardware-accelerated molecular visualization
- **Multiple Representation Styles**: Stick, sphere, line, and cartoon models
- **Interactive Controls**: Zoom, rotate, and pan functionality
- **Export Capabilities**: PNG export for presentations and publications
- **PDB Support**: Direct integration with protein structure data

### Browser Compatibility
- **Modern Browser Support**: Chrome, Firefox, Safari, Edge (latest versions)
- **Mobile-Responsive**: Touch-friendly controls and responsive design
- **Fallback Handling**: Graceful degradation when libraries fail to load
- **Error Reporting**: Comprehensive status and debug information

## Files

### Core TypeScript Wrappers
- `src/visualization/RDKitWrapper.ts` - Comprehensive RDKit.js wrapper
- `src/visualization/Mol3DWrapper.ts` - 3Dmol.js integration wrapper
- `src/visualization/EnhancedMolecularVisualization.ts` - Combined visualization system

### Demo Files
- `demos/rdkit-official-demo.html` - **Production-ready demo** using official RDKit.js patterns
- `demos/molecular-visualization-final.html` - Previous stable version
- `demos/enhanced-molecular-visualization-fixed.html` - Earlier iteration

### Archive
- `demos/archive/` - Legacy demo files and prototypes

## Quick Start

### Browser Demo

Open `demos/rdkit-official-demo.html` in a modern web browser. The demo will:

1. **Automatically initialize** RDKit.js using the official WASM loading pattern
2. **Load 3Dmol.js** for 3D visualization
3. **Display status updates** during initialization
4. **Enable controls** once both libraries are ready
5. **Auto-load** a default molecule (ethanol)

### Example Usage

```html
<!-- Load RDKit.js using official method -->
<script src="https://unpkg.com/@rdkit/rdkit/dist/RDKit_minimal.js"></script>
<!-- Load 3Dmol.js -->
<script src="https://3dmol.csb.pitt.edu/build/3Dmol-min.js"></script>

<script>
// Initialize RDKit using official pattern
const RDKit = await window.initRDKitModule();

// Create molecule
const mol = RDKit.get_mol('CCO');
const svg = mol.get_svg_with_highlights(JSON.stringify({
    width: 350,
    height: 350,
    bondLineWidth: 2
}));
mol.delete(); // Important: clean up memory
</script>
```

### TypeScript Integration

```typescript
import { RDKitWrapper, Mol3DWrapper, EnhancedMolecularVisualization } from './src/visualization';

// Initialize the visualization system
const viz = new EnhancedMolecularVisualization();
await viz.initialize();

// Load and visualize a molecule
const result = await viz.loadMolecule('CC(=O)OC1=CC=CC=C1C(=O)O'); // Aspirin
if (result.success) {
    console.log('Molecule loaded:', result.properties);
}
```

## API Reference

### RDKitWrapper

```typescript
class RDKitWrapper {
    // Initialize RDKit.js using official pattern
    async initialize(): Promise<void>
    
    // Parse SMILES and create molecule
    parseMolecule(smiles: string): Promise<RDKitMolecule>
    
    // Generate 2D coordinates
    generateCoordinates(molecule: RDKitMolecule): Promise<RDKitMolecule>
    
    // Calculate molecular properties
    calculateProperties(molecule: RDKitMolecule): Promise<MolecularProperties>
    
    // Generate SVG representation
    generateSVG(molecule: RDKitMolecule, config?: RenderConfig): Promise<string>
    
    // Perform substructure search
    substructureSearch(molecule: RDKitMolecule, pattern: string): Promise<SubstructureMatch[]>
}
```

### Mol3DWrapper

```typescript
class Mol3DWrapper {
    // Initialize 3Dmol.js viewer
    async initialize(element: HTMLElement): Promise<void>
    
    // Load molecule from various formats
    async loadMolecule(data: string, format: 'pdb' | 'sdf' | 'mol2'): Promise<void>
    
    // Apply visualization style
    setStyle(style: '3dmol.SphereSpec' | '3dmol.StickSpec' | '3dmol.LineSpec'): void
    
    // Export current view
    exportPNG(): string
    exportPDB(): string
}
```

## Example Molecules

The demo includes several example molecules for testing:

- **Ethanol** (`CCO`) - Simple alcohol
- **Aspirin** (`CC(=O)OC1=CC=CC=C1C(=O)O`) - Common pharmaceutical
- **Caffeine** (`CN1C=NC2=C1C(=O)N(C(=O)N2C)C`) - Stimulant compound
- **Ibuprofen** (`CC(C)CC1=CC=C(C=C1)C(C)C(=O)O`) - Anti-inflammatory
- **Benzene** (`C1=CC=CC=C1`) - Aromatic ring system

## Browser Compatibility

### Supported Browsers
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Requirements
- **WebAssembly support** (for RDKit.js)
- **WebGL support** (for 3Dmol.js)
- **ES2018+ support** (async/await, modules)

### Known Issues
- **Safari < 14**: WASM loading may be slower
- **Mobile browsers**: Touch controls may need adjustment
- **Older browsers**: Consider polyfills for missing features

## Performance Considerations

### Memory Management
- **RDKit molecules**: Always call `.delete()` to free WASM memory
- **3Dmol viewers**: Clear models when switching molecules
- **Large datasets**: Implement pagination or virtual scrolling

### Loading Optimization
- **CDN usage**: Libraries load from fast CDNs
- **Lazy loading**: Initialize only when needed
- **Error handling**: Graceful fallbacks for library failures

## Development

### Building
```bash
npm run build
```

### Testing
```bash
npm test
npm run test:browser
```

### Linting
```bash
npm run lint
npm run lint:fix
```

## Contributing

1. **Follow TypeScript best practices**
2. **Add comprehensive error handling**
3. **Include unit tests for new features**
4. **Update documentation for API changes**
5. **Test in multiple browsers**

## License

This integration follows the same license as the CREB project. RDKit.js and 3Dmol.js are used under their respective licenses.

## Support

- **RDKit.js**: [GitHub Repository](https://github.com/rdkit/rdkit-js)
- **3Dmol.js**: [Official Website](https://3dmol.csb.pitt.edu/)
- **CREB Issues**: Use the project's issue tracker

## Changelog

### v1.0.0 (Current)
- ✅ Official RDKit.js WASM initialization pattern
- ✅ Comprehensive TypeScript wrappers
- ✅ Production-ready browser demo
- ✅ Full error handling and status reporting
- ✅ SVG and PNG export capabilities
- ✅ Mobile-responsive design
- ✅ Multiple visualization styles
- ✅ Molecular property calculations

### Future Enhancements
- 🔄 Advanced 3D structure generation from SMILES
- 🔄 Integration with chemical databases (PubChem, ChEMBL)
- 🔄 Batch processing capabilities
- 🔄 Collaborative features
- 🔄 Plugin system for custom visualizations
