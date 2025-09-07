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
export function isChemicalFormula(value) {
    // More permissive validation - basic pattern for chemical formulas
    const pattern = /^[A-Z][a-z]?(?:\d*\(?[A-Z][a-z]?\d*\)?)*\d*$/;
    return typeof value === 'string' && value.length > 0 && /[A-Z]/.test(value);
}
/**
 * Type guard for element symbols
 */
export function isElementSymbol(value) {
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
export function isBalancedEquation(value) {
    return value.includes('->') || value.includes('→');
}
// ============================================================================
// Factory Functions with Type Safety
// ============================================================================
/**
 * Create a chemical formula with compile-time validation
 */
export function createChemicalFormula(formula) {
    if (!isChemicalFormula(formula)) {
        throw new Error(`Invalid chemical formula: ${formula}`);
    }
    return formula;
}
/**
 * Create an element symbol with validation
 */
export function createElementSymbol(symbol) {
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
export function parseFormula(formula) {
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
export class ChemicalFormulaError extends Error {
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
export class EquationBalancingError extends Error {
    constructor(equation, reason) {
        super(`Cannot balance equation "${equation}": ${reason}`);
        this.equation = equation;
        this.reason = reason;
        this.name = 'EquationBalancingError';
    }
}
//# sourceMappingURL=advancedTypes.js.map