/**
 * Type definitions for the CREB library
 */

export interface ElementCount {
  [element: string]: number;
}

export interface ParsedSpecies {
  [species: string]: ElementCount;
}

export interface EquationData {
  reactants: string[];
  products: string[];
  parsedReactants: ParsedSpecies;
  parsedProducts: ParsedSpecies;
}

export interface BalancedEquation {
  equation: string;
  coefficients: number[];
  reactants: string[];
  products: string[];
}

export interface SpeciesData {
  moles: number;
  grams: number;
  molarWeight: number;
}

export interface StoichiometryResult {
  reactants: Record<string, SpeciesData>;
  products: Record<string, SpeciesData>;
  totalMolarMass: {
    reactants: number;
    products: number;
  };
}

export interface LinearEquation {
  coefficients: number[];
  constant: number;
}

export interface LinearSystem {
  equations: LinearEquation[];
  variables: string[];
}
