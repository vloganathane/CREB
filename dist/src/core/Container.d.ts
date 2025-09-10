/**
 * CREB-JS Dependency Injection Container
 *
 * A lightweight, type-safe IoC container for managing dependencies
 * with support for singleton/transient lifetimes, constructor injection,
 * and circular dependency detection.
 *
 * @author Loganathane Virassamy
 * @version 1.6.0
 */
import 'reflect-metadata';
/**
 * Service lifetime enumeration
 */
export declare enum ServiceLifetime {
    Singleton = "singleton",
    Transient = "transient"
}
/**
 * Unique token type for dependency identification
 */
export type ServiceToken<T = any> = string | symbol | (new (...args: any[]) => T);
/**
 * Factory function type for creating service instances
 */
export type ServiceFactory<T = any> = (container: Container) => T;
/**
 * Constructor type with dependency metadata
 */
export type Constructor<T = any> = new (...args: any[]) => T;
/**
 * Service registration configuration
 */
export interface ServiceRegistration<T = any> {
    token: ServiceToken<T>;
    factory: ServiceFactory<T>;
    lifetime: ServiceLifetime;
    dependencies: ServiceToken[];
    singleton?: T;
}
/**
 * Container configuration options
 */
export interface ContainerOptions {
    enableCircularDependencyDetection: boolean;
    maxResolutionDepth: number;
    enablePerformanceTracking: boolean;
}
/**
 * Circular dependency error with detailed context
 */
export declare class CircularDependencyError extends Error {
    readonly dependencyChain: ServiceToken[];
    constructor(dependencyChain: ServiceToken[], message?: string);
}
/**
 * Service not found error
 */
export declare class ServiceNotFoundError extends Error {
    readonly token: ServiceToken;
    constructor(token: ServiceToken);
}
/**
 * Maximum resolution depth exceeded error
 */
export declare class MaxDepthExceededError extends Error {
    readonly maxDepth: number;
    constructor(maxDepth: number);
}
/**
 * Performance metrics for container operations
 */
export interface ContainerMetrics {
    resolutions: number;
    singletonCreations: number;
    transientCreations: number;
    circularDependencyChecks: number;
    averageResolutionTime: number;
    peakResolutionDepth: number;
}
/**
 * IoC Container implementation with advanced features
 */
export declare class Container {
    private readonly services;
    private readonly resolutionStack;
    private readonly metrics;
    private readonly options;
    constructor(options?: Partial<ContainerOptions>);
    /**
     * Register a service with the container
     */
    register<T>(token: ServiceToken<T>, factory: ServiceFactory<T>, lifetime?: ServiceLifetime, dependencies?: ServiceToken[]): this;
    /**
     * Register a singleton service
     */
    registerSingleton<T>(token: ServiceToken<T>, factory: ServiceFactory<T>, dependencies?: ServiceToken[]): this;
    /**
     * Register a transient service
     */
    registerTransient<T>(token: ServiceToken<T>, factory: ServiceFactory<T>, dependencies?: ServiceToken[]): this;
    /**
     * Register a class with automatic dependency injection
     */
    registerClass<T>(constructor: Constructor<T>, dependencies?: ServiceToken[], lifetime?: ServiceLifetime, token?: ServiceToken<T>): this;
    /**
     * Register an instance as a singleton
     */
    registerInstance<T>(token: ServiceToken<T>, instance: T): this;
    /**
     * Resolve a service from the container
     */
    resolve<T>(token: ServiceToken<T>): T;
    /**
     * Internal resolution method with circular dependency detection
     */
    private resolveInternal;
    /**
     * Check if a service is registered
     */
    isRegistered<T>(token: ServiceToken<T>): boolean;
    /**
     * Unregister a service
     */
    unregister<T>(token: ServiceToken<T>): boolean;
    /**
     * Clear all registrations
     */
    clear(): void;
    /**
     * Get container performance metrics
     */
    getMetrics(): Readonly<ContainerMetrics>;
    /**
     * Reset performance metrics
     */
    resetMetrics(): void;
    /**
     * Get all registered service tokens
     */
    getRegisteredTokens(): ServiceToken[];
    /**
     * Create a child container with inherited registrations
     */
    createChild(): Container;
    /**
     * Dispose the container and clean up resources
     */
    dispose(): void;
    /**
     * Update average resolution time metric
     */
    private updateAverageResolutionTime;
}
/**
 * Global container instance
 */
export declare const container: Container;
/**
 * Helper function to create service tokens
 */
export declare function createToken<T>(description: string): ServiceToken<T>;
/**
 * Interface for disposable services
 */
export interface IDisposable {
    dispose(): void | Promise<void>;
}
//# sourceMappingURL=Container.d.ts.map