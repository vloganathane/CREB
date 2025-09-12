/**
 * CREB Phase 3: Simplified AI-Powered Reaction Classification
 * Browser-compatible version without external ML dependencies
 */

export interface ReactionClassificationResult {
  reactionType: string;
  confidence: number;
  reasoning: string[];
  suggestedStyle: any;
  characteristics: ReactionCharacteristics;
}

export interface ReactionCharacteristics {
  hasOxygen: boolean;
  hasCombustibleFuel: boolean;
  formsSingleProduct: boolean;
  breaksIntoMultipleProducts: boolean;
  involvesIons: boolean;
  hasEnergyRelease: boolean;
  hasGasProduction: boolean;
  hasPrecipitate: boolean;
}

/**
 * AI-Powered Reaction Classification System (Simplified)
 * Provides intelligent reaction analysis without external ML dependencies
 */
export class ReactionClassifier {
  private modelVersion: string = '1.0.0-browser';

  constructor() {
    console.log('🤖 AI Reaction Classifier initialized (Browser Mode)');
  }

  /**
   * Classify a chemical reaction using rule-based AI
   */
  async classifyReaction(equation: string): Promise<ReactionClassificationResult> {
    try {
      const startTime = Date.now();
      
      // Parse equation components
      const compounds = this.extractCompounds(equation);
      const characteristics = this.analyzeReactionCharacteristics(equation);
      
      // Determine reaction type using rule-based classification
      const reactionType = this.determineReactionType(characteristics, compounds);
      const confidence = this.calculateConfidence(characteristics);
      const reasoning = this.generateReasoning(reactionType, characteristics);
      const suggestedStyle = this.getAnimationStyle(reactionType);

      const result: ReactionClassificationResult = {
        reactionType,
        confidence,
        reasoning,
        suggestedStyle,
        characteristics
      };

      const processingTime = Date.now() - startTime;
      console.log(`✅ AI classification complete in ${processingTime}ms`, result);

      return result;

    } catch (error) {
      console.error('❌ AI classification failed:', error);
      
      // Fallback to general classification
      return {
        reactionType: 'general',
        confidence: 0.1,
        reasoning: ['Classification failed, using default style'],
        suggestedStyle: this.getDefaultAnimationStyle(),
        characteristics: this.getDefaultCharacteristics()
      };
    }
  }

  /**
   * Optimize animation parameters based on reaction type
   */
  async optimizeAnimationParameters(
    reactionType: ReactionClassificationResult,
    reactants: any[],
    products: any[]
  ): Promise<any> {
    try {
      // Base parameters from reaction classification
      const baseParams = {
        duration: 3.0,
        temperature: 298,
        pressure: 1,
        solvent: 'vacuum'
      };

      // Adjust based on reaction characteristics
      if (reactionType.characteristics.hasEnergyRelease) {
        return {
          ...baseParams,
          duration: 2.0,
          showEnergyProfile: true,
          particleEffects: true
        };
      }

      if (reactionType.characteristics.hasGasProduction) {
        return {
          ...baseParams,
          duration: 3.5,
          showBubbleEffects: true,
          emphasizeVolumeChange: true
        };
      }

      return baseParams;
    } catch (error: any) {
      console.error('AI parameter optimization failed:', error);
      throw error;
    }
  }

  /**
   * Analyze the structural characteristics of a reaction
   */
  private analyzeReactionCharacteristics(equation: string): ReactionCharacteristics {
    const compounds = this.extractCompounds(equation);
    const reactants = compounds.reactants;
    const products = compounds.products;

    return {
      hasOxygen: this.containsOxygen(reactants) || this.containsOxygen(products),
      hasCombustibleFuel: this.containsCombustibleFuel(reactants),
      formsSingleProduct: products.length === 1,
      breaksIntoMultipleProducts: products.length > reactants.length,
      involvesIons: this.containsIons(reactants) || this.containsIons(products),
      hasEnergyRelease: this.isExothermic(equation),
      hasGasProduction: this.producesGas(products),
      hasPrecipitate: this.formsPrecipitate(equation)
    };
  }

  /**
   * Extract compounds from equation
   */
  private extractCompounds(equation: string): { reactants: string[], products: string[] } {
    const [reactantSide, productSide] = equation.split(/→|->|=/).map(s => s.trim());
    
    const reactants = reactantSide.split('+').map(s => s.trim().replace(/^\d+/, ''));
    const products = productSide.split('+').map(s => s.trim().replace(/^\d+/, ''));
    
    return { reactants, products };
  }

