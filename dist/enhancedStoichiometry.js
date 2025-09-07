/**
 * Enhanced Stoichiometry calculator with PubChem integration
 * Provides accurate molecular weights, compound validation, and enriched calculations
 */
import { Stoichiometry } from './stoichiometry';
import { EnhancedChemicalEquationBalancer } from './enhancedBalancer';
export class EnhancedStoichiometry extends Stoichiometry {
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
//# sourceMappingURL=enhancedStoichiometry.js.map