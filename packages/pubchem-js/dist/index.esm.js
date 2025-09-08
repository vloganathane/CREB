/**
 * Constants for PubChem API
 * Based on the original PubChemPy implementation
 */
// API Configuration
const API_BASE = 'https://pubchem.ncbi.nlm.nih.gov/rest/pug';
// Element mapping - atomic number to symbol
const ELEMENTS = {
    // Standard chemical elements
    1: 'H', // Hydrogen
    2: 'He', // Helium
    3: 'Li', // Lithium
    4: 'Be', // Beryllium
    5: 'B', // Boron
    6: 'C', // Carbon
    7: 'N', // Nitrogen
    8: 'O', // Oxygen
    9: 'F', // Fluorine
    10: 'Ne', // Neon
    11: 'Na', // Sodium
    12: 'Mg', // Magnesium
    13: 'Al', // Aluminum
    14: 'Si', // Silicon
    15: 'P', // Phosphorus
    16: 'S', // Sulfur
    17: 'Cl', // Chlorine
    18: 'Ar', // Argon
    19: 'K', // Potassium
    20: 'Ca', // Calcium
    21: 'Sc', // Scandium
    22: 'Ti', // Titanium
    23: 'V', // Vanadium
    24: 'Cr', // Chromium
    25: 'Mn', // Manganese
    26: 'Fe', // Iron
    27: 'Co', // Cobalt
    28: 'Ni', // Nickel
    29: 'Cu', // Copper
    30: 'Zn', // Zinc
    31: 'Ga', // Gallium
    32: 'Ge', // Germanium
    33: 'As', // Arsenic
    34: 'Se', // Selenium
    35: 'Br', // Bromine
    36: 'Kr', // Krypton
    37: 'Rb', // Rubidium
    38: 'Sr', // Strontium
    39: 'Y', // Yttrium
    40: 'Zr', // Zirconium
    41: 'Nb', // Niobium
    42: 'Mo', // Molybdenum
    43: 'Tc', // Technetium
    44: 'Ru', // Ruthenium
    45: 'Rh', // Rhodium
    46: 'Pd', // Palladium
    47: 'Ag', // Silver
    48: 'Cd', // Cadmium
    49: 'In', // Indium
    50: 'Sn', // Tin
    51: 'Sb', // Antimony
    52: 'Te', // Tellurium
    53: 'I', // Iodine
    54: 'Xe', // Xenon
    55: 'Cs', // Cesium
    56: 'Ba', // Barium
    57: 'La', // Lanthanum
    58: 'Ce', // Cerium
    59: 'Pr', // Praseodymium
    60: 'Nd', // Neodymium
    61: 'Pm', // Promethium
    62: 'Sm', // Samarium
    63: 'Eu', // Europium
    64: 'Gd', // Gadolinium
    65: 'Tb', // Terbium
    66: 'Dy', // Dysprosium
    67: 'Ho', // Holmium
    68: 'Er', // Erbium
    69: 'Tm', // Thulium
    70: 'Yb', // Ytterbium
    71: 'Lu', // Lutetium
    72: 'Hf', // Hafnium
    73: 'Ta', // Tantalum
    74: 'W', // Tungsten
    75: 'Re', // Rhenium
    76: 'Os', // Osmium
    77: 'Ir', // Iridium
    78: 'Pt', // Platinum
    79: 'Au', // Gold
    80: 'Hg', // Mercury
    81: 'Tl', // Thallium
    82: 'Pb', // Lead
    83: 'Bi', // Bismuth
    84: 'Po', // Polonium
    85: 'At', // Astatine
    86: 'Rn', // Radon
    87: 'Fr', // Francium
    88: 'Ra', // Radium
    89: 'Ac', // Actinium
    90: 'Th', // Thorium
    91: 'Pa', // Protactinium
    92: 'U', // Uranium
    93: 'Np', // Neptunium
    94: 'Pu', // Plutonium
    95: 'Am', // Americium
    96: 'Cm', // Curium
    97: 'Bk', // Berkelium
    98: 'Cf', // Californium
    99: 'Es', // Einsteinium
    100: 'Fm', // Fermium
    101: 'Md', // Mendelevium
    102: 'No', // Nobelium
    103: 'Lr', // Lawrencium
    104: 'Rf', // Rutherfordium
    105: 'Db', // Dubnium
    106: 'Sg', // Seaborgium
    107: 'Bh', // Bohrium
    108: 'Hs', // Hassium
    109: 'Mt', // Meitnerium
    110: 'Ds', // Darmstadtium
    111: 'Rg', // Roentgenium
    112: 'Cn', // Copernicium
    113: 'Nh', // Nihonium
    114: 'Fl', // Flerovium
    115: 'Mc', // Moscovium
    116: 'Lv', // Livermorium
    117: 'Ts', // Tennessine
    118: 'Og', // Oganesson
    // Special atom types used by PubChem
    252: 'Lp', // Lone Pair
    253: 'R', // R-group Label
};
// Property name mapping for API requests
const PROPERTY_MAP = {
    'molecular_formula': 'MolecularFormula',
    'molecular_weight': 'MolecularWeight',
    'smiles': 'SMILES',
    'connectivity_smiles': 'ConnectivitySMILES',
    'canonical_smiles': 'CanonicalSMILES',
    'isomeric_smiles': 'IsomericSMILES',
    'inchi': 'InChI',
    'inchikey': 'InChIKey',
    'iupac_name': 'IUPACName',
    'xlogp': 'XLogP',
    'exact_mass': 'ExactMass',
    'monoisotopic_mass': 'MonoisotopicMass',
    'tpsa': 'TPSA',
    'complexity': 'Complexity',
    'charge': 'Charge',
    'h_bond_donor_count': 'HBondDonorCount',
    'h_bond_acceptor_count': 'HBondAcceptorCount',
    'rotatable_bond_count': 'RotatableBondCount',
    'heavy_atom_count': 'HeavyAtomCount',
    'isotope_atom_count': 'IsotopeAtomCount',
    'atom_stereo_count': 'AtomStereoCount',
    'defined_atom_stereo_count': 'DefinedAtomStereoCount',
    'undefined_atom_stereo_count': 'UndefinedAtomStereoCount',
    'bond_stereo_count': 'BondStereoCount',
    'defined_bond_stereo_count': 'DefinedBondStereoCount',
    'undefined_bond_stereo_count': 'UndefinedBondStereoCount',
    'covalent_unit_count': 'CovalentUnitCount',
};
// Bond order mapping
const BOND_ORDER_MAP = {
    1: 'single',
    2: 'double',
    3: 'triple',
    4: 'aromatic',
    5: 'quadruple',
};
// Default configuration
const DEFAULT_CONFIG = {
    baseURL: API_BASE,
    timeout: 30000, // 30 seconds
    retries: 3,
    rateLimitDelay: 200, // 200ms between requests (5 requests/second max)
    cache: {
        ttl: 24 * 60 * 60 * 1000, // 24 hours
        maxSize: 1000,
        persistent: false,
    },
};

