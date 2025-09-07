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
export var ServiceLifetime;
(function (ServiceLifetime) {
    ServiceLifetime["Singleton"] = "singleton";
    ServiceLifetime["Transient"] = "transient";
})(ServiceLifetime || (ServiceLifetime = {}));
/**
 * Circular dependency error with detailed context
 */
export class CircularDependencyError extends Error {
    constructor(dependencyChain, message) {
        super(message || `Circular dependency detected: ${dependencyChain.map(t => String(t)).join(' -> ')}`);
        this.dependencyChain = dependencyChain;
        this.name = 'CircularDependencyError';
    }
}
/**
 * Service not found error
 */
export class ServiceNotFoundError extends Error {
    constructor(token) {
        super(`Service not registered: ${String(token)}`);
        this.token = token;
        this.name = 'ServiceNotFoundError';
    }
}
/**
 * Maximum resolution depth exceeded error
 */
export class MaxDepthExceededError extends Error {
    constructor(maxDepth) {
        super(`Maximum resolution depth exceeded: ${maxDepth}`);
        this.maxDepth = maxDepth;
        this.name = 'MaxDepthExceededError';
    }
}
/**
 * IoC Container implementation with advanced features
 */
export class Container {
    constructor(options) {
        this.services = new Map();
        this.resolutionStack = [];
        this.metrics = {
            resolutions: 0,
            singletonCreations: 0,
            transientCreations: 0,
            circularDependencyChecks: 0,
            averageResolutionTime: 0,
            peakResolutionDepth: 0,
        };
        this.options = {
            enableCircularDependencyDetection: true,
            maxResolutionDepth: 50,
            enablePerformanceTracking: true,
        };
        if (options) {
            Object.assign(this.options, options);
        }
    }
    /**
     * Register a service with the container
     */
    register(token, factory, lifetime = ServiceLifetime.Transient, dependencies = []) {
        this.services.set(token, {
            token,
            factory,
            lifetime,
            dependencies,
        });
        return this;
    }
    /**
     * Register a singleton service
     */
    registerSingleton(token, factory, dependencies = []) {
        return this.register(token, factory, ServiceLifetime.Singleton, dependencies);
    }
    /**
     * Register a transient service
     */
    registerTransient(token, factory, dependencies = []) {
        return this.register(token, factory, ServiceLifetime.Transient, dependencies);
    }
    /**
     * Register a class with automatic dependency injection
     */
    registerClass(constructor, dependencies = [], lifetime = ServiceLifetime.Transient, token) {
        const serviceToken = token || constructor;
        const factory = (container) => {
            const resolvedDependencies = dependencies.map((dep) => container.resolve(dep));
            return new constructor(...resolvedDependencies);
        };
        return this.register(serviceToken, factory, lifetime, dependencies);
    }
    /**
     * Register an instance as a singleton
     */
    registerInstance(token, instance) {
        this.services.set(token, {
            token,
            factory: () => instance,
            lifetime: ServiceLifetime.Singleton,
            dependencies: [],
            singleton: instance,
        });
        return this;
    }
    /**
     * Resolve a service from the container
     */
    resolve(token) {
        const startTime = this.options.enablePerformanceTracking ? performance.now() : 0;
        try {
            this.metrics.resolutions++;
            const result = this.resolveInternal(token);
            if (this.options.enablePerformanceTracking) {
                const resolutionTime = performance.now() - startTime;
                this.updateAverageResolutionTime(resolutionTime);
            }
            return result;
        }
        catch (error) {
            this.resolutionStack.length = 0; // Clear stack on error
            throw error;
        }
    }
    /**
     * Internal resolution method with circular dependency detection
     */
    resolveInternal(token) {
        // Check resolution depth
        if (this.resolutionStack.length >= this.options.maxResolutionDepth) {
            throw new MaxDepthExceededError(this.options.maxResolutionDepth);
        }
        // Update peak resolution depth
        if (this.resolutionStack.length > this.metrics.peakResolutionDepth) {
            this.metrics.peakResolutionDepth = this.resolutionStack.length;
        }
        // Circular dependency detection
        if (this.options.enableCircularDependencyDetection) {
            this.metrics.circularDependencyChecks++;
            if (this.resolutionStack.includes(token)) {
                const circularChain = [...this.resolutionStack, token];
                throw new CircularDependencyError(circularChain);
            }
        }
        const registration = this.services.get(token);
        if (!registration) {
            throw new ServiceNotFoundError(token);
        }
        // Return singleton instance if already created
        if (registration.lifetime === ServiceLifetime.Singleton && registration.singleton) {
            return registration.singleton;
        }
        // Add to resolution stack
        this.resolutionStack.push(token);
        try {
            // Create new instance
            const instance = registration.factory(this);
            // Store singleton instance
            if (registration.lifetime === ServiceLifetime.Singleton) {
                registration.singleton = instance;
                this.metrics.singletonCreations++;
            }
            else {
                this.metrics.transientCreations++;
            }
            return instance;
        }
        finally {
            // Remove from resolution stack
            this.resolutionStack.pop();
        }
    }
    /**
     * Check if a service is registered
     */
    isRegistered(token) {
        return this.services.has(token);
    }
    /**
     * Unregister a service
     */
    unregister(token) {
        return this.services.delete(token);
    }
    /**
     * Clear all registrations
     */
    clear() {
        this.services.clear();
        this.resolutionStack.length = 0;
        this.resetMetrics();
    }
    /**
     * Get container performance metrics
     */
    getMetrics() {
        return { ...this.metrics };
    }
    /**
     * Reset performance metrics
     */
    resetMetrics() {
        this.metrics.resolutions = 0;
        this.metrics.singletonCreations = 0;
        this.metrics.transientCreations = 0;
        this.metrics.circularDependencyChecks = 0;
        this.metrics.averageResolutionTime = 0;
        this.metrics.peakResolutionDepth = 0;
    }
    /**
     * Get all registered service tokens
     */
    getRegisteredTokens() {
        return Array.from(this.services.keys());
    }
    /**
     * Create a child container with inherited registrations
     */
    createChild() {
        const child = new Container(this.options);
        // Copy all registrations to child
        for (const [token, registration] of this.services) {
            child.services.set(token, { ...registration });
        }
        return child;
    }
    /**
     * Dispose the container and clean up resources
     */
    dispose() {
        // Dispose all singleton instances that implement IDisposable
        for (const registration of this.services.values()) {
            if (registration.singleton && typeof registration.singleton === 'object') {
                const disposable = registration.singleton;
                if (typeof disposable.dispose === 'function') {
                    try {
                        disposable.dispose();
                    }
                    catch (error) {
                        console.warn(`Error disposing service ${String(registration.token)}:`, error);
                    }
                }
            }
        }
        this.clear();
    }
    /**
     * Update average resolution time metric
     */
    updateAverageResolutionTime(newTime) {
        const count = this.metrics.resolutions;
        const currentAverage = this.metrics.averageResolutionTime;
        this.metrics.averageResolutionTime = (currentAverage * (count - 1) + newTime) / count;
    }
}
/**
 * Global container instance
 */
export const container = new Container();
/**
 * Helper function to create service tokens
 */
export function createToken(description) {
    return Symbol(description);
}
//# sourceMappingURL=Container.js.map