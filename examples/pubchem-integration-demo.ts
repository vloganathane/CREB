/**
 * CREB PubChem Integration Demo
 * 
 * This demo shows how to use the enhanced molecular visualization
 * with PubChem search and data integration.
 */

import { 
    createEnhancedVisualization,
    type EnhancedVisualizationConfig,
    type PubChemCompound,
    type PubChemSearchResult
} from '../src/visualization';

// Demo configuration
const config: EnhancedVisualizationConfig = {
    rdkit: {
        generateCoords: true,
        sanitize: true,
        removeHs: true
    },
    mol3D: {
        backgroundColor: 'white',
        style: 'stick',
        width: 600,
        height: 400,
        interactive: true
    },
    export: {
        formats: ['svg'],
        quality: 0.9
    }
};

async function runPubChemDemo() {
    console.log('🧪 Starting CREB PubChem Integration Demo...');

    try {
        // Initialize the enhanced visualization system
        console.log('⚙️ Initializing enhanced visualization...');
        const visualization = await createEnhancedVisualization(config);
        
        console.log('✅ Enhanced visualization initialized successfully');

        // Demo 1: Search for a compound by name
        console.log('\n🔍 Demo 1: Searching for caffeine...');
        try {
            const caffeineResults = await visualization.searchPubChemCompounds('caffeine', {
                maxResults: 5,
                searchType: 'name'
            });
            
            console.log('📋 Caffeine search results:', caffeineResults);
            
            if (caffeineResults.compounds.length > 0) {
                const caffeine = caffeineResults.compounds[0];
                console.log('☕ Found caffeine (CID:', caffeine.cid, ')');
                
                // Load the compound for visualization
                const loadResult = await visualization.loadPubChemCompound(caffeine.cid.toString());
                console.log('📊 Caffeine loaded for visualization:', loadResult);
            }
        } catch (error) {
            console.error('❌ Caffeine search failed:', error);
        }

        // Demo 2: Search by CID
        console.log('\n🔍 Demo 2: Loading aspirin by CID (2244)...');
        try {
            const aspirinResult = await visualization.loadPubChemCompound('2244');
            console.log('💊 Aspirin loaded:', aspirinResult);
            
            // Get compound properties
            if (aspirinResult.smiles) {
                const analysis = await visualization.analyzeMolecule(aspirinResult.smiles);
                console.log('🧬 Aspirin molecular analysis:', analysis);
            }
        } catch (error) {
            console.error('❌ Aspirin loading failed:', error);
        }

        // Demo 3: Batch compound search
        console.log('\n🔍 Demo 3: Batch searching for common drugs...');
        const drugNames = ['ibuprofen', 'acetaminophen', 'morphine'];
        
        for (const drugName of drugNames) {
            try {
                console.log(`\n  🔎 Searching for ${drugName}...`);
                const results = await visualization.searchPubChemCompounds(drugName, {
                    maxResults: 1,
                    searchType: 'name'
                });
                
                if (results.compounds.length > 0) {
                    const compound = results.compounds[0];
                    console.log(`  ✅ Found ${drugName} (CID: ${compound.cid})`);
                    
                    // Load basic data without full visualization
                    const compoundData = await visualization.loadPubChemCompound(compound.cid.toString());
                    console.log(`  📈 ${drugName} MW: ${compoundData.molecularWeight || 'N/A'}`);
                } else {
                    console.log(`  ❌ No results found for ${drugName}`);
                }
            } catch (error) {
                console.error(`  ❌ Error searching for ${drugName}:`, error.message);
            }
        }

        // Demo 4: Export capabilities
        console.log('\n💾 Demo 4: Testing export capabilities...');
        try {
            // Load a simple molecule for export testing
            const ethanolResult = await visualization.loadPubChemCompound('702'); // Ethanol CID
            
            if (ethanolResult.smiles) {
                console.log('📤 Testing SVG export...');
                const svgData = await visualization.exportSVG(ethanolResult.smiles);
                console.log('✅ SVG export successful, size:', svgData.length, 'characters');
                
                console.log('📤 Testing molecular data export...');
                const exportData = await visualization.exportMolecularData(ethanolResult.smiles);
                console.log('✅ Molecular data export:', exportData);
            }
        } catch (error) {
            console.error('❌ Export demo failed:', error);
        }

        console.log('\n🎉 PubChem Integration Demo completed successfully!');
        console.log('📚 Integration features demonstrated:');
        console.log('  ✅ PubChem compound search by name');
        console.log('  ✅ PubChem compound loading by CID');
        console.log('  ✅ Molecular analysis and properties');
        console.log('  ✅ Batch compound processing');
        console.log('  ✅ Data export capabilities');
        console.log('  ✅ Error handling and resilience');

    } catch (error) {
        console.error('💥 Demo failed with critical error:', error);
        console.log('📋 Error details:', {
            message: error.message,
            stack: error.stack
        });
    }
}

// Usage examples for different scenarios
export const usageExamples = {
    // Simple compound search
    async searchCompound(name: string) {
        const viz = await createEnhancedVisualization(config);
        return await viz.searchPubChemCompounds(name);
    },

    // Load and visualize by CID
    async visualizeCompound(cid: string) {
        const viz = await createEnhancedVisualization(config);
        const compound = await viz.loadPubChemCompound(cid);
        
        if (compound.smiles) {
            return await viz.analyzeMolecule(compound.smiles);
        }
        throw new Error('No SMILES data available for compound');
    },

    // Comprehensive compound analysis
    async analyzeCompound(identifier: string) {
        const viz = await createEnhancedVisualization(config);
        
        // Try as CID first, then as name
        let compound;
        if (/^\d+$/.test(identifier)) {
            compound = await viz.loadPubChemCompound(identifier);
        } else {
            const searchResults = await viz.searchPubChemCompounds(identifier);
            if (searchResults.compounds.length === 0) {
                throw new Error(`No compounds found for: ${identifier}`);
            }
            compound = await viz.loadPubChemCompound(searchResults.compounds[0].cid.toString());
        }

        // Perform comprehensive analysis
        const results = {
            compound,
            analysis: compound.smiles ? await viz.analyzeMolecule(compound.smiles) : null,
            svg: compound.smiles ? await viz.exportSVG(compound.smiles) : null
        };

        return results;
    }
};

// Run the demo if this file is executed directly
if (require.main === module) {
    runPubChemDemo().catch(console.error);
}

export default runPubChemDemo;
