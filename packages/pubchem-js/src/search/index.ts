/**
 * Search functions for PubChem compounds
 * JavaScript port of PubChemPy search functionality
 */

import { 
  Namespace, 
  SearchOptions, 
  PropertyData, 
  CompoundSearchResponse,
  PropertySearchResponse,
  SynonymResponse,
  CIDResponse
} from '../types/index';
import { PROPERTY_MAP } from '../utils/constants';
import { HTTPClient } from '../utils/httpClient';
import { Compound } from '../core/Compound';

// Global HTTP client instance
let defaultHttpClient: HTTPClient;

function getHttpClient(): HTTPClient {
  if (!defaultHttpClient) {
    defaultHttpClient = new HTTPClient();
  }
  return defaultHttpClient;
}

/**
 * Get compounds by identifier
 */
export async function getCompounds(
  identifier: string | number | Array<string | number>,
  namespace: Namespace = 'cid',
  options: SearchOptions = {},
  httpClient?: HTTPClient
): Promise<Compound[]> {
  const client = httpClient || getHttpClient();
  
  // Handle array of identifiers
  if (Array.isArray(identifier)) {
    const results: Compound[] = [];
    for (const id of identifier) {
      const compounds = await getCompounds(id, namespace, options, client);
      results.push(...compounds);
    }
    return results;
  }

  // Build URL
  let url = `/compound/${namespace}/${encodeURIComponent(String(identifier))}/JSON`;
  
  // Add search type and other options as query parameters
  const params = new URLSearchParams();
  if (options.searchtype) {
    params.append('searchtype', options.searchtype);
  }
  if (options.listkey_count) {
    params.append('listkey_count', String(options.listkey_count));
  }
  if (options.listkey_start) {
    params.append('listkey_start', String(options.listkey_start));
  }
  
  // Add any additional query parameters
  for (const [key, value] of Object.entries(options)) {
    if (!['searchtype', 'listkey_count', 'listkey_start', 'as_dataframe'].includes(key)) {
      params.append(key, String(value));
    }
  }

  if (params.toString()) {
    url += `?${params.toString()}`;
  }

  try {
    const data = await client.get<CompoundSearchResponse>(url);
    if (!data.PC_Compounds || data.PC_Compounds.length === 0) {
      return [];
    }
    
    return data.PC_Compounds.map(record => new Compound(record, client));
  } catch (error: any) {
    if (error.name === 'PubChemNotFoundError') {
      return [];
    }
    throw new Error(`Failed to search compounds: ${error.message}`);
  }
}

/**
 * Get specific properties for compounds
 */
export async function getProperties(
  properties: string | string[],
  identifier: string | number | Array<string | number>,
  namespace: Namespace = 'cid',
  options: SearchOptions = {},
  httpClient?: HTTPClient
): Promise<PropertyData[]> {
  const client = httpClient || getHttpClient();
  
  // Normalize properties
  const propertyList = Array.isArray(properties) ? properties : [properties];
  const mappedProperties = propertyList.map(p => PROPERTY_MAP[p] || p);
  const propertyString = mappedProperties.join(',');

  // Handle array of identifiers
  if (Array.isArray(identifier)) {
    const results: PropertyData[] = [];
    for (const id of identifier) {
      const props = await getProperties(properties, id, namespace, options, client);
      results.push(...props);
    }
    return results;
  }

  // Build URL
  let url = `/compound/${namespace}/${encodeURIComponent(String(identifier))}/property/${propertyString}/JSON`;
  
  // Add search options
  const params = new URLSearchParams();
  if (options.searchtype) {
    params.append('searchtype', options.searchtype);
  }
  if (options.listkey_count) {
    params.append('listkey_count', String(options.listkey_count));
  }
  if (options.listkey_start) {
    params.append('listkey_start', String(options.listkey_start));
  }

  if (params.toString()) {
    url += `?${params.toString()}`;
  }

  try {
    const data = await client.get<PropertySearchResponse>(url);
    if (!data.PropertyTable?.Properties) {
      return [];
    }
    
    return data.PropertyTable.Properties;
  } catch (error: any) {
    if (error.name === 'PubChemNotFoundError') {
      return [];
    }
    throw new Error(`Failed to get properties: ${error.message}`);
  }
}

/**
 * Get synonyms for a compound
 */
export async function getSynonyms(
  identifier: string | number | Array<string | number>,
  namespace: Namespace = 'cid',
  httpClient?: HTTPClient
): Promise<Array<{ cid: number; synonyms: string[] }>> {
  const client = httpClient || getHttpClient();
  
  // Handle array of identifiers
  if (Array.isArray(identifier)) {
    const results: Array<{ cid: number; synonyms: string[] }> = [];
    for (const id of identifier) {
      const synonyms = await getSynonyms(id, namespace, client);
      results.push(...synonyms);
    }
    return results;
  }

  const url = `/compound/${namespace}/${encodeURIComponent(String(identifier))}/synonyms/JSON`;

  try {
    const data = await client.get<SynonymResponse>(url);
    if (!data.InformationList?.Information) {
      return [];
    }
    
    return data.InformationList.Information.map(info => ({
      cid: info.CID,
      synonyms: info.Synonym || []
    }));
  } catch (error: any) {
    if (error.name === 'PubChemNotFoundError') {
      return [];
    }
    throw new Error(`Failed to get synonyms: ${error.message}`);
  }
}

