/**
 * Comprehensive tests for CREB Error types and error handling utilities
 */

import {
  CREBError,
  ErrorCategory,
  ErrorSeverity,
  ValidationError,
  NetworkError,
  ExternalAPIError,
  ComputationError,
  SystemError,
  ErrorAggregator,
  ErrorUtils
} from '../../errors/CREBError';

describe('CREBError', () => {
  describe('Basic Error Creation', () => {
    it('should create a basic CREB error with required fields', () => {
      const error = new CREBError(
        'Test error message',
        ErrorCategory.VALIDATION,
        ErrorSeverity.MEDIUM
      );

      expect(error.message).toBe('Test error message');
      expect(error.name).toBe('CREBError');
      expect(error.metadata.category).toBe(ErrorCategory.VALIDATION);
      expect(error.metadata.severity).toBe(ErrorSeverity.MEDIUM);
      expect(error.metadata.retryable).toBe(false); // Validation errors are not retryable by default
      expect(error.metadata.correlationId).toBeDefined();
      expect(error.metadata.errorCode).toContain('VALIDATION');
      expect(error.metadata.timestamp).toBeInstanceOf(Date);
    });

    it('should handle optional parameters correctly', () => {
      const context = { userId: '12345', operation: 'test' };
      const innerError = new Error('Inner error');
      
      const error = new CREBError(
        'Complex error',
        ErrorCategory.NETWORK,
        ErrorSeverity.HIGH,
        context,
        {
          retryable: true,
          errorCode: 'CUSTOM_001',
          correlationId: 'test-correlation-id',
          innerError,
          suggestedAction: 'Try again later'
        }
      );

      expect(error.metadata.context.userId).toBe('12345');
      expect(error.metadata.context.operation).toBe('test');
      expect(error.metadata.retryable).toBe(true);
      expect(error.metadata.errorCode).toBe('CUSTOM_001');
      expect(error.metadata.correlationId).toBe('test-correlation-id');
      expect(error.metadata.innerError).toBe(innerError);
      expect(error.metadata.sugggestedAction).toBe('Try again later');
    });

    it('should maintain proper prototype chain for instanceof checks', () => {
      const error = new CREBError('Test', ErrorCategory.SYSTEM);
      
      expect(error instanceof Error).toBe(true);
      expect(error instanceof CREBError).toBe(true);
    });
  });

  describe('Serialization', () => {
    it('should serialize to JSON correctly', () => {
      const error = new CREBError(
        'Serialization test',
        ErrorCategory.COMPUTATION,
        ErrorSeverity.LOW,
        { component: 'test-component' }
      );

      const json = error.toJSON();
      
      expect(json.name).toBe('CREBError');
      expect(json.message).toBe('Serialization test');
      expect(json.metadata.category).toBe(ErrorCategory.COMPUTATION);
      expect(json.metadata.severity).toBe(ErrorSeverity.LOW);
      expect(json.metadata.context.component).toBe('test-component');
    });

    it('should create client-safe version', () => {
      const error = new CREBError(
        'Sensitive error',
        ErrorCategory.SYSTEM,
        ErrorSeverity.CRITICAL,
        { sensitiveData: 'secret', userId: 'user123' },
        { suggestedAction: 'Contact support' }
      );

      const clientSafe = error.toClientSafe();
      
      expect(clientSafe.message).toBe('Sensitive error');
      expect(clientSafe.category).toBe(ErrorCategory.SYSTEM);
      expect(clientSafe.severity).toBe(ErrorSeverity.CRITICAL);
      expect(clientSafe.correlationId).toBeDefined();
      expect(clientSafe.retryable).toBeDefined();
      expect(clientSafe.suggestedAction).toBe('Contact support');
      
      // Should not contain internal metadata
      expect(clientSafe).not.toHaveProperty('context');
      expect(clientSafe).not.toHaveProperty('stackTrace');
    });
  });

  describe('Retry Logic', () => {
    it('should determine retryability correctly by category', () => {
      const networkError = new CREBError('Network issue', ErrorCategory.NETWORK);
      const validationError = new CREBError('Invalid input', ErrorCategory.VALIDATION);
      const timeoutError = new CREBError('Timeout', ErrorCategory.TIMEOUT);
      
      expect(networkError.isRetryable()).toBe(true);
      expect(validationError.isRetryable()).toBe(false);
      expect(timeoutError.isRetryable()).toBe(true);
    });

    it('should allow manual override of retryability', () => {
      const error = new CREBError(
        'Custom retryable validation error',
        ErrorCategory.VALIDATION,
        ErrorSeverity.MEDIUM,
        {},
        { retryable: true }
      );
      
      expect(error.isRetryable()).toBe(true);
    });
  });

  describe('Human-readable descriptions', () => {
    it('should format description correctly', () => {
      const error = new CREBError(
        'Something went wrong',
        ErrorCategory.NETWORK,
        ErrorSeverity.HIGH,
        {},
        { suggestedAction: 'Check your connection' }
      );

      const description = error.getDescription();
      expect(description).toContain('[NETWORK:HIGH]');
      expect(description).toContain('Something went wrong');
      expect(description).toContain('Suggestion: Check your connection');
    });
  });
});

