/**
 * CREB Phase 3: AI-Powered Reaction Classification System
 * 
 * This module provides intelligent reaction type detection and optimal
 * animation style selection using pattern matching and machine learning.
 */

import { telemetry, globalProfiler, globalMetrics } from '../core/telemetry';

export type ReactionType = 
  | 'combustion' 
  | 'synthesis' 
  | 'decomposition' 
  | 'single-replacement' 
  | 'double-replacement' 
  | 'acid-base' 
  | 'redox' 
  | 'precipitation'
  | 'gas-evolution'
  | 'general';

export interface AnimationStyle {
  // Visual Effects
  energyVisualization: boolean;
  explosionEffects: boolean;
  particleEffects: boolean;
  bondBreakingEffects: boolean;
  
  // Color Schemes
  colorScheme: 'fire' | 'gentle' | 'electric' | 'water' | 'earth' | 'default';
  
  // Animation Properties
  transitionDuration: number;
  easing: string;
  cameraMovement: 'dramatic' | 'smooth' | 'static';
  
  // Physics Parameters
  molecularVibration: boolean;
  forceFieldVisualization: boolean;
  energyBarrierAnimation: boolean;
}

export interface ReactionClassificationResult {
  reactionType: ReactionType;
  confidence: number;
  reasoning: string[];
  suggestedStyle: AnimationStyle;
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
 * AI-Powered Reaction Classifier
 * Uses pattern matching and heuristics to classify chemical reactions
 * and suggest optimal animation styles.
 */
export class ReactionClassifier {
  private static readonly COMBUSTION_FUELS = [
    'CH4', 'C2H6', 'C3H8', 'C4H10', // Alkanes
    'C2H4', 'C2H2', // Alkenes/Alkynes  
    'C6H12O6', 'C12H22O11', // Sugars
    'C8H18', 'C7H8', // Gasoline components
    'H2', 'CO', 'NH3' // Other fuels
  ];

  private static readonly OXIDIZERS = ['O2', 'H2O2', 'KMnO4', 'K2Cr2O7'];
  
  private static readonly ACIDS = ['HCl', 'H2SO4', 'HNO3', 'CH3COOH', 'H3PO4'];
  
  private static readonly BASES = ['NaOH', 'KOH', 'Ca(OH)2', 'NH3', 'Mg(OH)2'];

