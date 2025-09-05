/**
 * Thermodynamics-Integrated Chemical Equation Balancer
 * Combines chemical equation balancing with comprehensive thermodynamic analysis
 * 
 * @author Loganathane Virassamy
 * @version 1.4.0-alpha
 */

import { ChemicalEquationBalancer } from '../balancer';
import { ThermodynamicsCalculator } from './calculator';
import { ReactionData, ThermodynamicsResult, CompoundThermodynamics } from './types';

/**
 * Classification of chemical reactions based on thermodynamic properties
 */
export enum ReactionType {
    COMBUSTION = 'combustion',
    SYNTHESIS = 'synthesis', 
    DECOMPOSITION = 'decomposition',
    SINGLE_REPLACEMENT = 'single_replacement',
    DOUBLE_REPLACEMENT = 'double_replacement',
    ACID_BASE = 'acid_base',
    REDOX = 'redox',
    BIOLOGICAL = 'biological',
    INDUSTRIAL = 'industrial'
}

/**
 * Reaction feasibility assessment
 */
export enum ReactionFeasibility {
    HIGHLY_FAVORABLE = 'highly_favorable',     // ΔG° < -100 kJ/mol
    FAVORABLE = 'favorable',                   // -100 < ΔG° < -20 kJ/mol  
    MARGINALLY_FAVORABLE = 'marginally_favorable', // -20 < ΔG° < 0 kJ/mol
    EQUILIBRIUM = 'equilibrium',               // ΔG° ≈ 0 kJ/mol
    UNFAVORABLE = 'unfavorable',               // 0 < ΔG° < 20 kJ/mol
    HIGHLY_UNFAVORABLE = 'highly_unfavorable'  // ΔG° > 20 kJ/mol
}

/**
 * Safety classification based on energy release
 */
export enum SafetyLevel {
    SAFE = 'safe',                    // |ΔH°| < 100 kJ/mol
    CAUTION = 'caution',              // 100 < |ΔH°| < 500 kJ/mol
    WARNING = 'warning',              // 500 < |ΔH°| < 1000 kJ/mol
    DANGER = 'danger',                // 1000 < |ΔH°| < 2000 kJ/mol
    EXTREME_DANGER = 'extreme_danger' // |ΔH°| > 2000 kJ/mol
}

/**
 * Comprehensive thermodynamic balancing result
 */
export interface ThermodynamicsBalanceResult {
    // Chemical balancing
    balanced: string;
    coefficients: Record<string, number>;
    
    // Thermodynamic analysis
    thermodynamics: ThermodynamicsResult;
    
    // Reaction classification
    reactionType: ReactionType;
    feasibility: ReactionFeasibility;
    safetyLevel: SafetyLevel;
    
    // Analysis and recommendations
    energyReleased?: number;  // kJ/mol (if exothermic)
    energyRequired?: number;  // kJ/mol (if endothermic)
    spontaneous: boolean;
    equilibriumConstant: number;
    
    // Condition optimization
    optimalTemperature?: number;  // K
    temperatureRange: { min: number; max: number };
    pressureEffects: string;
    
    // Safety and practical information
    safetyWarnings: string[];
    recommendations: string[];
    industrialApplications: string[];
    
    // Educational information
    reactionMechanism?: string;
    realWorldExamples: string[];
}

/**
 * Optimal reaction conditions
 */
export interface OptimalConditions {
    temperature: number;    // K
    pressure: number;       // atm
    yield: number;          // %
    reasoning: string[];
}

/**
 * Thermodynamics-Integrated Chemical Equation Balancer
 * Revolutionary chemistry tool combining balancing with energy analysis
 */
export class ThermodynamicsEquationBalancer {
    private balancer: ChemicalEquationBalancer;
    private thermoCalculator: ThermodynamicsCalculator;

    constructor() {
        this.balancer = new ChemicalEquationBalancer();
        this.thermoCalculator = new ThermodynamicsCalculator();
    }

    /**
     * Balance equation with comprehensive thermodynamic analysis
     */
    async balanceWithThermodynamics(
        equation: string, 
        temperature: number = 298.15,
        pressure: number = 1.0
    ): Promise<ThermodynamicsBalanceResult> {
        try {
            // Step 1: Balance the chemical equation
            const balanced = this.balancer.balance(equation);
            const reactionData = this.parseEquationToReactionData(balanced);

            // Step 2: Calculate thermodynamics
            const thermodynamics = await this.thermoCalculator.calculateReactionThermodynamics(
                reactionData, 
                temperature
            );

            // Step 3: Classify reaction
            const reactionType = this.classifyReaction(equation, thermodynamics);
            
            // Step 4: Assess feasibility and safety
            const feasibility = this.assessFeasibility(thermodynamics.gibbsFreeEnergy);
            const safetyLevel = this.assessSafety(thermodynamics.enthalpy);

            // Step 5: Generate analysis and recommendations
            const analysis = this.generateAnalysis(
                reactionType, 
                thermodynamics, 
                feasibility, 
                safetyLevel
            );

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

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            throw new Error(`Thermodynamics balancing failed: ${errorMessage}`);
        }
    }

