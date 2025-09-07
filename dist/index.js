'use strict';

require('reflect-metadata');
var events = require('events');
var fs = require('fs');

function _interopNamespaceDefault(e) {
    var n = Object.create(null);
    if (e) {
        Object.keys(e).forEach(function (k) {
            if (k !== 'default') {
                var d = Object.getOwnPropertyDescriptor(e, k);
                Object.defineProperty(n, k, d.get ? d : {
                    enumerable: true,
                    get: function () { return e[k]; }
                });
            }
        });
    }
    n.default = e;
    return Object.freeze(n);
}

var fs__namespace = /*#__PURE__*/_interopNamespaceDefault(fs);

/**
 * Chemical elements and their atomic masses
 * Data from the original CREB project's Assets.py
 */
const ELEMENTS_LIST = [
    'H', 'He', 'Li', 'Be', 'B', 'C', 'N', 'O', 'F', 'Ne',
    'Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl', 'Ar', 'K', 'Ca',
    'Sc', 'Ti', 'V', 'Cr', 'Mn', 'Fe', 'Co', 'Ni', 'Cu', 'Zn',
    'Ga', 'Ge', 'As', 'Se', 'Br', 'Kr', 'Rb', 'Sr', 'Y', 'Zr',
    'Nb', 'Mo', 'Tc', 'Ru', 'Rh', 'Pd', 'Ag', 'Cd', 'In', 'Sn',
    'Sb', 'Te', 'I', 'Xe', 'Cs', 'Ba', 'La', 'Ce', 'Pr', 'Nd',
    'Pm', 'Sm', 'Eu', 'Gd', 'Tb', 'Dy', 'Ho', 'Er', 'Tm', 'Yb',
    'Lu', 'Hf', 'Ta', 'W', 'Re', 'Os', 'Ir', 'Pt', 'Au', 'Hg',
    'Tl', 'Pb', 'Bi', 'Po', 'At', 'Rn', 'Fr', 'Ra', 'Ac', 'Th',
    'Pa', 'U', 'Np', 'Pu', 'Am', 'Cm', 'Bk', 'Cf', 'Es', 'Fm',
    'Md', 'No', 'Lr', 'Rf', 'Db', 'Sg', 'Bh', 'Hs', 'Mt', 'Ds',
    'Rg', 'Cn', 'Nh', 'Fl', 'Mc', 'Lv', 'Ts', 'Og'
];
const PERIODIC_TABLE = {
    'H': 1.008,
    'He': 4.0026,
    'Li': 6.94,
    'Be': 9.0122,
    'B': 10.81,
    'C': 12.011,
    'N': 14.007,
    'O': 15.999,
    'F': 18.998,
    'Ne': 20.18,
    'Na': 22.99,
    'Mg': 24.305,
    'Al': 26.982,
    'Si': 28.085,
    'P': 30.974,
    'S': 32.06,
    'Cl': 35.45,
    'Ar': 39.948,
    'K': 39.098,
    'Ca': 40.078,
    'Sc': 44.956,
    'Ti': 47.867,
    'V': 50.942,
    'Cr': 51.996,
    'Mn': 54.938,
    'Fe': 55.845,
    'Co': 58.933,
    'Ni': 58.693,
    'Cu': 63.546,
    'Zn': 65.38,
    'Ga': 69.723,
    'Ge': 72.63,
    'As': 74.922,
    'Se': 78.971,
    'Br': 79.904,
    'Kr': 83.798,
    'Rb': 85.468,
    'Sr': 87.62,
    'Y': 88.906,
    'Zr': 91.224,
    'Nb': 92.906,
    'Mo': 95.95,
    'Tc': 98.0,
    'Ru': 101.07,
    'Rh': 102.91,
    'Pd': 106.42,
    'Ag': 107.87,
    'Cd': 112.41,
    'In': 114.82,
    'Sn': 118.71,
    'Sb': 121.76,
    'Te': 127.6,
    'I': 126.9,
    'Xe': 131.29,
    'Cs': 132.91,
    'Ba': 137.33,
    'La': 138.91,
    'Ce': 140.12,
    'Pr': 140.91,
    'Nd': 144.24,
    'Pm': 145.0,
    'Sm': 150.36,
    'Eu': 151.96,
    'Gd': 157.25,
    'Tb': 158.93,
    'Dy': 162.5,
    'Ho': 164.93,
    'Er': 167.26,
    'Tm': 168.93,
    'Yb': 173.04,
    'Lu': 175.0,
    'Hf': 178.49,
    'Ta': 180.95,
    'W': 183.84,
    'Re': 186.21,
    'Os': 190.23,
    'Ir': 192.22,
    'Pt': 195.08,
    'Au': 196.97,
    'Hg': 200.59,
    'Tl': 204.38,
    'Pb': 207.2,
    'Bi': 208.98,
    'Po': 209.0,
    'At': 210.0,
    'Rn': 222.0,
    'Fr': 223.0,
    'Ra': 226.0,
    'Ac': 227.0,
    'Th': 232.04,
    'Pa': 231.04,
    'U': 238.03,
    'Np': 237.0,
    'Pu': 244.0,
    'Am': 243.0,
    'Cm': 247.0,
    'Bk': 247.0,
    'Cf': 251.0,
    'Es': 252.0,
    'Fm': 257.0,
    'Md': 258.0,
    'No': 259.0,
    'Lr': 262.0,
    'Rf': 267.0,
    'Db': 270.0,
    'Sg': 271.0,
    'Bh': 270.0,
    'Hs': 277.0,
    'Mt': 276.0,
    'Ds': 281.0,
    'Rg': 282.0,
    'Cn': 285.0,
    'Nh': 286.0,
    'Fl': 289.0,
    'Mc': 290.0,
    'Lv': 293.0,
    'Ts': 294.0,
    'Og': 294.0
};
const PARAMETER_SYMBOLS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

/**
 * Utility functions for chemical formula parsing and calculations
 */
/**
 * Counts elements in a chemical formula
 * Based on the ElementCounter class from the original CREB project
 */
class ElementCounter {
    constructor(chemicalFormula) {
        this.formula = chemicalFormula;
    }
    /**
     * Parses the chemical formula and returns element counts
     * Handles parentheses and multipliers
     */
    parseFormula() {
        let formula = this.formula;
        // Expand parentheses
        while (formula.includes('(')) {
            formula = formula.replace(/\(([^()]+)\)(\d*)/g, (match, group, multiplier) => {
                const mult = multiplier ? parseInt(multiplier) : 1;
                return this.expandGroup(group, mult);
            });
        }
        // Count elements
        const elementCounts = {};
        const matches = formula.match(/([A-Z][a-z]*)(\d*)/g) || [];
        for (const match of matches) {
            const elementMatch = match.match(/([A-Z][a-z]*)(\d*)/);
            if (elementMatch) {
                const element = elementMatch[1];
                const count = elementMatch[2] ? parseInt(elementMatch[2]) : 1;
                elementCounts[element] = (elementCounts[element] || 0) + count;
            }
        }
        return elementCounts;
    }
    expandGroup(group, multiplier) {
        const matches = group.match(/([A-Z][a-z]*)(\d*)/g) || [];
        let expanded = '';
        for (const match of matches) {
            const elementMatch = match.match(/([A-Z][a-z]*)(\d*)/);
            if (elementMatch) {
                const element = elementMatch[1];
                const count = elementMatch[2] ? parseInt(elementMatch[2]) : 1;
                const newCount = count * multiplier;
                expanded += element + (newCount > 1 ? newCount : '');
            }
        }
        return expanded;
    }
}
/**
 * Parses a chemical equation into reactants and products
 * Based on the EquationParser class from the original CREB project
 */
class EquationParser {
    constructor(chemicalEquation) {
        this.equationSplitter = '=';
        this.speciesSplitter = '+';
        this.equation = chemicalEquation.replace(/\s/g, ''); // Remove all spaces
    }
    /**
     * Parses the equation and returns structured data
     */
    parse() {
        const { reactants, products } = this.splitIntoSpecies();
        const parsedReactants = this.parseSpecies(reactants);
        const parsedProducts = this.parseSpecies(products);
        return {
            reactants,
            products,
            parsedReactants,
            parsedProducts
        };
    }
    splitIntoSpecies() {
        // Check if equation is empty or only whitespace
        if (!this.equation || this.equation.length === 0) {
            throw new Error('Empty equation provided. Please enter a valid chemical equation.');
        }
        const sides = this.equation.split(this.equationSplitter);
        if (sides.length !== 2) {
            throw new Error('Invalid equation format. Must contain exactly one "=" sign.');
        }
        // Check if either side is empty
        if (!sides[0].trim() || !sides[1].trim()) {
            throw new Error('Both sides of the equation must contain chemical species.');
        }
        const cleanSpecies = (speciesString) => {
            return speciesString.split(this.speciesSplitter)
                .map(species => species.trim())
                .filter(species => species.length > 0)
                .map(species => {
                // Remove existing coefficients (numbers at the beginning)
                return species.replace(/^\d+\s*/, '');
            });
        };
        const reactants = cleanSpecies(sides[0]);
        const products = cleanSpecies(sides[1]);
        return { reactants, products };
    }
    parseSpecies(species) {
        const parsed = {};
        for (const specie of species) {
            const counter = new ElementCounter(specie);
            parsed[specie] = counter.parseFormula();
        }
        return parsed;
    }
}
/**
 * Calculates molar weight of a chemical formula
 */
function calculateMolarWeight(formula) {
    const counter = new ElementCounter(formula);
    const elementCounts = counter.parseFormula();
    let molarWeight = 0;
    for (const element in elementCounts) {
        if (!(element in PERIODIC_TABLE)) {
            throw new Error(`Unknown element: ${element}`);
        }
        molarWeight += elementCounts[element] * PERIODIC_TABLE[element];
    }
    return parseFloat(molarWeight.toFixed(3));
}
/**
 * Gets all unique elements present in a reaction
 */
function getElementsInReaction(parsedReactants, parsedProducts) {
    const elements = new Set();
    // Add elements from reactants
    Object.values(parsedReactants).forEach((species) => {
        Object.keys(species).forEach(element => elements.add(element));
    });
    // Add elements from products
    Object.values(parsedProducts).forEach((species) => {
        Object.keys(species).forEach(element => elements.add(element));
    });
    return Array.from(elements);
}

/**
 * Linear equation system generator and solver
 * Based on the Generator and FileMaker classes from the original CREB project
 */
class LinearEquationSolver {
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
        this.allSpecies.length;
        // Try different combinations of coefficients
        for (let attempt = 1; attempt <= maxCoeff; attempt++) {
            const coefficients = this.findCoefficients(system, attempt);
            if (coefficients) {
                return coefficients;
            }
        }
        throw new Error('Unable to balance equation: Could not find integer coefficients');
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
class ChemicalEquationBalancer {
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
            throw new Error(`Failed to balance equation "${equation}": ${error}`);
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
}

/**
 * Stoichiometry calculator
 * Based on the Stoichiometry class from the original CREB project
 */
class Stoichiometry {
    constructor(equation) {
        this.reactants = [];
        this.products = [];
        this.coefficients = [];
        this.balancer = new ChemicalEquationBalancer();
        if (equation) {
            this.equation = equation;
            this.initializeFromEquation(equation);
        }
    }
    initializeFromEquation(equation) {
        // First, parse the raw equation (without coefficients) to get species names
        const rawParser = new EquationParser(equation);
        const rawData = rawParser.parse();
        // Balance the equation to get coefficients
        const balanced = this.balancer.balanceDetailed(equation);
        this.reactants = rawData.reactants;
        this.products = rawData.products;
        this.coefficients = balanced.coefficients;
    }
    /**
     * Calculates the molar weight of a chemical formula
     */
    calculateMolarWeight(formula) {
        return calculateMolarWeight(formula);
    }
    /**
     * Calculates stoichiometric ratios relative to a selected species
     */
    calculateRatios(selectedSpecies) {
        if (!this.equation) {
            throw new Error('No equation provided. Initialize with an equation first.');
        }
        const allSpecies = [...this.reactants, ...this.products];
        const selectedIndex = allSpecies.indexOf(selectedSpecies);
        if (selectedIndex === -1) {
            const availableSpecies = allSpecies.join(', ');
            throw new Error(`Species "${selectedSpecies}" not found in the equation. Available species: ${availableSpecies}`);
        }
        const selectedCoefficient = this.coefficients[selectedIndex];
        return this.coefficients.map(coeff => coeff / selectedCoefficient);
    }
    /**
     * Performs stoichiometric calculations starting from moles
     */
    calculateFromMoles(selectedSpecies, moles) {
        if (!this.equation) {
            throw new Error('No equation provided. Initialize with an equation first.');
        }
        const ratios = this.calculateRatios(selectedSpecies);
        const allSpecies = [...this.reactants, ...this.products];
        const result = {
            reactants: {},
            products: {},
            totalMolarMass: { reactants: 0, products: 0 }
        };
        // Calculate for all species
        allSpecies.forEach((species, index) => {
            const speciesMoles = ratios[index] * moles;
            const molarWeight = this.calculateMolarWeight(species);
            const grams = speciesMoles * molarWeight;
            const speciesData = {
                moles: parseFloat(speciesMoles.toFixed(3)),
                grams: parseFloat(grams.toFixed(3)),
                molarWeight: molarWeight
            };
            if (this.reactants.includes(species)) {
                result.reactants[species] = speciesData;
                result.totalMolarMass.reactants += grams;
            }
            else {
                result.products[species] = speciesData;
                result.totalMolarMass.products += grams;
            }
        });
        // Round total molar masses
        result.totalMolarMass.reactants = parseFloat(result.totalMolarMass.reactants.toFixed(3));
        result.totalMolarMass.products = parseFloat(result.totalMolarMass.products.toFixed(3));
        return result;
    }
    /**
     * Performs stoichiometric calculations starting from grams
     */
    calculateFromGrams(selectedSpecies, grams) {
        if (!this.equation) {
            throw new Error('No equation provided. Initialize with an equation first.');
        }
        const molarWeight = this.calculateMolarWeight(selectedSpecies);
        const moles = grams / molarWeight;
        return this.calculateFromMoles(selectedSpecies, moles);
    }
    /**
     * Gets the balanced equation
     */
    getBalancedEquation() {
        if (!this.equation) {
            throw new Error('No equation provided.');
        }
        return this.balancer.balance(this.equation);
    }
    /**
     * Gets all species in the reaction with their molar weights
     */
    getSpeciesInfo() {
        const result = {};
        this.reactants.forEach(species => {
            result[species] = {
                molarWeight: this.calculateMolarWeight(species),
                type: 'reactant'
            };
        });
        this.products.forEach(species => {
            result[species] = {
                molarWeight: this.calculateMolarWeight(species),
                type: 'product'
            };
        });
        return result;
    }
    /**
     * Static method to calculate molar weight without instantiating the class
     */
    static calculateMolarWeight(formula) {
        return calculateMolarWeight(formula);
    }
}

/**
 * Advanced TypeScript Support for CREB Library
 * Enhanced type definitions with generic constraints and branded types
 * Provides superior IntelliSense and type safety for chemical data structures
 */
// ============================================================================
// Advanced Type Guards and Validation
// ============================================================================
/**
 * Type guard for chemical formulas
 */
function isChemicalFormula(value) {
    return typeof value === 'string' && value.length > 0 && /[A-Z]/.test(value);
}
/**
 * Type guard for element symbols
 */
function isElementSymbol(value) {
    const validElements = new Set([
        'H', 'He', 'Li', 'Be', 'B', 'C', 'N', 'O', 'F', 'Ne',
        'Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl', 'Ar', 'K', 'Ca',
        'Sc', 'Ti', 'V', 'Cr', 'Mn', 'Fe', 'Co', 'Ni', 'Cu', 'Zn',
        'Ga', 'Ge', 'As', 'Se', 'Br', 'Kr', 'Rb', 'Sr', 'Y', 'Zr',
        'Nb', 'Mo', 'Tc', 'Ru', 'Rh', 'Pd', 'Ag', 'Cd', 'In', 'Sn',
        'Sb', 'Te', 'I', 'Xe', 'Cs', 'Ba', 'La', 'Ce', 'Pr', 'Nd',
        'Pm', 'Sm', 'Eu', 'Gd', 'Tb', 'Dy', 'Ho', 'Er', 'Tm', 'Yb',
        'Lu', 'Hf', 'Ta', 'W', 'Re', 'Os', 'Ir', 'Pt', 'Au', 'Hg',
        'Tl', 'Pb', 'Bi', 'Po', 'At', 'Rn', 'Fr', 'Ra', 'Ac', 'Th',
        'Pa', 'U', 'Np', 'Pu', 'Am', 'Cm', 'Bk', 'Cf', 'Es', 'Fm',
        'Md', 'No', 'Lr', 'Rf', 'Db', 'Sg', 'Bh', 'Hs', 'Mt', 'Ds',
        'Rg', 'Cn', 'Nh', 'Fl', 'Mc', 'Lv', 'Ts', 'Og'
    ]);
    return validElements.has(value);
}
/**
 * Type guard for balanced equations
 */
function isBalancedEquation(value) {
    return value.includes('->') || value.includes('→');
}
// ============================================================================
// Factory Functions with Type Safety
// ============================================================================
/**
 * Create a chemical formula with compile-time validation
 */
function createChemicalFormula(formula) {
    if (!isChemicalFormula(formula)) {
        throw new Error(`Invalid chemical formula: ${formula}`);
    }
    return formula;
}
/**
 * Create an element symbol with validation
 */
function createElementSymbol(symbol) {
    if (!isElementSymbol(symbol)) {
        throw new Error(`Invalid element symbol: ${symbol}`);
    }
    return symbol;
}
// ============================================================================
// Utility Functions for Type-Safe Operations
// ============================================================================
/**
 * Parse a chemical formula into element counts
 */
function parseFormula(formula) {
    const result = {};
    // Handle parentheses first by expanding them
    let expandedFormula = formula;
    // Find patterns like (OH)2 and expand them
    const parenthesesPattern = /\(([^)]+)\)(\d*)/g;
    expandedFormula = expandedFormula.replace(parenthesesPattern, (match, group, multiplier) => {
        const mult = multiplier ? parseInt(multiplier, 10) : 1;
        let expanded = '';
        for (let i = 0; i < mult; i++) {
            expanded += group;
        }
        return expanded;
    });
    // Now parse the expanded formula
    const matches = expandedFormula.match(/([A-Z][a-z]?)(\d*)/g);
    if (matches) {
        for (const match of matches) {
            const elementMatch = match.match(/([A-Z][a-z]?)(\d*)/);
            if (elementMatch) {
                const element = elementMatch[1];
                const count = elementMatch[2] ? parseInt(elementMatch[2], 10) : 1;
                if (isElementSymbol(element)) {
                    result[element] = (result[element] || 0) + count;
                }
            }
        }
    }
    return result;
}
// ============================================================================
// Enhanced Error Types
// ============================================================================
/**
 * Type-safe error for chemical formula validation
 */
class ChemicalFormulaError extends Error {
    constructor(formula, reason) {
        super(`Invalid chemical formula "${formula}": ${reason}`);
        this.formula = formula;
        this.reason = reason;
        this.name = 'ChemicalFormulaError';
    }
}
/**
 * Type-safe error for equation balancing
 */
class EquationBalancingError extends Error {
    constructor(equation, reason) {
        super(`Cannot balance equation "${equation}": ${reason}`);
        this.equation = equation;
        this.reason = reason;
        this.name = 'EquationBalancingError';
    }
}

/**
 * Enhanced Chemical Equation Balancer with Advanced TypeScript Support
 * Simplified version that provides compound analysis and type safety
 */
/**
 * Enhanced balancer with type-safe compound analysis
 */
class EnhancedBalancer {
    constructor() {
        this.balancer = new ChemicalEquationBalancer();
    }
    /**
     * Balance equation with enhanced compound information
     */
    balance(equation) {
        try {
            // Use the detailed balancer for more information
            const result = this.balancer.balanceDetailed(equation);
            // Extract all unique formulas from reactants and products
            const allFormulas = new Set();
            // Add formulas from the result structure
            if (result.reactants && result.reactants.length > 0) {
                result.reactants.forEach((formula) => allFormulas.add(formula));
            }
            if (result.products && result.products.length > 0) {
                result.products.forEach((formula) => allFormulas.add(formula));
            }
            // Analyze each compound
            const compounds = Array.from(allFormulas).map(formula => this.analyzeCompound(formula)).filter(compound => compound.formula !== ''); // Filter out empty results
            // Determine if the equation was balanced by checking if it changed OR if coefficients are all 1 (already balanced)
            const coefficientsAllOne = result.coefficients && result.coefficients.every(coeff => coeff === 1);
            const wasBalanced = result.equation !== equation || coefficientsAllOne;
            return {
                equation: result.equation,
                isBalanced: wasBalanced,
                compounds,
                coefficients: result.coefficients,
                reactants: result.reactants,
                products: result.products
            };
        }
        catch (error) {
            console.error('Error in enhanced balancer:', error);
            return {
                equation,
                isBalanced: false,
                compounds: [],
                coefficients: [],
                reactants: [],
                products: []
            };
        }
    }
    /**
     * Analyze a single compound for detailed information
     */
    analyzeCompound(formula) {
        try {
            const elementCounter = new ElementCounter(formula);
            const elementCount = elementCounter.parseFormula();
            const elements = Object.keys(elementCount);
            const molarMass = this.calculateMolarMass(elementCount);
            return {
                formula,
                molarMass,
                elements,
                elementCount
            };
        }
        catch (error) {
            return {
                formula,
                molarMass: 0,
                elements: [],
                elementCount: {}
            };
        }
    }
    /**
     * Calculate molar mass from element count
     */
    calculateMolarMass(elementCount) {
        // Atomic masses (simplified)
        const atomicMasses = {
            'H': 1.008, 'He': 4.003, 'Li': 6.941, 'Be': 9.012, 'B': 10.811,
            'C': 12.011, 'N': 14.007, 'O': 15.999, 'F': 18.998, 'Ne': 20.180,
            'Na': 22.990, 'Mg': 24.305, 'Al': 26.982, 'Si': 28.086, 'P': 30.974,
            'S': 32.065, 'Cl': 35.453, 'Ar': 39.948, 'K': 39.098, 'Ca': 40.078,
            'Fe': 55.845, 'Cu': 63.546, 'Zn': 65.38, 'Ag': 107.868, 'Au': 196.966
            // Add more as needed
        };
        let totalMass = 0;
        for (const [element, count] of Object.entries(elementCount)) {
            const atomicMass = atomicMasses[element];
            if (atomicMass) {
                totalMass += atomicMass * (count || 0);
            }
        }
        return totalMass;
    }
    /**
     * Simple formula validation
     */
    isValidFormula(formula) {
        // Basic validation - contains at least one capital letter
        return /[A-Z]/.test(formula) && formula.length > 0;
    }
}

/**
 * Enhanced Chemical Equation Balancer with PubChem integration
 * Provides compound validation, molecular weight verification, and enriched data
 */
