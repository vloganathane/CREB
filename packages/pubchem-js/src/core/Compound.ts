/**
 * PubChem Compound class - JavaScript port of PubChemPy
 * Represents a chemical compound with properties and methods
 */

import { CompoundRecord, AtomData, BondData } from '../types/index';
import { ELEMENTS, BOND_ORDER_MAP } from '../utils/constants';
import { HTTPClient } from '../utils/httpClient';

// Helper function to parse properties from compound record
function parseProperty(urn: any, props?: any[]): any {
  if (!props) return null;
  
  for (const prop of props) {
    if (prop.urn && prop.urn.label === urn.label) {
      if (urn.name && prop.urn.name !== urn.name) continue;
      if (urn.implementation && prop.urn.implementation !== urn.implementation) continue;
      
      // Handle different value types
      const value = prop.value;
      if (typeof value === 'object' && value !== null) {
        if ('sval' in value) return value.sval;
        if ('fval' in value) return value.fval;
        if ('ival' in value) return value.ival;
        if ('binary' in value) return value.binary;
      }
      return value;
    }
  }
  return null;
}

export class Compound {
  private _atoms?: AtomData[];
  private _bonds?: BondData[];
  private httpClient: HTTPClient;

  constructor(
    private record: CompoundRecord,
    httpClient?: HTTPClient
  ) {
    this.httpClient = httpClient || new HTTPClient();
  }

  // Static factory methods
  static async fromCid(cid: number, httpClient?: HTTPClient): Promise<Compound> {
    const client = httpClient || new HTTPClient();
    const url = `/compound/cid/${cid}/JSON`;
    
    try {
      const data = await client.get<{ PC_Compounds: CompoundRecord[] }>(url);
      if (!data.PC_Compounds || data.PC_Compounds.length === 0) {
        throw new Error(`No compound found for CID ${cid}`);
      }
      return new Compound(data.PC_Compounds[0], client);
    } catch (error: any) {
      throw new Error(`Failed to retrieve compound ${cid}: ${error.message}`);
    }
  }

  static async fromName(name: string, httpClient?: HTTPClient): Promise<Compound[]> {
    const client = httpClient || new HTTPClient();
    const encodedName = encodeURIComponent(name);
    const url = `/compound/name/${encodedName}/JSON`;
    
    try {
      const data = await client.get<{ PC_Compounds: CompoundRecord[] }>(url);
      if (!data.PC_Compounds || data.PC_Compounds.length === 0) {
        return [];
      }
      return data.PC_Compounds.map(record => new Compound(record, client));
    } catch (error: any) {
      if (error.name === 'PubChemNotFoundError') {
        return [];
      }
      throw new Error(`Failed to search for compound "${name}": ${error.message}`);
    }
  }

  static async fromSmiles(smiles: string, httpClient?: HTTPClient): Promise<Compound[]> {
    const client = httpClient || new HTTPClient();
    const encodedSmiles = encodeURIComponent(smiles);
    const url = `/compound/smiles/${encodedSmiles}/JSON`;
    
    try {
      const data = await client.get<{ PC_Compounds: CompoundRecord[] }>(url);
      if (!data.PC_Compounds || data.PC_Compounds.length === 0) {
        return [];
      }
      return data.PC_Compounds.map(record => new Compound(record, client));
    } catch (error: any) {
      if (error.name === 'PubChemNotFoundError') {
        return [];
      }
      throw new Error(`Failed to search for SMILES "${smiles}": ${error.message}`);
    }
  }

  // Basic identifiers
  get cid(): number {
    return this.record.id?.id?.cid;
  }

  // Molecular identifiers and properties
  get molecularFormula(): string | null {
    return parseProperty({ label: 'Molecular Formula' }, this.record.props);
  }

  get molecularWeight(): number | null {
    const weight = parseProperty({ label: 'Molecular Weight' }, this.record.props);
    return weight ? parseFloat(weight) : null;
  }

  get smiles(): string | null {
    return parseProperty({ label: 'SMILES', name: 'Canonical' }, this.record.props);
  }

  get isomericSmiles(): string | null {
    return parseProperty({ label: 'SMILES', name: 'Isomeric' }, this.record.props);
  }

  get inchi(): string | null {
    return parseProperty({ label: 'InChI' }, this.record.props);
  }

  get inchiKey(): string | null {
    return parseProperty({ label: 'InChI Key' }, this.record.props);
  }

  get iupacName(): string | null {
    return parseProperty({ label: 'IUPAC Name', name: 'Preferred' }, this.record.props) ||
           parseProperty({ label: 'IUPAC Name', name: 'Systematic' }, this.record.props) ||
           parseProperty({ label: 'IUPAC Name' }, this.record.props);
  }

  // Calculated properties
  get xlogp(): number | null {
    const value = parseProperty({ label: 'Log P' }, this.record.props);
    return value ? parseFloat(value) : null;
  }

