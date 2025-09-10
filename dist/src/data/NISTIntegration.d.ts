/**
 * NIST WebBook Integration for Enhanced Data
 * Provides real-time access to NIST thermodynamic database
 */
import { CompoundDatabase } from './types';
export declare class NISTWebBookIntegration {
    private readonly baseURL;
    private readonly apiKey?;
    private cache;
    private readonly cacheTimeout;
    constructor(apiKey?: string);
    /**
     * Query NIST WebBook for compound data
     */
    queryCompound(identifier: string, type?: 'formula' | 'name' | 'cas'): Promise<CompoundDatabase | null>;
    /**
     * Make request to NIST WebBook API
     */
    private makeNISTRequest;
    /**
     * Convert NIST response to CompoundDatabase format
     */
    private convertNISTToCompound;
    /**
     * Calculate molecular weight from formula (simplified)
     */
    private calculateMolecularWeight;
    /**
     * Get mock NIST data for testing/demonstration
     */
    private getMockNISTData;
    /**
     * Batch query multiple compounds
     */
    batchQuery(identifiers: string[], type?: 'formula' | 'name' | 'cas'): Promise<CompoundDatabase[]>;
    /**
     * Clear the cache
     */
    clearCache(): void;
    /**
     * Get cache statistics
     */
    getCacheStats(): {
        size: number;
        oldestEntry: Date | null;
        newestEntry: Date | null;
    };
}
//# sourceMappingURL=NISTIntegration.d.ts.map