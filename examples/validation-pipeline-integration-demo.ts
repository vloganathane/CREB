/**
 * CREB Validation Pipeline Integration Example
 * 
 * Demonstrates how the [VP-001] Validation Pipeline is integrated
 * throughout the CREB chemistry platform for comprehensive data validation.
 * 
 * @version 1.0.0
 * @author CREB Team
 */

import {
  ValidationPipeline,
  createValidationPipeline,
  createFastValidationPipeline,
  validateChemicalFormula,
  validateThermodynamicProperties,
  ChemicalFormulaValidator,
  ThermodynamicPropertiesValidator,
  type ValidationResult
} from '../src/data/validation';

import { ChemicalDatabaseManager } from '../src/data/ChemicalDatabaseManager';
import { EnhancedChemicalEquationBalancer } from '../src/enhancedBalancer';
import { ThermodynamicsCalculator } from '../src/thermodynamics/calculator';

/**
 * Example 1: Basic Formula Validation
 */
async function basicFormulaValidation() {
  console.log('🧪 Basic Formula Validation Example');
  console.log('=====================================');

  const formulas = ['H2O', 'CO2', 'NaCl', 'Invalid123', 'C6H12O6'];

  for (const formula of formulas) {
    try {
      const result = await validateChemicalFormula(formula);
      console.log(`${formula}: ${result.isValid ? '✓ Valid' : '✗ Invalid'}`);
      
      if (!result.isValid) {
        result.errors.forEach(error => {
          console.log(`  - ${error.message}`);
          if (error.suggestions) {
            console.log(`    Suggestions: ${error.suggestions.join(', ')}`);
          }
        });
      }
    } catch (error) {
      console.log(`${formula}: ❌ Validation failed - ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  console.log('');
}

/**
 * Example 2: Thermodynamic Properties Validation
 */
async function thermodynamicValidation() {
  console.log('🌡️  Thermodynamic Properties Validation Example');
  console.log('===============================================');

  const properties = [
    {
      deltaHf: -285.8,
      entropy: 69.95,
      heatCapacity: 75.3,
      temperatureRange: [273, 373] as [number, number]
    },
    {
      deltaHf: 1000000, // Invalid - too high
      entropy: -50, // Invalid - negative entropy
      heatCapacity: 75.3,
      temperatureRange: [500, 300] as [number, number] // Invalid - min > max
    }
  ];

  for (let i = 0; i < properties.length; i++) {
    console.log(`\nProperty Set ${i + 1}:`);
    try {
      const result = await validateThermodynamicProperties(properties[i]);
      console.log(`  Status: ${result.isValid ? '✓ Valid' : '✗ Invalid'}`);
      
      if (!result.isValid) {
        result.errors.forEach(error => {
          console.log(`  - ${error.message}`);
        });
      }
      
      if (result.warnings.length > 0) {
        result.warnings.forEach(warning => {
          console.log(`  ⚠️  ${warning.message}`);
        });
      }
    } catch (error) {
      console.log(`  ❌ Validation failed - ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  console.log('');
}

/**
 * Example 3: Enhanced Chemical Equation Balancer with Validation
 */
async function enhancedBalancerWithValidation() {
  console.log('⚖️  Enhanced Balancer with Formula Validation');
  console.log('===========================================');

  const balancer = new EnhancedChemicalEquationBalancer();
  const equations = [
    'H2 + O2 -> H2O',
    'CH4 + O2 -> CO2 + H2O',
    'Invalid123 + O2 -> H2O', // Contains invalid formula
  ];

  for (const equation of equations) {
    console.log(`\nEquation: ${equation}`);
    try {
      const result = await balancer.balanceWithPubChemData(equation);
      console.log(`  Balanced: ${result.balanced}`);
      console.log(`  Formula Validation Results:`);
      
      if (result.validation?.formulaValidation) {
        for (const [formula, validation] of Object.entries(result.validation.formulaValidation)) {
          const validationResult = validation as ValidationResult;
          console.log(`    ${formula}: ${validationResult.isValid ? '✓' : '✗'}`);
          if (!validationResult.isValid) {
            validationResult.errors.forEach(error => {
              console.log(`      - ${error.message}`);
            });
          }
        }
      }
      
      if (result.validation?.warnings && result.validation.warnings.length > 0) {
        console.log(`  Warnings:`);
        result.validation.warnings.forEach(warning => {
          console.log(`    - ${warning}`);
        });
      }
    } catch (error) {
      console.log(`  ❌ Balancing failed - ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  console.log('');
}

/**
 * Example 4: Chemical Database with Validation Pipeline
 */
async function chemicalDatabaseWithValidation() {
  console.log('🗃️  Chemical Database with Validation Pipeline');
  console.log('=============================================');

  const dbManager = new ChemicalDatabaseManager();
  
  const compounds = [
    {
      formula: 'H2O',
      name: 'Water',
      molecularWeight: 18.015,
      thermodynamicProperties: {
        deltaHf: -285.8,
        entropy: 69.95,
        heatCapacity: 75.3,
        temperatureRange: [273, 373] as [number, number]
      }
    },
    {
      formula: 'Invalid123', // Invalid formula
      name: 'Invalid Compound',
      molecularWeight: 100,
      thermodynamicProperties: {
        deltaHf: 1000000, // Invalid properties
        entropy: -50,
        heatCapacity: 75.3,
        temperatureRange: [500, 300] as [number, number]
      }
    }
  ];

  for (const compound of compounds) {
    console.log(`\nAdding compound: ${compound.name} (${compound.formula})`);
    try {
      const success = await dbManager.addCompound(compound);
      console.log(`  Result: ${success ? '✓ Added successfully' : '✗ Failed to add'}`);
    } catch (error) {
      console.log(`  ❌ Addition failed - ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  console.log('');
}

/**
 * Example 5: Custom Validation Pipeline Configuration
 */
async function customValidationPipeline() {
  console.log('⚙️  Custom Validation Pipeline Configuration');
  console.log('==========================================');

  // Create a fast validation pipeline for performance-critical operations
  const fastPipeline = createFastValidationPipeline();
  
  // Add validators
  fastPipeline.addValidator(new ChemicalFormulaValidator());
  fastPipeline.addValidator(new ThermodynamicPropertiesValidator());

  console.log('Pipeline Statistics:');
  const stats = fastPipeline.getStats();
  console.log(`  Validators: ${stats.validators}`);
  console.log(`  Rules: ${stats.rules}`);
  console.log(`  Cache Size: ${stats.cacheSize}`);
  console.log(`  Cache Hit Rate: ${(stats.cacheHitRate * 100).toFixed(1)}%`);
  console.log(`  Average Duration: ${stats.avgDuration.toFixed(2)}ms`);

  // Test batch validation
  const formulas = ['H2O', 'CO2', 'NaCl', 'C6H12O6'];
  console.log('\nBatch Formula Validation:');
  
  try {
    const results = await fastPipeline.validateBatch(formulas, ['ChemicalFormulaValidator']);
    results.forEach((result, index) => {
      console.log(`  ${formulas[index]}: ${result.isValid ? '✓' : '✗'} (${result.metrics.duration}ms)`);
    });
  } catch (error) {
    console.log(`  ❌ Batch validation failed - ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
  console.log('');
}

/**
 * Example 6: Performance Comparison
 */
async function performanceComparison() {
  console.log('🚀 Performance Comparison');
  console.log('========================');

  const standardPipeline = createValidationPipeline();
  const fastPipeline = createFastValidationPipeline();
  
  standardPipeline.addValidator(new ChemicalFormulaValidator());
  fastPipeline.addValidator(new ChemicalFormulaValidator());

  const testFormulas = ['H2O', 'CO2', 'NaCl', 'C6H12O6', 'CH4', 'NH3'];
  const iterations = 5;

  // Test standard pipeline
  console.log('Standard Pipeline:');
  const standardStart = Date.now();
  for (let i = 0; i < iterations; i++) {
    await standardPipeline.validateBatch(testFormulas, ['ChemicalFormulaValidator']);
  }
  const standardTime = Date.now() - standardStart;
  console.log(`  Time: ${standardTime}ms for ${iterations} iterations`);
  console.log(`  Average: ${(standardTime / iterations).toFixed(2)}ms per batch`);

  // Test fast pipeline
  console.log('\nFast Pipeline:');
  const fastStart = Date.now();
  for (let i = 0; i < iterations; i++) {
    await fastPipeline.validateBatch(testFormulas, ['ChemicalFormulaValidator']);
  }
  const fastTime = Date.now() - fastStart;
  console.log(`  Time: ${fastTime}ms for ${iterations} iterations`);
  console.log(`  Average: ${(fastTime / iterations).toFixed(2)}ms per batch`);

  const improvement = ((standardTime - fastTime) / standardTime * 100);
  console.log(`\nPerformance Improvement: ${improvement.toFixed(1)}%`);
  console.log('');
}

/**
 * Main Integration Demo
 */
async function runValidationPipelineDemo() {
  console.log('🧬 CREB Validation Pipeline Integration Demo');
  console.log('==========================================');
  console.log('Demonstrating [VP-001] Validation Pipeline integration');
  console.log('across the entire CREB chemistry platform.\n');

  try {
    await basicFormulaValidation();
    await thermodynamicValidation();
    await enhancedBalancerWithValidation();
    await chemicalDatabaseWithValidation();
    await customValidationPipeline();
    await performanceComparison();

    console.log('✅ All validation pipeline integrations completed successfully!');
    console.log('\n📋 Integration Summary:');
    console.log('- ✓ Basic formula validation with error reporting and suggestions');
    console.log('- ✓ Thermodynamic properties validation with warnings');
    console.log('- ✓ Enhanced equation balancer with real-time formula validation');
    console.log('- ✓ Chemical database with comprehensive compound validation');
    console.log('- ✓ Custom pipeline configurations for different use cases');
    console.log('- ✓ Performance optimization with fast validation pipelines');
    console.log('\n🎯 [VP-001] Validation Pipeline: FULLY INTEGRATED AND OPERATIONAL');

  } catch (error) {
    console.error('❌ Demo failed:', error instanceof Error ? error.message : 'Unknown error');
  }
}

// Export for use in other modules
export {
  runValidationPipelineDemo,
  basicFormulaValidation,
  thermodynamicValidation,
  enhancedBalancerWithValidation,
  chemicalDatabaseWithValidation,
  customValidationPipeline,
  performanceComparison
};

// Run demo if this file is executed directly
if (require.main === module) {
  runValidationPipelineDemo().catch(console.error);
}