describe('Specialized Error Types', () => {
  describe('ValidationError', () => {
    it('should create validation error with field context', () => {
      const error = new ValidationError(
        'Invalid email format',
        { component: 'user-form' },
        { field: 'email', value: 'invalid-email', constraint: 'email format' }
      );

      expect(error.name).toBe('ValidationError');
      expect(error.metadata.category).toBe(ErrorCategory.VALIDATION);
      expect(error.metadata.severity).toBe(ErrorSeverity.MEDIUM);
      expect(error.metadata.retryable).toBe(false);
      expect(error.metadata.context.field).toBe('email');
      expect(error.metadata.context.value).toBe('invalid-email');
      expect(error.metadata.context.constraint).toBe('email format');
    });
  });

  describe('NetworkError', () => {
    it('should create network error with HTTP context', () => {
      const error = new NetworkError(
        'Request failed',
        { requestId: 'req-123' },
        { statusCode: 500, url: 'https://api.example.com', method: 'POST', timeout: 5000 }
      );

      expect(error.name).toBe('NetworkError');
      expect(error.metadata.category).toBe(ErrorCategory.NETWORK);
      expect(error.metadata.severity).toBe(ErrorSeverity.HIGH);
      expect(error.metadata.retryable).toBe(true);
      expect(error.metadata.context.statusCode).toBe(500);
      expect(error.metadata.context.url).toBe('https://api.example.com');
      expect(error.metadata.context.method).toBe('POST');
    });
  });

  describe('ExternalAPIError', () => {
    it('should create API error for regular failures', () => {
      const error = new ExternalAPIError(
        'API server error',
        'PubChem',
        { requestId: 'req-456' },
        { statusCode: 503, endpoint: '/compounds', responseBody: 'Service unavailable' }
      );

      expect(error.name).toBe('ExternalAPIError');
      expect(error.metadata.category).toBe(ErrorCategory.EXTERNAL_API);
      expect(error.metadata.severity).toBe(ErrorSeverity.HIGH);
      expect(error.metadata.retryable).toBe(true); // 5xx errors are retryable
      expect(error.metadata.context.apiName).toBe('PubChem');
    });

    it('should handle rate limiting specially', () => {
      const error = new ExternalAPIError(
        'Rate limit exceeded',
        'NIST',
        {},
        { statusCode: 429, rateLimited: true }
      );

      expect(error.metadata.category).toBe(ErrorCategory.RATE_LIMIT);
      expect(error.metadata.severity).toBe(ErrorSeverity.MEDIUM);
      expect(error.metadata.retryable).toBe(true);
      expect(error.metadata.sugggestedAction).toContain('Rate limit exceeded');
    });
  });

  describe('ComputationError', () => {
    it('should create computation error with algorithm context', () => {
      const error = new ComputationError(
        'Matrix solving failed',
        { inputSize: 100 },
        { algorithm: 'gaussian-elimination', input: 'matrix-data', expectedRange: '0-1' }
      );

      expect(error.name).toBe('ComputationError');
      expect(error.metadata.category).toBe(ErrorCategory.COMPUTATION);
      expect(error.metadata.severity).toBe(ErrorSeverity.MEDIUM);
      expect(error.metadata.retryable).toBe(false);
      expect(error.metadata.context.algorithm).toBe('gaussian-elimination');
    });
  });

  describe('SystemError', () => {
    it('should create system error with subsystem context', () => {
      const error = new SystemError(
        'Database connection failed',
        { connectionId: 'conn-789' },
        { subsystem: 'storage', resource: 'sqlite-db' }
      );

      expect(error.name).toBe('SystemError');
      expect(error.metadata.category).toBe(ErrorCategory.SYSTEM);
      expect(error.metadata.severity).toBe(ErrorSeverity.CRITICAL);
      expect(error.metadata.retryable).toBe(false);
      expect(error.metadata.context.subsystem).toBe('storage');
      expect(error.metadata.context.resource).toBe('sqlite-db');
    });
  });
});

