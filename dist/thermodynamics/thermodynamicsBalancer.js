/**
 * Thermodynamics-Integrated Chemical Equation Balancer
 * Combines chemical equation balancing with comprehensive thermodynamic analysis
 *
 * @author Loganathane Virassamy
 * @version 1.4.0-alpha
 */
import { ChemicalEquationBalancer } from '../balancer';
import { ThermodynamicsCalculator } from './calculator';
/**
 * Classification of chemical reactions based on thermodynamic properties
 */
export var ReactionType;
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
export var ReactionFeasibility;
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
export var SafetyLevel;
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
export class ThermodynamicsEquationBalancer {
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
//# sourceMappingURL=thermodynamicsBalancer.js.map