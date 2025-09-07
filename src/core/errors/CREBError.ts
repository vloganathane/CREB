/**
 * Enhanced Error Handling for CREB-JS
 * Provides structured error types with context, stack traces, and error classification
 */

export enum ErrorCategory {
  VALIDATION = 'VALIDATION',
  NETWORK = 'NETWORK',
  COMPUTATION = 'COMPUTATION',
  DATA = 'DATA',
  SYSTEM = 'SYSTEM',
  EXTERNAL_API = 'EXTERNAL_API',
  TIMEOUT = 'TIMEOUT',
  RATE_LIMIT = 'RATE_LIMIT',
  AUTHENTICATION = 'AUTHENTICATION',
  PERMISSION = 'PERMISSION'
}

export enum ErrorSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
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
export class CREBError extends Error {
  public readonly metadata: ErrorMetadata;

  constructor(
    message: string,
    category: ErrorCategory,
    severity: ErrorSeverity = ErrorSeverity.MEDIUM,
    context: ErrorContext = {},
    options: {
      retryable?: boolean;
      errorCode?: string;
      correlationId?: string;
      innerError?: Error;
      suggestedAction?: string;
    } = {}
  ) {
    super(message);
    this.name = 'CREBError';

    // Ensure proper prototype chain for instanceof checks
    Object.setPrototypeOf(this, CREBError.prototype);

    this.metadata = {
      category,
      severity,
      retryable: options.retryable ?? this.isRetryableByDefault(category),
      errorCode: options.errorCode ?? this.generateErrorCode(category),
      correlationId: options.correlationId ?? this.generateCorrelationId(),
      context: {
        ...context,
        timestamp: new Date(),
        version: '1.6.0'
      },
      timestamp: new Date(),
      stackTrace: this.stack,
      innerError: options.innerError,
      sugggestedAction: options.suggestedAction
    };

    // Capture stack trace for V8 engines
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CREBError);
    }
  }

  /**
   * Serialize error for logging and telemetry
   */
  public toJSON(): Record<string, any> {
    return {
      name: this.name,
      message: this.message,
      metadata: {
        ...this.metadata,
        innerError: this.metadata.innerError?.message
      }
    };
  }

  /**
   * Create a sanitized version for client-side consumption
   */
  public toClientSafe(): Record<string, any> {
    return {
      message: this.message,
      category: this.metadata.category,
      severity: this.metadata.severity,
      errorCode: this.metadata.errorCode,
      correlationId: this.metadata.correlationId,
      retryable: this.metadata.retryable,
      suggestedAction: this.metadata.sugggestedAction
    };
  }

  /**
   * Check if error is retryable based on category and context
   */
  public isRetryable(): boolean {
    return this.metadata.retryable;
  }

  /**
   * Get human-readable error description
   */
  public getDescription(): string {
    const parts = [
      `[${this.metadata.category}:${this.metadata.severity}]`,
      this.message
    ];

    if (this.metadata.sugggestedAction) {
      parts.push(`Suggestion: ${this.metadata.sugggestedAction}`);
    }

    return parts.join(' ');
  }

  private isRetryableByDefault(category: ErrorCategory): boolean {
    const retryableCategories = [
      ErrorCategory.NETWORK,
      ErrorCategory.TIMEOUT,
      ErrorCategory.RATE_LIMIT,
      ErrorCategory.EXTERNAL_API
    ];
    return retryableCategories.includes(category);
  }

  private generateErrorCode(category: ErrorCategory): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `${category}_${timestamp}_${random}`.toUpperCase();
  }

  private generateCorrelationId(): string {
    return `creb_${Date.now()}_${Math.random().toString(36).substring(2, 12)}`;
  }
}

/**
 * Validation Error - for input validation failures
 */
export class ValidationError extends CREBError {
  constructor(
    message: string,
    context: ErrorContext = {},
    options: { field?: string; value?: any; constraint?: string } = {}
  ) {
    super(
      message,
      ErrorCategory.VALIDATION,
      ErrorSeverity.MEDIUM,
      {
        ...context,
        field: options.field,
        value: options.value,
        constraint: options.constraint
      },
      {
        retryable: false,
        suggestedAction: 'Please check the input parameters and try again'
      }
    );
    this.name = 'ValidationError';
  }
}

/**
 * Network Error - for network-related failures
 */
export class NetworkError extends CREBError {
  constructor(
    message: string,
    context: ErrorContext = {},
    options: { 
      statusCode?: number; 
      url?: string; 
      method?: string;
      timeout?: number;
    } = {}
  ) {
    super(
      message,
      ErrorCategory.NETWORK,
      ErrorSeverity.HIGH,
      {
        ...context,
        statusCode: options.statusCode,
        url: options.url,
        method: options.method,
        timeout: options.timeout
      },
      {
        retryable: true,
        suggestedAction: 'Check network connectivity and try again'
      }
    );
    this.name = 'NetworkError';
  }
}

/**
 * External API Error - for third-party API failures
 */
export class ExternalAPIError extends CREBError {
  constructor(
    message: string,
    apiName: string,
    context: ErrorContext = {},
    options: {
      statusCode?: number;
      responseBody?: string;
      endpoint?: string;
      rateLimited?: boolean;
    } = {}
  ) {
    const severity = options.rateLimited ? ErrorSeverity.MEDIUM : ErrorSeverity.HIGH;
    const category = options.rateLimited ? ErrorCategory.RATE_LIMIT : ErrorCategory.EXTERNAL_API;
    
    super(
      message,
      category,
      severity,
      {
        ...context,
        apiName,
        statusCode: options.statusCode,
        responseBody: options.responseBody,
        endpoint: options.endpoint
      },
      {
        retryable: options.rateLimited || (!!options.statusCode && options.statusCode >= 500),
        suggestedAction: options.rateLimited 
          ? 'Rate limit exceeded. Please wait before retrying'
          : 'External service unavailable. Please try again later'
      }
    );
    this.name = 'ExternalAPIError';
  }
}

