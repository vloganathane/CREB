/**
 * PubChem Integration Module for CREB Molecular Visualization
 * Connects PubChem database with RDKit.js and 3Dmol.js visualization pipeline
 */

import { Compound } from '../../packages/pubchem-js/src/core/Compound';

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
  maxResults?: number; // Alias for limit
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
  structure2D?: string; // SDF format
  structure3D?: string; // SDF format with 3D coordinates
  conformers?: Array<{
    id: number;
    energy: number;
    coordinates: Array<{ x: number; y: number; z: number }>;
  }>;
}

/**
 * PubChem Integration Class
 * Provides unified access to PubChem database for molecular visualization
 */
export class PubChemIntegration {
  private baseUrl = 'https://pubchem.ncbi.nlm.nih.gov/rest/pug';
  private requestDelay = 200; // Rate limiting: 5 requests per second
  private lastRequestTime = 0;

  constructor() {
    // Initialize with default settings
  }

  /**
   * Search for compounds by various criteria
   */
  async searchCompounds(
    query: string, 
    options: CompoundSearchOptions = { searchType: 'name' }
  ): Promise<PubChemSearchResult> {
    try {
      await this.enforceRateLimit();

      let searchUrl = '';
      const limit = options.limit || options.maxResults || 10;

      switch (options.searchType) {
        case 'name':
          searchUrl = `${this.baseUrl}/compound/name/${encodeURIComponent(query)}/cids/JSON?cids_type=flat`;
          break;
        case 'cid':
          searchUrl = `${this.baseUrl}/compound/cid/${query}/cids/JSON`;
          break;
        case 'smiles':
          searchUrl = `${this.baseUrl}/compound/smiles/${encodeURIComponent(query)}/cids/JSON`;
          break;
        case 'formula':
          searchUrl = `${this.baseUrl}/compound/formula/${encodeURIComponent(query)}/cids/JSON`;
          break;
        case 'inchi':
          searchUrl = `${this.baseUrl}/compound/inchi/${encodeURIComponent(query)}/cids/JSON`;
          break;
      }

      const response = await fetch(searchUrl);
      if (!response.ok) {
        throw new Error(`PubChem search failed: ${response.statusText}`);
      }

      const data = await response.json();
      const cids = data.IdentifierList?.CID || [];
      
      if (cids.length === 0) {
        return {
          success: true,
          compounds: [],
          totalFound: 0,
          source: 'pubchem',
          timestamp: new Date()
        };
      }

      // Get detailed compound information for found CIDs
      const limitedCids = cids.slice(0, limit);
      const compounds = await this.getCompoundDetails(limitedCids, options);

      return {
        success: true,
        compounds,
        totalFound: cids.length,
        source: 'pubchem',
        timestamp: new Date()
      };

    } catch (error) {
      return {
        success: false,
        compounds: [],
        totalFound: 0,
        source: 'pubchem',
        timestamp: new Date(),
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Get detailed compound information by CID
   */
  async getCompoundByCid(cid: number, options: CompoundSearchOptions = { searchType: 'cid' }): Promise<PubChemCompound | null> {
    try {
      await this.enforceRateLimit();

      const propertiesUrl = `${this.baseUrl}/compound/cid/${cid}/property/MolecularFormula,MolecularWeight,CanonicalSMILES,InChI,InChIKey/JSON`;
      
      const response = await fetch(propertiesUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch compound ${cid}: ${response.statusText}`);
      }

      const data = await response.json();
      const properties = data.PropertyTable?.Properties?.[0];

      if (!properties) {
        return null;
      }

      const compound: PubChemCompound = {
        cid,
        name: `CID ${cid}`, // Will be updated if synonyms are requested
        molecularFormula: properties.MolecularFormula || '',
        molecularWeight: properties.MolecularWeight || 0,
        smiles: properties.CanonicalSMILES || '',
        inchi: properties.InChI || '',
        inchiKey: properties.InChIKey || '',
        properties: properties
      };

      // Get synonyms if requested
      if (options.includeSynonyms) {
        const synonyms = await this.getCompoundSynonyms(cid);
        if (synonyms.length > 0) {
          compound.name = synonyms[0]; // Use first synonym as primary name
          compound.synonyms = synonyms;
        }
      }

      return compound;

    } catch (error) {
      console.error(`Error fetching compound ${cid}:`, error);
      return null;
    }
  }

  /**
   * Get molecular structure data (2D/3D SDF)
   */
  async getMolecularData(cid: number, include3D = false): Promise<PubChemMolecularData | null> {
    try {
      const compound = await this.getCompoundByCid(cid, { searchType: 'cid', includeSynonyms: true });
      if (!compound) {
        return null;
      }

      await this.enforceRateLimit();

      // Get 2D SDF structure
      const sdf2DUrl = `${this.baseUrl}/compound/cid/${cid}/SDF`;
      const sdf2DResponse = await fetch(sdf2DUrl);
      const structure2D = sdf2DResponse.ok ? await sdf2DResponse.text() : undefined;

      let structure3D: string | undefined;
      let conformers: Array<{ id: number; energy: number; coordinates: Array<{ x: number; y: number; z: number }> }> | undefined;

      if (include3D) {
        await this.enforceRateLimit();
        
        // Get 3D SDF structure
        const sdf3DUrl = `${this.baseUrl}/compound/cid/${cid}/SDF?record_type=3d`;
        const sdf3DResponse = await fetch(sdf3DUrl);
        structure3D = sdf3DResponse.ok ? await sdf3DResponse.text() : undefined;

        // Get conformer data if available
        await this.enforceRateLimit();
        try {
          const conformerUrl = `${this.baseUrl}/compound/cid/${cid}/conformers/JSON`;
          const conformerResponse = await fetch(conformerUrl);
          if (conformerResponse.ok) {
            const conformerData = await conformerResponse.json();
            conformers = this.parseConformerData(conformerData);
          }
        } catch (error) {
          // Conformer data not available for all compounds
          console.warn(`Conformer data not available for CID ${cid}`);
        }
      }

      return {
        compound,
        structure2D,
        structure3D,
        conformers
      };

    } catch (error) {
      console.error(`Error fetching molecular data for CID ${cid}:`, error);
      return null;
    }
  }

  /**
   * Search and get the best matching compound with full molecular data
   */
  async searchAndGetMolecularData(
    query: string, 
    options: CompoundSearchOptions = { searchType: 'name' }
  ): Promise<PubChemMolecularData | null> {
    const searchResult = await this.searchCompounds(query, { ...options, limit: 1 });
    
    if (!searchResult.success || searchResult.compounds.length === 0) {
      return null;
    }

    const compound = searchResult.compounds[0];
    return this.getMolecularData(compound.cid, options.include3D);
  }

  /**
   * Get compound synonyms
   */
  private async getCompoundSynonyms(cid: number): Promise<string[]> {
    try {
      await this.enforceRateLimit();

      const synonymsUrl = `${this.baseUrl}/compound/cid/${cid}/synonyms/JSON`;
      const response = await fetch(synonymsUrl);
      
      if (!response.ok) {
        return [];
      }

      const data = await response.json();
      return data.InformationList?.Information?.[0]?.Synonym || [];

    } catch (error) {
      return [];
    }
  }

  /**
   * Get detailed compound information for multiple CIDs
   */
  private async getCompoundDetails(
    cids: number[], 
    options: CompoundSearchOptions
  ): Promise<PubChemCompound[]> {
    const compounds: PubChemCompound[] = [];
    
    // Process in batches to respect rate limits
    const batchSize = 5;
    for (let i = 0; i < cids.length; i += batchSize) {
      const batch = cids.slice(i, i + batchSize);
      const batchPromises = batch.map(cid => this.getCompoundByCid(cid, options));
      
      const batchResults = await Promise.all(batchPromises);
      compounds.push(...batchResults.filter(compound => compound !== null) as PubChemCompound[]);
      
      // Add delay between batches
      if (i + batchSize < cids.length) {
        await new Promise(resolve => setTimeout(resolve, this.requestDelay * batch.length));
      }
    }

    return compounds;
  }

  /**
   * Parse conformer data from PubChem response
   */
  private parseConformerData(conformerData: any): Array<{ id: number; energy: number; coordinates: Array<{ x: number; y: number; z: number }> }> {
    // Implementation would parse the conformer JSON structure
    // This is a simplified version
    return [];
  }

  /**
   * Enforce rate limiting for PubChem API
   */
  private async enforceRateLimit(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    
    if (timeSinceLastRequest < this.requestDelay) {
      const waitTime = this.requestDelay - timeSinceLastRequest;
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
    
    this.lastRequestTime = Date.now();
  }

  /**
   * Convert PubChem compound to SMILES for RDKit processing
   */
  getCompoundSMILES(compound: PubChemCompound): string | null {
    return compound.smiles || null;
  }

  /**
   * Get compound 3D structure in SDF format for 3Dmol.js
   */
  async getCompound3DSDF(cid: number): Promise<string | null> {
    const molecularData = await this.getMolecularData(cid, true);
    return molecularData?.structure3D || molecularData?.structure2D || null;
  }

  /**
   * Validate if PubChem API is accessible
   */
  async validateConnection(): Promise<boolean> {
    try {
      await this.enforceRateLimit();
      
      const testUrl = `${this.baseUrl}/compound/cid/2244/property/MolecularFormula/JSON`; // Aspirin
      const response = await fetch(testUrl);
      return response.ok;
    } catch (error) {
      return false;
    }
  }
}

export default PubChemIntegration;
