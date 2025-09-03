/**
 * Enhanced Chemical Equation Balancer with PubChem integration
 * Provides compound validation, molecular weight verification, and enriched data
 */

import { ChemicalEquationBalancer } from './balancer';
import { BalancedEquation } from './types';

// Import type definitions for PubChem integration
// Note: In production, this would import from 'creb-pubchem-js'
interface PubChemCompound {
  cid: number;
  molecularWeight: number | null;
  molecularFormula: string | null;
  iupacName: string | null;
  isomericSmiles?: string | null;
}

export interface EnhancedBalancedEquation extends BalancedEquation {
  compoundData?: Record<string, CompoundInfo>;
  validation?: {
    massBalanced: boolean;
    chargeBalanced: boolean;
    warnings: string[];
  };
}

export interface CompoundInfo {
  name: string;
  cid?: number;
  molecularWeight?: number;
  molecularFormula?: string;
  iupacName?: string;
  canonicalSmiles?: string;
  isValid: boolean;
  error?: string;
  pubchemData?: PubChemCompound;
}

export class EnhancedChemicalEquationBalancer extends ChemicalEquationBalancer {
  private compoundCache: Map<string, CompoundInfo> = new Map();

  /**
   * Balance equation with PubChem data enrichment
   */
  async balanceWithPubChemData(equation: string): Promise<EnhancedBalancedEquation> {
    // First balance the equation normally
    const balanced = this.balanceDetailed(equation);
    
    // Enhance with PubChem data
    const enhanced: EnhancedBalancedEquation = {
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
        enhanced.compoundData![species] = compoundInfo;
        
        if (!compoundInfo.isValid && compoundInfo.error) {
          enhanced.validation!.warnings.push(`${species}: ${compoundInfo.error}`);
        }
      } catch (error) {
        enhanced.validation!.warnings.push(`Failed to fetch data for ${species}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    // Validate mass balance using PubChem molecular weights
    try {
      const massValidation = this.validateMassBalance(balanced, enhanced.compoundData!);
      enhanced.validation!.massBalanced = massValidation.balanced;
      if (!massValidation.balanced) {
        enhanced.validation!.warnings.push(`Mass balance discrepancy: ${massValidation.discrepancy.toFixed(4)} g/mol`);
      }
    } catch (error) {
      enhanced.validation!.warnings.push(`Could not validate mass balance: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    return enhanced;
  }

  /**
   * Get compound information from PubChem
   */
  async getCompoundInfo(compoundName: string): Promise<CompoundInfo> {
    // Check cache first
    if (this.compoundCache.has(compoundName)) {
      return this.compoundCache.get(compoundName)!;
    }

    const result: CompoundInfo = {
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
      let compounds: PubChemCompound[] = [];
      
      // First try exact name match
      try {
        compounds = await pubchemModule.fromName(compoundName);
      } catch (error) {
        // If name search fails and it looks like a formula, try CID search
        if (this.isLikelyFormula(compoundName)) {
          try {
            // For simple cases, try to find by common names
            const commonNames = this.getCommonNames(compoundName);
            for (const name of commonNames) {
              try {
                compounds = await pubchemModule.fromName(name);
                if (compounds.length > 0) break;
              } catch {
                // Continue to next name
              }
            }
          } catch (formulaError) {
            result.error = `Not found by name or common formula names: ${error instanceof Error ? error.message : 'Unknown error'}`;
          }
        } else {
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
      } else if (!result.error) {
        result.error = 'No compounds found';
      }
    } catch (error) {
      result.error = `Search failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }

    // Cache the result
    this.compoundCache.set(compoundName, result);
    return result;
  }

  /**
   * Dynamically load PubChem module if available
   */
  private async loadPubChemModule(): Promise<any> {
    try {
      // Try to import the PubChem module
      // In browser environment, this would be from global scope
      if (typeof globalThis !== 'undefined' && (globalThis as any).CREBPubChem) {
        return (globalThis as any).CREBPubChem.Compound;
      }
      
      // In Node.js environment, try dynamic import with error handling
      try {
        // Use eval to avoid TypeScript compile-time module resolution
        const importFn = new Function('specifier', 'return import(specifier)');
        const pubchemModule = await importFn('creb-pubchem-js');
        return pubchemModule.Compound;
      } catch (importError) {
        // Module not available
        return null;
      }
    } catch (error) {
      // PubChem module not available
      return null;
    }
  }

  /**
   * Get common names for simple chemical formulas
   */
  private getCommonNames(formula: string): string[] {
    const commonNames: Record<string, string[]> = {
      'H2O': ['water'],
      'CO2': ['carbon dioxide'],
      'NaCl': ['sodium chloride', 'salt'],
      'H2SO4': ['sulfuric acid'],
      'HCl': ['hydrochloric acid'],
      'NH3': ['ammonia'],
      'CH4': ['methane'],
      'C2H5OH': ['ethanol', 'ethyl alcohol'],
      'C6H12O6': ['glucose'],
      'CaCO3': ['calcium carbonate'],
      'NaOH': ['sodium hydroxide'],
      'KOH': ['potassium hydroxide'],
      'Mg': ['magnesium'],
      'Al': ['aluminum'],
      'Fe': ['iron'],
      'Cu': ['copper'],
      'Zn': ['zinc'],
      'O2': ['oxygen'],
      'N2': ['nitrogen'],
      'H2': ['hydrogen']
    };

    return commonNames[formula] || [];
  }

  /**
   * Check if a string looks like a chemical formula
   */
  private isLikelyFormula(str: string): boolean {
    // Simple heuristic: contains only letters, numbers, parentheses, and common symbols
    return /^[A-Za-z0-9()[\]+-]+$/.test(str) && /[A-Z]/.test(str);
  }

  /**
   * Validate mass balance using PubChem molecular weights
   */
  private validateMassBalance(
    balanced: BalancedEquation, 
    compoundData: Record<string, CompoundInfo>
  ): { balanced: boolean; discrepancy: number } {
    let reactantMass = 0;
    let productMass = 0;

    // Calculate reactant mass
    for (let i = 0; i < balanced.reactants.length; i++) {
      const species = balanced.reactants[i];
      const coefficient = balanced.coefficients[i];
      const compound = compoundData[species];
      
      if (compound?.molecularWeight) {
        reactantMass += coefficient * compound.molecularWeight;
      } else {
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
      } else {
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
  async suggestAlternatives(compoundName: string): Promise<string[]> {
    const suggestions: string[] = [];
    
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
          } catch {
            // Ignore errors for suggestions
          }
        }
      }
    } catch (error) {
      // Return empty suggestions if search fails
    }

    return [...new Set(suggestions)]; // Remove duplicates
  }

  /**
   * Clear the compound cache
   */
  clearCache(): void {
    this.compoundCache.clear();
  }

  /**
   * Get cached compound info without making new requests
   */
  getCachedCompoundInfo(compoundName: string): CompoundInfo | undefined {
    return this.compoundCache.get(compoundName);
  }
}
