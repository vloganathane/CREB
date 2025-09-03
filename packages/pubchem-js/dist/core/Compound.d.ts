/**
 * PubChem Compound class - JavaScript port of PubChemPy
 * Represents a chemical compound with properties and methods
 */
import { CompoundRecord, AtomData, BondData } from '../types/index';
import { HTTPClient } from '../utils/httpClient';
export declare class Compound {
    private record;
    private _atoms?;
    private _bonds?;
    private httpClient;
    constructor(record: CompoundRecord, httpClient?: HTTPClient);
    static fromCid(cid: number, httpClient?: HTTPClient): Promise<Compound>;
    static fromName(name: string, httpClient?: HTTPClient): Promise<Compound[]>;
    static fromSmiles(smiles: string, httpClient?: HTTPClient): Promise<Compound[]>;
    get cid(): number;
    get molecularFormula(): string | null;
    get molecularWeight(): number | null;
    get smiles(): string | null;
    get isomericSmiles(): string | null;
    get inchi(): string | null;
    get inchiKey(): string | null;
    get iupacName(): string | null;
    get xlogp(): number | null;
    get exactMass(): number | null;
    get monoisotopicMass(): number | null;
    get tpsa(): number | null;
    get complexity(): number | null;
    get charge(): number | null;
    get hBondDonorCount(): number | null;
    get hBondAcceptorCount(): number | null;
    get rotatableBondCount(): number | null;
    get heavyAtomCount(): number | null;
    get fingerprint(): string | null;
    get atoms(): AtomData[];
    get bonds(): BondData[];
    getSynonyms(): Promise<string[]>;
    toDict(properties?: string[]): Record<string, any>;
    get record_(): CompoundRecord;
}
//# sourceMappingURL=Compound.d.ts.map