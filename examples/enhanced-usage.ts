/**
 * Enhanced CREB Examples - Phase 2: PubChem Integration
 * Demonstrates enhanced balancer and stoichiometry with PubChem data
 */

import {
  EnhancedChemicalEquationBalancer,
  EnhancedStoichiometry,
  CompoundInfo,
  EnhancedStoichiometryResult
} from '../src/index';

// Example 1: Enhanced Equation Balancing with Compound Validation
async function exampleEnhancedBalancing() {
  console.log('=== Enhanced Chemical Equation Balancing ===\n');
  
  const balancer = new EnhancedChemicalEquationBalancer();
  
  // Balance equation with PubChem data enrichment
  const equation = 'C6H12O6 + O2 = CO2 + H2O';
  console.log(`Original equation: ${equation}`);
  
  try {
    const result = await balancer.balanceWithPubChemData(equation);
    
    console.log(`Balanced equation: ${result.equation}`);
    console.log(`Mass balanced: ${result.validation?.massBalanced}`);
    
    if (result.compoundData) {
      console.log('\nCompound Information:');
      for (const [species, info] of Object.entries(result.compoundData)) {
        if (info.isValid) {
          console.log(`  ${species}:`);
          console.log(`    CID: ${info.cid}`);
          console.log(`    Molecular Weight: ${info.molecularWeight} g/mol`);
          console.log(`    Formula: ${info.molecularFormula}`);
          console.log(`    IUPAC Name: ${info.iupacName}`);
        } else {
          console.log(`  ${species}: ${info.error}`);
        }
      }
    }
    
    if (result.validation?.warnings.length) {
      console.log('\nWarnings:');
      result.validation.warnings.forEach(warning => console.log(`  - ${warning}`));
    }
    
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : error);
  }
  
  console.log('\n' + '='.repeat(60) + '\n');
}

// Example 2: Enhanced Stoichiometric Calculations
async function exampleEnhancedStoichiometry() {
  console.log('=== Enhanced Stoichiometry Calculations ===\n');
  
  const stoich = new EnhancedStoichiometry();
  
  const equation = '2 H2 + O2 = 2 H2O';
  console.log(`Equation: ${equation}`);
  
  try {
    // Initialize with validation
    const analysis = await stoich.initializeWithValidation(equation);
    console.log(`Molecular weight validation: ${analysis.molecularWeightValidation.isBalanced}`);
    console.log(`Reactant mass: ${analysis.molecularWeightValidation.reactants.toFixed(3)} g/mol`);
    console.log(`Product mass: ${analysis.molecularWeightValidation.products.toFixed(3)} g/mol`);
    console.log(`Difference: ${analysis.molecularWeightValidation.difference.toFixed(6)} g/mol`);
    
    // Enhanced calculation from moles
    console.log('\nCalculating from 2 moles of H2:');
    const result = await stoich.calculateFromMolesEnhanced('H2', 2);
    
    console.log('\nReactants:');
    for (const [species, data] of Object.entries(result.reactants)) {
      console.log(`  ${species}: ${data.moles} mol, ${data.grams.toFixed(3)} g`);
    }
    
    console.log('\nProducts:');
    for (const [species, data] of Object.entries(result.products)) {
      console.log(`  ${species}: ${data.moles} mol, ${data.grams.toFixed(3)} g`);
    }
    
    // Show molecular weight accuracy if available
    if (result.validation?.molecularWeightAccuracy) {
      console.log('\nMolecular Weight Accuracy:');
      for (const [species, accuracy] of Object.entries(result.validation.molecularWeightAccuracy)) {
        console.log(`  ${species}: ${accuracy.accuracy} (calculated: ${accuracy.calculated.toFixed(3)}, PubChem: ${accuracy.pubchem.toFixed(3)})`);
      }
    }
    
    if (result.validation?.warnings.length) {
      console.log('\nWarnings:');
      result.validation.warnings.forEach(warning => console.log(`  - ${warning}`));
    }
    
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : error);
  }
  
  console.log('\n' + '='.repeat(60) + '\n');
}

