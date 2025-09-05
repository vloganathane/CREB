/**
 * Simple demo for ThermodynamicsEquationBalancer
 * Showcases the revolutionary thermodynamics-integrated balancing
 */

import { ThermodynamicsEquationBalancer } from '../dist/index.esm.js';

async function thermodynamicsBalancerDemo() {
    console.log('🌡️ CREB-JS Thermodynamics-Integrated Balancer Demo\n');
    
    const balancer = new ThermodynamicsEquationBalancer();

    try {
        // Demo 1: Simple combustion reaction
        console.log('🔥 Demo 1: Methane Combustion Analysis');
        console.log('==================================');
        const combustion = 'CH4 + O2 = CO2 + H2O';
        const combustionResult = await balancer.balanceWithThermodynamics(combustion);
        
        console.log(`Balanced: ${combustionResult.balanced}`);
        console.log(`Reaction Type: ${combustionResult.reactionType}`);
        console.log(`Feasibility: ${combustionResult.feasibility}`);
        console.log(`Safety Level: ${combustionResult.safetyLevel}`);
        console.log(`Spontaneous: ${combustionResult.spontaneous}`);
        console.log(`Energy Released: ${combustionResult.energyReleased || 'N/A'} kJ/mol`);
        console.log(`Equilibrium Constant: ${combustionResult.equilibriumConstant.toExponential(2)}`);
        console.log(`Industrial Applications: ${combustionResult.industrialApplications.join(', ')}`);
        console.log('');

        // Demo 2: Simple synthesis
        console.log('⚗️ Demo 2: Synthesis Analysis');
        console.log('============================');
        const synthesis = 'Na + Cl2 = NaCl';
        const synthesisResult = await balancer.balanceWithThermodynamics(synthesis);
        
        console.log(`Balanced: ${synthesisResult.balanced}`);
        console.log(`Reaction Type: ${synthesisResult.reactionType}`);
        console.log(`Feasibility: ${synthesisResult.feasibility}`);
        console.log(`Safety Level: ${synthesisResult.safetyLevel}`);
        console.log(`Pressure Effects: ${synthesisResult.pressureEffects}`);
        console.log('');

        console.log('✨ The ThermodynamicsEquationBalancer provides comprehensive chemical analysis!');
        console.log('   Revolutionary chemistry tool combining balancing with advanced thermodynamic insights.');
        
    } catch (error) {
        console.error('Error running demo:', error.message);
    }
}

// Run the demo
thermodynamicsBalancerDemo().catch(console.error);
