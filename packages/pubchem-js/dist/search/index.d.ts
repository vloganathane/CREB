/**
 * Search functions for PubChem compounds
 * JavaScript port of PubChemPy search functionality
 */
import { Namespace, SearchOptions, PropertyData } from '../types/index';
import { HTTPClient } from '../utils/httpClient';
import { Compound } from '../core/Compound';
/**
 * Get compounds by identifier
 */
export declare function getCompounds(identifier: string | number | Array<string | number>, namespace?: Namespace, options?: SearchOptions, httpClient?: HTTPClient): Promise<Compound[]>;
/**
 * Get specific properties for compounds
 */
export declare function getProperties(properties: string | string[], identifier: string | number | Array<string | number>, namespace?: Namespace, options?: SearchOptions, httpClient?: HTTPClient): Promise<PropertyData[]>;
/**
 * Get synonyms for a compound
 */
export declare function getSynonyms(identifier: string | number | Array<string | number>, namespace?: Namespace, httpClient?: HTTPClient): Promise<Array<{
    cid: number;
    synonyms: string[];
}>>;
/**
 * Get CIDs for given identifiers
 */
export declare function getCids(identifier: string | number | Array<string | number>, namespace?: Namespace, options?: SearchOptions, httpClient?: HTTPClient): Promise<number[]>;
/**
 * Search compounds by molecular formula
 */
export declare function getCompoundsByFormula(formula: string, options?: SearchOptions, httpClient?: HTTPClient): Promise<Compound[]>;
/**
 * Search compounds by SMILES
 */
export declare function getCompoundsBySmiles(smiles: string, options?: SearchOptions, httpClient?: HTTPClient): Promise<Compound[]>;
/**
 * Search compounds by InChI
 */
export declare function getCompoundsByInchi(inchi: string, options?: SearchOptions, httpClient?: HTTPClient): Promise<Compound[]>;
/**
 * Search compounds by name
 */
export declare function getCompoundsByName(name: string, options?: SearchOptions, httpClient?: HTTPClient): Promise<Compound[]>;
/**
 * Get SDF (Structure Data Format) for a compound
 * Returns the 3D structure data as a string
 */
export declare function getSdf(identifier: string | number, namespace?: Namespace, httpClient?: HTTPClient): Promise<string>;
/**
 * Get multiple formats for a compound (JSON metadata + SDF structure)
 * Returns both structured data and 3D structure in one call
 */
export declare function getCompoundWithSdf(identifier: string | number, namespace?: Namespace, httpClient?: HTTPClient): Promise<{
    compound: Compound;
    sdf: string;
}>;
/**
 * Set the default HTTP client for all search functions
 */
export declare function setDefaultHttpClient(client: HTTPClient): void;
/**
 * Get the current default HTTP client
 */
export declare function getDefaultHttpClient(): HTTPClient;
//# sourceMappingURL=index.d.ts.map