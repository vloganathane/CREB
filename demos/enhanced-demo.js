#!/usr/bin/env node

/**
 * CREB-JS v1.4.0 Enhanced Demo
 * Demonstrates enhanced functionality with PubChem integration
 * and NEW Thermodynamics-Integrated Balancer
 * 
 * Run with: node demos/enhanced-demo.js
 */

import { 
  EnhancedChemicalEquationBalancer, 
  EnhancedStoichiometry,
  ThermodynamicsEquationBalancer
} from '../dist/index.esm.js';

async function demo() {
  console.log('🧪 CREB-JS v1.4.0: Enhanced Demo with Thermodynamics Integration\n');
  console.log('=' .repeat(60));

  // Demo 1: Enhanced Chemical Equation Balancing
  console.log('\n📋 Demo 1: Enhanced Chemical Equation Balancing');
  console.log('-'.repeat(50));
  
  const balancer = new EnhancedChemicalEquationBalancer();
  const equation = 'C6H12O6 + O2 = CO2 + H2O';
  
  console.log(`Original equation: ${equation}`);
  
  try {
    const result = await balancer.balanceWithPubChemData(equation);
    
    console.log(`Balanced equation: ${result.equation}`);
    console.log(`Mass balanced: ${result.validation?.massBalanced ? '✅' : '❌'}`);
    
    if (result.compoundData) {
      console.log('\nCompound Information:');
      for (const [species, info] of Object.entries(result.compoundData)) {
        if (info.isValid) {
          console.log(`  ${species}:`);
          console.log(`    🆔 CID: ${info.cid || 'N/A'}`);
          console.log(`    ⚖️  MW: ${info.molecularWeight || 'N/A'} g/mol`);
          console.log(`    🧪 Formula: ${info.molecularFormula || 'N/A'}`);
        } else {
          console.log(`  ${species}: ❌ ${info.error}`);
        }
      }
    }
    
    if (result.validation?.warnings.length) {
      console.log('\n⚠️  Warnings:');
      result.validation.warnings.forEach(warning => console.log(`    ${warning}`));
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }

  // Demo 2: Enhanced Stoichiometry
  console.log('\n📊 Demo 2: Enhanced Stoichiometry Calculations');
  console.log('-'.repeat(50));
  
  const stoich = new EnhancedStoichiometry();
  const simpleEquation = '2 H2 + O2 = 2 H2O';
  
  console.log(`Equation: ${simpleEquation}`);
  
  try {
    // Initialize with validation
    const analysis = await stoich.initializeWithValidation(simpleEquation);
    
    console.log(`\n🔍 Analysis Results:`);
    console.log(`  Mass balanced: ${analysis.molecularWeightValidation.isBalanced ? '✅' : '❌'}`);
    console.log(`  Reactant mass: ${analysis.molecularWeightValidation.reactants.toFixed(3)} g/mol`);
    console.log(`  Product mass: ${analysis.molecularWeightValidation.products.toFixed(3)} g/mol`);
    console.log(`  Difference: ${analysis.molecularWeightValidation.difference.toFixed(6)} g/mol`);
    
    // Enhanced calculation
    console.log('\n🧮 Calculating from 2 moles of H2:');
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
      console.log('\n🎯 Molecular Weight Accuracy:');
      for (const [species, accuracy] of Object.entries(result.validation.molecularWeightAccuracy)) {
        const status = accuracy.accuracy === 'excellent' ? '🟢' : 
                      accuracy.accuracy === 'good' ? '🟡' : 
                      accuracy.accuracy === 'fair' ? '🟠' : '🔴';
        console.log(`  ${species}: ${status} ${accuracy.accuracy} (calc: ${accuracy.calculated.toFixed(3)}, PubChem: ${accuracy.pubchem.toFixed(3)})`);
      }
    }
    
    if (result.validation?.warnings.length) {
      console.log('\n⚠️  Warnings:');
      result.validation.warnings.forEach(warning => console.log(`    ${warning}`));
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }

  // Demo 3: Enhanced Molar Weight Calculation
  console.log('\n⚖️  Demo 3: Enhanced Molar Weight Calculation');
  console.log('-'.repeat(50));
  
  const compounds = ['H2O', 'C6H12O6', 'NaCl', 'H2SO4'];
  
  for (const compound of compounds) {
    try {
      const result = await stoich.calculateMolarWeightEnhanced(compound);
      
      console.log(`\n${compound}:`);
      console.log(`  📊 Calculated: ${result.calculated.toFixed(3)} g/mol`);
      
      if (result.pubchem) {
        const status = result.accuracy === 'excellent' ? '🟢' : 
                      result.accuracy === 'good' ? '🟡' : 
                      result.accuracy === 'fair' ? '🟠' : '🔴';
        console.log(`  🌐 PubChem: ${result.pubchem.toFixed(3)} g/mol`);
        console.log(`  📏 Difference: ${result.difference?.toFixed(6)} g/mol`);
        console.log(`  🎯 Accuracy: ${status} ${result.accuracy}`);
        
        if (result.compoundInfo?.iupacName) {
          console.log(`  📝 IUPAC: ${result.compoundInfo.iupacName}`);
        }
      } else {
        console.log('  🌐 PubChem: Not available');
      }
      
    } catch (error) {
      console.error(`❌ Error for ${compound}:`, error.message);
    }
  }

  // Demo 4: Compound Comparison
  console.log('\n🔬 Demo 4: Compound Comparison');
  console.log('-'.repeat(50));
  
  const comparisons = [
    ['glucose', 'C6H12O6'],
    ['water', 'H2O'],
    ['ethanol', 'C2H5OH']
  ];
  
  for (const [compound1, compound2] of comparisons) {
    try {
      console.log(`\nComparing "${compound1}" vs "${compound2}":`);
      
      const comparison = await stoich.compareCompounds(compound1, compound2);
      
      const sameIcon = comparison.comparison.sameCompound ? '✅' : '❌';
      const similarIcon = comparison.comparison.formulasSimilar ? '✅' : '❌';
      
      console.log(`  Same compound: ${sameIcon} ${comparison.comparison.sameCompound}`);
      console.log(`  Formulas similar: ${similarIcon} ${comparison.comparison.formulasSimilar}`);
      
      if (comparison.compound1.isValid && comparison.compound2.isValid) {
        console.log(`  MW ratio: ${comparison.comparison.molecularWeightRatio.toFixed(3)}`);
        
        if (comparison.compound1.molecularFormula && comparison.compound2.molecularFormula) {
          console.log(`  Formulas: ${comparison.compound1.molecularFormula} vs ${comparison.compound2.molecularFormula}`);
        }
      }
      
      if (comparison.comparison.differences.length > 0) {
        console.log('  Differences:');
        comparison.comparison.differences.forEach(diff => console.log(`    - ${diff}`));
      }
      
    } catch (error) {
      console.error(`❌ Error comparing ${compound1} vs ${compound2}:`, error.message);
    }
  }

  // Demo 5: NEW - Thermodynamics-Integrated Balancer
  console.log('\n🚀 Demo 5: NEW - Thermodynamics-Integrated Balancer');
  console.log('-'.repeat(50));
  
  const thermBalancer = new ThermodynamicsEquationBalancer();
  const combustionEquation = 'CH4 + O2 = CO2 + H2O';
  
  console.log(`Testing thermodynamics-integrated balancing for: ${combustionEquation}`);
  
  try {
    const thermoResult = await thermBalancer.balanceWithThermodynamics(combustionEquation);
    
    console.log('✅ Thermodynamics-Integrated Analysis Results:');
    console.log(`   Balanced: ${thermoResult.balanced}`);
    
    if (thermoResult.analysis) {
      console.log(`   Reaction Type: ${thermoResult.analysis.reactionType}`);
      console.log(`   Feasibility: ${thermoResult.analysis.feasibility}`);
      console.log(`   Safety Level: ${thermoResult.analysis.safetyLevel}`);
      console.log(`   Energy Release: ${thermoResult.analysis.energyRelease?.toFixed(2)} kJ/mol`);
      console.log(`   Temperature Coefficient: ${thermoResult.analysis.temperatureCoefficient?.toFixed(4)}`);
    } else {
      console.log('   Analysis: Using estimated thermodynamic data');
    }
    
    if (thermoResult.conditions) {
      console.log('   Optimal Conditions:');
      console.log(`     Temperature: ${thermoResult.conditions.temperature} K`);
      console.log(`     Pressure: ${thermoResult.conditions.pressure} atm`);
    }
    
    if (thermoResult.industrialApplications?.length > 0) {
      console.log(`   Industrial Applications: ${thermoResult.industrialApplications.join(', ')}`);
    }
    
  } catch (error) {
    console.error('❌ Error in thermodynamics analysis:', error.message);
    console.log('   Note: This may occur if thermodynamic data is unavailable.');
    console.log('   The system will fall back to estimated values.');
  }

  console.log('\n' + '='.repeat(60));
  console.log('🎉 Enhanced Demo Complete with NEW Thermodynamics Integration!');
  console.log('\nNote: Some features may show warnings or limited data if');
  console.log('the creb-pubchem-js package is not installed or if PubChem');
  console.log('is not accessible. The library gracefully falls back to');
  console.log('standard calculations in such cases.');
  console.log('\nFor full functionality, install: npm install creb-pubchem-js');
}

// Run the demo
demo().catch(error => {
  console.error('\n❌ Demo failed:', error);
  process.exit(1);
});

export { demo };
