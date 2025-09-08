/**
 * PubChem-JS - JavaScript/TypeScript port of PubChemP  PubChemError
} from './utils/httpClient'; * A comprehensive library for accessing PubChem chemical data
 *
 * @author Loganathane Virassamy
 * @license MIT
 */
export { Compound } from './core/Compound';
export { getCompounds, getProperties, getSynonyms, getCids, getCompoundsByFormula, getCompoundsBySmiles, getCompoundsByInchi, getCompoundsByName, getSdf, getCompoundWithSdf, setDefaultHttpClient, getDefaultHttpClient, } from './search/index';
export { HTTPClient, PubChemHTTPError, PubChemTimeoutError, PubChemNotFoundError, } from './utils/httpClient';
export { API_BASE, ELEMENTS, PROPERTY_MAP, BOND_ORDER_MAP, DEFAULT_CONFIG, } from './utils/constants';
export type { Namespace, SearchType, Domain, CompoundRecord, PropertyData, AtomData, BondData, SearchOptions, CacheOptions, HTTPClientOptions, CompoundSearchResponse, PropertySearchResponse, SynonymResponse, CIDResponse, PubChemError, } from './types/index';
export declare const VERSION = "1.0.0";
//# sourceMappingURL=index.d.ts.map