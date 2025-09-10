import { LinearSystem, BalancedEquation } from './types';
/**
 * Linear equation system generator and solver
 * Based on the Generator and FileMaker classes from the original CREB project
 */
export declare class LinearEquationSolver {
    private equationData;
    private allSpecies;
    private elements;
    constructor(chemicalEquation: string);
    /**
     * Generates the system of linear equations representing the chemical balance
     */
    generateLinearSystem(): LinearSystem;
    /**
     * Solves the linear system to find coefficients
     */
    solve(): number[];
    /**
     * Tries to find valid coefficients using a systematic approach
     */
    private findCoefficients;
    /**
     * Checks if given coefficients balance the equation
     */
    private checkBalance;
    /**
     * Normalizes coefficients to positive integers
     */
    private normalizeCoefficients;
    /**
     * Finds the greatest common divisor of an array of numbers
     */
    private findGCD;
}
/**
 * Chemical equation balancer
 * Based on the main CREB functionality
 */
export declare class ChemicalEquationBalancer {
    /**
     * Balances a chemical equation and returns the balanced equation string
     */
    balance(equation: string): string;
    /**
     * Balances a chemical equation and returns detailed result
     */
    balanceDetailed(equation: string): BalancedEquation;
    private formatBalancedEquation;
}
//# sourceMappingURL=balancer.d.ts.map