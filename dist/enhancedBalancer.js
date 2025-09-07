/**
 * Enhanced Chemical Equation Balancer with PubChem integration
 * Provides compound validation, molecular weight verification, and enriched data
 */
import { ChemicalEquationBalancer } from './balancer';
export class EnhancedChemicalEquationBalancer extends ChemicalEquationBalancer {
    constructor() {
        super(...arguments);
        this.compoundCache = new Map();
    }
    /**
     * Balance equation with safety and hazard information
     */
    async balanceWithSafety(equation) {
        // First get the enhanced balance with PubChem data
        const enhanced = await this.balanceWithPubChemData(equation);
        // Add safety information for each compound
        const safetyWarnings = [];
        if (enhanced.compoundData) {
            for (const [species, compoundInfo] of Object.entries(enhanced.compoundData)) {
                if (compoundInfo.isValid) {
                    try {
                        // Get safety information for the compound
                        const safetyInfo = await this.getSafetyInfo(compoundInfo);
                        compoundInfo.safetyInfo = safetyInfo;
                        // Generate safety warnings
                        const warnings = this.generateSafetyWarnings(species, safetyInfo);
                        safetyWarnings.push(...warnings);
                    }
                    catch (error) {
                        enhanced.validation?.warnings.push(`Could not retrieve safety data for ${species}: ${error instanceof Error ? error.message : 'Unknown error'}`);
                    }
                }
            }
        }
        // Add safety warnings to the result
        enhanced.safetyWarnings = safetyWarnings;
        return enhanced;
    }
    /**
     * Get safety information for a compound
     */
    async getSafetyInfo(compoundInfo) {
        // For now, use a knowledge base of common chemical hazards
        // In a full implementation, this would query PubChem's safety data
        const safetyKnowledgeBase = this.getKnownSafetyInfo();
        const formula = compoundInfo.molecularFormula;
        const name = compoundInfo.iupacName?.toLowerCase() || compoundInfo.name.toLowerCase();
        // Check known safety data
        let safetyInfo = safetyKnowledgeBase[formula || ''] ||
            safetyKnowledgeBase[name] ||
            safetyKnowledgeBase[compoundInfo.name.toLowerCase()];
        if (!safetyInfo) {
            // Try to infer basic safety information from chemical properties
            safetyInfo = this.inferSafetyFromProperties(compoundInfo);
        }
        return safetyInfo || {
            ghsClassifications: [],
            hazardStatements: [],
            precautionaryStatements: [],
            physicalHazards: [],
            healthHazards: [],
            environmentalHazards: []
        };
    }
    /**
     * Generate safety warnings from safety information
     */
    generateSafetyWarnings(compound, safetyInfo) {
        const warnings = [];
        // Process health hazards
        for (const hazard of safetyInfo.healthHazards) {
            warnings.push({
                compound,
                hazard,
                severity: this.determineSeverity(hazard),
                ghsClassification: safetyInfo.ghsClassifications.join(', ') || undefined,
                precautionaryStatements: safetyInfo.precautionaryStatements.length > 0 ? safetyInfo.precautionaryStatements : undefined
            });
        }
        // Process physical hazards
        for (const hazard of safetyInfo.physicalHazards) {
            warnings.push({
                compound,
                hazard,
                severity: this.determineSeverity(hazard),
                ghsClassification: safetyInfo.ghsClassifications.join(', ') || undefined
            });
        }
        // Process environmental hazards
        for (const hazard of safetyInfo.environmentalHazards) {
            warnings.push({
                compound,
                hazard,
                severity: this.determineSeverity(hazard),
                ghsClassification: safetyInfo.ghsClassifications.join(', ') || undefined
            });
        }
        return warnings;
    }
    /**
     * Determine severity level from hazard description
     */
    determineSeverity(hazard) {
        const hazardLower = hazard.toLowerCase();
        if (hazardLower.includes('fatal') || hazardLower.includes('death') || hazardLower.includes('severe')) {
            return 'extreme';
        }
        if (hazardLower.includes('serious') || hazardLower.includes('burn') || hazardLower.includes('corrosive')) {
            return 'high';
        }
        if (hazardLower.includes('harmful') || hazardLower.includes('irritant') || hazardLower.includes('toxic')) {
            return 'medium';
        }
        return 'low';
    }
    /**
     * Knowledge base of known chemical safety information
     */
    getKnownSafetyInfo() {
        return {
            'H2SO4': {
                ghsClassifications: ['H314', 'H290'],
                hazardStatements: ['Causes severe skin burns and eye damage', 'May be corrosive to metals'],
                precautionaryStatements: ['Wear protective gloves/protective clothing/eye protection/face protection', 'Do not breathe dust/fume/gas/mist/vapours/spray'],
                physicalHazards: ['Corrosive to metals'],
                healthHazards: ['Causes severe skin burns and eye damage'],
                environmentalHazards: [],
                signalWord: 'Danger'
            },
            'sulfuric acid': {
                ghsClassifications: ['H314', 'H290'],
                hazardStatements: ['Causes severe skin burns and eye damage', 'May be corrosive to metals'],
                precautionaryStatements: ['Wear protective gloves/protective clothing/eye protection/face protection', 'Do not breathe dust/fume/gas/mist/vapours/spray'],
                physicalHazards: ['Corrosive to metals'],
                healthHazards: ['Causes severe skin burns and eye damage'],
                environmentalHazards: [],
                signalWord: 'Danger'
            },
            'NaOH': {
                ghsClassifications: ['H314', 'H290'],
                hazardStatements: ['Causes severe skin burns and eye damage', 'May be corrosive to metals'],
                precautionaryStatements: ['Wear protective gloves/protective clothing/eye protection/face protection', 'Do not breathe dust/fume/gas/mist/vapours/spray'],
                physicalHazards: ['Corrosive to metals'],
                healthHazards: ['Causes severe skin burns and eye damage'],
                environmentalHazards: [],
                signalWord: 'Danger'
            },
            'sodium hydroxide': {
                ghsClassifications: ['H314', 'H290'],
                hazardStatements: ['Causes severe skin burns and eye damage', 'May be corrosive to metals'],
                precautionaryStatements: ['Wear protective gloves/protective clothing/eye protection/face protection', 'Do not breathe dust/fume/gas/mist/vapours/spray'],
                physicalHazards: ['Corrosive to metals'],
                healthHazards: ['Causes severe skin burns and eye damage'],
                environmentalHazards: [],
                signalWord: 'Danger'
            },
            'HCl': {
                ghsClassifications: ['H314', 'H335'],
                hazardStatements: ['Causes severe skin burns and eye damage', 'May cause respiratory irritation'],
                precautionaryStatements: ['Wear protective gloves/protective clothing/eye protection/face protection', 'Use only outdoors or in a well-ventilated area'],
                physicalHazards: ['Corrosive to metals'],
                healthHazards: ['Causes severe skin burns and eye damage', 'May cause respiratory irritation'],
                environmentalHazards: [],
                signalWord: 'Danger'
            },
            'hydrochloric acid': {
                ghsClassifications: ['H314', 'H335'],
                hazardStatements: ['Causes severe skin burns and eye damage', 'May cause respiratory irritation'],
                precautionaryStatements: ['Wear protective gloves/protective clothing/eye protection/face protection', 'Use only outdoors or in a well-ventilated area'],
                physicalHazards: ['Corrosive to metals'],
                healthHazards: ['Causes severe skin burns and eye damage', 'May cause respiratory irritation'],
                environmentalHazards: [],
                signalWord: 'Danger'
            },
            'NH3': {
                ghsClassifications: ['H221', 'H314', 'H400'],
                hazardStatements: ['Flammable gas', 'Causes severe skin burns and eye damage', 'Very toxic to aquatic life'],
                precautionaryStatements: ['Keep away from heat/sparks/open flames/hot surfaces', 'Wear protective gloves/protective clothing/eye protection/face protection'],
                physicalHazards: ['Flammable gas'],
                healthHazards: ['Causes severe skin burns and eye damage'],
                environmentalHazards: ['Very toxic to aquatic life'],
                signalWord: 'Danger'
            },
            'ammonia': {
                ghsClassifications: ['H221', 'H314', 'H400'],
                hazardStatements: ['Flammable gas', 'Causes severe skin burns and eye damage', 'Very toxic to aquatic life'],
                precautionaryStatements: ['Keep away from heat/sparks/open flames/hot surfaces', 'Wear protective gloves/protective clothing/eye protection/face protection'],
                physicalHazards: ['Flammable gas'],
                healthHazards: ['Causes severe skin burns and eye damage'],
                environmentalHazards: ['Very toxic to aquatic life'],
                signalWord: 'Danger'
            },
            'H2O': {
                ghsClassifications: [],
                hazardStatements: [],
                precautionaryStatements: [],
                physicalHazards: [],
                healthHazards: [],
                environmentalHazards: []
            },
            'water': {
                ghsClassifications: [],
                hazardStatements: [],
                precautionaryStatements: [],
                physicalHazards: [],
                healthHazards: [],
                environmentalHazards: []
            }
        };
    }
    /**
     * Infer basic safety information from compound properties
     */
    inferSafetyFromProperties(compoundInfo) {
        const safetyInfo = {
            ghsClassifications: [],
            hazardStatements: [],
            precautionaryStatements: ['Handle with care', 'Use proper ventilation'],
            physicalHazards: [],
            healthHazards: [],
            environmentalHazards: []
        };
        const formula = compoundInfo.molecularFormula || '';
        const name = compoundInfo.name.toLowerCase();
        // Infer based on common patterns
        if (formula.includes('O') && formula.includes('H') && (name.includes('acid') || formula.match(/H\d*[A-Z]/))) {
            safetyInfo.healthHazards.push('May cause skin and eye irritation');
            safetyInfo.precautionaryStatements.push('Avoid contact with skin and eyes');
        }
        if (name.includes('chloride') || formula.includes('Cl')) {
            safetyInfo.healthHazards.push('May be harmful if inhaled');
            safetyInfo.precautionaryStatements.push('Use in well-ventilated area');
        }
        if (name.includes('sulfate') || name.includes('nitrate')) {
            safetyInfo.healthHazards.push('May cause irritation');
        }
        // Default precautionary statement for unknown compounds
        if (safetyInfo.healthHazards.length === 0 && formula !== 'H2O') {
            safetyInfo.healthHazards.push('Safety data not available - handle with caution');
        }
        return safetyInfo;
    }
    /**
     * Balance equation using common chemical names
     * Converts compound names to formulas using PubChem, then balances
     */
    async balanceByName(commonNameEquation) {
        try {
            // Step 1: Parse equation to extract compound names
            const { reactantNames, productNames } = this.parseEquationNames(commonNameEquation);
            // Step 2: Resolve each compound name to chemical formula
            const nameToFormulaMap = {};
            const compoundDataMap = {};
            const allNames = [...reactantNames, ...productNames];
            for (const name of allNames) {
                const compoundInfo = await this.getCompoundInfo(name);
                compoundDataMap[name] = compoundInfo;
                if (compoundInfo.isValid && compoundInfo.molecularFormula) {
                    nameToFormulaMap[name] = compoundInfo.molecularFormula;
                }
                else {
                    // Try common name alternatives
                    const alternatives = this.getCommonNames(name);
                    let found = false;
                    for (const alt of alternatives) {
                        const altInfo = await this.getCompoundInfo(alt);
                        if (altInfo.isValid && altInfo.molecularFormula) {
                            nameToFormulaMap[name] = altInfo.molecularFormula;
                            compoundDataMap[name] = altInfo;
                            found = true;
                            break;
                        }
                    }
                    if (!found) {
                        throw new Error(`Could not resolve compound name: "${name}". Try using the chemical formula instead.`);
                    }
                }
            }
            // Step 3: Reconstruct equation with chemical formulas
            const formulaEquation = this.reconstructEquationWithFormulas(commonNameEquation, nameToFormulaMap);
            // Step 4: Balance the reconstructed equation
            const balanced = this.balanceDetailed(formulaEquation);
            // Step 5: Create enhanced result with both names and formulas
            const enhanced = {
                ...balanced,
                compoundData: {},
                validation: {
                    massBalanced: true,
                    chargeBalanced: true,
                    warnings: []
                }
            };
            // Add compound data for both original names and formulas
            for (const [name, info] of Object.entries(compoundDataMap)) {
                if (info.molecularFormula && balanced.reactants.includes(info.molecularFormula)) {
                    enhanced.compoundData[info.molecularFormula] = {
                        ...info,
                        name: info.molecularFormula, // Use formula as key
                        originalName: name // Keep original name
                    };
                }
                if (info.molecularFormula && balanced.products.includes(info.molecularFormula)) {
                    enhanced.compoundData[info.molecularFormula] = {
                        ...info,
                        name: info.molecularFormula,
                        originalName: name
                    };
                }
            }
            // Validate mass balance using PubChem molecular weights
            try {
                const massValidation = this.validateMassBalance(balanced, enhanced.compoundData);
                enhanced.validation.massBalanced = massValidation.balanced;
                if (!massValidation.balanced) {
                    enhanced.validation.warnings.push(`Mass balance discrepancy: ${massValidation.discrepancy.toFixed(4)} g/mol`);
                }
            }
            catch (error) {
                enhanced.validation.warnings.push(`Could not validate mass balance: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
            return enhanced;
        }
        catch (error) {
            throw new Error(`Failed to balance equation by name: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    /**
     * Balance equation with PubChem data enrichment
     */
    async balanceWithPubChemData(equation) {
        // First balance the equation normally
        const balanced = this.balanceDetailed(equation);
        // Enhance with PubChem data
        const enhanced = {
            ...balanced,
            compoundData: {},
            validation: {
                massBalanced: true,
                chargeBalanced: true,
                warnings: []
            }
        };
        // Get all unique species from the equation
        const allSpecies = [...new Set([...balanced.reactants, ...balanced.products])];
        // Fetch PubChem data for each compound
        for (const species of allSpecies) {
            try {
                const compoundInfo = await this.getCompoundInfo(species);
                enhanced.compoundData[species] = compoundInfo;
                if (!compoundInfo.isValid && compoundInfo.error) {
                    enhanced.validation.warnings.push(`${species}: ${compoundInfo.error}`);
                }
            }
            catch (error) {
                enhanced.validation.warnings.push(`Failed to fetch data for ${species}: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
        }
        // Validate mass balance using PubChem molecular weights
        try {
            const massValidation = this.validateMassBalance(balanced, enhanced.compoundData);
            enhanced.validation.massBalanced = massValidation.balanced;
            if (!massValidation.balanced) {
                enhanced.validation.warnings.push(`Mass balance discrepancy: ${massValidation.discrepancy.toFixed(4)} g/mol`);
            }
        }
        catch (error) {
            enhanced.validation.warnings.push(`Could not validate mass balance: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
        return enhanced;
    }
    /**
     * Get compound information from PubChem
     */
    async getCompoundInfo(compoundName) {
        // Check cache first
        if (this.compoundCache.has(compoundName)) {
            return this.compoundCache.get(compoundName);
        }
        const result = {
            name: compoundName,
            isValid: false
        };
        try {
            // Dynamic import of PubChem functionality
            const pubchemModule = await this.loadPubChemModule();
            if (!pubchemModule) {
                result.error = 'PubChem module not available. Install creb-pubchem-js for enhanced functionality.';
                this.compoundCache.set(compoundName, result);
                return result;
            }
            // Try to find compound by name
            let compounds = [];
            // First try exact name match
            try {
                compounds = await pubchemModule.fromName(compoundName);
            }
            catch (error) {
                // If name search fails and it looks like a formula, try CID search
                if (this.isLikelyFormula(compoundName)) {
                    try {
                        // For simple cases, try to find by common names
                        const commonNames = this.getCommonNames(compoundName);
                        for (const name of commonNames) {
                            try {
                                compounds = await pubchemModule.fromName(name);
                                if (compounds.length > 0)
                                    break;
                            }
                            catch {
                                // Continue to next name
                            }
                        }
                    }
                    catch (formulaError) {
                        result.error = `Not found by name or common formula names: ${error instanceof Error ? error.message : 'Unknown error'}`;
                    }
                }
                else {
                    result.error = `Not found by name: ${error instanceof Error ? error.message : 'Unknown error'}`;
                }
            }
            if (compounds.length > 0) {
                const compound = compounds[0]; // Use first match
                result.cid = compound.cid;
                result.molecularWeight = compound.molecularWeight || undefined;
                result.molecularFormula = compound.molecularFormula || undefined;
                result.iupacName = compound.iupacName || undefined;
                result.canonicalSmiles = compound.isomericSmiles || undefined;
                result.isValid = true;
                result.pubchemData = compound;
            }
            else if (!result.error) {
                result.error = 'No compounds found';
            }
        }
        catch (error) {
            result.error = `Search failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
        }
        // Cache the result
        this.compoundCache.set(compoundName, result);
        return result;
    }
    /**
     * Dynamically load PubChem module if available
     */
    async loadPubChemModule() {
        try {
            // Try to import the PubChem module
            // In browser environment, check for global PubChemJS
            if (typeof globalThis !== 'undefined' && globalThis.PubChemJS) {
                return globalThis.PubChemJS.Compound;
            }
            // Also check window for browser compatibility
            if (typeof globalThis !== 'undefined' && typeof globalThis.window !== 'undefined' && globalThis.window.PubChemJS) {
                return globalThis.window.PubChemJS.Compound;
            }
            // Legacy check for CREBPubChem (for backwards compatibility)
            if (typeof globalThis !== 'undefined' && globalThis.CREBPubChem) {
                return globalThis.CREBPubChem.Compound;
            }
            // In Node.js environment, try dynamic import with error handling
            try {
                // Use eval to avoid TypeScript compile-time module resolution
                const importFn = new Function('specifier', 'return import(specifier)');
                const pubchemModule = await importFn('creb-pubchem-js');
                return pubchemModule.Compound;
            }
            catch (importError) {
                // Module not available
                return null;
            }
        }
        catch (error) {
            // PubChem module not available
            return null;
        }
    }
    /**
     * Parse equation with compound names to extract reactant and product names
     */
    parseEquationNames(equation) {
        // Clean up the equation
        const cleanEquation = equation.trim().replace(/\s+/g, ' ');
        // Split by = or -> or →
        const parts = cleanEquation.split(/\s*(?:=|->|→)\s*/);
        if (parts.length !== 2) {
            throw new Error('Invalid equation format. Expected format: "reactants = products"');
        }
        const [reactantsPart, productsPart] = parts;
        // Parse reactants and products (split by + and clean up)
        const reactantNames = reactantsPart.split(/\s*\+\s*/)
            .map(name => name.trim())
            .filter(name => name.length > 0)
            .map(name => this.cleanCompoundName(name));
        const productNames = productsPart.split(/\s*\+\s*/)
            .map(name => name.trim())
            .filter(name => name.length > 0)
            .map(name => this.cleanCompoundName(name));
        if (reactantNames.length === 0 || productNames.length === 0) {
            throw new Error('Invalid equation: must have at least one reactant and one product');
        }
        return { reactantNames, productNames };
    }
    /**
     * Clean compound name by removing coefficients and standardizing format
     */
    cleanCompoundName(name) {
        // Remove leading numbers (coefficients)
        let cleaned = name.replace(/^\d+\s*/, '').trim();
        // Handle common variations
        cleaned = cleaned.toLowerCase().trim();
        // Standardize common names
        const standardNames = {
            'water': 'water',
            'h2o': 'water',
            'sulfuric acid': 'sulfuric acid',
            'sulphuric acid': 'sulfuric acid',
            'sodium hydroxide': 'sodium hydroxide',
            'caustic soda': 'sodium hydroxide',
            'sodium sulfate': 'sodium sulfate',
            'sodium sulphate': 'sodium sulfate',
            'hydrochloric acid': 'hydrochloric acid',
            'muriatic acid': 'hydrochloric acid',
            'ammonia': 'ammonia',
            'carbon dioxide': 'carbon dioxide',
            'glucose': 'glucose',
            'ethanol': 'ethanol',
            'ethyl alcohol': 'ethanol',
            'methane': 'methane',
            'oxygen': 'oxygen',
            'hydrogen': 'hydrogen',
            'nitrogen': 'nitrogen'
        };
        return standardNames[cleaned] || cleaned;
    }
    /**
     * Reconstruct equation using chemical formulas instead of names
     */
    reconstructEquationWithFormulas(originalEquation, nameToFormulaMap) {
        let formulaEquation = originalEquation;
        // Replace each compound name with its formula
        for (const [name, formula] of Object.entries(nameToFormulaMap)) {
            // Create regex to match the compound name (case insensitive, word boundaries)
            const nameRegex = new RegExp(`\\b${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
            formulaEquation = formulaEquation.replace(nameRegex, formula);
        }
        return formulaEquation;
    }
    /**
     * Get common names for simple chemical formulas or alternative names for compounds
     */
    getCommonNames(input) {
        const commonNames = {
            'H2O': ['water'],
            'water': ['H2O', 'dihydrogen monoxide'],
            'CO2': ['carbon dioxide'],
            'carbon dioxide': ['CO2'],
            'NaCl': ['sodium chloride', 'salt'],
            'sodium chloride': ['NaCl', 'salt'],
            'salt': ['NaCl', 'sodium chloride'],
            'H2SO4': ['sulfuric acid', 'sulphuric acid'],
            'sulfuric acid': ['H2SO4', 'sulphuric acid'],
            'sulphuric acid': ['H2SO4', 'sulfuric acid'],
            'HCl': ['hydrochloric acid', 'muriatic acid'],
            'hydrochloric acid': ['HCl', 'muriatic acid'],
            'muriatic acid': ['HCl', 'hydrochloric acid'],
            'NH3': ['ammonia'],
            'ammonia': ['NH3'],
            'CH4': ['methane'],
            'methane': ['CH4'],
            'C2H5OH': ['ethanol', 'ethyl alcohol'],
            'ethanol': ['C2H5OH', 'ethyl alcohol'],
            'ethyl alcohol': ['C2H5OH', 'ethanol'],
            'C6H12O6': ['glucose', 'dextrose'],
            'glucose': ['C6H12O6', 'dextrose'],
            'dextrose': ['C6H12O6', 'glucose'],
            'CaCO3': ['calcium carbonate'],
            'calcium carbonate': ['CaCO3'],
            'NaOH': ['sodium hydroxide', 'caustic soda'],
            'sodium hydroxide': ['NaOH', 'caustic soda'],
            'caustic soda': ['NaOH', 'sodium hydroxide'],
            'KOH': ['potassium hydroxide'],
            'potassium hydroxide': ['KOH'],
            'Na2SO4': ['sodium sulfate', 'sodium sulphate'],
            'sodium sulfate': ['Na2SO4', 'sodium sulphate'],
            'sodium sulphate': ['Na2SO4', 'sodium sulfate'],
            'Mg': ['magnesium'],
            'magnesium': ['Mg'],
            'Al': ['aluminum', 'aluminium'],
            'aluminum': ['Al'],
            'aluminium': ['Al'],
            'Fe': ['iron'],
            'iron': ['Fe'],
            'Cu': ['copper'],
            'copper': ['Cu'],
            'Zn': ['zinc'],
            'zinc': ['Zn'],
            'O2': ['oxygen'],
            'oxygen': ['O2'],
            'N2': ['nitrogen'],
            'nitrogen': ['N2'],
            'H2': ['hydrogen'],
            'hydrogen': ['H2']
        };
        return commonNames[input] || commonNames[input.toLowerCase()] || [];
    }
    /**
     * Check if a string looks like a chemical formula
     */
    isLikelyFormula(str) {
        // Simple heuristic: contains only letters, numbers, parentheses, and common symbols
        return /^[A-Za-z0-9()[\]+-]+$/.test(str) && /[A-Z]/.test(str);
    }
    /**
     * Validate mass balance using PubChem molecular weights
     */
    validateMassBalance(balanced, compoundData) {
        let reactantMass = 0;
        let productMass = 0;
        // Calculate reactant mass
        for (let i = 0; i < balanced.reactants.length; i++) {
            const species = balanced.reactants[i];
            const coefficient = balanced.coefficients[i];
            const compound = compoundData[species];
            if (compound?.molecularWeight) {
                reactantMass += coefficient * compound.molecularWeight;
            }
            else {
                throw new Error(`Missing molecular weight for reactant: ${species}`);
            }
        }
        // Calculate product mass
        for (let i = 0; i < balanced.products.length; i++) {
            const species = balanced.products[i];
            const coefficient = balanced.coefficients[balanced.reactants.length + i];
            const compound = compoundData[species];
            if (compound?.molecularWeight) {
                productMass += coefficient * compound.molecularWeight;
            }
            else {
                throw new Error(`Missing molecular weight for product: ${species}`);
            }
        }
        const discrepancy = Math.abs(reactantMass - productMass);
        const tolerance = 0.01; // 0.01 g/mol tolerance
        return {
            balanced: discrepancy <= tolerance,
            discrepancy
        };
    }
    /**
     * Suggest alternative compound names or formulas
     */
    async suggestAlternatives(compoundName) {
        const suggestions = [];
        try {
            const pubchemModule = await this.loadPubChemModule();
            if (!pubchemModule) {
                return suggestions;
            }
            // Try various search strategies
            const searchTerms = [
                compoundName.toLowerCase(),
                compoundName.toUpperCase(),
                compoundName.replace(/\s+/g, ''),
                compoundName.replace(/\s+/g, '-'),
                compoundName.replace(/-/g, ' '),
            ];
            for (const term of searchTerms) {
                if (term !== compoundName) {
                    try {
                        const compounds = await pubchemModule.fromName(term);
                        if (compounds.length > 0) {
                            suggestions.push(term);
                        }
                    }
                    catch {
                        // Ignore errors for suggestions
                    }
                }
            }
        }
        catch (error) {
            // Return empty suggestions if search fails
        }
        return [...new Set(suggestions)]; // Remove duplicates
    }
    /**
     * Clear the compound cache
     */
    clearCache() {
        this.compoundCache.clear();
    }
    /**
     * Get cached compound info without making new requests
     */
    getCachedCompoundInfo(compoundName) {
        return this.compoundCache.get(compoundName);
    }
}
//# sourceMappingURL=enhancedBalancer.js.map