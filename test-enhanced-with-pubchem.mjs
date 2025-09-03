#!/usr/bin/env node

// Test script to evaluate current enhanced functionality with PubChem
import { EnhancedChemicalEquationBalancer, EnhancedStoichiometry } from './dist/index.esm.js';
import { Compound } from './packages/pubchem-js/dist/index.esm.js';

// Make PubChem module available globally
globalThis.CREBPubChem = { Compound };

async function testEnhancedFeaturesWithPubChem() {
  console.log('🧪 Testing Enhanced CREB Features with PubChem Integration\n');

  const balancer = new EnhancedChemicalEquationBalancer();

  // Test 1: Enhanced Chemical Intelligence
  console.log('1. Enhanced Chemical Intelligence');
  console.log('=' .repeat(40));
  try {
    const result = await balancer.balanceWithPubChemData("H2SO4 + NaOH = Na2SO4 + H2O");
    console.log('✅ balanceWithPubChemData working with PubChem');
    console.log('Compound data for H2SO4:');
    if (result.compoundData?.H2SO4?.isValid) {
      console.log(`  - Molecular Weight: ${result.compoundData.H2SO4.molecularWeight} g/mol`);
      console.log(`  - Formula: ${result.compoundData.H2SO4.molecularFormula}`);
      console.log(`  - IUPAC Name: ${result.compoundData.H2SO4.iupacName}`);
    } else {
      console.log(`  - Error: ${result.compoundData?.H2SO4?.error}`);
    }
  } catch (error) {
    console.log('❌ balanceWithPubChemData failed:', error.message);
  }

  // Test 2: Compound Name Resolution (if available)
  console.log('\n2. Compound Name Resolution');
  console.log('=' .repeat(40));
  
  // Test what happens when we try to get compound data from common names
  try {
    const compoundInfo = await balancer.getCompoundInfo("sulfuric acid");
    console.log('✅ Common name resolution test:');
    console.log('  - Found compound:', compoundInfo.isValid);
    if (compoundInfo.isValid) {
      console.log(`  - Formula: ${compoundInfo.molecularFormula}`);
      console.log(`  - Molecular Weight: ${compoundInfo.molecularWeight} g/mol`);
      console.log(`  - IUPAC Name: ${compoundInfo.iupacName}`);
    } else {
      console.log(`  - Error: ${compoundInfo.error}`);
    }
  } catch (error) {
    console.log('❌ Common name resolution failed:', error.message);
  }

  // Test 3: Enhanced Stoichiometry
  console.log('\n3. Enhanced Stoichiometry with Real Data');
  console.log('=' .repeat(40));
  try {
    const stoich = new EnhancedStoichiometry();
    const analysis = await stoich.initializeWithValidation("2 NaCl + AgNO3 = AgCl + 2 NaNO3");
    console.log('✅ Enhanced stoichiometry analysis:');
    console.log(`  - Equation balanced: ${analysis.balanced}`);
    console.log(`  - Molecular weight validation:`);
    console.log(`    - Reactants: ${analysis.molecularWeightValidation.reactants.toFixed(2)} g/mol`);
    console.log(`    - Products: ${analysis.molecularWeightValidation.products.toFixed(2)} g/mol`);
    console.log(`    - Difference: ${analysis.molecularWeightValidation.difference.toFixed(4)} g/mol`);
    console.log(`    - Balanced: ${analysis.molecularWeightValidation.isBalanced}`);

    // Check compound validity
    for (const [species, info] of Object.entries(analysis.compoundInfo)) {
      console.log(`  - ${species}: ${info.isValid ? '✅ Valid' : '❌ ' + info.error}`);
      if (info.isValid && info.molecularWeight) {
        console.log(`    MW: ${info.molecularWeight} g/mol`);
      }
    }

    // Enhanced calculation
    const calculation = await stoich.calculateFromMolesEnhanced("NaCl", 0.171);
    console.log('\n✅ Enhanced calculation complete');
    console.log('  - Using PubChem molecular weights:', Object.keys(calculation.pubchemMolarWeights || {}).length > 0);
    console.log('  - Validation warnings:', calculation.validation?.warnings?.length || 0);
  } catch (error) {
    console.log('❌ EnhancedStoichiometry failed:', error.message);
  }

  // Test 4: Direct PubChem API Testing
  console.log('\n4. Direct PubChem API Test');
  console.log('=' .repeat(40));
  try {
    // Test different search methods
    const water = await Compound.fromName("water");
    if (water.length > 0) {
      console.log('✅ PubChem name search working:');
      console.log(`  - CID: ${water[0].cid}`);
      console.log(`  - Formula: ${water[0].molecularFormula}`);
      console.log(`  - Weight: ${water[0].molecularWeight} g/mol`);
    }

    const glucose = await Compound.fromFormula("C6H12O6");
    if (glucose.length > 0) {
      console.log('✅ PubChem formula search working:');
      console.log(`  - Found ${glucose.length} compound(s) with formula C6H12O6`);
      console.log(`  - Primary compound: ${glucose[0].iupacName || glucose[0].molecularFormula}`);
      console.log(`  - Weight: ${glucose[0].molecularWeight} g/mol`);
    }
  } catch (error) {
    console.log('❌ Direct PubChem API test failed:', error.message);
  }

  // Test 5: Safety/Hazard Information (if available)
  console.log('\n5. Advanced Features Assessment');
  console.log('=' .repeat(40));
  
  // Test if we can get additional compound properties that might include safety info
  try {
    const sulfuricAcid = await Compound.fromName("sulfuric acid");
    if (sulfuricAcid.length > 0) {
      const compound = sulfuricAcid[0];
      console.log('✅ Additional compound properties available:');
      console.log(`  - XLogP: ${compound.xlogp}`);
      console.log(`  - TPSA: ${compound.tpsa}`);
      console.log(`  - H-bond donors: ${compound.hBondDonorCount}`);
      console.log(`  - H-bond acceptors: ${compound.hBondAcceptorCount}`);
      console.log(`  - Complexity: ${compound.complexity}`);
      
      // Check if synonyms are available (common names)
      const synonyms = await compound.getSynonyms();
      console.log(`  - Synonyms available: ${synonyms.length} names`);
      if (synonyms.length > 0) {
        console.log(`  - Common names: ${synonyms.slice(0, 3).join(', ')}${synonyms.length > 3 ? '...' : ''}`);
      }
    }
  } catch (error) {
    console.log('❌ Advanced properties test failed:', error.message);
  }
}

testEnhancedFeaturesWithPubChem().catch(console.error);
