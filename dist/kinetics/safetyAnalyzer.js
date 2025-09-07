/**
 * CREB Reaction Safety Analyzer
 * Analyzes reaction safety and provides hazard assessments
 */
import { EquationParser } from '../utils';
export class ReactionSafetyAnalyzer {
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
//# sourceMappingURL=safetyAnalyzer.js.map