  get exactMass(): number | null {
    const mass = parseProperty({ label: 'Mass', name: 'Exact' }, this.record.props);
    return mass ? parseFloat(mass) : null;
  }

  get monoisotopicMass(): number | null {
    const mass = parseProperty({ label: 'Mass', name: 'MonoIsotopic' }, this.record.props);
    return mass ? parseFloat(mass) : null;
  }

  get tpsa(): number | null {
    const tpsa = parseProperty({ label: 'Topological', name: 'Polar Surface Area' }, this.record.props);
    return tpsa ? parseFloat(tpsa) : null;
  }

  get complexity(): number | null {
    const comp = parseProperty({ label: 'Complexity' }, this.record.props);
    return comp ? parseFloat(comp) : null;
  }

  get charge(): number | null {
    const charge = parseProperty({ label: 'Charge' }, this.record.props);
    return charge ? parseInt(charge) : null;
  }

  // Structural properties
  get hBondDonorCount(): number | null {
    const count = parseProperty({ label: 'Count', name: 'Hydrogen Bond Donor' }, this.record.props);
    return count ? parseInt(count) : null;
  }

  get hBondAcceptorCount(): number | null {
    const count = parseProperty({ label: 'Count', name: 'Hydrogen Bond Acceptor' }, this.record.props);
    return count ? parseInt(count) : null;
  }

  get rotatableBondCount(): number | null {
    const count = parseProperty({ label: 'Count', name: 'Rotatable Bond' }, this.record.props);
    return count ? parseInt(count) : null;
  }

  get heavyAtomCount(): number | null {
    const count = parseProperty({ label: 'Count', name: 'Heavy Atom' }, this.record.props);
    return count ? parseInt(count) : null;
  }

  // Fingerprint for similarity calculations
  get fingerprint(): string | null {
    return parseProperty({ label: 'Fingerprint', implementation: 'E_SCREEN' }, this.record.props);
  }

  // Atom and bond data
  get atoms(): AtomData[] {
    if (this._atoms) return this._atoms;

    if (!this.record.atoms) return [];

    const aids = this.record.atoms.aid;
    const elements = this.record.atoms.element;
    
    this._atoms = aids.map((aid, index) => {
      const atom: AtomData = {
        aid,
        element: ELEMENTS[elements[index]] || 'Unknown',
      };

      // Add coordinates if available
      if (this.record.coords && this.record.coords[0]) {
        const coords = this.record.coords[0];
        const conformer = coords.conformers[0];
        const atomIndex = coords.aid.indexOf(aid);
        
        if (atomIndex !== -1) {
          atom.x = conformer.x[atomIndex];
          atom.y = conformer.y[atomIndex];
          if (conformer.z) {
            atom.z = conformer.z[atomIndex];
          }
        }
      }

      // Add charge if available
      if (this.record.atoms?.charge) {
        const chargeData = this.record.atoms.charge.find(c => c.aid === aid);
        if (chargeData) {
          atom.charge = chargeData.value;
        }
      }

      return atom;
    });

    return this._atoms;
  }

  get bonds(): BondData[] {
    if (this._bonds) return this._bonds;

    if (!this.record.bonds) return [];

    const aid1s = this.record.bonds.aid1;
    const aid2s = this.record.bonds.aid2;
    const orders = this.record.bonds.order;

    this._bonds = aid1s.map((aid1, index) => ({
      aid1,
      aid2: aid2s[index],
      order: BOND_ORDER_MAP[orders[index]] as any || 'single',
    }));

    return this._bonds;
  }

  // Synonyms (requires additional API call)
  async getSynonyms(): Promise<string[]> {
    const url = `/compound/cid/${this.cid}/synonyms/JSON`;
    
    try {
      const data = await this.httpClient.get<any>(url);
      if (data.InformationList && data.InformationList.Information[0]) {
        return data.InformationList.Information[0].Synonym || [];
      }
      return [];
    } catch (error) {
      console.warn(`Failed to retrieve synonyms for CID ${this.cid}:`, error);
      return [];
    }
  }

  // Convert to dictionary representation
  toDict(properties?: string[]): Record<string, any> {
    const allProperties = [
      'cid', 'molecularFormula', 'molecularWeight', 'smiles', 'isomericSmiles',
      'inchi', 'inchiKey', 'iupacName', 'xlogp', 'exactMass', 'monoisotopicMass',
      'tpsa', 'complexity', 'charge', 'hBondDonorCount', 'hBondAcceptorCount',
      'rotatableBondCount', 'heavyAtomCount', 'fingerprint', 'atoms', 'bonds'
    ];

    const propsToInclude = properties || allProperties;
    const result: Record<string, any> = {};

    for (const prop of propsToInclude) {
      if (prop in this) {
        result[prop] = (this as any)[prop];
      }
    }

    return result;
  }

  // Get raw record
  get record_(): CompoundRecord {
    return this.record;
  }
}