/**
 * Computation Error - for calculation failures
 */
export class ComputationError extends CREBError {
  constructor(
    message: string,
    context: ErrorContext = {},
    options: {
      algorithm?: string;
      input?: any;
      expectedRange?: string;
    } = {}
  ) {
    super(
      message,
      ErrorCategory.COMPUTATION,
      ErrorSeverity.MEDIUM,
      {
        ...context,
        algorithm: options.algorithm,
        input: options.input,
        expectedRange: options.expectedRange
      },
      {
        retryable: false,
        suggestedAction: 'Please verify input parameters and calculation constraints'
      }
    );
    this.name = 'ComputationError';
  }
}

/**
 * System Error - for internal system failures
 */
export class SystemError extends CREBError {
  constructor(
    message: string,
    context: ErrorContext = {},
    options: {
      subsystem?: string;
      resource?: string;
    } = {}
  ) {
    super(
      message,
      ErrorCategory.SYSTEM,
      ErrorSeverity.CRITICAL,
      {
        ...context,
        subsystem: options.subsystem,
        resource: options.resource
      },
      {
        retryable: false,
        suggestedAction: 'Internal system error. Please contact support'
      }
    );
    this.name = 'SystemError';
  }
}

/**
 * Error aggregation utility for collecting and analyzing multiple errors
 */
export class ErrorAggregator {
  private errors: CREBError[] = [];
  private readonly maxErrors: number;

  constructor(maxErrors: number = 100) {
    this.maxErrors = maxErrors;
  }

  /**
   * Add an error to the aggregator
   */
  public addError(error: CREBError): void {
    this.errors.push(error);
    
    // Keep only the most recent errors
    if (this.errors.length > this.maxErrors) {
      this.errors.shift();
    }
  }

  /**
   * Get errors by category
   */
  public getErrorsByCategory(category: ErrorCategory): CREBError[] {
    return this.errors.filter(error => error.metadata.category === category);
  }

  /**
   * Get errors by severity
   */
  public getErrorsBySeverity(severity: ErrorSeverity): CREBError[] {
    return this.errors.filter(error => error.metadata.severity === severity);
  }

  /**
   * Get error statistics
   */
  public getStatistics(): {
    total: number;
    byCategory: Record<ErrorCategory, number>;
    bySeverity: Record<ErrorSeverity, number>;
    retryableCount: number;
    recentErrors: CREBError[];
  } {
    const byCategory = {} as Record<ErrorCategory, number>;
    const bySeverity = {} as Record<ErrorSeverity, number>;
    let retryableCount = 0;

    // Initialize counters
    Object.values(ErrorCategory).forEach(cat => byCategory[cat] = 0);
    Object.values(ErrorSeverity).forEach(sev => bySeverity[sev] = 0);

    // Count errors
    this.errors.forEach(error => {
      byCategory[error.metadata.category]++;
      bySeverity[error.metadata.severity]++;
      if (error.isRetryable()) {
        retryableCount++;
      }
    });

    return {
      total: this.errors.length,
      byCategory,
      bySeverity,
      retryableCount,
      recentErrors: this.errors.slice(-10) // Last 10 errors
    };
  }

  /**
   * Clear all collected errors
   */
  public clear(): void {
    this.errors = [];
  }

  /**
   * Get all errors as JSON for logging
   */
  public toJSON(): Record<string, any>[] {
    return this.errors.map(error => error.toJSON());
  }
}

/**
 * Utility functions for error handling
 */
export class ErrorUtils {
  /**
   * Wrap a function with error handling and transformation
   */
  static withErrorHandling<T extends any[], R>(
    fn: (...args: T) => R,
    errorTransformer?: (error: any) => CREBError
  ): (...args: T) => R {
    return (...args: T): R => {
      try {
        return fn(...args);
      } catch (error) {
        throw errorTransformer ? errorTransformer(error) : ErrorUtils.transformUnknownError(error);
      }
    };
  }

  /**
   * Wrap an async function with error handling and transformation
   */
  static withAsyncErrorHandling<T extends any[], R>(
    fn: (...args: T) => Promise<R>,
    errorTransformer?: (error: any) => CREBError
  ): (...args: T) => Promise<R> {
    return async (...args: T): Promise<R> => {
      try {
        return await fn(...args);
      } catch (error) {
        throw errorTransformer ? errorTransformer(error) : ErrorUtils.transformUnknownError(error);
      }
    };
  }

  /**
   * Transform unknown errors into CREBError instances
   */
  static transformUnknownError(error: any): CREBError {
    if (error instanceof CREBError) {
      return error;
    }

    if (error instanceof Error) {
      return new SystemError(
        error.message,
        { originalError: error.name },
        { subsystem: 'unknown' }
      );
    }

    return new SystemError(
      typeof error === 'string' ? error : 'Unknown error occurred',
      { originalError: error }
    );
  }

  /**
   * Check if an error indicates a transient failure
   */
  static isTransientError(error: any): boolean {
    if (error instanceof CREBError) {
      return error.isRetryable();
    }

    // Common patterns for transient errors
    const transientPatterns = [
      /timeout/i,
      /connection/i,
      /network/i,
      /503/,
      /502/,
      /504/,
      /rate limit/i
    ];

    const message = error?.message || String(error);
    return transientPatterns.some(pattern => pattern.test(message));
  }
}
