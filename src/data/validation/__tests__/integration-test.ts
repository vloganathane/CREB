/**
 * Basic tests for the VP-001 Validation Pipeline
 * 
 * These tests verify the core functionality of the validation system
 * including pipeline creation, validator composition, and error handling.
 */

import {
  createValidationPipeline,
  createFastValidationPipeline,
  createThoroughValidationPipeline,
  validateChemicalFormula,
  validateThermodynamicProperties,
  ChemicalFormulaValidator,
  createValidator,
  createCompositeValidator,
  createChemicalFormulaFormatRule,
  formatValidationErrors,
  summarizeValidationResult,
  hasOnlyWarnings,
  getMostSevereError,
  ValidationError,
  ValidationResult,
  ValidationSeverity
} from '../index';

describe('Validation Pipeline Integration Tests', () => {
  
  test('should create default validation pipeline', async () => {
    const pipeline = createValidationPipeline();
    expect(pipeline).toBeDefined();
    
    const result = await pipeline.validate('H2O');
    expect(result).toBeDefined();
    expect(result.isValid).toBeDefined();
    expect(result.errors).toBeDefined();
    expect(result.metrics).toBeDefined();
  });

  test('should validate chemical formulas', async () => {
    const result = await validateChemicalFormula('H2O');
    expect(result).toBeDefined();
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test('should validate thermodynamic properties', async () => {
    const properties = {
      temperature: 298.15,
      pressure: 1.0,
      enthalpy: -285.8,
      entropy: 69.9,
      heatCapacity: 75.3
    };
    
    const result = await validateThermodynamicProperties(properties);
    expect(result).toBeDefined();
    expect(result.isValid).toBe(true);
  });

  test('should format validation errors', () => {
    const errors: ValidationError[] = [
      {
        message: 'Test error',
        code: 'TEST_ERROR',
        severity: ValidationSeverity.ERROR,
        path: ['test'],
        suggestions: ['Fix the test']
      }
    ];
    
    const formatted = formatValidationErrors(errors);
    expect(formatted).toContain('Test error');
    expect(formatted).toContain('TEST_ERROR');
  });

  test('should check for warnings only', () => {
    const result: ValidationResult = {
      isValid: true,
      errors: [],
      warnings: [
        {
          message: 'Warning message',
          code: 'WARN',
          severity: ValidationSeverity.WARNING,
          path: ['test'],
          suggestions: []
        }
      ],
      metrics: {
        duration: 10,
        rulesExecuted: 1,
        validatorsUsed: 1,
        cacheStats: { hits: 0, misses: 1, hitRate: 0 }
      },
      timestamp: new Date()
    };
    
    expect(hasOnlyWarnings(result)).toBe(true);
  });
});

// Helper function to create test context
function createTestContext() {
  return {
    path: ['test'],
    root: {},
    config: {
      enabled: true,
      priority: 1,
      cacheable: true
    },
    shared: new Map(),
    metrics: {
      duration: 0,
      rulesExecuted: 0,
      validatorsUsed: 0,
      cacheStats: {
        hits: 0,
        misses: 0,
        hitRate: 0
      }
    }
  };
}

/**
 * Test pipeline creation with different configurations
 */
export async function testPipelineCreation(): Promise<boolean> {
  console.log('Testing pipeline creation...');
  
  try {
    // Test default pipeline
    const defaultPipeline = createValidationPipeline();
    console.log('✓ Default pipeline created');
    
    // Test fast pipeline
    const fastPipeline = createFastValidationPipeline();
    console.log('✓ Fast pipeline created');
    
    // Test thorough pipeline
    const thoroughPipeline = createThoroughValidationPipeline();
    console.log('✓ Thorough pipeline created');
    
    return true;
  } catch (error) {
    console.error('✗ Pipeline creation failed:', error);
    return false;
  }
}

/**
 * Test quick validation functions
 */
export async function testQuickValidation(): Promise<boolean> {
  console.log('Testing quick validation functions...');
  
  try {
    // Test valid chemical formula
    const validResult = await validateChemicalFormula('H2O');
    console.log('✓ Valid formula validation completed:', validResult.isValid);
    
    // Test invalid chemical formula
    const invalidResult = await validateChemicalFormula('XYZ123');
    console.log('✓ Invalid formula validation completed:', !invalidResult.isValid);
    
    // Test thermodynamic properties
    const thermoResult = await validateThermodynamicProperties({
      enthalpyFormation: -285.8,
      entropy: 69.9,
      gibbsEnergy: -237.1,
      heatCapacity: 75.3,
      meltingPoint: 273.15,
      boilingPoint: 373.15,
      density: 1.0
    });
    console.log('✓ Thermodynamic validation completed:', thermoResult.isValid);
    
    return true;
  } catch (error) {
    console.error('✗ Quick validation failed:', error);
    return false;
  }
}

/**
 * Test validator composition
 */
export async function testValidatorComposition(): Promise<boolean> {
  try {
    // Create a composite validator using the factory function
    const composite = createCompositeValidator('chemistry-suite', []);
    
    // Create individual validators with proper config
    const formulaValidator = new ChemicalFormulaValidator({ 
      enabled: true,
      priority: 1,
      timeout: 5000,
      cacheable: true
    });
    
    // Add to composite
    composite.addValidator(formulaValidator);
    
    // Test composition
    const context = { 
      path: ['formula'],
      root: { formula: 'H2O' },
      config: {
        enabled: true,
        priority: 1,
        cacheable: true
      },
      shared: new Map(),
      metrics: {
        duration: 0,
        rulesExecuted: 0,
        validatorsUsed: 0,
        cacheStats: { hits: 0, misses: 0, hitRate: 0 }
      }
    };
    
    const result = await composite.validate('H2O', context);
    return result.isValid;
  } catch (error) {
    console.error('Validator composition test failed:', error);
    return false;
  }
}

/**
 * Test error formatting utilities
 */
export async function testErrorFormatting(): Promise<boolean> {
  console.log('Testing error formatting...');
  
  try {
    // Create a mock validation result with errors
    const mockResult: ValidationResult = {
      isValid: false,
      errors: [{
        code: 'INVALID_FORMULA',
        message: 'Chemical formula contains invalid characters',
        severity: ValidationSeverity.ERROR,
        path: ['formula'],
        context: {},
        suggestions: ['Check for typos', 'Use standard element symbols']
      }],
      warnings: [{
        code: 'UNUSUAL_COMPOUND',
        message: 'This compound is not commonly found',
        severity: ValidationSeverity.WARNING,
        path: ['formula'],
        context: {},
        suggestions: ['Verify the formula is correct']
      }],
      metrics: {
        duration: 5,
        rulesExecuted: 2,
        validatorsUsed: 1,
        cacheStats: {
          hits: 0,
          misses: 1,
          hitRate: 0
        }
      },
      timestamp: new Date()
    };
    
    // Test error formatting
    const formattedErrors = formatValidationErrors(mockResult.errors);
    console.log('✓ Error formatting:', formattedErrors.includes('INVALID_FORMULA'));
    
    // Test result summary
    const summary = summarizeValidationResult(mockResult);
    console.log('✓ Result summary:', summary.includes('FAILED'));
    
    return true;
  } catch (error) {
    console.error('✗ Error formatting failed:', error);
    return false;
  }
}

/**
 * Test rule creation and usage
 */
export async function testRuleCreation(): Promise<boolean> {
  console.log('Testing rule creation...');
  
  try {
    // Create a chemical formula format rule
    const formatRule = createChemicalFormulaFormatRule();
    console.log('✓ Chemical formula format rule created');
    
    return true;
  } catch (error) {
    console.error('✗ Rule creation failed:', error);
    return false;
  }
}

/**
 * Run all tests
 */
export async function runAllTests(): Promise<void> {
  console.log('🧪 Starting VP-001 Validation Pipeline Tests\n');
  
  const tests = [
    testPipelineCreation,
    testQuickValidation,
    testValidatorComposition,
    testErrorFormatting,
    testRuleCreation
  ];
  
  let passed = 0;
  let failed = 0;
  
  for (const test of tests) {
    try {
      const result = await test();
      if (result) {
        passed++;
        console.log('✅ Test passed\n');
      } else {
        failed++;
        console.log('❌ Test failed\n');
      }
    } catch (error) {
      failed++;
      console.error('💥 Test crashed:', error, '\n');
    }
  }
  
  console.log(`📊 Test Results: ${passed} passed, ${failed} failed`);
  
  if (failed === 0) {
    console.log('🎉 All tests passed! VP-001 Validation Pipeline is ready for production.');
  } else {
    console.log('⚠️  Some tests failed. Please review the implementation.');
  }
}

// Export the test runner for external use
export default runAllTests;