describe('ErrorAggregator', () => {
  let aggregator: ErrorAggregator;

  beforeEach(() => {
    aggregator = new ErrorAggregator(5); // Max 5 errors for testing
  });

  it('should collect and categorize errors', () => {
    const error1 = new ValidationError('Validation failed');
    const error2 = new NetworkError('Network timeout');
    const error3 = new ComputationError('Calculation error');

    aggregator.addError(error1);
    aggregator.addError(error2);
    aggregator.addError(error3);

    const validationErrors = aggregator.getErrorsByCategory(ErrorCategory.VALIDATION);
    const networkErrors = aggregator.getErrorsByCategory(ErrorCategory.NETWORK);

    expect(validationErrors).toHaveLength(1);
    expect(networkErrors).toHaveLength(1);
    expect(validationErrors[0]).toBe(error1);
    expect(networkErrors[0]).toBe(error2);
  });

  it('should group errors by severity', () => {
    const lowError = new CREBError('Low severity', ErrorCategory.DATA, ErrorSeverity.LOW);
    const highError = new CREBError('High severity', ErrorCategory.SYSTEM, ErrorSeverity.HIGH);
    const criticalError = new CREBError('Critical', ErrorCategory.SYSTEM, ErrorSeverity.CRITICAL);

    aggregator.addError(lowError);
    aggregator.addError(highError);
    aggregator.addError(criticalError);

    const highSeverityErrors = aggregator.getErrorsBySeverity(ErrorSeverity.HIGH);
    const criticalErrors = aggregator.getErrorsBySeverity(ErrorSeverity.CRITICAL);

    expect(highSeverityErrors).toHaveLength(1);
    expect(criticalErrors).toHaveLength(1);
  });

  it('should provide comprehensive statistics', () => {
    const error1 = new ValidationError('Error 1');
    const error2 = new NetworkError('Error 2');
    const error3 = new NetworkError('Error 3');

    aggregator.addError(error1);
    aggregator.addError(error2);
    aggregator.addError(error3);

    const stats = aggregator.getStatistics();

    expect(stats.total).toBe(3);
    expect(stats.byCategory[ErrorCategory.VALIDATION]).toBe(1);
    expect(stats.byCategory[ErrorCategory.NETWORK]).toBe(2);
    expect(stats.bySeverity[ErrorSeverity.MEDIUM]).toBe(1);
    expect(stats.bySeverity[ErrorSeverity.HIGH]).toBe(2);
    expect(stats.retryableCount).toBe(2); // Network errors are retryable
    expect(stats.recentErrors).toHaveLength(3);
  });

  it('should respect maximum error limit', () => {
    // Add 7 errors to aggregator with max 5
    for (let i = 0; i < 7; i++) {
      aggregator.addError(new ValidationError(`Error ${i}`));
    }

    const stats = aggregator.getStatistics();
    expect(stats.total).toBe(5); // Should only keep 5 most recent
  });

  it('should clear errors correctly', () => {
    aggregator.addError(new ValidationError('Error'));
    expect(aggregator.getStatistics().total).toBe(1);

    aggregator.clear();
    expect(aggregator.getStatistics().total).toBe(0);
  });

  it('should serialize errors to JSON', () => {
    const error = new ValidationError('JSON test');
    aggregator.addError(error);

    const json = aggregator.toJSON();
    expect(json).toHaveLength(1);
    expect(json[0].name).toBe('ValidationError');
    expect(json[0].message).toBe('JSON test');
  });
});

