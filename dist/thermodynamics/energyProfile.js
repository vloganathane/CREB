/**
 * Energy Profile Generator
 * Creates visualization-ready energy profile data for chemical reactions
 * Part of CREB-JS v1.6.0 - Energy Profile Visualization Feature
 */
export class EnergyProfileGenerator {
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
export function createEnergyProfile(thermodynamics, kinetics, options) {
    const generator = new EnergyProfileGenerator();
    if (options?.temperature || options?.pressure) {
        generator.setConditions(options.temperature || 298.15, options.pressure || 101325);
    }
    return generator.generateProfile(thermodynamics, kinetics);
}
/**
 * Export energy profile for popular visualization libraries
 */
export function exportEnergyProfile(profile, format) {
    const generator = new EnergyProfileGenerator();
    return generator.exportForVisualization(profile, format);
}
//# sourceMappingURL=energyProfile.js.map