/**
 * Enhanced Error Handling Integration Example
 * Demonstrates how to use circuit breakers, retry policies, and structured errors
 * in real-world scenarios within CREB-JS
 */
import { CREBError } from './errors/CREBError';
/**
 * Example: Enhanced NIST Integration with Error Handling
 */
export declare class EnhancedNISTIntegration {
    private circuitBreaker;
    private retryPolicy;
    private errorAggregator;
    constructor();
    /**
     * Get thermodynamic data with full error handling
     */
    getThermodynamicData(compoundName: string): Promise<any>;
    /**
     * Simulated NIST API request (would be real HTTP request in production)
     */
    private makeNISTRequest;
    /**
     * Get error statistics and health metrics
     */
    getHealthMetrics(): {
        circuitBreaker: any;
        errors: any;
        retryMetrics: any;
    };
}
/**
 * Example: Enhanced PubChem Integration with Error Handling
 */
export declare class EnhancedPubChemIntegration {
    private circuitBreaker;
    private retryPolicy;
    private rateLimiter;
    constructor();
    /**
     * Search for compounds with enhanced error handling
     */
    searchCompounds(query: string): Promise<any[]>;
    private makePubChemRequest;
}
/**
 * Example: Enhanced SQLite Storage with Error Handling
 */
export declare class EnhancedSQLiteStorage {
    private retryPolicy;
    private errorAggregator;
    constructor();
    /**
     * Store data with retry logic for transient database failures
     */
    storeData(table: string, data: any): Promise<void>;
    private executeDatabaseOperation;
}
/**
 * Example: System Health Monitor using Error Handling Components
 */
export declare class SystemHealthMonitor {
    private errorAggregator;
    private circuitBreakerManager;
    constructor();
    /**
     * Monitor system health and provide detailed status
     */
    getSystemHealth(): {
        overall: 'healthy' | 'degraded' | 'critical';
        services: any;
        errors: any;
        recommendations: string[];
    };
    /**
     * Add error to monitoring
     */
    reportError(error: CREBError): void;
    /**
     * Clear error history
     */
    clearErrorHistory(): void;
}
/**
 * Example: Graceful Degradation Service
 */
export declare class GracefulDegradationService {
    private nistIntegration;
    private pubchemIntegration;
    private localCache;
    constructor();
    /**
     * Get thermodynamic data with graceful degradation
     */
    getThermodynamicDataWithFallback(compoundName: string): Promise<{
        data: any;
        source: 'nist' | 'pubchem' | 'cache' | 'estimated';
        confidence: number;
    }>;
    private estimateThermodynamicData;
}
export declare function demonstrateEnhancedErrorHandling(): Promise<void>;
//# sourceMappingURL=ErrorHandlingIntegrationExample.d.ts.map