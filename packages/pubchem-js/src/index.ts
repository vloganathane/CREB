/**
 * PubChem-JS - JavaScript/TypeScript port of PubChemP  PubChemError
} from './utils/httpClient'; * A comprehensive library for accessing PubChem chemical data
 * 
 * @author Loganathane Virassamy
 * @license MIT
 */

// Core classes
export { Compound } from './core/Compound';

// Search functions
export {
  getCompounds,
  getProperties,
  getSynonyms,
  getCids,
  getCompoundsByFormula,
  getCompoundsBySmiles,
  getCompoundsByInchi,
  getCompoundsByName,
  setDefaultHttpClient,
  getDefaultHttpClient,
} from './search/index';

// HTTP client and utilities
export {
  HTTPClient,
  PubChemHTTPError,
  PubChemTimeoutError,
  PubChemNotFoundError,
} from './utils/httpClient';

// Constants
export {
  API_BASE,
  ELEMENTS,
  PROPERTY_MAP,
  BOND_ORDER_MAP,
  DEFAULT_CONFIG,
} from './utils/constants';

// Types
export type {
  Namespace,
  SearchType,
  Domain,
  CompoundRecord,
  PropertyData,
  AtomData,
  BondData,
  SearchOptions,
  CacheOptions,
  HTTPClientOptions,
  CompoundSearchResponse,
  PropertySearchResponse,
  SynonymResponse,
  CIDResponse,
  PubChemError,
} from './types/index';

// Version
export const VERSION = '1.0.0';
