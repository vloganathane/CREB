/**
 * Types for PubChem compound records and API responses
 * Based on PubChem PUG REST API JSON format
 */

// Core identifier types
export type Namespace = 'cid' | 'name' | 'smiles' | 'inchi' | 'inchikey' | 'formula' | 'sdf';
export type SearchType = 'substructure' | 'superstructure' | 'similarity' | 'identity';
export type Domain = 'compound' | 'substance' | 'assay';

// Basic compound record structure from PubChem API
export interface CompoundRecord {
  id: {
    id: {
      cid: number;
    };
  };
  atoms?: {
    aid: number[];
    element: number[];
    charge?: Array<{ aid: number; value: number }>;
  };
  bonds?: {
    aid1: number[];
    aid2: number[];
    order: number[];
  };
  coords?: Array<{
    type: number[];
    aid: number[];
    conformers: Array<{
      x: number[];
      y: number[];
      z?: number[];
      data?: Array<{
        urn: {
          label: string;
          name?: string;
          datatype?: number;
          implementation?: string;
        };
        value: any;
      }>;
    }>;
  }>;
  props?: Array<{
    urn: {
      label: string;
      name?: string;
      datatype?: number;
      implementation?: string;
    };
    value: any;
  }>;
}

// Property data structure
export interface PropertyData {
  CID: number;
  MolecularFormula?: string;
  MolecularWeight?: number;
  CanonicalSMILES?: string;
  IsomericSMILES?: string;
  InChI?: string;
  InChIKey?: string;
  IUPACName?: string;
  XLogP?: number;
  ExactMass?: number;
  MonoisotopicMass?: number;
  TPSA?: number;
  Complexity?: number;
  Charge?: number;
  HBondDonorCount?: number;
  HBondAcceptorCount?: number;
  RotatableBondCount?: number;
  HeavyAtomCount?: number;
  IsotopeAtomCount?: number;
  AtomStereoCount?: number;
  DefinedAtomStereoCount?: number;
  UndefinedAtomStereoCount?: number;
  BondStereoCount?: number;
  DefinedBondStereoCount?: number;
  UndefinedBondStereoCount?: number;
  CovalentUnitCount?: number;
}

// API response structures
export interface CompoundSearchResponse {
  PC_Compounds?: CompoundRecord[];
}

export interface PropertySearchResponse {
  PropertyTable?: {
    Properties: PropertyData[];
  };
}

export interface SynonymResponse {
  InformationList?: {
    Information: Array<{
      CID: number;
      Synonym: string[];
    }>;
  };
}

export interface CIDResponse {
  IdentifierList?: {
    CID: number[];
  };
}

// Error types
export interface PubChemError {
  Fault: {
    Code: string;
    Message: string;
    Details?: string[];
  };
}

// Atom and Bond types
export interface AtomData {
  aid: number;
  element: string;
  x?: number;
  y?: number;
  z?: number;
  charge?: number;
}

export interface BondData {
  aid1: number;
  aid2: number;
  order: 'single' | 'double' | 'triple' | 'aromatic' | 'quadruple';
}

// Search options
export interface SearchOptions {
  searchtype?: SearchType;
  listkey_count?: number;
  listkey_start?: number;
  as_dataframe?: boolean;
  [key: string]: any; // Additional query parameters
}

// Cache options
export interface CacheOptions {
  ttl?: number;        // Time to live in milliseconds (default: 24 hours)
  maxSize?: number;    // Maximum cache entries (default: 1000)
  persistent?: boolean; // Persist to localStorage (default: false)
}

// HTTP client options
export interface HTTPClientOptions {
  baseURL?: string;
  timeout?: number;
  retries?: number;
  rateLimitDelay?: number;
}