    /**
     * Find optimal reaction conditions for maximum yield
     */
    async findOptimalConditions(equation: string): Promise<OptimalConditions> {
        const balanced = this.balancer.balance(equation);
        const reactionData = this.parseEquationToReactionData(balanced);

        // Test different temperatures
        const temperatures = [250, 298.15, 350, 400, 500, 600, 750];
        let bestConditions: OptimalConditions = {
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
    private classifyReaction(equation: string, thermo: ThermodynamicsResult): ReactionType {
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
    private assessFeasibility(deltaG: number): ReactionFeasibility {
        if (deltaG < -100) return ReactionFeasibility.HIGHLY_FAVORABLE;
        if (deltaG < -20) return ReactionFeasibility.FAVORABLE;
        if (deltaG < 0) return ReactionFeasibility.MARGINALLY_FAVORABLE;
        if (Math.abs(deltaG) < 5) return ReactionFeasibility.EQUILIBRIUM;
        if (deltaG < 20) return ReactionFeasibility.UNFAVORABLE;
        return ReactionFeasibility.HIGHLY_UNFAVORABLE;
    }

    /**
     * Assess safety level based on enthalpy change
     */
    private assessSafety(deltaH: number): SafetyLevel {
        const absEnergy = Math.abs(deltaH);
        if (absEnergy < 100) return SafetyLevel.SAFE;
        if (absEnergy < 500) return SafetyLevel.CAUTION;
        if (absEnergy < 1000) return SafetyLevel.WARNING;
        if (absEnergy < 2000) return SafetyLevel.DANGER;
        return SafetyLevel.EXTREME_DANGER;
    }

    /**
     * Generate comprehensive analysis and recommendations
     */
    private generateAnalysis(
        type: ReactionType, 
        thermo: ThermodynamicsResult, 
        feasibility: ReactionFeasibility,
        safety: SafetyLevel
    ) {
        const analysis = {
            safetyWarnings: [] as string[],
            recommendations: [] as string[],
            industrialApplications: [] as string[],
            reactionMechanism: '',
            realWorldExamples: [] as string[]
        };

        // Safety warnings
        if (safety === SafetyLevel.EXTREME_DANGER) {
            analysis.safetyWarnings.push('⚠️ EXTREME DANGER: Explosive reaction potential');
            analysis.safetyWarnings.push('Requires specialized safety equipment and procedures');
        } else if (safety === SafetyLevel.DANGER) {
            analysis.safetyWarnings.push('⚠️ DANGER: Highly exothermic reaction');
            analysis.safetyWarnings.push('Use proper cooling and controlled addition');
        } else if (safety === SafetyLevel.WARNING) {
            analysis.safetyWarnings.push('⚠️ WARNING: Significant heat release');
            analysis.safetyWarnings.push('Monitor temperature carefully');
        }

        // Recommendations based on thermodynamics
        if (thermo.isSpontaneous) {
            analysis.recommendations.push('✅ Thermodynamically favorable reaction');
            analysis.recommendations.push('Consider kinetic factors for reaction rate');
        } else {
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
    private calculateEquilibriumConstant(deltaG: number, temperature: number): number {
        const R = 8.314; // J/(mol·K)
        return Math.exp(-deltaG * 1000 / (R * temperature));
    }

    /**
     * Parse chemical equation to reaction data format
     */
    private parseEquationToReactionData(equation: string): ReactionData {
        const [reactantSide, productSide] = equation.split('=').map(s => s.trim());
        
        const parseSpecies = (side: string) => {
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
    private extractCoefficients(equation: string): Record<string, number> {
        const coefficients: Record<string, number> = {};
        const [reactantSide, productSide] = equation.split('=');
        
        const extractFromSide = (side: string) => {
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
    private analyzePressureEffects(reactionData: ReactionData): string {
        const reactantMoles = reactionData.reactants.reduce((sum: number, r) => sum + r.coefficient, 0);
        const productMoles = reactionData.products.reduce((sum: number, p) => sum + p.coefficient, 0);
        const deltaN = productMoles - reactantMoles;

        if (deltaN < 0) {
            return 'High pressure favors products (Le Chatelier\'s principle)';
        } else if (deltaN > 0) {
            return 'Low pressure favors products (Le Chatelier\'s principle)';
        } else {
            return 'Pressure has minimal effect on equilibrium';
        }
    }

    /**
     * Estimate yield from equilibrium constant
     */
    private estimateYieldFromK(K: number, reactionData: ReactionData): number {
        // Simplified yield estimation
        if (K > 1000) return 99;
        if (K > 100) return 95;
        if (K > 10) return 85;
        if (K > 1) return 70;
        if (K > 0.1) return 50;
        if (K > 0.01) return 25;
        return 5;
    }

    /**
     * Get optimal pressure based on reaction stoichiometry
     */
    private getOptimalPressure(reactionData: ReactionData): number {
        const reactantMoles = reactionData.reactants.reduce((sum: number, r) => sum + r.coefficient, 0);
        const productMoles = reactionData.products.reduce((sum: number, p) => sum + p.coefficient, 0);
        
        // If products have fewer moles, high pressure favors products
        if (productMoles < reactantMoles) return 10; // High pressure
        if (productMoles > reactantMoles) return 0.1; // Low pressure
        return 1.0; // Standard pressure
    }

    /**
     * Generate optimization reasoning
     */
    private generateOptimizationReasoning(
        temperature: number, 
        thermo: ThermodynamicsResult, 
        K: number
    ): string[] {
        const reasoning = [];
        
        if (temperature > 298.15) {
            if (thermo.enthalpy > 0) {
                reasoning.push(`Higher temperature (${temperature}K) favors endothermic reaction`);
            } else {
                reasoning.push(`Higher temperature (${temperature}K) may reduce yield but increase rate`);
            }
        } else {
            reasoning.push(`Standard temperature (${temperature}K) conditions`);
        }
        
        reasoning.push(`Equilibrium constant K = ${K.toExponential(2)}`);
        reasoning.push(`ΔG° = ${thermo.gibbsFreeEnergy.toFixed(1)} kJ/mol at ${temperature}K`);
        
        return reasoning;
    }
}
