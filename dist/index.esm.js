import 'reflect-metadata';

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
var ServiceLifetime$1;
(function (ServiceLifetime) {
    ServiceLifetime["Singleton"] = "singleton";
    ServiceLifetime["Transient"] = "transient";
})(ServiceLifetime$1 || (ServiceLifetime$1 = {}));
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
    register(token, factory, lifetime = ServiceLifetime$1.Transient, dependencies = []) {
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
        return this.register(token, factory, ServiceLifetime$1.Singleton, dependencies);
    }
    /**
     * Register a transient service
     */
    registerTransient(token, factory, dependencies = []) {
        return this.register(token, factory, ServiceLifetime$1.Transient, dependencies);
    }
    /**
     * Register a class with automatic dependency injection
     */
    registerClass(constructor, dependencies = [], lifetime = ServiceLifetime$1.Transient, token) {
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
            lifetime: ServiceLifetime$1.Singleton,
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
        if (registration.lifetime === ServiceLifetime$1.Singleton && registration.singleton) {
            return registration.singleton;
        }
        // Add to resolution stack
        this.resolutionStack.push(token);
        try {
            // Create new instance
            const instance = registration.factory(this);
            // Store singleton instance
            if (registration.lifetime === ServiceLifetime$1.Singleton) {
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

export { AdvancedKineticsAnalyzer, ChemicalDatabaseManager, ChemicalEquationBalancer, ChemicalFormulaError, CircularDependencyError, Container, DataValidationService, ELEMENTS_LIST, ElementCounter, EnergyProfileGenerator, EnhancedBalancer, EnhancedChemicalEquationBalancer, EnhancedStoichiometry, EquationBalancingError, EquationParser, INJECTABLE_METADATA_KEY, Inject, Injectable, MaxDepthExceededError, MechanismAnalyzer, NISTWebBookIntegration, Optional, PARAMETER_SYMBOLS, PERIODIC_TABLE, ReactionKinetics, ReactionSafetyAnalyzer, ServiceLifetime$1 as ServiceLifetime, ServiceNotFoundError, Singleton, Stoichiometry, ThermodynamicsCalculator, ThermodynamicsEquationBalancer, Transient, calculateMolarWeight, container, createChemicalFormula, createElementSymbol, createEnergyProfile, createToken, exportEnergyProfile, getDependencyTokens, getInjectableMetadata, isBalancedEquation, isChemicalFormula, isElementSymbol, isInjectable, parseFormula };
//# sourceMappingURL=index.esm.js.map
