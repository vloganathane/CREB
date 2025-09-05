/**
 * Demo script for CREB-JS Thermodynamics features
 * Shows advanced thermodynamic calculations
 */

import { 
  ChemicalEquationBalancer, 
  ThermodynamicsCalculator, 
  ThermodynamicsResult 
} from '../src/index';

async function demonstrateThermodynamics() {
  console.log('🔥 CREB-JS Thermodynamics Demo\n');
  
  const balancer = new ChemicalEquationBalancer();
  const thermoCalc = new ThermodynamicsCalculator();

  // Example 1: Water formation (exothermic)
  console.log('💧 Example 1: Water Formation');
  console.log('=====================================');
  
  const waterEquation = 'H2 + O2 = H2O';
  const balancedWater = balancer.balanceDetailed(waterEquation);
  console.log(`Balanced: ${balancedWater.equation}`);
  
  try {
    const waterThermo = await thermoCalc.calculateThermodynamics(balancedWater);
    displayThermodynamicResults(waterThermo);
  } catch (error) {
    console.log(`Error: ${error.message}\n`);
  }

  // Example 2: Methane combustion (highly exothermic)
  console.log('🔥 Example 2: Methane Combustion');
  console.log('=====================================');
  
  const methaneEquation = 'CH4 + O2 = CO2 + H2O';
  const balancedMethane = balancer.balanceDetailed(methaneEquation);
  console.log(`Balanced: ${balancedMethane.equation}`);
  
  try {
    const methaneThermo = await thermoCalc.calculateThermodynamics(balancedMethane);
    displayThermodynamicResults(methaneThermo);
  } catch (error) {
    console.log(`Error: ${error.message}\n`);
  }

  // Example 3: Temperature dependence
  console.log('🌡️  Example 3: Temperature Effects');
  console.log('=====================================');
  
  try {
    // Calculate at different temperatures
    const conditions25C = { temperature: 298.15, pressure: 101325 };
    const conditions200C = { temperature: 473.15, pressure: 101325 };
    
    const thermo25 = await thermoCalc.calculateThermodynamics(balancedWater, conditions25C);
    const thermo200 = await thermoCalc.calculateThermodynamics(balancedWater, conditions200C);
    
    console.log('Water formation at 25°C:');
    console.log(`  ΔG = ${thermo25.deltaG.toFixed(2)} kJ/mol (${thermo25.spontaneity})`);
    
    console.log('Water formation at 200°C:');
    console.log(`  ΔG = ${thermo200.deltaG.toFixed(2)} kJ/mol (${thermo200.spontaneity})`);
    
    // Show temperature profile
    console.log('\nTemperature Profile (ΔG vs T):');
    const profile = thermo25.temperatureDependence;
    profile.deltaGvsT.slice(0, 5).forEach(point => {
      console.log(`  ${point.temperature}K: ΔG = ${point.deltaG.toFixed(2)} kJ/mol`);
    });
    console.log('  ...\n');
    
  } catch (error) {
    console.log(`Error: ${error.message}\n`);
  }

  // Example 4: Complex organic reaction
  console.log('⚗️  Example 4: Complex Reaction');
  console.log('=====================================');
  
  const glucoseEquation = 'C6H12O6 + O2 = CO2 + H2O';
  const balancedGlucose = balancer.balanceDetailed(glucoseEquation);
  console.log(`Balanced: ${balancedGlucose.equation}`);
  
  try {
    const glucoseThermo = await thermoCalc.calculateThermodynamics(balancedGlucose);
    displayThermodynamicResults(glucoseThermo);
  } catch (error) {
    console.log(`Error: ${error.message}\n`);
  }
}

function displayThermodynamicResults(result: ThermodynamicsResult) {
  console.log(`Thermodynamic Analysis:`);
  console.log(`  ΔH = ${result.deltaH.toFixed(2)} kJ/mol`);
  console.log(`  ΔS = ${result.deltaS.toFixed(4)} kJ/(mol·K)`);
  console.log(`  ΔG = ${result.deltaG.toFixed(2)} kJ/mol`);
  console.log(`  K = ${result.equilibriumConstant.toExponential(2)}`);
  console.log(`  Spontaneity: ${result.spontaneity}`);
  console.log(`  Temperature: ${result.conditions.temperature}K`);
  
  // Energy interpretation
  if (result.deltaH < 0) {
    console.log(`  🔥 Exothermic reaction (releases ${Math.abs(result.deltaH).toFixed(1)} kJ/mol)`);
  } else {
    console.log(`  ❄️  Endothermic reaction (requires ${result.deltaH.toFixed(1)} kJ/mol)`);
  }
  
  // Spontaneity interpretation
  if (result.spontaneity === 'spontaneous') {
    console.log(`  ✅ Reaction proceeds spontaneously`);
  } else if (result.spontaneity === 'non-spontaneous') {
    console.log(`  ❌ Reaction requires energy input`);
  } else {
    console.log(`  ⚖️  Reaction is at equilibrium`);
  }
  
  console.log('');
}

// Run the demo
if (require.main === module) {
  demonstrateThermodynamics().catch(console.error);
}

export { demonstrateThermodynamics };
