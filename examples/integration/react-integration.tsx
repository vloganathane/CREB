/**
 * Integration tests and examples for React hooks package
 */

import React from 'react';
import { render } from '@testing-library/react';
import { useEquationBalancer, useThermodynamics, useMolecularWeight } from '../packages/react';

// Example React component using CREB hooks
export const ChemistryCalculator: React.FC = () => {
  const { balance, result: balanceResult, loading: balanceLoading } = useEquationBalancer();
  const { calculate, result: thermoResult } = useThermodynamics();
  const { calculateWeight, weight } = useMolecularWeight();

  const handleBalance = async () => {
    await balance('H2 + O2 -> H2O');
  };

  const handleThermo = async () => {
    await calculate({
      deltaH: -285.8,
      deltaS: -163.2,
      temperature: 298.15
    });
  };

  const handleWeight = async () => {
    await calculateWeight('H2O');
  };

  return (
    <div className="chemistry-calculator">
      <h2>Chemistry Calculator</h2>
      
      <section>
        <h3>Equation Balancer</h3>
        <button onClick={handleBalance} disabled={balanceLoading}>
          Balance H2 + O2 → H2O
        </button>
        {balanceResult && (
          <div>
            <p>Balanced: {balanceResult.balanced}</p>
            <p>Coefficients: {balanceResult.coefficients.join(', ')}</p>
          </div>
        )}
      </section>

      <section>
        <h3>Thermodynamics</h3>
        <button onClick={handleThermo}>
          Calculate Gibbs Free Energy
        </button>
        {thermoResult && (
          <div>
            <p>ΔG: {thermoResult.deltaG} kJ/mol</p>
            <p>Spontaneous: {thermoResult.spontaneous ? 'Yes' : 'No'}</p>
          </div>
        )}
      </section>

      <section>
        <h3>Molecular Weight</h3>
        <button onClick={handleWeight}>
          Calculate Weight of H2O
        </button>
        {weight && <p>Molecular Weight: {weight} g/mol</p>}
      </section>
    </div>
  );
};

// Integration test for React hooks
describe('React Hooks Integration', () => {
  test('ChemistryCalculator renders without errors', () => {
    render(<ChemistryCalculator />);
  });
});

export default ChemistryCalculator;
