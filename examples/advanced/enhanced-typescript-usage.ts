/**
 * Enhanced TypeScript Usage Example for CREB-JS
 * Demonstrates how to use the new type-safe features
 */

import {
  // Core functionality
  ChemicalEquationBalancer,
  
  // Enhanced TypeScript Support
  ChemicalFormula,
  ElementSymbol,
  ValidElement,
  TypedElementCount,
  EnhancedBalancer,
  isChemicalFormula,
  isElementSymbol,
  parseFormula,
  createChemicalFormula,
  createElementSymbol,
  ChemicalFormulaError
} from '../src';

// ============================================================================
// Example 1: Type-Safe Formula Validation
// ============================================================================

function analyzeFormula(formulaInput: string) {
  console.log(`\nAnalyzing formula: ${formulaInput}`);
  
  // Type guard ensures runtime safety
  if (isChemicalFormula(formulaInput)) {
    // TypeScript now knows this is a ChemicalFormula
    const formula = createChemicalFormula(formulaInput);
    
    // Parse with type safety
    const composition = parseFormula(formula);
    console.log('Composition:', composition);
    
    // Calculate molecular weight with type safety
    const atomicWeights: Partial<Record<ValidElement, number>> = {
      'H': 1.008, 'C': 12.011, 'O': 15.999, 'N': 14.007,
      'Ca': 40.078, 'Cl': 35.453, 'Na': 22.990
    };
    
    let molecularWeight = 0;
    Object.entries(composition).forEach(([element, count]) => {
      if (isElementSymbol(element)) {
        const weight = atomicWeights[element as ValidElement];
        if (weight) {
          molecularWeight += weight * (count || 0);
        }
      }
    });
    
    console.log(`Molecular Weight: ${molecularWeight.toFixed(3)} g/mol`);
    return { valid: true, composition, molecularWeight };
  } else {
    console.log('❌ Invalid chemical formula');
    return { valid: false };
  }
}

// ============================================================================
// Example 2: Enhanced Chemical Equation Balancing
// ============================================================================

function enhancedEquationAnalysis(equation: string) {
  console.log(`\nEnhanced analysis of: ${equation}`);
  
  const enhancedBalancer = new EnhancedBalancer();
  const result = enhancedBalancer.balance(equation);
  
  console.log('Result:', {
    balanced: result.isBalanced,
    equation: result.equation,
    compoundCount: result.compounds.length
  });
  
  if (result.compounds.length > 0) {
    console.log('\nCompound Analysis:');
    result.compounds.forEach(compound => {
      console.log(`  ${compound.formula}:`);
      console.log(`    Molar Mass: ${compound.molarMass.toFixed(2)} g/mol`);
      console.log(`    Elements: [${compound.elements.join(', ')}]`);
    });
  }
  
  return result;
}

// ============================================================================
// Example 3: Type-Safe Error Handling
// ============================================================================

function safeFormulaCreation(input: string) {
  try {
    if (isChemicalFormula(input)) {
      const formula = createChemicalFormula(input);
      return { success: true, formula };
    } else {
      return { success: false, error: 'Invalid format' };
    }
  } catch (error) {
    if (error instanceof ChemicalFormulaError) {
      return { 
        success: false, 
        error: `Chemical formula error: ${error.reason}` 
      };
    }
    return { success: false, error: 'Unknown error' };
  }
}

// ============================================================================
// Example 4: Working with Element Constraints
// ============================================================================

function validateElements(elements: string[]): ElementSymbol[] {
  const validElements: ElementSymbol[] = [];
  
  elements.forEach(element => {
    if (isElementSymbol(element)) {
      // TypeScript knows this is now an ElementSymbol
      validElements.push(createElementSymbol(element));
      console.log(`✅ Valid element: ${element}`);
    } else {
      console.log(`❌ Invalid element: ${element}`);
    }
  });
  
  return validElements;
}

// ============================================================================
// Export examples for use in other files
// ============================================================================

export {
  analyzeFormula,
  enhancedEquationAnalysis,
  safeFormulaCreation,
  validateElements
};
