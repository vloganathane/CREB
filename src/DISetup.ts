/**
 * CREB-JS Dependency Injection Setup
 * 
 * Central configuration for all dependency injection services in CREB-JS.
 * This module sets up and configures the main DI container with all services.
 * 
 * @author Loganathane Virassamy
 * @version 1.6.0
 */

import {
  Container,
  createToken,
  ServiceLifetime,
  type ServiceToken,
  container as globalContainer
} from './core/Container';

// Core Services
import { ConfigManager } from './config/ConfigManager';
import { ChemicalEquationBalancer } from './balancer';
import { EnhancedChemicalEquationBalancer } from './enhancedBalancer';
import { Stoichiometry } from './stoichiometry';
import { ThermodynamicsCalculator } from './thermodynamics/calculator';
import { SQLiteStorageProvider } from './data/SQLiteStorageProvider';
import { AdvancedCache } from './performance/cache/AdvancedCache';
import { WorkerPool } from './performance/workers/WorkerPool';
import { TaskQueue } from './performance/workers/TaskQueue';

// Service Tokens
export const IConfigManagerToken = createToken<ConfigManager>('IConfigManager');
export const IBalancerToken = createToken<ChemicalEquationBalancer>('IBalancer');
export const IEnhancedBalancerToken = createToken<EnhancedChemicalEquationBalancer>('IEnhancedBalancer');
export const IStoichiometryToken = createToken<Stoichiometry>('IStoichiometry');
export const IThermodynamicsCalculatorToken = createToken<ThermodynamicsCalculator>('IThermodynamicsCalculator');
export const IStorageProviderToken = createToken<SQLiteStorageProvider>('IStorageProvider');
export const ICacheToken = createToken<AdvancedCache>('ICache');
export const IWorkerPoolToken = createToken<WorkerPool>('IWorkerPool');
export const ITaskQueueToken = createToken<TaskQueue>('ITaskQueue');

/**
 * Configure and setup the main CREB DI container
 */
export function setupCREBContainer(): Container {
  const container = new Container({
    enableCircularDependencyDetection: true,
    enablePerformanceTracking: true,
    maxResolutionDepth: 50,
  });

  // Register Core Services as Singletons
  container.registerClass(
    ConfigManager,
    [],
    ServiceLifetime.Singleton,
    IConfigManagerToken
  );

  container.registerClass(
    AdvancedCache,
    [],
    ServiceLifetime.Singleton,
    ICacheToken
  );

  container.registerClass(
    SQLiteStorageProvider,
    [],
    ServiceLifetime.Singleton,
    IStorageProviderToken
  );

  container.registerClass(
    ThermodynamicsCalculator,
    [],
    ServiceLifetime.Singleton,
    IThermodynamicsCalculatorToken
  );

  // Register Worker Thread Services (commented out due to ESM compatibility issues)
  // container.registerClass(
  //   TaskQueue,
  //   [],
  //   ServiceLifetime.Singleton,
  //   ITaskQueueToken
  // );

  // container.registerClass(
  //   WorkerPool,
  //   [],
  //   ServiceLifetime.Singleton,
  //   IWorkerPoolToken
  // );

  // Register Calculation Services as Transient (stateless)
  container.registerClass(
    ChemicalEquationBalancer,
    [],
    ServiceLifetime.Transient,
    IBalancerToken
  );

  container.registerClass(
    EnhancedChemicalEquationBalancer,
    [],
    ServiceLifetime.Transient,
    IEnhancedBalancerToken
  );

  container.registerClass(
    Stoichiometry,
    [],
    ServiceLifetime.Transient,
    IStoichiometryToken
  );

  return container;
}

/**
 * Initialize the global CREB container with default services
 */
export function initializeCREBDI(): void {
  const container = setupCREBContainer();
  
  // Copy registrations to global container
  for (const token of container.getRegisteredTokens()) {
    if (!globalContainer.isRegistered(token)) {
      // Re-register in global container
      const registration = (container as any).services.get(token);
      if (registration) {
        globalContainer.register(
          token,
          registration.factory,
          registration.lifetime,
          registration.dependencies
        );
      }
    }
  }
}

/**
 * Get a service from the global container with type safety
 */
export function getService<T>(token: ServiceToken<T>): T {
  return globalContainer.resolve(token);
}

/**
 * Create a child container for testing or isolation
 */
export function createChildContainer(): Container {
  return globalContainer.createChild();
}

/**
 * Helper functions for common services
 */
export const CREBServices = {
  getConfigManager: () => getService(IConfigManagerToken),
  getBalancer: () => getService(IBalancerToken),
  getEnhancedBalancer: () => getService(IEnhancedBalancerToken),
  getStoichiometry: () => getService(IStoichiometryToken),
  getThermodynamicsCalculator: () => getService(IThermodynamicsCalculatorToken),
  getStorageProvider: () => getService(IStorageProviderToken),
  getCache: () => getService(ICacheToken),
  // getWorkerPool: () => getService(IWorkerPoolToken),      // Commented out due to ESM issues
  // getTaskQueue: () => getService(ITaskQueueToken),        // Commented out due to ESM issues
};

/**
 * Initialize DI on module load for production usage
 */
if (typeof process !== 'undefined' && process.env.NODE_ENV !== 'test') {
  initializeCREBDI();
}