/**
 * HTTP client for PubChem API with caching and rate limiting
 */
// Cache implementation
class Cache {
    constructor(options = {}) {
        this.cache = new Map();
        this.options = {
            ttl: options.ttl ?? DEFAULT_CONFIG.cache.ttl,
            maxSize: options.maxSize ?? DEFAULT_CONFIG.cache.maxSize,
            persistent: options.persistent ?? DEFAULT_CONFIG.cache.persistent,
        };
        // Load from localStorage if persistent
        if (this.options.persistent && typeof localStorage !== 'undefined') {
            this.loadFromStorage();
        }
    }
    loadFromStorage() {
        try {
            const stored = localStorage.getItem('pubchem-cache');
            if (stored) {
                const data = JSON.parse(stored);
                this.cache = new Map(data);
            }
        }
        catch (error) {
            console.warn('Failed to load cache from localStorage:', error);
        }
    }
    saveToStorage() {
        if (this.options.persistent && typeof localStorage !== 'undefined') {
            try {
                const data = Array.from(this.cache.entries());
                localStorage.setItem('pubchem-cache', JSON.stringify(data));
            }
            catch (error) {
                console.warn('Failed to save cache to localStorage:', error);
            }
        }
    }
    get(key) {
        const entry = this.cache.get(key);
        if (!entry)
            return null;
        // Check if expired
        if (Date.now() - entry.timestamp > this.options.ttl) {
            this.cache.delete(key);
            return null;
        }
        return entry.data;
    }
    set(key, data) {
        // Enforce max size
        if (this.cache.size >= this.options.maxSize) {
            // Remove oldest entry
            const firstKey = this.cache.keys().next().value;
            if (firstKey) {
                this.cache.delete(firstKey);
            }
        }
        this.cache.set(key, {
            data,
            timestamp: Date.now(),
        });
        this.saveToStorage();
    }
    clear() {
        this.cache.clear();
        if (this.options.persistent && typeof localStorage !== 'undefined') {
            localStorage.removeItem('pubchem-cache');
        }
    }
}
// Rate limiter implementation
class RateLimiter {
    constructor(delay) {
        this.delay = delay;
        this.lastRequest = 0;
        this.queue = [];
        this.processing = false;
    }
    async throttle(fn) {
        return new Promise((resolve, reject) => {
            this.queue.push(async () => {
                try {
                    const result = await fn();
                    resolve(result);
                }
                catch (error) {
                    reject(error);
                }
            });
            this.processQueue();
        });
    }
    async processQueue() {
        if (this.processing || this.queue.length === 0)
            return;
        this.processing = true;
        while (this.queue.length > 0) {
            const now = Date.now();
            const timeSinceLastRequest = now - this.lastRequest;
            if (timeSinceLastRequest < this.delay) {
                await this.sleep(this.delay - timeSinceLastRequest);
            }
            const fn = this.queue.shift();
            if (fn) {
                this.lastRequest = Date.now();
                await fn();
            }
        }
        this.processing = false;
    }
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
// Custom error classes
class PubChemHTTPError extends Error {
    constructor(status, statusText, message) {
        super(message || `HTTP ${status}: ${statusText}`);
        this.status = status;
        this.statusText = statusText;
        this.name = 'PubChemHTTPError';
    }
}
class PubChemTimeoutError extends Error {
    constructor(message = 'Request timeout') {
        super(message);
        this.name = 'PubChemTimeoutError';
    }
}
class PubChemNotFoundError extends Error {
    constructor(message = 'No results found') {
        super(message);
        this.name = 'PubChemNotFoundError';
    }
}
// Main HTTP client
class HTTPClient {
    constructor(options = {}) {
        this.options = {
            baseURL: options.baseURL ?? DEFAULT_CONFIG.baseURL,
            timeout: options.timeout ?? DEFAULT_CONFIG.timeout,
            retries: options.retries ?? DEFAULT_CONFIG.retries,
            rateLimitDelay: options.rateLimitDelay ?? DEFAULT_CONFIG.rateLimitDelay,
        };
        this.cache = new Cache();
        this.rateLimiter = new RateLimiter(this.options.rateLimitDelay);
    }
    /**
     * Get the base URL for API requests
     */
    getBaseURL() {
        return this.options.baseURL;
    }
    async get(url, useCache = true) {
        const fullUrl = url.startsWith('http') ? url : `${this.options.baseURL}${url}`;
        const cacheKey = fullUrl;
        // Check cache first
        if (useCache) {
            const cached = this.cache.get(cacheKey);
            if (cached) {
                return cached;
            }
        }
        // Make request with rate limiting
        const result = await this.rateLimiter.throttle(() => this.makeRequest(fullUrl));
        // Cache successful results
        if (useCache && result) {
            this.cache.set(cacheKey, result);
        }
        return result;
    }
    async makeRequest(url, attempt = 1) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.options.timeout);
        try {
            const response = await fetch(url, {
                signal: controller.signal,
                headers: {
                    'Accept': 'application/json',
                    'User-Agent': 'PubChem-JS/1.0.0',
                },
            });
            clearTimeout(timeoutId);
            if (!response.ok) {
                if (response.status === 404) {
                    throw new PubChemNotFoundError(`Resource not found: ${url}`);
                }
                throw new PubChemHTTPError(response.status, response.statusText);
            }
            const data = await response.json();
            // Check for PubChem API errors in response
            if (data.Fault) {
                throw new Error(`PubChem API Error: ${data.Fault.Message}`);
            }
            return data;
        }
        catch (error) {
            clearTimeout(timeoutId);
            if (error.name === 'AbortError') {
                throw new PubChemTimeoutError();
            }
            // Retry on network errors
            if (attempt < this.options.retries && this.isRetryableError(error)) {
                await this.sleep(1000 * attempt); // Exponential backoff
                return this.makeRequest(url, attempt + 1);
            }
            throw error;
        }
    }
    isRetryableError(error) {
        return (error instanceof PubChemTimeoutError ||
            (error instanceof PubChemHTTPError && error.status >= 500) ||
            error.code === 'ECONNRESET' ||
            error.code === 'ENOTFOUND');
    }
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    clearCache() {
        this.cache.clear();
    }
}

