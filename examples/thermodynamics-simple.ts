/**
 * Simple example of using CREB-JS Thermodynamics
 */

import { ChemicalEquationBalancer, ThermodynamicsCalculator } from '../src/index';

async function example() {
  // Balance a chemical equation
  const balancer = new ChemicalEquationBalancer();
  const balanced = balancer.balanceDetailed('H2 + O2 = H2O');
  console.log(balanced.equation); // "2 H2 + O2 = 2 H2O"

  // Calculate thermodynamic properties
  const thermoCalc = new ThermodynamicsCalculator();
  const result = await thermoCalc.calculateThermodynamics(balanced);
  
  console.log(`ΔH = ${result.deltaH.toFixed(2)} kJ/mol`);
  console.log(`ΔG = ${result.deltaG.toFixed(2)} kJ/mol`);
  console.log(`Spontaneity: ${result.spontaneity}`);
  console.log(`Equilibrium constant: ${result.equilibriumConstant.toExponential(2)}`);
}

example().catch(console.error);
