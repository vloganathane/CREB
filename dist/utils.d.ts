import { ElementCount } from './types';
/**
 * Utility functions for chemical formula parsing and calculations
 */
/**
 * Counts elements in a chemical formula
 * Based on the ElementCounter class from the original CREB project
 */
export declare class ElementCounter {
    private formula;
    constructor(chemicalFormula: string);
    /**
     * Parses the chemical formula and returns element counts
     * Handles parentheses and multipliers
     */
    parseFormula(): ElementCount;
    private expandGroup;
}
/**
 * Parses a chemical equation into reactants and products
 * Based on the EquationParser class from the original CREB project
 */
export declare class EquationParser {
    private equation;
    private equationSplitter;
    private speciesSplitter;
    constructor(chemicalEquation: string);
    /**
     * Parses the equation and returns structured data
     */
    parse(): {
        reactants: string[];
        products: string[];
        parsedReactants: {
            [species: string]: ElementCount;
        };
        parsedProducts: {
            [species: string]: ElementCount;
        };
    };
    private splitIntoSpecies;
    private parseSpecies;
}
/**
 * Calculates molar weight of a chemical formula
 */
export declare function calculateMolarWeight(formula: string): number;
/**
 * Gets all unique elements present in a reaction
 */
export declare function getElementsInReaction(parsedReactants: any, parsedProducts: any): string[];
//# sourceMappingURL=utils.d.ts.map