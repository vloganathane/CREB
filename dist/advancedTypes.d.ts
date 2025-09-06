/**
 * Advanced TypeScript Support for CREB Library
 * Enhanced type definitions with generic constraints and branded types
 * Provides superior IntelliSense and type safety for chemical data structures
 */
/**
 * Branded type for chemical formulas ensuring compile-time validation
 */
export type ChemicalFormula = string & {
    readonly __brand: 'ChemicalFormula';
};
/**
 * Branded type for valid element symbols
 */
export type ElementSymbol = string & {
    readonly __brand: 'ElementSymbol';
};
/**
 * Branded type for balanced chemical equations
 */
export type BalancedEquationString = string & {
    readonly __brand: 'BalancedEquation';
};
/**
 * Branded type for SMILES notation
 */
export type SMILESNotation = string & {
    readonly __brand: 'SMILES';
};
/**
 * Branded type for InChI notation
 */
export type InChINotation = string & {
    readonly __brand: 'InChI';
};
/**
 * Branded type for CAS numbers
 */
export type CASNumber = string & {
    readonly __brand: 'CAS';
};
/**
 * Type constraint for valid chemical elements (Periodic Table)
 */
export type ValidElement = 'H' | 'He' | 'Li' | 'Be' | 'B' | 'C' | 'N' | 'O' | 'F' | 'Ne' | 'Na' | 'Mg' | 'Al' | 'Si' | 'P' | 'S' | 'Cl' | 'Ar' | 'K' | 'Ca' | 'Sc' | 'Ti' | 'V' | 'Cr' | 'Mn' | 'Fe' | 'Co' | 'Ni' | 'Cu' | 'Zn' | 'Ga' | 'Ge' | 'As' | 'Se' | 'Br' | 'Kr' | 'Rb' | 'Sr' | 'Y' | 'Zr' | 'Nb' | 'Mo' | 'Tc' | 'Ru' | 'Rh' | 'Pd' | 'Ag' | 'Cd' | 'In' | 'Sn' | 'Sb' | 'Te' | 'I' | 'Xe' | 'Cs' | 'Ba' | 'La' | 'Ce' | 'Pr' | 'Nd' | 'Pm' | 'Sm' | 'Eu' | 'Gd' | 'Tb' | 'Dy' | 'Ho' | 'Er' | 'Tm' | 'Yb' | 'Lu' | 'Hf' | 'Ta' | 'W' | 'Re' | 'Os' | 'Ir' | 'Pt' | 'Au' | 'Hg' | 'Tl' | 'Pb' | 'Bi' | 'Po' | 'At' | 'Rn' | 'Fr' | 'Ra' | 'Ac' | 'Th' | 'Pa' | 'U' | 'Np' | 'Pu' | 'Am' | 'Cm' | 'Bk' | 'Cf' | 'Es' | 'Fm' | 'Md' | 'No' | 'Lr' | 'Rf' | 'Db' | 'Sg' | 'Bh' | 'Hs' | 'Mt' | 'Ds' | 'Rg' | 'Cn' | 'Nh' | 'Fl' | 'Mc' | 'Lv' | 'Ts' | 'Og';
/**
 * Generic element count with typed element symbols
 */
/**
 * Type-safe element count with generic constraints for elements
 */
export type TypedElementCount<T extends ValidElement = ValidElement> = {
    [K in T]?: number;
};
/**
 * Generic compound composition with strict typing
 */
export type CompoundComposition<T extends ValidElement = ValidElement> = {
    readonly elements: TypedElementCount<T>;
    readonly molecularWeight: number;
    readonly formula: ChemicalFormula;
};
/**
 * Type guard for chemical formulas
 */
export declare function isChemicalFormula(value: string): value is ChemicalFormula;
/**
 * Type guard for element symbols
 */
export declare function isElementSymbol(value: string): value is ElementSymbol;
/**
 * Type guard for balanced equations
 */
export declare function isBalancedEquation(value: string): value is BalancedEquationString;
/**
 * Enhanced equation data with strict typing
 */
export interface TypedEquationData<TElements extends ValidElement = ValidElement> {
    readonly reactants: readonly ChemicalFormula[];
    readonly products: readonly ChemicalFormula[];
    readonly parsedReactants: Record<ChemicalFormula, TypedElementCount<TElements>>;
    readonly parsedProducts: Record<ChemicalFormula, TypedElementCount<TElements>>;
    readonly elements: readonly TElements[];
}
/**
 * Enhanced balanced equation with type safety
 */
export interface TypedBalancedEquation<TElements extends ValidElement = ValidElement> {
    readonly equation: BalancedEquationString;
    readonly coefficients: readonly number[];
    readonly reactants: readonly ChemicalFormula[];
    readonly products: readonly ChemicalFormula[];
    readonly elementalBalance: Record<TElements, number>;
    readonly isBalanced: true;
}
/**
 * Type-safe species data with enhanced properties
 */
export interface TypedSpeciesData<TFormula extends ChemicalFormula = ChemicalFormula> {
    readonly formula: TFormula;
    readonly moles: number;
    readonly grams: number;
    readonly molarWeight: number;
    readonly percentage: number;
    readonly composition: CompoundComposition;
}
/**
 * Enhanced stoichiometry result with strict typing
 */
