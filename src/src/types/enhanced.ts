/**
 * Enhanced TypeScript Support for CREB-JS
 * Advanced type definitions with generic constraints and better IntelliSense
 * Part of Q4 2025 Developer Experience improvements
 */

// Generic constraints for chemical formulas
export type ChemicalElement = 
  | 'H' | 'He' | 'Li' | 'Be' | 'B' | 'C' | 'N' | 'O' | 'F' | 'Ne'
  | 'Na' | 'Mg' | 'Al' | 'Si' | 'P' | 'S' | 'Cl' | 'Ar' | 'K' | 'Ca'
  | 'Sc' | 'Ti' | 'V' | 'Cr' | 'Mn' | 'Fe' | 'Co' | 'Ni' | 'Cu' | 'Zn'
  | 'Ga' | 'Ge' | 'As' | 'Se' | 'Br' | 'Kr' | 'Rb' | 'Sr' | 'Y' | 'Zr'
  | 'Nb' | 'Mo' | 'Tc' | 'Ru' | 'Rh' | 'Pd' | 'Ag' | 'Cd' | 'In' | 'Sn'
  | 'Sb' | 'Te' | 'I' | 'Xe' | 'Cs' | 'Ba' | 'La' | 'Ce' | 'Pr' | 'Nd'
  | 'Pm' | 'Sm' | 'Eu' | 'Gd' | 'Tb' | 'Dy' | 'Ho' | 'Er' | 'Tm' | 'Yb'
  | 'Lu' | 'Hf' | 'Ta' | 'W' | 'Re' | 'Os' | 'Ir' | 'Pt' | 'Au' | 'Hg'
  | 'Tl' | 'Pb' | 'Bi' | 'Po' | 'At' | 'Rn' | 'Fr' | 'Ra' | 'Ac' | 'Th'
  | 'Pa' | 'U' | 'Np' | 'Pu' | 'Am' | 'Cm' | 'Bk' | 'Cf' | 'Es' | 'Fm'
  | 'Md' | 'No' | 'Lr' | 'Rf' | 'Db' | 'Sg' | 'Bh' | 'Hs' | 'Mt' | 'Ds'
  | 'Rg' | 'Cn' | 'Nh' | 'Fl' | 'Mc' | 'Lv' | 'Ts' | 'Og';

// Type-safe chemical formula validation
export type ValidChemicalFormula<T extends string> = T extends `${infer Element}${infer Rest}`
  ? Element extends ChemicalElement
    ? Rest extends ''
      ? T
      : Rest extends `${number}${infer Remaining}`
        ? ValidChemicalFormula<Remaining>
        : ValidChemicalFormula<Rest>
    : never
  : T extends ''
    ? T
    : never;

// Generic chemical data structures with constraints
export interface TypeSafeCompound<TFormula extends string = string> {
  readonly formula: ValidChemicalFormula<TFormula>;
  readonly name: string;
  readonly molecularWeight: number;
  readonly phase: 'solid' | 'liquid' | 'gas' | 'aqueous';
  readonly smiles?: string;
  readonly inchi?: string;
}

// Enhanced equation balancing with type safety
export interface TypeSafeEquation<
  TReactants extends readonly string[] = readonly string[],
  TProducts extends readonly string[] = readonly string[]
> {
  readonly reactants: {
    readonly [K in keyof TReactants]: {
      readonly formula: ValidChemicalFormula<TReactants[K]>;
      readonly coefficient: number;
    };
  };
  readonly products: {
    readonly [K in keyof TProducts]: {
      readonly formula: ValidChemicalFormula<TProducts[K]>;
      readonly coefficient: number;
    };
  };
}

// Generic result types with IntelliSense support
export interface EnhancedBalanceResult<
  TReactants extends readonly string[] = readonly string[],
  TProducts extends readonly string[] = readonly string[]
> {
  readonly equation: TypeSafeEquation<TReactants, TProducts>;
  readonly balanced: string;
  readonly isBalanced: boolean;
  readonly coefficients: readonly number[];
  readonly molarMasses: {
    readonly [K in keyof TReactants | keyof TProducts]: number;
  };
  readonly stoichiometry: {
    readonly calculate: <TTarget extends TReactants[number] | TProducts[number]>(
      target: TTarget,
      amount: number,
      unit: 'mol' | 'g' | 'L'
    ) => {
      readonly species: TTarget;
      readonly amount: number;
      readonly unit: string;
      readonly conversions: Record<string, number>;
    };
  };
}

// Type-safe thermodynamics with unit validation
export type TemperatureUnit = 'K' | 'C' | 'F';
export type PressureUnit = 'Pa' | 'atm' | 'bar' | 'mmHg' | 'torr';
export type EnergyUnit = 'J' | 'kJ' | 'cal' | 'kcal' | 'eV';

