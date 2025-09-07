/**
 * CREB-JS Dependency Injection Integration Example
 *
 * Demonstrates how to integrate the new DI container with existing
 * CREB-JS components for better testability and modularity.
 *
 * @author Loganathane Virassamy
 * @version 1.6.0
 */
import { Container, type ServiceToken } from '../core/Container';
declare const ILoggerToken: ServiceToken<ILogger>;
declare const ICacheToken: ServiceToken<ICache>;
declare const ICalculatorToken: ServiceToken<ICalculator>;
interface ILogger {
    info(message: string): void;
    warn(message: string): void;
    error(message: string): void;
}
interface ICache {
    get(key: string): Promise<any>;
    set(key: string, value: any): Promise<void>;
    clear(): Promise<void>;
}
interface ICalculator {
    calculate(equation: string): any;
}
declare class EnhancedLogger implements ILogger {
    private prefix;
    info(message: string): void;
    warn(message: string): void;
    error(message: string): void;
}
declare class SimpleCache implements ICache {
    private cache;
    get(key: string): Promise<any>;
    set(key: string, value: any): Promise<void>;
    clear(): Promise<void>;
    size(): number;
}
declare class CachedCalculator implements ICalculator {
    private cache;
    private logger;
    constructor(cache: ICache, logger: ILogger);
    calculate(equation: string): any;
}
/**
 * Application service composition using DI container
 */
declare class CREBApplication {
    private calculator;
    private cache;
    private logger;
    constructor(calculator: ICalculator, cache: ICache, logger: ILogger);
    initialize(): Promise<void>;
    processReaction(equation: string): any;
    getCacheStats(): {
        size: number;
    };
}
/**
 * Container configuration and setup
 */
export declare function setupDIContainer(): Container;
/**
 * Example usage demonstrating the DI container benefits
 */
export declare function demonstrateDIIntegration(): Promise<void>;
/**
 * Testing benefits with DI - Mock implementations
 */
declare class MockLogger implements ILogger {
    logs: string[];
    info(message: string): void;
    warn(message: string): void;
    error(message: string): void;
}
export declare function createTestContainer(): Container;
export { ILoggerToken, ICacheToken, ICalculatorToken, CREBApplication, CachedCalculator, EnhancedLogger, SimpleCache, MockLogger, };
//# sourceMappingURL=DIIntegrationExample.d.ts.map