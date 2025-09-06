/**
 * Thermodynamics module for CREB-JS
 * Provides advanced thermodynamic calculations for chemical reactions
 */

export { ThermodynamicsCalculator } from './calculator';
export { ThermodynamicsEquationBalancer } from './thermodynamicsBalancer';
export { EnergyProfileGenerator, createEnergyProfile, exportEnergyProfile } from './energyProfile';
export * from './types';

// Re-export for convenience
import { ThermodynamicsCalculator } from './calculator';
import { ThermodynamicsEquationBalancer } from './thermodynamicsBalancer';
export default ThermodynamicsCalculator;
