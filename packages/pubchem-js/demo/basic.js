#!/usr/bin/env node

/**
 * PubChem-JS Demo - Basic Usage Examples
 * 
 * This demo showcases the core functionality of the @creb-js/pubchem library.
 * Run with: node demo/basic.js
 */

const { Compound } = require('../dist/index.js');

async function runDemo() {
  console.log('🧪 PubChem-JS Demo - Basic Usage\n');
  console.log('=' .repeat(50));

  try {
    // Demo 1: Get compound by CID
    console.log('\n📍 Demo 1: Get Compound by CID');
    console.log('Getting benzene (CID: 241)...');
    
    const benzene = await Compound.fromCid(241);
    console.log(`✅ Found: ${benzene.iupacName || 'Benzene'}`);
    console.log(`   Formula: ${benzene.molecularFormula}`);
    console.log(`   Weight: ${benzene.molecularWeight} g/mol`);
    console.log(`   SMILES: ${benzene.smiles}`);

    // Demo 2: Search by name
    console.log('\n📍 Demo 2: Search by Name');
    console.log('Searching for "aspirin"...');
    
    const aspirinResults = await Compound.fromName('aspirin');
    const aspirin = aspirinResults[0];
    console.log(`✅ Found ${aspirinResults.length} result(s)`);
    console.log(`   CID: ${aspirin.cid}`);
    console.log(`   Formula: ${aspirin.molecularFormula}`);
    console.log(`   Weight: ${aspirin.molecularWeight} g/mol`);

    // Demo 3: Search by SMILES
    console.log('\n📍 Demo 3: Search by SMILES');
    console.log('Searching for water (SMILES: O)...');
    
    const waterResults = await Compound.fromSmiles('O');
    const water = waterResults[0];
    console.log(`✅ Found ${waterResults.length} result(s)`);
    console.log(`   CID: ${water.cid}`);
    console.log(`   Formula: ${water.molecularFormula}`);
    console.log(`   Weight: ${water.molecularWeight} g/mol`);

    // Demo 4: Get compound properties
    console.log('\n📍 Demo 4: Detailed Properties');
    console.log('Getting detailed info for caffeine...');
    
    const caffeineResults = await Compound.fromName('caffeine');
    const caffeine = caffeineResults[0];
    console.log(`✅ Caffeine (CID: ${caffeine.cid})`);
    console.log(`   Molecular Formula: ${caffeine.molecularFormula}`);
    console.log(`   Molecular Weight: ${caffeine.molecularWeight} g/mol`);
    console.log(`   SMILES: ${caffeine.smiles}`);
    console.log(`   InChI Key: ${caffeine.inchiKey || 'N/A'}`);
    console.log(`   IUPAC Name: ${caffeine.iupacName || 'N/A'}`);

    // Demo 5: Convert to dictionary
    console.log('\n📍 Demo 5: Data Export');
    console.log('Converting compound to dictionary...');
    
    const dict = caffeine.toDict();
    console.log('✅ Available properties:');
    Object.keys(dict).forEach(key => {
      if (dict[key] !== null && dict[key] !== undefined) {
        console.log(`   ${key}: ${typeof dict[key] === 'object' ? '[object]' : dict[key]}`);
      }
    });

    console.log('\n🎉 Demo completed successfully!');
    console.log('\n💡 Try modifying this script to explore other compounds:');
    console.log('   - Change CIDs (try 2244 for Ibuprofen)');
    console.log('   - Search different names (try "glucose", "ethanol")');
    console.log('   - Use different SMILES strings');

  } catch (error) {
    console.error('❌ Demo failed:', error.message);
    console.error('\n💡 Common issues:');
    console.error('   - Network connection required');
    console.error('   - Build the package first: npm run build');
    process.exit(1);
  }
}

// Run the demo
if (require.main === module) {
  runDemo().catch(console.error);
}

module.exports = { runDemo };
