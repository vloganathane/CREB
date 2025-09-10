/**
 * SQLite Storage Provider for CREB-JS
 * Provides persistent local database management with SQLite
 */
import { CompoundDatabase, DatabaseQuery, DataImportResult } from './types';
export interface SQLiteConfig {
    databasePath?: string;
    inMemory?: boolean;
    enableWAL?: boolean;
    cacheSize?: number;
    timeout?: number;
}
export interface SQLiteQuery extends DatabaseQuery {
    searchTerm?: string;
    useFullTextSearch?: boolean;
    limit?: number;
    minConfidence?: number;
    sources?: string[];
}
/**
 * SQLite-backed storage provider for chemical compounds
 */
export declare class SQLiteStorageProvider {
    private db;
    private config;
    private statements;
    constructor(config?: SQLiteConfig);
    /**
     * Initialize SQLite database and create tables
     */
    initialize(): Promise<void>;
    /**
     * Create database tables
     */
    private createTables;
    /**
     * Create indexes for performance
     */
    private createIndexes;
    /**
     * Prepare commonly used SQL statements
     */
    private prepareStatements;
    /**
     * Add or update a compound in the database
     */
    addCompound(compound: CompoundDatabase): Promise<boolean>;
    /**
     * Get a compound by formula
     */
    getCompound(formula: string): Promise<CompoundDatabase | null>;
    /**
     * Search compounds with query
     */
    searchCompounds(query: SQLiteQuery): Promise<CompoundDatabase[]>;
    /**
     * Remove a compound
     */
    removeCompound(formula: string): Promise<boolean>;
    /**
     * Get all compounds
     */
    getAllCompounds(): Promise<CompoundDatabase[]>;
    /**
     * Import data from various sources
     */
    importData(data: any[], format: 'json' | 'csv'): Promise<DataImportResult>;
    /**
     * Get database statistics
     */
    getStatistics(): Promise<any>;
    /**
     * Close the database connection
     */
    close(): Promise<void>;
    /**
     * Vacuum and optimize database
     */
    optimize(): Promise<void>;
    private rowToCompound;
    private buildFilteredQuery;
    private buildQueryParams;
    private normalizeImportData;
}
//# sourceMappingURL=SQLiteStorageProvider.d.ts.map