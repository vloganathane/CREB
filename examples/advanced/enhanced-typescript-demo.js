/**
 * Enhanced TypeScript Support Demo for CREB-JS
 * Demonstrates advanced type safety, branded types, and superior IntelliSense
 */
import { isChemicalFormula, isElementSymbol, parseFormula, createChemicalFormula, createElementSymbol, ChemicalFormulaError } from '../../src/advancedTypes';
import { EnhancedBalancer } from '../../src/enhancedBalancerSimple';
import { ChemicalEquationBalancer } from '../../src/balancer';
// ============================================================================
// Demo: Branded Types for Compile-Time Safety
// ============================================================================
console.log('🚀 Enhanced TypeScript Support Demo for CREB-JS\n');
console.log('1. Branded Types for Enhanced Type Safety:');
console.log('=========================================');
// Type guards ensure runtime validation
const testFormulas = ['H2O', 'CO2', 'Ca(OH)2', 'invalid', 'C6H12O6'];
testFormulas.forEach(formula => {
    if (isChemicalFormula(formula)) {
        // TypeScript now knows this is a ChemicalFormula brand
        console.log(`✅ Valid formula: ${formula}`);
        try {
            const elements = parseFormula(formula);
            console.log(`   Elements:`, elements);
        }
        catch (error) {
            console.log(`   Parse error: ${error}`);
        }
    }
    else {
        console.log(`❌ Invalid formula: ${formula}`);
    }
});
// ============================================================================
// Demo: Generic Constraints for Elements
// ============================================================================
console.log('\n2. Generic Constraints for Valid Elements:');
console.log('=========================================');
const testElements = ['H', 'O', 'C', 'InvalidElement', 'Ca', 'Cl'];
testElements.forEach(element => {
    if (isElementSymbol(element)) {
        console.log(`✅ Valid element: ${element}`);
        // TypeScript knows this is an ElementSymbol
        const typedElement = createElementSymbol(element);
        console.log(`   Created typed element: ${typedElement}`);
    }
    else {
        console.log(`❌ Invalid element: ${element}`);
    }
});
// ============================================================================
// Demo: Type-Safe Chemical Data Structures
// ============================================================================
console.log('\n3. Type-Safe Chemical Data Structures:');
console.log('=====================================');
// Create type-safe compounds
const validFormulas = ['H2O', 'CO2', 'CH4', 'C6H12O6'];
validFormulas.forEach(formulaStr => {
    if (isChemicalFormula(formulaStr)) {
        const formula = createChemicalFormula(formulaStr);
        console.log(`\nAnalyzing ${formula}:`);
        const composition = parseFormula(formula);
        console.log(`Composition:`, composition);
        // Calculate molecular weight
        const atomicWeights = {
            'H': 1.008, 'C': 12.011, 'O': 15.999
        };
        let molecularWeight = 0;
        Object.entries(composition).forEach(([element, count]) => {
            if (atomicWeights[element]) {
                molecularWeight += atomicWeights[element] * (count || 0);
            }
        });
        console.log(`Molecular Weight: ${molecularWeight.toFixed(3)} g/mol`);
    }
});
// ============================================================================
// Demo: Enhanced Balancer with Type Safety
// ============================================================================
console.log('\n4. Enhanced Balancer with Type Safety:');
console.log('=====================================');
const enhancedBalancer = new EnhancedBalancer();
const regularBalancer = new ChemicalEquationBalancer();
const testEquations = [
    'H2 + O2 → H2O',
    'CH4 + O2 → CO2 + H2O',
    'NaCl + AgNO3 → AgCl + NaNO3'
];
testEquations.forEach(equation => {
    console.log(`\nTesting equation: ${equation}`);
    try {
        // Use regular balancer for comparison
        const regularResult = regularBalancer.balance(equation);
        console.log(`Regular balancer: ${regularResult}`);
        // Use enhanced balancer
        const enhancedResult = enhancedBalancer.balance(equation);
        console.log(`Enhanced result:`, {
            equation: enhancedResult.equation,
            isBalanced: enhancedResult.isBalanced,
            compounds: enhancedResult.compounds.length
        });
        // Show compound analysis if available
        if (enhancedResult.compounds.length > 0) {
            console.log('Compound Analysis:');
            enhancedResult.compounds.forEach(compound => {
                console.log(`  ${compound.formula}: ${compound.molarMass.toFixed(2)} g/mol, elements: [${compound.elements.join(', ')}]`);
            });
        }
    }
    catch (error) {
        console.log(`Error: ${error}`);
    }
});
// ============================================================================
// Demo: Error Handling with Type Safety
// ============================================================================
console.log('\n5. Type-Safe Error Handling:');
console.log('===========================');
try {
    // This will throw a ChemicalFormulaError
    const invalidFormula = createChemicalFormula('invalid');
}
catch (error) {
    if (error instanceof ChemicalFormulaError) {
        console.log(`✅ Caught ChemicalFormulaError: ${error.message}`);
        console.log(`   Formula: ${error.formula}, Reason: ${error.reason}`);
    }
}
try {
    // This will throw a standard error
    const invalidElement = createElementSymbol('InvalidElement');
}
catch (error) {
    console.log(`✅ Caught Error: ${error}`);
}
// ============================================================================
// Demo: Template Literal Types and Auto-completion
// ============================================================================
console.log('\n6. IntelliSense and Developer Experience:');
console.log('========================================');
console.log('✅ Enhanced IntelliSense features:');
console.log('   - Branded types prevent accidental string assignment');
console.log('   - Type guards provide runtime validation');
console.log('   - Generic constraints ensure only valid elements');
console.log('   - Auto-completion for chemical formulas');
console.log('   - Type-safe error handling');
console.log('   - Comprehensive compound analysis');
// ============================================================================
// Summary of Enhanced TypeScript Features
// ============================================================================
console.log('\n🎉 Enhanced TypeScript Support Summary:');
console.log('======================================');
console.log('✅ Branded types for ChemicalFormula and ElementSymbol');
console.log('✅ Generic constraints for ValidElement types');
console.log('✅ Type guards with runtime validation');
console.log('✅ Type-safe chemical data structures');
console.log('✅ Enhanced error types with detailed information');
console.log('✅ Superior IntelliSense and auto-completion');
console.log('✅ Compile-time type safety for chemical operations');
console.log('✅ Template literal types for formula validation');
console.log('✅ Advanced type-safe compound analysis');
console.log('✅ Integration with existing CREB-JS API');
export default 'Enhanced TypeScript Support Demo Complete!';
//# sourceMappingURL=enhanced-typescript-demo.js.map