describe('ErrorUtils', () => {
  describe('Error wrapping', () => {
    it('should wrap synchronous functions with error handling', () => {
      const throwingFunction = () => {
        throw new Error('Original error');
      };

      const wrappedFunction = ErrorUtils.withErrorHandling(throwingFunction);

      expect(() => wrappedFunction()).toThrow();
      try {
        wrappedFunction();
      } catch (error) {
        expect(error).toBeInstanceOf(CREBError);
        expect((error as CREBError).name).toBe('SystemError');
        expect((error as SystemError).message).toBe('Original error');
      }
    });

    it('should wrap async functions with error handling', async () => {
      const throwingAsyncFunction = async () => {
        throw new Error('Async error');
      };

      const wrappedFunction = ErrorUtils.withAsyncErrorHandling(throwingAsyncFunction);

      await expect(wrappedFunction()).rejects.toThrow();
      try {
        await wrappedFunction();
      } catch (error) {
        expect(error).toBeInstanceOf(CREBError);
        expect((error as CREBError).name).toBe('SystemError');
        expect((error as SystemError).message).toBe('Async error');
      }
    });

    it('should use custom error transformer', () => {
      const customTransformer = (error: any) => new ValidationError(error.message);
      const throwingFunction = () => {
        throw new Error('Transform me');
      };

      const wrappedFunction = ErrorUtils.withErrorHandling(throwingFunction, customTransformer);

      expect(() => wrappedFunction()).toThrow();
      try {
        wrappedFunction();
      } catch (error) {
        expect(error).toBeInstanceOf(CREBError);
        expect((error as CREBError).name).toBe('ValidationError');
        expect((error as ValidationError).message).toBe('Transform me');
      }
    });

    it('should pass through CREB errors unchanged', () => {
      const originalError = new NetworkError('Network problem');
      const throwingFunction = () => {
        throw originalError;
      };

      const wrappedFunction = ErrorUtils.withErrorHandling(throwingFunction);

      try {
        wrappedFunction();
        fail('Expected function to throw');
      } catch (error) {
        expect(error).toBe(originalError);
        expect(error).toBeInstanceOf(CREBError);
        expect((error as CREBError).name).toBe('NetworkError');
        expect((error as NetworkError).message).toBe('Network problem');
      }
    });
  });

  describe('Error transformation', () => {
    it('should transform unknown errors to SystemError', () => {
      const error = ErrorUtils.transformUnknownError('String error');
      
      expect(error).toBeInstanceOf(CREBError);
      expect(error.name).toBe('SystemError');
      expect(error.message).toBe('String error');
    });

    it('should transform Error objects to SystemError', () => {
      const originalError = new Error('Original message');
      const transformedError = ErrorUtils.transformUnknownError(originalError);
      
      expect(transformedError).toBeInstanceOf(CREBError);
      expect(transformedError.name).toBe('SystemError');
      expect(transformedError.message).toBe('Original message');
      expect(transformedError.metadata.context.originalError).toBe('Error');
    });

    it('should pass through CREB errors unchanged', () => {
      const originalError = new ValidationError('Validation failed');
      const result = ErrorUtils.transformUnknownError(originalError);
      
      expect(result).toBe(originalError);
    });
  });

  describe('Transient error detection', () => {
    it('should identify retryable CREB errors', () => {
      const retryableError = new NetworkError('Connection failed');
      const nonRetryableError = new ValidationError('Invalid input');
      
      expect(ErrorUtils.isTransientError(retryableError)).toBe(true);
      expect(ErrorUtils.isTransientError(nonRetryableError)).toBe(false);
    });

    it('should identify transient patterns in regular errors', () => {
      const timeoutError = new Error('Connection timeout occurred');
      const networkError = new Error('Network unreachable');
      const rateLimitError = new Error('Rate limit exceeded');
      const validationError = new Error('Invalid email format');
      
      expect(ErrorUtils.isTransientError(timeoutError)).toBe(true);
      expect(ErrorUtils.isTransientError(networkError)).toBe(true);
      expect(ErrorUtils.isTransientError(rateLimitError)).toBe(true);
      expect(ErrorUtils.isTransientError(validationError)).toBe(false);
    });

    it('should handle HTTP status codes', () => {
      const serverError = new Error('503 Service Unavailable');
      const badGateway = new Error('502 Bad Gateway');
      const clientError = new Error('400 Bad Request');
      
      expect(ErrorUtils.isTransientError(serverError)).toBe(true);
      expect(ErrorUtils.isTransientError(badGateway)).toBe(true);
      expect(ErrorUtils.isTransientError(clientError)).toBe(false);
    });
  });
});

describe('Error Performance', () => {
  it('should create errors efficiently', () => {
    const startTime = Date.now();
    
    for (let i = 0; i < 1000; i++) {
      new CREBError(`Error ${i}`, ErrorCategory.COMPUTATION);
    }
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    // Should create 1000 errors in less than 1000ms (adjusted for CI environments)
    expect(duration).toBeLessThan(1000);
  });

  it('should handle large error aggregation efficiently', () => {
    const aggregator = new ErrorAggregator(10000);
    const startTime = Date.now();
    
    for (let i = 0; i < 5000; i++) {
      aggregator.addError(new CREBError(`Error ${i}`, ErrorCategory.COMPUTATION));
    }
    
    const stats = aggregator.getStatistics();
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    expect(stats.total).toBe(5000);
    expect(duration).toBeLessThan(2000); // Should handle 5000 errors in less than 2000ms (adjusted for CI)
  });
});
