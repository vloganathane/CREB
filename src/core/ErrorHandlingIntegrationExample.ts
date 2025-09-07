/**
 * Enhanced Error Handling Integration Example
 * Demonstrates how to use circuit breakers, retry policies, and structured errors
 * in real-world scenarios within CREB-JS
 */

import {
  CREBError,
  ErrorCategory,
  ErrorSeverity,
  ExternalAPIError,
  NetworkError,
  ErrorAggregator,
  ErrorUtils
} from './errors/CREBError';

import {
  CircuitBreaker,
  CircuitBreakerManager,
  circuitBreakerManager,
  CircuitBreakerState
} from './resilience/CircuitBreaker';

import {
  RetryPolicy,
  RetryPolicies,
  RetryStrategy,
  RateLimiter
} from './resilience/RetryPolicy';

/**
 * Example: Enhanced NIST Integration with Error Handling
 */
export class EnhancedNISTIntegration {
  private circuitBreaker: CircuitBreaker;
  private retryPolicy: RetryPolicy;
  private errorAggregator: ErrorAggregator;

  constructor() {
    // Configure circuit breaker for NIST API
    this.circuitBreaker = circuitBreakerManager.getBreaker('nist-api', {
      failureThreshold: 5,
      failureRate: 30,
      monitoringWindow: 60000, // 1 minute
      timeout: 30000, // 30 seconds
      successThreshold: 3,
      minimumCalls: 10,
      onStateChange: (newState: CircuitBreakerState, oldState: CircuitBreakerState) => {
        console.log(`NIST Circuit Breaker: ${oldState} → ${newState}`);
      },
      onCircuitOpen: (error: any) => {
        console.error('NIST API circuit breaker opened:', error);
      },
      onCircuitClose: () => {
        console.log('NIST API circuit breaker closed - service recovered');
      }
    });

    // Configure retry policy with rate limiting
    this.retryPolicy = RetryPolicies.network(60); // 60 requests per minute

    // Error aggregator for monitoring
    this.errorAggregator = new ErrorAggregator(500);
  }

  /**
   * Get thermodynamic data with full error handling
   */
  async getThermodynamicData(compoundName: string): Promise<any> {
    const operation = async () => {
      try {
        // Simulate NIST API call
        const response = await this.makeNISTRequest(`/thermo/search?name=${encodeURIComponent(compoundName)}`);
        return response;
      } catch (error) {
        // Transform error into appropriate CREB error type
        if (error instanceof Error && error.message.includes('network')) {
          throw new NetworkError(
            'Failed to connect to NIST database',
            { compoundName, operation: 'getThermodynamicData' },
            { url: 'https://webbook.nist.gov/cgi/cbook.cgi', method: 'GET' }
          );
        } else if (error instanceof Error && error.message.includes('429')) {
          throw new ExternalAPIError(
            'NIST API rate limit exceeded',
            'NIST',
            { compoundName },
            { statusCode: 429, rateLimited: true }
          );
        } else {
          throw new ExternalAPIError(
            'NIST API request failed',
            'NIST',
            { compoundName },
            { statusCode: 500 }
          );
        }
      }
    };

    try {
      // Apply circuit breaker and retry policy
      const result = await this.circuitBreaker.execute(async () => {
        const retryResult = await this.retryPolicy.execute(operation);
        if (retryResult.succeeded) {
          return retryResult.result;
        } else {
          throw retryResult.finalError;
        }
      });

      return result;
    } catch (error) {
      const crebError = ErrorUtils.transformUnknownError(error);
      this.errorAggregator.addError(crebError);
      throw crebError;
    }
  }

  /**
   * Simulated NIST API request (would be real HTTP request in production)
   */
  private async makeNISTRequest(endpoint: string): Promise<any> {
    // Simulate various failure scenarios for demonstration
    const random = Math.random();
    
    if (random < 0.1) {
      throw new Error('network timeout');
    } else if (random < 0.15) {
      throw new Error('HTTP 429 rate limit');
    } else if (random < 0.2) {
      throw new Error('HTTP 500 server error');
    }

    // Simulate successful response
    return {
      compound: endpoint.split('name=')[1],
      thermodynamicData: {
        enthalpy: -393.5,
        entropy: 213.8,
        gibbs: -394.4
      }
    };
  }

