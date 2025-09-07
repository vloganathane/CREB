/**
 * Enhanced Error Handling for CREB-JS
 * Provides structured error types with context, stack traces, and error classification
 */
export declare enum ErrorCategory {
    VALIDATION = "VALIDATION",
    NETWORK = "NETWORK",
    COMPUTATION = "COMPUTATION",
    DATA = "DATA",
    SYSTEM = "SYSTEM",
    EXTERNAL_API = "EXTERNAL_API",
    TIMEOUT = "TIMEOUT",
    RATE_LIMIT = "RATE_LIMIT",
    AUTHENTICATION = "AUTHENTICATION",
    PERMISSION = "PERMISSION"
}
export declare enum ErrorSeverity {
    LOW = "LOW",
    MEDIUM = "MEDIUM",
    HIGH = "HIGH",
    CRITICAL = "CRITICAL"
}
export interface ErrorContext {
    [key: string]: any;
    timestamp?: Date;
    correlationId?: string;
    userId?: string;
    operation?: string;
    component?: string;
    version?: string;
}
export interface ErrorMetadata {
    category: ErrorCategory;
    severity: ErrorSeverity;
    retryable: boolean;
    errorCode: string;
    correlationId: string;
    context: ErrorContext;
    timestamp: Date;
    stackTrace?: string;
    innerError?: Error;
    sugggestedAction?: string;
}
/**
 * Base CREB Error class with enhanced context and metadata
 */
export declare class CREBError extends Error {
    readonly metadata: ErrorMetadata;
    constructor(message: string, category: ErrorCategory, severity?: ErrorSeverity, context?: ErrorContext, options?: {
        retryable?: boolean;
        errorCode?: string;
        correlationId?: string;
        innerError?: Error;
        suggestedAction?: string;
    });
    /**
     * Serialize error for logging and telemetry
     */
    toJSON(): Record<string, any>;
    /**
     * Create a sanitized version for client-side consumption
     */
    toClientSafe(): Record<string, any>;
    /**
     * Check if error is retryable based on category and context
     */
    isRetryable(): boolean;
    /**
     * Get human-readable error description
     */
    getDescription(): string;
    private isRetryableByDefault;
    private generateErrorCode;
    private generateCorrelationId;
}
/**
 * Validation Error - for input validation failures
 */
export declare class ValidationError extends CREBError {
    constructor(message: string, context?: ErrorContext, options?: {
        field?: string;
        value?: any;
        constraint?: string;
    });
}
/**
 * Network Error - for network-related failures
 */
export declare class NetworkError extends CREBError {
    constructor(message: string, context?: ErrorContext, options?: {
        statusCode?: number;
        url?: string;
        method?: string;
        timeout?: number;
    });
}
/**
 * External API Error - for third-party API failures
 */
export declare class ExternalAPIError extends CREBError {
    constructor(message: string, apiName: string, context?: ErrorContext, options?: {
        statusCode?: number;
        responseBody?: string;
        endpoint?: string;
        rateLimited?: boolean;
    });
}
/**
 * Computation Error - for calculation failures
 */
export declare class ComputationError extends CREBError {
    constructor(message: string, context?: ErrorContext, options?: {
        algorithm?: string;
        input?: any;
        expectedRange?: string;
    });
}
/**
 * System Error - for internal system failures
 */
export declare class SystemError extends CREBError {
    constructor(message: string, context?: ErrorContext, options?: {
        subsystem?: string;
        resource?: string;
    });
}
/**
 * Error aggregation utility for collecting and analyzing multiple errors
 */
export declare class ErrorAggregator {
    private errors;
    private readonly maxErrors;
    constructor(maxErrors?: number);
    /**
     * Add an error to the aggregator
     */
    addError(error: CREBError): void;
    /**
     * Get errors by category
     */
    getErrorsByCategory(category: ErrorCategory): CREBError[];
    /**
     * Get errors by severity
     */
    getErrorsBySeverity(severity: ErrorSeverity): CREBError[];
    /**
     * Get error statistics
     */
    getStatistics(): {
        total: number;
        byCategory: Record<ErrorCategory, number>;
        bySeverity: Record<ErrorSeverity, number>;
        retryableCount: number;
        recentErrors: CREBError[];
    };
    /**
     * Clear all collected errors
     */
    clear(): void;
    /**
     * Get all errors as JSON for logging
     */
    toJSON(): Record<string, any>[];
}
/**
 * Utility functions for error handling
 */
export declare class ErrorUtils {
    /**
     * Wrap a function with error handling and transformation
     */
    static withErrorHandling<T extends any[], R>(fn: (...args: T) => R, errorTransformer?: (error: any) => CREBError): (...args: T) => R;
    /**
     * Wrap an async function with error handling and transformation
     */
    static withAsyncErrorHandling<T extends any[], R>(fn: (...args: T) => Promise<R>, errorTransformer?: (error: any) => CREBError): (...args: T) => Promise<R>;
    /**
     * Transform unknown errors into CREBError instances
     */
    static transformUnknownError(error: any): CREBError;
    /**
     * Check if an error indicates a transient failure
     */
    static isTransientError(error: any): boolean;
}
//# sourceMappingURL=CREBError.d.ts.map