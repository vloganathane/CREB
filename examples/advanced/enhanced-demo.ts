import { EnhancedMolecularVisualization } from '../../src/visualization/EnhancedMolecularVisualization';

// Example usage of the enhanced molecular visualization system
async function demonstrateEnhancedVisualization() {
    try {
        // Initialize the enhanced visualization system
        const viz = new EnhancedMolecularVisualization({
            canvas2D: {
                width: 400,
                height: 400,
                backgroundColor: '#ffffff',
                interactive: true
            },
            mol3D: {
                width: 400,
                height: 400,
                backgroundColor: 'white',
                style: 'ball-and-stick',
                interactive: true
            }
        });

        console.log('Enhanced Molecular Visualization initialized successfully');

        // Example molecules to test
        const molecules = [
            'CCO', // Ethanol
            'CC(=O)OC1=CC=CC=C1C(=O)O', // Aspirin
            'CN1C=NC2=C1C(=O)N(C(=O)N2C)C', // Caffeine
            'CC(C)CC1=CC=C(C=C1)C(C)C(=O)O', // Ibuprofen
        ];

        for (const smiles of molecules) {
            console.log(`\n--- Processing molecule: ${smiles} ---`);

            try {
                // Load molecule
                const result = await viz.loadMoleculeFromSMILES(smiles);
                console.log('Molecule loaded successfully');

                // Get molecular properties
                const properties = result.properties;
                console.log('Molecular properties:', properties);

                // Get 2D SVG
                const svg = result.visualization.svg2D;
                console.log(`Generated SVG (${svg.length} characters)`);

                // Test substructure search
                await viz.searchSubstructure('c1ccccc1'); // Benzene ring
                console.log('Substructure search completed');

                // Export all formats
                const exports = await viz.exportAll();
                console.log('Export completed:', Object.keys(exports));

                console.log('Molecule processing completed successfully');

            } catch (error) {
                console.error(`Error processing molecule ${smiles}:`, error.message);
            }
        }

        console.log('\n--- Testing 3D visualization features ---');

        // Test 3D specific features
        try {
            const testResult = await viz.loadMoleculeFromSMILES('CCO');
            
            // Test 3D rendering styles
            const styles = ['stick', 'sphere', 'cartoon', 'line'] as const;
            for (const style of styles) {
                console.log(`Testing 3D style: ${style}`);
                viz.set3DStyle(style);
                console.log(`3D rendering with ${style} style completed`);
            }

            // Test surface generation
            console.log('Testing molecular surface generation');
            viz.add3DSurface('VDW', 0.7);
            console.log('Molecular surface added successfully');

            // Test properties access
            console.log('Testing property access');
            const properties = viz.getMolecularProperties();
            console.log('Properties retrieved:', properties ? 'SUCCESS' : 'NO PROPERTIES');

        } catch (error) {
            console.error('Error in 3D visualization testing:', error.message);
        }

        console.log('\n--- Enhanced Molecular Visualization Demo Completed ---');

    } catch (error) {
        console.error('Failed to initialize enhanced visualization:', error);
    }
}

// Integration test function
async function testIntegration() {
    console.log('Starting CREB Enhanced Molecular Visualization Integration Test');
    
    try {
        const viz = new EnhancedMolecularVisualization();
        
        // Test basic functionality without external dependencies
        console.log('Testing fallback functionality...');
        
        const fallbackResult = await viz.loadMoleculeFromSMILES('CCO');
        console.log('Fallback molecule loading:', fallbackResult ? 'SUCCESS' : 'FAILED');
        
        const fallbackProperties = viz.getMolecularProperties();
        console.log('Fallback property access:', fallbackProperties ? 'SUCCESS' : 'FAILED');
        
        console.log('Integration test completed');
        
    } catch (error) {
        console.error('Integration test failed:', error);
    }
}

// Export demonstration functions
export {
    demonstrateEnhancedVisualization,
    testIntegration
};

// Run demonstration if this file is executed directly
if (typeof process !== 'undefined' && process.argv && process.argv[1] && process.argv[1].includes('enhanced-demo')) {
    demonstrateEnhancedVisualization().catch(console.error);
}
