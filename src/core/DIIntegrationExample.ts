/**
 * CREB-JS Dependency Injection Integration Example
 * 
 * Demonstrates how to integrate the new DI container with existing
 * CREB-JS components for better testability and modularity.
 * 
 * @author Loganathane Virassamy
 * @version 1.6.0
 */

import {
  Container,
  createToken,
  ServiceLifetime,
  type ServiceToken
} from '../core/Container';
import { Injectable, Singleton } from '../core/decorators/Injectable';

// Define service tokens for better type safety
const ILoggerToken = createToken<ILogger>('ILogger');
const ICacheToken = createToken<ICache>('ICache');
const ICalculatorToken = createToken<ICalculator>('ICalculator');

// Service interfaces
interface ILogger {
  info(message: string): void;
  warn(message: string): void;
  error(message: string): void;
}

interface ICache {
  get(key: string): any;
  set(key: string, value: any): void;
  clear(): void;
}

interface ICalculator {
  calculate(equation: string): any;
}

// Enhanced service implementations with DI support
@Injectable()
class EnhancedLogger implements ILogger {
  private prefix = '[CREB-JS]';

  info(message: string): void {
    console.log(`${this.prefix} INFO: ${message}`);
  }

  warn(message: string): void {
    console.warn(`${this.prefix} WARN: ${message}`);
  }

  error(message: string): void {
    console.error(`${this.prefix} ERROR: ${message}`);
  }
}

@Injectable()
class SimpleCache implements ICache {
  private cache = new Map<string, any>();

  get(key: string): any {
    return this.cache.get(key);
  }

  set(key: string, value: any): void {
    this.cache.set(key, value);
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}

@Injectable()
class CachedCalculator implements ICalculator {
  constructor(
    private cache: ICache,
    private logger: ILogger
  ) {}

  calculate(equation: string): any {
    this.logger.info(`Calculating: ${equation}`);

    // Check cache first
    const cached = this.cache.get(equation);
    if (cached) {
      this.logger.info('Using cached result');
      return cached;
    }

    // Simulate calculation
    const result = {
      equation,
      coefficients: [1, 1, 1, 1], // Simplified
      isBalanced: true,
      timestamp: new Date().toISOString(),
    };

    // Cache the result
    this.cache.set(equation, result);
    this.logger.info('Result calculated and cached');

    return result;
  }
}

/**
 * Application service composition using DI container
 */
@Singleton()
class CREBApplication {
  constructor(
    private calculator: ICalculator,
    private cache: ICache,
    private logger: ILogger
  ) {}

  async initialize(): Promise<void> {
    this.logger.info('Initializing CREB-JS application with DI container');
    this.cache.clear();
    this.logger.info('Application initialized successfully');
  }

  processReaction(equation: string): any {
    this.logger.info(`Processing reaction: ${equation}`);
    
    try {
      const result = this.calculator.calculate(equation);
      this.logger.info('Reaction processed successfully');
      return result;
    } catch (error) {
      this.logger.error(`Failed to process reaction: ${error}`);
      throw error;
    }
  }

  getCacheStats(): { size: number } {
    return {
      size: (this.cache as SimpleCache).size(),
    };
  }
}

/**
 * Container configuration and setup
 */
export function setupDIContainer(): Container {
  const container = new Container({
    enableCircularDependencyDetection: true,
    enablePerformanceTracking: true,
    maxResolutionDepth: 50,
  });

  // Register services using manual dependency specification
  container.registerClass(EnhancedLogger, [], ServiceLifetime.Singleton, ILoggerToken);
  container.registerClass(SimpleCache, [], ServiceLifetime.Singleton, ICacheToken);
  
  container.registerClass(
    CachedCalculator,
    [ICacheToken, ILoggerToken],
    ServiceLifetime.Singleton,
    ICalculatorToken
  );

  container.registerClass(
    CREBApplication,
    [ICalculatorToken, ICacheToken, ILoggerToken],
    ServiceLifetime.Singleton
  );

  return container;
}

/**
 * Example usage demonstrating the DI container benefits
 */
export async function demonstrateDIIntegration(): Promise<void> {
  console.log('🧪 CREB-JS Dependency Injection Integration Demo\n');

  // Setup container
  const container = setupDIContainer();

  // Get application instance
  const app = container.resolve(CREBApplication);
  
  // Initialize
  await app.initialize();

  // Process some reactions
  const reactions = [
    'H2 + O2 = H2O',
    'CH4 + 2O2 = CO2 + 2H2O',
    'H2 + O2 = H2O', // Duplicate to test caching
    'C6H12O6 + 6O2 = 6CO2 + 6H2O'
  ];

  console.log('📊 Processing reactions with DI-enhanced services:\n');

  for (const reaction of reactions) {
    try {
      console.log(`⚗️  Processing: ${reaction}`);
      const result = app.processReaction(reaction);
      console.log(`✅ Result: ${result.isBalanced ? 'Balanced' : 'Not balanced'}`);
      console.log(`   Coefficients: [${result.coefficients.join(', ')}]\n`);
    } catch (error) {
      console.log(`❌ Error: ${error}\n`);
    }
  }

  // Show cache stats
  const cacheStats = app.getCacheStats();
  console.log(`💾 Cache Statistics: ${cacheStats.size} cached results`);

  // Show container metrics
  const metrics = container.getMetrics();
  console.log('\n📈 Container Performance Metrics:');
  console.log(`   Resolutions: ${metrics.resolutions}`);
  console.log(`   Singletons Created: ${metrics.singletonCreations}`);
  console.log(`   Average Resolution Time: ${metrics.averageResolutionTime.toFixed(2)}ms`);
  console.log(`   Peak Resolution Depth: ${metrics.peakResolutionDepth}`);

  // Demonstrate child container
  console.log('\n🔧 Testing child container inheritance:');
  const childContainer = container.createChild();
  const childApp = childContainer.resolve(CREBApplication);
  console.log(`   Child app cache size: ${childApp.getCacheStats().size}`);

  // Clean up
  container.dispose();
  console.log('\n🧹 Container disposed and resources cleaned up');
}

/**
 * Testing benefits with DI - Mock implementations
 */
class MockLogger implements ILogger {
  public logs: string[] = [];

  info(message: string): void {
    this.logs.push(`INFO: ${message}`);
  }

  warn(message: string): void {
    this.logs.push(`WARN: ${message}`);
  }

  error(message: string): void {
    this.logs.push(`ERROR: ${message}`);
  }
}

export function createTestContainer(): Container {
  const container = new Container();

  // Register mock implementations for testing
  container.registerInstance(ILoggerToken, new MockLogger());
  container.registerClass(SimpleCache, [], ServiceLifetime.Singleton, ICacheToken);
  
  container.registerClass(
    CachedCalculator,
    [ICacheToken, ILoggerToken],
    ServiceLifetime.Singleton,
    ICalculatorToken
  );

  container.registerClass(
    CREBApplication,
    [ICalculatorToken, ICacheToken, ILoggerToken],
    ServiceLifetime.Singleton
  );

  return container;
}

// Export tokens for use in other modules
export {
  ILoggerToken,
  ICacheToken,
  ICalculatorToken,
  CREBApplication,
  CachedCalculator,
  EnhancedLogger,
  SimpleCache,
  MockLogger,
};

// Run demo if called directly
if (require.main === module) {
  demonstrateDIIntegration().catch(console.error);
}