  /**
   * Determine reaction type based on characteristics
   */
  private determineReactionType(
    characteristics: ReactionCharacteristics, 
    compounds: { reactants: string[], products: string[] }
  ): string {
    const { reactants, products } = compounds;

    // Combustion detection
    if (characteristics.hasOxygen && characteristics.hasCombustibleFuel && 
        products.some(p => p.includes('CO2') || p.includes('H2O'))) {
      return 'combustion';
    }

    // Synthesis detection
    if (reactants.length > 1 && characteristics.formsSingleProduct) {
      return 'synthesis';
    }

    // Decomposition detection
    if (reactants.length === 1 && characteristics.breaksIntoMultipleProducts) {
      return 'decomposition';
    }

    // Acid-base detection
    if (characteristics.involvesIons && products.some(p => p.includes('H2O'))) {
      return 'acid-base';
    }

    // Single displacement
    if (reactants.length === 2 && products.length === 2 && 
        this.hasElementalMetal(reactants)) {
      return 'single-displacement';
    }

    // Double displacement
    if (reactants.length === 2 && products.length === 2 && 
        characteristics.involvesIons) {
      return 'double-displacement';
    }

    return 'general';
  }

  /**
   * Helper methods for compound analysis
   */
  private containsOxygen(compounds: string[]): boolean {
    return compounds.some(c => /O\d*/.test(c));
  }

  private containsCombustibleFuel(compounds: string[]): boolean {
    return compounds.some(c => /C\d*H\d*/.test(c) || c === 'C' || c === 'H2');
  }

  private containsIons(compounds: string[]): boolean {
    return compounds.some(c => /Cl|Na|K|Ca|Mg|OH/.test(c));
  }

  private isExothermic(equation: string): boolean {
    return /combustion|burn|explode/i.test(equation) || 
           equation.includes('CO2') && equation.includes('H2O');
  }

  private producesGas(products: string[]): boolean {
    const gases = ['CO2', 'H2', 'O2', 'N2', 'Cl2', 'NH3'];
    return products.some(p => gases.some(gas => p.includes(gas)));
  }

  private formsPrecipitate(equation: string): boolean {
    return /precipitate|solid|↓/i.test(equation);
  }

  private hasElementalMetal(reactants: string[]): boolean {
    const metals = ['Na', 'K', 'Ca', 'Mg', 'Al', 'Fe', 'Cu', 'Zn'];
    return reactants.some(r => metals.includes(r));
  }

  /**
   * Calculate confidence based on characteristics
   */
  private calculateConfidence(characteristics: ReactionCharacteristics): number {
    let confidence = 0.5; // Base confidence

    // Increase confidence for clear indicators
    if (characteristics.hasOxygen && characteristics.hasCombustibleFuel) confidence += 0.3;
    if (characteristics.formsSingleProduct) confidence += 0.1;
    if (characteristics.hasEnergyRelease) confidence += 0.2;
    if (characteristics.involvesIons) confidence += 0.1;

    return Math.min(confidence, 0.95); // Cap at 95%
  }

  /**
   * Generate reasoning for classification
   */
  private generateReasoning(reactionType: string, characteristics: ReactionCharacteristics): string[] {
    const reasons = [];

    switch (reactionType) {
      case 'combustion':
        reasons.push('Oxygen present in reactants');
        reasons.push('Combustible fuel detected');
        if (characteristics.hasEnergyRelease) reasons.push('Exothermic reaction');
        break;
      case 'synthesis':
        reasons.push('Multiple reactants form single product');
        break;
      case 'decomposition':
        reasons.push('Single reactant breaks into multiple products');
        break;
      case 'acid-base':
        reasons.push('Ionic compounds detected');
        reasons.push('Water formation indicates neutralization');
        break;
    }

    return reasons;
  }

  /**
   * Get animation style based on reaction type
   */
  private getAnimationStyle(reactionType: string): any {
    const styles = {
      combustion: {
        particleEffects: true,
        energyProfile: true,
        colorScheme: 'fire',
        duration: 2.0
      },
      synthesis: {
        bondFormation: true,
        convergence: true,
        colorScheme: 'synthesis',
        duration: 3.0
      },
      decomposition: {
        bondBreaking: true,
        divergence: true,
        colorScheme: 'breakdown',
        duration: 2.5
      },
      'acid-base': {
        ionicMotion: true,
        neutralization: true,
        colorScheme: 'ionic',
        duration: 3.5
      }
    };

    return styles[reactionType as keyof typeof styles] || this.getDefaultAnimationStyle();
  }

  private getDefaultAnimationStyle(): any {
    return {
      particleEffects: false,
      energyProfile: false,
      colorScheme: 'default',
      duration: 3.0
    };
  }

  private getDefaultCharacteristics(): ReactionCharacteristics {
    return {
      hasOxygen: false,
      hasCombustibleFuel: false,
      formsSingleProduct: false,
      breaksIntoMultipleProducts: false,
      involvesIons: false,
      hasEnergyRelease: false,
      hasGasProduction: false,
      hasPrecipitate: false
    };
  }
}
