/**
 * Types for PubChem compound records and API responses
 * Based on PubChem PUG REST API JSON format
 */
export type Namespace = 'cid' | 'name' | 'smiles' | 'inchi' | 'inchikey' | 'formula' | 'sdf';
export type SearchType = 'substructure' | 'superstructure' | 'similarity' | 'identity';
export type Domain = 'compound' | 'substance' | 'assay';
export interface CompoundRecord {
    id: {
        id: {
            cid: number;
        };
    };
    atoms?: {
        aid: number[];
        element: number[];
        charge?: Array<{
            aid: number;
            value: number;
        }>;
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
export interface PubChemError {
    Fault: {
        Code: string;
        Message: string;
        Details?: string[];
    };
}
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
export interface SearchOptions {
    searchtype?: SearchType;
    listkey_count?: number;
    listkey_start?: number;
    as_dataframe?: boolean;
    [key: string]: any;
}
export interface CacheOptions {
    ttl?: number;
    maxSize?: number;
    persistent?: boolean;
}
export interface HTTPClientOptions {
    baseURL?: string;
    timeout?: number;
    retries?: number;
    rateLimitDelay?: number;
}
//# sourceMappingURL=index.d.ts.map