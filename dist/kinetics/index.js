/**
 * CREB Advanced Kinetics & Analytics Module
 * Entry point for reaction kinetics analysis, mechanism studies, and safety assessment
 */
// Core kinetics calculator
export { ReactionKinetics } from './calculator';
// Mechanism analysis
export { MechanismAnalyzer } from './mechanismAnalyzer';
// Safety analysis
export { ReactionSafetyAnalyzer } from './safetyAnalyzer';
/**
 * Comprehensive Kinetics Analysis Suite
 * Combines kinetics, mechanism, and safety analysis
 */
export class AdvancedKineticsAnalyzer {
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
                const { ReactionKinetics } = await import('./calculator');
                results.kinetics = ReactionKinetics.analyzeKinetics(equation, conditions);
            }
            // Mechanism analysis
            if (includeMechanism && mechanismSteps.length > 0) {
                const { MechanismAnalyzer } = await import('./mechanismAnalyzer');
                results.mechanism = MechanismAnalyzer.analyzeMechanism(mechanismSteps, conditions);
            }
            // Safety analysis
            if (includeSafety) {
                const { ReactionSafetyAnalyzer } = await import('./safetyAnalyzer');
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
        const { ReactionKinetics } = await import('./calculator');
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
//# sourceMappingURL=index.js.map