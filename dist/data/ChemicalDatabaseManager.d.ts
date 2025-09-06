/**
 * Enhanced Chemical Database Manager
 * Provides comprehensive data integration and management capabilities
 */
import { CompoundDatabase, DataImportResult, DataExportOptions, DatabaseQuery } from './types';
import { ThermodynamicProperties } from '../thermodynamics/types';
export declare class ChemicalDatabaseManager {
    private compounds;
    private sources;
    private validationRules;
    private cache;
    constructor();
    /**
     * Initialize default database sources
     */
    private initializeDefaultSources;
    /**
     * Initialize data validation rules
     */
    private initializeValidationRules;
    /**
     * Load default compound database
     */
    private loadDefaultCompounds;
    /**
     * Query compounds from the database
     */
    query(query: DatabaseQuery): Promise<CompoundDatabase[]>;
    /**
     * Check if compound matches query criteria
     */
    private matchesQuery;
    /**
     * Query external data sources
     */
    private queryExternalSource;
    /**
     * Add or update a compound in the database
     */
    addCompound(compound: Partial<CompoundDatabase>): Promise<boolean>;
    /**
     * Get default thermodynamic properties for validation
     */
    private getDefaultThermodynamicProperties;
    /**
     * Validate compound data against rules
     */
    private validateCompound;
    /**
     * Get nested property value by dot notation
     */
    private getNestedProperty;
    /**
     * Import compounds from various data formats
     */
    importData(data: any, format: 'json' | 'csv' | 'sdf'): Promise<DataImportResult>;
    /**
     * Parse CSV data into compound objects
     */
    private parseCSV;
    /**
     * Parse SDF (Structure Data File) format
     */
    private parseSDF;
    /**
     * Export compound data in various formats
     */
    exportData(options: DataExportOptions): string;
    /**
     * Export as JSON
     */
    private exportJSON;
    /**
     * Export as CSV
     */
    private exportCSV;
    /**
     * Export as XLSX (placeholder - would need external library)
     */
    private exportXLSX;
    /**
     * Select specific fields from compound
     */
    private selectFields;
    /**
     * Set nested property value by dot notation
     */
    private setNestedProperty;
    /**
     * Get compound by formula with backward compatibility
     */
    getCompound(formula: string): Promise<ThermodynamicProperties | null>;
    /**
     * Get all available compounds
     */
    getAllCompounds(): CompoundDatabase[];
    /**
     * Get database statistics
     */
    getStatistics(): {
        totalCompounds: number;
        sourceCounts: Record<string, number>;
        confidenceDistribution: Record<string, number>;
        lastUpdate: Date;
    };
}
//# sourceMappingURL=ChemicalDatabaseManager.d.ts.map