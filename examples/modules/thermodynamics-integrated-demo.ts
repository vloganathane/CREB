/**
 * Demo for ThermodynamicsEquationBalancer
 * Showcases the revolutionary thermodynamics-integrated balancing
 */

import { ThermodynamicsEquationBalancer } from '../src/thermodynamics/thermodynamicsBalancer';

async function thermodynamicsBalancerDemo() {
    console.log('🌡️ CREB-JS Thermodynamics-Integrated Balancer Demo\n');
    
    const balancer = new ThermodynamicsEquationBalancer();

    // Demo 1: Combustion reaction
    console.log('🔥 Demo 1: Ethane Combustion Analysis');
    console.log('===================================');
    const combustion = 'C2H6 + O2 = CO2 + H2O';
    const combustionResult = await balancer.balanceWithThermodynamics(combustion);
    
    console.log(`Balanced: ${combustionResult.balanced}`);
    console.log(`Reaction Type: ${combustionResult.reactionType}`);
    console.log(`Feasibility: ${combustionResult.feasibility}`);
    console.log(`Safety Level: ${combustionResult.safetyLevel}`);
    console.log(`Spontaneous: ${combustionResult.spontaneous}`);
    console.log(`Energy Released: ${combustionResult.energyReleased} kJ/mol`);
    console.log(`Safety Warnings: ${combustionResult.safetyWarnings.join(', ')}`);
    console.log(`Industrial Applications: ${combustionResult.industrialApplications.join(', ')}`);
    console.log('');

    // Demo 2: Synthesis reaction with optimal conditions
    console.log('⚗️ Demo 2: Ammonia Synthesis (Haber Process)');
    console.log('===========================================');
    const synthesis = 'N2 + H2 = NH3';
    const synthesisResult = await balancer.balanceWithThermodynamics(synthesis);
    const optimalConditions = await balancer.findOptimalConditions(synthesis);
    
    console.log(`Balanced: ${synthesisResult.balanced}`);
    console.log(`Reaction Type: ${synthesisResult.reactionType}`);
    console.log(`Equilibrium Constant: ${synthesisResult.equilibriumConstant.toExponential(2)}`);
    console.log(`Pressure Effects: ${synthesisResult.pressureEffects}`);
    console.log(`Optimal Temperature: ${optimalConditions.temperature}K`);
    console.log(`Optimal Pressure: ${optimalConditions.pressure} atm`);
    console.log(`Expected Yield: ${optimalConditions.yield}%`);
    console.log(`Optimization Reasoning: ${optimalConditions.reasoning.join('; ')}`);
    console.log('');

    // Demo 3: Biological reaction
    console.log('🧬 Demo 3: Glucose Combustion (Cellular Respiration)');
    console.log('==================================================');
    const biological = 'C6H12O6 + O2 = CO2 + H2O';
    const biologicalResult = await balancer.balanceWithThermodynamics(biological);
    
    console.log(`Balanced: ${biologicalResult.balanced}`);
    console.log(`Reaction Type: ${biologicalResult.reactionType}`);
    console.log(`Energy Released: ${biologicalResult.energyReleased} kJ/mol`);
    console.log(`Real-world Examples: ${biologicalResult.realWorldExamples.join(', ')}`);
    console.log(`Industrial Applications: ${biologicalResult.industrialApplications.join(', ')}`);
    console.log('');

    // Demo 4: Decomposition reaction
    console.log('💥 Demo 4: Calcium Carbonate Decomposition');
    console.log('==========================================');
    const decomposition = 'CaCO3 = CaO + CO2';
    const decompositionResult = await balancer.balanceWithThermodynamics(decomposition);
    
    console.log(`Balanced: ${decompositionResult.balanced}`);
    console.log(`Reaction Type: ${decompositionResult.reactionType}`);
    console.log(`Energy Required: ${decompositionResult.energyRequired} kJ/mol`);
    console.log(`Temperature Range: ${decompositionResult.temperatureRange.min}-${decompositionResult.temperatureRange.max}K`);
    console.log(`Recommendations: ${decompositionResult.recommendations.join('; ')}`);
    console.log('');

    console.log('✨ The ThermodynamicsEquationBalancer provides comprehensive chemical analysis!');
    console.log('   Combines traditional balancing with advanced thermodynamic insights.');
}

// Run the demo
thermodynamicsBalancerDemo().catch(console.error);
