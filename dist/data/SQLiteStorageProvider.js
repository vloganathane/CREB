/**
 * SQLite Storage Provider for CREB-JS
 * Provides persistent local database management with SQLite
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { SystemError } from '../core/errors/CREBError';
import { Injectable } from '../core/decorators/Injectable';
/**
 * SQLite-backed storage provider for chemical compounds
 */
let SQLiteStorageProvider = class SQLiteStorageProvider {
    constructor(config = {}) {
        this.db = null;
        this.statements = new Map();
        this.config = {
            databasePath: config.databasePath || './creb-compounds.db',
            inMemory: config.inMemory || false,
            enableWAL: config.enableWAL || true,
            cacheSize: config.cacheSize || 10000,
            timeout: config.timeout || 5000
        };
    }
    /**
     * Initialize SQLite database and create tables
     */
    async initialize() {
        try {
            // Try to import and use better-sqlite3 for Node.js
            try {
                const Database = (await import('better-sqlite3')).default;
                const dbPath = this.config.databasePath || ':memory:';
                this.db = new Database(dbPath);
            }
            catch (nodeError) {
                // If we're in a browser environment or better-sqlite3 isn't available,
                // gracefully fall back or provide a warning
                console.warn('SQLite storage not available in this environment. Better-sqlite3 not found.');
                throw new SystemError('SQLite storage requires better-sqlite3 package. Install with: npm install better-sqlite3', { databasePath: this.config.databasePath, error: nodeError }, { subsystem: 'data', resource: 'sqlite-database' });
            }
            if (this.db) {
                // Configure database
                this.db.exec(`PRAGMA journal_mode = ${this.config.enableWAL ? 'WAL' : 'DELETE'}`);
                this.db.exec(`PRAGMA cache_size = ${this.config.cacheSize}`);
                this.db.exec(`PRAGMA temp_store = memory`);
                this.db.exec(`PRAGMA mmap_size = 268435456`); // 256MB
                // Create tables
                await this.createTables();
                // Prepare statements
                await this.prepareStatements();
            }
        }
        catch (error) {
            console.error('Failed to initialize SQLite database:', error);
            throw error;
        }
    }
    /**
     * Create database tables
     */
    async createTables() {
        if (!this.db) {
            throw new SystemError('Database not initialized', { operation: 'createTables' }, { subsystem: 'data', resource: 'sqlite-database' });
        }
        const schema = `
      -- Main compounds table
      CREATE TABLE IF NOT EXISTS compounds (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        formula TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL,
        common_name TEXT,
        cas_number TEXT,
        smiles TEXT,
        inchi TEXT,
        molecular_weight REAL,
        confidence REAL DEFAULT 1.0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      -- Thermodynamic properties
      CREATE TABLE IF NOT EXISTS thermodynamic_properties (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        compound_id INTEGER REFERENCES compounds(id) ON DELETE CASCADE,
        delta_hf REAL,
        delta_gf REAL,
        entropy REAL,
        heat_capacity REAL,
        temp_range_min REAL,
        temp_range_max REAL,
        melting_point REAL,
        boiling_point REAL,
        critical_temp REAL,
        critical_pressure REAL,
        properties_json TEXT -- JSON blob for additional properties
      );

      -- Physical properties
      CREATE TABLE IF NOT EXISTS physical_properties (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        compound_id INTEGER REFERENCES compounds(id) ON DELETE CASCADE,
        density REAL,
        viscosity REAL,
        thermal_conductivity REAL,
        refractive_index REAL,
        dielectric_constant REAL,
        surface_tension REAL,
        properties_json TEXT -- JSON blob for additional properties
      );

      -- Safety properties
      CREATE TABLE IF NOT EXISTS safety_properties (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        compound_id INTEGER REFERENCES compounds(id) ON DELETE CASCADE,
        flash_point REAL,
        autoignition_temp REAL,
        explosive_limits_lower REAL,
        explosive_limits_upper REAL,
        toxicity_oral_ld50 REAL,
        toxicity_dermal_ld50 REAL,
        toxicity_inhalation_lc50 REAL,
        hazard_statements TEXT, -- JSON array
        precautionary_statements TEXT, -- JSON array
        properties_json TEXT -- JSON blob for additional properties
      );

      -- Data sources tracking
      CREATE TABLE IF NOT EXISTS compound_sources (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        compound_id INTEGER REFERENCES compounds(id) ON DELETE CASCADE,
        source_name TEXT NOT NULL,
        source_url TEXT,
        reliability REAL DEFAULT 1.0,
        last_updated DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      -- Vapor pressure data points
      CREATE TABLE IF NOT EXISTS vapor_pressure_data (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        compound_id INTEGER REFERENCES compounds(id) ON DELETE CASCADE,
        temperature REAL NOT NULL,
        pressure REAL NOT NULL
      );

      -- Search and caching
      CREATE TABLE IF NOT EXISTS search_cache (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        query_hash TEXT UNIQUE,
        query_type TEXT,
        results_json TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        expires_at DATETIME
      );

      -- Database metadata
      CREATE TABLE IF NOT EXISTS database_metadata (
        key TEXT PRIMARY KEY,
        value TEXT,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `;
        this.db.exec(schema);
    }
    /**
     * Create indexes for performance
     */
    async createIndexes() {
        if (!this.db)
            throw new Error('Database not initialized');
        const indexes = `
      CREATE INDEX IF NOT EXISTS idx_compounds_formula ON compounds(formula);
      CREATE INDEX IF NOT EXISTS idx_compounds_name ON compounds(name);
      CREATE INDEX IF NOT EXISTS idx_compounds_cas ON compounds(cas_number);
      CREATE INDEX IF NOT EXISTS idx_compounds_molecular_weight ON compounds(molecular_weight);
      CREATE INDEX IF NOT EXISTS idx_compounds_confidence ON compounds(confidence);
      CREATE INDEX IF NOT EXISTS idx_compounds_updated ON compounds(updated_at);
      
      CREATE INDEX IF NOT EXISTS idx_thermo_compound ON thermodynamic_properties(compound_id);
      CREATE INDEX IF NOT EXISTS idx_physical_compound ON physical_properties(compound_id);
      CREATE INDEX IF NOT EXISTS idx_safety_compound ON safety_properties(compound_id);
      CREATE INDEX IF NOT EXISTS idx_sources_compound ON compound_sources(compound_id);
      CREATE INDEX IF NOT EXISTS idx_vapor_compound ON vapor_pressure_data(compound_id);
      
      CREATE INDEX IF NOT EXISTS idx_search_cache_hash ON search_cache(query_hash);
      CREATE INDEX IF NOT EXISTS idx_search_cache_expires ON search_cache(expires_at);
      
      -- Full-text search indexes
      CREATE VIRTUAL TABLE IF NOT EXISTS compounds_fts USING fts5(
        formula, name, common_name, cas_number,
        content='compounds',
        content_rowid='id'
      );
      
      -- Triggers to maintain FTS index
      CREATE TRIGGER IF NOT EXISTS compounds_fts_insert AFTER INSERT ON compounds
      BEGIN
        INSERT INTO compounds_fts(rowid, formula, name, common_name, cas_number) 
        VALUES (new.id, new.formula, new.name, new.common_name, new.cas_number);
      END;
      
      CREATE TRIGGER IF NOT EXISTS compounds_fts_delete AFTER DELETE ON compounds
      BEGIN
        DELETE FROM compounds_fts WHERE rowid = old.id;
      END;
      
      CREATE TRIGGER IF NOT EXISTS compounds_fts_update AFTER UPDATE ON compounds
      BEGIN
        DELETE FROM compounds_fts WHERE rowid = old.id;
        INSERT INTO compounds_fts(rowid, formula, name, common_name, cas_number) 
        VALUES (new.id, new.formula, new.name, new.common_name, new.cas_number);
      END;
    `;
        this.db.exec(indexes);
    }
    /**
     * Prepare commonly used SQL statements
     */
    async prepareStatements() {
        if (!this.db)
            throw new Error('Database not initialized');
        const statements = {
            insertCompound: `
        INSERT INTO compounds (
          formula, name, common_name, cas_number, smiles, inchi, 
          molecular_weight, confidence, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      `,
            updateCompound: `
        UPDATE compounds SET 
          name = ?, common_name = ?, cas_number = ?, smiles = ?, inchi = ?,
          molecular_weight = ?, confidence = ?, updated_at = CURRENT_TIMESTAMP
        WHERE formula = ?
      `,
            selectCompound: `
        SELECT * FROM compounds WHERE formula = ?
      `,
            selectCompoundWithProperties: `
        SELECT 
          c.*,
          tp.delta_hf, tp.delta_gf, tp.entropy, tp.heat_capacity,
          tp.temp_range_min, tp.temp_range_max, tp.melting_point, tp.boiling_point,
          tp.critical_temp, tp.critical_pressure, tp.properties_json as thermo_json,
          pp.density, pp.viscosity, pp.thermal_conductivity, pp.refractive_index,
          pp.dielectric_constant, pp.surface_tension, pp.properties_json as physical_json,
          sp.flash_point, sp.autoignition_temp, sp.explosive_limits_lower, sp.explosive_limits_upper,
          sp.toxicity_oral_ld50, sp.toxicity_dermal_ld50, sp.toxicity_inhalation_lc50,
          sp.hazard_statements, sp.precautionary_statements, sp.properties_json as safety_json
        FROM compounds c
        LEFT JOIN thermodynamic_properties tp ON c.id = tp.compound_id
        LEFT JOIN physical_properties pp ON c.id = pp.compound_id
        LEFT JOIN safety_properties sp ON c.id = sp.compound_id
        WHERE c.formula = ?
      `,
            insertThermodynamicProperties: `
        INSERT OR REPLACE INTO thermodynamic_properties (
          compound_id, delta_hf, delta_gf, entropy, heat_capacity,
          temp_range_min, temp_range_max, melting_point, boiling_point,
          critical_temp, critical_pressure, properties_json
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
            insertPhysicalProperties: `
        INSERT OR REPLACE INTO physical_properties (
          compound_id, density, viscosity, thermal_conductivity, refractive_index,
          dielectric_constant, surface_tension, properties_json
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
            insertSafetyProperties: `
        INSERT OR REPLACE INTO safety_properties (
          compound_id, flash_point, autoignition_temp, explosive_limits_lower, explosive_limits_upper,
          toxicity_oral_ld50, toxicity_dermal_ld50, toxicity_inhalation_lc50,
          hazard_statements, precautionary_statements, properties_json
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
            insertSource: `
        INSERT OR REPLACE INTO compound_sources (
          compound_id, source_name, source_url, reliability, last_updated
        ) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
      `,
            searchCompounds: `
        SELECT c.* FROM compounds c
        WHERE c.formula LIKE ? OR c.name LIKE ? OR c.common_name LIKE ?
        ORDER BY c.confidence DESC, c.updated_at DESC
        LIMIT ?
      `,
            fullTextSearch: `
        SELECT c.* FROM compounds c
        JOIN compounds_fts fts ON c.id = fts.rowid
        WHERE compounds_fts MATCH ?
        ORDER BY rank, c.confidence DESC
        LIMIT ?
      `,
            deleteCompound: `
        DELETE FROM compounds WHERE formula = ?
      `,
            getStatistics: `
        SELECT 
          COUNT(*) as total_compounds,
          AVG(confidence) as avg_confidence,
          MIN(updated_at) as oldest_update,
          MAX(updated_at) as newest_update
        FROM compounds
      `
        };
        for (const [name, sql] of Object.entries(statements)) {
            this.statements.set(name, this.db.prepare(sql));
        }
    }
    /**
     * Add or update a compound in the database
     */
    async addCompound(compound) {
        if (!this.db)
            throw new Error('Database not initialized');
        const transaction = this.db.transaction(() => {
            try {
                // Insert or update main compound record
                const existingStmt = this.statements.get('selectCompound');
                const existing = existingStmt.get(compound.formula);
                let compoundId;
                if (existing) {
                    const updateStmt = this.statements.get('updateCompound');
                    updateStmt.run(compound.name, compound.commonName || null, compound.casNumber || null, compound.smiles || null, compound.inchi || null, compound.molecularWeight, compound.confidence, compound.formula);
                    compoundId = existing.id;
                }
                else {
                    const insertStmt = this.statements.get('insertCompound');
                    const result = insertStmt.run(compound.formula, compound.name, compound.commonName || null, compound.casNumber || null, compound.smiles || null, compound.inchi || null, compound.molecularWeight, compound.confidence);
                    compoundId = result.lastInsertRowid;
                }
                // Insert thermodynamic properties
                if (compound.thermodynamicProperties) {
                    const props = compound.thermodynamicProperties;
                    const thermoStmt = this.statements.get('insertThermodynamicProperties');
                    thermoStmt.run(compoundId, props.deltaHf || null, props.deltaGf || null, props.entropy || null, props.heatCapacity || null, props.temperatureRange?.[0] || null, props.temperatureRange?.[1] || null, props.meltingPoint || null, props.boilingPoint || null, props.criticalTemperature || null, props.criticalPressure || null, JSON.stringify(props));
                }
                // Insert physical properties
                if (compound.physicalProperties) {
                    const props = compound.physicalProperties;
                    const physicalStmt = this.statements.get('insertPhysicalProperties');
                    physicalStmt.run(compoundId, props.density || null, props.viscosity || null, props.thermalConductivity || null, props.refractiveIndex || null, props.dielectricConstant || null, props.surfaceTension || null, JSON.stringify(props));
                }
                // Insert safety properties
                if (compound.safetyData) {
                    const props = compound.safetyData;
                    const safetyStmt = this.statements.get('insertSafetyProperties');
                    safetyStmt.run(compoundId, props.flashPoint || null, props.autoignitionTemperature || null, props.explosiveLimits?.lower || null, props.explosiveLimits?.upper || null, props.toxicity?.ld50 || null, null, // dermal LD50 not in current interface
                    props.toxicity?.lc50 || null, JSON.stringify(props.hazardStatements || []), JSON.stringify(props.precautionaryStatements || []), JSON.stringify(props));
                }
                // Insert sources
                if (compound.sources?.length) {
                    const sourceStmt = this.statements.get('insertSource');
                    compound.sources.forEach(source => {
                        sourceStmt.run(compoundId, source, null, 1.0);
                    });
                }
                return true;
            }
            catch (error) {
                console.error('Error adding compound to SQLite:', error);
                throw error;
            }
        });
        transaction();
        return true;
    }
    /**
     * Get a compound by formula
     */
    async getCompound(formula) {
        if (!this.db)
            throw new Error('Database not initialized');
        try {
            const stmt = this.statements.get('selectCompoundWithProperties');
            if (!stmt) {
                console.error('Database statement not prepared');
                return null;
            }
            const row = stmt.get(formula);
            if (!row)
                return null;
            return this.rowToCompound(row);
        }
        catch (error) {
            console.error('Error getting compound from SQLite:', error);
            return null;
        }
    }
    /**
     * Search compounds with query
     */
    async searchCompounds(query) {
        if (!this.db)
            throw new Error('Database not initialized');
        try {
            let stmt;
            let params;
            if (query.searchTerm) {
                // Use full-text search if available, otherwise fall back to LIKE
                if (query.searchTerm.includes(' ') || query.useFullTextSearch) {
                    stmt = this.statements.get('fullTextSearch');
                    params = [query.searchTerm, query.limit || 50];
                }
                else {
                    stmt = this.statements.get('searchCompounds');
                    const term = `%${query.searchTerm}%`;
                    params = [term, term, term, query.limit || 50];
                }
            }
            else {
                // Get all compounds with optional filters
                const sql = this.buildFilteredQuery(query);
                stmt = this.db.prepare(sql);
                params = this.buildQueryParams(query);
            }
            const rows = stmt.all(...params);
            return rows.map(row => this.rowToCompound(row));
        }
        catch (error) {
            console.error('Error searching compounds in SQLite:', error);
            return [];
        }
    }
    /**
     * Remove a compound
     */
    async removeCompound(formula) {
        if (!this.db)
            throw new Error('Database not initialized');
        try {
            const stmt = this.statements.get('deleteCompound');
            if (!stmt) {
                console.error('Database statement not prepared');
                return false;
            }
            const result = stmt.run(formula);
            return result.changes > 0;
        }
        catch (error) {
            console.error('Error removing compound from SQLite:', error);
            return false;
        }
    }
    /**
     * Get all compounds
     */
    async getAllCompounds() {
        return this.searchCompounds({ limit: 10000 });
    }
    /**
     * Import data from various sources
     */
    async importData(data, format) {
        if (!this.db)
            throw new Error('Database not initialized');
        const result = {
            success: true,
            imported: 0,
            failed: 0,
            errors: [],
            warnings: []
        };
        const transaction = this.db.transaction(() => {
            for (const item of data) {
                try {
                    // Convert data to CompoundDatabase format
                    const compound = this.normalizeImportData(item, format);
                    this.addCompound(compound);
                    result.imported++;
                }
                catch (error) {
                    result.errors.push({
                        compound: item.formula || 'unknown',
                        error: String(error)
                    });
                    result.failed++;
                }
            }
        });
        try {
            transaction();
            console.log(`SQLite import completed: ${result.imported} imported, ${result.failed} failed`);
        }
        catch (error) {
            result.success = false;
            result.errors.push({
                compound: 'transaction',
                error: `Transaction failed: ${error}`
            });
        }
        return result;
    }
    /**
     * Get database statistics
     */
    async getStatistics() {
        if (!this.db)
            throw new Error('Database not initialized');
        try {
            const stmt = this.statements.get('getStatistics');
            if (!stmt) {
                console.error('Database statement not prepared');
                return {};
            }
            const stats = stmt.get();
            if (!stats) {
                return {
                    totalCompounds: 0,
                    averageConfidence: 0,
                    oldestUpdate: new Date(),
                    newestUpdate: new Date(),
                    sourceCounts: {}
                };
            }
            // Get source distribution
            const sourcesStmt = this.db.prepare(`
        SELECT source_name, COUNT(*) as count
        FROM compound_sources cs
        JOIN compounds c ON cs.compound_id = c.id
        GROUP BY source_name
      `);
            const sources = sourcesStmt.all();
            return {
                totalCompounds: stats.total_compounds,
                averageConfidence: stats.avg_confidence,
                oldestUpdate: new Date(stats.oldest_update),
                newestUpdate: new Date(stats.newest_update),
                sourceCounts: Object.fromEntries(sources.map(s => [s.source_name, s.count]))
            };
        }
        catch (error) {
            console.error('Error getting SQLite statistics:', error);
            return {};
        }
    }
    /**
     * Close the database connection
     */
    async close() {
        if (this.db) {
            // Clean up prepared statements
            this.statements.forEach(stmt => stmt.finalize());
            this.statements.clear();
            // Close database
            this.db.close();
            this.db = null;
            console.log('SQLite database connection closed');
        }
    }
    /**
     * Vacuum and optimize database
     */
    async optimize() {
        if (!this.db)
            throw new Error('Database not initialized');
        try {
            this.db.exec('VACUUM');
            this.db.exec('ANALYZE');
            console.log('SQLite database optimized');
        }
        catch (error) {
            console.error('Error optimizing SQLite database:', error);
        }
    }
    // Helper methods
    rowToCompound(row) {
        const compound = {
            formula: row.formula,
            name: row.name,
            iupacName: row.iupac_name,
            commonName: row.common_name,
            casNumber: row.cas_number,
            smiles: row.smiles,
            inchi: row.inchi,
            molecularWeight: row.molecular_weight,
            confidence: row.confidence,
            sources: [], // Will be populated separately if needed
            lastUpdated: new Date(row.updated_at),
            thermodynamicProperties: {
                deltaHf: 0,
                entropy: 0,
                heatCapacity: 0,
                temperatureRange: [298, 373]
            },
            physicalProperties: {}
        };
        // Add thermodynamic properties if present
        if (row.delta_hf !== null) {
            compound.thermodynamicProperties = {
                deltaHf: row.delta_hf,
                deltaGf: row.delta_gf,
                entropy: row.entropy,
                heatCapacity: row.heat_capacity,
                temperatureRange: row.temp_range_min !== null ?
                    [row.temp_range_min, row.temp_range_max] :
                    [298, 373],
                meltingPoint: row.melting_point,
                boilingPoint: row.boiling_point,
                criticalTemperature: row.critical_temp,
                criticalPressure: row.critical_pressure
            };
            // Parse additional properties from JSON
            if (row.thermo_json) {
                try {
                    const additional = JSON.parse(row.thermo_json);
                    Object.assign(compound.thermodynamicProperties, additional);
                }
                catch (e) {
                    console.warn('Failed to parse thermodynamic JSON:', e);
                }
            }
        }
        // Add physical properties if present
        if (row.density !== null) {
            compound.physicalProperties = {
                density: row.density,
                viscosity: row.viscosity,
                thermalConductivity: row.thermal_conductivity,
                refractiveIndex: row.refractive_index,
                dielectricConstant: row.dielectric_constant,
                surfaceTension: row.surface_tension
            };
            // Parse additional properties from JSON
            if (row.physical_json) {
                try {
                    const additional = JSON.parse(row.physical_json);
                    Object.assign(compound.physicalProperties, additional);
                }
                catch (e) {
                    console.warn('Failed to parse physical JSON:', e);
                }
            }
        }
        // Add safety properties if present
        if (row.flash_point !== null) {
            compound.safetyData = {
                flashPoint: row.flash_point,
                autoignitionTemperature: row.autoignition_temp,
                explosiveLimits: {
                    lower: row.explosive_limits_lower,
                    upper: row.explosive_limits_upper
                },
                toxicity: {
                    ld50: row.toxicity_oral_ld50,
                    lc50: row.toxicity_inhalation_lc50
                },
                hazardSymbols: [],
                hazardStatements: row.hazard_statements ? JSON.parse(row.hazard_statements) : [],
                precautionaryStatements: row.precautionary_statements ? JSON.parse(row.precautionary_statements) : []
            };
            // Parse additional properties from JSON
            if (row.safety_json) {
                try {
                    const additional = JSON.parse(row.safety_json);
                    Object.assign(compound.safetyData, additional);
                }
                catch (e) {
                    console.warn('Failed to parse safety JSON:', e);
                }
            }
        }
        return compound;
    }
    buildFilteredQuery(query) {
        let sql = 'SELECT * FROM compounds WHERE 1=1';
        if (query.minConfidence !== undefined) {
            sql += ' AND confidence >= ?';
        }
        if (query.sources?.length) {
            sql += ` AND id IN (
        SELECT compound_id FROM compound_sources 
        WHERE source_name IN (${query.sources.map(() => '?').join(',')})
      )`;
        }
        sql += ' ORDER BY confidence DESC, updated_at DESC';
        if (query.limit) {
            sql += ' LIMIT ?';
        }
        return sql;
    }
    buildQueryParams(query) {
        const params = [];
        if (query.minConfidence !== undefined) {
            params.push(query.minConfidence);
        }
        if (query.sources?.length) {
            params.push(...query.sources);
        }
        if (query.limit) {
            params.push(query.limit);
        }
        return params;
    }
    normalizeImportData(item, format) {
        // Convert imported data to standard CompoundDatabase format
        // This would need to be customized based on your data sources
        return {
            formula: item.formula || item.Formula,
            name: item.name || item.Name,
            molecularWeight: parseFloat(item.molecularWeight || item.MW || '0'),
            confidence: parseFloat(item.confidence || '0.8'),
            sources: ['import'],
            lastUpdated: new Date(),
            thermodynamicProperties: {
                deltaHf: parseFloat(item.deltaHf || '0'),
                entropy: parseFloat(item.entropy || '0'),
                heatCapacity: parseFloat(item.heatCapacity || '0'),
                temperatureRange: [298, 373]
            },
            physicalProperties: {}
            // Add other properties as needed
        };
    }
};
SQLiteStorageProvider = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [Object])
], SQLiteStorageProvider);
export { SQLiteStorageProvider };
//# sourceMappingURL=SQLiteStorageProvider.js.map