  /**
   * Get error statistics and health metrics
   */
  getHealthMetrics(): {
    circuitBreaker: any;
    errors: any;
    retryMetrics: any;
  } {
    return {
      circuitBreaker: this.circuitBreaker.getMetrics(),
      errors: this.errorAggregator.getStatistics(),
      retryMetrics: {
        // In a real implementation, you'd track retry metrics
        totalRetries: 0,
        successAfterRetry: 0,
        ultimateFailures: 0
      }
    };
  }
}

/**
 * Example: Enhanced PubChem Integration with Error Handling
 */
export class EnhancedPubChemIntegration {
  private circuitBreaker: CircuitBreaker;
  private retryPolicy: RetryPolicy;
  private rateLimiter: RateLimiter;

  constructor() {
    // PubChem has stricter rate limits
    this.rateLimiter = new RateLimiter(5, 1000); // 5 requests per second

    this.circuitBreaker = circuitBreakerManager.getBreaker('pubchem-api', {
      failureThreshold: 3,
      failureRate: 25,
      monitoringWindow: 60000,
      timeout: 60000, // Longer timeout for PubChem
      successThreshold: 2,
      minimumCalls: 5
    });

    this.retryPolicy = new RetryPolicy({
      maxAttempts: 4,
      initialDelay: 2000, // Start with 2 second delay
      maxDelay: 30000,
      strategy: RetryStrategy.EXPONENTIAL_BACKOFF_JITTER,
      backoffMultiplier: 2,
      jitterFactor: 0.2,
      shouldRetry: (error: any, attempt: number) => {
        if (error instanceof ExternalAPIError) {
          // Always retry rate limits, retry 5xx errors, don't retry 4xx (except 429)
          if (error.metadata.category === ErrorCategory.RATE_LIMIT) return true;
          const statusCode = error.metadata.context.statusCode;
          return statusCode >= 500 || statusCode === 429;
        }
        return ErrorUtils.isTransientError(error) && attempt < 4;
      },
      onRetry: (error: any, attempt: number, delay: number) => {
        console.log(`PubChem retry attempt ${attempt} after ${delay}ms: ${error.message}`);
      }
    }, this.rateLimiter);
  }

  /**
   * Search for compounds with enhanced error handling
   */
  async searchCompounds(query: string): Promise<any[]> {
    const operation = async () => {
      // Simulate API call
      return this.makePubChemRequest(`/compound/name/${encodeURIComponent(query)}/JSON`);
    };

    return this.circuitBreaker.execute(async () => {
      const result = await this.retryPolicy.execute(operation);
      if (result.succeeded) {
        return result.result;
      } else {
        throw result.finalError;
      }
    });
  }

  private async makePubChemRequest(endpoint: string): Promise<any> {
    // Simulate PubChem API behavior
    const random = Math.random();
    
    if (random < 0.05) {
      throw new ExternalAPIError(
        'PubChem service temporarily unavailable',
        'PubChem',
        { endpoint },
        { statusCode: 503 }
      );
    } else if (random < 0.1) {
      throw new ExternalAPIError(
        'PubChem rate limit exceeded',
        'PubChem',
        { endpoint },
        { statusCode: 429, rateLimited: true }
      );
    }

    // Simulate successful response
    return [
      {
        CID: 12345,
        name: endpoint.split('/')[3],
        molecularFormula: 'C6H12O6',
        molecularWeight: 180.16
      }
    ];
  }
}

/**
 * Example: Enhanced SQLite Storage with Error Handling
 */
export class EnhancedSQLiteStorage {
  private retryPolicy: RetryPolicy;
  private errorAggregator: ErrorAggregator;