export interface TypedStoichiometryResult<TReactants extends ChemicalFormula = ChemicalFormula, TProducts extends ChemicalFormula = ChemicalFormula> {
    readonly reactants: Record<TReactants, TypedSpeciesData<TReactants>>;
    readonly products: Record<TProducts, TypedSpeciesData<TProducts>>;
    readonly totalMolarMass: {
        readonly reactants: number;
        readonly products: number;
    };
    readonly massBalance: number;
    readonly equation: TypedBalancedEquation;
}
/**
 * Reaction type classification with literal types
 */
export type ReactionType = 'synthesis' | 'decomposition' | 'single-replacement' | 'double-replacement' | 'combustion' | 'acid-base' | 'redox' | 'precipitation' | 'complex-formation';
/**
 * Phase state with literal types
 */
export type PhaseState = 'solid' | 'liquid' | 'gas' | 'aqueous' | 'plasma';
/**
 * Enhanced compound with phase information
 */
export interface TypedCompound<TFormula extends ChemicalFormula = ChemicalFormula> {
    readonly formula: TFormula;
    readonly name?: string;
    readonly phase?: PhaseState;
    readonly coefficient: number;
    readonly composition: CompoundComposition;
    readonly properties?: Readonly<{
        molarMass: number;
        density?: number;
        meltingPoint?: number;
        boilingPoint?: number;
    }>;
}
/**
 * Type-safe reaction with enhanced metadata
 */
export interface TypedReaction<TReactants extends ChemicalFormula = ChemicalFormula, TProducts extends ChemicalFormula = ChemicalFormula> {
    readonly reactants: readonly TypedCompound<TReactants>[];
    readonly products: readonly TypedCompound<TProducts>[];
    readonly type: ReactionType;
    readonly isBalanced: boolean;
    readonly balancedEquation?: TypedBalancedEquation;
    readonly conditions?: Readonly<{
        temperature?: number;
        pressure?: number;
        catalyst?: string;
        solvent?: string;
    }>;
}
/**
 * Extract element types from a chemical formula (compile-time)
 */
export type ExtractElements<T extends string> = T extends `${infer Element}${infer Rest}` ? Element extends ValidElement ? Element | ExtractElements<Rest> : ExtractElements<Rest> : never;
/**
 * Conditional type for organic vs inorganic compounds
 */
export type CompoundCategory<T extends ChemicalFormula> = T extends ChemicalFormula ? ExtractElements<T> extends 'C' ? 'organic' : 'inorganic' : never;
/**
 * Helper type for reaction participants
 */
export type ReactionParticipants<T extends TypedReaction> = T extends TypedReaction<infer R, infer P> ? R | P : never;
/**
 * Create a chemical formula with compile-time validation
 */
export declare function createChemicalFormula(formula: string): ChemicalFormula;
/**
 * Create an element symbol with validation
 */
export declare function createElementSymbol(symbol: string): ElementSymbol;
/**
 * Template literal type for common chemical formulas
 */
export type CommonFormulas = 'H2O' | 'CO2' | 'O2' | 'N2' | 'H2' | 'CH4' | 'C2H6' | 'C2H4' | 'C2H2' | 'NH3' | 'HCl' | 'H2SO4' | 'NaOH' | 'Ca(OH)2' | 'CaCO3' | 'NaCl' | 'C6H12O6' | 'C6H6' | 'C2H5OH' | 'CH3COOH' | 'C8H18';
/**
 * Auto-completion helper for common chemical formulas
 */
export type FormulaAutoComplete<T extends string> = T extends CommonFormulas ? T : T extends `${CommonFormulas}${string}` ? T : string;
/**
 * Constraint for balanced chemical equations
 */
export interface BalancedEquationConstraint<T extends TypedReaction> {
    readonly reaction: T;
    readonly verify: T['isBalanced'] extends true ? true : false;
}
/**
 * Constraint for mass conservation
 */
export interface MassConservationConstraint<T extends TypedStoichiometryResult> {
    readonly result: T;
    readonly conserved: T['massBalance'] extends 1.0 ? true : false;
}
/**
 * Parse a chemical formula into element counts
 */
export declare function parseFormula(formula: ChemicalFormula): TypedElementCount;
/**
 * Type-safe error for chemical formula validation
 */
export declare class ChemicalFormulaError extends Error {
    readonly formula: string;
    readonly reason: 'invalid-syntax' | 'unknown-element' | 'invalid-structure';
    constructor(formula: string, reason: 'invalid-syntax' | 'unknown-element' | 'invalid-structure');
}
/**
 * Type-safe error for equation balancing
 */
export declare class EquationBalancingError extends Error {
    readonly equation: string;
    readonly reason: 'impossible-balance' | 'invalid-reactants' | 'invalid-products';
    constructor(equation: string, reason: 'impossible-balance' | 'invalid-reactants' | 'invalid-products');
}
export { type TypedElementCount as ElementCount, type TypedEquationData as EquationData, type TypedBalancedEquation as BalancedEquation, type TypedSpeciesData as SpeciesData, type TypedStoichiometryResult as StoichiometryResult, type TypedCompound as Compound, type TypedReaction as Reaction };
//# sourceMappingURL=advancedTypes.d.ts.map