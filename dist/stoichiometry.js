var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { calculateMolarWeight, EquationParser } from './utils';
import { ChemicalEquationBalancer } from './balancer';
import { ValidationError } from './core/errors/CREBError';
import { Injectable } from './core/decorators/Injectable';
/**
 * Stoichiometry calculator
 * Based on the Stoichiometry class from the original CREB project
 */
let Stoichiometry = class Stoichiometry {
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
            throw new ValidationError('No equation provided. Initialize with an equation first.', { operation: 'calculateRatios', selectedSpecies }, { field: 'equation', value: this.equation, constraint: 'must be initialized' });
        }
        const allSpecies = [...this.reactants, ...this.products];
        const selectedIndex = allSpecies.indexOf(selectedSpecies);
        if (selectedIndex === -1) {
            const availableSpecies = allSpecies.join(', ');
            throw new ValidationError(`Species "${selectedSpecies}" not found in the equation. Available species: ${availableSpecies}`, { selectedSpecies, availableSpecies: allSpecies }, { field: 'selectedSpecies', value: selectedSpecies, constraint: `must be one of: ${availableSpecies}` });
        }
        const selectedCoefficient = this.coefficients[selectedIndex];
        return this.coefficients.map(coeff => coeff / selectedCoefficient);
    }
    /**
     * Performs stoichiometric calculations starting from moles
     */
    calculateFromMoles(selectedSpecies, moles) {
        if (!this.equation) {
            throw new ValidationError('No equation provided. Initialize with an equation first.', { operation: 'calculateFromMoles', selectedSpecies, moles }, { field: 'equation', value: this.equation, constraint: 'must be initialized' });
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
            throw new ValidationError('No equation provided. Initialize with an equation first.', { operation: 'calculateFromGrams', selectedSpecies, grams }, { field: 'equation', value: this.equation, constraint: 'must be initialized' });
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
            throw new ValidationError('No equation provided.', { operation: 'getBalancedEquation' }, { field: 'equation', value: this.equation, constraint: 'must be initialized' });
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
};
Stoichiometry = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [String])
], Stoichiometry);
export { Stoichiometry };
//# sourceMappingURL=stoichiometry.js.map