export interface TypeSafeThermodynamics<
  TTemp extends TemperatureUnit = 'K',
  TPress extends PressureUnit = 'Pa',
  TEnergy extends EnergyUnit = 'kJ'
> {
  readonly temperature: {
    readonly value: number;
    readonly unit: TTemp;
  };
  readonly pressure: {
    readonly value: number;
    readonly unit: TPress;
  };
  readonly deltaH: {
    readonly value: number;
    readonly unit: TEnergy;
  };
  readonly deltaS: {
    readonly value: number;
    readonly unit: `${TEnergy}/${TTemp}`;
  };
  readonly deltaG: {
    readonly value: number;
    readonly unit: TEnergy;
  };
}

// Advanced molecular structure types
export interface MolecularAtom {
  readonly element: ChemicalElement;
  readonly position: readonly [x: number, y: number, z: number];
  readonly charge?: number;
  readonly hybridization?: 'sp' | 'sp2' | 'sp3' | 'sp3d' | 'sp3d2';
}

export interface MolecularBond {
  readonly atom1: number;
  readonly atom2: number;
  readonly order: 1 | 2 | 3 | 1.5; // 1.5 for aromatic
  readonly type: 'single' | 'double' | 'triple' | 'aromatic';
  readonly stereo?: 'up' | 'down' | 'either';
}

export interface TypeSafeMolecularStructure<TFormula extends string = string> {
  readonly formula: ValidChemicalFormula<TFormula>;
  readonly atoms: readonly MolecularAtom[];
  readonly bonds: readonly MolecularBond[];
  readonly properties: {
    readonly molecularWeight: number;
    readonly exactMass: number;
    readonly logP?: number;
    readonly polarSurfaceArea?: number;
  };
  readonly geometry: {
    readonly boundingBox: {
      readonly min: readonly [number, number, number];
      readonly max: readonly [number, number, number];
    };
    readonly centerOfMass: readonly [number, number, number];
  };
}

// Utility types for better IntelliSense
export type ExtractFormula<T> = T extends TypeSafeCompound<infer F> ? F : never;
export type ExtractElements<T extends string> = T extends `${infer E}${infer Rest}`
  ? E extends ChemicalElement
    ? E | ExtractElements<Rest>
    : ExtractElements<Rest>
  : never;

// Helper functions with advanced type inference
export declare function createCompound<T extends string>(
  formula: ValidChemicalFormula<T>
): TypeSafeCompound<T>;

export declare function balanceEquation<
  TReactants extends readonly string[],
  TProducts extends readonly string[]
>(
  reactants: { readonly [K in keyof TReactants]: ValidChemicalFormula<TReactants[K]> },
  products: { readonly [K in keyof TProducts]: ValidChemicalFormula<TProducts[K]> }
): EnhancedBalanceResult<TReactants, TProducts>;

export declare function calculateThermodynamics<
  TTemp extends TemperatureUnit = 'K',
  TPress extends PressureUnit = 'Pa',
  TEnergy extends EnergyUnit = 'kJ'
>(
  conditions: {
    readonly temperature: { readonly value: number; readonly unit: TTemp };
    readonly pressure: { readonly value: number; readonly unit: TPress };
  }
): TypeSafeThermodynamics<TTemp, TPress, TEnergy>;

// Template literal types for chemical equations
export type ChemicalEquation = `${string} -> ${string}` | `${string} = ${string}`;

export type ParseEquation<T extends ChemicalEquation> = T extends `${infer Left} -> ${infer Right}`
  ? { reactants: Left; products: Right; arrow: '->' }
  : T extends `${infer Left} = ${infer Right}`
  ? { reactants: Left; products: Right; arrow: '=' }
  : never;

// Conditional types for chemical validation
export type IsValidElement<T extends string> = T extends ChemicalElement ? true : false;
export type IsOrganic<T extends string> = T extends `${string}C${string}` ? true : false;
export type ContainsElement<T extends string, E extends ChemicalElement> = 
  T extends `${string}${E}${string}` ? true : false;

// Branded types for enhanced type safety
export type MolarMass = number & { readonly __brand: 'MolarMass' };
export type Temperature = number & { readonly __brand: 'Temperature' };
export type Pressure = number & { readonly __brand: 'Pressure' };
export type Concentration = number & { readonly __brand: 'Concentration' };

// Advanced computation types
export interface ComputationContext {
  readonly precision: number;
  readonly maxIterations: number;
  readonly convergenceTolerance: number;
  readonly temperature: Temperature;
  readonly pressure: Pressure;
}

export interface TypeSafeComputationResult<T = unknown> {
  readonly value: T;
  readonly error?: Error;
  readonly warnings: readonly string[];
  readonly metadata: {
    readonly computationTime: number;
    readonly iterations: number;
    readonly converged: boolean;
  };
}