// Example 3: Enhanced Molar Weight Calculation
async function exampleEnhancedMolarWeight() {
  console.log('=== Enhanced Molar Weight Calculation ===\n');
  
  const stoich = new EnhancedStoichiometry();
  
  const compounds = ['H2O', 'C6H12O6', 'NaCl', 'H2SO4'];
  
  for (const compound of compounds) {
    try {
      const result = await stoich.calculateMolarWeightEnhanced(compound);
      
      console.log(`${compound}:`);
      console.log(`  Calculated: ${result.calculated.toFixed(3)} g/mol`);
      
      if (result.pubchem) {
        console.log(`  PubChem: ${result.pubchem.toFixed(3)} g/mol`);
        console.log(`  Difference: ${result.difference?.toFixed(6)} g/mol`);
        console.log(`  Accuracy: ${result.accuracy}`);
        
        if (result.compoundInfo?.iupacName) {
          console.log(`  IUPAC Name: ${result.compoundInfo.iupacName}`);
        }
      } else {
        console.log('  PubChem data not available');
      }
      
      console.log('');
      
    } catch (error) {
      console.error(`Error for ${compound}:`, error instanceof Error ? error.message : error);
    }
  }
  
  console.log('='.repeat(60) + '\n');
}

// Example 4: Compound Comparison
async function exampleCompoundComparison() {
  console.log('=== Compound Comparison ===\n');
  
  const stoich = new EnhancedStoichiometry();
  
  const comparisons = [
    ['glucose', 'C6H12O6'],
    ['water', 'H2O'],
    ['salt', 'NaCl'],
    ['ethanol', 'C2H5OH']
  ];
  
  for (const [compound1, compound2] of comparisons) {
    try {
      console.log(`Comparing "${compound1}" vs "${compound2}":`);
      
      const comparison = await stoich.compareCompounds(compound1, compound2);
      
      console.log(`  Same compound: ${comparison.comparison.sameCompound}`);
      console.log(`  Formulas similar: ${comparison.comparison.formulasSimilar}`);
      
      if (comparison.compound1.isValid && comparison.compound2.isValid) {
        console.log(`  Molecular weight ratio: ${comparison.comparison.molecularWeightRatio.toFixed(3)}`);
        
        if (comparison.compound1.molecularFormula && comparison.compound2.molecularFormula) {
          console.log(`  Formulas: ${comparison.compound1.molecularFormula} vs ${comparison.compound2.molecularFormula}`);
        }
      }
      
      if (comparison.comparison.differences.length > 0) {
        console.log('  Differences:');
        comparison.comparison.differences.forEach(diff => console.log(`    - ${diff}`));
      }
      
      console.log('');
      
    } catch (error) {
      console.error(`Error comparing ${compound1} vs ${compound2}:`, error instanceof Error ? error.message : error);
    }
  }
  
  console.log('='.repeat(60) + '\n');
}

// Example 5: Error Handling and Fallbacks
async function exampleErrorHandling() {
  console.log('=== Error Handling and Fallbacks ===\n');
  
  const balancer = new EnhancedChemicalEquationBalancer();
  const stoich = new EnhancedStoichiometry();
  
  // Test with unknown compounds
  console.log('Testing with unknown compounds:');
  
  try {
    const result = await balancer.balanceWithPubChemData('UNKNOWN1 + UNKNOWN2 = UNKNOWN3');
    console.log(`Balanced: ${result.equation}`);
    console.log(`Warnings: ${result.validation?.warnings.length || 0}`);
    
    if (result.validation?.warnings.length) {
      console.log('Warning messages:');
      result.validation.warnings.forEach(warning => console.log(`  - ${warning}`));
    }
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : error);
  }
  
  // Test suggestions for misspelled compounds
  console.log('\nTesting suggestions for misspelled compounds:');
  
  const misspelled = ['watr', 'glucos', 'ethano'];
  
  for (const compound of misspelled) {
    try {
      const suggestions = await balancer.suggestAlternatives(compound);
      console.log(`"${compound}" -> suggestions: [${suggestions.join(', ')}]`);
    } catch (error) {
      console.error(`Error getting suggestions for ${compound}:`, error instanceof Error ? error.message : error);
    }
  }
  
  console.log('\n' + '='.repeat(60) + '\n');
}

// Main function to run all examples
async function runAllExamples() {
  console.log('Enhanced CREB Examples - Phase 2: PubChem Integration');
  console.log('Note: Some features require the creb-pubchem-js package to be installed\n');
  
  await exampleEnhancedBalancing();
  await exampleEnhancedStoichiometry();
  await exampleEnhancedMolarWeight();
  await exampleCompoundComparison();
  await exampleErrorHandling();
  
  console.log('All examples completed!');
}

// Export for use in other files
export {
  exampleEnhancedBalancing,
  exampleEnhancedStoichiometry,
  exampleEnhancedMolarWeight,
  exampleCompoundComparison,
  exampleErrorHandling,
  runAllExamples
};

// Run examples if this file is executed directly
if (require.main === module) {
  runAllExamples().catch(console.error);
}
