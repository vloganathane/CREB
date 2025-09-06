/**
 * Enhanced Chemical Equation Balancer with Advanced TypeScript Support
 * Provides superior type safety and IntelliSense support
 */
import { ChemicalFormula, TypedElementCount, TypedBalancedEquation, TypedCompound, TypedReaction, ReactionType, PhaseState, ChemicalFormulaError, EquationBalancingError } from './advancedTypes';
/**
 * Enhanced Chemical Equation Balancer with Advanced TypeScript Support
 */
export declare class TypeSafeChemicalEquationBalancer {
    private readonly baseBalancer;
    constructor();
    /**
     * Parse and validate chemical formulas with type safety
     */
    parseFormula<T extends string>(formula: T): T extends string ? TypedElementCount : never;
    /**
     * Balance equation with enhanced type safety
     */
    balance<TReactants extends string, TProducts extends string>(equation: string): TypedBalancedEquation;
    /**
     * Create a typed compound with validation
     */
    createCompound<T extends ChemicalFormula>(formula: T, options?: {
        name?: string;
        phase?: PhaseState;
        coefficient?: number;
    }): TypedCompound<T>;
    /**
     * Create a typed reaction with validation
     */
    createReaction<TReactants extends ChemicalFormula, TProducts extends ChemicalFormula>(reactants: TypedCompound<TReactants>[], products: TypedCompound<TProducts>[], options?: {
        type?: ReactionType;
        conditions?: {
            temperature?: number;
            pressure?: number;
            catalyst?: string;
            solvent?: string;
        };
    }): TypedReaction<TReactants, TProducts>;
    /**
     * Auto-classify reaction type based on reactants and products
     */
    private classifyReactionType;
    /**
     * Calculate molar mass from element count
     */
    private calculateMolarMass;
    /**
     * Validate chemical equation syntax
     */
    validateEquation(equation: string): {
        isValid: boolean;
        errors: string[];
        warnings: string[];
    };
}
export { TypeSafeChemicalEquationBalancer as EnhancedBalancer, type TypedBalancedEquation as EnhancedBalancedEquation, type TypedCompound as EnhancedCompound, type TypedReaction as EnhancedReaction, ChemicalFormulaError, EquationBalancingError };
//# sourceMappingURL=enhancedBalancerV2.d.ts.map