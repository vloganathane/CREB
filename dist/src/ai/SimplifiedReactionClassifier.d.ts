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
export declare class ReactionClassifier {
    private modelVersion;
    constructor();
    /**
     * Classify a chemical reaction using rule-based AI
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
     * Extract compounds from equation
     */
    private extractCompounds;
    /**
     * Determine reaction type based on characteristics
     */
    private determineReactionType;
    /**
     * Helper methods for compound analysis
     */
    private containsOxygen;
    private containsCombustibleFuel;
    private containsIons;
    private isExothermic;
    private producesGas;
    private formsPrecipitate;
    private hasElementalMetal;
    /**
     * Calculate confidence based on characteristics
     */
    private calculateConfidence;
    /**
     * Generate reasoning for classification
     */
    private generateReasoning;
    /**
     * Get animation style based on reaction type
     */
    private getAnimationStyle;
    private getDefaultAnimationStyle;
    private getDefaultCharacteristics;
}
//# sourceMappingURL=SimplifiedReactionClassifier.d.ts.map