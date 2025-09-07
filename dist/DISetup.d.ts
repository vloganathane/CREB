/**
 * CREB-JS Dependency Injection Setup
 *
 * Central configuration for all dependency injection services in CREB-JS.
 * This module sets up and configures the main DI container with all services.
 *
 * @author Loganathane Virassamy
 * @version 1.6.0
 */
import { Container, type ServiceToken } from './core/Container';
import { ConfigManager } from './config/ConfigManager';
import { ChemicalEquationBalancer } from './balancer';
import { EnhancedChemicalEquationBalancer } from './enhancedBalancer';
import { Stoichiometry } from './stoichiometry';
import { ThermodynamicsCalculator } from './thermodynamics/calculator';
import { SQLiteStorageProvider } from './data/SQLiteStorageProvider';
import { AdvancedCache } from './performance/cache/AdvancedCache';
import { WorkerPool } from './performance/workers/WorkerPool';
import { TaskQueue } from './performance/workers/TaskQueue';
export declare const IConfigManagerToken: ServiceToken<ConfigManager>;
export declare const IBalancerToken: ServiceToken<ChemicalEquationBalancer>;
export declare const IEnhancedBalancerToken: ServiceToken<EnhancedChemicalEquationBalancer>;
export declare const IStoichiometryToken: ServiceToken<Stoichiometry>;
export declare const IThermodynamicsCalculatorToken: ServiceToken<ThermodynamicsCalculator>;
export declare const IStorageProviderToken: ServiceToken<SQLiteStorageProvider>;
export declare const ICacheToken: ServiceToken<AdvancedCache<any>>;
export declare const IWorkerPoolToken: ServiceToken<WorkerPool>;
export declare const ITaskQueueToken: ServiceToken<TaskQueue>;
/**
 * Configure and setup the main CREB DI container
 */
export declare function setupCREBContainer(): Container;
/**
 * Initialize the global CREB container with default services
 */
export declare function initializeCREBDI(): void;
/**
 * Get a service from the global container with type safety
 */
export declare function getService<T>(token: ServiceToken<T>): T;
/**
 * Create a child container for testing or isolation
 */
export declare function createChildContainer(): Container;
/**
 * Helper functions for common services
 */
export declare const CREBServices: {
    getConfigManager: () => ConfigManager;
    getBalancer: () => ChemicalEquationBalancer;
    getEnhancedBalancer: () => EnhancedChemicalEquationBalancer;
    getStoichiometry: () => Stoichiometry;
    getThermodynamicsCalculator: () => ThermodynamicsCalculator;
    getStorageProvider: () => SQLiteStorageProvider;
    getCache: () => AdvancedCache<any>;
};
//# sourceMappingURL=DISetup.d.ts.map