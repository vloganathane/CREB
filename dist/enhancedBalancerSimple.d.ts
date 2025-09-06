/**
 * Enhanced Chemical Equation Balancer with Advanced TypeScript Support
 * Simplified version that provides compound analysis and type safety
 */
/**
 * Enhanced chemical compound information
 */
export interface EnhancedCompoundInfo {
    formula: string;
    molarMass: number;
    elements: string[];
    elementCount: Record<string, number>;
}
/**
 * Enhanced balanced equation result with compound analysis
 */
export interface EnhancedBalanceResult {
    equation: string;
    isBalanced: boolean;
    compounds: EnhancedCompoundInfo[];
    coefficients?: number[];
    reactants?: string[];
    products?: string[];
}
/**
 * Enhanced balancer with type-safe compound analysis
 */
export declare class EnhancedBalancer {
    private balancer;
    constructor();
    /**
     * Balance equation with enhanced compound information
     */
    balance(equation: string): EnhancedBalanceResult;
    /**
     * Analyze a single compound for detailed information
     */
    private analyzeCompound;
    /**
     * Calculate molar mass from element count
     */
    private calculateMolarMass;
    /**
     * Simple formula validation
     */
    private isValidFormula;
}
//# sourceMappingURL=enhancedBalancerSimple.d.ts.map