/**
 * Get CIDs for given identifiers
 */
export async function getCids(
  identifier: string | number | Array<string | number>,
  namespace: Namespace = 'name',
  options: SearchOptions = {},
  httpClient?: HTTPClient
): Promise<number[]> {
  const client = httpClient || getHttpClient();
  
  // Handle array of identifiers
  if (Array.isArray(identifier)) {
    const results: number[] = [];
    for (const id of identifier) {
      const cids = await getCids(id, namespace, options, client);
      results.push(...cids);
    }
    return results;
  }

  // Build URL
  let url = `/compound/${namespace}/${encodeURIComponent(String(identifier))}/cids/JSON`;
  
  // Add search options
  const params = new URLSearchParams();
  if (options.searchtype) {
    params.append('searchtype', options.searchtype);
  }
  if (options.listkey_count) {
    params.append('listkey_count', String(options.listkey_count));
  }
  if (options.listkey_start) {
    params.append('listkey_start', String(options.listkey_start));
  }

  if (params.toString()) {
    url += `?${params.toString()}`;
  }

  try {
    const data = await client.get<CIDResponse>(url);
    if (!data.IdentifierList?.CID) {
      return [];
    }
    
    return data.IdentifierList.CID;
  } catch (error: any) {
    if (error.name === 'PubChemNotFoundError') {
      return [];
    }
    throw new Error(`Failed to get CIDs: ${error.message}`);
  }
}

/**
 * Search compounds by molecular formula
 */
export async function getCompoundsByFormula(
  formula: string,
  options: SearchOptions = {},
  httpClient?: HTTPClient
): Promise<Compound[]> {
  return getCompounds(formula, 'formula', options, httpClient);
}

/**
 * Search compounds by SMILES
 */
export async function getCompoundsBySmiles(
  smiles: string,
  options: SearchOptions = {},
  httpClient?: HTTPClient
): Promise<Compound[]> {
  return getCompounds(smiles, 'smiles', options, httpClient);
}

/**
 * Search compounds by InChI
 */
export async function getCompoundsByInchi(
  inchi: string,
  options: SearchOptions = {},
  httpClient?: HTTPClient
): Promise<Compound[]> {
  return getCompounds(inchi, 'inchi', options, httpClient);
}

/**
 * Search compounds by name
 */
export async function getCompoundsByName(
  name: string,
  options: SearchOptions = {},
  httpClient?: HTTPClient
): Promise<Compound[]> {
  return getCompounds(name, 'name', options, httpClient);
}

/**
 * Get SDF (Structure Data Format) for a compound
 * Returns the 3D structure data as a string
 */
export async function getSdf(
  identifier: string | number,
  namespace: Namespace = 'cid',
  httpClient?: HTTPClient
): Promise<string> {
  const client = httpClient || getHttpClient();
  
  // Build URL for SDF format
  const url = `/compound/${namespace}/${encodeURIComponent(String(identifier))}/SDF`;
  
  try {
    // Make direct HTTP request for SDF data (not JSON)
    const fullUrl = url.startsWith('http') ? url : `${client.getBaseURL()}${url}`;
    
    const response = await fetch(fullUrl, {
      headers: {
        'Accept': 'chemical/x-sdf',
        'User-Agent': 'CREB-PubChem-JS/1.1.0',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`SDF data not found for ${namespace}: ${identifier}`);
      }
      throw new Error(`Failed to fetch SDF: ${response.status} ${response.statusText}`);
    }

    const sdfData = await response.text();
    
    if (!sdfData || sdfData.trim().length === 0) {
      throw new Error(`Empty SDF data received for ${namespace}: ${identifier}`);
    }
    
    return sdfData;
  } catch (error: any) {
    throw new Error(`Failed to get SDF data: ${error.message}`);
  }
}

/**
 * Get multiple formats for a compound (JSON metadata + SDF structure)
 * Returns both structured data and 3D structure in one call
 */
export async function getCompoundWithSdf(
  identifier: string | number,
  namespace: Namespace = 'cid',
  httpClient?: HTTPClient
): Promise<{ compound: Compound; sdf: string }> {
  const client = httpClient || getHttpClient();
  
  try {
    // Get structured compound data and SDF in parallel
    const [compounds, sdf] = await Promise.all([
      getCompounds(identifier, namespace, {}, client),
      getSdf(identifier, namespace, client)
    ]);
    
    if (compounds.length === 0) {
      throw new Error(`Compound not found for ${namespace}: ${identifier}`);
    }
    
    return {
      compound: compounds[0],
      sdf: sdf
    };
  } catch (error: any) {
    throw new Error(`Failed to get compound with SDF: ${error.message}`);
  }
}

/**
 * Set the default HTTP client for all search functions
 */
export function setDefaultHttpClient(client: HTTPClient): void {
  defaultHttpClient = client;
}

/**
 * Get the current default HTTP client
 */
export function getDefaultHttpClient(): HTTPClient {
  return getHttpClient();
}
