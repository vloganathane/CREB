/**
 * PubChem Integration Module for CREB Molecular Visualization
 * Connects PubChem database with RDKit.js and 3Dmol.js visualization pipeline
 */
export interface PubChemCompound {
    cid: number;
    name: string;
    molecularFormula: string;
    molecularWeight: number;
    smiles?: string;
    inchi?: string;
    inchiKey?: string;
    synonyms?: string[];
    properties?: Record<string, any>;
}
export interface CompoundSearchOptions {
    searchType: 'name' | 'cid' | 'smiles' | 'formula' | 'inchi';
    limit?: number;
    maxResults?: number;
    includeProperties?: boolean;
    includeSynonyms?: boolean;
    include3D?: boolean;
}
export interface PubChemSearchResult {
    success: boolean;
    compounds: PubChemCompound[];
    totalFound: number;
    source: 'pubchem';
    timestamp: Date;
    error?: string;
}
export interface PubChemMolecularData {
    compound: PubChemCompound;
    structure2D?: string;
    structure3D?: string;
    conformers?: Array<{
        id: number;
        energy: number;
        coordinates: Array<{
            x: number;
            y: number;
            z: number;
        }>;
    }>;
}
/**
 * PubChem Integration Class
 * Provides unified access to PubChem database for molecular visualization
 */
export declare class PubChemIntegration {
    private baseUrl;
    private requestDelay;
    private lastRequestTime;
    constructor();
    /**
     * Search for compounds by various criteria
     */
    searchCompounds(query: string, options?: CompoundSearchOptions): Promise<PubChemSearchResult>;
    /**
     * Get detailed compound information by CID
     */
    getCompoundByCid(cid: number, options?: CompoundSearchOptions): Promise<PubChemCompound | null>;
    /**
     * Get molecular structure data (2D/3D SDF)
     */
    getMolecularData(cid: number, include3D?: boolean): Promise<PubChemMolecularData | null>;
    /**
     * Search and get the best matching compound with full molecular data
     */
    searchAndGetMolecularData(query: string, options?: CompoundSearchOptions): Promise<PubChemMolecularData | null>;
    /**
     * Get compound synonyms
     */
    private getCompoundSynonyms;
    /**
     * Get detailed compound information for multiple CIDs
     */
    private getCompoundDetails;
    /**
     * Parse conformer data from PubChem response
     */
    private parseConformerData;
    /**
     * Enforce rate limiting for PubChem API
     */
    private enforceRateLimit;
    /**
     * Convert PubChem compound to SMILES for RDKit processing
     */
    getCompoundSMILES(compound: PubChemCompound): string | null;
    /**
     * Get compound 3D structure in SDF format for 3Dmol.js
     */
    getCompound3DSDF(cid: number): Promise<string | null>;
    /**
     * Validate if PubChem API is accessible
     */
    validateConnection(): Promise<boolean>;
}
export default PubChemIntegration;
//# sourceMappingURL=PubChemIntegration.d.ts.map