  /**
   * Classify a chemical reaction and suggest optimal animation style
   */
  async classifyReaction(equation: string): Promise<ReactionClassificationResult> {
    return globalProfiler.profileAsync('reaction.classification', async () => {
      try {
        telemetry.info('🧠 Starting AI reaction classification', { equation });
        
        const characteristics = this.analyzeReactionCharacteristics(equation);
        const reactionType = this.determineReactionType(equation, characteristics);
        const confidence = this.calculateConfidence(reactionType, characteristics);
        const reasoning = this.generateReasoning(reactionType, characteristics);
        const suggestedStyle = this.getOptimalAnimationStyle(reactionType, characteristics);

        globalMetrics.counter('ai.classification.success', 1, { 
          reactionType,
          confidence: confidence.toString() 
        });

        const result: ReactionClassificationResult = {
          reactionType,
          confidence,
          reasoning,
          suggestedStyle,
          characteristics
        };

        telemetry.info('✅ AI classification complete', { 
          equation,
          reactionType,
          confidence,
          characteristics: Object.keys(characteristics).filter(k => characteristics[k as keyof ReactionCharacteristics])
        });

        return result;

      } catch (error) {
        globalMetrics.counter('ai.classification.errors', 1);
        telemetry.error('❌ AI classification failed', error as Error, { equation });
        
        // Fallback to general classification
        return {
          reactionType: 'general',
          confidence: 0.1,
          reasoning: ['Classification failed, using default style'],
          suggestedStyle: this.getDefaultAnimationStyle(),
          characteristics: this.getDefaultCharacteristics()
        };
      }
    });
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

      // Adjust based on reaction mechanism
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
      telemetry.error('ai.parameter_optimization_failed', error);
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
   * Determine the primary reaction type based on patterns
   */
  private determineReactionType(equation: string, characteristics: ReactionCharacteristics): ReactionType {
    // Combustion: Fuel + O2 → CO2 + H2O + energy
    if (characteristics.hasCombustibleFuel && 
        characteristics.hasOxygen && 
        equation.includes('CO2') && 
        equation.includes('H2O')) {
      return 'combustion';
    }

    // Synthesis: A + B → AB
    if (characteristics.formsSingleProduct && !characteristics.breaksIntoMultipleProducts) {
      return 'synthesis';
    }

    // Decomposition: AB → A + B
    if (characteristics.breaksIntoMultipleProducts && equation.split('→')[0].trim().split('+').length === 1) {
      return 'decomposition';
    }

    // Acid-Base: Acid + Base → Salt + Water
    if (this.isAcidBaseReaction(equation)) {
      return 'acid-base';
    }

    // Precipitation: Solutions → Solid + Solution
    if (characteristics.hasPrecipitate) {
      return 'precipitation';
    }

    // Gas Evolution
    if (characteristics.hasGasProduction) {
      return 'gas-evolution';
    }

    // Single Replacement: A + BC → AC + B
    if (this.isSingleReplacement(equation)) {
      return 'single-replacement';
    }

    // Double Replacement: AB + CD → AD + CB
    if (this.isDoubleReplacement(equation)) {
      return 'double-replacement';
    }

    // Redox reactions
    if (this.isRedoxReaction(equation)) {
      return 'redox';
    }

    return 'general';
  }

  /**
   * Get optimal animation style based on reaction type and characteristics
   */
  private getOptimalAnimationStyle(reactionType: ReactionType, characteristics: ReactionCharacteristics): AnimationStyle {
    const styleMap: Record<ReactionType, AnimationStyle> = {
      'combustion': {
        energyVisualization: true,
        explosionEffects: true,
        particleEffects: true,
        bondBreakingEffects: true,
        colorScheme: 'fire',
        transitionDuration: 3000,
        easing: 'power2.out',
        cameraMovement: 'dramatic',
        molecularVibration: true,
        forceFieldVisualization: true,
        energyBarrierAnimation: true
      },
      'synthesis': {
        energyVisualization: true,
        explosionEffects: false,
        particleEffects: false,
        bondBreakingEffects: false,
        colorScheme: 'gentle',
        transitionDuration: 2500,
        easing: 'power1.inOut',
        cameraMovement: 'smooth',
        molecularVibration: false,
        forceFieldVisualization: true,
        energyBarrierAnimation: true
      },
      'decomposition': {
        energyVisualization: true,
        explosionEffects: false,
        particleEffects: true,
        bondBreakingEffects: true,
        colorScheme: 'electric',
        transitionDuration: 2800,
        easing: 'power2.in',
        cameraMovement: 'dramatic',
        molecularVibration: true,
        forceFieldVisualization: true,
        energyBarrierAnimation: true
      },
      'acid-base': {
        energyVisualization: false,
        explosionEffects: false,
        particleEffects: false,
        bondBreakingEffects: true,
        colorScheme: 'water',
        transitionDuration: 2000,
        easing: 'power1.inOut',
        cameraMovement: 'smooth',
        molecularVibration: false,
        forceFieldVisualization: false,
        energyBarrierAnimation: false
      },
      'precipitation': {
        energyVisualization: false,
        explosionEffects: false,
        particleEffects: true,
        bondBreakingEffects: false,
        colorScheme: 'earth',
        transitionDuration: 2200,
        easing: 'power2.out',
        cameraMovement: 'smooth',
        molecularVibration: false,
        forceFieldVisualization: false,
        energyBarrierAnimation: false
      },
      'single-replacement': {
        energyVisualization: true,
        explosionEffects: false,
        particleEffects: true,
        bondBreakingEffects: true,
        colorScheme: 'electric',
        transitionDuration: 2600,
        easing: 'power1.inOut',
        cameraMovement: 'smooth',
        molecularVibration: true,
        forceFieldVisualization: true,
        energyBarrierAnimation: true
      },
      'double-replacement': {
        energyVisualization: false,
        explosionEffects: false,
        particleEffects: true,
        bondBreakingEffects: true,
        colorScheme: 'water',
        transitionDuration: 2400,
        easing: 'power1.inOut',
        cameraMovement: 'smooth',
        molecularVibration: false,
        forceFieldVisualization: true,
        energyBarrierAnimation: false
      },
      'redox': {
        energyVisualization: true,
        explosionEffects: false,
        particleEffects: true,
        bondBreakingEffects: true,
        colorScheme: 'electric',
        transitionDuration: 3200,
        easing: 'power2.inOut',
        cameraMovement: 'dramatic',
        molecularVibration: true,
        forceFieldVisualization: true,
        energyBarrierAnimation: true
      },
      'gas-evolution': {
        energyVisualization: false,
        explosionEffects: false,
        particleEffects: true,
        bondBreakingEffects: true,
        colorScheme: 'default',
        transitionDuration: 2300,
        easing: 'power1.out',
        cameraMovement: 'smooth',
        molecularVibration: true,
        forceFieldVisualization: false,
        energyBarrierAnimation: false
      },
      'general': this.getDefaultAnimationStyle()
    };

    return styleMap[reactionType];
  }

  /**
   * Extract compounds from equation string
   */
  private extractCompounds(equation: string): { reactants: string[], products: string[] } {
    const [reactantSide, productSide] = equation.split(/[=→]/);
    
    const reactants = reactantSide
      .split('+')
      .map(compound => compound.trim().replace(/^\d+\s*/, ''))
      .filter(compound => compound.length > 0);
    
    const products = productSide
      .split('+')
      .map(compound => compound.trim().replace(/^\d+\s*/, ''))
      .filter(compound => compound.length > 0);

    return { reactants, products };
  }

  /**
   * Check if compounds contain oxygen
   */
  private containsOxygen(compounds: string[]): boolean {
    return compounds.some(compound => 
      compound.includes('O2') || 
      compound.includes('O') && !compound.includes('OH')
    );
  }

  /**
   * Check if compounds contain combustible fuel
   */
  private containsCombustibleFuel(compounds: string[]): boolean {
    return compounds.some(compound => 
      ReactionClassifier.COMBUSTION_FUELS.some(fuel => compound.includes(fuel))
    );
  }

  /**
   * Check if compounds contain ions (simplified check)
   */
  private containsIons(compounds: string[]): boolean {
    return compounds.some(compound => 
      /\([A-Z][a-z]*\)[0-9]*/.test(compound) || // Polyatomic ions
      ReactionClassifier.ACIDS.includes(compound) ||
      ReactionClassifier.BASES.includes(compound)
    );
  }

  /**
   * Determine if reaction is exothermic (simplified heuristics)
   */
  private isExothermic(equation: string): boolean {
    const exothermicKeywords = ['combustion', 'burning', '+energy', '+heat'];
    return exothermicKeywords.some(keyword => 
      equation.toLowerCase().includes(keyword)
    );
  }

  /**
   * Check if reaction produces gas
   */
  private producesGas(products: string[]): boolean {
    const gases = ['H2', 'O2', 'N2', 'CO2', 'CO', 'NH3', 'H2S', 'SO2', 'NO', 'NO2'];
    return products.some(product => gases.includes(product));
  }

  /**
   * Check if reaction forms precipitate
   */
  private formsPrecipitate(equation: string): boolean {
    // Simplified check - look for common insoluble compounds
    const precipitates = ['AgCl', 'BaSO4', 'CaCO3', 'PbI2', 'AgBr', 'AgI'];
    return precipitates.some(ppt => equation.includes(ppt));
  }

  /**
   * Check if reaction is acid-base
   */
  private isAcidBaseReaction(equation: string): boolean {
    const compounds = this.extractCompounds(equation);
    const hasAcid = compounds.reactants.some(r => ReactionClassifier.ACIDS.includes(r));
    const hasBase = compounds.reactants.some(r => ReactionClassifier.BASES.includes(r));
    const producesWater = compounds.products.includes('H2O');
    
    return hasAcid && hasBase && producesWater;
  }

  /**
   * Check if reaction is single replacement
   */
  private isSingleReplacement(equation: string): boolean {
    const compounds = this.extractCompounds(equation);
    return compounds.reactants.length === 2 && compounds.products.length === 2;
  }

  /**
   * Check if reaction is double replacement
   */
  private isDoubleReplacement(equation: string): boolean {
    const compounds = this.extractCompounds(equation);
    return compounds.reactants.length === 2 && 
           compounds.products.length === 2 &&
           this.containsIons(compounds.reactants);
  }

  /**
   * Check if reaction is redox (simplified)
   */
  private isRedoxReaction(equation: string): boolean {
    return ReactionClassifier.OXIDIZERS.some(oxidizer => equation.includes(oxidizer));
  }

  /**
   * Calculate confidence score for classification
   */
  private calculateConfidence(reactionType: ReactionType, characteristics: ReactionCharacteristics): number {
    let confidence = 0.5; // Base confidence
    
    // Increase confidence based on characteristic matches
    const characteristicCount = Object.values(characteristics).filter(Boolean).length;
    confidence += characteristicCount * 0.1;
    
    // Specific boosts for well-defined reaction types
    if (reactionType === 'combustion' && characteristics.hasCombustibleFuel && characteristics.hasOxygen) {
      confidence += 0.3;
    }
    
    if (reactionType === 'synthesis' && characteristics.formsSingleProduct) {
      confidence += 0.2;
    }
    
    if (reactionType === 'decomposition' && characteristics.breaksIntoMultipleProducts) {
      confidence += 0.2;
    }

    return Math.min(confidence, 1.0);
  }

  /**
   * Generate human-readable reasoning for classification
   */
  private generateReasoning(reactionType: ReactionType, characteristics: ReactionCharacteristics): string[] {
    const reasoning: string[] = [];
    
    switch (reactionType) {
      case 'combustion':
        if (characteristics.hasCombustibleFuel) reasoning.push('Contains combustible fuel');
        if (characteristics.hasOxygen) reasoning.push('Contains oxygen as oxidizer');
        reasoning.push('Produces CO2 and H2O typical of combustion');
        break;
        
      case 'synthesis':
        if (characteristics.formsSingleProduct) reasoning.push('Forms single product from multiple reactants');
        reasoning.push('Classic synthesis reaction pattern A + B → AB');
        break;
        
      case 'decomposition':
        if (characteristics.breaksIntoMultipleProducts) reasoning.push('Single reactant breaks into multiple products');
        reasoning.push('Classic decomposition pattern AB → A + B');
        break;
        
      case 'acid-base':
        reasoning.push('Contains acid and base reactants');
        reasoning.push('Produces water and salt products');
        break;
        
      default:
        reasoning.push(`Classified as ${reactionType} based on structural analysis`);
    }
    
    return reasoning;
  }

  /**
   * Get default animation style
   */
  private getDefaultAnimationStyle(): AnimationStyle {
    return {
      energyVisualization: false,
      explosionEffects: false,
      particleEffects: false,
      bondBreakingEffects: true,
      colorScheme: 'default',
      transitionDuration: 2500,
      easing: 'power1.inOut',
      cameraMovement: 'smooth',
      molecularVibration: false,
      forceFieldVisualization: true,
      energyBarrierAnimation: false
    };
  }

  /**
   * Get default characteristics
   */
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
