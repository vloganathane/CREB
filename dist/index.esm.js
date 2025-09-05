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

export { ChemicalEquationBalancer, ELEMENTS_LIST, ElementCounter, EnhancedChemicalEquationBalancer, EnhancedStoichiometry, EquationParser, PARAMETER_SYMBOLS, PERIODIC_TABLE, Stoichiometry, ThermodynamicsCalculator, ThermodynamicsEquationBalancer, calculateMolarWeight };
//# sourceMappingURL=index.esm.js.map