  constructor() {
    // Database operations use specialized retry policy
    this.retryPolicy = RetryPolicies.database();
    this.errorAggregator = new ErrorAggregator(100);
  }

  /**
   * Store data with retry logic for transient database failures
   */
  async storeData(table: string, data: any): Promise<void> {
    const operation = async () => {
      // Simulate database operation
      await this.executeDatabaseOperation('INSERT', table, data);
    };

    try {
      const result = await this.retryPolicy.execute(operation);
      if (!result.succeeded) {
        throw result.finalError;
      }
    } catch (error) {
      const crebError = ErrorUtils.transformUnknownError(error);
      this.errorAggregator.addError(crebError);
      throw crebError;
    }
  }

  private async executeDatabaseOperation(operation: string, table: string, data: any): Promise<void> {
    // Simulate various database failure scenarios
    const random = Math.random();
    
    if (random < 0.02) {
      throw new Error('database connection timeout');
    } else if (random < 0.03) {
      throw new Error('deadlock detected');
    } else if (random < 0.04) {
      throw new Error('temporary failure in writing to disk');
    }

    // Simulate successful operation
    console.log(`Database ${operation} on ${table} completed successfully`);
  }
}

/**
 * Example: System Health Monitor using Error Handling Components
 */
export class SystemHealthMonitor {
  private errorAggregator: ErrorAggregator;
  private circuitBreakerManager: CircuitBreakerManager;

  constructor() {
    this.errorAggregator = new ErrorAggregator(1000);
    this.circuitBreakerManager = circuitBreakerManager;
  }

  /**
   * Monitor system health and provide detailed status
   */
  getSystemHealth(): {
    overall: 'healthy' | 'degraded' | 'critical';
    services: any;
    errors: any;
    recommendations: string[];
  } {
    const circuitBreakerHealth = this.circuitBreakerManager.getHealthStatus();
    const errorStats = this.errorAggregator.getStatistics();
    
    // Determine overall health
    let overall: 'healthy' | 'degraded' | 'critical' = 'healthy';
    if (circuitBreakerHealth.failed.length > 0) {
      overall = 'critical';
    } else if (circuitBreakerHealth.degraded.length > 0 || errorStats.bySeverity.HIGH > 5) {
      overall = 'degraded';
    }

    // Generate recommendations
    const recommendations: string[] = [];
    if (circuitBreakerHealth.failed.length > 0) {
      recommendations.push(`${circuitBreakerHealth.failed.length} service(s) are failing: ${circuitBreakerHealth.failed.join(', ')}`);
    }
    if (errorStats.bySeverity.CRITICAL > 0) {
      recommendations.push(`${errorStats.bySeverity.CRITICAL} critical error(s) detected - immediate attention required`);
    }
    if (errorStats.retryableCount > errorStats.total * 0.7) {
      recommendations.push('High percentage of retryable errors suggests network or external service issues');
    }

    return {
      overall,
      services: {
        total: circuitBreakerHealth.total,
        healthy: circuitBreakerHealth.healthy.length,
        degraded: circuitBreakerHealth.degraded.length,
        failed: circuitBreakerHealth.failed.length,
        details: this.circuitBreakerManager.getAllMetrics()
      },
      errors: errorStats,
      recommendations
    };
  }

  /**
   * Add error to monitoring
   */
  reportError(error: CREBError): void {
    this.errorAggregator.addError(error);
  }

  /**
   * Clear error history
   */
  clearErrorHistory(): void {
    this.errorAggregator.clear();
  }
}

/**
 * Example: Graceful Degradation Service
 */
export class GracefulDegradationService {
  private nistIntegration: EnhancedNISTIntegration;
  private pubchemIntegration: EnhancedPubChemIntegration;
  private localCache: Map<string, any>;

  constructor() {
    this.nistIntegration = new EnhancedNISTIntegration();
    this.pubchemIntegration = new EnhancedPubChemIntegration();
    this.localCache = new Map();
  }

