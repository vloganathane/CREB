/**
 * Constants for PubChem API
 * Based on the original PubChemPy implementation
 */
export declare const API_BASE = "https://pubchem.ncbi.nlm.nih.gov/rest/pug";
export declare const ELEMENTS: Record<number, string>;
export declare const PROPERTY_MAP: Record<string, string>;
export declare const BOND_ORDER_MAP: Record<number, string>;
export declare const DEFAULT_CONFIG: {
    baseURL: string;
    timeout: number;
    retries: number;
    rateLimitDelay: number;
    cache: {
        ttl: number;
        maxSize: number;
        persistent: boolean;
    };
};
//# sourceMappingURL=constants.d.ts.map