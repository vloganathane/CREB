var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { EquationParser, getElementsInReaction } from './utils';
import { ComputationError } from './core/errors/CREBError';
import { Injectable } from './core/decorators/Injectable';
/**
 * Linear equation system generator and solver
 * Based on the Generator and FileMaker classes from the original CREB project
 */
export class LinearEquationSolver {
    constructor(chemicalEquation) {
        const parser = new EquationParser(chemicalEquation);
        this.equationData = parser.parse();
        this.allSpecies = [...this.equationData.reactants, ...this.equationData.products];
        this.elements = getElementsInReaction(this.equationData.parsedReactants, this.equationData.parsedProducts);
    }
    /**
     * Generates the system of linear equations representing the chemical balance
     */
    generateLinearSystem() {
        const equations = [];
        // Create one equation for each element
        for (const element of this.elements) {
            const coefficients = [];
            // For each species in the reaction
            for (const species of this.allSpecies) {
                let coefficient = 0;
                // Check if this species contains the current element
                if (this.equationData.reactants.includes(species)) {
                    // Reactants have positive coefficients
                    const elementCount = this.equationData.parsedReactants[species][element] || 0;
                    coefficient = elementCount;
                }
                else if (this.equationData.products.includes(species)) {
                    // Products have negative coefficients
                    const elementCount = this.equationData.parsedProducts[species][element] || 0;
                    coefficient = -elementCount;
                }
                coefficients.push(coefficient);
            }
            equations.push({
                coefficients,
                constant: 0 // All equations equal zero (balanced)
            });
        }
        return {
            equations,
            variables: this.allSpecies.map((_, i) => `x${i}`)
        };
    }
    /**
     * Solves the linear system to find coefficients
     */
    solve() {
        const system = this.generateLinearSystem();
        // For simple equations, try a brute force approach with small integer coefficients
        const maxCoeff = 10;
        const numSpecies = this.allSpecies.length;
        // Try different combinations of coefficients
        for (let attempt = 1; attempt <= maxCoeff; attempt++) {
            const coefficients = this.findCoefficients(system, attempt);
            if (coefficients) {
                return coefficients;
            }
        }
        throw new ComputationError('Unable to balance equation: Could not find integer coefficients', { maxCoeff, numSpecies, operation: 'equation_balancing' });
    }
    /**
     * Tries to find valid coefficients using a systematic approach
     */
    findCoefficients(system, maxVal) {
        const numSpecies = this.allSpecies.length;
        // Generate all possible combinations
        const generateCombinations = (length, max) => {
            const results = [];
            const generate = (current, remaining) => {
                if (remaining === 0) {
                    results.push([...current]);
                    return;
                }
                for (let i = 1; i <= max; i++) {
                    current.push(i);
                    generate(current, remaining - 1);
                    current.pop();
                }
            };
            generate([], length);
            return results;
        };
        const combinations = generateCombinations(numSpecies, maxVal);
        for (const coeffs of combinations) {
            if (this.checkBalance(system, coeffs)) {
                return coeffs;
            }
        }
        return null;
    }
    /**
     * Checks if given coefficients balance the equation
     */
    checkBalance(system, coefficients) {
        for (const equation of system.equations) {
            let sum = 0;
            for (let i = 0; i < coefficients.length; i++) {
                sum += equation.coefficients[i] * coefficients[i];
            }
            if (Math.abs(sum) > 1e-10) { // Allow for small floating point errors
                return false;
            }
        }
        return true;
    }
    /**
     * Normalizes coefficients to positive integers
     */
    normalizeCoefficients(coefficients) {
        // Convert to positive numbers
        const positiveCoeffs = coefficients.map(c => Math.abs(c));
        // Find a common denominator and convert to integers
        const precision = 1000; // For handling decimal coefficients
        const intCoeffs = positiveCoeffs.map(c => Math.round(c * precision));
        // Find GCD and simplify
        const gcd = this.findGCD(intCoeffs.filter(c => c !== 0));
        const simplified = intCoeffs.map(c => c / gcd);
        // Ensure all coefficients are at least 1
        const minCoeff = Math.min(...simplified.filter(c => c > 0));
        const scaled = simplified.map(c => Math.round(c / minCoeff));
        return scaled.map(c => c === 0 ? 1 : c);
    }
    /**
     * Finds the greatest common divisor of an array of numbers
     */
    findGCD(numbers) {
        const gcdTwo = (a, b) => {
            return b === 0 ? a : gcdTwo(b, a % b);
        };
        return numbers.reduce((acc, num) => gcdTwo(acc, Math.abs(num)));
    }
}
/**
 * Chemical equation balancer
 * Based on the main CREB functionality
 */
let ChemicalEquationBalancer = class ChemicalEquationBalancer {
    /**
     * Balances a chemical equation and returns the balanced equation string
     */
    balance(equation) {
        try {
            const solver = new LinearEquationSolver(equation);
            const coefficients = solver.solve();
            const parser = new EquationParser(equation);
            const { reactants, products } = parser.parse();
            return this.formatBalancedEquation(reactants, products, coefficients);
        }
        catch (error) {
            throw new ComputationError(`Failed to balance equation "${equation}": ${error}`, { equation, operation: 'equation_balancing', originalError: error });
        }
    }
    /**
     * Balances a chemical equation and returns detailed result
     */
    balanceDetailed(equation) {
        const solver = new LinearEquationSolver(equation);
        const coefficients = solver.solve();
        const parser = new EquationParser(equation);
        const { reactants, products } = parser.parse();
        return {
            equation: this.formatBalancedEquation(reactants, products, coefficients),
            coefficients,
            reactants,
            products
        };
    }
    formatBalancedEquation(reactants, products, coefficients) {
        const formatSide = (species, startIndex) => {
            return species.map((specie, index) => {
                const coeff = coefficients[startIndex + index];
                return coeff === 1 ? specie : `${coeff} ${specie}`;
            }).join(' + ');
        };
        const reactantSide = formatSide(reactants, 0);
        const productSide = formatSide(products, reactants.length);
        return `${reactantSide} = ${productSide}`;
    }
};
ChemicalEquationBalancer = __decorate([
    Injectable()
], ChemicalEquationBalancer);
export { ChemicalEquationBalancer };
//# sourceMappingURL=balancer.js.map