class EnhancedChemicalEquationBalancer extends ChemicalEquationBalancer {
    constructor() {
        super(...arguments);
        this.compoundCache = new Map();
    }
    /**
     * Balance equation with safety and hazard information
     */
    async balanceWithSafety(equation) {
        // First get the enhanced balance with PubChem data
        const enhanced = await this.balanceWithPubChemData(equation);
        // Add safety information for each compound
        const safetyWarnings = [];
        if (enhanced.compoundData) {
            for (const [species, compoundInfo] of Object.entries(enhanced.compoundData)) {
                if (compoundInfo.isValid) {
                    try {
                        // Get safety information for the compound
                        const safetyInfo = await this.getSafetyInfo(compoundInfo);
                        compoundInfo.safetyInfo = safetyInfo;
                        // Generate safety warnings
                        const warnings = this.generateSafetyWarnings(species, safetyInfo);
                        safetyWarnings.push(...warnings);
                    }
                    catch (error) {
                        enhanced.validation?.warnings.push(`Could not retrieve safety data for ${species}: ${error instanceof Error ? error.message : 'Unknown error'}`);
                    }
                }
            }
        }
        // Add safety warnings to the result
        enhanced.safetyWarnings = safetyWarnings;
        return enhanced;
    }
    /**
     * Get safety information for a compound
     */
    async getSafetyInfo(compoundInfo) {
        // For now, use a knowledge base of common chemical hazards
        // In a full implementation, this would query PubChem's safety data
        const safetyKnowledgeBase = this.getKnownSafetyInfo();
        const formula = compoundInfo.molecularFormula;
        const name = compoundInfo.iupacName?.toLowerCase() || compoundInfo.name.toLowerCase();
        // Check known safety data
        let safetyInfo = safetyKnowledgeBase[formula || ''] ||
            safetyKnowledgeBase[name] ||
            safetyKnowledgeBase[compoundInfo.name.toLowerCase()];
        if (!safetyInfo) {
            // Try to infer basic safety information from chemical properties
            safetyInfo = this.inferSafetyFromProperties(compoundInfo);
        }
        return safetyInfo || {
            ghsClassifications: [],
            hazardStatements: [],
            precautionaryStatements: [],
            physicalHazards: [],
            healthHazards: [],
            environmentalHazards: []
        };
    }
    /**
     * Generate safety warnings from safety information
     */
    generateSafetyWarnings(compound, safetyInfo) {
        const warnings = [];
        // Process health hazards
        for (const hazard of safetyInfo.healthHazards) {
            warnings.push({
                compound,
                hazard,
                severity: this.determineSeverity(hazard),
                ghsClassification: safetyInfo.ghsClassifications.join(', ') || undefined,
                precautionaryStatements: safetyInfo.precautionaryStatements.length > 0 ? safetyInfo.precautionaryStatements : undefined
            });
        }
        // Process physical hazards
        for (const hazard of safetyInfo.physicalHazards) {
            warnings.push({
                compound,
                hazard,
                severity: this.determineSeverity(hazard),
                ghsClassification: safetyInfo.ghsClassifications.join(', ') || undefined
            });
        }
        // Process environmental hazards
        for (const hazard of safetyInfo.environmentalHazards) {
            warnings.push({
                compound,
                hazard,
                severity: this.determineSeverity(hazard),
                ghsClassification: safetyInfo.ghsClassifications.join(', ') || undefined
            });
        }
        return warnings;
    }
    /**
     * Determine severity level from hazard description
     */
    determineSeverity(hazard) {
        const hazardLower = hazard.toLowerCase();
        if (hazardLower.includes('fatal') || hazardLower.includes('death') || hazardLower.includes('severe')) {
            return 'extreme';
        }
        if (hazardLower.includes('serious') || hazardLower.includes('burn') || hazardLower.includes('corrosive')) {
            return 'high';
        }
        if (hazardLower.includes('harmful') || hazardLower.includes('irritant') || hazardLower.includes('toxic')) {
            return 'medium';
        }
        return 'low';
    }
    /**
     * Knowledge base of known chemical safety information
     */
    getKnownSafetyInfo() {
        return {
            'H2SO4': {
                ghsClassifications: ['H314', 'H290'],
                hazardStatements: ['Causes severe skin burns and eye damage', 'May be corrosive to metals'],
                precautionaryStatements: ['Wear protective gloves/protective clothing/eye protection/face protection', 'Do not breathe dust/fume/gas/mist/vapours/spray'],
                physicalHazards: ['Corrosive to metals'],
                healthHazards: ['Causes severe skin burns and eye damage'],
                environmentalHazards: [],
                signalWord: 'Danger'
            },
            'sulfuric acid': {
                ghsClassifications: ['H314', 'H290'],
                hazardStatements: ['Causes severe skin burns and eye damage', 'May be corrosive to metals'],
                precautionaryStatements: ['Wear protective gloves/protective clothing/eye protection/face protection', 'Do not breathe dust/fume/gas/mist/vapours/spray'],
                physicalHazards: ['Corrosive to metals'],
                healthHazards: ['Causes severe skin burns and eye damage'],
                environmentalHazards: [],
                signalWord: 'Danger'
            },
            'NaOH': {
                ghsClassifications: ['H314', 'H290'],
                hazardStatements: ['Causes severe skin burns and eye damage', 'May be corrosive to metals'],
                precautionaryStatements: ['Wear protective gloves/protective clothing/eye protection/face protection', 'Do not breathe dust/fume/gas/mist/vapours/spray'],
                physicalHazards: ['Corrosive to metals'],
                healthHazards: ['Causes severe skin burns and eye damage'],
                environmentalHazards: [],
                signalWord: 'Danger'
            },
            'sodium hydroxide': {
                ghsClassifications: ['H314', 'H290'],
                hazardStatements: ['Causes severe skin burns and eye damage', 'May be corrosive to metals'],
                precautionaryStatements: ['Wear protective gloves/protective clothing/eye protection/face protection', 'Do not breathe dust/fume/gas/mist/vapours/spray'],
                physicalHazards: ['Corrosive to metals'],
                healthHazards: ['Causes severe skin burns and eye damage'],
                environmentalHazards: [],
                signalWord: 'Danger'
            },
            'HCl': {
                ghsClassifications: ['H314', 'H335'],
                hazardStatements: ['Causes severe skin burns and eye damage', 'May cause respiratory irritation'],
                precautionaryStatements: ['Wear protective gloves/protective clothing/eye protection/face protection', 'Use only outdoors or in a well-ventilated area'],
                physicalHazards: ['Corrosive to metals'],
                healthHazards: ['Causes severe skin burns and eye damage', 'May cause respiratory irritation'],
                environmentalHazards: [],
                signalWord: 'Danger'
            },
            'hydrochloric acid': {
                ghsClassifications: ['H314', 'H335'],
                hazardStatements: ['Causes severe skin burns and eye damage', 'May cause respiratory irritation'],
                precautionaryStatements: ['Wear protective gloves/protective clothing/eye protection/face protection', 'Use only outdoors or in a well-ventilated area'],
                physicalHazards: ['Corrosive to metals'],
                healthHazards: ['Causes severe skin burns and eye damage', 'May cause respiratory irritation'],
                environmentalHazards: [],
                signalWord: 'Danger'
            },
            'NH3': {
                ghsClassifications: ['H221', 'H314', 'H400'],
                hazardStatements: ['Flammable gas', 'Causes severe skin burns and eye damage', 'Very toxic to aquatic life'],
                precautionaryStatements: ['Keep away from heat/sparks/open flames/hot surfaces', 'Wear protective gloves/protective clothing/eye protection/face protection'],
                physicalHazards: ['Flammable gas'],
                healthHazards: ['Causes severe skin burns and eye damage'],
                environmentalHazards: ['Very toxic to aquatic life'],
                signalWord: 'Danger'
            },
            'ammonia': {
                ghsClassifications: ['H221', 'H314', 'H400'],
                hazardStatements: ['Flammable gas', 'Causes severe skin burns and eye damage', 'Very toxic to aquatic life'],
                precautionaryStatements: ['Keep away from heat/sparks/open flames/hot surfaces', 'Wear protective gloves/protective clothing/eye protection/face protection'],
                physicalHazards: ['Flammable gas'],
                healthHazards: ['Causes severe skin burns and eye damage'],
                environmentalHazards: ['Very toxic to aquatic life'],
                signalWord: 'Danger'
            },
            'H2O': {
                ghsClassifications: [],
                hazardStatements: [],
                precautionaryStatements: [],
                physicalHazards: [],
                healthHazards: [],
                environmentalHazards: []
            },
            'water': {
                ghsClassifications: [],
                hazardStatements: [],
                precautionaryStatements: [],
                physicalHazards: [],
                healthHazards: [],
                environmentalHazards: []
            }
        };
    }
    /**
     * Infer basic safety information from compound properties
     */
    inferSafetyFromProperties(compoundInfo) {
        const safetyInfo = {
            ghsClassifications: [],
            hazardStatements: [],
            precautionaryStatements: ['Handle with care', 'Use proper ventilation'],
            physicalHazards: [],
            healthHazards: [],
            environmentalHazards: []
        };
        const formula = compoundInfo.molecularFormula || '';
        const name = compoundInfo.name.toLowerCase();
        // Infer based on common patterns
        if (formula.includes('O') && formula.includes('H') && (name.includes('acid') || formula.match(/H\d*[A-Z]/))) {
            safetyInfo.healthHazards.push('May cause skin and eye irritation');
            safetyInfo.precautionaryStatements.push('Avoid contact with skin and eyes');
        }
        if (name.includes('chloride') || formula.includes('Cl')) {
            safetyInfo.healthHazards.push('May be harmful if inhaled');
            safetyInfo.precautionaryStatements.push('Use in well-ventilated area');
        }
        if (name.includes('sulfate') || name.includes('nitrate')) {
            safetyInfo.healthHazards.push('May cause irritation');
        }
        // Default precautionary statement for unknown compounds
        if (safetyInfo.healthHazards.length === 0 && formula !== 'H2O') {
            safetyInfo.healthHazards.push('Safety data not available - handle with caution');
        }
        return safetyInfo;
    }
    /**
     * Balance equation using common chemical names
     * Converts compound names to formulas using PubChem, then balances
     */
    async balanceByName(commonNameEquation) {
        try {
            // Step 1: Parse equation to extract compound names
            const { reactantNames, productNames } = this.parseEquationNames(commonNameEquation);
            // Step 2: Resolve each compound name to chemical formula
            const nameToFormulaMap = {};
            const compoundDataMap = {};
            const allNames = [...reactantNames, ...productNames];
            for (const name of allNames) {
                const compoundInfo = await this.getCompoundInfo(name);
                compoundDataMap[name] = compoundInfo;
                if (compoundInfo.isValid && compoundInfo.molecularFormula) {
                    nameToFormulaMap[name] = compoundInfo.molecularFormula;
                }
                else {
                    // Try common name alternatives
                    const alternatives = this.getCommonNames(name);
                    let found = false;
                    for (const alt of alternatives) {
                        const altInfo = await this.getCompoundInfo(alt);
                        if (altInfo.isValid && altInfo.molecularFormula) {
                            nameToFormulaMap[name] = altInfo.molecularFormula;
                            compoundDataMap[name] = altInfo;
                            found = true;
                            break;
                        }
                    }
                    if (!found) {
                        throw new Error(`Could not resolve compound name: "${name}". Try using the chemical formula instead.`);
                    }
                }
            }
            // Step 3: Reconstruct equation with chemical formulas
            const formulaEquation = this.reconstructEquationWithFormulas(commonNameEquation, nameToFormulaMap);
            // Step 4: Balance the reconstructed equation
            const balanced = this.balanceDetailed(formulaEquation);
            // Step 5: Create enhanced result with both names and formulas
            const enhanced = {
                ...balanced,
                compoundData: {},
                validation: {
                    massBalanced: true,
                    chargeBalanced: true,
                    warnings: []
                }
            };
            // Add compound data for both original names and formulas
            for (const [name, info] of Object.entries(compoundDataMap)) {
                if (info.molecularFormula && balanced.reactants.includes(info.molecularFormula)) {
                    enhanced.compoundData[info.molecularFormula] = {
                        ...info,
                        name: info.molecularFormula, // Use formula as key
                        originalName: name // Keep original name
                    };
                }
                if (info.molecularFormula && balanced.products.includes(info.molecularFormula)) {
                    enhanced.compoundData[info.molecularFormula] = {
                        ...info,
                        name: info.molecularFormula,
                        originalName: name
                    };
                }
            }
            // Validate mass balance using PubChem molecular weights
            try {
                const massValidation = this.validateMassBalance(balanced, enhanced.compoundData);
                enhanced.validation.massBalanced = massValidation.balanced;
                if (!massValidation.balanced) {
                    enhanced.validation.warnings.push(`Mass balance discrepancy: ${massValidation.discrepancy.toFixed(4)} g/mol`);
                }
            }
            catch (error) {
                enhanced.validation.warnings.push(`Could not validate mass balance: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
            return enhanced;
        }
        catch (error) {
            throw new Error(`Failed to balance equation by name: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    /**
     * Balance equation with PubChem data enrichment
     */
    async balanceWithPubChemData(equation) {
        // First balance the equation normally
        const balanced = this.balanceDetailed(equation);
        // Enhance with PubChem data
        const enhanced = {
            ...balanced,
            compoundData: {},
            validation: {
                massBalanced: true,
                chargeBalanced: true,
                warnings: []
            }
        };
        // Get all unique species from the equation
        const allSpecies = [...new Set([...balanced.reactants, ...balanced.products])];
        // Fetch PubChem data for each compound
        for (const species of allSpecies) {
            try {
                const compoundInfo = await this.getCompoundInfo(species);
                enhanced.compoundData[species] = compoundInfo;
                if (!compoundInfo.isValid && compoundInfo.error) {
                    enhanced.validation.warnings.push(`${species}: ${compoundInfo.error}`);
                }
            }
            catch (error) {
                enhanced.validation.warnings.push(`Failed to fetch data for ${species}: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
        }
        // Validate mass balance using PubChem molecular weights
        try {
            const massValidation = this.validateMassBalance(balanced, enhanced.compoundData);
            enhanced.validation.massBalanced = massValidation.balanced;
            if (!massValidation.balanced) {
                enhanced.validation.warnings.push(`Mass balance discrepancy: ${massValidation.discrepancy.toFixed(4)} g/mol`);
            }
        }
        catch (error) {
            enhanced.validation.warnings.push(`Could not validate mass balance: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
        return enhanced;
    }
    /**
     * Get compound information from PubChem
     */
    async getCompoundInfo(compoundName) {
        // Check cache first
        if (this.compoundCache.has(compoundName)) {
            return this.compoundCache.get(compoundName);
        }
        const result = {
            name: compoundName,
            isValid: false
        };
        try {
            // Dynamic import of PubChem functionality
            const pubchemModule = await this.loadPubChemModule();
            if (!pubchemModule) {
                result.error = 'PubChem module not available. Install creb-pubchem-js for enhanced functionality.';
                this.compoundCache.set(compoundName, result);
                return result;
            }
            // Try to find compound by name
            let compounds = [];
            // First try exact name match
            try {
                compounds = await pubchemModule.fromName(compoundName);
            }
            catch (error) {
                // If name search fails and it looks like a formula, try CID search
                if (this.isLikelyFormula(compoundName)) {
                    try {
                        // For simple cases, try to find by common names
                        const commonNames = this.getCommonNames(compoundName);
                        for (const name of commonNames) {
                            try {
                                compounds = await pubchemModule.fromName(name);
                                if (compounds.length > 0)
                                    break;
                            }
                            catch {
                                // Continue to next name
                            }
                        }
                    }
                    catch (formulaError) {
                        result.error = `Not found by name or common formula names: ${error instanceof Error ? error.message : 'Unknown error'}`;
                    }
                }
                else {
                    result.error = `Not found by name: ${error instanceof Error ? error.message : 'Unknown error'}`;
                }
            }
            if (compounds.length > 0) {
                const compound = compounds[0]; // Use first match
                result.cid = compound.cid;
                result.molecularWeight = compound.molecularWeight || undefined;
                result.molecularFormula = compound.molecularFormula || undefined;
                result.iupacName = compound.iupacName || undefined;
                result.canonicalSmiles = compound.isomericSmiles || undefined;
                result.isValid = true;
                result.pubchemData = compound;
            }
            else if (!result.error) {
                result.error = 'No compounds found';
            }
        }
        catch (error) {
            result.error = `Search failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
        }
        // Cache the result
        this.compoundCache.set(compoundName, result);
        return result;
    }
    /**
     * Dynamically load PubChem module if available
     */
    async loadPubChemModule() {
        try {
            // Try to import the PubChem module
            // In browser environment, check for global PubChemJS
            if (typeof globalThis !== 'undefined' && globalThis.PubChemJS) {
                return globalThis.PubChemJS.Compound;
            }
            // Also check window for browser compatibility
            if (typeof globalThis !== 'undefined' && typeof globalThis.window !== 'undefined' && globalThis.window.PubChemJS) {
                return globalThis.window.PubChemJS.Compound;
            }
            // Legacy check for CREBPubChem (for backwards compatibility)
            if (typeof globalThis !== 'undefined' && globalThis.CREBPubChem) {
                return globalThis.CREBPubChem.Compound;
            }
            // In Node.js environment, try dynamic import with error handling
            try {
                // Use eval to avoid TypeScript compile-time module resolution
                const importFn = new Function('specifier', 'return import(specifier)');
                const pubchemModule = await importFn('creb-pubchem-js');
                return pubchemModule.Compound;
            }
            catch (importError) {
                // Module not available
                return null;
            }
        }
        catch (error) {
            // PubChem module not available
            return null;
        }
    }
    /**
     * Parse equation with compound names to extract reactant and product names
     */
    parseEquationNames(equation) {
        // Clean up the equation
        const cleanEquation = equation.trim().replace(/\s+/g, ' ');
        // Split by = or -> or →
        const parts = cleanEquation.split(/\s*(?:=|->|→)\s*/);
        if (parts.length !== 2) {
            throw new Error('Invalid equation format. Expected format: "reactants = products"');
        }
        const [reactantsPart, productsPart] = parts;
        // Parse reactants and products (split by + and clean up)
        const reactantNames = reactantsPart.split(/\s*\+\s*/)
            .map(name => name.trim())
            .filter(name => name.length > 0)
            .map(name => this.cleanCompoundName(name));
        const productNames = productsPart.split(/\s*\+\s*/)
            .map(name => name.trim())
            .filter(name => name.length > 0)
            .map(name => this.cleanCompoundName(name));
        if (reactantNames.length === 0 || productNames.length === 0) {
            throw new Error('Invalid equation: must have at least one reactant and one product');
        }
        return { reactantNames, productNames };
    }
    /**
     * Clean compound name by removing coefficients and standardizing format
     */
    cleanCompoundName(name) {
        // Remove leading numbers (coefficients)
        let cleaned = name.replace(/^\d+\s*/, '').trim();
        // Handle common variations
        cleaned = cleaned.toLowerCase().trim();
        // Standardize common names
        const standardNames = {
            'water': 'water',
            'h2o': 'water',
            'sulfuric acid': 'sulfuric acid',
            'sulphuric acid': 'sulfuric acid',
            'sodium hydroxide': 'sodium hydroxide',
            'caustic soda': 'sodium hydroxide',
            'sodium sulfate': 'sodium sulfate',
            'sodium sulphate': 'sodium sulfate',
            'hydrochloric acid': 'hydrochloric acid',
            'muriatic acid': 'hydrochloric acid',
            'ammonia': 'ammonia',
            'carbon dioxide': 'carbon dioxide',
            'glucose': 'glucose',
            'ethanol': 'ethanol',
            'ethyl alcohol': 'ethanol',
            'methane': 'methane',
            'oxygen': 'oxygen',
            'hydrogen': 'hydrogen',
            'nitrogen': 'nitrogen'
        };
        return standardNames[cleaned] || cleaned;
    }
    /**
     * Reconstruct equation using chemical formulas instead of names
     */
    reconstructEquationWithFormulas(originalEquation, nameToFormulaMap) {
        let formulaEquation = originalEquation;
        // Replace each compound name with its formula
        for (const [name, formula] of Object.entries(nameToFormulaMap)) {
            // Create regex to match the compound name (case insensitive, word boundaries)
            const nameRegex = new RegExp(`\\b${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
            formulaEquation = formulaEquation.replace(nameRegex, formula);
        }
        return formulaEquation;
    }
    /**
     * Get common names for simple chemical formulas or alternative names for compounds
     */
    getCommonNames(input) {
        const commonNames = {
            'H2O': ['water'],
            'water': ['H2O', 'dihydrogen monoxide'],
            'CO2': ['carbon dioxide'],
            'carbon dioxide': ['CO2'],
            'NaCl': ['sodium chloride', 'salt'],
            'sodium chloride': ['NaCl', 'salt'],
            'salt': ['NaCl', 'sodium chloride'],
            'H2SO4': ['sulfuric acid', 'sulphuric acid'],
            'sulfuric acid': ['H2SO4', 'sulphuric acid'],
            'sulphuric acid': ['H2SO4', 'sulfuric acid'],
            'HCl': ['hydrochloric acid', 'muriatic acid'],
            'hydrochloric acid': ['HCl', 'muriatic acid'],
            'muriatic acid': ['HCl', 'hydrochloric acid'],
            'NH3': ['ammonia'],
            'ammonia': ['NH3'],
            'CH4': ['methane'],
            'methane': ['CH4'],
            'C2H5OH': ['ethanol', 'ethyl alcohol'],
            'ethanol': ['C2H5OH', 'ethyl alcohol'],
            'ethyl alcohol': ['C2H5OH', 'ethanol'],
            'C6H12O6': ['glucose', 'dextrose'],
            'glucose': ['C6H12O6', 'dextrose'],
            'dextrose': ['C6H12O6', 'glucose'],
            'CaCO3': ['calcium carbonate'],
            'calcium carbonate': ['CaCO3'],
            'NaOH': ['sodium hydroxide', 'caustic soda'],
            'sodium hydroxide': ['NaOH', 'caustic soda'],
            'caustic soda': ['NaOH', 'sodium hydroxide'],
            'KOH': ['potassium hydroxide'],
            'potassium hydroxide': ['KOH'],
            'Na2SO4': ['sodium sulfate', 'sodium sulphate'],
            'sodium sulfate': ['Na2SO4', 'sodium sulphate'],
            'sodium sulphate': ['Na2SO4', 'sodium sulfate'],
            'Mg': ['magnesium'],
            'magnesium': ['Mg'],
            'Al': ['aluminum', 'aluminium'],
            'aluminum': ['Al'],
            'aluminium': ['Al'],
            'Fe': ['iron'],
            'iron': ['Fe'],
            'Cu': ['copper'],
            'copper': ['Cu'],
            'Zn': ['zinc'],
            'zinc': ['Zn'],
            'O2': ['oxygen'],
            'oxygen': ['O2'],
            'N2': ['nitrogen'],
            'nitrogen': ['N2'],
            'H2': ['hydrogen'],
            'hydrogen': ['H2']
        };
        return commonNames[input] || commonNames[input.toLowerCase()] || [];
    }
    /**
     * Check if a string looks like a chemical formula
     */
    isLikelyFormula(str) {
        // Simple heuristic: contains only letters, numbers, parentheses, and common symbols
        return /^[A-Za-z0-9()[\]+-]+$/.test(str) && /[A-Z]/.test(str);
    }
    /**
     * Validate mass balance using PubChem molecular weights
     */
    validateMassBalance(balanced, compoundData) {
        let reactantMass = 0;
        let productMass = 0;
        // Calculate reactant mass
        for (let i = 0; i < balanced.reactants.length; i++) {
            const species = balanced.reactants[i];
            const coefficient = balanced.coefficients[i];
            const compound = compoundData[species];
            if (compound?.molecularWeight) {
                reactantMass += coefficient * compound.molecularWeight;
            }
            else {
                throw new Error(`Missing molecular weight for reactant: ${species}`);
            }
        }
        // Calculate product mass
        for (let i = 0; i < balanced.products.length; i++) {
            const species = balanced.products[i];
            const coefficient = balanced.coefficients[balanced.reactants.length + i];
            const compound = compoundData[species];
            if (compound?.molecularWeight) {
                productMass += coefficient * compound.molecularWeight;
            }
            else {
                throw new Error(`Missing molecular weight for product: ${species}`);
            }
        }
        const discrepancy = Math.abs(reactantMass - productMass);
        const tolerance = 0.01; // 0.01 g/mol tolerance
        return {
            balanced: discrepancy <= tolerance,
            discrepancy
        };
    }
    /**
     * Suggest alternative compound names or formulas
     */
    async suggestAlternatives(compoundName) {
        const suggestions = [];
        try {
            const pubchemModule = await this.loadPubChemModule();
            if (!pubchemModule) {
                return suggestions;
            }
            // Try various search strategies
            const searchTerms = [
                compoundName.toLowerCase(),
                compoundName.toUpperCase(),
                compoundName.replace(/\s+/g, ''),
                compoundName.replace(/\s+/g, '-'),
                compoundName.replace(/-/g, ' '),
            ];
            for (const term of searchTerms) {
                if (term !== compoundName) {
                    try {
                        const compounds = await pubchemModule.fromName(term);
                        if (compounds.length > 0) {
                            suggestions.push(term);
                        }
                    }
                    catch {
                        // Ignore errors for suggestions
                    }
                }
            }
        }
        catch (error) {
            // Return empty suggestions if search fails
        }
        return [...new Set(suggestions)]; // Remove duplicates
    }
    /**
     * Clear the compound cache
     */
    clearCache() {
        this.compoundCache.clear();
    }
    /**
     * Get cached compound info without making new requests
     */
    getCachedCompoundInfo(compoundName) {
        return this.compoundCache.get(compoundName);
    }
}

/**
 * Enhanced Stoichiometry calculator with PubChem integration
 * Provides accurate molecular weights, compound validation, and enriched calculations
 */
class EnhancedStoichiometry extends Stoichiometry {
    constructor(equation) {
        super(equation);
        this.compoundDataCache = {};
        this.enhancedBalancer = new EnhancedChemicalEquationBalancer();
    }
    /**
     * Initialize with compound validation and enrichment
     */
    async initializeWithValidation(equation) {
        // Initialize the stoichiometry with the equation
        this.initializedStoich = new Stoichiometry(equation);
        // Balance the equation with PubChem data
        const enhancedBalance = await this.enhancedBalancer.balanceWithPubChemData(equation);
        // Store compound data for later use
        this.compoundDataCache = enhancedBalance.compoundData || {};
        // Calculate molecular weight validation
        const validation = this.calculateMolecularWeightValidation(enhancedBalance);
        // Generate suggestions for compounds that weren't found
        const suggestions = {};
        for (const [species, info] of Object.entries(this.compoundDataCache)) {
            if (!info.isValid) {
                try {
                    suggestions[species] = await this.enhancedBalancer.suggestAlternatives(species);
                }
                catch (error) {
                    // Ignore suggestion errors
                }
            }
        }
        return {
            equation: enhancedBalance.equation,
            balanced: true,
            molecularWeightValidation: validation,
            compoundInfo: this.compoundDataCache,
            suggestions: Object.keys(suggestions).length > 0 ? suggestions : undefined
        };
    }
    /**
     * Enhanced stoichiometric calculation with PubChem data
     */
    async calculateFromMolesEnhanced(selectedSpecies, moles) {
        // Use the initialized stoichiometry or throw error if not initialized
        if (!this.initializedStoich) {
            throw new Error('Enhanced stoichiometry not initialized. Call initializeWithValidation() first.');
        }
        // Get basic calculation
        const basicResult = this.initializedStoich.calculateFromMoles(selectedSpecies, moles);
        // Enhance with PubChem data
        const enhanced = {
            ...basicResult,
            compoundData: this.compoundDataCache,
            pubchemMolarWeights: {},
            validation: {
                molecularWeightAccuracy: {},
                warnings: []
            }
        };
        // Compare calculated vs PubChem molecular weights
        const allSpecies = [...Object.keys(basicResult.reactants), ...Object.keys(basicResult.products)];
        for (const species of allSpecies) {
            const speciesData = basicResult.reactants[species] || basicResult.products[species];
            const compoundInfo = this.compoundDataCache[species];
            if (compoundInfo?.molecularWeight && speciesData) {
                enhanced.pubchemMolarWeights[species] = compoundInfo.molecularWeight;
                const calculated = speciesData.molarWeight;
                const pubchem = compoundInfo.molecularWeight;
                const difference = Math.abs(calculated - pubchem);
                const percentDiff = (difference / pubchem) * 100;
                enhanced.validation.molecularWeightAccuracy[species] = {
                    calculated,
                    pubchem,
                    difference,
                    accuracy: percentDiff < 0.1 ? 'excellent' :
                        percentDiff < 1 ? 'good' :
                            percentDiff < 5 ? 'fair' : 'poor'
                };
                if (percentDiff > 1) {
                    enhanced.validation.warnings.push(`Molecular weight mismatch for ${species}: calculated ${calculated.toFixed(3)}, PubChem ${pubchem.toFixed(3)} (${percentDiff.toFixed(1)}% difference)`);
                }
            }
            else if (!compoundInfo?.isValid) {
                enhanced.validation.warnings.push(`No PubChem data available for ${species}: ${compoundInfo?.error || 'Unknown compound'}`);
            }
        }
        return enhanced;
    }
    /**
     * Enhanced calculation from grams with PubChem data
     */
    async calculateFromGramsEnhanced(selectedSpecies, grams) {
        // Use the initialized stoichiometry or throw error if not initialized
        if (!this.initializedStoich) {
            throw new Error('Enhanced stoichiometry not initialized. Call initializeWithValidation() first.');
        }
        // Get basic calculation
        const basicResult = this.initializedStoich.calculateFromGrams(selectedSpecies, grams);
        // Convert to enhanced result using the same logic as calculateFromMolesEnhanced
        const speciesData = basicResult.reactants[selectedSpecies] || basicResult.products[selectedSpecies];
        if (speciesData) {
            return this.calculateFromMolesEnhanced(selectedSpecies, speciesData.moles);
        }
        throw new Error(`Species ${selectedSpecies} not found in calculation results`);
    }
    /**
     * Get compound information with PubChem enrichment
     */
    async getCompoundInfo(compoundName) {
        if (this.compoundDataCache[compoundName]) {
            return this.compoundDataCache[compoundName];
        }
        const info = await this.enhancedBalancer.getCompoundInfo(compoundName);
        this.compoundDataCache[compoundName] = info;
        return info;
    }
    /**
     * Calculate molar weight with PubChem verification
     */
    async calculateMolarWeightEnhanced(formula) {
        const calculated = this.calculateMolarWeight(formula);
        try {
            const compoundInfo = await this.getCompoundInfo(formula);
            if (compoundInfo.isValid && compoundInfo.molecularWeight) {
                const pubchem = compoundInfo.molecularWeight;
                const difference = Math.abs(calculated - pubchem);
                const percentDiff = (difference / pubchem) * 100;
                return {
                    calculated,
                    pubchem,
                    difference,
                    accuracy: percentDiff < 0.1 ? 'excellent' :
                        percentDiff < 1 ? 'good' :
                            percentDiff < 5 ? 'fair' : 'poor',
                    compoundInfo
                };
            }
        }
        catch (error) {
            // PubChem lookup failed, return calculated value only
        }
        return { calculated };
    }
    /**
     * Compare two compounds using PubChem data
     */
    async compareCompounds(compound1, compound2) {
        const info1 = await this.getCompoundInfo(compound1);
        const info2 = await this.getCompoundInfo(compound2);
        const comparison = {
            molecularWeightRatio: 1,
            formulasSimilar: false,
            sameCompound: false,
            differences: []
        };
        if (info1.isValid && info2.isValid) {
            // Compare molecular weights
            if (info1.molecularWeight && info2.molecularWeight) {
                comparison.molecularWeightRatio = info1.molecularWeight / info2.molecularWeight;
            }
            // Compare formulas
            if (info1.molecularFormula && info2.molecularFormula) {
                comparison.formulasSimilar = info1.molecularFormula === info2.molecularFormula;
                if (comparison.formulasSimilar) {
                    comparison.sameCompound = true;
                }
            }
            // Find differences
            if (info1.cid && info2.cid && info1.cid === info2.cid) {
                comparison.sameCompound = true;
            }
            else {
                if (info1.molecularFormula !== info2.molecularFormula) {
                    comparison.differences.push(`Different molecular formulas: ${info1.molecularFormula} vs ${info2.molecularFormula}`);
                }
                if (info1.molecularWeight && info2.molecularWeight && Math.abs(info1.molecularWeight - info2.molecularWeight) > 0.01) {
                    comparison.differences.push(`Different molecular weights: ${info1.molecularWeight} vs ${info2.molecularWeight}`);
                }
            }
        }
        else {
            if (!info1.isValid)
                comparison.differences.push(`Cannot find data for ${compound1}`);
            if (!info2.isValid)
                comparison.differences.push(`Cannot find data for ${compound2}`);
        }
        return {
            compound1: info1,
            compound2: info2,
            comparison
        };
    }
    /**
     * Calculate molecular weight validation for balanced equation
     */
    calculateMolecularWeightValidation(enhancedBalance) {
        let reactantMass = 0;
        let productMass = 0;
        if (enhancedBalance.compoundData) {
            // Calculate reactant total mass
            for (let i = 0; i < enhancedBalance.reactants.length; i++) {
                const species = enhancedBalance.reactants[i];
                const coefficient = enhancedBalance.coefficients[i];
                const compound = enhancedBalance.compoundData[species];
                if (compound?.molecularWeight) {
                    reactantMass += coefficient * compound.molecularWeight;
                }
            }
            // Calculate product total mass  
            for (let i = 0; i < enhancedBalance.products.length; i++) {
                const species = enhancedBalance.products[i];
                const coefficient = enhancedBalance.coefficients[enhancedBalance.reactants.length + i];
                const compound = enhancedBalance.compoundData[species];
                if (compound?.molecularWeight) {
                    productMass += coefficient * compound.molecularWeight;
                }
            }
        }
        const difference = Math.abs(reactantMass - productMass);
        const isBalanced = difference < 0.01; // 0.01 g/mol tolerance
        return {
            reactants: reactantMass,
            products: productMass,
            difference,
            isBalanced
        };
    }
    /**
     * Clear cached compound data
     */
    clearCache() {
        this.compoundDataCache = {};
        this.enhancedBalancer.clearCache();
    }
    /**
     * Get all cached compound data
     */
    getCachedCompounds() {
        return { ...this.compoundDataCache };
    }
}

/**
 * Core thermodynamics calculator for CREB-JS
 * Implements standard thermodynamic calculations for chemical reactions
 */
class ThermodynamicsCalculator {
    constructor() {
        this.R = 8.314; // Gas constant J/(mol·K)
        this.standardTemperature = 298.15; // K
        this.standardPressure = 101325; // Pa
    }
    /**
     * Calculate thermodynamic properties for a balanced chemical equation
     */
    async calculateThermodynamics(equation, conditions = {
        temperature: this.standardTemperature,
        pressure: this.standardPressure
    }) {
        try {
            // Get thermodynamic data for all compounds
            const compoundData = await this.getCompoundThermodynamicData(equation);
            // Calculate standard enthalpy change
            const deltaH = this.calculateEnthalpyChange(equation, compoundData);
            // Calculate standard entropy change
            const deltaS = this.calculateEntropyChange(equation, compoundData);
            // Calculate Gibbs free energy change
            const deltaG = this.calculateGibbsChange(deltaH, deltaS, conditions.temperature);
            // Calculate equilibrium constant
            const equilibriumConstant = this.calculateEquilibriumConstant(deltaG, conditions.temperature);
            // Determine spontaneity
            const spontaneity = this.determineSpontaneity(deltaG);
            // Generate temperature dependence profile
            const temperatureDependence = this.generateTemperatureProfile(deltaH, deltaS);
            return {
                deltaH,
                deltaS,
                deltaG,
                equilibriumConstant,
                spontaneity,
                temperatureDependence,
                conditions,
                // Alias properties for integrated balancer
                enthalpy: deltaH,
                gibbsFreeEnergy: deltaG,
                isSpontaneous: spontaneity === 'spontaneous'
            };
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            throw new Error(`Thermodynamics calculation failed: ${errorMessage}`);
        }
    }
    /**
     * Calculate enthalpy change (ΔH) for the reaction
     * ΔH = Σ(coefficients × ΔHf products) - Σ(coefficients × ΔHf reactants)
     */
    calculateEnthalpyChange(equation, compoundData) {
        let deltaH = 0;
        // Products (positive contribution)
        equation.products.forEach((formula, index) => {
            const data = compoundData.get(formula);
            if (data) {
                const coefficient = equation.coefficients[equation.reactants.length + index];
                deltaH += coefficient * data.deltaHf;
            }
        });
        // Reactants (negative contribution)
        equation.reactants.forEach((formula, index) => {
            const data = compoundData.get(formula);
            if (data) {
                const coefficient = equation.coefficients[index];
                deltaH -= coefficient * data.deltaHf;
            }
        });
        return deltaH;
    }
    /**
     * Calculate entropy change (ΔS) for the reaction
     * ΔS = Σ(coefficients × S products) - Σ(coefficients × S reactants)
     */
    calculateEntropyChange(equation, compoundData) {
        let deltaS = 0;
        // Products (positive contribution)
        equation.products.forEach((formula, index) => {
            const data = compoundData.get(formula);
            if (data) {
                const coefficient = equation.coefficients[equation.reactants.length + index];
                deltaS += coefficient * data.entropy;
            }
        });
        // Reactants (negative contribution)
        equation.reactants.forEach((formula, index) => {
            const data = compoundData.get(formula);
            if (data) {
                const coefficient = equation.coefficients[index];
                deltaS -= coefficient * data.entropy;
            }
        });
        return deltaS / 1000; // Convert J/mol·K to kJ/mol·K
    }
    /**
     * Calculate Gibbs free energy change (ΔG)
     * ΔG = ΔH - T×ΔS
     */
    calculateGibbsChange(deltaH, deltaS, temperature) {
        return deltaH - (temperature * deltaS);
    }
    /**
     * Calculate equilibrium constant from Gibbs free energy
     * K = exp(-ΔG / RT)
     */
    calculateEquilibriumConstant(deltaG, temperature) {
        const exponent = -(deltaG * 1000) / (this.R * temperature); // Convert kJ to J
        return Math.exp(exponent);
    }
    /**
     * Determine reaction spontaneity based on Gibbs free energy
     */
    determineSpontaneity(deltaG) {
        const tolerance = 0.1; // kJ/mol tolerance for equilibrium
        if (deltaG < -tolerance) {
            return 'spontaneous';
        }
        else if (deltaG > tolerance) {
            return 'non-spontaneous';
        }
        else {
            return 'equilibrium';
        }
    }
    /**
     * Generate temperature dependence profile
     */
    generateTemperatureProfile(deltaH, deltaS) {
        const tempRange = [200, 800]; // K
        const points = [];
        // Calculate ΔG at different temperatures
        for (let T = tempRange[0]; T <= tempRange[1]; T += 50) {
            const deltaG = this.calculateGibbsChange(deltaH, deltaS, T);
            points.push({ temperature: T, deltaG });
        }
        // Find spontaneity threshold (where ΔG = 0)
        let spontaneityThreshold;
        if (deltaS !== 0) {
            const threshold = deltaH / deltaS; // T = ΔH / ΔS when ΔG = 0
            if (threshold > 0 && threshold >= tempRange[0] && threshold <= tempRange[1]) {
                spontaneityThreshold = threshold;
            }
        }
        return {
            range: tempRange,
            deltaGvsT: points,
            spontaneityThreshold
        };
    }
    /**
     * Get thermodynamic data for compounds in the equation
     * This would integrate with PubChem and NIST databases
     */
    async getCompoundThermodynamicData(equation) {
        const data = new Map();
        // Collect all unique formulas
        const allCompounds = [
            ...equation.reactants,
            ...equation.products
        ];
        const uniqueFormulas = [...new Set(allCompounds)];
        // Fetch data for each compound
        for (const formula of uniqueFormulas) {
            try {
                const properties = await this.fetchThermodynamicProperties(formula);
                data.set(formula, properties);
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                console.warn(`Could not fetch thermodynamic data for ${formula}: ${errorMessage}`);
                // Use estimated values or throw error
                data.set(formula, this.estimateThermodynamicProperties(formula));
            }
        }
        return data;
    }
    /**
     * Fetch thermodynamic properties from external databases
     * TODO: Implement PubChem/NIST integration
     */
    async fetchThermodynamicProperties(formula) {
        // This is a placeholder - actual implementation would query PubChem/NIST
        // For now, return some common compound values for demonstration
        const commonCompounds = {
            'H2O': {
                deltaHf: -285.8, // kJ/mol
                entropy: 69.95, // J/(mol·K)
                heatCapacity: 75.3, // J/(mol·K)
                temperatureRange: [273, 373]
            },
            'CO2': {
                deltaHf: -393.5,
                entropy: 213.8,
                heatCapacity: 37.1,
                temperatureRange: [200, 800]
            },
            'H2': {
                deltaHf: 0,
                entropy: 130.7,
                heatCapacity: 28.8,
                temperatureRange: [200, 800]
            },
            'O2': {
                deltaHf: 0,
                entropy: 205.2,
                heatCapacity: 29.4,
                temperatureRange: [200, 800]
            },
            'CH4': {
                deltaHf: -74.6,
                entropy: 186.3,
                heatCapacity: 35.7,
                temperatureRange: [200, 800]
            }
        };
        if (commonCompounds[formula]) {
            return commonCompounds[formula];
        }
        throw new Error(`Thermodynamic data not available for ${formula}`);
    }
    /**
     * Estimate thermodynamic properties using group contribution methods
     * TODO: Implement Joback and Reid group contribution method
     */
    estimateThermodynamicProperties(formula) {
        // Placeholder estimation - would use actual group contribution methods
        return {
            deltaHf: 0, // Assume elements in standard state
            entropy: 100, // Rough estimate
            heatCapacity: 30, // Rough estimate
            temperatureRange: [298, 500]
        };
    }
    /**
     * Calculate thermodynamics for reaction data format (used by integrated balancer)
     */
    async calculateReactionThermodynamics(reactionData, temperature = this.standardTemperature) {
        // Convert ReactionData to BalancedEquation format
        const reactants = reactionData.reactants.map(r => r.formula);
        const products = reactionData.products.map(p => p.formula);
        const coefficients = [
            ...reactionData.reactants.map(r => r.coefficient),
            ...reactionData.products.map(p => p.coefficient)
        ];
        // Create equation string for BalancedEquation
        const reactantString = reactionData.reactants
            .map(r => `${r.coefficient > 1 ? r.coefficient : ''}${r.formula}`)
            .join(' + ');
        const productString = reactionData.products
            .map(p => `${p.coefficient > 1 ? p.coefficient : ''}${p.formula}`)
            .join(' + ');
        const equationString = `${reactantString} = ${productString}`;
        const equation = {
            equation: equationString,
            reactants,
            products,
            coefficients
        };
        const conditions = {
            temperature,
            pressure: this.standardPressure
        };
        return this.calculateThermodynamics(equation, conditions);
    }
}

/**
 * Thermodynamics-Integrated Chemical Equation Balancer
 * Combines chemical equation balancing with comprehensive thermodynamic analysis
 *
 * @author Loganathane Virassamy
 * @version 1.4.0-alpha
 */
/**
 * Classification of chemical reactions based on thermodynamic properties
 */
var ReactionType;
(function (ReactionType) {
    ReactionType["COMBUSTION"] = "combustion";
    ReactionType["SYNTHESIS"] = "synthesis";
    ReactionType["DECOMPOSITION"] = "decomposition";
    ReactionType["SINGLE_REPLACEMENT"] = "single_replacement";
    ReactionType["DOUBLE_REPLACEMENT"] = "double_replacement";
    ReactionType["ACID_BASE"] = "acid_base";
    ReactionType["REDOX"] = "redox";
    ReactionType["BIOLOGICAL"] = "biological";
    ReactionType["INDUSTRIAL"] = "industrial";
})(ReactionType || (ReactionType = {}));
/**
 * Reaction feasibility assessment
 */
var ReactionFeasibility;
(function (ReactionFeasibility) {
    ReactionFeasibility["HIGHLY_FAVORABLE"] = "highly_favorable";
    ReactionFeasibility["FAVORABLE"] = "favorable";
    ReactionFeasibility["MARGINALLY_FAVORABLE"] = "marginally_favorable";
    ReactionFeasibility["EQUILIBRIUM"] = "equilibrium";
    ReactionFeasibility["UNFAVORABLE"] = "unfavorable";
    ReactionFeasibility["HIGHLY_UNFAVORABLE"] = "highly_unfavorable"; // ΔG° > 20 kJ/mol
})(ReactionFeasibility || (ReactionFeasibility = {}));
/**
 * Safety classification based on energy release
 */
var SafetyLevel;
(function (SafetyLevel) {
    SafetyLevel["SAFE"] = "safe";
    SafetyLevel["CAUTION"] = "caution";
    SafetyLevel["WARNING"] = "warning";
    SafetyLevel["DANGER"] = "danger";
    SafetyLevel["EXTREME_DANGER"] = "extreme_danger"; // |ΔH°| > 2000 kJ/mol
})(SafetyLevel || (SafetyLevel = {}));
/**
 * Thermodynamics-Integrated Chemical Equation Balancer
 * Revolutionary chemistry tool combining balancing with energy analysis
 */
class ThermodynamicsEquationBalancer {
    constructor() {
        this.balancer = new ChemicalEquationBalancer();
        this.thermoCalculator = new ThermodynamicsCalculator();
    }
    /**
     * Balance equation with comprehensive thermodynamic analysis
     */
    async balanceWithThermodynamics(equation, temperature = 298.15, pressure = 1.0) {
        try {
            // Step 1: Balance the chemical equation
            const balanced = this.balancer.balance(equation);
            const reactionData = this.parseEquationToReactionData(balanced);
            // Step 2: Calculate thermodynamics
            const thermodynamics = await this.thermoCalculator.calculateReactionThermodynamics(reactionData, temperature);
            // Step 3: Classify reaction
            const reactionType = this.classifyReaction(equation, thermodynamics);
            // Step 4: Assess feasibility and safety
            const feasibility = this.assessFeasibility(thermodynamics.gibbsFreeEnergy);
            const safetyLevel = this.assessSafety(thermodynamics.enthalpy);
            // Step 5: Generate analysis and recommendations
            const analysis = this.generateAnalysis(reactionType, thermodynamics, feasibility, safetyLevel);
            // Step 6: Optimize conditions (simplified for now)
            const optimalConditions = await this.findOptimalConditions(equation);
            return {
                balanced,
                coefficients: this.extractCoefficients(balanced),
                thermodynamics,
                reactionType,
                feasibility,
                safetyLevel,
                energyReleased: thermodynamics.enthalpy < 0 ? Math.abs(thermodynamics.enthalpy) : undefined,
                energyRequired: thermodynamics.enthalpy > 0 ? thermodynamics.enthalpy : undefined,
                spontaneous: thermodynamics.isSpontaneous,
                equilibriumConstant: this.calculateEquilibriumConstant(thermodynamics.gibbsFreeEnergy, temperature),
                optimalTemperature: optimalConditions.temperature,
                temperatureRange: { min: 200, max: 800 }, // Will be calculated dynamically
                pressureEffects: this.analyzePressureEffects(reactionData),
                safetyWarnings: analysis.safetyWarnings,
                recommendations: analysis.recommendations,
                industrialApplications: analysis.industrialApplications,
                reactionMechanism: analysis.reactionMechanism,
                realWorldExamples: analysis.realWorldExamples
            };
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            throw new Error(`Thermodynamics balancing failed: ${errorMessage}`);
        }
    }
    /**
     * Find optimal reaction conditions for maximum yield
     */
    async findOptimalConditions(equation) {
        const balanced = this.balancer.balance(equation);
        const reactionData = this.parseEquationToReactionData(balanced);
        // Test different temperatures
        const temperatures = [250, 298.15, 350, 400, 500, 600, 750];
        let bestConditions = {
            temperature: 298.15,
            pressure: 1.0,
            yield: 0,
            reasoning: []
        };
        for (const temp of temperatures) {
            const thermo = await this.thermoCalculator.calculateReactionThermodynamics(reactionData, temp);
            const K = this.calculateEquilibriumConstant(thermo.gibbsFreeEnergy, temp);
            // Estimate yield from equilibrium constant
            const yieldPercent = this.estimateYieldFromK(K, reactionData);
            if (yieldPercent > bestConditions.yield) {
                bestConditions = {
                    temperature: temp,
                    pressure: this.getOptimalPressure(reactionData),
                    yield: yieldPercent,
                    reasoning: this.generateOptimizationReasoning(temp, thermo, K)
                };
            }
        }
        return bestConditions;
    }
    /**
     * Classify reaction type based on equation pattern and thermodynamics
     */
    classifyReaction(equation, thermo) {
        const normalized = equation.toLowerCase().replace(/\s+/g, '');
        // Biological reactions (check first before combustion)
        if (normalized.includes('c6h12o6') || normalized.includes('glucose')) {
            return ReactionType.BIOLOGICAL;
        }
        // Combustion: organic + O2 = CO2 + H2O
        if (normalized.includes('o2') && normalized.includes('co2') && normalized.includes('h2o')) {
            return ReactionType.COMBUSTION;
        }
        // Synthesis (A + B = C)
        if (equation.split('=')[0].split('+').length >= 2 &&
            equation.split('=')[1].split('+').length === 1) {
            return ReactionType.SYNTHESIS;
        }
        // Decomposition (A = B + C)
        if (equation.split('=')[0].split('+').length === 1 &&
            equation.split('=')[1].split('+').length >= 2) {
            return ReactionType.DECOMPOSITION;
        }
        // Acid-base reactions
        if (normalized.includes('h+') || normalized.includes('oh-') ||
            normalized.includes('h2o') && thermo.enthalpy < -50) {
            return ReactionType.ACID_BASE;
        }
        return ReactionType.REDOX; // Default
    }
    /**
     * Assess reaction feasibility based on Gibbs free energy
     */
    assessFeasibility(deltaG) {
        if (deltaG < -100)
            return ReactionFeasibility.HIGHLY_FAVORABLE;
        if (deltaG < -20)
            return ReactionFeasibility.FAVORABLE;
        if (deltaG < 0)
            return ReactionFeasibility.MARGINALLY_FAVORABLE;
        if (Math.abs(deltaG) < 5)
            return ReactionFeasibility.EQUILIBRIUM;
        if (deltaG < 20)
            return ReactionFeasibility.UNFAVORABLE;
        return ReactionFeasibility.HIGHLY_UNFAVORABLE;
    }
    /**
     * Assess safety level based on enthalpy change
     */
    assessSafety(deltaH) {
        const absEnergy = Math.abs(deltaH);
        if (absEnergy < 100)
            return SafetyLevel.SAFE;
        if (absEnergy < 500)
            return SafetyLevel.CAUTION;
        if (absEnergy < 1000)
            return SafetyLevel.WARNING;
        if (absEnergy < 2000)
            return SafetyLevel.DANGER;
        return SafetyLevel.EXTREME_DANGER;
    }
    /**
     * Generate comprehensive analysis and recommendations
     */
    generateAnalysis(type, thermo, feasibility, safety) {
        const analysis = {
            safetyWarnings: [],
            recommendations: [],
            industrialApplications: [],
            reactionMechanism: '',
            realWorldExamples: []
        };
        // Safety warnings
        if (safety === SafetyLevel.EXTREME_DANGER) {
            analysis.safetyWarnings.push('⚠️ EXTREME DANGER: Explosive reaction potential');
            analysis.safetyWarnings.push('Requires specialized safety equipment and procedures');
        }
        else if (safety === SafetyLevel.DANGER) {
            analysis.safetyWarnings.push('⚠️ DANGER: Highly exothermic reaction');
            analysis.safetyWarnings.push('Use proper cooling and controlled addition');
        }
        else if (safety === SafetyLevel.WARNING) {
            analysis.safetyWarnings.push('⚠️ WARNING: Significant heat release');
            analysis.safetyWarnings.push('Monitor temperature carefully');
        }
        // Recommendations based on thermodynamics
        if (thermo.isSpontaneous) {
            analysis.recommendations.push('✅ Thermodynamically favorable reaction');
            analysis.recommendations.push('Consider kinetic factors for reaction rate');
        }
        else {
            analysis.recommendations.push('⚡ External energy input required');
            analysis.recommendations.push('Consider catalysis to lower activation energy');
        }
        // Type-specific applications
        switch (type) {
            case ReactionType.COMBUSTION:
                analysis.industrialApplications.push('Power generation');
                analysis.industrialApplications.push('Heating systems');
                analysis.industrialApplications.push('Internal combustion engines');
                analysis.realWorldExamples.push('Car engines', 'Power plants', 'Home heating');
                break;
            case ReactionType.BIOLOGICAL:
                analysis.industrialApplications.push('Biofuel production');
                analysis.industrialApplications.push('Food processing');
                analysis.realWorldExamples.push('Cellular respiration', 'Fermentation');
                break;
        }
        return analysis;
    }
    /**
     * Calculate equilibrium constant from Gibbs free energy
     */
    calculateEquilibriumConstant(deltaG, temperature) {
        const R = 8.314; // J/(mol·K)
        return Math.exp(-deltaG * 1000 / (R * temperature));
    }
    /**
     * Parse chemical equation to reaction data format
     */
    parseEquationToReactionData(equation) {
        const [reactantSide, productSide] = equation.split('=').map(s => s.trim());
        const parseSpecies = (side) => {
            return side.split('+').map(compound => {
                const trimmed = compound.trim();
                const match = trimmed.match(/^(\d*)\s*(.+)$/);
                if (match) {
                    const coefficient = match[1] ? parseInt(match[1]) : 1;
                    const formula = match[2].trim();
                    return { formula, coefficient };
                }
                return { formula: trimmed, coefficient: 1 };
            });
        };
        return {
            reactants: parseSpecies(reactantSide),
            products: parseSpecies(productSide)
        };
    }
    /**
     * Extract coefficients from balanced equation
     */
    extractCoefficients(equation) {
        const coefficients = {};
        const [reactantSide, productSide] = equation.split('=');
        const extractFromSide = (side) => {
            side.split('+').forEach(compound => {
                const trimmed = compound.trim();
                const match = trimmed.match(/^(\d*)\s*(.+)$/);
                if (match) {
                    const coefficient = match[1] ? parseInt(match[1]) : 1;
                    const formula = match[2].trim();
                    coefficients[formula] = coefficient;
                }
            });
        };
        extractFromSide(reactantSide);
        extractFromSide(productSide);
        return coefficients;
    }
    /**
     * Analyze pressure effects on reaction
     */
    analyzePressureEffects(reactionData) {
        const reactantMoles = reactionData.reactants.reduce((sum, r) => sum + r.coefficient, 0);
        const productMoles = reactionData.products.reduce((sum, p) => sum + p.coefficient, 0);
        const deltaN = productMoles - reactantMoles;
        if (deltaN < 0) {
            return 'High pressure favors products (Le Chatelier\'s principle)';
        }
        else if (deltaN > 0) {
            return 'Low pressure favors products (Le Chatelier\'s principle)';
        }
        else {
            return 'Pressure has minimal effect on equilibrium';
        }
    }
    /**
     * Estimate yield from equilibrium constant
     */
    estimateYieldFromK(K, reactionData) {
        // Simplified yield estimation
        if (K > 1000)
            return 99;
        if (K > 100)
            return 95;
        if (K > 10)
            return 85;
        if (K > 1)
            return 70;
        if (K > 0.1)
            return 50;
        if (K > 0.01)
            return 25;
        return 5;
    }
    /**
     * Get optimal pressure based on reaction stoichiometry
     */
    getOptimalPressure(reactionData) {
        const reactantMoles = reactionData.reactants.reduce((sum, r) => sum + r.coefficient, 0);
        const productMoles = reactionData.products.reduce((sum, p) => sum + p.coefficient, 0);
        // If products have fewer moles, high pressure favors products
        if (productMoles < reactantMoles)
            return 10; // High pressure
        if (productMoles > reactantMoles)
            return 0.1; // Low pressure
        return 1.0; // Standard pressure
    }
    /**
     * Generate optimization reasoning
     */
    generateOptimizationReasoning(temperature, thermo, K) {
        const reasoning = [];
        if (temperature > 298.15) {
            if (thermo.enthalpy > 0) {
                reasoning.push(`Higher temperature (${temperature}K) favors endothermic reaction`);
            }
            else {
                reasoning.push(`Higher temperature (${temperature}K) may reduce yield but increase rate`);
            }
        }
        else {
            reasoning.push(`Standard temperature (${temperature}K) conditions`);
        }
        reasoning.push(`Equilibrium constant K = ${K.toExponential(2)}`);
        reasoning.push(`ΔG° = ${thermo.gibbsFreeEnergy.toFixed(1)} kJ/mol at ${temperature}K`);
        return reasoning;
    }
}

/**
 * Energy Profile Generator
 * Creates visualization-ready energy profile data for chemical reactions
 * Part of CREB-JS v1.6.0 - Energy Profile Visualization Feature
 */
class EnergyProfileGenerator {
    constructor() {
        this.temperature = 298.15; // Default 25°C
        this.pressure = 101325; // Default 1 atm
    }
    /**
     * Generate energy profile from thermodynamics and kinetics data
     */
    generateProfile(thermodynamics, kinetics, customSteps) {
        const points = [];
        let activationEnergyForward = 0;
        let activationEnergyReverse = 0;
        // Start with reactants at energy = 0
        points.push({
            coordinate: 0,
            energy: 0,
            type: 'reactant',
            label: 'Reactants',
            species: this.extractReactants(thermodynamics)
        });
        // Add transition states and intermediates
        if (kinetics?.mechanism && kinetics.mechanism.length > 0) {
            this.addMechanismSteps(points, kinetics.mechanism, thermodynamics.deltaH);
            activationEnergyForward = kinetics.activationEnergy;
            activationEnergyReverse = kinetics.activationEnergy + thermodynamics.deltaH;
        }
        else if (customSteps) {
            this.addCustomSteps(points, customSteps);
        }
        else if (kinetics) {
            // Simple single-step reaction with kinetics data
            this.addSimpleTransitionState(points, thermodynamics, kinetics.activationEnergy);
            activationEnergyForward = kinetics.activationEnergy;
            activationEnergyReverse = kinetics.activationEnergy + thermodynamics.deltaH;
        }
        else {
            // Simple single-step reaction
            this.addSimpleTransitionState(points, thermodynamics);
            activationEnergyForward = this.estimateActivationEnergy(thermodynamics);
            activationEnergyReverse = activationEnergyForward + thermodynamics.deltaH;
        }
        // End with products
        points.push({
            coordinate: 1,
            energy: thermodynamics.deltaH,
            type: 'product',
            label: 'Products',
            species: this.extractProducts(thermodynamics)
        });
        // Find rate-determining step
        const rateDeterminingStep = this.findRateDeterminingStep(points);
        return {
            points,
            deltaE: thermodynamics.deltaH,
            activationEnergyForward,
            activationEnergyReverse,
            steps: points.filter(p => p.type === 'transition-state').length,
            rateDeterminingStep,
            temperature: this.temperature,
            pressure: this.pressure,
            isExothermic: thermodynamics.deltaH < 0
        };
    }
    /**
     * Generate energy profile for multi-step mechanism
     */
    generateMechanismProfile(mechanism, overallThermodynamics) {
        const points = [];
        let currentEnergy = 0;
        // Reactants
        points.push({
            coordinate: 0,
            energy: 0,
            type: 'reactant',
            label: 'Reactants'
        });
        // Process each step
        mechanism.forEach((step, index) => {
            const stepCoordinate = (index + 0.5) / mechanism.length;
            const nextCoordinate = (index + 1) / mechanism.length;
            // Estimate step energetics
            const stepDeltaH = overallThermodynamics.deltaH / mechanism.length;
            const stepActivationE = this.estimateStepActivationEnergy(step, stepDeltaH);
            // Transition state
            points.push({
                coordinate: stepCoordinate,
                energy: currentEnergy + stepActivationE,
                type: 'transition-state',
                label: `TS${index + 1}`,
                species: this.extractSpeciesFromEquation(step.equation)
            });
            // Intermediate or product
            currentEnergy += stepDeltaH;
            if (index < mechanism.length - 1) {
                points.push({
                    coordinate: nextCoordinate,
                    energy: currentEnergy,
                    type: 'intermediate',
                    label: `Intermediate${index + 1}`
                });
            }
        });
        // Final products
        points.push({
            coordinate: 1,
            energy: overallThermodynamics.deltaH,
            type: 'product',
            label: 'Products'
        });
        return {
            points,
            deltaE: overallThermodynamics.deltaH,
            activationEnergyForward: Math.max(...points.filter(p => p.type === 'transition-state').map(p => p.energy)),
            activationEnergyReverse: Math.max(...points.filter(p => p.type === 'transition-state').map(p => p.energy)) + overallThermodynamics.deltaH,
            steps: mechanism.length,
            rateDeterminingStep: this.findRateDeterminingStep(points),
            temperature: this.temperature,
            pressure: this.pressure,
            isExothermic: overallThermodynamics.deltaH < 0
        };
    }
    /**
     * Generate temperature-dependent energy profiles
     */
    generateTemperatureProfiles(thermodynamics, temperatures, kinetics) {
        return temperatures.map(temp => {
            this.temperature = temp;
            // Adjust thermodynamics for temperature
            const adjustedThermo = this.adjustThermodynamicsForTemperature(thermodynamics, temp);
            // Adjust kinetics for temperature
            let adjustedKinetics = kinetics;
            if (kinetics && kinetics.temperatureDependence) {
                adjustedKinetics = this.adjustKineticsForTemperature(kinetics, temp);
            }
            const profile = this.generateProfile(adjustedThermo, adjustedKinetics);
            return { temperature: temp, profile };
        });
    }
    /**
     * Generate reaction coordinate data
     */
    generateReactionCoordinate(reactionType) {
        const coordinates = {
            'SN1': {
                description: 'C-leaving group distance',
                units: 'Å',
                physicalMeaning: 'Bond breaking leads to carbocation formation',
                range: [1.5, 3.5]
            },
            'SN2': {
                description: 'Nucleophile-C-leaving group angle',
                units: 'degrees',
                physicalMeaning: 'Backside attack through linear transition state',
                range: [109, 180]
            },
            'E1': {
                description: 'C-leaving group distance',
                units: 'Å',
                physicalMeaning: 'Elimination via carbocation intermediate',
                range: [1.5, 3.5]
            },
            'E2': {
                description: 'Base-H and C-leaving group distances',
                units: 'Å',
                physicalMeaning: 'Concerted elimination mechanism',
                range: [1.0, 3.0]
            },
            'addition': {
                description: 'C=C bond length',
                units: 'Å',
                physicalMeaning: 'Double bond breaking during addition',
                range: [1.34, 1.54]
            },
            'elimination': {
                description: 'C-C bond distance',
                units: 'Å',
                physicalMeaning: 'Bond formation during elimination',
                range: [1.54, 1.34]
            },
            'substitution': {
                description: 'Bond forming/breaking ratio',
                units: 'dimensionless',
                physicalMeaning: 'Extent of bond formation vs. breaking',
                range: [0, 1]
            }
        };
        return coordinates[reactionType];
    }
    /**
     * Export profile data for visualization libraries
     */
    exportForVisualization(profile, format) {
        switch (format) {
            case 'plotly':
                return this.exportForPlotly(profile);
            case 'chartjs':
                return this.exportForChartJS(profile);
            case 'd3':
                return this.exportForD3(profile);
            case 'csv':
                return this.exportForCSV(profile);
            default:
                throw new Error(`Unsupported export format: ${format}`);
        }
    }
    // Private helper methods
    addMechanismSteps(points, mechanism, deltaH) {
        const stepDeltaH = deltaH / mechanism.length;
        let currentEnergy = 0;
        mechanism.forEach((step, index) => {
            const coordinate = (index + 0.5) / (mechanism.length + 1);
            const activationE = this.estimateStepActivationEnergy(step, stepDeltaH);
            points.push({
                coordinate,
                energy: currentEnergy + activationE,
                type: 'transition-state',
                label: `TS${index + 1}`,
                species: this.extractSpeciesFromEquation(step.equation)
            });
            if (index < mechanism.length - 1) {
                currentEnergy += stepDeltaH;
                points.push({
                    coordinate: (index + 1) / (mechanism.length + 1),
                    energy: currentEnergy,
                    type: 'intermediate',
                    label: `Int${index + 1}`
                });
            }
        });
    }
    addCustomSteps(points, customSteps) {
        customSteps.forEach((ts, index) => {
            points.push({
                coordinate: ts.coordinate,
                energy: ts.energy,
                type: 'transition-state',
                label: `TS${index + 1}`,
                species: ts.involvedSpecies
            });
        });
    }
    addSimpleTransitionState(points, thermodynamics, providedActivationE) {
        const activationE = providedActivationE !== undefined ? providedActivationE : this.estimateActivationEnergy(thermodynamics);
        points.push({
            coordinate: 0.5,
            energy: activationE,
            type: 'transition-state',
            label: 'Transition State'
        });
    }
    estimateActivationEnergy(thermodynamics) {
        // Hammond's postulate: endothermic reactions have late transition states
        const baseActivation = 80; // kJ/mol baseline
        const hammondCorrection = Math.max(0, thermodynamics.deltaH * 0.3);
        return baseActivation + hammondCorrection;
    }
    estimateStepActivationEnergy(step, stepDeltaH) {
        const baseActivation = 60; // kJ/mol for elementary steps
        const thermodynamicCorrection = Math.max(0, stepDeltaH * 0.3);
        // Adjust based on step type
        const typeFactors = {
            'elementary': 1.0,
            'fast-equilibrium': 0.7,
            'rate-determining': 1.5
        };
        return (baseActivation + thermodynamicCorrection) * typeFactors[step.type];
    }
    findRateDeterminingStep(points) {
        const transitionStates = points.filter(p => p.type === 'transition-state');
        if (transitionStates.length === 0)
            return 0;
        const highestEnergy = Math.max(...transitionStates.map(p => p.energy));
        return transitionStates.findIndex(p => p.energy === highestEnergy);
    }
    extractReactants(thermodynamics) {
        // This would need to be implemented based on the actual equation structure
        return ['Reactants'];
    }
    extractProducts(thermodynamics) {
        // This would need to be implemented based on the actual equation structure
        return ['Products'];
    }
    extractSpeciesFromEquation(equation) {
        // Parse equation to extract species
        const parts = equation.split('->')[0].trim().split('+');
        return parts.map(part => part.trim());
    }
    adjustThermodynamicsForTemperature(original, temperature) {
        // Simplified temperature dependence
        const tempRatio = temperature / 298.15;
        return {
            ...original,
            deltaH: original.deltaH * tempRatio,
            deltaG: original.deltaG + original.deltaS * (temperature - 298.15) / 1000,
            conditions: { ...original.conditions, temperature }
        };
    }
    adjustKineticsForTemperature(original, temperature) {
        const arrhenius = original.temperatureDependence;
        const R = 8.314; // J/(mol·K)
        // Arrhenius equation: k = A * exp(-Ea/RT)
        const newRateConstant = arrhenius.preExponentialFactor *
            Math.exp(-arrhenius.activationEnergy * 1000 / (R * temperature));
        return {
            ...original,
            rateConstant: newRateConstant,
            conditions: { ...original.conditions, temperature }
        };
    }
    exportForPlotly(profile) {
        return {
            data: [{
                    x: profile.points.map(p => p.coordinate),
                    y: profile.points.map(p => p.energy),
                    type: 'scatter',
                    mode: 'lines+markers',
                    name: 'Energy Profile',
                    line: { shape: 'spline' },
                    marker: {
                        size: profile.points.map(p => p.type === 'transition-state' ? 10 : 6),
                        color: profile.points.map(p => {
                            switch (p.type) {
                                case 'reactant': return 'blue';
                                case 'product': return 'green';
                                case 'transition-state': return 'red';
                                case 'intermediate': return 'orange';
                                default: return 'gray';
                            }
                        })
                    }
                }],
            layout: {
                title: 'Reaction Energy Profile',
                xaxis: { title: 'Reaction Coordinate' },
                yaxis: { title: 'Energy (kJ/mol)' },
                annotations: profile.points.map(p => ({
                    x: p.coordinate,
                    y: p.energy,
                    text: p.label,
                    showarrow: true,
                    arrowhead: 2
                }))
            }
        };
    }
    exportForChartJS(profile) {
        return {
            type: 'line',
            data: {
                labels: profile.points.map(p => p.coordinate.toFixed(2)),
                datasets: [{
                        label: 'Energy Profile',
                        data: profile.points.map(p => p.energy),
                        borderColor: 'rgb(75, 192, 192)',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        tension: 0.4
                    }]
            },
            options: {
                responsive: true,
                scales: {
                    x: { title: { display: true, text: 'Reaction Coordinate' } },
                    y: { title: { display: true, text: 'Energy (kJ/mol)' } }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            title: (context) => profile.points[context[0].dataIndex].label || '',
                            label: (context) => `Energy: ${context.parsed.y.toFixed(2)} kJ/mol`
                        }
                    }
                }
            }
        };
    }
    exportForD3(profile) {
        return {
            nodes: profile.points.map((p, i) => ({
                id: i,
                x: p.coordinate * 100,
                y: 100 - (p.energy / Math.max(...profile.points.map(pt => pt.energy))) * 80,
                type: p.type,
                label: p.label,
                energy: p.energy
            })),
            links: profile.points.slice(0, -1).map((_, i) => ({
                source: i,
                target: i + 1
            }))
        };
    }
    exportForCSV(profile) {
        const header = 'Coordinate,Energy(kJ/mol),Type,Label';
        const rows = profile.points.map(p => `${p.coordinate},${p.energy},${p.type},"${p.label || ''}"`);
        return [header, ...rows].join('\n');
    }
    /**
     * Set calculation conditions
     */
    setConditions(temperature, pressure) {
        this.temperature = temperature;
        this.pressure = pressure;
    }
    /**
     * Generate energy profile with bond-by-bond analysis
     */
    generateDetailedProfile(thermodynamics, bondChanges) {
        const profile = this.generateProfile(thermodynamics);
        return {
            ...profile,
            bondAnalysis: bondChanges
        };
    }
}
/**
 * Convenience function to create energy profile
 */
function createEnergyProfile(thermodynamics, kinetics, options) {
    const generator = new EnergyProfileGenerator();
    if (options?.temperature || options?.pressure) {
        generator.setConditions(options.temperature || 298.15, options.pressure || 101325);
    }
    return generator.generateProfile(thermodynamics, kinetics);
}
/**
 * Export energy profile for popular visualization libraries
 */
function exportEnergyProfile(profile, format) {
    const generator = new EnergyProfileGenerator();
    return generator.exportForVisualization(profile, format);
}

/**
 * CREB Reaction Kinetics Calculator
 * Core calculator for reaction kinetics analysis
 */
class ReactionKinetics {
    /**
     * Calculate reaction rate constant using Arrhenius equation
     * k = A * exp(-Ea / (R * T))
     */
    static calculateRateConstant(arrhenius, temperature) {
        const { preExponentialFactor, activationEnergy } = arrhenius;
        const energyJoules = activationEnergy * 1000; // Convert kJ/mol to J/mol
        return preExponentialFactor * Math.exp(-energyJoules / (this.GAS_CONSTANT * temperature));
    }
    /**
     * Calculate activation energy from rate constants at two temperatures
     * Ea = R * ln(k2/k1) / (1/T1 - 1/T2)
     */
    static calculateActivationEnergy(k1, T1, k2, T2) {
        const lnRatio = Math.log(k2 / k1);
        const tempTerm = (1 / T1) - (1 / T2);
        return (this.GAS_CONSTANT * lnRatio / tempTerm) / 1000; // Convert to kJ/mol
    }
    /**
     * Generate temperature profile for reaction kinetics
     */
    static generateTemperatureProfile(arrhenius, tempRange, points = 20) {
        const [minTemp, maxTemp] = tempRange;
        const step = (maxTemp - minTemp) / (points - 1);
        return Array.from({ length: points }, (_, i) => {
            const temperature = minTemp + (i * step);
            const rateConstant = this.calculateRateConstant(arrhenius, temperature);
            return {
                temperature,
                rateConstant,
                reactionRate: rateConstant // Base rate (will be modified by concentrations)
            };
        });
    }
    /**
     * Determine reaction class from chemical equation
     */
    static classifyReaction(equation) {
        try {
            const parser = new EquationParser(equation);
            const parsed = parser.parse();
            const reactantCount = parsed.reactants.length;
            // Basic classification based on number of reactants
            if (reactantCount === 1)
                return 'unimolecular';
            if (reactantCount === 2)
                return 'bimolecular';
            if (reactantCount === 3)
                return 'termolecular';
            return 'complex';
        }
        catch {
            return 'complex';
        }
    }
    /**
     * Calculate half-life for first-order reactions
     * t₁/₂ = ln(2) / k
     */
    static calculateHalfLife(rateConstant, order = 1) {
        if (order === 1) {
            return Math.log(2) / rateConstant;
        }
        // For other orders, half-life depends on initial concentration
        // Return NaN to indicate additional parameters needed
        return NaN;
    }
    /**
     * Estimate pre-exponential factor using transition state theory
     * A ≈ (kB * T / h) * exp(ΔS‡ / R)
     */
    static estimatePreExponentialFactor(temperature, entropyOfActivation = 0 // J/(mol·K), default assumes no entropy change
    ) {
        const kB = 1.381e-23; // Boltzmann constant (J/K)
        const h = 6.626e-34; // Planck constant (J·s)
        const frequencyFactor = (kB * temperature) / h;
        const entropyTerm = Math.exp(entropyOfActivation / this.GAS_CONSTANT);
        return frequencyFactor * entropyTerm;
    }
    /**
     * Apply catalyst effect to reaction kinetics
     */
    static applyCatalystEffect(baseKinetics, catalyst) {
        const { effectOnRate, effectOnActivationEnergy } = catalyst;
        return {
            ...baseKinetics,
            rateConstant: (baseKinetics.rateConstant || 0) * effectOnRate,
            activationEnergy: (baseKinetics.activationEnergy || 0) + effectOnActivationEnergy,
            catalystEffect: catalyst
        };
    }
    /**
     * Generate rate law expression
     */
    static generateRateLaw(equation, orders, rateConstant) {
        try {
            const parser = new EquationParser(equation);
            const parsed = parser.parse();
            const reactants = parsed.reactants;
            let rateLaw = `Rate = ${rateConstant.toExponential(3)}`;
            for (const reactant of reactants) {
                const order = orders[reactant] || 1;
                if (order === 1) {
                    rateLaw += `[${reactant}]`;
                }
                else if (order !== 0) {
                    rateLaw += `[${reactant}]^${order}`;
                }
            }
            return rateLaw;
        }
        catch {
            return `Rate = ${rateConstant.toExponential(3)}[A]^n[B]^m`;
        }
    }
    /**
     * Comprehensive kinetics analysis
     */
    static analyzeKinetics(equation, conditions, arrheniusData) {
        const reactionClass = this.classifyReaction(equation);
        // If no Arrhenius data provided, estimate based on reaction type
        const arrhenius = arrheniusData || this.estimateArrheniusParameters(equation, reactionClass);
        const rateConstant = this.calculateRateConstant(arrhenius, conditions.temperature);
        const halfLife = this.calculateHalfLife(rateConstant);
        // Generate basic reaction orders (1 for each reactant by default)
        const parser = new EquationParser(equation);
        const parsed = parser.parse();
        const orders = parsed.reactants.reduce((acc, reactant) => {
            acc[reactant] = 1; // Assume first order in each reactant
            return acc;
        }, {});
        const overallOrder = Object.values(orders).reduce((sum, order) => sum + order, 0);
        const rateLaw = this.generateRateLaw(equation, orders, rateConstant);
        return {
            equation,
            rateConstant,
            activationEnergy: arrhenius.activationEnergy,
            reactionOrder: overallOrder,
            mechanism: [{
                    equation,
                    type: 'elementary',
                    rateConstant,
                    order: orders,
                    mechanism: 'Single-step elementary reaction'
                }],
            temperatureDependence: arrhenius,
            rateLaw,
            conditions,
            halfLife: isFinite(halfLife) ? halfLife : undefined,
            confidence: arrheniusData ? 0.8 : 0.5, // Lower confidence for estimates
            dataSource: arrheniusData ? 'literature' : 'estimated'
        };
    }
    /**
     * Estimate Arrhenius parameters for unknown reactions
     */
    static estimateArrheniusParameters(equation, reactionClass) {
        // Rough estimates based on reaction class
        const estimates = {
            unimolecular: { A: 1e13, Ea: 150 }, // s⁻¹, kJ/mol
            bimolecular: { A: 1e10, Ea: 50 }, // M⁻¹s⁻¹, kJ/mol
            termolecular: { A: 1e6, Ea: 25 }, // M⁻²s⁻¹, kJ/mol
            'enzyme-catalyzed': { A: 1e7, Ea: 40 },
            autocatalytic: { A: 1e8, Ea: 60 },
            'chain-reaction': { A: 1e12, Ea: 30 },
            oscillating: { A: 1e9, Ea: 70 },
            complex: { A: 1e9, Ea: 80 }
        };
        const { A, Ea } = estimates[reactionClass] || estimates.complex;
        return {
            preExponentialFactor: A,
            activationEnergy: Ea,
            temperatureRange: [250, 500], // K
            rSquared: 0.5 // Low confidence for estimates
        };
    }
}
ReactionKinetics.GAS_CONSTANT = 8.314; // J/(mol·K)
ReactionKinetics.KELVIN_CELSIUS_OFFSET = 273.15;

var calculator = /*#__PURE__*/Object.freeze({
    __proto__: null,
    ReactionKinetics: ReactionKinetics
});

/**
 * CREB Reaction Mechanism Analyzer
 * Analyzes complex reaction mechanisms and pathways
 */
class MechanismAnalyzer {
    /**
     * Analyze a multi-step reaction mechanism
     */
    static analyzeMechanism(steps, conditions) {
        // Find intermediates (species that appear as both products and reactants)
        const intermediates = this.findIntermediates(steps);
        // Find catalysts (species that appear on both sides but are not consumed)
        const catalysts = this.findCatalysts(steps);
        // Determine rate-determining step
        const rateDeterminingStep = this.findRateDeterminingStep(steps);
        // Generate overall reaction equation
        const overallReaction = this.deriveOverallReaction(steps);
        // Apply steady-state approximation
        const rateExpression = this.deriveSteadyStateRateExpression(steps, intermediates);
        // Determine valid approximations
        const approximations = this.identifyValidApproximations(steps, conditions);
        return {
            mechanism: steps,
            overallReaction,
            rateExpression,
            rateDeterminingStep,
            intermediates,
            catalysts,
            approximations,
            validity: {
                steadyState: intermediates.length > 0,
                preEquilibrium: this.hasPreEquilibrium(steps),
                rateApproximation: rateDeterminingStep >= 0
            },
            confidence: this.calculateMechanismConfidence(steps, approximations)
        };
    }
    /**
     * Compare two competing reaction pathways
     */
    static comparePathways(pathway1, pathway2, conditions) {
        const analysis1 = this.analyzeMechanism(pathway1, conditions);
        const analysis2 = this.analyzeMechanism(pathway2, conditions);
        // Calculate overall rate constants for comparison
        const rate1 = this.calculateOverallRate(pathway1, conditions);
        const rate2 = this.calculateOverallRate(pathway2, conditions);
        const selectivityFactor = rate1 / rate2;
        const preferredPathway = rate1 > rate2 ? 1 : 2;
        const reasons = this.generateComparisonReasons(analysis1, analysis2, rate1, rate2);
        return {
            pathway1: analysis1,
            pathway2: analysis2,
            preferredPathway,
            reasons,
            selectivityFactor
        };
    }
    /**
     * Apply pre-equilibrium approximation
     */
    static applyPreEquilibriumApproximation(steps, equilibriumSteps) {
        // For fast pre-equilibrium steps, assume rapid equilibrium
        // K_eq = k_forward / k_reverse
        let rateExpression = "Rate = ";
        const slowStep = steps.find(step => !equilibriumSteps.includes(step.stepNumber));
        if (slowStep) {
            rateExpression += `k${slowStep.stepNumber}`;
            // Add concentration terms modified by equilibrium constants
            equilibriumSteps.forEach(stepNum => {
                const step = steps.find(s => s.stepNumber === stepNum);
                if (step && step.reverseRateConstant) {
                    const keq = step.rateConstant / step.reverseRateConstant;
                    rateExpression += ` × K${stepNum}(${keq.toExponential(2)})`;
                }
            });
        }
        return rateExpression;
    }
    /**
     * Apply steady-state approximation
     */
    static applySteadyStateApproximation(steps, steadyStateSpecies) {
        // For steady-state species: d[I]/dt = 0
        // Rate of formation = Rate of consumption
        let rateExpression = "Rate = ";
        // Simplified: find the slowest step
        const slowestStep = steps.reduce((prev, current) => prev.rateConstant < current.rateConstant ? prev : current);
        rateExpression += `k${slowestStep.stepNumber}`;
        // Add pre-equilibrium factors if applicable
        steadyStateSpecies.forEach(species => {
            rateExpression += `[${species}]_ss`;
        });
        return rateExpression;
    }
    /**
     * Find species that appear as both products and reactants (intermediates)
     */
    static findIntermediates(steps) {
        const products = new Set();
        const reactants = new Set();
        steps.forEach(step => {
            try {
                const parser = new EquationParser(step.equation);
                const parsed = parser.parse();
                parsed.reactants.forEach(r => reactants.add(r));
                parsed.products.forEach(p => products.add(p));
            }
            catch {
                // Skip invalid equations
            }
        });
        // Intermediates appear in both sets
        return Array.from(products).filter(species => reactants.has(species));
    }
    /**
     * Find species that appear on both sides but are not consumed (catalysts)
     */
    static findCatalysts(steps) {
        const speciesBalance = {};
        steps.forEach(step => {
            try {
                const parser = new EquationParser(step.equation);
                const parsed = parser.parse();
                // Subtract reactants, add products
                parsed.reactants.forEach(r => {
                    speciesBalance[r] = (speciesBalance[r] || 0) - 1;
                });
                parsed.products.forEach(p => {
                    speciesBalance[p] = (speciesBalance[p] || 0) + 1;
                });
            }
            catch {
                // Skip invalid equations
            }
        });
        // Catalysts have net balance of zero
        return Object.keys(speciesBalance).filter(species => speciesBalance[species] === 0);
    }
    /**
     * Identify the rate-determining step (slowest step)
     */
    static findRateDeterminingStep(steps) {
        let slowestStep = steps[0];
        let slowestIndex = 0;
        steps.forEach((step, index) => {
            if (step.rateConstant < slowestStep.rateConstant) {
                slowestStep = step;
                slowestIndex = index;
            }
        });
        return slowestIndex;
    }
    /**
     * Derive overall reaction from mechanism steps
     */
    static deriveOverallReaction(steps) {
        const netReactants = {};
        const netProducts = {};
        steps.forEach(step => {
            try {
                const parser = new EquationParser(step.equation);
                const parsed = parser.parse();
                parsed.reactants.forEach(r => {
                    netReactants[r] = (netReactants[r] || 0) + 1;
                });
                parsed.products.forEach(p => {
                    netProducts[p] = (netProducts[p] || 0) + 1;
                });
            }
            catch {
                // Skip invalid equations
            }
        });
        // Remove intermediates (species that appear on both sides)
        const allSpecies = new Set([...Object.keys(netReactants), ...Object.keys(netProducts)]);
        allSpecies.forEach(species => {
            const reactantCount = netReactants[species] || 0;
            const productCount = netProducts[species] || 0;
            if (reactantCount > 0 && productCount > 0) {
                const minCount = Math.min(reactantCount, productCount);
                netReactants[species] -= minCount;
                netProducts[species] -= minCount;
                if (netReactants[species] === 0)
                    delete netReactants[species];
                if (netProducts[species] === 0)
                    delete netProducts[species];
            }
        });
        // Build equation string
        const reactantStr = Object.entries(netReactants)
            .filter(([_, count]) => count > 0)
            .map(([species, count]) => count > 1 ? `${count}${species}` : species)
            .join(' + ');
        const productStr = Object.entries(netProducts)
            .filter(([_, count]) => count > 0)
            .map(([species, count]) => count > 1 ? `${count}${species}` : species)
            .join(' + ');
        return `${reactantStr} = ${productStr}`;
    }
    /**
     * Derive rate expression using steady-state approximation
     */
    static deriveSteadyStateRateExpression(steps, intermediates) {
        if (intermediates.length === 0) {
            // Simple elementary reaction
            const step = steps[0];
            return `Rate = k${step.stepNumber}[reactants]`;
        }
        // Complex mechanism - simplified steady-state treatment
        const rateDeterminingStep = this.findRateDeterminingStep(steps);
        const rdsStep = steps[rateDeterminingStep];
        return `Rate = k${rdsStep.stepNumber}[reactants] (steady-state approximation)`;
    }
    /**
     * Check if mechanism has pre-equilibrium steps
     */
    static hasPreEquilibrium(steps) {
        return steps.some(step => step.type === 'fast-equilibrium' || step.reverseRateConstant !== undefined);
    }
    /**
     * Identify valid approximations for the mechanism
     */
    static identifyValidApproximations(steps, conditions) {
        const approximations = [];
        // Check for pre-equilibrium
        if (this.hasPreEquilibrium(steps)) {
            approximations.push('Pre-equilibrium approximation');
        }
        // Check for steady-state intermediates
        const intermediates = this.findIntermediates(steps);
        if (intermediates.length > 0) {
            approximations.push('Steady-state approximation');
        }
        // Check for rate-determining step
        const rateDeterminingStep = this.findRateDeterminingStep(steps);
        if (rateDeterminingStep >= 0) {
            approximations.push('Rate-determining step approximation');
        }
        return approximations;
    }
    /**
     * Calculate overall reaction rate for pathway comparison
     */
    static calculateOverallRate(steps, conditions) {
        // Simplified: use the slowest step as the overall rate
        const rateDeterminingStep = this.findRateDeterminingStep(steps);
        const rdsStep = steps[rateDeterminingStep];
        // Apply temperature dependence (simplified)
        const temperatureFactor = Math.exp(-5e4 / (8.314 * conditions.temperature)); // Rough estimate
        return rdsStep.rateConstant * temperatureFactor;
    }
    /**
     * Generate reasons for pathway preference
     */
    static generateComparisonReasons(analysis1, analysis2, rate1, rate2) {
        const reasons = [];
        if (rate1 > rate2) {
            reasons.push(`Pathway 1 is ${(rate1 / rate2).toFixed(2)}x faster`);
        }
        else {
            reasons.push(`Pathway 2 is ${(rate2 / rate1).toFixed(2)}x faster`);
        }
        if (analysis1.intermediates.length < analysis2.intermediates.length) {
            reasons.push('Pathway 1 has fewer intermediates');
        }
        else if (analysis2.intermediates.length < analysis1.intermediates.length) {
            reasons.push('Pathway 2 has fewer intermediates');
        }
        if (analysis1.confidence > analysis2.confidence) {
            reasons.push('Pathway 1 has higher mechanistic confidence');
        }
        else if (analysis2.confidence > analysis1.confidence) {
            reasons.push('Pathway 2 has higher mechanistic confidence');
        }
        return reasons;
    }
    /**
     * Calculate confidence in mechanism analysis
     */
    static calculateMechanismConfidence(steps, approximations) {
        let confidence = 0.5; // Base confidence
        // Higher confidence for well-defined mechanisms
        if (steps.length > 1 && steps.length <= 5)
            confidence += 0.2;
        // Higher confidence if approximations are valid
        if (approximations.length > 0)
            confidence += 0.1 * approximations.length;
        // Lower confidence for complex mechanisms
        if (steps.length > 5)
            confidence -= 0.1;
        return Math.min(Math.max(confidence, 0), 1);
    }
}

var mechanismAnalyzer = /*#__PURE__*/Object.freeze({
    __proto__: null,
    MechanismAnalyzer: MechanismAnalyzer
});

/**
 * CREB Reaction Safety Analyzer
 * Analyzes reaction safety and provides hazard assessments
 */
class ReactionSafetyAnalyzer {
    /**
     * Perform comprehensive safety assessment of a reaction
     */
    static assessReactionSafety(equation, conditions, kineticsData) {
        // Parse the reaction to identify compounds
        const compounds = this.extractCompoundsFromEquation(equation);
        // Assess individual compound hazards
        const compoundHazards = compounds.map(compound => this.getCompoundSafetyData(compound)).filter(Boolean);
        // Analyze thermal hazards
        const thermalHazards = this.assessThermalHazards(equation, conditions, kineticsData);
        // Analyze chemical hazards
        const chemicalHazards = this.assessChemicalHazards(compoundHazards, conditions);
        // Analyze physical hazards
        const physicalHazards = this.assessPhysicalHazards(conditions, compoundHazards);
        // Analyze environmental hazards
        const environmentalHazards = this.assessEnvironmentalHazards(compoundHazards);
        // Calculate overall risk
        const riskScore = this.calculateRiskScore(thermalHazards, chemicalHazards, physicalHazards);
        const overallRiskLevel = this.determineRiskLevel(riskScore);
        // Generate recommendations
        const recommendations = this.generateSafetyRecommendations(overallRiskLevel, thermalHazards, chemicalHazards, physicalHazards);
        // Determine required PPE
        const requiredPPE = this.determineRequiredPPE(compoundHazards, overallRiskLevel);
        // Determine containment level
        const containmentLevel = this.determineContainmentLevel(overallRiskLevel, compoundHazards);
        // Identify monitoring parameters
        const monitoringParameters = this.identifyMonitoringParameters(compoundHazards, conditions);
        // Generate emergency procedures
        const emergencyProcedures = this.generateEmergencyProcedures(overallRiskLevel, compoundHazards);
        return {
            equation,
            overallRiskLevel,
            conditions,
            hazards: {
                thermal: thermalHazards,
                chemical: chemicalHazards,
                physical: physicalHazards,
                environmental: environmentalHazards
            },
            recommendations,
            requiredPPE,
            containmentLevel,
            monitoringParameters,
            emergencyProcedures,
            riskScore
        };
    }
    /**
     * Extract all chemical compounds from equation
     */
    static extractCompoundsFromEquation(equation) {
        try {
            const parser = new EquationParser(equation);
            const parsed = parser.parse();
            return [...parsed.reactants, ...parsed.products];
        }
        catch {
            return [];
        }
    }
    /**
     * Get safety data for a specific compound
     */
    static getCompoundSafetyData(compound) {
        // Check our database first
        if (this.HAZARDOUS_COMPOUNDS.has(compound)) {
            return this.HAZARDOUS_COMPOUNDS.get(compound);
        }
        // Estimate safety data for unknown compounds
        return this.estimateCompoundSafety(compound);
    }
    /**
     * Estimate safety data for unknown compounds
     */
    static estimateCompoundSafety(compound) {
        // Basic estimation based on molecular features
        let hazardClass = 'moderate';
        const physicalHazards = [];
        const healthHazards = [];
        const environmentalHazards = [];
        // Simple heuristics
        if (compound.includes('F')) {
            hazardClass = 'high';
            healthHazards.push('Potentially corrosive');
        }
        if (compound.includes('Cl') || compound.includes('Br')) {
            hazardClass = 'moderate';
            environmentalHazards.push('Potentially harmful to aquatic life');
        }
        if (compound.length === 2 && /^[A-Z][a-z]?$/.test(compound)) {
            // Likely an element
            physicalHazards.push('Elemental reactivity');
        }
        return {
            compound,
            hazardClass,
            toxicity: {
                classification: 'harmful',
                carcinogen: false,
                mutagen: false,
                teratogen: false
            },
            reactivity: {
                incompatibilities: [],
                hazardousDecomposition: [],
                polymerization: 'stable',
                waterReactive: false,
                airSensitive: false,
                lightSensitive: false,
                shockSensitive: false
            },
            physicalHazards,
            healthHazards,
            environmentalHazards
        };
    }
    /**
     * Assess thermal hazards
     */
    static assessThermalHazards(equation, conditions, kineticsData) {
        const hazards = [];
        // High temperature warning
        if (conditions.temperature > 373) { // Above 100°C
            hazards.push({
                type: 'exothermic',
                severity: conditions.temperature > 573 ? 'high' : 'moderate',
                description: `High reaction temperature (${conditions.temperature - 273.15}°C)`,
                mitigationStrategies: [
                    'Use appropriate heating equipment',
                    'Monitor temperature continuously',
                    'Ensure adequate cooling capability'
                ]
            });
        }
        // Pressure hazard
        if (conditions.pressure && conditions.pressure > 5) {
            hazards.push({
                type: 'explosion',
                severity: conditions.pressure > 20 ? 'high' : 'moderate',
                description: `High pressure conditions (${conditions.pressure} atm)`,
                mitigationStrategies: [
                    'Use pressure-rated equipment',
                    'Install pressure relief systems',
                    'Monitor pressure continuously'
                ]
            });
        }
        // Runaway reaction potential
        if (kineticsData && kineticsData.activationEnergy < 50) {
            hazards.push({
                type: 'runaway',
                severity: 'high',
                description: 'Low activation energy may lead to runaway reaction',
                mitigationStrategies: [
                    'Use thermal mass to moderate heating',
                    'Install emergency cooling',
                    'Monitor reaction rate carefully'
                ]
            });
        }
        return hazards;
    }
    /**
     * Assess chemical hazards
     */
    static assessChemicalHazards(compoundHazards, conditions) {
        const hazards = [];
        // Check for toxic compounds
        const toxicCompounds = compoundHazards.filter(c => c.toxicity.classification === 'toxic' || c.toxicity.classification === 'very-toxic');
        if (toxicCompounds.length > 0) {
            hazards.push({
                type: 'toxic-gas',
                compounds: toxicCompounds.map(c => c.compound),
                severity: toxicCompounds.some(c => c.toxicity.classification === 'very-toxic') ? 'extreme' : 'high',
                description: 'Reaction involves toxic compounds',
                mitigationStrategies: [
                    'Use in well-ventilated area or fume hood',
                    'Wear appropriate respiratory protection',
                    'Have antidotes/treatments readily available'
                ]
            });
        }
        // Check for corrosive compounds
        const corrosiveCompounds = compoundHazards.filter(c => c.physicalHazards.some(h => h.toLowerCase().includes('corrosive')));
        if (corrosiveCompounds.length > 0) {
            hazards.push({
                type: 'corrosive',
                compounds: corrosiveCompounds.map(c => c.compound),
                severity: 'high',
                description: 'Reaction involves corrosive materials',
                mitigationStrategies: [
                    'Use corrosion-resistant equipment',
                    'Wear acid-resistant PPE',
                    'Have neutralizing agents available'
                ]
            });
        }
        return hazards;
    }
    /**
     * Assess physical hazards
     */
    static assessPhysicalHazards(conditions, compoundHazards) {
        const hazards = [];
        // Temperature hazards
        if (conditions.temperature > 373 || conditions.temperature < 273) {
            hazards.push({
                type: 'temperature',
                severity: Math.abs(conditions.temperature - 298) > 200 ? 'high' : 'moderate',
                description: 'Extreme temperature conditions',
                mitigationStrategies: [
                    'Use appropriate temperature-rated equipment',
                    'Protect against thermal burns/frostbite',
                    'Monitor temperature continuously'
                ]
            });
        }
        // Pressure hazards
        if (conditions.pressure && conditions.pressure > 1) {
            hazards.push({
                type: 'pressure',
                severity: conditions.pressure > 10 ? 'high' : 'moderate',
                description: 'Elevated pressure conditions',
                mitigationStrategies: [
                    'Use pressure-rated vessels',
                    'Install pressure relief devices',
                    'Regular equipment inspection'
                ]
            });
        }
        return hazards;
    }
    /**
     * Assess environmental hazards
     */
    static assessEnvironmentalHazards(compoundHazards) {
        const hazards = [];
        const environmentallyHazardous = compoundHazards.filter(c => c.environmentalHazards.length > 0);
        if (environmentallyHazardous.length > 0) {
            hazards.push({
                type: 'aquatic-toxic',
                compounds: environmentallyHazardous.map(c => c.compound),
                severity: 'moderate',
                description: 'Compounds may be harmful to environment',
                mitigationStrategies: [
                    'Proper waste disposal procedures',
                    'Prevent release to environment',
                    'Use containment measures'
                ]
            });
        }
        return hazards;
    }
    /**
     * Calculate overall risk score
     */
    static calculateRiskScore(thermal, chemical, physical) {
        const severityToScore = { low: 10, moderate: 25, high: 50, extreme: 100 };
        let score = 0;
        thermal.forEach(h => score += severityToScore[h.severity]);
        chemical.forEach(h => score += severityToScore[h.severity]);
        physical.forEach(h => score += severityToScore[h.severity]);
        return Math.min(score, 100);
    }
    /**
     * Determine overall risk level from score
     */
    static determineRiskLevel(score) {
        if (score >= 75)
            return 'extreme';
        if (score >= 50)
            return 'high';
        if (score >= 25)
            return 'moderate';
        return 'low';
    }
    /**
     * Generate safety recommendations
     */
    static generateSafetyRecommendations(riskLevel, thermal, chemical, physical) {
        const recommendations = [];
        // Always include basic safety recommendations
        recommendations.push({
            category: 'equipment',
            priority: 'medium',
            description: 'Use appropriate personal protective equipment',
            implementation: 'Ensure all personnel wear required PPE before handling chemicals'
        });
        recommendations.push({
            category: 'procedure',
            priority: 'medium',
            description: 'Follow standard laboratory safety procedures',
            implementation: 'Adhere to established protocols for chemical handling and storage'
        });
        // Risk-level based recommendations
        if (riskLevel === 'extreme') {
            recommendations.push({
                category: 'procedure',
                priority: 'critical',
                description: 'Expert supervision required',
                implementation: 'Ensure experienced personnel supervise all operations'
            });
        }
        if (riskLevel === 'high' || riskLevel === 'extreme') {
            recommendations.push({
                category: 'emergency',
                priority: 'high',
                description: 'Emergency response plan required',
                implementation: 'Develop and practice emergency procedures'
            });
        }
        // Hazard-specific recommendations
        thermal.forEach(hazard => {
            hazard.mitigationStrategies.forEach(strategy => {
                recommendations.push({
                    category: 'equipment',
                    priority: hazard.severity === 'extreme' ? 'critical' : 'high',
                    description: strategy,
                    implementation: `Implement for thermal hazard: ${hazard.description}`
                });
            });
        });
        return recommendations;
    }
    /**
     * Determine required PPE
     */
    static determineRequiredPPE(compoundHazards, riskLevel) {
        const ppe = new Set();
        // Base PPE
        ppe.add('Safety glasses');
        ppe.add('Lab coat');
        ppe.add('Closed-toe shoes');
        // Risk-level based PPE
        if (riskLevel === 'moderate' || riskLevel === 'high' || riskLevel === 'extreme') {
            ppe.add('Chemical-resistant gloves');
        }
        if (riskLevel === 'high' || riskLevel === 'extreme') {
            ppe.add('Face shield');
            ppe.add('Respirator');
        }
        if (riskLevel === 'extreme') {
            ppe.add('Full chemical suit');
            ppe.add('Self-contained breathing apparatus');
        }
        // Compound-specific PPE
        compoundHazards.forEach(compound => {
            if (compound.toxicity.classification === 'very-toxic') {
                ppe.add('Respiratory protection');
            }
            if (compound.physicalHazards.some(h => h.includes('corrosive'))) {
                ppe.add('Acid-resistant apron');
            }
        });
        return Array.from(ppe);
    }
    /**
     * Determine containment level
     */
    static determineContainmentLevel(riskLevel, compoundHazards) {
        if (riskLevel === 'extreme')
            return 'specialized';
        if (riskLevel === 'high')
            return 'enhanced';
        const hasHighlyToxic = compoundHazards.some(c => c.toxicity.classification === 'very-toxic');
        return hasHighlyToxic ? 'enhanced' : 'standard';
    }
    /**
     * Identify monitoring parameters
     */
    static identifyMonitoringParameters(compoundHazards, conditions) {
        const parameters = new Set();
        // Always monitor these
        parameters.add('Temperature');
        if (conditions.pressure && conditions.pressure > 1) {
            parameters.add('Pressure');
        }
        // Compound-specific monitoring
        compoundHazards.forEach(compound => {
            if (compound.toxicity.classification === 'toxic' || compound.toxicity.classification === 'very-toxic') {
                parameters.add(`${compound.compound} concentration`);
            }
            if (compound.physicalHazards.some(h => h.includes('gas'))) {
                parameters.add('Gas leak detection');
            }
        });
        return Array.from(parameters);
    }
    /**
     * Generate emergency procedures
     */
    static generateEmergencyProcedures(riskLevel, compoundHazards) {
        const procedures = [];
        // Base procedures
        procedures.push('Know location of emergency equipment');
        procedures.push('Know evacuation routes');
        if (riskLevel === 'moderate' || riskLevel === 'high' || riskLevel === 'extreme') {
            procedures.push('Emergency shutdown procedures');
            procedures.push('Spill cleanup procedures');
        }
        if (riskLevel === 'high' || riskLevel === 'extreme') {
            procedures.push('Emergency decontamination procedures');
            procedures.push('Emergency medical response');
        }
        // Compound-specific procedures
        const hasToxic = compoundHazards.some(c => c.toxicity.classification === 'toxic' || c.toxicity.classification === 'very-toxic');
        if (hasToxic) {
            procedures.push('Exposure response procedures');
            procedures.push('Antidote administration if applicable');
        }
        return procedures;
    }
}
ReactionSafetyAnalyzer.HAZARDOUS_COMPOUNDS = new Map([
    ['H2', {
            compound: 'H2',
            hazardClass: 'high',
            flashPoint: -253,
            autoIgnitionTemp: 500,
            explosiveLimits: [4, 75],
            toxicity: {
                classification: 'non-toxic',
                carcinogen: false,
                mutagen: false,
                teratogen: false
            },
            reactivity: {
                incompatibilities: ['F2', 'Cl2', 'O2', 'oxidizing agents'],
                hazardousDecomposition: [],
                polymerization: 'stable',
                waterReactive: false,
                airSensitive: false,
                lightSensitive: false,
                shockSensitive: false
            },
            physicalHazards: ['Flammable gas', 'Asphyxiant', 'Pressure hazard'],
            healthHazards: ['Asphyxiant'],
            environmentalHazards: []
        }],
    ['Cl2', {
            compound: 'Cl2',
            hazardClass: 'extreme',
            toxicity: {
                lc50Inhalation: 0.293,
                classification: 'very-toxic',
                carcinogen: false,
                mutagen: false,
                teratogen: false
            },
            reactivity: {
                incompatibilities: ['H2', 'NH3', 'hydrocarbons', 'metals'],
                hazardousDecomposition: ['HCl'],
                polymerization: 'stable',
                waterReactive: true,
                airSensitive: false,
                lightSensitive: true,
                shockSensitive: false
            },
            physicalHazards: ['Corrosive gas', 'Pressure hazard'],
            healthHazards: ['Severe respiratory irritant', 'Corrosive to tissues'],
            environmentalHazards: ['Aquatic toxin', 'Ozone depleting']
        }],
    ['HF', {
            compound: 'HF',
            hazardClass: 'extreme',
            toxicity: {
                ld50Oral: 15,
                ld50Dermal: 410,
                lc50Inhalation: 0.342,
                classification: 'very-toxic',
                carcinogen: false,
                mutagen: false,
                teratogen: false
            },
            reactivity: {
                incompatibilities: ['glass', 'metals', 'silicates'],
                hazardousDecomposition: ['F2'],
                polymerization: 'stable',
                waterReactive: false,
                airSensitive: false,
                lightSensitive: false,
                shockSensitive: false
            },
            physicalHazards: ['Highly corrosive'],
            healthHazards: ['Severe burns', 'Bone and teeth damage', 'Systemic toxicity'],
            environmentalHazards: ['Aquatic toxin']
        }]
]);

var safetyAnalyzer = /*#__PURE__*/Object.freeze({
    __proto__: null,
    ReactionSafetyAnalyzer: ReactionSafetyAnalyzer
});

/**
 * CREB Advanced Kinetics & Analytics Module
 * Entry point for reaction kinetics analysis, mechanism studies, and safety assessment
 */
// Core kinetics calculator
/**
 * Comprehensive Kinetics Analysis Suite
 * Combines kinetics, mechanism, and safety analysis
 */
class AdvancedKineticsAnalyzer {
    /**
     * Perform comprehensive analysis of a chemical reaction
     * Includes kinetics, mechanism analysis, and safety assessment
     */
    static async analyzeReaction(equation, conditions, options = {}) {
        const { includeKinetics = true, includeMechanism = false, includeSafety = true, mechanismSteps = [] } = options;
        const results = {
            equation,
            conditions,
            timestamp: new Date().toISOString()
        };
        try {
            // Kinetics analysis
            if (includeKinetics) {
                const { ReactionKinetics } = await Promise.resolve().then(function () { return calculator; });
                results.kinetics = ReactionKinetics.analyzeKinetics(equation, conditions);
            }
            // Mechanism analysis
            if (includeMechanism && mechanismSteps.length > 0) {
                const { MechanismAnalyzer } = await Promise.resolve().then(function () { return mechanismAnalyzer; });
                results.mechanism = MechanismAnalyzer.analyzeMechanism(mechanismSteps, conditions);
            }
            // Safety analysis
            if (includeSafety) {
                const { ReactionSafetyAnalyzer } = await Promise.resolve().then(function () { return safetyAnalyzer; });
                results.safety = ReactionSafetyAnalyzer.assessReactionSafety(equation, conditions, results.kinetics);
            }
            // Generate summary
            results.summary = this.generateAnalysisSummary(results);
            return results;
        }
        catch (error) {
            return {
                ...results,
                error: error instanceof Error ? error.message : 'Unknown error occurred',
                success: false
            };
        }
    }
    /**
     * Compare multiple reaction pathways
     */
    static async compareReactionPathways(pathways) {
        const analyses = await Promise.all(pathways.map(pathway => this.analyzeReaction(pathway.equation, pathway.conditions, {
            includeKinetics: true,
            includeMechanism: !!pathway.mechanismSteps,
            includeSafety: true,
            mechanismSteps: pathway.mechanismSteps || []
        })));
        // Find the most favorable pathway
        const rankedPathways = analyses
            .map((analysis, index) => ({
            index,
            analysis,
            score: this.calculatePathwayScore(analysis)
        }))
            .sort((a, b) => b.score - a.score);
        return {
            pathways: analyses,
            recommendation: rankedPathways[0],
            comparison: this.generatePathwayComparison(rankedPathways)
        };
    }
    /**
     * Generate temperature-dependent kinetics profile
     */
    static async generateTemperatureProfile(equation, temperatureRange, baseConditions, points = 10) {
        const { ReactionKinetics } = await Promise.resolve().then(function () { return calculator; });
        const [minTemp, maxTemp] = temperatureRange;
        const step = (maxTemp - minTemp) / (points - 1);
        const profile = [];
        for (let i = 0; i < points; i++) {
            const temperature = minTemp + (i * step);
            const conditions = { ...baseConditions, temperature };
            const kinetics = ReactionKinetics.analyzeKinetics(equation, conditions);
            profile.push({
                temperature,
                temperatureCelsius: temperature - 273.15,
                rateConstant: kinetics.rateConstant,
                halfLife: kinetics.halfLife,
                activationEnergy: kinetics.activationEnergy
            });
        }
        return {
            equation,
            temperatureRange,
            profile,
            summary: {
                temperatureRangeCelsius: [minTemp - 273.15, maxTemp - 273.15],
                rateConstantRange: [
                    Math.min(...profile.map(p => p.rateConstant)),
                    Math.max(...profile.map(p => p.rateConstant))
                ],
                averageActivationEnergy: profile.reduce((sum, p) => sum + p.activationEnergy, 0) / profile.length
            }
        };
    }
    /**
     * Generate analysis summary
     */
    static generateAnalysisSummary(results) {
        const summaryParts = [];
        if (results.kinetics) {
            const k = results.kinetics;
            summaryParts.push(`Kinetics: Rate constant = ${k.rateConstant.toExponential(2)} at ${(k.conditions.temperature - 273.15).toFixed(1)}°C`);
            summaryParts.push(`Activation energy = ${k.activationEnergy.toFixed(1)} kJ/mol`);
            if (k.halfLife) {
                summaryParts.push(`Half-life = ${k.halfLife.toExponential(2)} s`);
            }
        }
        if (results.mechanism) {
            const m = results.mechanism;
            summaryParts.push(`Mechanism: ${m.mechanism.length} steps, ${m.intermediates.length} intermediates`);
            summaryParts.push(`Rate-determining step: ${m.rateDeterminingStep + 1}`);
        }
        if (results.safety) {
            const s = results.safety;
            summaryParts.push(`Safety: ${s.overallRiskLevel.toUpperCase()} risk (score: ${s.riskScore})`);
            summaryParts.push(`PPE required: ${s.requiredPPE.join(', ')}`);
            summaryParts.push(`Containment: ${s.containmentLevel}`);
        }
        return summaryParts.join('\n');
    }
    /**
     * Calculate pathway score for comparison
     */
    static calculatePathwayScore(analysis) {
        let score = 50; // Base score
        // Kinetics factors
        if (analysis.kinetics) {
            const k = analysis.kinetics;
            // Higher rate constant is better (within reason)
            if (k.rateConstant > 1e-3 && k.rateConstant < 1e3) {
                score += 10;
            }
            // Moderate activation energy is preferred
            if (k.activationEnergy > 20 && k.activationEnergy < 150) {
                score += 10;
            }
            // Higher confidence is better
            score += k.confidence * 20;
        }
        // Safety factors
        if (analysis.safety) {
            const s = analysis.safety;
            // Lower risk is better
            const riskPenalty = {
                'low': 0,
                'moderate': -10,
                'high': -25,
                'extreme': -50
            };
            score += riskPenalty[s.overallRiskLevel] || 0;
            // Fewer hazards is better
            const totalHazards = s.hazards.thermal.length +
                s.hazards.chemical.length +
                s.hazards.physical.length;
            score -= totalHazards * 5;
        }
        // Mechanism factors
        if (analysis.mechanism) {
            const m = analysis.mechanism;
            // Simpler mechanisms are often preferred
            score += Math.max(0, 20 - m.mechanism.length * 3);
            // Higher confidence is better
            score += m.confidence * 15;
        }
        return Math.max(0, Math.min(100, score));
    }
    /**
     * Generate pathway comparison summary
     */
    static generatePathwayComparison(rankedPathways) {
        if (rankedPathways.length < 2) {
            return 'Insufficient pathways for comparison';
        }
        const best = rankedPathways[0];
        const comparison = [];
        comparison.push(`Recommended pathway: ${best.analysis.equation} (Score: ${best.score.toFixed(1)})`);
        // Compare with next best
        for (let i = 1; i < Math.min(3, rankedPathways.length); i++) {
            const alt = rankedPathways[i];
            const scoreDiff = best.score - alt.score;
            comparison.push(`Alternative ${i}: ${alt.analysis.equation} (Score: ${alt.score.toFixed(1)}, ${scoreDiff.toFixed(1)} points lower)`);
        }
        return comparison.join('\n');
    }
}

/**
 * Enhanced Chemical Database Manager
 * Provides comprehensive data integration and management capabilities
 */
class ChemicalDatabaseManager {
    constructor() {
        this.compounds = new Map();
        this.sources = new Map();
        this.validationRules = [];
        this.cache = new Map();
        this.initializeDefaultSources();
        this.initializeValidationRules();
        this.loadDefaultCompounds();
    }
    /**
     * Initialize default database sources
     */
    initializeDefaultSources() {
        const defaultSources = [
            {
                id: 'nist',
                name: 'NIST WebBook',
                url: 'https://webbook.nist.gov/chemistry/',
                priority: 1,
                enabled: true,
                cacheTimeout: 86400 // 24 hours
            },
            {
                id: 'pubchem',
                name: 'PubChem',
                url: 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/',
                priority: 2,
                enabled: true,
                cacheTimeout: 43200 // 12 hours
            },
            {
                id: 'local',
                name: 'Local Database',
                priority: 3,
                enabled: true,
                cacheTimeout: 0 // No cache timeout for local data
            }
        ];
        defaultSources.forEach(source => {
            this.sources.set(source.id, source);
        });
    }
    /**
     * Initialize data validation rules
     */
    initializeValidationRules() {
        this.validationRules = [
            {
                field: 'formula',
                type: 'required',
                rule: true,
                message: 'Chemical formula is required'
            },
            {
                field: 'molecularWeight',
                type: 'range',
                rule: { min: 0.1, max: 10000 },
                message: 'Molecular weight must be between 0.1 and 10000 g/mol'
            },
            {
                field: 'thermodynamicProperties.deltaHf',
                type: 'range',
                rule: { min: -5e3, max: 5000 },
                message: 'Enthalpy of formation must be between -5000 and 5000 kJ/mol'
            },
            {
                field: 'thermodynamicProperties.entropy',
                type: 'range',
                rule: { min: 0, max: 1000 },
                message: 'Entropy must be between 0 and 1000 J/(mol·K)'
            },
            {
                field: 'thermodynamicProperties.temperatureRange',
                type: 'custom',
                rule: (range) => range[0] < range[1] && range[0] > 0,
                message: 'Temperature range must be valid (min < max, both > 0)'
            }
        ];
    }
    /**
     * Load default compound database
     */
    loadDefaultCompounds() {
        const defaultCompounds = [
            {
                formula: 'H2O',
                name: 'Water',
                commonName: 'Water',
                casNumber: '7732-18-5',
                smiles: 'O',
                molecularWeight: 18.015,
                thermodynamicProperties: {
                    deltaHf: -285.8,
                    deltaGf: -237.1,
                    entropy: 69.95,
                    heatCapacity: 75.3,
                    temperatureRange: [273.15, 647.1],
                    meltingPoint: 273.15,
                    boilingPoint: 373.15,
                    criticalTemperature: 647.1,
                    criticalPressure: 22064000,
                    vaporPressure: [
                        { temperature: 273.15, pressure: 611.7 },
                        { temperature: 298.15, pressure: 3173 },
                        { temperature: 373.15, pressure: 101325 }
                    ]
                },
                physicalProperties: {
                    density: 997.0,
                    viscosity: 0.001,
                    thermalConductivity: 0.606,
                    refractiveIndex: 1.333,
                    dielectricConstant: 80.1,
                    surfaceTension: 0.0728
                },
                sources: ['nist', 'local'],
                lastUpdated: new Date(),
                confidence: 1.0
            },
            {
                formula: 'CO2',
                name: 'Carbon dioxide',
                commonName: 'Carbon dioxide',
                casNumber: '124-38-9',
                smiles: 'O=C=O',
                molecularWeight: 44.010,
                thermodynamicProperties: {
                    deltaHf: -393.5,
                    deltaGf: -394.4,
                    entropy: 213.8,
                    heatCapacity: 37.1,
                    temperatureRange: [200, 2000],
                    meltingPoint: 216.6,
                    boilingPoint: 194.7, // Sublimation point at 1 atm
                    criticalTemperature: 304.13,
                    criticalPressure: 7375000
                },
                physicalProperties: {
                    density: 1.98, // gas at STP
                    thermalConductivity: 0.0146,
                    solubility: {
                        water: 1.7 // g/L at 20°C
                    }
                },
                sources: ['nist', 'local'],
                lastUpdated: new Date(),
                confidence: 1.0
            },
            {
                formula: 'CH4',
                name: 'Methane',
                commonName: 'Methane',
                casNumber: '74-82-8',
                smiles: 'C',
                molecularWeight: 16.043,
                thermodynamicProperties: {
                    deltaHf: -74.6,
                    deltaGf: -50.5,
                    entropy: 186.3,
                    heatCapacity: 35.7,
                    temperatureRange: [200, 1500],
                    meltingPoint: 90.7,
                    boilingPoint: 111.7,
                    criticalTemperature: 190.6,
                    criticalPressure: 4599000
                },
                physicalProperties: {
                    density: 0.717, // gas at STP
                    viscosity: 0.0000103,
                    thermalConductivity: 0.0332
                },
                safetyData: {
                    hazardSymbols: ['GHS02', 'GHS04'],
                    hazardStatements: ['H220', 'H280'],
                    precautionaryStatements: ['P210', 'P377', 'P381'],
                    autoignitionTemperature: 810,
                    explosiveLimits: {
                        lower: 5.0,
                        upper: 15.0
                    }
                },
                sources: ['nist', 'local'],
                lastUpdated: new Date(),
                confidence: 1.0
            }
        ];
        defaultCompounds.forEach((compound, index) => {
            if (compound.formula) {
                this.compounds.set(compound.formula, compound);
            }
        });
    }
    /**
     * Query compounds from the database
     */
    async query(query) {
        const results = [];
        // Search local database first
        for (const [formula, compound] of this.compounds) {
            if (this.matchesQuery(compound, query)) {
                results.push(compound);
            }
        }
        // If no local results and external providers are requested
        if (results.length === 0 && query.provider && query.provider !== 'local') {
            try {
                const externalResults = await this.queryExternalSource(query);
                results.push(...externalResults);
            }
            catch (error) {
                console.warn(`External database query failed: ${error}`);
            }
        }
        // Sort by confidence and limit results
        results.sort((a, b) => b.confidence - a.confidence);
        if (query.maxResults) {
            return results.slice(0, query.maxResults);
        }
        return results;
    }
    /**
     * Check if compound matches query criteria
     */
    matchesQuery(compound, query) {
        if (query.formula && compound.formula !== query.formula)
            return false;
        if (query.name && !compound.name.toLowerCase().includes(query.name.toLowerCase()))
            return false;
        if (query.casNumber && compound.casNumber !== query.casNumber)
            return false;
        if (query.smiles && compound.smiles !== query.smiles)
            return false;
        if (query.inchi && compound.inchi !== query.inchi)
            return false;
        if (!query.includeUncertain && compound.confidence < 0.8)
            return false;
        return true;
    }
    /**
     * Query external data sources
     */
    async queryExternalSource(query) {
        // This would implement actual API calls to NIST, PubChem, etc.
        // For now, return empty array as placeholder
        return [];
    }
    /**
     * Add or update a compound in the database
     */
    async addCompound(compound) {
        try {
            // Validate the compound data
            const validationErrors = this.validateCompound(compound);
            if (validationErrors.length > 0) {
                throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
            }
            // Fill in missing fields
            const fullCompound = {
                formula: compound.formula,
                name: compound.name || compound.formula,
                molecularWeight: compound.molecularWeight || 0,
                thermodynamicProperties: compound.thermodynamicProperties || this.getDefaultThermodynamicProperties(),
                physicalProperties: compound.physicalProperties || {},
                sources: compound.sources || ['custom'],
                lastUpdated: new Date(),
                confidence: compound.confidence || 0.8,
                ...compound
            };
            this.compounds.set(fullCompound.formula, fullCompound);
            return true;
        }
        catch (error) {
            console.error(`Failed to add compound: ${error}`);
            return false;
        }
    }
    /**
     * Get default thermodynamic properties for validation
     */
    getDefaultThermodynamicProperties() {
        return {
            deltaHf: 0,
            entropy: 0,
            heatCapacity: 25, // Approximate value for many compounds
            temperatureRange: [298, 1000]
        };
    }
    /**
     * Validate compound data against rules
     */
    validateCompound(compound) {
        const errors = [];
        for (const rule of this.validationRules) {
            const value = this.getNestedProperty(compound, rule.field);
            switch (rule.type) {
                case 'required':
                    if (value === undefined || value === null) {
                        errors.push(rule.message);
                    }
                    break;
                case 'range':
                    if (typeof value === 'number') {
                        const { min, max } = rule.rule;
                        if (value < min || value > max) {
                            errors.push(rule.message);
                        }
                    }
                    break;
                case 'custom':
                    if (value !== undefined && !rule.rule(value)) {
                        errors.push(rule.message);
                    }
                    break;
            }
        }
        return errors;
    }
    /**
     * Get nested property value by dot notation
     */
    getNestedProperty(obj, path) {
        return path.split('.').reduce((current, key) => current?.[key], obj);
    }
    /**
     * Import compounds from various data formats
     */
    async importData(data, format) {
        const result = {
            success: true,
            imported: 0,
            failed: 0,
            errors: [],
            warnings: []
        };
        try {
            let compounds = [];
            switch (format) {
                case 'json':
                    compounds = Array.isArray(data) ? data : [data];
                    break;
                case 'csv':
                    compounds = this.parseCSV(data);
                    break;
                case 'sdf':
                    compounds = this.parseSDF(data);
                    break;
                default:
                    throw new Error(`Unsupported format: ${format}`);
            }
            for (const compound of compounds) {
                try {
                    const success = await this.addCompound(compound);
                    if (success) {
                        result.imported++;
                    }
                    else {
                        result.failed++;
                        result.errors.push({
                            compound: compound.formula || 'unknown',
                            error: 'Failed to add compound'
                        });
                    }
                }
                catch (error) {
                    result.failed++;
                    result.errors.push({
                        compound: compound.formula || 'unknown',
                        error: error instanceof Error ? error.message : 'Unknown error'
                    });
                }
            }
            result.success = result.failed === 0;
        }
        catch (error) {
            result.success = false;
            result.errors.push({
                compound: 'all',
                error: error instanceof Error ? error.message : 'Import failed'
            });
        }
        return result;
    }
    /**
     * Parse CSV data into compound objects
     */
    parseCSV(csvData) {
        const lines = csvData.split('\n');
        const headers = lines[0].split(',').map(h => h.trim());
        const compounds = [];
        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',').map(v => v.trim());
            if (values.length === headers.length) {
                const compound = {};
                headers.forEach((header, index) => {
                    const value = values[index];
                    // Map common CSV headers to compound properties
                    switch (header.toLowerCase()) {
                        case 'formula':
                            compound.formula = value;
                            break;
                        case 'name':
                            compound.name = value;
                            break;
                        case 'molecular_weight':
                        case 'molecularweight':
                            compound.molecularWeight = parseFloat(value);
                            break;
                        case 'deltahf':
                        case 'enthalpy_formation':
                            compound.thermodynamicProperties = compound.thermodynamicProperties || {};
                            compound.thermodynamicProperties.deltaHf = parseFloat(value);
                            break;
                        case 'entropy':
                            compound.thermodynamicProperties = compound.thermodynamicProperties || {};
                            compound.thermodynamicProperties.entropy = parseFloat(value);
                            break;
                        case 'heat_capacity':
                        case 'heatcapacity':
                            compound.thermodynamicProperties = compound.thermodynamicProperties || {};
                            compound.thermodynamicProperties.heatCapacity = parseFloat(value);
                            break;
                    }
                });
                if (compound.formula) {
                    compounds.push(compound);
                }
            }
        }
        return compounds;
    }
    /**
     * Parse SDF (Structure Data File) format
     */
    parseSDF(sdfData) {
        // Basic SDF parsing - would need more sophisticated implementation for production
        const compounds = [];
        const molecules = sdfData.split('$$$$');
        for (const molecule of molecules) {
            if (molecule.trim()) {
                const compound = {};
                // Extract name from first line
                const lines = molecule.split('\n');
                if (lines.length > 0) {
                    compound.name = lines[0].trim();
                }
                // Look for additional properties in the data fields
                const dataSection = molecule.split('> <');
                for (const section of dataSection) {
                    if (section.includes('MOLECULAR_FORMULA')) {
                        const formula = section.split('\n')[1]?.trim();
                        if (formula)
                            compound.formula = formula;
                    }
                    if (section.includes('MOLECULAR_WEIGHT')) {
                        const weight = parseFloat(section.split('\n')[1]?.trim() || '0');
                        if (weight > 0)
                            compound.molecularWeight = weight;
                    }
                }
                if (compound.formula) {
                    compounds.push(compound);
                }
            }
        }
        return compounds;
    }
    /**
     * Export compound data in various formats
     */
    exportData(options) {
        let compounds = Array.from(this.compounds.values());
        // Apply filter if provided
        if (options.filter) {
            compounds = compounds.filter(options.filter);
        }
        switch (options.format) {
            case 'json':
                return this.exportJSON(compounds, options);
            case 'csv':
                return this.exportCSV(compounds, options);
            case 'xlsx':
                return this.exportXLSX(compounds, options);
            default:
                throw new Error(`Unsupported export format: ${options.format}`);
        }
    }
    /**
     * Export as JSON
     */
    exportJSON(compounds, options) {
        const data = options.fields ?
            compounds.map(c => this.selectFields(c, options.fields)) :
            compounds;
        const exportData = {
            metadata: options.includeMetadata ? {
                exportDate: new Date().toISOString(),
                totalCompounds: compounds.length,
                version: '1.0'
            } : undefined,
            compounds: data
        };
        return JSON.stringify(exportData, null, 2);
    }
    /**
     * Export as CSV
     */
    exportCSV(compounds, options) {
        if (compounds.length === 0)
            return '';
        const fields = options.fields || ['formula', 'name', 'molecularWeight'];
        const headers = fields.join(',');
        const rows = compounds.map(compound => {
            return fields.map(field => {
                const value = this.getNestedProperty(compound, field);
                return typeof value === 'string' ? `"${value}"` : value || '';
            }).join(',');
        });
        return [headers, ...rows].join('\n');
    }
    /**
     * Export as XLSX (placeholder - would need external library)
     */
    exportXLSX(compounds, options) {
        // This would require a library like xlsx or exceljs
        throw new Error('XLSX export not yet implemented - use JSON or CSV');
    }
    /**
     * Select specific fields from compound
     */
    selectFields(compound, fields) {
        const result = {};
        for (const field of fields) {
            const value = this.getNestedProperty(compound, field);
            if (value !== undefined) {
                this.setNestedProperty(result, field, value);
            }
        }
        return result;
    }
    /**
     * Set nested property value by dot notation
     */
    setNestedProperty(obj, path, value) {
        const keys = path.split('.');
        const lastKey = keys.pop();
        let current = obj;
        for (const key of keys) {
            if (!(key in current)) {
                current[key] = {};
            }
            current = current[key];
        }
        current[lastKey] = value;
    }
    /**
     * Get compound by formula with backward compatibility
     */
    async getCompound(formula) {
        const compounds = await this.query({ formula, maxResults: 1 });
        if (compounds.length > 0) {
            const compound = compounds[0];
            // Convert to legacy format for backward compatibility
            return {
                deltaHf: compound.thermodynamicProperties.deltaHf,
                entropy: compound.thermodynamicProperties.entropy,
                heatCapacity: compound.thermodynamicProperties.heatCapacity,
                temperatureRange: compound.thermodynamicProperties.temperatureRange
            };
        }
        return null;
    }
    /**
     * Get all available compounds
     */
    getAllCompounds() {
        return Array.from(this.compounds.values());
    }
    /**
     * Get database statistics
     */
    getStatistics() {
        const compounds = this.getAllCompounds();
        const sourceCounts = {};
        const confidenceDistribution = {
            'high': 0, // > 0.8
            'medium': 0, // 0.6-0.8
            'low': 0 // < 0.6
        };
        let lastUpdate = new Date(0);
        compounds.forEach(compound => {
            // Count sources
            compound.sources.forEach(source => {
                sourceCounts[source] = (sourceCounts[source] || 0) + 1;
            });
            // Confidence distribution
            if (compound.confidence > 0.8) {
                confidenceDistribution.high++;
            }
            else if (compound.confidence > 0.6) {
                confidenceDistribution.medium++;
            }
            else {
                confidenceDistribution.low++;
            }
            // Track latest update
            if (compound.lastUpdated > lastUpdate) {
                lastUpdate = compound.lastUpdated;
            }
        });
        return {
            totalCompounds: compounds.length,
            sourceCounts,
            confidenceDistribution,
            lastUpdate
        };
    }
}

/**
 * NIST WebBook Integration for Enhanced Data
 * Provides real-time access to NIST thermodynamic database
 */
class NISTWebBookIntegration {
    constructor(apiKey) {
        this.baseURL = 'https://webbook.nist.gov/cgi/cbook.cgi';
        this.cache = new Map();
        this.cacheTimeout = 86400000; // 24 hours in ms
        this.apiKey = apiKey;
    }
    /**
     * Query NIST WebBook for compound data
     */
    async queryCompound(identifier, type = 'formula') {
        try {
            // Check cache first
            const cacheKey = `${type}:${identifier}`;
            const cached = this.cache.get(cacheKey);
            if (cached && (Date.now() - cached.timestamp) < this.cacheTimeout) {
                return this.convertNISTToCompound(cached.data);
            }
            // Make API request
            const response = await this.makeNISTRequest(identifier, type);
            if (response) {
                // Cache the response
                this.cache.set(cacheKey, {
                    data: response,
                    timestamp: Date.now()
                });
                return this.convertNISTToCompound(response);
            }
            return null;
        }
        catch (error) {
            console.warn(`NIST WebBook query failed: ${error}`);
            return null;
        }
    }
    /**
     * Make request to NIST WebBook API
     */
    async makeNISTRequest(identifier, type) {
        // Note: This is a simplified implementation
        // The actual NIST WebBook doesn't have a public REST API
        // This would need to be implemented using web scraping or a proxy service
        const params = new URLSearchParams({
            cbook: 'main',
            [type === 'formula' ? 'Formula' : type === 'name' ? 'Name' : 'ID']: identifier,
            Units: 'SI',
            Mask: '1' // Thermochemical data
        });
        try {
            // This is a placeholder implementation
            // In practice, you would either:
            // 1. Use web scraping with libraries like Puppeteer
            // 2. Use a proxy service that provides API access to NIST
            // 3. Use cached NIST data that's periodically updated
            const url = `${this.baseURL}?${params}`;
            console.log(`Would query NIST at: ${url}`);
            // Return mock data for demonstration
            return this.getMockNISTData(identifier);
        }
        catch (error) {
            throw new Error(`NIST request failed: ${error}`);
        }
    }
    /**
     * Convert NIST response to CompoundDatabase format
     */
    convertNISTToCompound(nistData) {
        const thermodynamicProperties = {
            deltaHf: nistData.thermodynamics?.enthalpy_formation || 0,
            entropy: nistData.thermodynamics?.entropy || 0,
            heatCapacity: nistData.thermodynamics?.heat_capacity || 25,
            temperatureRange: nistData.thermodynamics?.temperature_range || [298, 1000],
            meltingPoint: nistData.phase_data?.melting_point,
            boilingPoint: nistData.phase_data?.boiling_point,
            criticalTemperature: nistData.phase_data?.critical_temperature,
            criticalPressure: nistData.phase_data?.critical_pressure,
            uncertainties: nistData.uncertainties ? {
                deltaHf: nistData.uncertainties.enthalpy_formation,
                entropy: nistData.uncertainties.entropy
            } : undefined
        };
        return {
            formula: nistData.formula,
            name: nistData.name,
            casNumber: nistData.cas,
            molecularWeight: this.calculateMolecularWeight(nistData.formula),
            thermodynamicProperties,
            physicalProperties: {},
            sources: ['nist'],
            lastUpdated: new Date(),
            confidence: 0.95 // NIST data is highly reliable
        };
    }
    /**
     * Calculate molecular weight from formula (simplified)
     */
    calculateMolecularWeight(formula) {
        // Simple atomic weights for common elements
        const atomicWeights = {
            'H': 1.008, 'C': 12.011, 'N': 14.007, 'O': 15.999,
            'F': 18.998, 'Na': 22.990, 'Mg': 24.305, 'Al': 26.982,
            'Si': 28.085, 'P': 30.974, 'S': 32.065, 'Cl': 35.453,
            'K': 39.098, 'Ca': 40.078, 'Fe': 55.845, 'Cu': 63.546,
            'Zn': 65.38, 'Br': 79.904, 'I': 126.904
        };
        let weight = 0;
        let i = 0;
        while (i < formula.length) {
            if (formula[i] === '(' || formula[i] === ')') {
                i++;
                continue;
            }
            // Get element symbol (starts with uppercase)
            if (!/[A-Z]/.test(formula[i])) {
                i++;
                continue;
            }
            let element = formula[i];
            i++;
            // Check for two-letter elements (second letter is lowercase)
            if (i < formula.length && /[a-z]/.test(formula[i])) {
                element += formula[i];
                i++;
            }
            // Get count
            let count = '';
            while (i < formula.length && /\d/.test(formula[i])) {
                count += formula[i];
                i++;
            }
            const elementWeight = atomicWeights[element] || 0;
            const elementCount = count ? parseInt(count) : 1;
            weight += elementWeight * elementCount;
        }
        return Math.round(weight * 1000) / 1000; // Round to 3 decimal places
    }
    /**
     * Get mock NIST data for testing/demonstration
     */
    getMockNISTData(identifier) {
        const mockData = {
            'H2O': {
                formula: 'H2O',
                name: 'Water',
                cas: '7732-18-5',
                thermodynamics: {
                    enthalpy_formation: -285.8,
                    entropy: 69.95,
                    heat_capacity: 75.3,
                    temperature_range: [273.15, 647.1]
                },
                phase_data: {
                    melting_point: 273.15,
                    boiling_point: 373.15,
                    critical_temperature: 647.1,
                    critical_pressure: 22064000
                },
                uncertainties: {
                    enthalpy_formation: 0.4,
                    entropy: 0.1
                }
            },
            'CO2': {
                formula: 'CO2',
                name: 'Carbon dioxide',
                cas: '124-38-9',
                thermodynamics: {
                    enthalpy_formation: -393.5,
                    entropy: 213.8,
                    heat_capacity: 37.1,
                    temperature_range: [200, 2000]
                },
                phase_data: {
                    melting_point: 216.6,
                    boiling_point: 194.7,
                    critical_temperature: 304.13,
                    critical_pressure: 7375000
                },
                uncertainties: {
                    enthalpy_formation: 0.1,
                    entropy: 0.3
                }
            },
            'CH4': {
                formula: 'CH4',
                name: 'Methane',
                cas: '74-82-8',
                thermodynamics: {
                    enthalpy_formation: -74.6,
                    entropy: 186.3,
                    heat_capacity: 35.7,
                    temperature_range: [200, 1500]
                },
                phase_data: {
                    melting_point: 90.7,
                    boiling_point: 111.7,
                    critical_temperature: 190.6,
                    critical_pressure: 4599000
                },
                uncertainties: {
                    enthalpy_formation: 0.2,
                    entropy: 0.2
                }
            },
            'O2': {
                formula: 'O2',
                name: 'Oxygen',
                cas: '7782-44-7',
                thermodynamics: {
                    enthalpy_formation: 0,
                    entropy: 205.2,
                    heat_capacity: 29.4,
                    temperature_range: [200, 3000]
                },
                phase_data: {
                    melting_point: 54.4,
                    boiling_point: 90.2,
                    critical_temperature: 154.6,
                    critical_pressure: 5043000
                },
                uncertainties: {
                    enthalpy_formation: 0,
                    entropy: 0.1
                }
            },
            'N2': {
                formula: 'N2',
                name: 'Nitrogen',
                cas: '7727-37-9',
                thermodynamics: {
                    enthalpy_formation: 0,
                    entropy: 191.6,
                    heat_capacity: 29.1,
                    temperature_range: [200, 3000]
                },
                phase_data: {
                    melting_point: 63.1,
                    boiling_point: 77.4,
                    critical_temperature: 126.2,
                    critical_pressure: 3396000
                },
                uncertainties: {
                    enthalpy_formation: 0,
                    entropy: 0.1
                }
            }
        };
        return mockData[identifier] || null;
    }
    /**
     * Batch query multiple compounds
     */
    async batchQuery(identifiers, type = 'formula') {
        const results = [];
        // Process in batches to avoid overwhelming the API
        const batchSize = 10;
        for (let i = 0; i < identifiers.length; i += batchSize) {
            const batch = identifiers.slice(i, i + batchSize);
            const batchPromises = batch.map(identifier => this.queryCompound(identifier, type));
            const batchResults = await Promise.allSettled(batchPromises);
            batchResults.forEach(result => {
                if (result.status === 'fulfilled' && result.value) {
                    results.push(result.value);
                }
            });
            // Add delay between batches to be respectful to the API
            if (i + batchSize < identifiers.length) {
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
        return results;
    }
    /**
     * Clear the cache
     */
    clearCache() {
        this.cache.clear();
    }
    /**
     * Get cache statistics
     */
    getCacheStats() {
        let oldestTimestamp = Infinity;
        let newestTimestamp = 0;
        for (const entry of this.cache.values()) {
            if (entry.timestamp < oldestTimestamp) {
                oldestTimestamp = entry.timestamp;
            }
            if (entry.timestamp > newestTimestamp) {
                newestTimestamp = entry.timestamp;
            }
        }
        return {
            size: this.cache.size,
            oldestEntry: oldestTimestamp === Infinity ? null : new Date(oldestTimestamp),
            newestEntry: newestTimestamp === 0 ? null : new Date(newestTimestamp)
        };
    }
}

/**
 * Advanced Data Validation Service
 * Provides comprehensive validation for chemical data integrity
 */
class DataValidationService {
    constructor(config = {}) {
        this.config = {
            enablePhysicsChecks: true,
            enableConsistencyChecks: true,
            enableRangeChecks: true,
            enableCorrelationChecks: true,
            strictMode: false,
            ...config
        };
    }
    /**
     * Validate a complete compound entry
     */
    validateCompound(compound) {
        const errors = [];
        const warnings = [];
        // Basic structure validation
        errors.push(...this.validateBasicStructure(compound));
        // Chemical formula validation
        errors.push(...this.validateFormula(compound.formula));
        // Thermodynamic properties validation
        if (compound.thermodynamicProperties) {
            const thermoResult = this.validateThermodynamicProperties(compound.thermodynamicProperties, compound.formula);
            errors.push(...thermoResult.errors);
            warnings.push(...thermoResult.warnings);
        }
        // Physical properties validation
        if (compound.physicalProperties) {
            const physResult = this.validatePhysicalProperties(compound.physicalProperties, compound.thermodynamicProperties);
            errors.push(...physResult.errors);
            warnings.push(...physResult.warnings);
        }
        // Safety data validation
        if (compound.safetyData) {
            errors.push(...this.validateSafetyData(compound.safetyData));
        }
        // Cross-property consistency checks
        if (this.config.enableConsistencyChecks) {
            const consistencyResult = this.validateConsistency(compound);
            errors.push(...consistencyResult.errors);
            warnings.push(...consistencyResult.warnings);
        }
        // Calculate quality score
        const score = this.calculateQualityScore(compound, errors, warnings);
        return {
            isValid: errors.filter(e => e.severity === 'critical' || e.severity === 'major').length === 0,
            errors,
            warnings,
            score
        };
    }
    /**
     * Validate basic compound structure
     */
    validateBasicStructure(compound) {
        const errors = [];
        if (!compound.formula || compound.formula.trim() === '') {
            errors.push({
                field: 'formula',
                message: 'Chemical formula is required',
                severity: 'critical',
                suggestedFix: 'Provide a valid chemical formula'
            });
        }
        if (!compound.name || compound.name.trim() === '') {
            errors.push({
                field: 'name',
                message: 'Compound name is required',
                severity: 'major',
                suggestedFix: 'Provide a compound name'
            });
        }
        if (compound.molecularWeight <= 0) {
            errors.push({
                field: 'molecularWeight',
                message: 'Molecular weight must be positive',
                severity: 'critical',
                suggestedFix: 'Calculate molecular weight from formula'
            });
        }
        if (compound.molecularWeight < 0.1 || compound.molecularWeight > 10000) {
            errors.push({
                field: 'molecularWeight',
                message: 'Molecular weight must be between 0.1 and 10000 g/mol',
                severity: 'critical',
                suggestedFix: 'Check molecular weight calculation or formula'
            });
        }
        if (compound.confidence < 0 || compound.confidence > 1) {
            errors.push({
                field: 'confidence',
                message: 'Confidence must be between 0 and 1',
                severity: 'minor',
                suggestedFix: 'Set confidence to 0.8 if uncertain'
            });
        }
        return errors;
    }
    /**
     * Validate chemical formula syntax and composition
     */
    validateFormula(formula) {
        const errors = [];
        if (!formula)
            return errors;
        // Check for valid characters (letters, numbers, parentheses)
        if (!/^[A-Za-z0-9()]+$/.test(formula)) {
            errors.push({
                field: 'formula',
                message: 'Formula contains invalid characters',
                severity: 'critical',
                suggestedFix: 'Use only element symbols, numbers, and parentheses'
            });
        }
        // Check balanced parentheses
        let parenCount = 0;
        for (const char of formula) {
            if (char === '(')
                parenCount++;
            if (char === ')')
                parenCount--;
            if (parenCount < 0) {
                errors.push({
                    field: 'formula',
                    message: 'Unbalanced parentheses in formula',
                    severity: 'critical'
                });
                break;
            }
        }
        if (parenCount !== 0) {
            errors.push({
                field: 'formula',
                message: 'Unbalanced parentheses in formula',
                severity: 'critical'
            });
        }
        // Check for valid element symbols
        const elementPattern = /[A-Z][a-z]?/g;
        const elements = formula.match(elementPattern) || [];
        const validElements = new Set([
            'H', 'He', 'Li', 'Be', 'B', 'C', 'N', 'O', 'F', 'Ne',
            'Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl', 'Ar', 'K', 'Ca',
            'Sc', 'Ti', 'V', 'Cr', 'Mn', 'Fe', 'Co', 'Ni', 'Cu', 'Zn',
            'Ga', 'Ge', 'As', 'Se', 'Br', 'Kr', 'Rb', 'Sr', 'Y', 'Zr',
            'Nb', 'Mo', 'Tc', 'Ru', 'Rh', 'Pd', 'Ag', 'Cd', 'In', 'Sn',
            'Sb', 'Te', 'I', 'Xe', 'Cs', 'Ba', 'La', 'Ce', 'Pr', 'Nd',
            'Pm', 'Sm', 'Eu', 'Gd', 'Tb', 'Dy', 'Ho', 'Er', 'Tm', 'Yb',
            'Lu', 'Hf', 'Ta', 'W', 'Re', 'Os', 'Ir', 'Pt', 'Au', 'Hg',
            'Tl', 'Pb', 'Bi', 'Po', 'At', 'Rn'
        ]);
        for (const element of elements) {
            if (!validElements.has(element)) {
                errors.push({
                    field: 'formula',
                    message: `Invalid element symbol: ${element}`,
                    severity: 'critical',
                    suggestedFix: 'Check periodic table for correct element symbols'
                });
            }
        }
        return errors;
    }
    /**
     * Validate thermodynamic properties
     */
    validateThermodynamicProperties(props, formula) {
        const errors = [];
        const warnings = [];
        // Range checks
        if (this.config.enableRangeChecks) {
            if (props.deltaHf < -5e3 || props.deltaHf > 5000) {
                errors.push({
                    field: 'thermodynamicProperties.deltaHf',
                    message: 'Enthalpy of formation outside reasonable range (-5000 to 5000 kJ/mol)',
                    severity: 'major'
                });
            }
            if (props.entropy < 0 || props.entropy > 1000) {
                errors.push({
                    field: 'thermodynamicProperties.entropy',
                    message: 'Entropy outside reasonable range (0 to 1000 J/(mol·K))',
                    severity: 'major'
                });
            }
            if (props.heatCapacity < 0 || props.heatCapacity > 500) {
                errors.push({
                    field: 'thermodynamicProperties.heatCapacity',
                    message: 'Heat capacity outside reasonable range (0 to 500 J/(mol·K))',
                    severity: 'major'
                });
            }
        }
        // Temperature range validation
        if (props.temperatureRange) {
            if (props.temperatureRange[0] >= props.temperatureRange[1]) {
                errors.push({
                    field: 'thermodynamicProperties.temperatureRange',
                    message: 'Temperature range minimum must be less than maximum',
                    severity: 'critical'
                });
            }
            if (props.temperatureRange[0] < 0) {
                errors.push({
                    field: 'thermodynamicProperties.temperatureRange',
                    message: 'Temperature cannot be below absolute zero',
                    severity: 'critical'
                });
            }
        }
        // Physics-based checks
        if (this.config.enablePhysicsChecks) {
            // Third law of thermodynamics: entropy approaches zero at 0K
            if (props.entropy < 0) {
                errors.push({
                    field: 'thermodynamicProperties.entropy',
                    message: 'Entropy cannot be negative (Third Law of Thermodynamics)',
                    severity: 'critical'
                });
            }
            // Check for reasonable heat capacity
            const atomCount = this.estimateAtomCount(formula);
            const expectedCp = atomCount * 20; // Rough estimate: ~20 J/(mol·K) per atom
            if (Math.abs(props.heatCapacity - expectedCp) > expectedCp * 0.5) {
                warnings.push({
                    field: 'thermodynamicProperties.heatCapacity',
                    message: `Heat capacity seems unusual for ${atomCount} atoms`,
                    recommendation: `Expected around ${expectedCp.toFixed(1)} J/(mol·K)`
                });
            }
        }
        // Phase transition consistency
        if (props.meltingPoint && props.boilingPoint) {
            if (props.meltingPoint >= props.boilingPoint) {
                errors.push({
                    field: 'thermodynamicProperties.meltingPoint',
                    message: 'Melting point must be less than boiling point',
                    severity: 'major'
                });
            }
        }
        // Critical point validation
        if (props.criticalTemperature && props.boilingPoint) {
            if (props.criticalTemperature <= props.boilingPoint) {
                errors.push({
                    field: 'thermodynamicProperties.criticalTemperature',
                    message: 'Critical temperature must be greater than boiling point',
                    severity: 'major'
                });
            }
        }
        return { errors, warnings };
    }
    /**
     * Validate physical properties
     */
    validatePhysicalProperties(props, thermoProps) {
        const errors = [];
        const warnings = [];
        // Density checks
        if (props.density !== undefined) {
            if (props.density <= 0) {
                errors.push({
                    field: 'physicalProperties.density',
                    message: 'Density must be positive',
                    severity: 'critical'
                });
            }
            if (props.density > 50000) { // Osmium density is ~22,590 kg/m³
                warnings.push({
                    field: 'physicalProperties.density',
                    message: 'Density seems unusually high',
                    recommendation: 'Verify units and measurement conditions'
                });
            }
        }
        // Viscosity checks
        if (props.viscosity !== undefined) {
            if (props.viscosity < 0) {
                errors.push({
                    field: 'physicalProperties.viscosity',
                    message: 'Viscosity cannot be negative',
                    severity: 'critical'
                });
            }
        }
        // Thermal conductivity checks
        if (props.thermalConductivity !== undefined) {
            if (props.thermalConductivity < 0) {
                errors.push({
                    field: 'physicalProperties.thermalConductivity',
                    message: 'Thermal conductivity cannot be negative',
                    severity: 'critical'
                });
            }
        }
        // Refractive index checks
        if (props.refractiveIndex !== undefined) {
            if (props.refractiveIndex < 1) {
                errors.push({
                    field: 'physicalProperties.refractiveIndex',
                    message: 'Refractive index must be at least 1',
                    severity: 'critical'
                });
            }
        }
        return { errors, warnings };
    }
    /**
     * Validate safety data
     */
    validateSafetyData(safetyData) {
        const errors = [];
        // Flash point vs autoignition temperature
        if (safetyData.flashPoint && safetyData.autoignitionTemperature) {
            if (safetyData.flashPoint >= safetyData.autoignitionTemperature) {
                errors.push({
                    field: 'safetyData.flashPoint',
                    message: 'Flash point must be less than autoignition temperature',
                    severity: 'major'
                });
            }
        }
        // Explosive limits
        if (safetyData.explosiveLimits) {
            if (safetyData.explosiveLimits.lower >= safetyData.explosiveLimits.upper) {
                errors.push({
                    field: 'safetyData.explosiveLimits',
                    message: 'Lower explosive limit must be less than upper limit',
                    severity: 'major'
                });
            }
            if (safetyData.explosiveLimits.lower < 0 || safetyData.explosiveLimits.upper > 100) {
                errors.push({
                    field: 'safetyData.explosiveLimits',
                    message: 'Explosive limits must be between 0 and 100 vol%',
                    severity: 'major'
                });
            }
        }
        return errors;
    }
    /**
     * Validate cross-property consistency
     */
    validateConsistency(compound) {
        const errors = [];
        const warnings = [];
        const molecular = this.calculateMolecularWeight(compound.formula);
        // Molecular weight consistency
        if (Math.abs(compound.molecularWeight - molecular) > 0.1) {
            errors.push({
                field: 'molecularWeight',
                message: `Molecular weight inconsistent with formula (calculated: ${molecular.toFixed(3)})`,
                severity: 'major',
                suggestedFix: `Update to ${molecular.toFixed(3)} g/mol`
            });
        }
        // Source-confidence correlation
        if (compound.sources.includes('nist') && compound.confidence < 0.9) {
            warnings.push({
                field: 'confidence',
                message: 'NIST data typically has high confidence',
                recommendation: 'Consider increasing confidence score'
            });
        }
        return { errors, warnings };
    }
    /**
     * Calculate quality score (0-100)
     */
    calculateQualityScore(compound, errors, warnings) {
        let score = 100;
        // Deduct points for errors
        errors.forEach(error => {
            switch (error.severity) {
                case 'critical':
                    score -= 25;
                    break;
                case 'major':
                    score -= 10;
                    break;
                case 'minor':
                    score -= 5;
                    break;
            }
        });
        // Deduct points for warnings
        score -= warnings.length * 2;
        // Bonus points for completeness
        if (compound.thermodynamicProperties.deltaGf !== undefined)
            score += 2;
        if (compound.thermodynamicProperties.uncertainties)
            score += 3;
        if (compound.physicalProperties.density !== undefined)
            score += 2;
        if (compound.safetyData)
            score += 5;
        if (compound.sources.includes('nist'))
            score += 5;
        return Math.max(0, Math.min(100, score));
    }
    /**
     * Estimate atom count from formula
     */
    estimateAtomCount(formula) {
        let count = 0;
        let i = 0;
        while (i < formula.length) {
            if (formula[i] === '(') {
                // Skip to matching closing parenthesis
                let parenCount = 1;
                i++;
                while (i < formula.length && parenCount > 0) {
                    if (formula[i] === '(')
                        parenCount++;
                    if (formula[i] === ')')
                        parenCount--;
                    i++;
                }
                continue;
            }
            if (/[A-Z]/.test(formula[i])) {
                count++;
                i++;
                // Skip lowercase letters
                while (i < formula.length && /[a-z]/.test(formula[i])) {
                    i++;
                }
                // Skip numbers
                while (i < formula.length && /\d/.test(formula[i])) {
                    i++;
                }
            }
            else {
                i++;
            }
        }
        return count;
    }
    /**
     * Calculate molecular weight from formula
     */
    calculateMolecularWeight(formula) {
        const atomicWeights = {
            'H': 1.008, 'He': 4.003, 'Li': 6.941, 'Be': 9.012, 'B': 10.811,
            'C': 12.011, 'N': 14.007, 'O': 15.999, 'F': 18.998, 'Ne': 20.180,
            'Na': 22.990, 'Mg': 24.305, 'Al': 26.982, 'Si': 28.085, 'P': 30.974,
            'S': 32.065, 'Cl': 35.453, 'Ar': 39.948, 'K': 39.098, 'Ca': 40.078,
            'Fe': 55.845, 'Cu': 63.546, 'Zn': 65.38, 'Br': 79.904, 'I': 126.904
        };
        let weight = 0;
        let i = 0;
        while (i < formula.length) {
            // Get element symbol - starts with uppercase letter
            let element = formula[i];
            i++;
            // Check for two-letter elements (lowercase letter after uppercase)
            if (i < formula.length && /[a-z]/.test(formula[i])) {
                element += formula[i];
                i++;
            }
            // Get count - sequence of digits
            let count = '';
            while (i < formula.length && /\d/.test(formula[i])) {
                count += formula[i];
                i++;
            }
            const elementWeight = atomicWeights[element] || 0;
            const elementCount = count ? parseInt(count) : 1;
            weight += elementWeight * elementCount;
        }
        return Math.round(weight * 1000) / 1000;
    }
    /**
     * Batch validate multiple compounds
     */
    batchValidate(compounds) {
        const results = new Map();
        compounds.forEach(compound => {
            const result = this.validateCompound(compound);
            results.set(compound.formula, result);
        });
        return results;
    }
    /**
     * Get validation summary statistics
     */
    getValidationSummary(results) {
        let totalCompounds = 0;
        let validCompounds = 0;
        let totalScore = 0;
        let criticalErrors = 0;
        let majorErrors = 0;
        let minorErrors = 0;
        let warnings = 0;
        for (const result of results.values()) {
            totalCompounds++;
            if (result.isValid)
                validCompounds++;
            totalScore += result.score;
            warnings += result.warnings.length;
            result.errors.forEach(error => {
                switch (error.severity) {
                    case 'critical':
                        criticalErrors++;
                        break;
                    case 'major':
                        majorErrors++;
                        break;
                    case 'minor':
                        minorErrors++;
                        break;
                }
            });
        }
        return {
            totalCompounds,
            validCompounds,
            averageScore: totalCompounds > 0 ? totalScore / totalCompounds : 0,
            criticalErrors,
            majorErrors,
            minorErrors,
            warnings
        };
    }
}

/**
 * CREB-JS Dependency Injection Container
 *
 * A lightweight, type-safe IoC container for managing dependencies
 * with support for singleton/transient lifetimes, constructor injection,
 * and circular dependency detection.
 *
 * @author Loganathane Virassamy
 * @version 1.6.0
 */
/**
 * Service lifetime enumeration
 */
exports.ServiceLifetime = void 0;
(function (ServiceLifetime) {
    ServiceLifetime["Singleton"] = "singleton";
    ServiceLifetime["Transient"] = "transient";
})(exports.ServiceLifetime || (exports.ServiceLifetime = {}));
/**
 * Circular dependency error with detailed context
 */
class CircularDependencyError extends Error {
    constructor(dependencyChain, message) {
        super(message || `Circular dependency detected: ${dependencyChain.map(t => String(t)).join(' -> ')}`);
        this.dependencyChain = dependencyChain;
        this.name = 'CircularDependencyError';
    }
}
/**
 * Service not found error
 */
class ServiceNotFoundError extends Error {
    constructor(token) {
        super(`Service not registered: ${String(token)}`);
        this.token = token;
        this.name = 'ServiceNotFoundError';
    }
}
/**
 * Maximum resolution depth exceeded error
 */
class MaxDepthExceededError extends Error {
    constructor(maxDepth) {
        super(`Maximum resolution depth exceeded: ${maxDepth}`);
        this.maxDepth = maxDepth;
        this.name = 'MaxDepthExceededError';
    }
}
/**
 * IoC Container implementation with advanced features
 */
class Container {
    constructor(options) {
        this.services = new Map();
        this.resolutionStack = [];
        this.metrics = {
            resolutions: 0,
            singletonCreations: 0,
            transientCreations: 0,
            circularDependencyChecks: 0,
            averageResolutionTime: 0,
            peakResolutionDepth: 0,
        };
        this.options = {
            enableCircularDependencyDetection: true,
            maxResolutionDepth: 50,
            enablePerformanceTracking: true,
        };
        if (options) {
            Object.assign(this.options, options);
        }
    }
    /**
     * Register a service with the container
     */
    register(token, factory, lifetime = exports.ServiceLifetime.Transient, dependencies = []) {
        this.services.set(token, {
            token,
            factory,
            lifetime,
            dependencies,
        });
        return this;
    }
    /**
     * Register a singleton service
     */
    registerSingleton(token, factory, dependencies = []) {
        return this.register(token, factory, exports.ServiceLifetime.Singleton, dependencies);
    }
    /**
     * Register a transient service
     */
    registerTransient(token, factory, dependencies = []) {
        return this.register(token, factory, exports.ServiceLifetime.Transient, dependencies);
    }
    /**
     * Register a class with automatic dependency injection
     */
    registerClass(constructor, dependencies = [], lifetime = exports.ServiceLifetime.Transient, token) {
        const serviceToken = token || constructor;
        const factory = (container) => {
            const resolvedDependencies = dependencies.map((dep) => container.resolve(dep));
            return new constructor(...resolvedDependencies);
        };
        return this.register(serviceToken, factory, lifetime, dependencies);
    }
    /**
     * Register an instance as a singleton
     */
    registerInstance(token, instance) {
        this.services.set(token, {
            token,
            factory: () => instance,
            lifetime: exports.ServiceLifetime.Singleton,
            dependencies: [],
            singleton: instance,
        });
        return this;
    }
    /**
     * Resolve a service from the container
     */
    resolve(token) {
        const startTime = this.options.enablePerformanceTracking ? performance.now() : 0;
        try {
            this.metrics.resolutions++;
            const result = this.resolveInternal(token);
            if (this.options.enablePerformanceTracking) {
                const resolutionTime = performance.now() - startTime;
                this.updateAverageResolutionTime(resolutionTime);
            }
            return result;
        }
        catch (error) {
            this.resolutionStack.length = 0; // Clear stack on error
            throw error;
        }
    }
    /**
     * Internal resolution method with circular dependency detection
     */
    resolveInternal(token) {
        // Check resolution depth
        if (this.resolutionStack.length >= this.options.maxResolutionDepth) {
            throw new MaxDepthExceededError(this.options.maxResolutionDepth);
        }
        // Update peak resolution depth
        if (this.resolutionStack.length > this.metrics.peakResolutionDepth) {
            this.metrics.peakResolutionDepth = this.resolutionStack.length;
        }
        // Circular dependency detection
        if (this.options.enableCircularDependencyDetection) {
            this.metrics.circularDependencyChecks++;
            if (this.resolutionStack.includes(token)) {
                const circularChain = [...this.resolutionStack, token];
                throw new CircularDependencyError(circularChain);
            }
        }
        const registration = this.services.get(token);
        if (!registration) {
            throw new ServiceNotFoundError(token);
        }
        // Return singleton instance if already created
        if (registration.lifetime === exports.ServiceLifetime.Singleton && registration.singleton) {
            return registration.singleton;
        }
        // Add to resolution stack
        this.resolutionStack.push(token);
        try {
            // Create new instance
            const instance = registration.factory(this);
            // Store singleton instance
            if (registration.lifetime === exports.ServiceLifetime.Singleton) {
                registration.singleton = instance;
                this.metrics.singletonCreations++;
            }
            else {
                this.metrics.transientCreations++;
            }
            return instance;
        }
        finally {
            // Remove from resolution stack
            this.resolutionStack.pop();
        }
    }
    /**
     * Check if a service is registered
     */
    isRegistered(token) {
        return this.services.has(token);
    }
    /**
     * Unregister a service
     */
    unregister(token) {
        return this.services.delete(token);
    }
    /**
     * Clear all registrations
     */
    clear() {
        this.services.clear();
        this.resolutionStack.length = 0;
        this.resetMetrics();
    }
    /**
     * Get container performance metrics
     */
    getMetrics() {
        return { ...this.metrics };
    }
    /**
     * Reset performance metrics
     */
    resetMetrics() {
        this.metrics.resolutions = 0;
        this.metrics.singletonCreations = 0;
        this.metrics.transientCreations = 0;
        this.metrics.circularDependencyChecks = 0;
        this.metrics.averageResolutionTime = 0;
        this.metrics.peakResolutionDepth = 0;
    }
    /**
     * Get all registered service tokens
     */
    getRegisteredTokens() {
        return Array.from(this.services.keys());
    }
    /**
     * Create a child container with inherited registrations
     */
    createChild() {
        const child = new Container(this.options);
        // Copy all registrations to child
        for (const [token, registration] of this.services) {
            child.services.set(token, { ...registration });
        }
        return child;
    }
    /**
     * Dispose the container and clean up resources
     */
    dispose() {
        // Dispose all singleton instances that implement IDisposable
        for (const registration of this.services.values()) {
            if (registration.singleton && typeof registration.singleton === 'object') {
                const disposable = registration.singleton;
                if (typeof disposable.dispose === 'function') {
                    try {
                        disposable.dispose();
                    }
                    catch (error) {
                        console.warn(`Error disposing service ${String(registration.token)}:`, error);
                    }
                }
            }
        }
        this.clear();
    }
    /**
     * Update average resolution time metric
     */
    updateAverageResolutionTime(newTime) {
        const count = this.metrics.resolutions;
        const currentAverage = this.metrics.averageResolutionTime;
        this.metrics.averageResolutionTime = (currentAverage * (count - 1) + newTime) / count;
    }
}
/**
 * Global container instance
 */
const container = new Container();
/**
 * Helper function to create service tokens
 */
function createToken(description) {
    return Symbol(description);
}

/**
 * Injectable decorator and related types for dependency injection
 *
 * Provides decorators and metadata for automatic dependency injection
 * in the CREB-JS container system.
 *
 * @author Loganathane Virassamy
 * @version 1.6.0
 */
/**
 * Service lifetime enumeration
 */
var ServiceLifetime;
(function (ServiceLifetime) {
    ServiceLifetime["Singleton"] = "singleton";
    ServiceLifetime["Transient"] = "transient";
})(ServiceLifetime || (ServiceLifetime = {}));
/**
 * Metadata key for injectable services
 */
const INJECTABLE_METADATA_KEY = Symbol.for('injectable');
/**
 * Metadata key for constructor parameters
 */
const PARAM_TYPES_METADATA_KEY = 'design:paramtypes';
/**
 * Injectable class decorator
 *
 * Marks a class as injectable and provides metadata for dependency injection.
 *
 * @param options Optional configuration for the injectable service
 */
function Injectable(options = {}) {
    return function (constructor) {
        // Get constructor parameter types from TypeScript compiler
        const paramTypes = Reflect.getMetadata(PARAM_TYPES_METADATA_KEY, constructor) || [];
        // Create injectable metadata
        const metadata = {
            dependencies: paramTypes,
            lifetime: options.lifetime || ServiceLifetime.Transient,
            token: options.token,
        };
        // Store metadata on the constructor
        Reflect.defineMetadata(INJECTABLE_METADATA_KEY, metadata, constructor);
        return constructor;
    };
}
/**
 * Inject decorator for constructor parameters
 *
 * Explicitly specifies the token to inject for a constructor parameter.
 * Useful when TypeScript reflection doesn't provide enough information.
 *
 * @param token The service token to inject
 */
function Inject(token) {
    return function (target, propertyKey, parameterIndex) {
        const existingMetadata = Reflect.getMetadata(INJECTABLE_METADATA_KEY, target) || {};
        const dependencies = existingMetadata.dependencies || [];
        // Ensure dependencies array is large enough
        while (dependencies.length <= parameterIndex) {
            dependencies.push(undefined);
        }
        // Set the specific dependency
        dependencies[parameterIndex] = token;
        // Update metadata
        const updatedMetadata = {
            ...existingMetadata,
            dependencies,
        };
        Reflect.defineMetadata(INJECTABLE_METADATA_KEY, updatedMetadata, target);
    };
}
/**
 * Optional decorator for constructor parameters
 *
 * Marks a dependency as optional, allowing injection to succeed
 * even if the service is not registered.
 *
 * @param defaultValue Optional default value to use if service is not found
 */
function Optional(defaultValue) {
    return function (target, propertyKey, parameterIndex) {
        const existingMetadata = Reflect.getMetadata(INJECTABLE_METADATA_KEY, target) || {};
        const optionalDependencies = existingMetadata.optionalDependencies || new Set();
        optionalDependencies.add(parameterIndex);
        const updatedMetadata = {
            ...existingMetadata,
            optionalDependencies,
            defaultValues: {
                ...existingMetadata.defaultValues,
                [parameterIndex]: defaultValue,
            },
        };
        Reflect.defineMetadata(INJECTABLE_METADATA_KEY, updatedMetadata, target);
    };
}
/**
 * Get injectable metadata from a constructor
 */
function getInjectableMetadata(constructor) {
    return Reflect.getMetadata(INJECTABLE_METADATA_KEY, constructor);
}
/**
 * Check if a constructor is marked as injectable
 */
function isInjectable(constructor) {
    return Reflect.hasMetadata(INJECTABLE_METADATA_KEY, constructor);
}
/**
 * Helper function to extract dependency tokens from a constructor
 */
function getDependencyTokens(constructor) {
    const metadata = getInjectableMetadata(constructor);
    if (!metadata) {
        return [];
    }
    return metadata.dependencies || [];
}
/**
 * Factory for creating injectable class decorators with specific lifetimes
 */
const Singleton = (options = {}) => Injectable({ ...options, lifetime: ServiceLifetime.Singleton });
const Transient = (options = {}) => Injectable({ ...options, lifetime: ServiceLifetime.Transient });

/**
 * Enhanced Error Handling for CREB-JS
 * Provides structured error types with context, stack traces, and error classification
 */
exports.ErrorCategory = void 0;
(function (ErrorCategory) {
    ErrorCategory["VALIDATION"] = "VALIDATION";
    ErrorCategory["NETWORK"] = "NETWORK";
    ErrorCategory["COMPUTATION"] = "COMPUTATION";
    ErrorCategory["DATA"] = "DATA";
    ErrorCategory["SYSTEM"] = "SYSTEM";
    ErrorCategory["EXTERNAL_API"] = "EXTERNAL_API";
    ErrorCategory["TIMEOUT"] = "TIMEOUT";
    ErrorCategory["RATE_LIMIT"] = "RATE_LIMIT";
    ErrorCategory["AUTHENTICATION"] = "AUTHENTICATION";
    ErrorCategory["PERMISSION"] = "PERMISSION";
})(exports.ErrorCategory || (exports.ErrorCategory = {}));
exports.ErrorSeverity = void 0;
(function (ErrorSeverity) {
    ErrorSeverity["LOW"] = "LOW";
    ErrorSeverity["MEDIUM"] = "MEDIUM";
    ErrorSeverity["HIGH"] = "HIGH";
    ErrorSeverity["CRITICAL"] = "CRITICAL";
})(exports.ErrorSeverity || (exports.ErrorSeverity = {}));
/**
 * Base CREB Error class with enhanced context and metadata
 */
class CREBError extends Error {
    constructor(message, category, severity = exports.ErrorSeverity.MEDIUM, context = {}, options = {}) {
        super(message);
        this.name = 'CREBError';
        // Ensure proper prototype chain for instanceof checks
        Object.setPrototypeOf(this, CREBError.prototype);
        this.metadata = {
            category,
            severity,
            retryable: options.retryable ?? this.isRetryableByDefault(category),
            errorCode: options.errorCode ?? this.generateErrorCode(category),
            correlationId: options.correlationId ?? this.generateCorrelationId(),
            context: {
                ...context,
                timestamp: new Date(),
                version: '1.5.0' // TODO: Get from package.json
            },
            timestamp: new Date(),
            stackTrace: this.stack,
            innerError: options.innerError,
            sugggestedAction: options.suggestedAction
        };
        // Capture stack trace for V8 engines
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, CREBError);
        }
    }
    /**
     * Serialize error for logging and telemetry
     */
    toJSON() {
        return {
            name: this.name,
            message: this.message,
            metadata: {
                ...this.metadata,
                innerError: this.metadata.innerError?.message
            }
        };
    }
    /**
     * Create a sanitized version for client-side consumption
     */
    toClientSafe() {
        return {
            message: this.message,
            category: this.metadata.category,
            severity: this.metadata.severity,
            errorCode: this.metadata.errorCode,
            correlationId: this.metadata.correlationId,
            retryable: this.metadata.retryable,
            suggestedAction: this.metadata.sugggestedAction
        };
    }
    /**
     * Check if error is retryable based on category and context
     */
    isRetryable() {
        return this.metadata.retryable;
    }
    /**
     * Get human-readable error description
     */
    getDescription() {
        const parts = [
            `[${this.metadata.category}:${this.metadata.severity}]`,
            this.message
        ];
        if (this.metadata.sugggestedAction) {
            parts.push(`Suggestion: ${this.metadata.sugggestedAction}`);
        }
        return parts.join(' ');
    }
    isRetryableByDefault(category) {
        const retryableCategories = [
            exports.ErrorCategory.NETWORK,
            exports.ErrorCategory.TIMEOUT,
            exports.ErrorCategory.RATE_LIMIT,
            exports.ErrorCategory.EXTERNAL_API
        ];
        return retryableCategories.includes(category);
    }
    generateErrorCode(category) {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substring(2, 8);
        return `${category}_${timestamp}_${random}`.toUpperCase();
    }
    generateCorrelationId() {
        return `creb_${Date.now()}_${Math.random().toString(36).substring(2, 12)}`;
    }
}
/**
 * Validation Error - for input validation failures
 */
class ValidationError extends CREBError {
    constructor(message, context = {}, options = {}) {
        super(message, exports.ErrorCategory.VALIDATION, exports.ErrorSeverity.MEDIUM, {
            ...context,
            field: options.field,
            value: options.value,
            constraint: options.constraint
        }, {
            retryable: false,
            suggestedAction: 'Please check the input parameters and try again'
        });
        this.name = 'ValidationError';
    }
}
/**
 * Network Error - for network-related failures
 */
class NetworkError extends CREBError {
    constructor(message, context = {}, options = {}) {
        super(message, exports.ErrorCategory.NETWORK, exports.ErrorSeverity.HIGH, {
            ...context,
            statusCode: options.statusCode,
            url: options.url,
            method: options.method,
            timeout: options.timeout
        }, {
            retryable: true,
            suggestedAction: 'Check network connectivity and try again'
        });
        this.name = 'NetworkError';
    }
}
/**
 * External API Error - for third-party API failures
 */
class ExternalAPIError extends CREBError {
    constructor(message, apiName, context = {}, options = {}) {
        const severity = options.rateLimited ? exports.ErrorSeverity.MEDIUM : exports.ErrorSeverity.HIGH;
        const category = options.rateLimited ? exports.ErrorCategory.RATE_LIMIT : exports.ErrorCategory.EXTERNAL_API;
        super(message, category, severity, {
            ...context,
            apiName,
            statusCode: options.statusCode,
            responseBody: options.responseBody,
            endpoint: options.endpoint
        }, {
            retryable: options.rateLimited || (!!options.statusCode && options.statusCode >= 500),
            suggestedAction: options.rateLimited
                ? 'Rate limit exceeded. Please wait before retrying'
                : 'External service unavailable. Please try again later'
        });
        this.name = 'ExternalAPIError';
    }
}
/**
 * Computation Error - for calculation failures
 */
class ComputationError extends CREBError {
    constructor(message, context = {}, options = {}) {
        super(message, exports.ErrorCategory.COMPUTATION, exports.ErrorSeverity.MEDIUM, {
            ...context,
            algorithm: options.algorithm,
            input: options.input,
            expectedRange: options.expectedRange
        }, {
            retryable: false,
            suggestedAction: 'Please verify input parameters and calculation constraints'
        });
        this.name = 'ComputationError';
    }
}
/**
 * System Error - for internal system failures
 */
class SystemError extends CREBError {
    constructor(message, context = {}, options = {}) {
        super(message, exports.ErrorCategory.SYSTEM, exports.ErrorSeverity.CRITICAL, {
            ...context,
            subsystem: options.subsystem,
            resource: options.resource
        }, {
            retryable: false,
            suggestedAction: 'Internal system error. Please contact support'
        });
        this.name = 'SystemError';
    }
}
/**
 * Error aggregation utility for collecting and analyzing multiple errors
 */
class ErrorAggregator {
    constructor(maxErrors = 100) {
        this.errors = [];
        this.maxErrors = maxErrors;
    }
    /**
     * Add an error to the aggregator
     */
    addError(error) {
        this.errors.push(error);
        // Keep only the most recent errors
        if (this.errors.length > this.maxErrors) {
            this.errors.shift();
        }
    }
    /**
     * Get errors by category
     */
    getErrorsByCategory(category) {
        return this.errors.filter(error => error.metadata.category === category);
    }
    /**
     * Get errors by severity
     */
    getErrorsBySeverity(severity) {
        return this.errors.filter(error => error.metadata.severity === severity);
    }
    /**
     * Get error statistics
     */
    getStatistics() {
        const byCategory = {};
        const bySeverity = {};
        let retryableCount = 0;
        // Initialize counters
        Object.values(exports.ErrorCategory).forEach(cat => byCategory[cat] = 0);
        Object.values(exports.ErrorSeverity).forEach(sev => bySeverity[sev] = 0);
        // Count errors
        this.errors.forEach(error => {
            byCategory[error.metadata.category]++;
            bySeverity[error.metadata.severity]++;
            if (error.isRetryable()) {
                retryableCount++;
            }
        });
        return {
            total: this.errors.length,
            byCategory,
            bySeverity,
            retryableCount,
            recentErrors: this.errors.slice(-10) // Last 10 errors
        };
    }
    /**
     * Clear all collected errors
     */
    clear() {
        this.errors = [];
    }
    /**
     * Get all errors as JSON for logging
     */
    toJSON() {
        return this.errors.map(error => error.toJSON());
    }
}
/**
 * Utility functions for error handling
 */
class ErrorUtils {
    /**
     * Wrap a function with error handling and transformation
     */
    static withErrorHandling(fn, errorTransformer) {
        return (...args) => {
            try {
                return fn(...args);
            }
            catch (error) {
                throw errorTransformer ? errorTransformer(error) : ErrorUtils.transformUnknownError(error);
            }
        };
    }
    /**
     * Wrap an async function with error handling and transformation
     */
    static withAsyncErrorHandling(fn, errorTransformer) {
        return async (...args) => {
            try {
                return await fn(...args);
            }
            catch (error) {
                throw errorTransformer ? errorTransformer(error) : ErrorUtils.transformUnknownError(error);
            }
        };
    }
    /**
     * Transform unknown errors into CREBError instances
     */
    static transformUnknownError(error) {
        if (error instanceof CREBError) {
            return error;
        }
        if (error instanceof Error) {
            return new SystemError(error.message, { originalError: error.name }, { subsystem: 'unknown' });
        }
        return new SystemError(typeof error === 'string' ? error : 'Unknown error occurred', { originalError: error });
    }
    /**
     * Check if an error indicates a transient failure
     */
    static isTransientError(error) {
        if (error instanceof CREBError) {
            return error.isRetryable();
        }
        // Common patterns for transient errors
        const transientPatterns = [
            /timeout/i,
            /connection/i,
            /network/i,
            /503/,
            /502/,
            /504/,
            /rate limit/i
        ];
        const message = error?.message || String(error);
        return transientPatterns.some(pattern => pattern.test(message));
    }
}

/**
 * Circuit Breaker Pattern Implementation for CREB-JS
 * Prevents cascading failures by monitoring and controlling access to external resources
 */
exports.CircuitBreakerState = void 0;
(function (CircuitBreakerState) {
    CircuitBreakerState["CLOSED"] = "CLOSED";
    CircuitBreakerState["OPEN"] = "OPEN";
    CircuitBreakerState["HALF_OPEN"] = "HALF_OPEN"; // Testing if service recovered
})(exports.CircuitBreakerState || (exports.CircuitBreakerState = {}));
/**
 * Circuit Breaker implementation for fault tolerance
 */
class CircuitBreaker {
    constructor(name, config) {
        this.name = name;
        this.state = exports.CircuitBreakerState.CLOSED;
        this.failureCount = 0;
        this.successCount = 0;
        this.stateChangedAt = new Date();
        this.callHistory = [];
        // Default configuration
        const defaultConfig = {
            failureThreshold: 5,
            failureRate: 50,
            monitoringWindow: 60000, // 1 minute
            timeout: 30000, // 30 seconds
            successThreshold: 3,
            minimumCalls: 10,
            isFailure: (error) => true, // All errors count as failures by default
            onStateChange: () => { },
            onCircuitOpen: () => { },
            onCircuitClose: () => { }
        };
        // Merge with provided config
        this.config = {
            ...defaultConfig,
            ...config
        };
    }
    /**
     * Execute a function with circuit breaker protection
     */
    async execute(fn) {
        if (this.state === exports.CircuitBreakerState.OPEN) {
            if (this.shouldAttemptReset()) {
                this.setState(exports.CircuitBreakerState.HALF_OPEN);
            }
            else {
                throw new ExternalAPIError(`Circuit breaker is OPEN for ${this.name}. Service is currently unavailable.`, this.name, {
                    circuitBreakerState: this.state,
                    nextAttemptTime: this.nextAttemptTime
                }, {
                    rateLimited: false,
                    statusCode: 503
                });
            }
        }
        const startTime = Date.now();
        try {
            const result = await fn();
            this.onSuccess(Date.now() - startTime);
            return result;
        }
        catch (error) {
            this.onFailure(error, Date.now() - startTime);
            throw error;
        }
    }
    /**
     * Execute a synchronous function with circuit breaker protection
     */
    executeSync(fn) {
        if (this.state === exports.CircuitBreakerState.OPEN) {
            if (this.shouldAttemptReset()) {
                this.setState(exports.CircuitBreakerState.HALF_OPEN);
            }
            else {
                throw new ExternalAPIError(`Circuit breaker is OPEN for ${this.name}. Service is currently unavailable.`, this.name, {
                    circuitBreakerState: this.state,
                    nextAttemptTime: this.nextAttemptTime
                }, {
                    rateLimited: false,
                    statusCode: 503
                });
            }
        }
        const startTime = Date.now();
        try {
            const result = fn();
            this.onSuccess(Date.now() - startTime);
            return result;
        }
        catch (error) {
            this.onFailure(error, Date.now() - startTime);
            throw error;
        }
    }
    /**
     * Get current circuit breaker metrics
     */
    getMetrics() {
        const now = Date.now();
        const recentCalls = this.getRecentCalls();
        const totalCalls = recentCalls.length;
        const failures = recentCalls.filter(call => !call.success).length;
        return {
            state: this.state,
            failureCount: this.failureCount,
            successCount: this.successCount,
            totalCalls,
            failureRate: totalCalls > 0 ? (failures / totalCalls) * 100 : 0,
            lastFailureTime: this.lastFailureTime,
            lastSuccessTime: this.lastSuccessTime,
            stateChangedAt: this.stateChangedAt,
            timeSinceStateChange: now - this.stateChangedAt.getTime(),
            nextAttemptTime: this.nextAttemptTime
        };
    }
    /**
     * Reset the circuit breaker to closed state
     */
    reset() {
        this.setState(exports.CircuitBreakerState.CLOSED);
        this.failureCount = 0;
        this.successCount = 0;
        this.lastFailureTime = undefined;
        this.nextAttemptTime = undefined;
        this.callHistory = [];
    }
    /**
     * Force the circuit breaker to open state
     */
    trip() {
        this.setState(exports.CircuitBreakerState.OPEN);
        this.setNextAttemptTime();
        this.config.onCircuitOpen(new Error('Circuit breaker manually tripped'));
    }
    /**
     * Check if the circuit breaker is currently open
     */
    isOpen() {
        return this.state === exports.CircuitBreakerState.OPEN;
    }
    /**
     * Check if the circuit breaker is currently half-open
     */
    isHalfOpen() {
        return this.state === exports.CircuitBreakerState.HALF_OPEN;
    }
    /**
     * Check if the circuit breaker is currently closed
     */
    isClosed() {
        return this.state === exports.CircuitBreakerState.CLOSED;
    }
    onSuccess(duration) {
        this.recordCall(true, duration);
        this.successCount++;
        this.lastSuccessTime = new Date();
        if (this.state === exports.CircuitBreakerState.HALF_OPEN) {
            if (this.successCount >= this.config.successThreshold) {
                this.setState(exports.CircuitBreakerState.CLOSED);
                this.failureCount = 0;
                this.config.onCircuitClose();
            }
        }
    }
    onFailure(error, duration) {
        if (this.config.isFailure(error)) {
            this.recordCall(false, duration, error);
            this.failureCount++;
            this.lastFailureTime = new Date();
            if (this.state === exports.CircuitBreakerState.HALF_OPEN) {
                this.setState(exports.CircuitBreakerState.OPEN);
                this.setNextAttemptTime();
                this.config.onCircuitOpen(error);
            }
            else if (this.state === exports.CircuitBreakerState.CLOSED && this.shouldOpenCircuit()) {
                this.setState(exports.CircuitBreakerState.OPEN);
                this.setNextAttemptTime();
                this.config.onCircuitOpen(error);
            }
        }
    }
    shouldOpenCircuit() {
        const recentCalls = this.getRecentCalls();
        // Check if we have minimum number of calls
        if (recentCalls.length < this.config.minimumCalls) {
            return false;
        }
        // Check failure count threshold
        if (this.failureCount >= this.config.failureThreshold) {
            return true;
        }
        // Check failure rate threshold
        const failures = recentCalls.filter(call => !call.success).length;
        const failureRate = (failures / recentCalls.length) * 100;
        return failureRate >= this.config.failureRate;
    }
    shouldAttemptReset() {
        return this.nextAttemptTime ? Date.now() >= this.nextAttemptTime.getTime() : false;
    }
    setState(newState) {
        const previousState = this.state;
        if (previousState !== newState) {
            this.state = newState;
            this.stateChangedAt = new Date();
            // Reset counters on state change
            if (newState === exports.CircuitBreakerState.CLOSED) {
                this.failureCount = 0;
                this.successCount = 0;
            }
            else if (newState === exports.CircuitBreakerState.HALF_OPEN) {
                this.successCount = 0;
            }
            this.config.onStateChange(newState, previousState);
        }
    }
    setNextAttemptTime() {
        this.nextAttemptTime = new Date(Date.now() + this.config.timeout);
    }
    recordCall(success, duration, error) {
        const record = {
            timestamp: Date.now(),
            success,
            duration,
            error
        };
        this.callHistory.push(record);
        // Keep only recent calls within monitoring window
        const cutoff = Date.now() - this.config.monitoringWindow;
        this.callHistory = this.callHistory.filter(call => call.timestamp >= cutoff);
    }
    getRecentCalls() {
        const cutoff = Date.now() - this.config.monitoringWindow;
        return this.callHistory.filter(call => call.timestamp >= cutoff);
    }
}
/**
 * Circuit Breaker Manager for handling multiple circuit breakers
 */
class CircuitBreakerManager {
    constructor() {
        this.breakers = new Map();
    }
    /**
     * Create or get a circuit breaker for a service
     */
    getBreaker(name, config) {
        if (!this.breakers.has(name)) {
            if (!config) {
                throw new SystemError(`Circuit breaker configuration required for new service: ${name}`, { service: name }, { subsystem: 'CircuitBreakerManager' });
            }
            this.breakers.set(name, new CircuitBreaker(name, config));
        }
        return this.breakers.get(name);
    }
    /**
     * Remove a circuit breaker
     */
    removeBreaker(name) {
        return this.breakers.delete(name);
    }
    /**
     * Get metrics for all circuit breakers
     */
    getAllMetrics() {
        const metrics = {};
        for (const [name, breaker] of this.breakers) {
            metrics[name] = breaker.getMetrics();
        }
        return metrics;
    }
    /**
     * Reset all circuit breakers
     */
    resetAll() {
        for (const breaker of this.breakers.values()) {
            breaker.reset();
        }
    }
    /**
     * Get health status of all services
     */
    getHealthStatus() {
        const healthy = [];
        const degraded = [];
        const failed = [];
        for (const [name, breaker] of this.breakers) {
            const metrics = breaker.getMetrics();
            if (metrics.state === exports.CircuitBreakerState.CLOSED) {
                if (metrics.failureRate < 10) {
                    healthy.push(name);
                }
                else {
                    degraded.push(name);
                }
            }
            else {
                failed.push(name);
            }
        }
        return {
            healthy,
            degraded,
            failed,
            total: this.breakers.size
        };
    }
}
// Global circuit breaker manager instance
const circuitBreakerManager = new CircuitBreakerManager();
/**
 * Decorator for automatic circuit breaker protection
 */
function WithCircuitBreaker(name, config) {
    return function (target, propertyKey, descriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = async function (...args) {
            const breaker = circuitBreakerManager.getBreaker(name, config);
            return breaker.execute(() => originalMethod.apply(this, args));
        };
        return descriptor;
    };
}

/**
 * Retry Policy Implementation for CREB-JS
 * Provides intelligent retry strategies with exponential backoff, jitter, and rate limiting
 */
exports.RetryStrategy = void 0;
(function (RetryStrategy) {
    RetryStrategy["FIXED_DELAY"] = "FIXED_DELAY";
    RetryStrategy["LINEAR_BACKOFF"] = "LINEAR_BACKOFF";
    RetryStrategy["EXPONENTIAL_BACKOFF"] = "EXPONENTIAL_BACKOFF";
    RetryStrategy["EXPONENTIAL_BACKOFF_JITTER"] = "EXPONENTIAL_BACKOFF_JITTER";
})(exports.RetryStrategy || (exports.RetryStrategy = {}));
/**
 * Rate limiter to respect API rate limits during retries
 */
class RateLimiter {
    constructor(maxRequests, windowMs) {
        this.maxRequests = maxRequests;
        this.windowMs = windowMs;
        this.requests = [];
    }
    /**
     * Check if a request can be made within rate limits
     */
    canMakeRequest() {
        const now = Date.now();
        const windowStart = now - this.windowMs;
        // Remove old requests outside the window
        this.requests = this.requests.filter(time => time > windowStart);
        return this.requests.length < this.maxRequests;
    }
    /**
     * Record a request
     */
    recordRequest() {
        this.requests.push(Date.now());
    }
    /**
     * Get time until next request is allowed
     */
    getTimeUntilNextRequest() {
        if (this.canMakeRequest()) {
            return 0;
        }
        const oldestRequest = Math.min(...this.requests);
        const windowStart = Date.now() - this.windowMs;
        return Math.max(0, oldestRequest - windowStart);
    }
    /**
     * Reset the rate limiter
     */
    reset() {
        this.requests = [];
    }
}
/**
 * Retry Policy implementation with intelligent backoff strategies
 */
class RetryPolicy {
    constructor(config, rateLimiter) {
        // Default configuration with proper typing
        const defaultConfig = {
            maxAttempts: 3,
            initialDelay: 1000,
            maxDelay: 30000,
            strategy: exports.RetryStrategy.EXPONENTIAL_BACKOFF_JITTER,
            backoffMultiplier: 2,
            jitterFactor: 0.1,
            shouldRetry: (error, attempt) => {
                // Default retry logic - retry on any error (except for specific non-retryable ones)
                // If it's a CREB error, use its retryable flag
                if (error instanceof CREBError) {
                    return error.isRetryable();
                }
                // For other errors, retry unless they're clearly non-retryable
                const message = error?.message || String(error);
                const nonRetryablePatterns = [
                    /authorization/i,
                    /forbidden/i,
                    /401/,
                    /403/,
                    /404/,
                    /validation/i,
                    /syntax/i
                ];
                return !nonRetryablePatterns.some(pattern => pattern.test(message));
            },
            onRetry: () => { },
            onFailure: () => { },
            onSuccess: () => { }
        };
        this.config = {
            ...defaultConfig,
            ...config
        };
        this.rateLimiter = rateLimiter;
    }
    /**
     * Execute a function with retry logic
     */
    async execute(fn) {
        const startTime = Date.now();
        let attempt = 1;
        let totalDelay = 0;
        let lastError;
        const delays = [];
        // Global timeout setup
        let globalTimeoutId;
        let globalTimeoutPromise;
        if (this.config.globalTimeout) {
            globalTimeoutPromise = new Promise((_, reject) => {
                globalTimeoutId = setTimeout(() => {
                    reject(new CREBError(`Global timeout of ${this.config.globalTimeout}ms exceeded`, exports.ErrorCategory.TIMEOUT, exports.ErrorSeverity.HIGH, { globalTimeout: this.config.globalTimeout, attempt }));
                }, this.config.globalTimeout);
            });
        }
        try {
            while (attempt <= this.config.maxAttempts) {
                try {
                    // Check rate limits
                    if (this.rateLimiter) {
                        while (!this.rateLimiter.canMakeRequest()) {
                            const waitTime = this.rateLimiter.getTimeUntilNextRequest();
                            if (waitTime > 0) {
                                await this.delay(waitTime);
                            }
                        }
                        this.rateLimiter.recordRequest();
                    }
                    // Execute with timeout if specified
                    let result;
                    if (this.config.attemptTimeout) {
                        const timeoutPromise = this.createTimeoutPromise(this.config.attemptTimeout, attempt);
                        const promises = [fn()];
                        if (globalTimeoutPromise)
                            promises.push(globalTimeoutPromise);
                        promises.push(timeoutPromise);
                        result = await Promise.race(promises);
                    }
                    else {
                        const promises = [fn()];
                        if (globalTimeoutPromise)
                            promises.push(globalTimeoutPromise);
                        result = await Promise.race(promises);
                    }
                    // Success!
                    const executionTime = Date.now() - startTime;
                    const metrics = {
                        totalAttempts: attempt,
                        successfulAttempts: 1,
                        failedAttempts: attempt - 1,
                        averageDelay: delays.length > 0 ? totalDelay / delays.length : 0,
                        totalDelay,
                        executionTime
                    };
                    this.config.onSuccess(result, attempt);
                    return {
                        result,
                        metrics,
                        succeeded: true
                    };
                }
                catch (error) {
                    lastError = error;
                    // Check if we should retry
                    if (!this.config.shouldRetry(error, attempt) || attempt >= this.config.maxAttempts) {
                        break;
                    }
                    // Calculate delay for next attempt
                    const delay = this.calculateDelay(attempt);
                    delays.push(delay);
                    totalDelay += delay;
                    this.config.onRetry(error, attempt, delay);
                    // Wait before next attempt
                    await this.delay(delay);
                    attempt++;
                }
            }
            // All retries exhausted
            const executionTime = Date.now() - startTime;
            const metrics = {
                totalAttempts: attempt,
                successfulAttempts: 0,
                failedAttempts: attempt,
                averageDelay: delays.length > 0 ? totalDelay / delays.length : 0,
                totalDelay,
                lastError,
                executionTime
            };
            this.config.onFailure(lastError, attempt);
            return {
                result: undefined,
                metrics,
                succeeded: false,
                finalError: lastError
            };
        }
        finally {
            if (globalTimeoutId) {
                clearTimeout(globalTimeoutId);
            }
        }
    }
    /**
     * Execute a synchronous function with retry logic
     */
    executeSync(fn) {
        const startTime = Date.now();
        let attempt = 1;
        let totalDelay = 0;
        let lastError;
        const delays = [];
        while (attempt <= this.config.maxAttempts) {
            try {
                // Check rate limits (blocking)
                if (this.rateLimiter) {
                    while (!this.rateLimiter.canMakeRequest()) {
                        const waitTime = this.rateLimiter.getTimeUntilNextRequest();
                        if (waitTime > 0) {
                            // Synchronous delay (not recommended for production)
                            const start = Date.now();
                            while (Date.now() - start < waitTime) {
                                // Busy wait
                            }
                        }
                    }
                    this.rateLimiter.recordRequest();
                }
                const result = fn();
                // Success!
                const executionTime = Date.now() - startTime;
                const metrics = {
                    totalAttempts: attempt,
                    successfulAttempts: 1,
                    failedAttempts: attempt - 1,
                    averageDelay: delays.length > 0 ? totalDelay / delays.length : 0,
                    totalDelay,
                    executionTime
                };
                this.config.onSuccess(result, attempt);
                return {
                    result,
                    metrics,
                    succeeded: true
                };
            }
            catch (error) {
                lastError = error;
                // Check if we should retry
                if (!this.config.shouldRetry(error, attempt) || attempt >= this.config.maxAttempts) {
                    break;
                }
                // Calculate delay for next attempt
                const delay = this.calculateDelay(attempt);
                delays.push(delay);
                totalDelay += delay;
                this.config.onRetry(error, attempt, delay);
                attempt++;
            }
        }
        // All retries exhausted
        const executionTime = Date.now() - startTime;
        const metrics = {
            totalAttempts: attempt,
            successfulAttempts: 0,
            failedAttempts: attempt,
            averageDelay: delays.length > 0 ? totalDelay / delays.length : 0,
            totalDelay,
            lastError,
            executionTime
        };
        this.config.onFailure(lastError, attempt);
        return {
            result: undefined,
            metrics,
            succeeded: false,
            finalError: lastError
        };
    }
    calculateDelay(attempt) {
        let delay;
        switch (this.config.strategy) {
            case exports.RetryStrategy.FIXED_DELAY:
                delay = this.config.initialDelay;
                break;
            case exports.RetryStrategy.LINEAR_BACKOFF:
                delay = this.config.initialDelay * attempt;
                break;
            case exports.RetryStrategy.EXPONENTIAL_BACKOFF:
                delay = this.config.initialDelay * Math.pow(this.config.backoffMultiplier, attempt - 1);
                break;
            case exports.RetryStrategy.EXPONENTIAL_BACKOFF_JITTER:
                const exponentialDelay = this.config.initialDelay * Math.pow(this.config.backoffMultiplier, attempt - 1);
                const jitter = exponentialDelay * this.config.jitterFactor * Math.random();
                delay = exponentialDelay + jitter;
                break;
            default:
                delay = this.config.initialDelay;
        }
        // Cap at maximum delay
        return Math.min(delay, this.config.maxDelay);
    }
    async delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    createTimeoutPromise(timeoutMs, attempt) {
        return new Promise((_, reject) => {
            setTimeout(() => {
                reject(new CREBError(`Attempt ${attempt} timed out after ${timeoutMs}ms`, exports.ErrorCategory.TIMEOUT, exports.ErrorSeverity.MEDIUM, { attemptTimeout: timeoutMs, attempt }));
            }, timeoutMs);
        });
    }
}
/**
 * Predefined retry policies for common scenarios
 */
class RetryPolicies {
    /**
     * Conservative retry policy for critical operations
     */
    static conservative() {
        return new RetryPolicy({
            maxAttempts: 2,
            initialDelay: 2000,
            maxDelay: 10000,
            strategy: exports.RetryStrategy.EXPONENTIAL_BACKOFF_JITTER,
            backoffMultiplier: 2,
            jitterFactor: 0.1
        });
    }
    /**
     * Aggressive retry policy for non-critical operations
     */
    static aggressive() {
        return new RetryPolicy({
            maxAttempts: 5,
            initialDelay: 500,
            maxDelay: 30000,
            strategy: exports.RetryStrategy.EXPONENTIAL_BACKOFF_JITTER,
            backoffMultiplier: 2,
            jitterFactor: 0.2
        });
    }
    /**
     * Quick retry policy for fast operations
     */
    static quick() {
        return new RetryPolicy({
            maxAttempts: 3,
            initialDelay: 100,
            maxDelay: 1000,
            strategy: exports.RetryStrategy.LINEAR_BACKOFF,
            backoffMultiplier: 1.5,
            jitterFactor: 0.1
        });
    }
    /**
     * Network-specific retry policy with rate limiting
     */
    static network(maxRequestsPerMinute = 60) {
        const rateLimiter = new RateLimiter(maxRequestsPerMinute, 60000);
        return new RetryPolicy({
            maxAttempts: 4,
            initialDelay: 1000,
            maxDelay: 20000,
            strategy: exports.RetryStrategy.EXPONENTIAL_BACKOFF_JITTER,
            backoffMultiplier: 2,
            jitterFactor: 0.15,
            shouldRetry: (error, attempt) => {
                // Retry on network errors, timeouts, and 5xx status codes
                if (error instanceof CREBError) {
                    return error.isRetryable() && attempt < 4;
                }
                return ErrorUtils.isTransientError(error) && attempt < 4;
            }
        }, rateLimiter);
    }
    /**
     * Database-specific retry policy
     */
    static database() {
        return new RetryPolicy({
            maxAttempts: 3,
            initialDelay: 500,
            maxDelay: 5000,
            strategy: exports.RetryStrategy.EXPONENTIAL_BACKOFF,
            backoffMultiplier: 2,
            jitterFactor: 0.1,
            shouldRetry: (error, attempt) => {
                // Common database transient errors
                const message = error?.message?.toLowerCase() || '';
                const transientPatterns = [
                    'connection',
                    'timeout',
                    'deadlock',
                    'lock timeout',
                    'temporary failure'
                ];
                return transientPatterns.some(pattern => message.includes(pattern)) && attempt < 3;
            }
        });
    }
}
/**
 * Decorator for automatic retry functionality
 */
function WithRetry(policy) {
    return function (target, propertyKey, descriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = async function (...args) {
            const result = await policy.execute(() => originalMethod.apply(this, args));
            if (result.succeeded) {
                return result.result;
            }
            else {
                throw result.finalError;
            }
        };
        return descriptor;
    };
}
/**
 * Utility function to create a retry policy with default settings
 */
function createRetryPolicy(overrides = {}) {
    return new RetryPolicy({
        maxAttempts: 3,
        initialDelay: 1000,
        maxDelay: 10000,
        strategy: exports.RetryStrategy.EXPONENTIAL_BACKOFF_JITTER,
        backoffMultiplier: 2,
        jitterFactor: 0.1,
        ...overrides
    });
}

/**
 * Enhanced Error Handling Integration Example
 * Demonstrates how to use circuit breakers, retry policies, and structured errors
 * in real-world scenarios within CREB-JS
 */
/**
 * Example: Enhanced NIST Integration with Error Handling
 */
class EnhancedNISTIntegration {
    constructor() {
        // Configure circuit breaker for NIST API
        this.circuitBreaker = circuitBreakerManager.getBreaker('nist-api', {
            failureThreshold: 5,
            failureRate: 30,
            monitoringWindow: 60000, // 1 minute
            timeout: 30000, // 30 seconds
            successThreshold: 3,
            minimumCalls: 10,
            onStateChange: (newState, oldState) => {
                console.log(`NIST Circuit Breaker: ${oldState} → ${newState}`);
            },
            onCircuitOpen: (error) => {
                console.error('NIST API circuit breaker opened:', error);
            },
            onCircuitClose: () => {
                console.log('NIST API circuit breaker closed - service recovered');
            }
        });
        // Configure retry policy with rate limiting
        this.retryPolicy = RetryPolicies.network(60); // 60 requests per minute
        // Error aggregator for monitoring
        this.errorAggregator = new ErrorAggregator(500);
    }
    /**
     * Get thermodynamic data with full error handling
     */
    async getThermodynamicData(compoundName) {
        const operation = async () => {
            try {
                // Simulate NIST API call
                const response = await this.makeNISTRequest(`/thermo/search?name=${encodeURIComponent(compoundName)}`);
                return response;
            }
            catch (error) {
                // Transform error into appropriate CREB error type
                if (error instanceof Error && error.message.includes('network')) {
                    throw new NetworkError('Failed to connect to NIST database', { compoundName, operation: 'getThermodynamicData' }, { url: 'https://webbook.nist.gov/cgi/cbook.cgi', method: 'GET' });
                }
                else if (error instanceof Error && error.message.includes('429')) {
                    throw new ExternalAPIError('NIST API rate limit exceeded', 'NIST', { compoundName }, { statusCode: 429, rateLimited: true });
                }
                else {
                    throw new ExternalAPIError('NIST API request failed', 'NIST', { compoundName }, { statusCode: 500 });
                }
            }
        };
        try {
            // Apply circuit breaker and retry policy
            const result = await this.circuitBreaker.execute(async () => {
                const retryResult = await this.retryPolicy.execute(operation);
                if (retryResult.succeeded) {
                    return retryResult.result;
                }
                else {
                    throw retryResult.finalError;
                }
            });
            return result;
        }
        catch (error) {
            const crebError = ErrorUtils.transformUnknownError(error);
            this.errorAggregator.addError(crebError);
            throw crebError;
        }
    }
    /**
     * Simulated NIST API request (would be real HTTP request in production)
     */
    async makeNISTRequest(endpoint) {
        // Simulate various failure scenarios for demonstration
        const random = Math.random();
        if (random < 0.1) {
            throw new Error('network timeout');
        }
        else if (random < 0.15) {
            throw new Error('HTTP 429 rate limit');
        }
        else if (random < 0.2) {
            throw new Error('HTTP 500 server error');
        }
        // Simulate successful response
        return {
            compound: endpoint.split('name=')[1],
            thermodynamicData: {
                enthalpy: -393.5,
                entropy: 213.8,
                gibbs: -394.4
            }
        };
    }
    /**
     * Get error statistics and health metrics
     */
    getHealthMetrics() {
        return {
            circuitBreaker: this.circuitBreaker.getMetrics(),
            errors: this.errorAggregator.getStatistics(),
            retryMetrics: {
                // In a real implementation, you'd track retry metrics
                totalRetries: 0,
                successAfterRetry: 0,
                ultimateFailures: 0
            }
        };
    }
}
/**
 * Example: Enhanced PubChem Integration with Error Handling
 */
class EnhancedPubChemIntegration {
    constructor() {
        // PubChem has stricter rate limits
        this.rateLimiter = new RateLimiter(5, 1000); // 5 requests per second
        this.circuitBreaker = circuitBreakerManager.getBreaker('pubchem-api', {
            failureThreshold: 3,
            failureRate: 25,
            monitoringWindow: 60000,
            timeout: 60000, // Longer timeout for PubChem
            successThreshold: 2,
            minimumCalls: 5
        });
        this.retryPolicy = new RetryPolicy({
            maxAttempts: 4,
            initialDelay: 2000, // Start with 2 second delay
            maxDelay: 30000,
            strategy: exports.RetryStrategy.EXPONENTIAL_BACKOFF_JITTER,
            backoffMultiplier: 2,
            jitterFactor: 0.2,
            shouldRetry: (error, attempt) => {
                if (error instanceof ExternalAPIError) {
                    // Always retry rate limits, retry 5xx errors, don't retry 4xx (except 429)
                    if (error.metadata.category === exports.ErrorCategory.RATE_LIMIT)
                        return true;
                    const statusCode = error.metadata.context.statusCode;
                    return statusCode >= 500 || statusCode === 429;
                }
                return ErrorUtils.isTransientError(error) && attempt < 4;
            },
            onRetry: (error, attempt, delay) => {
                console.log(`PubChem retry attempt ${attempt} after ${delay}ms: ${error.message}`);
            }
        }, this.rateLimiter);
    }
    /**
     * Search for compounds with enhanced error handling
     */
    async searchCompounds(query) {
        const operation = async () => {
            // Simulate API call
            return this.makePubChemRequest(`/compound/name/${encodeURIComponent(query)}/JSON`);
        };
        return this.circuitBreaker.execute(async () => {
            const result = await this.retryPolicy.execute(operation);
            if (result.succeeded) {
                return result.result;
            }
            else {
                throw result.finalError;
            }
        });
    }
    async makePubChemRequest(endpoint) {
        // Simulate PubChem API behavior
        const random = Math.random();
        if (random < 0.05) {
            throw new ExternalAPIError('PubChem service temporarily unavailable', 'PubChem', { endpoint }, { statusCode: 503 });
        }
        else if (random < 0.1) {
            throw new ExternalAPIError('PubChem rate limit exceeded', 'PubChem', { endpoint }, { statusCode: 429, rateLimited: true });
        }
        // Simulate successful response
        return [
            {
                CID: 12345,
                name: endpoint.split('/')[3],
                molecularFormula: 'C6H12O6',
                molecularWeight: 180.16
            }
        ];
    }
}
/**
 * Example: Enhanced SQLite Storage with Error Handling
 */
class EnhancedSQLiteStorage {
    constructor() {
        // Database operations use specialized retry policy
        this.retryPolicy = RetryPolicies.database();
        this.errorAggregator = new ErrorAggregator(100);
    }
    /**
     * Store data with retry logic for transient database failures
     */
    async storeData(table, data) {
        const operation = async () => {
            // Simulate database operation
            await this.executeDatabaseOperation('INSERT', table, data);
        };
        try {
            const result = await this.retryPolicy.execute(operation);
            if (!result.succeeded) {
                throw result.finalError;
            }
        }
        catch (error) {
            const crebError = ErrorUtils.transformUnknownError(error);
            this.errorAggregator.addError(crebError);
            throw crebError;
        }
    }
    async executeDatabaseOperation(operation, table, data) {
        // Simulate various database failure scenarios
        const random = Math.random();
        if (random < 0.02) {
            throw new Error('database connection timeout');
        }
        else if (random < 0.03) {
            throw new Error('deadlock detected');
        }
        else if (random < 0.04) {
            throw new Error('temporary failure in writing to disk');
        }
        // Simulate successful operation
        console.log(`Database ${operation} on ${table} completed successfully`);
    }
}
/**
 * Example: System Health Monitor using Error Handling Components
 */
class SystemHealthMonitor {
    constructor() {
        this.errorAggregator = new ErrorAggregator(1000);
        this.circuitBreakerManager = circuitBreakerManager;
    }
    /**
     * Monitor system health and provide detailed status
     */
    getSystemHealth() {
        const circuitBreakerHealth = this.circuitBreakerManager.getHealthStatus();
        const errorStats = this.errorAggregator.getStatistics();
        // Determine overall health
        let overall = 'healthy';
        if (circuitBreakerHealth.failed.length > 0) {
            overall = 'critical';
        }
        else if (circuitBreakerHealth.degraded.length > 0 || errorStats.bySeverity.HIGH > 5) {
            overall = 'degraded';
        }
        // Generate recommendations
        const recommendations = [];
        if (circuitBreakerHealth.failed.length > 0) {
            recommendations.push(`${circuitBreakerHealth.failed.length} service(s) are failing: ${circuitBreakerHealth.failed.join(', ')}`);
        }
        if (errorStats.bySeverity.CRITICAL > 0) {
            recommendations.push(`${errorStats.bySeverity.CRITICAL} critical error(s) detected - immediate attention required`);
        }
        if (errorStats.retryableCount > errorStats.total * 0.7) {
            recommendations.push('High percentage of retryable errors suggests network or external service issues');
        }
        return {
            overall,
            services: {
                total: circuitBreakerHealth.total,
                healthy: circuitBreakerHealth.healthy.length,
                degraded: circuitBreakerHealth.degraded.length,
                failed: circuitBreakerHealth.failed.length,
                details: this.circuitBreakerManager.getAllMetrics()
            },
            errors: errorStats,
            recommendations
        };
    }
    /**
     * Add error to monitoring
     */
    reportError(error) {
        this.errorAggregator.addError(error);
    }
    /**
     * Clear error history
     */
    clearErrorHistory() {
        this.errorAggregator.clear();
    }
}
/**
 * Example: Graceful Degradation Service
 */
class GracefulDegradationService {
    constructor() {
        this.nistIntegration = new EnhancedNISTIntegration();
        this.pubchemIntegration = new EnhancedPubChemIntegration();
        this.localCache = new Map();
    }
    /**
     * Get thermodynamic data with graceful degradation
     */
    async getThermodynamicDataWithFallback(compoundName) {
        // Try cache first
        const cachedData = this.localCache.get(compoundName);
        if (cachedData) {
            return {
                data: cachedData,
                source: 'cache',
                confidence: 0.9
            };
        }
        // Try NIST (primary source)
        try {
            const nistData = await this.nistIntegration.getThermodynamicData(compoundName);
            this.localCache.set(compoundName, nistData);
            return {
                data: nistData,
                source: 'nist',
                confidence: 1.0
            };
        }
        catch (error) {
            console.warn(`NIST failed for ${compoundName}:`, error instanceof CREBError ? error.getDescription() : error);
        }
        // Try PubChem (secondary source)
        try {
            const pubchemData = await this.pubchemIntegration.searchCompounds(compoundName);
            const estimatedThermoData = this.estimateThermodynamicData(pubchemData[0]);
            this.localCache.set(compoundName, estimatedThermoData);
            return {
                data: estimatedThermoData,
                source: 'pubchem',
                confidence: 0.7
            };
        }
        catch (error) {
            console.warn(`PubChem failed for ${compoundName}:`, error instanceof CREBError ? error.getDescription() : error);
        }
        // Fallback to estimation
        const estimatedData = this.estimateThermodynamicData({ name: compoundName });
        return {
            data: estimatedData,
            source: 'estimated',
            confidence: 0.3
        };
    }
    estimateThermodynamicData(compoundInfo) {
        // Simple estimation logic (would be more sophisticated in real implementation)
        return {
            compound: compoundInfo.name,
            thermodynamicData: {
                enthalpy: -200, // Estimated values
                entropy: 150,
                gibbs: -180
            },
            note: 'Estimated values - use with caution'
        };
    }
}
// Example usage and testing
async function demonstrateEnhancedErrorHandling() {
    console.log('=== Enhanced Error Handling Demo ===\n');
    // Create service instances
    const nistService = new EnhancedNISTIntegration();
    const healthMonitor = new SystemHealthMonitor();
    const degradationService = new GracefulDegradationService();
    // Test successful operation
    console.log('1. Testing successful operation:');
    try {
        const data = await nistService.getThermodynamicData('water');
        console.log('✓ Successfully retrieved data:', data);
    }
    catch (error) {
        console.log('✗ Operation failed:', error instanceof CREBError ? error.getDescription() : error);
    }
    // Test multiple operations to trigger various error scenarios
    console.log('\n2. Testing multiple operations (some may fail):');
    const compounds = ['methane', 'ethane', 'propane', 'butane', 'pentane'];
    for (const compound of compounds) {
        try {
            const result = await degradationService.getThermodynamicDataWithFallback(compound);
            console.log(`✓ ${compound}: Got data from ${result.source} (confidence: ${result.confidence})`);
        }
        catch (error) {
            console.log(`✗ ${compound}: Failed completely:`, error instanceof CREBError ? error.getDescription() : error);
            if (error instanceof CREBError) {
                healthMonitor.reportError(error);
            }
        }
    }
    // Display system health
    console.log('\n3. System Health Status:');
    const health = healthMonitor.getSystemHealth();
    console.log(`Overall Status: ${health.overall.toUpperCase()}`);
    console.log(`Services: ${health.services.healthy}/${health.services.total} healthy`);
    console.log(`Recent Errors: ${health.errors.total} (${health.errors.retryableCount} retryable)`);
    if (health.recommendations.length > 0) {
        console.log('Recommendations:');
        health.recommendations.forEach(rec => console.log(`  • ${rec}`));
    }
    // Display detailed metrics
    console.log('\n4. Detailed Service Metrics:');
    const nistMetrics = nistService.getHealthMetrics();
    console.log('NIST Circuit Breaker:', nistMetrics.circuitBreaker);
    console.log('Error Statistics:', nistMetrics.errors);
}

/**
 * Configuration Schema Definitions
 *
 * This file contains validation schemas for all configuration types.
 * Schemas are used for runtime validation and documentation generation.
 */
/**
 * Cache configuration schema
 */
const cacheConfigSchema = {
    maxSize: {
        type: 'number',
        required: true,
        min: 1,
        max: 100000,
        default: 1000,
        description: 'Maximum number of items to store in cache'
    },
    ttl: {
        type: 'number',
        required: true,
        min: 1000,
        max: 86400000, // 24 hours
        default: 300000, // 5 minutes
        description: 'Time to live for cache entries in milliseconds'
    },
    strategy: {
        type: 'string',
        required: true,
        enum: ['lru', 'lfu', 'fifo'],
        default: 'lru',
        description: 'Cache eviction strategy'
    }
};
/**
 * Performance configuration schema
 */
const performanceConfigSchema = {
    enableWasm: {
        type: 'boolean',
        required: true,
        default: false,
        description: 'Enable WebAssembly acceleration for calculations'
    },
    workerThreads: {
        type: 'number',
        required: true,
        min: 1,
        max: 16,
        default: 4,
        description: 'Number of worker threads for parallel processing'
    },
    batchSize: {
        type: 'number',
        required: true,
        min: 1,
        max: 10000,
        default: 100,
        description: 'Batch size for bulk operations'
    }
};
/**
 * Data configuration schema
 */
const dataConfigSchema = {
    providers: {
        type: 'array',
        required: true,
        items: {
            type: 'string',
            enum: ['sqlite', 'nist', 'pubchem', 'local']
        },
        default: ['sqlite', 'local'],
        description: 'List of data providers to use'
    },
    syncInterval: {
        type: 'number',
        required: true,
        min: 60000, // 1 minute
        max: 86400000, // 24 hours
        default: 3600000, // 1 hour
        description: 'Data synchronization interval in milliseconds'
    },
    offlineMode: {
        type: 'boolean',
        required: true,
        default: false,
        description: 'Enable offline mode (no network requests)'
    }
};
/**
 * Logging configuration schema
 */
const loggingConfigSchema = {
    level: {
        type: 'string',
        required: true,
        enum: ['debug', 'info', 'warn', 'error'],
        default: 'info',
        description: 'Minimum log level to output'
    },
    format: {
        type: 'string',
        required: true,
        enum: ['json', 'text'],
        default: 'text',
        description: 'Log output format'
    },
    destinations: {
        type: 'array',
        required: true,
        items: {
            type: 'string',
            enum: ['console', 'file', 'remote']
        },
        default: ['console'],
        description: 'Log output destinations'
    }
};
/**
 * Main CREB configuration schema
 */
const crebConfigSchema = {
    cache: {
        type: 'object',
        required: true,
        properties: cacheConfigSchema,
        description: 'Cache configuration settings'
    },
    performance: {
        type: 'object',
        required: true,
        properties: performanceConfigSchema,
        description: 'Performance optimization settings'
    },
    data: {
        type: 'object',
        required: true,
        properties: dataConfigSchema,
        description: 'Data provider configuration'
    },
    logging: {
        type: 'object',
        required: true,
        properties: loggingConfigSchema,
        description: 'Logging configuration'
    }
};
/**
 * Default configuration values
 */
const defaultConfig = {
    cache: {
        maxSize: 1000,
        ttl: 300000, // 5 minutes
        strategy: 'lru'
    },
    performance: {
        enableWasm: false,
        workerThreads: 4,
        batchSize: 100
    },
    data: {
        providers: ['sqlite', 'local'],
        syncInterval: 3600000, // 1 hour
        offlineMode: false
    },
    logging: {
        level: 'info',
        format: 'text',
        destinations: ['console']
    }
};
/**
 * Validate a configuration object against schema
 */
function validateConfig(config, schema, path = '') {
    const errors = [];
    const warnings = [];
    if (typeof config !== 'object' || config === null) {
        errors.push({
            path,
            message: 'Configuration must be an object',
            value: config,
            expectedType: 'object'
        });
        return { isValid: false, errors, warnings };
    }
    const configObj = config;
    // Check required properties
    for (const [key, property] of Object.entries(schema)) {
        const currentPath = path ? `${path}.${key}` : key;
        const value = configObj[key];
        if (property.required && value === undefined) {
            errors.push({
                path: currentPath,
                message: `Required property '${key}' is missing`,
                value: undefined,
                expectedType: property.type
            });
            continue;
        }
        if (value === undefined)
            continue;
        // Type validation
        const typeValid = validateType(value, property, currentPath, errors);
        if (!typeValid)
            continue;
        // Range validation for numbers
        if (property.type === 'number' && typeof value === 'number') {
            if (property.min !== undefined && value < property.min) {
                errors.push({
                    path: currentPath,
                    message: `Value ${value} is below minimum ${property.min}`,
                    value
                });
            }
            if (property.max !== undefined && value > property.max) {
                errors.push({
                    path: currentPath,
                    message: `Value ${value} is above maximum ${property.max}`,
                    value
                });
            }
        }
        // Enum validation
        if (property.enum && !property.enum.includes(value)) {
            errors.push({
                path: currentPath,
                message: `Value '${value}' is not one of allowed values: ${property.enum.join(', ')}`,
                value,
                expectedType: `enum: ${property.enum.join(' | ')}`
            });
        }
        // Array validation
        if (property.type === 'array' && Array.isArray(value) && property.items) {
            value.forEach((item, index) => {
                const itemPath = `${currentPath}[${index}]`;
                validateType(item, property.items, itemPath, errors);
                if (property.items.enum && !property.items.enum.includes(item)) {
                    errors.push({
                        path: itemPath,
                        message: `Array item '${item}' is not one of allowed values: ${property.items.enum.join(', ')}`,
                        value: item
                    });
                }
            });
        }
        // Object validation (recursive)
        if (property.type === 'object' && property.properties) {
            const nestedResult = validateConfig(value, property.properties, currentPath);
            errors.push(...nestedResult.errors);
            warnings.push(...nestedResult.warnings);
        }
    }
    return {
        isValid: errors.length === 0,
        errors,
        warnings
    };
}
/**
 * Validate value type
 */
function validateType(value, property, path, errors, warnings) {
    const actualType = Array.isArray(value) ? 'array' : typeof value;
    if (actualType !== property.type) {
        errors.push({
            path,
            message: `Expected ${property.type}, got ${actualType}`,
            value,
            expectedType: property.type
        });
        return false;
    }
    return true;
}
/**
 * Generate documentation from schema
 */
function generateSchemaDocumentation(schema, title) {
    let doc = `# ${title}\n\n`;
    for (const [key, property] of Object.entries(schema)) {
        doc += `## ${key}\n\n`;
        doc += `**Type:** ${property.type}\n`;
        doc += `**Required:** ${property.required ? 'Yes' : 'No'}\n`;
        if (property.default !== undefined) {
            doc += `**Default:** \`${JSON.stringify(property.default)}\`\n`;
        }
        if (property.description) {
            doc += `**Description:** ${property.description}\n`;
        }
        if (property.enum) {
            doc += `**Allowed Values:** ${property.enum.map(v => `\`${v}\``).join(', ')}\n`;
        }
        if (property.min !== undefined || property.max !== undefined) {
            doc += `**Range:** `;
            if (property.min !== undefined)
                doc += `min: ${property.min}`;
            if (property.min !== undefined && property.max !== undefined)
                doc += ', ';
            if (property.max !== undefined)
                doc += `max: ${property.max}`;
            doc += '\n';
        }
        doc += '\n';
    }
    return doc;
}

/**
 * Configuration Manager for CREB-JS
 *
 * Provides centralized, type-safe configuration management with support for:
 * - Environment variable overrides
 * - Runtime configuration updates
 * - Configuration validation
 * - Hot-reload capability
 * - Schema-based documentation generation
 */
/**
 * Configuration Manager class
 * Provides type-safe configuration management with validation and hot-reload
 */
class ConfigManager extends events.EventEmitter {
    constructor(initialConfig) {
        super();
        this.watchers = [];
        this.configHistory = [];
        this.environmentMapping = this.createDefaultEnvironmentMapping();
        this.hotReloadConfig = {
            enabled: false,
            watchFiles: [],
            debounceMs: 1000,
            excludePaths: ['logging.level'] // Exclude critical settings from hot-reload
        };
        // Initialize with default config
        this.config = { ...defaultConfig };
        this.metadata = {
            version: '1.0.0',
            lastModified: new Date(),
            source: {
                type: 'default',
                priority: 1,
                description: 'Default configuration'
            },
            checksum: this.calculateChecksum(this.config)
        };
        // Apply initial config if provided
        if (initialConfig) {
            this.updateConfig(initialConfig);
        }
        // Load from environment variables
        this.loadFromEnvironment();
    }
    /**
     * Get the current configuration
     */
    getConfig() {
        return this.deepFreeze({ ...this.config });
    }
    /**
     * Get a specific configuration value by path
     */
    get(path) {
        const keys = path.split('.');
        let value = this.config;
        for (const key of keys) {
            if (value && typeof value === 'object' && key in value) {
                value = value[key];
            }
            else {
                throw new Error(`Configuration path '${path}' not found`);
            }
        }
        return value;
    }
    /**
     * Set a specific configuration value by path
     */
    set(path, value) {
        const keys = path.split('.');
        const oldValue = this.get(path);
        // Create a deep copy of config for modification
        const newConfig = JSON.parse(JSON.stringify(this.config));
        let current = newConfig;
        for (let i = 0; i < keys.length - 1; i++) {
            current = current[keys[i]];
        }
        current[keys[keys.length - 1]] = value;
        // Validate the change
        const validationResult = this.validateConfiguration(newConfig);
        if (!validationResult.isValid) {
            throw new Error(`Configuration validation failed: ${validationResult.errors.map(e => e.message).join(', ')}`);
        }
        // Apply the change
        this.config = newConfig;
        this.updateMetadata('runtime');
        // Emit change event
        const changeEvent = {
            path,
            oldValue,
            newValue: value,
            timestamp: new Date()
        };
        this.emit('configChanged', changeEvent);
        this.emit(`configChanged:${path}`, changeEvent);
    }
    /**
     * Update configuration with partial changes
     */
    updateConfig(partialConfig) {
        const mergedConfig = this.mergeConfigs(this.config, partialConfig);
        const validationResult = this.validateConfiguration(mergedConfig);
        if (validationResult.isValid) {
            const oldConfig = { ...this.config };
            this.config = mergedConfig;
            this.updateMetadata('runtime');
            this.saveToHistory();
            // Emit change events for each changed property
            this.emitChangeEvents(oldConfig, this.config);
        }
        return validationResult;
    }
    /**
     * Load configuration from file
     */
    async loadFromFile(filePath) {
        try {
            const fileContent = await fs__namespace.promises.readFile(filePath, 'utf8');
            const fileConfig = JSON.parse(fileContent);
            const result = this.updateConfig(fileConfig);
            if (result.isValid) {
                this.updateMetadata('file');
                // Set up hot-reload if enabled
                if (this.hotReloadConfig.enabled) {
                    this.watchConfigFile(filePath);
                }
            }
            return result;
        }
        catch (error) {
            return {
                isValid: false,
                errors: [{
                        path: '',
                        message: `Failed to load config file: ${error instanceof Error ? error.message : 'Unknown error'}`,
                        value: filePath
                    }],
                warnings: []
            };
        }
    }
    /**
     * Save configuration to file
     */
    async saveToFile(filePath) {
        const configWithMetadata = {
            ...this.config,
            _metadata: this.metadata
        };
        await fs__namespace.promises.writeFile(filePath, JSON.stringify(configWithMetadata, null, 2), 'utf8');
    }
    /**
     * Load configuration from environment variables
     */
    loadFromEnvironment() {
        const envConfig = {};
        for (const [configPath, envVar] of Object.entries(this.environmentMapping)) {
            const envValue = process.env[envVar];
            if (envValue !== undefined) {
                this.setNestedValue(envConfig, configPath, this.parseEnvironmentValue(envValue));
            }
        }
        if (Object.keys(envConfig).length > 0) {
            this.updateConfig(envConfig);
            this.updateMetadata('environment');
        }
    }
    /**
     * Validate current configuration
     */
    validateConfiguration(config = this.config) {
        return validateConfig(config, crebConfigSchema);
    }
    /**
     * Enable hot-reload for configuration files
     */
    enableHotReload(options = {}) {
        this.hotReloadConfig = { ...this.hotReloadConfig, ...options, enabled: true };
    }
    /**
     * Disable hot-reload
     */
    disableHotReload() {
        this.hotReloadConfig.enabled = false;
        this.watchers.forEach(watcher => watcher.close());
        this.watchers = [];
    }
    /**
     * Get configuration metadata
     */
    getMetadata() {
        return Object.freeze({ ...this.metadata });
    }
    /**
     * Get configuration history
     */
    getHistory() {
        return this.configHistory.map(entry => ({
            config: this.deepFreeze({ ...entry.config }),
            timestamp: entry.timestamp
        }));
    }
    /**
     * Reset configuration to defaults
     */
    resetToDefaults() {
        const oldConfig = { ...this.config };
        this.config = { ...defaultConfig };
        this.updateMetadata('default');
        this.emitChangeEvents(oldConfig, this.config);
    }
    /**
     * Generate documentation for current configuration schema
     */
    generateDocumentation() {
        return generateSchemaDocumentation(crebConfigSchema, 'CREB Configuration');
    }
    /**
     * Get configuration as JSON string
     */
    toJSON() {
        return JSON.stringify(this.config, null, 2);
    }
    /**
     * Get configuration summary for debugging
     */
    getSummary() {
        const validation = this.validateConfiguration();
        return `
CREB Configuration Summary
=========================
Version: ${this.metadata.version}
Last Modified: ${this.metadata.lastModified.toISOString()}
Source: ${this.metadata.source.type}
Valid: ${validation.isValid}
Errors: ${validation.errors.length}
Warnings: ${validation.warnings.length}
Hot Reload: ${this.hotReloadConfig.enabled ? 'Enabled' : 'Disabled'}

Current Configuration:
${this.toJSON()}
    `.trim();
    }
    /**
     * Dispose of resources
     */
    dispose() {
        this.disableHotReload();
        this.removeAllListeners();
    }
    // Private methods
    createDefaultEnvironmentMapping() {
        return {
            'cache.maxSize': 'CREB_CACHE_MAX_SIZE',
            'cache.ttl': 'CREB_CACHE_TTL',
            'cache.strategy': 'CREB_CACHE_STRATEGY',
            'performance.enableWasm': 'CREB_ENABLE_WASM',
            'performance.workerThreads': 'CREB_WORKER_THREADS',
            'performance.batchSize': 'CREB_BATCH_SIZE',
            'data.providers': 'CREB_DATA_PROVIDERS',
            'data.syncInterval': 'CREB_SYNC_INTERVAL',
            'data.offlineMode': 'CREB_OFFLINE_MODE',
            'logging.level': 'CREB_LOG_LEVEL',
            'logging.format': 'CREB_LOG_FORMAT',
            'logging.destinations': 'CREB_LOG_DESTINATIONS'
        };
    }
    parseEnvironmentValue(value) {
        // Try to parse as boolean
        if (value.toLowerCase() === 'true')
            return true;
        if (value.toLowerCase() === 'false')
            return false;
        // Try to parse as number
        const numValue = Number(value);
        if (!isNaN(numValue))
            return numValue;
        // Try to parse as JSON array
        if (value.startsWith('[') && value.endsWith(']')) {
            try {
                return JSON.parse(value);
            }
            catch {
                // Fall back to comma-separated values
                return value.slice(1, -1).split(',').map(v => v.trim());
            }
        }
        // Return as string
        return value;
    }
    setNestedValue(obj, path, value) {
        const keys = path.split('.');
        let current = obj;
        for (let i = 0; i < keys.length - 1; i++) {
            if (!(keys[i] in current)) {
                current[keys[i]] = {};
            }
            current = current[keys[i]];
        }
        current[keys[keys.length - 1]] = value;
    }
    mergeConfigs(base, partial) {
        const result = { ...base };
        for (const [key, value] of Object.entries(partial)) {
            if (value !== undefined) {
                if (typeof value === 'object' && !Array.isArray(value)) {
                    result[key] = {
                        ...base[key],
                        ...value
                    };
                }
                else {
                    result[key] = value;
                }
            }
        }
        return result;
    }
    updateMetadata(sourceType) {
        this.metadata = {
            ...this.metadata,
            lastModified: new Date(),
            source: {
                type: sourceType,
                priority: sourceType === 'environment' ? 3 : sourceType === 'file' ? 2 : 1,
                description: `Configuration loaded from ${sourceType}`
            },
            checksum: this.calculateChecksum(this.config)
        };
    }
    calculateChecksum(config) {
        const str = JSON.stringify(config);
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return hash.toString(16);
    }
    saveToHistory() {
        this.configHistory.push({
            config: { ...this.config },
            timestamp: new Date()
        });
        // Keep only last 10 entries
        if (this.configHistory.length > 10) {
            this.configHistory.shift();
        }
    }
    emitChangeEvents(oldConfig, newConfig) {
        const changes = this.findConfigChanges(oldConfig, newConfig);
        for (const change of changes) {
            this.emit('configChanged', change);
            this.emit(`configChanged:${change.path}`, change);
        }
    }
    findConfigChanges(oldConfig, newConfig, prefix = '') {
        const changes = [];
        for (const [key, newValue] of Object.entries(newConfig)) {
            const path = prefix ? `${prefix}.${key}` : key;
            const oldValue = oldConfig[key];
            if (typeof newValue === 'object' && !Array.isArray(newValue) && newValue !== null) {
                changes.push(...this.findConfigChanges(oldValue || {}, newValue, path));
            }
            else if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
                changes.push({
                    path,
                    oldValue,
                    newValue,
                    timestamp: new Date()
                });
            }
        }
        return changes;
    }
    watchConfigFile(filePath) {
        const watcher = fs__namespace.watch(filePath, { persistent: false }, (eventType) => {
            if (eventType === 'change') {
                setTimeout(() => {
                    this.loadFromFile(filePath).catch(error => {
                        this.emit('error', new Error(`Hot-reload failed: ${error.message}`));
                    });
                }, this.hotReloadConfig.debounceMs);
            }
        });
        this.watchers.push(watcher);
    }
    /**
     * Deep freeze an object to make it truly immutable
     */
    deepFreeze(obj) {
        // Get property names
        Object.getOwnPropertyNames(obj).forEach(prop => {
            const value = obj[prop];
            // Freeze properties before freezing self
            if (value && typeof value === 'object') {
                this.deepFreeze(value);
            }
        });
        return Object.freeze(obj);
    }
}
/**
 * Singleton configuration manager instance
 */
const configManager = new ConfigManager();
/**
 * Convenience function to get configuration value
 */
function getConfig(path) {
    return configManager.get(path);
}
/**
 * Convenience function to set configuration value
 */
function setConfig(path, value) {
    configManager.set(path, value);
}
/**
 * Convenience function to get full configuration
 */
function getFullConfig() {
    return configManager.getConfig();
}

/**
 * Configuration Types for CREB-JS
 *
 * Defines all configuration interfaces and types used throughout the application.
 * This file serves as the single source of truth for configuration structure.
 */
/**
 * Type guard for CREBConfig
 */
function isCREBConfig(obj) {
    return (typeof obj === 'object' &&
        obj !== null &&
        'cache' in obj &&
        'performance' in obj &&
        'data' in obj &&
        'logging' in obj);
}

/**
 * Cache Eviction Policies for CREB-JS
 *
 * Implements various cache eviction strategies including LRU, LFU, FIFO, TTL, and Random.
 * Each policy provides different trade-offs between performance and memory efficiency.
 */
/**
 * Least Recently Used (LRU) eviction policy
 * Evicts entries that haven't been accessed for the longest time
 */
class LRUEvictionPolicy {
    constructor() {
        this.strategy = 'lru';
    }
    selectEvictionCandidates(entries, config, targetCount) {
        const candidates = [];
        for (const [key, entry] of entries.entries()) {
            candidates.push({ key, lastAccessed: entry.lastAccessed });
        }
        // Sort by last accessed time (oldest first)
        candidates.sort((a, b) => a.lastAccessed - b.lastAccessed);
        return candidates.slice(0, targetCount).map(c => c.key);
    }
    onAccess(entry) {
        entry.lastAccessed = Date.now();
        entry.accessCount++;
    }
    onInsert(entry) {
        const now = Date.now();
        entry.lastAccessed = now;
        entry.accessCount = 1;
    }
}
/**
 * Least Frequently Used (LFU) eviction policy
 * Evicts entries with the lowest access frequency
 */
class LFUEvictionPolicy {
    constructor() {
        this.strategy = 'lfu';
    }
    selectEvictionCandidates(entries, config, targetCount) {
        const candidates = [];
        for (const [key, entry] of entries.entries()) {
            candidates.push({
                key,
                accessCount: entry.accessCount,
                lastAccessed: entry.lastAccessed
            });
        }
        // Sort by access count (lowest first), then by last accessed for ties
        candidates.sort((a, b) => {
            if (a.accessCount !== b.accessCount) {
                return a.accessCount - b.accessCount;
            }
            return a.lastAccessed - b.lastAccessed;
        });
        return candidates.slice(0, targetCount).map(c => c.key);
    }
    onAccess(entry) {
        entry.lastAccessed = Date.now();
        entry.accessCount++;
    }
    onInsert(entry) {
        const now = Date.now();
        entry.lastAccessed = now;
        entry.accessCount = 1;
    }
}
/**
 * First In, First Out (FIFO) eviction policy
 * Evicts entries in the order they were inserted
 */
class FIFOEvictionPolicy {
    constructor() {
        this.strategy = 'fifo';
    }
    selectEvictionCandidates(entries, config, targetCount) {
        const candidates = [];
        for (const [key, entry] of entries.entries()) {
            candidates.push({ key, insertionOrder: entry.insertionOrder });
        }
        // Sort by insertion order (oldest first)
        candidates.sort((a, b) => a.insertionOrder - b.insertionOrder);
        return candidates.slice(0, targetCount).map(c => c.key);
    }
    onAccess(entry) {
        entry.lastAccessed = Date.now();
        entry.accessCount++;
    }
    onInsert(entry) {
        const now = Date.now();
        entry.lastAccessed = now;
        entry.accessCount = 1;
    }
}
/**
 * Time To Live (TTL) eviction policy
 * Evicts expired entries first, then falls back to LRU
 */
class TTLEvictionPolicy {
    constructor() {
        this.strategy = 'ttl';
    }
    selectEvictionCandidates(entries, config, targetCount) {
        const now = Date.now();
        const expired = [];
        const nonExpired = [];
        for (const [key, entry] of entries.entries()) {
            if (entry.ttl > 0 && now >= entry.expiresAt) {
                expired.push(key);
            }
            else {
                nonExpired.push({ key, lastAccessed: entry.lastAccessed });
            }
        }
        // Return expired entries first
        if (expired.length >= targetCount) {
            return expired.slice(0, targetCount);
        }
        // If not enough expired entries, use LRU for the rest
        const remaining = targetCount - expired.length;
        nonExpired.sort((a, b) => a.lastAccessed - b.lastAccessed);
        return [...expired, ...nonExpired.slice(0, remaining).map(c => c.key)];
    }
    onAccess(entry) {
        entry.lastAccessed = Date.now();
        entry.accessCount++;
    }
    onInsert(entry) {
        const now = Date.now();
        entry.lastAccessed = now;
        entry.accessCount = 1;
    }
}
/**
 * Random eviction policy
 * Evicts random entries (useful for testing and as fallback)
 */
class RandomEvictionPolicy {
    constructor() {
        this.strategy = 'random';
    }
    selectEvictionCandidates(entries, config, targetCount) {
        const keys = Array.from(entries.keys());
        const candidates = [];
        // Fisher-Yates shuffle to get random keys
        for (let i = 0; i < targetCount && i < keys.length; i++) {
            const randomIndex = Math.floor(Math.random() * (keys.length - i)) + i;
            [keys[i], keys[randomIndex]] = [keys[randomIndex], keys[i]];
            candidates.push(keys[i]);
        }
        return candidates;
    }
    onAccess(entry) {
        entry.lastAccessed = Date.now();
        entry.accessCount++;
    }
    onInsert(entry) {
        const now = Date.now();
        entry.lastAccessed = now;
        entry.accessCount = 1;
    }
}
/**
 * Eviction policy factory
 */
class EvictionPolicyFactory {
    /**
     * Get eviction policy instance
     */
    static getPolicy(strategy) {
        const policy = this.policies.get(strategy);
        if (!policy) {
            throw new Error(`Unknown eviction strategy: ${strategy}`);
        }
        return policy;
    }
    /**
     * Register custom eviction policy
     */
    static registerPolicy(policy) {
        this.policies.set(policy.strategy, policy);
    }
    /**
     * Get all available strategies
     */
    static getAvailableStrategies() {
        return Array.from(this.policies.keys());
    }
}
EvictionPolicyFactory.policies = new Map([
    ['lru', new LRUEvictionPolicy()],
    ['lfu', new LFUEvictionPolicy()],
    ['fifo', new FIFOEvictionPolicy()],
    ['ttl', new TTLEvictionPolicy()],
    ['random', new RandomEvictionPolicy()]
]);
/**
 * Adaptive eviction policy that switches strategies based on access patterns
 */
class AdaptiveEvictionPolicy {
    constructor(fallbackStrategy = 'lru') {
        this.fallbackStrategy = fallbackStrategy;
        this.strategy = 'lru'; // Default fallback
        this.performanceHistory = new Map();
        this.evaluationWindow = 100; // Number of operations to evaluate
        this.operationCount = 0;
        this.currentPolicy = EvictionPolicyFactory.getPolicy(fallbackStrategy);
        // Initialize performance tracking
        for (const strategy of EvictionPolicyFactory.getAvailableStrategies()) {
            this.performanceHistory.set(strategy, []);
        }
    }
    selectEvictionCandidates(entries, config, targetCount) {
        this.operationCount++;
        // Periodically evaluate and potentially switch strategies
        if (this.operationCount % this.evaluationWindow === 0) {
            this.evaluateAndAdapt(entries, config);
        }
        return this.currentPolicy.selectEvictionCandidates(entries, config, targetCount);
    }
    onAccess(entry) {
        this.currentPolicy.onAccess(entry);
    }
    onInsert(entry) {
        this.currentPolicy.onInsert(entry);
    }
    /**
     * Evaluate current performance and adapt strategy if needed
     */
    evaluateAndAdapt(entries, config) {
        // Calculate access pattern metrics
        const now = Date.now();
        let totalAccesses = 0;
        let recentAccesses = 0;
        let accessVariance = 0;
        let meanAccess = 0;
        const accessCounts = [];
        for (const entry of entries.values()) {
            totalAccesses += entry.accessCount;
            accessCounts.push(entry.accessCount);
            // Count recent accesses (last hour)
            if (now - entry.lastAccessed < 3600000) {
                recentAccesses++;
            }
        }
        if (accessCounts.length > 0) {
            meanAccess = totalAccesses / accessCounts.length;
            accessVariance = accessCounts.reduce((sum, count) => sum + Math.pow(count - meanAccess, 2), 0) / accessCounts.length;
        }
        // Determine optimal strategy based on patterns
        let optimalStrategy;
        if (accessVariance > meanAccess * 2) {
            // High variance suggests some items are much more popular -> LFU
            optimalStrategy = 'lfu';
        }
        else if (recentAccesses / entries.size > 0.8) {
            // Most items accessed recently -> LRU
            optimalStrategy = 'lru';
        }
        else if (totalAccesses / entries.size < 2) {
            // Low overall access -> FIFO
            optimalStrategy = 'fifo';
        }
        else {
            // Mixed pattern -> TTL
            optimalStrategy = 'ttl';
        }
        // Switch strategy if different from current
        if (optimalStrategy !== this.currentPolicy.strategy) {
            this.currentPolicy = EvictionPolicyFactory.getPolicy(optimalStrategy);
        }
    }
    /**
     * Get current strategy being used
     */
    getCurrentStrategy() {
        return this.currentPolicy.strategy;
    }
}

/**
 * Cache Metrics Collection and Analysis for CREB-JS
 *
 * Provides comprehensive metrics collection, analysis, and reporting for cache performance.
 * Includes real-time monitoring, historical analysis, and performance recommendations.
 */
/**
 * Real-time cache metrics collector
 */
class CacheMetricsCollector {
    constructor() {
        this.history = [];
        this.maxHistorySize = 100;
        this.eventCounts = new Map();
        this.accessTimes = [];
        this.maxAccessTimeSamples = 1000;
        this.resetStats();
    }
    /**
     * Reset all statistics
     */
    resetStats() {
        this.stats = {
            hits: 0,
            misses: 0,
            hitRate: 0,
            size: 0,
            memoryUsage: 0,
            memoryUtilization: 0,
            evictions: 0,
            expirations: 0,
            averageAccessTime: 0,
            evictionBreakdown: {
                'lru': 0,
                'lfu': 0,
                'fifo': 0,
                'ttl': 0,
                'random': 0
            },
            lastUpdated: Date.now()
        };
        this.eventCounts.clear();
        this.accessTimes = [];
    }
    /**
     * Record a cache event
     */
    recordEvent(event) {
        const currentCount = this.eventCounts.get(event.type) || 0;
        this.eventCounts.set(event.type, currentCount + 1);
        switch (event.type) {
            case 'hit':
                this.stats.hits++;
                break;
            case 'miss':
                this.stats.misses++;
                break;
            case 'eviction':
                this.stats.evictions++;
                if (event.metadata?.strategy) {
                    this.stats.evictionBreakdown[event.metadata.strategy]++;
                }
                break;
            case 'expiration':
                this.stats.expirations++;
                break;
        }
        // Record access time if available
        if (event.metadata?.latency !== undefined) {
            this.accessTimes.push(event.metadata.latency);
            if (this.accessTimes.length > this.maxAccessTimeSamples) {
                this.accessTimes.shift(); // Remove oldest sample
            }
        }
        this.updateComputedStats();
    }
    /**
     * Update cache size and memory usage
     */
    updateCacheInfo(size, memoryUsage, maxMemory) {
        this.stats.size = size;
        this.stats.memoryUsage = memoryUsage;
        this.stats.memoryUtilization = maxMemory > 0 ? (memoryUsage / maxMemory) * 100 : 0;
        this.stats.lastUpdated = Date.now();
    }
    /**
     * Get current statistics
     */
    getStats() {
        return { ...this.stats };
    }
    /**
     * Get comprehensive metrics with historical data and trends
     */
    getMetrics() {
        const current = this.getStats();
        // Calculate trends
        const trends = this.calculateTrends();
        // Calculate peaks
        const peaks = this.calculatePeaks();
        return {
            current,
            history: [...this.history],
            trends,
            peaks
        };
    }
    /**
     * Take a snapshot of current stats for historical tracking
     */
    takeSnapshot() {
        const snapshot = this.getStats();
        this.history.push(snapshot);
        if (this.history.length > this.maxHistorySize) {
            this.history.shift(); // Remove oldest snapshot
        }
    }
    /**
     * Get event counts
     */
    getEventCounts() {
        return new Map(this.eventCounts);
    }
    /**
     * Get access time percentiles
     */
    getAccessTimePercentiles() {
        if (this.accessTimes.length === 0) {
            return { p50: 0, p90: 0, p95: 0, p99: 0 };
        }
        const sorted = [...this.accessTimes].sort((a, b) => a - b);
        sorted.length;
        return {
            p50: this.getPercentile(sorted, 50),
            p90: this.getPercentile(sorted, 90),
            p95: this.getPercentile(sorted, 95),
            p99: this.getPercentile(sorted, 99)
        };
    }
    /**
     * Update computed statistics
     */
    updateComputedStats() {
        const total = this.stats.hits + this.stats.misses;
        this.stats.hitRate = total > 0 ? (this.stats.hits / total) * 100 : 0;
        if (this.accessTimes.length > 0) {
            this.stats.averageAccessTime = this.accessTimes.reduce((sum, time) => sum + time, 0) / this.accessTimes.length;
        }
        this.stats.lastUpdated = Date.now();
    }
    /**
     * Calculate performance trends
     */
    calculateTrends() {
        if (this.history.length < 3) {
            return {
                hitRateTrend: 'stable',
                memoryTrend: 'stable',
                latencyTrend: 'stable'
            };
        }
        const recent = this.history.slice(-3);
        // Hit rate trend
        const hitRateChange = recent[2].hitRate - recent[0].hitRate;
        const hitRateTrend = Math.abs(hitRateChange) < 1 ? 'stable' :
            hitRateChange > 0 ? 'improving' : 'declining';
        // Memory trend
        const memoryChange = recent[2].memoryUtilization - recent[0].memoryUtilization;
        const memoryTrend = Math.abs(memoryChange) < 5 ? 'stable' :
            memoryChange > 0 ? 'increasing' : 'decreasing';
        // Latency trend
        const latencyChange = recent[2].averageAccessTime - recent[0].averageAccessTime;
        const latencyTrend = Math.abs(latencyChange) < 0.1 ? 'stable' :
            latencyChange < 0 ? 'improving' : 'degrading';
        return {
            hitRateTrend,
            memoryTrend,
            latencyTrend
        };
    }
    /**
     * Calculate peak performance metrics
     */
    calculatePeaks() {
        if (this.history.length === 0) {
            return {
                maxHitRate: this.stats.hitRate,
                maxMemoryUsage: this.stats.memoryUsage,
                minLatency: this.stats.averageAccessTime
            };
        }
        const allStats = [...this.history, this.stats];
        return {
            maxHitRate: Math.max(...allStats.map(s => s.hitRate)),
            maxMemoryUsage: Math.max(...allStats.map(s => s.memoryUsage)),
            minLatency: Math.min(...allStats.map(s => s.averageAccessTime))
        };
    }
    /**
     * Get percentile value from sorted array
     */
    getPercentile(sorted, percentile) {
        const index = Math.ceil((percentile / 100) * sorted.length) - 1;
        return sorted[Math.max(0, Math.min(index, sorted.length - 1))];
    }
}
/**
 * Cache performance analyzer
 */
class CachePerformanceAnalyzer {
    /**
     * Analyze cache performance and provide recommendations
     */
    static analyze(metrics) {
        const { current, trends, history } = metrics;
        const issues = [];
        const recommendations = [];
        const insights = [];
        let score = 100;
        // Analyze hit rate
        if (current.hitRate < 50) {
            score -= 30;
            issues.push('Low cache hit rate');
            recommendations.push('Consider increasing cache size or optimizing access patterns');
        }
        else if (current.hitRate < 70) {
            score -= 15;
            issues.push('Moderate cache hit rate');
            recommendations.push('Review cache eviction strategy');
        }
        // Analyze memory utilization
        if (current.memoryUtilization > 90) {
            score -= 20;
            issues.push('High memory utilization');
            recommendations.push('Increase memory limit or improve eviction policy');
        }
        else if (current.memoryUtilization < 30) {
            insights.push('Low memory utilization - cache size could be reduced');
        }
        // Analyze access time
        if (current.averageAccessTime > 5) {
            score -= 15;
            issues.push('High average access time');
            recommendations.push('Check for lock contention or optimize data structures');
        }
        // Analyze trends
        if (trends.hitRateTrend === 'declining') {
            score -= 10;
            issues.push('Declining hit rate trend');
            recommendations.push('Monitor access patterns and consider adaptive caching');
        }
        if (trends.latencyTrend === 'degrading') {
            score -= 10;
            issues.push('Increasing access latency');
            recommendations.push('Profile cache operations for performance bottlenecks');
        }
        // Analyze eviction distribution
        const totalEvictions = Object.values(current.evictionBreakdown).reduce((sum, count) => sum + count, 0);
        if (totalEvictions > 0) {
            const dominantStrategy = Object.entries(current.evictionBreakdown)
                .reduce((max, [strategy, count]) => count > max.count ? { strategy, count } : max, { strategy: '', count: 0 });
            if (dominantStrategy.count / totalEvictions > 0.8) {
                insights.push(`Cache primarily using ${dominantStrategy.strategy} eviction`);
            }
            else {
                insights.push('Cache using mixed eviction strategies - consider adaptive policy');
            }
        }
        // Historical comparison
        if (history.length > 0) {
            const baseline = history[0];
            const hitRateImprovement = current.hitRate - baseline.hitRate;
            if (hitRateImprovement > 10) {
                insights.push('Significant hit rate improvement observed');
            }
            else if (hitRateImprovement < -10) {
                issues.push('Hit rate has declined significantly');
                recommendations.push('Review recent changes to access patterns or cache configuration');
            }
        }
        return {
            score: Math.max(0, score),
            issues,
            recommendations,
            insights
        };
    }
    /**
     * Generate performance report
     */
    static generateReport(metrics) {
        const analysis = this.analyze(metrics);
        const { current } = metrics;
        let report = '# Cache Performance Report\n\n';
        report += `## Overall Score: ${analysis.score}/100\n\n`;
        report += '## Current Statistics\n';
        report += `- Hit Rate: ${current.hitRate.toFixed(2)}%\n`;
        report += `- Cache Size: ${current.size} entries\n`;
        report += `- Memory Usage: ${(current.memoryUsage / 1024 / 1024).toFixed(2)} MB (${current.memoryUtilization.toFixed(1)}%)\n`;
        report += `- Average Access Time: ${current.averageAccessTime.toFixed(2)}ms\n`;
        report += `- Evictions: ${current.evictions}\n`;
        report += `- Expirations: ${current.expirations}\n\n`;
        report += '## Trends\n';
        report += `- Hit Rate: ${metrics.trends.hitRateTrend}\n`;
        report += `- Memory Usage: ${metrics.trends.memoryTrend}\n`;
        report += `- Latency: ${metrics.trends.latencyTrend}\n\n`;
        if (analysis.issues.length > 0) {
            report += '## Issues\n';
            analysis.issues.forEach(issue => {
                report += `- ${issue}\n`;
            });
            report += '\n';
        }
        if (analysis.recommendations.length > 0) {
            report += '## Recommendations\n';
            analysis.recommendations.forEach(rec => {
                report += `- ${rec}\n`;
            });
            report += '\n';
        }
        if (analysis.insights.length > 0) {
            report += '## Insights\n';
            analysis.insights.forEach(insight => {
                report += `- ${insight}\n`;
            });
            report += '\n';
        }
        return report;
    }
}

/**
 * Advanced Cache Implementation for CREB-JS
 *
 * Production-ready cache with TTL, multiple eviction policies, metrics,
 * memory management, and thread safety.
 */
/**
 * Default cache configuration
 */
const DEFAULT_CONFIG = {
    maxSize: 1000,
    defaultTtl: 3600000, // 1 hour
    evictionStrategy: 'lru',
    fallbackStrategy: 'fifo',
    maxMemoryBytes: 100 * 1024 * 1024, // 100MB
    enableMetrics: true,
    metricsInterval: 60000, // 1 minute
    autoCleanup: true,
    cleanupInterval: 300000, // 5 minutes
    threadSafe: true
};
/**
 * Advanced cache implementation with comprehensive features
 */
class AdvancedCache {
    constructor(config = {}) {
        this.entries = new Map();
        this.listeners = new Map();
        this.insertionCounter = 0;
        this.mutex = new AsyncMutex();
        this.config = { ...DEFAULT_CONFIG, ...config };
        this.metrics = new CacheMetricsCollector();
        // Start background tasks
        if (this.config.autoCleanup) {
            this.startCleanupTimer();
        }
        if (this.config.enableMetrics) {
            this.startMetricsTimer();
        }
    }
    /**
     * Get value from cache
     */
    async get(key) {
        const startTime = Date.now();
        if (this.config.threadSafe) {
            return this.mutex.runExclusive(() => this.getInternal(key, startTime));
        }
        else {
            return this.getInternal(key, startTime);
        }
    }
    /**
     * Set value in cache
     */
    async set(key, value, ttl) {
        const startTime = Date.now();
        if (this.config.threadSafe) {
            return this.mutex.runExclusive(() => this.setInternal(key, value, ttl, startTime));
        }
        else {
            return this.setInternal(key, value, ttl, startTime);
        }
    }
    /**
     * Check if key exists in cache
     */
    async has(key) {
        const entry = this.entries.get(key);
        if (!entry)
            return false;
        // Check if expired
        const now = Date.now();
        if (entry.ttl > 0 && now >= entry.expiresAt) {
            await this.deleteInternal(key);
            return false;
        }
        return true;
    }
    /**
     * Delete entry from cache
     */
    async delete(key) {
        if (this.config.threadSafe) {
            return this.mutex.runExclusive(() => this.deleteInternal(key));
        }
        else {
            return this.deleteInternal(key);
        }
    }
    /**
     * Clear all entries
     */
    async clear() {
        if (this.config.threadSafe) {
            return this.mutex.runExclusive(() => this.clearInternal());
        }
        else {
            return this.clearInternal();
        }
    }
    /**
     * Get current cache statistics
     */
    getStats() {
        this.updateMetrics();
        return this.metrics.getStats();
    }
    /**
     * Get detailed metrics
     */
    getMetrics() {
        this.metrics.takeSnapshot();
        return this.metrics.getMetrics();
    }
    /**
     * Force cleanup of expired entries
     */
    async cleanup() {
        if (this.config.threadSafe) {
            return this.mutex.runExclusive(() => this.cleanupInternal());
        }
        else {
            return this.cleanupInternal();
        }
    }
    /**
     * Add event listener
     */
    addEventListener(type, listener) {
        if (!this.listeners.has(type)) {
            this.listeners.set(type, new Set());
        }
        this.listeners.get(type).add(listener);
    }
    /**
     * Remove event listener
     */
    removeEventListener(type, listener) {
        const typeListeners = this.listeners.get(type);
        if (typeListeners) {
            typeListeners.delete(listener);
        }
    }
    /**
     * Get all keys
     */
    keys() {
        return Array.from(this.entries.keys());
    }
    /**
     * Get cache size
     */
    size() {
        return this.entries.size;
    }
    /**
     * Get memory usage in bytes
     */
    memoryUsage() {
        let total = 0;
        for (const entry of this.entries.values()) {
            total += entry.sizeBytes;
        }
        return total;
    }
    /**
     * Check if cache is healthy
     */
    async healthCheck() {
        const metrics = this.getMetrics();
        const analysis = CachePerformanceAnalyzer.analyze(metrics);
        return {
            healthy: analysis.score >= 70,
            issues: analysis.issues,
            recommendations: analysis.recommendations
        };
    }
    /**
     * Shutdown cache and cleanup resources
     */
    shutdown() {
        if (this.cleanupTimer) {
            clearInterval(this.cleanupTimer);
        }
        if (this.metricsTimer) {
            clearInterval(this.metricsTimer);
        }
    }
    // Internal implementation methods
    async getInternal(key, startTime) {
        const entry = this.entries.get(key);
        const latency = Date.now() - startTime;
        if (!entry) {
            this.emitEvent('miss', key, undefined, { latency });
            return { success: true, hit: false, latency };
        }
        // Check if expired
        const now = Date.now();
        if (entry.ttl > 0 && now >= entry.expiresAt) {
            await this.deleteInternal(key);
            this.emitEvent('miss', key, undefined, { latency, expired: true });
            return { success: true, hit: false, latency, metadata: { expired: true } };
        }
        // Update access metadata
        const policy = EvictionPolicyFactory.getPolicy(this.config.evictionStrategy);
        policy.onAccess(entry);
        this.emitEvent('hit', key, entry.value, { latency });
        return { success: true, value: entry.value, hit: true, latency };
    }
    async setInternal(key, value, ttl, startTime) {
        const now = Date.now();
        const entryTtl = ttl ?? this.config.defaultTtl;
        const latency = startTime ? now - startTime : 0;
        // Calculate size estimate
        const sizeBytes = this.estimateSize(value);
        // Check memory constraints before adding
        const currentMemory = this.memoryUsage();
        if (this.config.maxMemoryBytes > 0 && currentMemory + sizeBytes > this.config.maxMemoryBytes) {
            await this.evictForMemory(sizeBytes);
        }
        // Check size constraints and evict if necessary
        if (this.entries.size >= this.config.maxSize) {
            await this.evictEntries(1);
        }
        // Create new entry
        const entry = {
            value,
            createdAt: now,
            lastAccessed: now,
            accessCount: 1,
            ttl: entryTtl,
            expiresAt: entryTtl > 0 ? now + entryTtl : 0,
            sizeBytes,
            insertionOrder: this.insertionCounter++
        };
        // Update access metadata
        const policy = EvictionPolicyFactory.getPolicy(this.config.evictionStrategy);
        policy.onInsert(entry);
        // Store entry
        this.entries.set(key, entry);
        this.emitEvent('set', key, value, { latency });
        return { success: true, hit: false, latency };
    }
    async deleteInternal(key) {
        const entry = this.entries.get(key);
        if (!entry)
            return false;
        this.entries.delete(key);
        this.emitEvent('delete', key, entry.value);
        return true;
    }
    async clearInternal() {
        this.entries.clear();
        this.insertionCounter = 0;
        this.emitEvent('clear');
    }
    async cleanupInternal() {
        const now = Date.now();
        const expiredKeys = [];
        for (const [key, entry] of this.entries.entries()) {
            if (entry.ttl > 0 && now >= entry.expiresAt) {
                expiredKeys.push(key);
            }
        }
        for (const key of expiredKeys) {
            this.entries.delete(key);
            this.emitEvent('expiration', key);
        }
        return expiredKeys.length;
    }
    async evictEntries(count) {
        const policy = EvictionPolicyFactory.getPolicy(this.config.evictionStrategy);
        const candidates = policy.selectEvictionCandidates(this.entries, this.config, count);
        for (const key of candidates) {
            const entry = this.entries.get(key);
            if (entry) {
                this.entries.delete(key);
                this.emitEvent('eviction', key, entry.value, {
                    strategy: this.config.evictionStrategy
                });
            }
        }
    }
    async evictForMemory(requiredBytes) {
        const currentMemory = this.memoryUsage();
        const targetMemory = this.config.maxMemoryBytes - requiredBytes;
        if (currentMemory <= targetMemory)
            return;
        const bytesToEvict = currentMemory - targetMemory;
        let evictedBytes = 0;
        const policy = EvictionPolicyFactory.getPolicy(this.config.evictionStrategy);
        while (evictedBytes < bytesToEvict && this.entries.size > 0) {
            const candidates = policy.selectEvictionCandidates(this.entries, this.config, 1);
            if (candidates.length === 0)
                break;
            const key = candidates[0];
            const entry = this.entries.get(key);
            if (entry) {
                evictedBytes += entry.sizeBytes;
                this.entries.delete(key);
                this.emitEvent('eviction', key, entry.value, {
                    strategy: this.config.evictionStrategy,
                    reason: 'memory-pressure',
                    memoryBefore: currentMemory,
                    memoryAfter: currentMemory - evictedBytes
                });
            }
        }
        if (evictedBytes < bytesToEvict) {
            this.emitEvent('memory-pressure', undefined, undefined, {
                reason: 'Unable to free sufficient memory'
            });
        }
    }
    estimateSize(value) {
        // Simple size estimation - could be improved with more sophisticated analysis
        const str = JSON.stringify(value);
        return str.length * 2; // Rough estimate for UTF-16 encoding
    }
    emitEvent(type, key, value, metadata) {
        const event = {
            type,
            key,
            value,
            timestamp: Date.now(),
            metadata
        };
        // Record in metrics
        this.metrics.recordEvent(event);
        // Notify listeners
        const typeListeners = this.listeners.get(type);
        if (typeListeners) {
            for (const listener of typeListeners) {
                try {
                    listener(event);
                }
                catch (error) {
                    console.warn('Cache event listener error:', error);
                }
            }
        }
    }
    updateMetrics() {
        const size = this.entries.size;
        const memory = this.memoryUsage();
        this.metrics.updateCacheInfo(size, memory, this.config.maxMemoryBytes);
    }
    startCleanupTimer() {
        this.cleanupTimer = setInterval(async () => {
            try {
                await this.cleanup();
            }
            catch (error) {
                console.warn('Cache cleanup error:', error);
            }
        }, this.config.cleanupInterval);
    }
    startMetricsTimer() {
        this.metricsTimer = setInterval(() => {
            this.metrics.takeSnapshot();
            this.emitEvent('stats-update');
        }, this.config.metricsInterval);
    }
}
/**
 * Simple async mutex for thread safety
 */
class AsyncMutex {
    constructor() {
        this.locked = false;
        this.queue = [];
    }
    async runExclusive(fn) {
        return new Promise((resolve, reject) => {
            const run = async () => {
                this.locked = true;
                try {
                    const result = await fn();
                    resolve(result);
                }
                catch (error) {
                    reject(error);
                }
                finally {
                    this.locked = false;
                    const next = this.queue.shift();
                    if (next) {
                        next();
                    }
                }
            };
            if (this.locked) {
                this.queue.push(run);
            }
            else {
                run();
            }
        });
    }
}
/**
 * Cache factory for creating configured cache instances
 */
class CacheFactory {
    static create(configOrPreset) {
        if (typeof configOrPreset === 'string') {
            const presetConfig = this.presets[configOrPreset];
            if (!presetConfig) {
                throw new Error(`Unknown cache preset: ${configOrPreset}`);
            }
            return new AdvancedCache(presetConfig);
        }
        else {
            return new AdvancedCache(configOrPreset);
        }
    }
    /**
     * Register custom preset
     */
    static registerPreset(name, config) {
        this.presets[name] = config;
    }
    /**
     * Get available presets
     */
    static getPresets() {
        return Object.keys(this.presets);
    }
}
CacheFactory.presets = {
    'small': {
        maxSize: 100,
        maxMemoryBytes: 10 * 1024 * 1024, // 10MB
        defaultTtl: 1800000, // 30 minutes
        evictionStrategy: 'lru'
    },
    'medium': {
        maxSize: 1000,
        maxMemoryBytes: 50 * 1024 * 1024, // 50MB
        defaultTtl: 3600000, // 1 hour
        evictionStrategy: 'lru'
    },
    'large': {
        maxSize: 10000,
        maxMemoryBytes: 200 * 1024 * 1024, // 200MB
        defaultTtl: 7200000, // 2 hours
        evictionStrategy: 'lfu'
    },
    'memory-optimized': {
        maxSize: 500,
        maxMemoryBytes: 25 * 1024 * 1024, // 25MB
        defaultTtl: 1800000, // 30 minutes
        evictionStrategy: 'lfu',
        autoCleanup: true,
        cleanupInterval: 60000 // 1 minute
    },
    'performance-optimized': {
        maxSize: 5000,
        maxMemoryBytes: 100 * 1024 * 1024, // 100MB
        defaultTtl: 3600000, // 1 hour
        evictionStrategy: 'lru',
        threadSafe: false, // Better performance but not thread-safe
        enableMetrics: false // Better performance
    }
};

/**
 * Advanced Cache Integration Example for CREB-JS
 *
 * Demonstrates how to integrate the advanced caching system with existing
 * CREB-JS components and replace the legacy PerformanceCache.
 */
/**
 * Enhanced ThermodynamicsCalculator with advanced caching
 */
class CachedThermodynamicsCalculator {
    constructor() {
        this.cache = CacheFactory.create('performance-optimized');
        // Set up cache monitoring
        this.setupCacheMonitoring();
    }
    /**
     * Calculate thermodynamic properties with caching
     */
    async calculateThermodynamics(equation, temperature, pressure) {
        const cacheKey = `thermo_${equation}_${temperature}_${pressure}`;
        // Try cache first
        const cached = await this.cache.get(cacheKey);
        if (cached.hit) {
            return cached.value;
        }
        // Perform calculation (mock implementation)
        const result = await this.performCalculation(equation, temperature, pressure);
        // Cache the result with appropriate TTL
        await this.cache.set(cacheKey, result, this.getTTLForCalculation(result));
        return result;
    }
    /**
     * Get cache performance statistics
     */
    getCacheStats() {
        return this.cache.getStats();
    }
    /**
     * Perform health check
     */
    async healthCheck() {
        return this.cache.healthCheck();
    }
    /**
     * Shutdown and cleanup
     */
    shutdown() {
        this.cache.shutdown();
    }
    async performCalculation(equation, temperature, pressure) {
        // Simulate calculation time
        await new Promise(resolve => setTimeout(resolve, 50));
        return {
            equation,
            temperature,
            pressure,
            enthalpy: Math.random() * 1000,
            entropy: Math.random() * 500,
            gibbs: Math.random() * 800,
            calculatedAt: Date.now()
        };
    }
    getTTLForCalculation(result) {
        // More complex calculations get longer TTL
        if (result.equation.length > 50) {
            return 3600000; // 1 hour
        }
        else if (result.equation.length > 20) {
            return 1800000; // 30 minutes
        }
        else {
            return 600000; // 10 minutes
        }
    }
    setupCacheMonitoring() {
        // Monitor cache performance
        this.cache.addEventListener('memory-pressure', (event) => {
            console.warn('Cache memory pressure detected:', event.metadata);
        });
        this.cache.addEventListener('stats-update', () => {
            const stats = this.cache.getStats();
            if (stats.hitRate < 50) {
                console.warn('Low cache hit rate detected:', stats.hitRate);
            }
        });
        // Log eviction events for debugging
        this.cache.addEventListener('eviction', (event) => {
            console.debug('Cache eviction:', {
                key: event.key,
                strategy: event.metadata?.strategy,
                reason: event.metadata?.reason
            });
        });
    }
}
/**
 * Enhanced Chemical Database Manager with advanced caching
 */
class CachedChemicalDatabase {
    constructor() {
        this.compoundCache = CacheFactory.create('large');
        this.queryCache = CacheFactory.create('medium');
        this.setupCacheOptimization();
    }
    /**
     * Get compound data with intelligent caching
     */
    async getCompound(formula) {
        const cached = await this.compoundCache.get(formula);
        if (cached.hit) {
            return cached.value;
        }
        // Fetch from database
        const compound = await this.fetchCompoundFromDB(formula);
        if (compound) {
            // Cache with TTL based on data freshness requirements
            const ttl = this.isCommonCompound(formula) ? 86400000 : 3600000; // 24h vs 1h
            await this.compoundCache.set(formula, compound, ttl);
        }
        return compound;
    }
    /**
     * Search compounds with query result caching
     */
    async searchCompounds(query, filters = {}) {
        const cacheKey = `search_${query}_${JSON.stringify(filters)}`;
        const cached = await this.queryCache.get(cacheKey);
        if (cached.hit) {
            return cached.value;
        }
        const results = await this.performSearch(query, filters);
        // Cache search results for shorter time (more dynamic)
        await this.queryCache.set(cacheKey, results, 300000); // 5 minutes
        return results;
    }
    /**
     * Get combined cache statistics
     */
    getCacheReport() {
        const compoundStats = this.compoundCache.getStats();
        const queryStats = this.queryCache.getStats();
        return `
Cache Performance Report:

Compound Cache:
- Hit Rate: ${compoundStats.hitRate.toFixed(2)}%
- Entries: ${compoundStats.size}
- Memory: ${(compoundStats.memoryUsage / 1024 / 1024).toFixed(2)} MB

Query Cache:
- Hit Rate: ${queryStats.hitRate.toFixed(2)}%
- Entries: ${queryStats.size}
- Memory: ${(queryStats.memoryUsage / 1024 / 1024).toFixed(2)} MB

Overall Performance:
- Combined Hit Rate: ${((compoundStats.hits + queryStats.hits) / (compoundStats.hits + compoundStats.misses + queryStats.hits + queryStats.misses) * 100).toFixed(2)}%
- Total Memory: ${((compoundStats.memoryUsage + queryStats.memoryUsage) / 1024 / 1024).toFixed(2)} MB
    `.trim();
    }
    /**
     * Optimize cache performance based on usage patterns
     */
    async optimizeCaches() {
        const compoundMetrics = this.compoundCache.getMetrics();
        const queryMetrics = this.queryCache.getMetrics();
        // If compound cache hit rate is low, increase size
        if (compoundMetrics.current.hitRate < 60) {
            console.log('Compound cache performance is low, consider increasing size');
        }
        // If memory utilization is high, force cleanup
        if (compoundMetrics.current.memoryUtilization > 85) {
            await this.compoundCache.cleanup();
        }
        if (queryMetrics.current.memoryUtilization > 85) {
            await this.queryCache.cleanup();
        }
    }
    shutdown() {
        this.compoundCache.shutdown();
        this.queryCache.shutdown();
    }
    async fetchCompoundFromDB(formula) {
        // Simulate database fetch
        await new Promise(resolve => setTimeout(resolve, 100));
        return {
            formula,
            name: `Compound ${formula}`,
            molarMass: Math.random() * 500,
            properties: {
                meltingPoint: Math.random() * 1000,
                boilingPoint: Math.random() * 2000,
                density: Math.random() * 5
            },
            lastUpdated: Date.now()
        };
    }
    async performSearch(query, filters) {
        // Simulate search operation
        await new Promise(resolve => setTimeout(resolve, 200));
        const resultCount = Math.floor(Math.random() * 20) + 1;
        const results = [];
        for (let i = 0; i < resultCount; i++) {
            results.push({
                formula: `${query}${i}`,
                name: `Result ${i} for ${query}`,
                relevance: Math.random()
            });
        }
        return results.sort((a, b) => b.relevance - a.relevance);
    }
    isCommonCompound(formula) {
        // Common compounds that change rarely
        const common = ['H2O', 'CO2', 'NaCl', 'H2SO4', 'HCl', 'NH3', 'CH4', 'C2H5OH'];
        return common.includes(formula);
    }
    setupCacheOptimization() {
        // Auto-optimization every 10 minutes
        setInterval(() => {
            this.optimizeCaches().catch(error => {
                console.warn('Cache optimization error:', error);
            });
        }, 600000);
    }
}
/**
 * Cache-aware equation balancer
 */
class CachedEquationBalancer {
    constructor() {
        this.cache = CacheFactory.create({
            maxSize: 2000,
            defaultTtl: 7200000, // 2 hours (balanced equations don't change)
            evictionStrategy: 'lfu', // Frequent equations are more valuable
            enableMetrics: true
        });
    }
    async balanceEquation(equation) {
        // Normalize equation for consistent caching
        const normalizedEquation = this.normalizeEquation(equation);
        const cached = await this.cache.get(normalizedEquation);
        if (cached.hit) {
            return { ...cached.value, fromCache: true };
        }
        // Perform balancing
        const result = await this.performBalancing(normalizedEquation);
        // Cache successful results
        if (result.success) {
            await this.cache.set(normalizedEquation, result);
        }
        return { ...result, fromCache: false };
    }
    /**
     * Get equations that would benefit from precomputation
     */
    getFrequentEquations(minAccess = 5) {
        // This would require access to cache internals or additional tracking
        // For now, return mock data
        return [
            { equation: 'H2 + O2 = H2O', accessCount: 15 },
            { equation: 'CH4 + O2 = CO2 + H2O', accessCount: 12 },
            { equation: 'C2H5OH + O2 = CO2 + H2O', accessCount: 8 }
        ];
    }
    async precomputeFrequentEquations() {
        const frequent = this.getFrequentEquations();
        for (const { equation } of frequent) {
            const cached = await this.cache.get(equation);
            if (!cached.hit) {
                await this.balanceEquation(equation);
            }
        }
    }
    getPerformanceReport() {
        const stats = this.cache.getStats();
        const metrics = this.cache.getMetrics();
        return `
Equation Balancer Cache Report:

Performance:
- Hit Rate: ${stats.hitRate.toFixed(2)}%
- Average Response Time: ${stats.averageAccessTime.toFixed(2)}ms
- Cached Equations: ${stats.size}

Trends:
- Hit Rate Trend: ${metrics.trends.hitRateTrend}
- Memory Trend: ${metrics.trends.memoryTrend}
- Latency Trend: ${metrics.trends.latencyTrend}

Recommendations:
${this.generateRecommendations(stats, metrics)}
    `.trim();
    }
    shutdown() {
        this.cache.shutdown();
    }
    normalizeEquation(equation) {
        // Remove extra spaces and standardize formatting
        return equation
            .replace(/\s+/g, ' ')
            .replace(/\s*=\s*/g, ' = ')
            .replace(/\s*\+\s*/g, ' + ')
            .trim();
    }
    async performBalancing(equation) {
        // Simulate equation balancing
        await new Promise(resolve => setTimeout(resolve, 75));
        return {
            equation,
            balanced: equation, // Would be actual balanced equation
            coefficients: [1, 1, 1], // Mock coefficients
            success: true,
            method: 'matrix',
            calculatedAt: Date.now()
        };
    }
    generateRecommendations(stats, metrics) {
        const recommendations = [];
        if (stats.hitRate < 70) {
            recommendations.push('- Consider increasing cache size for better hit rate');
        }
        if (metrics.trends.latencyTrend === 'degrading') {
            recommendations.push('- Monitor for performance bottlenecks');
        }
        if (stats.memoryUtilization > 80) {
            recommendations.push('- Consider memory cleanup or size optimization');
        }
        if (recommendations.length === 0) {
            recommendations.push('- Cache performance is optimal');
        }
        return recommendations.join('\n');
    }
}
/**
 * Multi-level cache for hierarchical data
 */
class MultiLevelCache {
    constructor() {
        this.l1Cache = CacheFactory.create('small'); // Fast, small cache
        this.l2Cache = CacheFactory.create('medium'); // Medium cache
        this.l3Cache = CacheFactory.create('large'); // Large, persistent cache
    }
    async get(key) {
        // Try L1 first (fastest)
        let result = await this.l1Cache.get(key);
        if (result.hit) {
            return { value: result.value, level: 'L1', latency: result.latency };
        }
        // Try L2
        result = await this.l2Cache.get(key);
        if (result.hit) {
            // Promote to L1
            await this.l1Cache.set(key, result.value);
            return { value: result.value, level: 'L2', latency: result.latency };
        }
        // Try L3
        result = await this.l3Cache.get(key);
        if (result.hit) {
            // Promote to L2 (and potentially L1)
            await this.l2Cache.set(key, result.value);
            return { value: result.value, level: 'L3', latency: result.latency };
        }
        return { value: undefined, level: 'MISS', latency: 0 };
    }
    async set(key, value, level = 'L1') {
        switch (level) {
            case 'L1':
                await this.l1Cache.set(key, value);
                break;
            case 'L2':
                await this.l2Cache.set(key, value);
                break;
            case 'L3':
                await this.l3Cache.set(key, value);
                break;
        }
    }
    getAggregatedStats() {
        const l1Stats = this.l1Cache.getStats();
        const l2Stats = this.l2Cache.getStats();
        const l3Stats = this.l3Cache.getStats();
        return {
            l1: l1Stats,
            l2: l2Stats,
            l3: l3Stats,
            combined: {
                totalHits: l1Stats.hits + l2Stats.hits + l3Stats.hits,
                totalMisses: l1Stats.misses + l2Stats.misses + l3Stats.misses,
                totalSize: l1Stats.size + l2Stats.size + l3Stats.size,
                totalMemory: l1Stats.memoryUsage + l2Stats.memoryUsage + l3Stats.memoryUsage
            }
        };
    }
    shutdown() {
        this.l1Cache.shutdown();
        this.l2Cache.shutdown();
        this.l3Cache.shutdown();
    }
}
/**
 * Example usage and migration guide
 */
function demonstrateAdvancedCaching() {
    console.log('🚀 Advanced Caching System Demo\n');
    // Example 1: Replace legacy PerformanceCache
    console.log('1. Creating optimized caches for different use cases:');
    const equationCache = CacheFactory.create('performance-optimized');
    const thermodynamicsCache = CacheFactory.create('memory-optimized');
    const compoundCache = CacheFactory.create('large');
    console.log('✅ Created specialized caches\n');
    // Example 2: Monitor cache performance
    console.log('2. Setting up cache monitoring:');
    equationCache.addEventListener('stats-update', () => {
        const stats = equationCache.getStats();
        console.log(`Equation cache hit rate: ${stats.hitRate.toFixed(2)}%`);
    });
    console.log('✅ Monitoring configured\n');
    // Example 3: Use with existing CREB components
    console.log('3. Integration examples:');
    const cachedCalculator = new CachedThermodynamicsCalculator();
    const cachedDatabase = new CachedChemicalDatabase();
    const cachedBalancer = new CachedEquationBalancer();
    console.log('✅ Integrated with CREB components\n');
    console.log('4. Performance benefits:');
    console.log('- TTL-based expiration prevents stale data');
    console.log('- Multiple eviction strategies optimize for different access patterns');
    console.log('- Comprehensive metrics enable performance monitoring');
    console.log('- Thread-safe operations support concurrent access');
    console.log('- Memory management prevents OOM errors');
    console.log('- Event system enables reactive optimization\n');
    // Cleanup
    setTimeout(() => {
        equationCache.shutdown();
        thermodynamicsCache.shutdown();
        compoundCache.shutdown();
        cachedCalculator.shutdown();
        cachedDatabase.shutdown();
        cachedBalancer.shutdown();
        console.log('✅ Demo completed, caches shut down');
    }, 1000);
}

exports.AdaptiveEvictionPolicy = AdaptiveEvictionPolicy;
exports.AdvancedCache = AdvancedCache;
exports.AdvancedKineticsAnalyzer = AdvancedKineticsAnalyzer;
exports.CREBError = CREBError;
exports.CREBValidationError = ValidationError;
exports.CacheFactory = CacheFactory;
exports.CachedChemicalDatabase = CachedChemicalDatabase;
exports.CachedEquationBalancer = CachedEquationBalancer;
exports.CachedThermodynamicsCalculator = CachedThermodynamicsCalculator;
exports.ChemicalDatabaseManager = ChemicalDatabaseManager;
exports.ChemicalEquationBalancer = ChemicalEquationBalancer;
exports.ChemicalFormulaError = ChemicalFormulaError;
exports.CircuitBreaker = CircuitBreaker;
exports.CircuitBreakerManager = CircuitBreakerManager;
exports.CircularDependencyError = CircularDependencyError;
exports.ComputationError = ComputationError;
exports.ConfigManager = ConfigManager;
exports.Container = Container;
exports.DataValidationService = DataValidationService;
exports.ELEMENTS_LIST = ELEMENTS_LIST;
exports.ElementCounter = ElementCounter;
exports.EnergyProfileGenerator = EnergyProfileGenerator;
exports.EnhancedBalancer = EnhancedBalancer;
exports.EnhancedChemicalEquationBalancer = EnhancedChemicalEquationBalancer;
exports.EnhancedNISTIntegration = EnhancedNISTIntegration;
exports.EnhancedPubChemIntegration = EnhancedPubChemIntegration;
exports.EnhancedSQLiteStorage = EnhancedSQLiteStorage;
exports.EnhancedStoichiometry = EnhancedStoichiometry;
exports.EquationBalancingError = EquationBalancingError;
exports.EquationParser = EquationParser;
exports.ErrorAggregator = ErrorAggregator;
exports.ErrorUtils = ErrorUtils;
exports.EvictionPolicyFactory = EvictionPolicyFactory;
exports.ExternalAPIError = ExternalAPIError;
exports.FIFOEvictionPolicy = FIFOEvictionPolicy;
exports.GracefulDegradationService = GracefulDegradationService;
exports.INJECTABLE_METADATA_KEY = INJECTABLE_METADATA_KEY;
exports.Inject = Inject;
exports.Injectable = Injectable;
exports.LFUEvictionPolicy = LFUEvictionPolicy;
exports.LRUEvictionPolicy = LRUEvictionPolicy;
exports.MaxDepthExceededError = MaxDepthExceededError;
exports.MechanismAnalyzer = MechanismAnalyzer;
exports.MultiLevelCache = MultiLevelCache;
exports.NISTWebBookIntegration = NISTWebBookIntegration;
exports.NetworkError = NetworkError;
exports.Optional = Optional;
exports.PARAMETER_SYMBOLS = PARAMETER_SYMBOLS;
exports.PERIODIC_TABLE = PERIODIC_TABLE;
exports.RandomEvictionPolicy = RandomEvictionPolicy;
exports.RateLimiter = RateLimiter;
exports.ReactionKinetics = ReactionKinetics;
exports.ReactionSafetyAnalyzer = ReactionSafetyAnalyzer;
exports.RetryPolicies = RetryPolicies;
exports.RetryPolicy = RetryPolicy;
exports.ServiceNotFoundError = ServiceNotFoundError;
exports.Singleton = Singleton;
exports.Stoichiometry = Stoichiometry;
exports.SystemError = SystemError;
exports.SystemHealthMonitor = SystemHealthMonitor;
exports.TTLEvictionPolicy = TTLEvictionPolicy;
exports.ThermodynamicsCalculator = ThermodynamicsCalculator;
exports.ThermodynamicsEquationBalancer = ThermodynamicsEquationBalancer;
exports.Transient = Transient;
exports.WithCircuitBreaker = WithCircuitBreaker;
exports.WithRetry = WithRetry;
exports.calculateMolarWeight = calculateMolarWeight;
exports.circuitBreakerManager = circuitBreakerManager;
exports.configManager = configManager;
exports.container = container;
exports.createChemicalFormula = createChemicalFormula;
exports.createElementSymbol = createElementSymbol;
exports.createEnergyProfile = createEnergyProfile;
exports.createRetryPolicy = createRetryPolicy;
exports.createToken = createToken;
exports.defaultConfig = defaultConfig;
exports.demonstrateAdvancedCaching = demonstrateAdvancedCaching;
exports.demonstrateEnhancedErrorHandling = demonstrateEnhancedErrorHandling;
exports.exportEnergyProfile = exportEnergyProfile;
exports.generateSchemaDocumentation = generateSchemaDocumentation;
exports.getConfig = getConfig;
exports.getDependencyTokens = getDependencyTokens;
exports.getFullConfig = getFullConfig;
exports.getInjectableMetadata = getInjectableMetadata;
exports.isBalancedEquation = isBalancedEquation;
exports.isCREBConfig = isCREBConfig;
exports.isChemicalFormula = isChemicalFormula;
exports.isElementSymbol = isElementSymbol;
exports.isInjectable = isInjectable;
exports.parseFormula = parseFormula;
exports.setConfig = setConfig;
exports.validateConfig = validateConfig;
//# sourceMappingURL=index.js.map
