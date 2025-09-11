/**
 * CREB Phase 3: AI-Powered Reaction Classification System
 *
 * This module provides intelligent reaction type detection and optimal
 * animation style selection using pattern matching and machine learning.
 */
export type ReactionType = 'combustion' | 'synthesis' | 'decomposition' | 'single-replacement' | 'double-replacement' | 'acid-base' | 'redox' | 'precipitation' | 'gas-evolution' | 'general';
export interface AnimationStyle {
    energyVisualization: boolean;
    explosionEffects: boolean;
    particleEffects: boolean;
    bondBreakingEffects: boolean;
    colorScheme: 'fire' | 'gentle' | 'electric' | 'water' | 'earth' | 'default';
    transitionDuration: number;
    easing: string;
    cameraMovement: 'dramatic' | 'smooth' | 'static';
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
export declare class ReactionClassifier {
    private static readonly COMBUSTION_FUELS;
    private static readonly OXIDIZERS;
    private static readonly ACIDS;
    private static readonly BASES;
    /**
     * Classify a chemical reaction and suggest optimal animation style
     */
    classifyReaction(equation: string): Promise<ReactionClassificationResult>;
    /**
     * Optimize animation parameters based on reaction type
     */
    optimizeAnimationParameters(reactionType: ReactionClassificationResult, reactants: any[], products: any[]): Promise<any>;
    /**
     * Analyze the structural characteristics of a reaction
     */
    private analyzeReactionCharacteristics;
    /**
     * Determine the primary reaction type based on patterns
     */
    private determineReactionType;
    /**
     * Get optimal animation style based on reaction type and characteristics
     */
    private getOptimalAnimationStyle;
    /**
     * Extract compounds from equation string
     */
    private extractCompounds;
    /**
     * Check if compounds contain oxygen
     */
    private containsOxygen;
    /**
     * Check if compounds contain combustible fuel
     */
    private containsCombustibleFuel;
    /**
     * Check if compounds contain ions (simplified check)
     */
    private containsIons;
    /**
     * Determine if reaction is exothermic (simplified heuristics)
     */
    private isExothermic;
    /**
     * Check if reaction produces gas
     */
    private producesGas;
    /**
     * Check if reaction forms precipitate
     */
    private formsPrecipitate;
    /**
     * Check if reaction is acid-base
     */
    private isAcidBaseReaction;
    /**
     * Check if reaction is single replacement
     */
    private isSingleReplacement;
    /**
     * Check if reaction is double replacement
     */
    private isDoubleReplacement;
    /**
     * Check if reaction is redox (simplified)
     */
    private isRedoxReaction;
    /**
     * Calculate confidence score for classification
     */
    private calculateConfidence;
    /**
     * Generate human-readable reasoning for classification
     */
    private generateReasoning;
    /**
     * Get default animation style
     */
    private getDefaultAnimationStyle;
    /**
     * Get default characteristics
     */
    private getDefaultCharacteristics;
}
//# sourceMappingURL=ReactionClassifier.d.ts.map