/**
 * PubChem Compound class - JavaScript port of PubChemPy
 * Represents a chemical compound with properties and methods
 */
// Helper function to parse properties from compound record
function parseProperty(urn, props) {
    if (!props)
        return null;
    for (const prop of props) {
        if (prop.urn && prop.urn.label === urn.label) {
            if (urn.name && prop.urn.name !== urn.name)
                continue;
            if (urn.implementation && prop.urn.implementation !== urn.implementation)
                continue;
            // Handle different value types
            const value = prop.value;
            if (typeof value === 'object' && value !== null) {
                if ('sval' in value)
                    return value.sval;
                if ('fval' in value)
                    return value.fval;
                if ('ival' in value)
                    return value.ival;
                if ('binary' in value)
                    return value.binary;
            }
            return value;
        }
    }
    return null;
}
class Compound {
    constructor(record, httpClient) {
        this.record = record;
        this.httpClient = httpClient || new HTTPClient();
    }
    // Static factory methods
    static async fromCid(cid, httpClient) {
        const client = httpClient || new HTTPClient();
        const url = `/compound/cid/${cid}/JSON`;
        try {
            const data = await client.get(url);
            if (!data.PC_Compounds || data.PC_Compounds.length === 0) {
                throw new Error(`No compound found for CID ${cid}`);
            }
            return new Compound(data.PC_Compounds[0], client);
        }
        catch (error) {
            throw new Error(`Failed to retrieve compound ${cid}: ${error.message}`);
        }
    }
    static async fromName(name, httpClient) {
        const client = httpClient || new HTTPClient();
        const encodedName = encodeURIComponent(name);
        const url = `/compound/name/${encodedName}/JSON`;
        try {
            const data = await client.get(url);
            if (!data.PC_Compounds || data.PC_Compounds.length === 0) {
                return [];
            }
            return data.PC_Compounds.map(record => new Compound(record, client));
        }
        catch (error) {
            if (error.name === 'PubChemNotFoundError') {
                return [];
            }
            throw new Error(`Failed to search for compound "${name}": ${error.message}`);
        }
    }
    static async fromSmiles(smiles, httpClient) {
        const client = httpClient || new HTTPClient();
        const encodedSmiles = encodeURIComponent(smiles);
        const url = `/compound/smiles/${encodedSmiles}/JSON`;
        try {
            const data = await client.get(url);
            if (!data.PC_Compounds || data.PC_Compounds.length === 0) {
                return [];
            }
            return data.PC_Compounds.map(record => new Compound(record, client));
        }
        catch (error) {
            if (error.name === 'PubChemNotFoundError') {
                return [];
            }
            throw new Error(`Failed to search for SMILES "${smiles}": ${error.message}`);
        }
    }
    // Convenience methods that return the first/most relevant result
    static async getByName(name, httpClient) {
        const results = await Compound.fromName(name, httpClient);
        return results.length > 0 ? results[0] : null;
    }
    static async getBySmiles(smiles, httpClient) {
        const results = await Compound.fromSmiles(smiles, httpClient);
        return results.length > 0 ? results[0] : null;
    }
    static async fromFormula(formula, httpClient) {
        const client = httpClient || new HTTPClient();
        const encodedFormula = encodeURIComponent(formula);
        // Use MaxRecords parameter to limit results and avoid timeouts
        const url = `/compound/fastformula/${encodedFormula}/JSON?MaxRecords=100`;
        try {
            const data = await client.get(url);
            if (!data.PC_Compounds || data.PC_Compounds.length === 0) {
                return [];
            }
            return data.PC_Compounds.map(record => new Compound(record, client));
        }
        catch (error) {
            if (error.name === 'PubChemNotFoundError' ||
                error.message?.includes('404') ||
                error.message?.includes('ServerError')) {
                return [];
            }
            throw new Error(`Failed to search for formula "${formula}": ${error.message}`);
        }
    }
    static async getByFormula(formula, httpClient) {
        const results = await Compound.fromFormula(formula, httpClient);
        return results.length > 0 ? results[0] : null;
    }
    // Basic identifiers
    get cid() {
        return this.record.id?.id?.cid;
    }
    // Molecular identifiers and properties
    get molecularFormula() {
        return parseProperty({ label: 'Molecular Formula' }, this.record.props);
    }
    get molecularWeight() {
        const weight = parseProperty({ label: 'Molecular Weight' }, this.record.props);
        return weight ? parseFloat(weight) : null;
    }
    get smiles() {
        return parseProperty({ label: 'SMILES', name: 'Canonical' }, this.record.props);
    }
    get isomericSmiles() {
        return parseProperty({ label: 'SMILES', name: 'Isomeric' }, this.record.props);
    }
    get inchi() {
        return parseProperty({ label: 'InChI' }, this.record.props);
    }
    get inchiKey() {
        return parseProperty({ label: 'InChI Key' }, this.record.props);
    }
    get iupacName() {
        return parseProperty({ label: 'IUPAC Name', name: 'Preferred' }, this.record.props) ||
            parseProperty({ label: 'IUPAC Name', name: 'Systematic' }, this.record.props) ||
            parseProperty({ label: 'IUPAC Name' }, this.record.props);
    }
    // Calculated properties
    get xlogp() {
        const value = parseProperty({ label: 'Log P' }, this.record.props);
        return value ? parseFloat(value) : null;
    }
    get exactMass() {
        const mass = parseProperty({ label: 'Mass', name: 'Exact' }, this.record.props);
        return mass ? parseFloat(mass) : null;
    }
    get monoisotopicMass() {
        const mass = parseProperty({ label: 'Mass', name: 'MonoIsotopic' }, this.record.props);
        return mass ? parseFloat(mass) : null;
    }
    get tpsa() {
        const tpsa = parseProperty({ label: 'Topological', name: 'Polar Surface Area' }, this.record.props);
        return tpsa ? parseFloat(tpsa) : null;
    }
    get complexity() {
        const comp = parseProperty({ label: 'Complexity' }, this.record.props);
        return comp ? parseFloat(comp) : null;
    }
    get charge() {
        const charge = parseProperty({ label: 'Charge' }, this.record.props);
        return charge ? parseInt(charge) : null;
    }
    // Structural properties
    get hBondDonorCount() {
        const count = parseProperty({ label: 'Count', name: 'Hydrogen Bond Donor' }, this.record.props);
        return count ? parseInt(count) : null;
    }
    get hBondAcceptorCount() {
        const count = parseProperty({ label: 'Count', name: 'Hydrogen Bond Acceptor' }, this.record.props);
        return count ? parseInt(count) : null;
    }
    get rotatableBondCount() {
        const count = parseProperty({ label: 'Count', name: 'Rotatable Bond' }, this.record.props);
        return count ? parseInt(count) : null;
    }
    get heavyAtomCount() {
        const count = parseProperty({ label: 'Count', name: 'Heavy Atom' }, this.record.props);
        return count ? parseInt(count) : null;
    }
    // Fingerprint for similarity calculations
    get fingerprint() {
        return parseProperty({ label: 'Fingerprint', implementation: 'E_SCREEN' }, this.record.props);
    }
    // Atom and bond data
    get atoms() {
        if (this._atoms)
            return this._atoms;
        if (!this.record.atoms)
            return [];
        const aids = this.record.atoms.aid;
        const elements = this.record.atoms.element;
        this._atoms = aids.map((aid, index) => {
            const atom = {
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
    get bonds() {
        if (this._bonds)
            return this._bonds;
        if (!this.record.bonds)
            return [];
        const aid1s = this.record.bonds.aid1;
        const aid2s = this.record.bonds.aid2;
        const orders = this.record.bonds.order;
        this._bonds = aid1s.map((aid1, index) => ({
            aid1,
            aid2: aid2s[index],
            order: BOND_ORDER_MAP[orders[index]] || 'single',
        }));
        return this._bonds;
    }
    // Synonyms (requires additional API call)
    async getSynonyms() {
        const url = `/compound/cid/${this.cid}/synonyms/JSON`;
        try {
            const data = await this.httpClient.get(url);
            if (data.InformationList && data.InformationList.Information[0]) {
                return data.InformationList.Information[0].Synonym || [];
            }
            return [];
        }
        catch (error) {
            console.warn(`Failed to retrieve synonyms for CID ${this.cid}:`, error);
            return [];
        }
    }
    // Convert to dictionary representation
    toDict(properties) {
        const allProperties = [
            'cid', 'molecularFormula', 'molecularWeight', 'smiles', 'isomericSmiles',
            'inchi', 'inchiKey', 'iupacName', 'xlogp', 'exactMass', 'monoisotopicMass',
            'tpsa', 'complexity', 'charge', 'hBondDonorCount', 'hBondAcceptorCount',
            'rotatableBondCount', 'heavyAtomCount', 'fingerprint', 'atoms', 'bonds'
        ];
        const propsToInclude = properties || allProperties;
        const result = {};
        for (const prop of propsToInclude) {
            if (prop in this) {
                result[prop] = this[prop];
            }
        }
        return result;
    }
    // Get raw record
    get record_() {
        return this.record;
    }
}

/**
 * Search functions for PubChem compounds
 * JavaScript port of PubChemPy search functionality
 */
// Global HTTP client instance
let defaultHttpClient;
function getHttpClient() {
    if (!defaultHttpClient) {
        defaultHttpClient = new HTTPClient();
    }
    return defaultHttpClient;
}
/**
 * Get compounds by identifier
 */
async function getCompounds(identifier, namespace = 'cid', options = {}, httpClient) {
    const client = httpClient || getHttpClient();
    // Handle array of identifiers
    if (Array.isArray(identifier)) {
        const results = [];
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
        const data = await client.get(url);
        if (!data.PC_Compounds || data.PC_Compounds.length === 0) {
            return [];
        }
        return data.PC_Compounds.map(record => new Compound(record, client));
    }
    catch (error) {
        if (error.name === 'PubChemNotFoundError') {
            return [];
        }
        throw new Error(`Failed to search compounds: ${error.message}`);
    }
}
/**
 * Get specific properties for compounds
 */
async function getProperties(properties, identifier, namespace = 'cid', options = {}, httpClient) {
    const client = httpClient || getHttpClient();
    // Normalize properties
    const propertyList = Array.isArray(properties) ? properties : [properties];
    const mappedProperties = propertyList.map(p => PROPERTY_MAP[p] || p);
    const propertyString = mappedProperties.join(',');
    // Handle array of identifiers
    if (Array.isArray(identifier)) {
        const results = [];
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
        const data = await client.get(url);
        if (!data.PropertyTable?.Properties) {
            return [];
        }
        return data.PropertyTable.Properties;
    }
    catch (error) {
        if (error.name === 'PubChemNotFoundError') {
            return [];
        }
        throw new Error(`Failed to get properties: ${error.message}`);
    }
}
/**
 * Get synonyms for a compound
 */
async function getSynonyms(identifier, namespace = 'cid', httpClient) {
    const client = httpClient || getHttpClient();
    // Handle array of identifiers
    if (Array.isArray(identifier)) {
        const results = [];
        for (const id of identifier) {
            const synonyms = await getSynonyms(id, namespace, client);
            results.push(...synonyms);
        }
        return results;
    }
    const url = `/compound/${namespace}/${encodeURIComponent(String(identifier))}/synonyms/JSON`;
    try {
        const data = await client.get(url);
        if (!data.InformationList?.Information) {
            return [];
        }
        return data.InformationList.Information.map(info => ({
            cid: info.CID,
            synonyms: info.Synonym || []
        }));
    }
    catch (error) {
        if (error.name === 'PubChemNotFoundError') {
            return [];
        }
        throw new Error(`Failed to get synonyms: ${error.message}`);
    }
}
/**
 * Get CIDs for given identifiers
 */
async function getCids(identifier, namespace = 'name', options = {}, httpClient) {
    const client = httpClient || getHttpClient();
    // Handle array of identifiers
    if (Array.isArray(identifier)) {
        const results = [];
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
        const data = await client.get(url);
        if (!data.IdentifierList?.CID) {
            return [];
        }
        return data.IdentifierList.CID;
    }
    catch (error) {
        if (error.name === 'PubChemNotFoundError') {
            return [];
        }
        throw new Error(`Failed to get CIDs: ${error.message}`);
    }
}
/**
 * Search compounds by molecular formula
 */
async function getCompoundsByFormula(formula, options = {}, httpClient) {
    return getCompounds(formula, 'formula', options, httpClient);
}
/**
 * Search compounds by SMILES
 */
async function getCompoundsBySmiles(smiles, options = {}, httpClient) {
    return getCompounds(smiles, 'smiles', options, httpClient);
}
/**
 * Search compounds by InChI
 */
async function getCompoundsByInchi(inchi, options = {}, httpClient) {
    return getCompounds(inchi, 'inchi', options, httpClient);
}
/**
 * Search compounds by name
 */
async function getCompoundsByName(name, options = {}, httpClient) {
    return getCompounds(name, 'name', options, httpClient);
}
/**
 * Get SDF (Structure Data Format) for a compound
 * Returns the 3D structure data as a string
 */
async function getSdf(identifier, namespace = 'cid', httpClient) {
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
    }
    catch (error) {
        throw new Error(`Failed to get SDF data: ${error.message}`);
    }
}
/**
 * Get multiple formats for a compound (JSON metadata + SDF structure)
 * Returns both structured data and 3D structure in one call
 */
async function getCompoundWithSdf(identifier, namespace = 'cid', httpClient) {
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
    }
    catch (error) {
        throw new Error(`Failed to get compound with SDF: ${error.message}`);
    }
}
/**
 * Set the default HTTP client for all search functions
 */
function setDefaultHttpClient(client) {
    defaultHttpClient = client;
}
/**
 * Get the current default HTTP client
 */
function getDefaultHttpClient() {
    return getHttpClient();
}

/**
 * PubChem-JS - JavaScript/TypeScript port of PubChemP  PubChemError
} from './utils/httpClient'; * A comprehensive library for accessing PubChem chemical data
 *
 * @author Loganathane Virassamy
 * @license MIT
 */
// Core classes
// Version
const VERSION = '1.0.0';

export { API_BASE, BOND_ORDER_MAP, Compound, DEFAULT_CONFIG, ELEMENTS, HTTPClient, PROPERTY_MAP, PubChemHTTPError, PubChemNotFoundError, PubChemTimeoutError, VERSION, getCids, getCompoundWithSdf, getCompounds, getCompoundsByFormula, getCompoundsByInchi, getCompoundsByName, getCompoundsBySmiles, getDefaultHttpClient, getProperties, getSdf, getSynonyms, setDefaultHttpClient };
//# sourceMappingURL=index.esm.js.map