  /**
   * Get thermodynamic data with graceful degradation
   */
  async getThermodynamicDataWithFallback(compoundName: string): Promise<{
    data: any;
    source: 'nist' | 'pubchem' | 'cache' | 'estimated';
    confidence: number;
  }> {
    // Try cache first
    const cachedData = this.localCache.get(compoundName);
    if (cachedData) {
      return {
        data: cachedData,
        source: 'cache',
        confidence: 0.9
      };
    }

    // Try NIST (primary source)
    try {
      const nistData = await this.nistIntegration.getThermodynamicData(compoundName);
      this.localCache.set(compoundName, nistData);
      return {
        data: nistData,
        source: 'nist',
        confidence: 1.0
      };
    } catch (error) {
      console.warn(`NIST failed for ${compoundName}:`, error instanceof CREBError ? error.getDescription() : error);
    }

    // Try PubChem (secondary source)
    try {
      const pubchemData = await this.pubchemIntegration.searchCompounds(compoundName);
      const estimatedThermoData = this.estimateThermodynamicData(pubchemData[0]);
      this.localCache.set(compoundName, estimatedThermoData);
      return {
        data: estimatedThermoData,
        source: 'pubchem',
        confidence: 0.7
      };
    } catch (error) {
      console.warn(`PubChem failed for ${compoundName}:`, error instanceof CREBError ? error.getDescription() : error);
    }

    // Fallback to estimation
    const estimatedData = this.estimateThermodynamicData({ name: compoundName });
    return {
      data: estimatedData,
      source: 'estimated',
      confidence: 0.3
    };
  }

  private estimateThermodynamicData(compoundInfo: any): any {
    // Simple estimation logic (would be more sophisticated in real implementation)
    return {
      compound: compoundInfo.name,
      thermodynamicData: {
        enthalpy: -200, // Estimated values
        entropy: 150,
        gibbs: -180
      },
      note: 'Estimated values - use with caution'
    };
  }
}

// Example usage and testing
export async function demonstrateEnhancedErrorHandling(): Promise<void> {
  console.log('=== Enhanced Error Handling Demo ===\n');

  // Create service instances
  const nistService = new EnhancedNISTIntegration();
  const healthMonitor = new SystemHealthMonitor();
  const degradationService = new GracefulDegradationService();

  // Test successful operation
  console.log('1. Testing successful operation:');
  try {
    const data = await nistService.getThermodynamicData('water');
    console.log('✓ Successfully retrieved data:', data);
  } catch (error) {
    console.log('✗ Operation failed:', error instanceof CREBError ? error.getDescription() : error);
  }

  // Test multiple operations to trigger various error scenarios
  console.log('\n2. Testing multiple operations (some may fail):');
  const compounds = ['methane', 'ethane', 'propane', 'butane', 'pentane'];
  
  for (const compound of compounds) {
    try {
      const result = await degradationService.getThermodynamicDataWithFallback(compound);
      console.log(`✓ ${compound}: Got data from ${result.source} (confidence: ${result.confidence})`);
    } catch (error) {
      console.log(`✗ ${compound}: Failed completely:`, error instanceof CREBError ? error.getDescription() : error);
      if (error instanceof CREBError) {
        healthMonitor.reportError(error);
      }
    }
  }

  // Display system health
  console.log('\n3. System Health Status:');
  const health = healthMonitor.getSystemHealth();
  console.log(`Overall Status: ${health.overall.toUpperCase()}`);
  console.log(`Services: ${health.services.healthy}/${health.services.total} healthy`);
  console.log(`Recent Errors: ${health.errors.total} (${health.errors.retryableCount} retryable)`);
  
  if (health.recommendations.length > 0) {
    console.log('Recommendations:');
    health.recommendations.forEach(rec => console.log(`  • ${rec}`));
  }

  // Display detailed metrics
  console.log('\n4. Detailed Service Metrics:');
  const nistMetrics = nistService.getHealthMetrics();
  console.log('NIST Circuit Breaker:', nistMetrics.circuitBreaker);
  console.log('Error Statistics:', nistMetrics.errors);
}
