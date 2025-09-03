#!/usr/bin/env node

// Test script to evaluate current enhanced functionality
import { EnhancedChemicalEquationBalancer, EnhancedStoichiometry } from './dist/index.esm.js';

async function testEnhancedFeatures() {
  console.log('🧪 Testing Enhanced CREB Features\n');

  const balancer = new EnhancedChemicalEquationBalancer();

  // Test 1: Enhanced Chemical Intelligence
  console.log('1. Enhanced Chemical Intelligence');
  console.log('=' .repeat(40));
  try {
    const result = await balancer.balanceWithPubChemData("H2SO4 + NaOH = Na2SO4 + H2O");
    console.log('✅ balanceWithPubChemData available');
    console.log('Result:', JSON.stringify(result, null, 2));
  } catch (error) {
    console.log('❌ balanceWithPubChemData failed:', error.message);
  }

  // Test 2: Compound Name Resolution
  console.log('\n2. Compound Name Resolution');
  console.log('=' .repeat(40));
  // Check if we have balanceByName method
  if (typeof balancer.balanceByName === 'function') {
    try {
      const result = await balancer.balanceByName("sulfuric acid + sodium hydroxide = sodium sulfate + water");
      console.log('✅ balanceByName available');
      console.log('Result:', JSON.stringify(result, null, 2));
    } catch (error) {
      console.log('❌ balanceByName failed:', error.message);
    }
  } else {
    console.log('❌ balanceByName method not implemented');
  }

  // Test 3: Enhanced Stoichiometry
  console.log('\n3. Enhanced Stoichiometry');
  console.log('=' .repeat(40));
  try {
    const stoich = new EnhancedStoichiometry();
    const analysis = await stoich.initializeWithValidation("2 NaCl + AgNO3 = AgCl + 2 NaNO3");
    console.log('✅ EnhancedStoichiometry available');
    console.log('Analysis:', JSON.stringify(analysis, null, 2));

    // Try enhanced calculation
    const calculation = await stoich.calculateFromMolesEnhanced("NaCl", 0.171);
    console.log('Enhanced calculation:', JSON.stringify(calculation, null, 2));
  } catch (error) {
    console.log('❌ EnhancedStoichiometry failed:', error.message);
  }

  // Test 4: Chemical Safety Information
  console.log('\n4. Chemical Safety Information');
  console.log('=' .repeat(40));
  if (typeof balancer.balanceWithSafety === 'function') {
    try {
      const result = await balancer.balanceWithSafety("H2SO4 + NaOH = Na2SO4 + H2O");
      console.log('✅ balanceWithSafety available');
      console.log('Result:', JSON.stringify(result, null, 2));
    } catch (error) {
      console.log('❌ balanceWithSafety failed:', error.message);
    }
  } else {
    console.log('❌ balanceWithSafety method not implemented');
  }
}

testEnhancedFeatures().catch(console.error);
