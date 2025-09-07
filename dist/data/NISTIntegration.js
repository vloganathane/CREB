/**
 * NIST WebBook Integration for Enhanced Data
 * Provides real-time access to NIST thermodynamic database
 */
export class NISTWebBookIntegration {
    constructor(apiKey) {
        this.baseURL = 'https://webbook.nist.gov/cgi/cbook.cgi';
        this.cache = new Map();
        this.cacheTimeout = 86400000; // 24 hours in ms
        this.apiKey = apiKey;
    }
    /**
     * Query NIST WebBook for compound data
     */
    async queryCompound(identifier, type = 'formula') {
        try {
            // Check cache first
            const cacheKey = `${type}:${identifier}`;
            const cached = this.cache.get(cacheKey);
            if (cached && (Date.now() - cached.timestamp) < this.cacheTimeout) {
                return this.convertNISTToCompound(cached.data);
            }
            // Make API request
            const response = await this.makeNISTRequest(identifier, type);
            if (response) {
                // Cache the response
                this.cache.set(cacheKey, {
                    data: response,
                    timestamp: Date.now()
                });
                return this.convertNISTToCompound(response);
            }
            return null;
        }
        catch (error) {
            console.warn(`NIST WebBook query failed: ${error}`);
            return null;
        }
    }
    /**
     * Make request to NIST WebBook API
     */
    async makeNISTRequest(identifier, type) {
        // Note: This is a simplified implementation
        // The actual NIST WebBook doesn't have a public REST API
        // This would need to be implemented using web scraping or a proxy service
        const params = new URLSearchParams({
            cbook: 'main',
            [type === 'formula' ? 'Formula' : type === 'name' ? 'Name' : 'ID']: identifier,
            Units: 'SI',
            Mask: '1' // Thermochemical data
        });
        try {
            // This is a placeholder implementation
            // In practice, you would either:
            // 1. Use web scraping with libraries like Puppeteer
            // 2. Use a proxy service that provides API access to NIST
            // 3. Use cached NIST data that's periodically updated
            const url = `${this.baseURL}?${params}`;
            console.log(`Would query NIST at: ${url}`);
            // Return mock data for demonstration
            return this.getMockNISTData(identifier);
        }
        catch (error) {
            throw new Error(`NIST request failed: ${error}`);
        }
    }
    /**
     * Convert NIST response to CompoundDatabase format
     */
    convertNISTToCompound(nistData) {
        const thermodynamicProperties = {
            deltaHf: nistData.thermodynamics?.enthalpy_formation || 0,
            entropy: nistData.thermodynamics?.entropy || 0,
            heatCapacity: nistData.thermodynamics?.heat_capacity || 25,
            temperatureRange: nistData.thermodynamics?.temperature_range || [298, 1000],
            meltingPoint: nistData.phase_data?.melting_point,
            boilingPoint: nistData.phase_data?.boiling_point,
            criticalTemperature: nistData.phase_data?.critical_temperature,
            criticalPressure: nistData.phase_data?.critical_pressure,
            uncertainties: nistData.uncertainties ? {
                deltaHf: nistData.uncertainties.enthalpy_formation,
                entropy: nistData.uncertainties.entropy
            } : undefined
        };
        return {
            formula: nistData.formula,
            name: nistData.name,
            casNumber: nistData.cas,
            molecularWeight: this.calculateMolecularWeight(nistData.formula),
            thermodynamicProperties,
            physicalProperties: {},
            sources: ['nist'],
            lastUpdated: new Date(),
            confidence: 0.95 // NIST data is highly reliable
        };
    }
    /**
     * Calculate molecular weight from formula (simplified)
     */
    calculateMolecularWeight(formula) {
        // Simple atomic weights for common elements
        const atomicWeights = {
            'H': 1.008, 'C': 12.011, 'N': 14.007, 'O': 15.999,
            'F': 18.998, 'Na': 22.990, 'Mg': 24.305, 'Al': 26.982,
            'Si': 28.085, 'P': 30.974, 'S': 32.065, 'Cl': 35.453,
            'K': 39.098, 'Ca': 40.078, 'Fe': 55.845, 'Cu': 63.546,
            'Zn': 65.38, 'Br': 79.904, 'I': 126.904
        };
        let weight = 0;
        let i = 0;
        while (i < formula.length) {
            if (formula[i] === '(' || formula[i] === ')') {
                i++;
                continue;
            }
            // Get element symbol (starts with uppercase)
            if (!/[A-Z]/.test(formula[i])) {
                i++;
                continue;
            }
            let element = formula[i];
            i++;
            // Check for two-letter elements (second letter is lowercase)
            if (i < formula.length && /[a-z]/.test(formula[i])) {
                element += formula[i];
                i++;
            }
            // Get count
            let count = '';
            while (i < formula.length && /\d/.test(formula[i])) {
                count += formula[i];
                i++;
            }
            const elementWeight = atomicWeights[element] || 0;
            const elementCount = count ? parseInt(count) : 1;
            weight += elementWeight * elementCount;
        }
        return Math.round(weight * 1000) / 1000; // Round to 3 decimal places
    }
    /**
     * Get mock NIST data for testing/demonstration
     */
    getMockNISTData(identifier) {
        const mockData = {
            'H2O': {
                formula: 'H2O',
                name: 'Water',
                cas: '7732-18-5',
                thermodynamics: {
                    enthalpy_formation: -285.8,
                    entropy: 69.95,
                    heat_capacity: 75.3,
                    temperature_range: [273.15, 647.1]
                },
                phase_data: {
                    melting_point: 273.15,
                    boiling_point: 373.15,
                    critical_temperature: 647.1,
                    critical_pressure: 22064000
                },
                uncertainties: {
                    enthalpy_formation: 0.4,
                    entropy: 0.1
                }
            },
            'CO2': {
                formula: 'CO2',
                name: 'Carbon dioxide',
                cas: '124-38-9',
                thermodynamics: {
                    enthalpy_formation: -393.5,
                    entropy: 213.8,
                    heat_capacity: 37.1,
                    temperature_range: [200, 2000]
                },
                phase_data: {
                    melting_point: 216.6,
                    boiling_point: 194.7,
                    critical_temperature: 304.13,
                    critical_pressure: 7375000
                },
                uncertainties: {
                    enthalpy_formation: 0.1,
                    entropy: 0.3
                }
            },
            'CH4': {
                formula: 'CH4',
                name: 'Methane',
                cas: '74-82-8',
                thermodynamics: {
                    enthalpy_formation: -74.6,
                    entropy: 186.3,
                    heat_capacity: 35.7,
                    temperature_range: [200, 1500]
                },
                phase_data: {
                    melting_point: 90.7,
                    boiling_point: 111.7,
                    critical_temperature: 190.6,
                    critical_pressure: 4599000
                },
                uncertainties: {
                    enthalpy_formation: 0.2,
                    entropy: 0.2
                }
            },
            'O2': {
                formula: 'O2',
                name: 'Oxygen',
                cas: '7782-44-7',
                thermodynamics: {
                    enthalpy_formation: 0,
                    entropy: 205.2,
                    heat_capacity: 29.4,
                    temperature_range: [200, 3000]
                },
                phase_data: {
                    melting_point: 54.4,
                    boiling_point: 90.2,
                    critical_temperature: 154.6,
                    critical_pressure: 5043000
                },
                uncertainties: {
                    enthalpy_formation: 0,
                    entropy: 0.1
                }
            },
            'N2': {
                formula: 'N2',
                name: 'Nitrogen',
                cas: '7727-37-9',
                thermodynamics: {
                    enthalpy_formation: 0,
                    entropy: 191.6,
                    heat_capacity: 29.1,
                    temperature_range: [200, 3000]
                },
                phase_data: {
                    melting_point: 63.1,
                    boiling_point: 77.4,
                    critical_temperature: 126.2,
                    critical_pressure: 3396000
                },
                uncertainties: {
                    enthalpy_formation: 0,
                    entropy: 0.1
                }
            }
        };
        return mockData[identifier] || null;
    }
    /**
     * Batch query multiple compounds
     */
    async batchQuery(identifiers, type = 'formula') {
        const results = [];
        // Process in batches to avoid overwhelming the API
        const batchSize = 10;
        for (let i = 0; i < identifiers.length; i += batchSize) {
            const batch = identifiers.slice(i, i + batchSize);
            const batchPromises = batch.map(identifier => this.queryCompound(identifier, type));
            const batchResults = await Promise.allSettled(batchPromises);
            batchResults.forEach(result => {
                if (result.status === 'fulfilled' && result.value) {
                    results.push(result.value);
                }
            });
            // Add delay between batches to be respectful to the API
            if (i + batchSize < identifiers.length) {
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
        return results;
    }
    /**
     * Clear the cache
     */
    clearCache() {
        this.cache.clear();
    }
    /**
     * Get cache statistics
     */
    getCacheStats() {
        let oldestTimestamp = Infinity;
        let newestTimestamp = 0;
        for (const entry of this.cache.values()) {
            if (entry.timestamp < oldestTimestamp) {
                oldestTimestamp = entry.timestamp;
            }
            if (entry.timestamp > newestTimestamp) {
                newestTimestamp = entry.timestamp;
            }
        }
        return {
            size: this.cache.size,
            oldestEntry: oldestTimestamp === Infinity ? null : new Date(oldestTimestamp),
            newestEntry: newestTimestamp === 0 ? null : new Date(newestTimestamp)
        };
    }
}
//# sourceMappingURL=NISTIntegration.js.map