/**
 * Constants for PubChem API
 * Based on the original PubChemPy implementation
 */

// API Configuration
export const API_BASE = 'https://pubchem.ncbi.nlm.nih.gov/rest/pug';

// Element mapping - atomic number to symbol
export const ELEMENTS: Record<number, string> = {
  // Standard chemical elements
  1: 'H',   // Hydrogen
  2: 'He',  // Helium
  3: 'Li',  // Lithium
  4: 'Be',  // Beryllium
  5: 'B',   // Boron
  6: 'C',   // Carbon
  7: 'N',   // Nitrogen
  8: 'O',   // Oxygen
  9: 'F',   // Fluorine
  10: 'Ne', // Neon
  11: 'Na', // Sodium
  12: 'Mg', // Magnesium
  13: 'Al', // Aluminum
  14: 'Si', // Silicon
  15: 'P',  // Phosphorus
  16: 'S',  // Sulfur
  17: 'Cl', // Chlorine
  18: 'Ar', // Argon
  19: 'K',  // Potassium
  20: 'Ca', // Calcium
  21: 'Sc', // Scandium
  22: 'Ti', // Titanium
  23: 'V',  // Vanadium
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
  39: 'Y',  // Yttrium
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
  53: 'I',  // Iodine
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
  74: 'W',  // Tungsten
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
  92: 'U',  // Uranium
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
  253: 'R',  // R-group Label
};

// Property name mapping for API requests
export const PROPERTY_MAP: Record<string, string> = {
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
export const BOND_ORDER_MAP: Record<number, string> = {
  1: 'single',
  2: 'double',
  3: 'triple',
  4: 'aromatic',
  5: 'quadruple',
};

// Default configuration
export const DEFAULT_CONFIG = {
  baseURL: API_BASE,
  timeout: 30000,       // 30 seconds
  retries: 3,
  rateLimitDelay: 200,  // 200ms between requests (5 requests/second max)
  cache: {
    ttl: 24 * 60 * 60 * 1000,  // 24 hours
    maxSize: 1000,
    persistent: false,
  },
};
