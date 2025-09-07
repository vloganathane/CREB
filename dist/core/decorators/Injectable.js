/**
 * Injectable decorator and related types for dependency injection
 *
 * Provides decorators and metadata for automatic dependency injection
 * in the CREB-JS container system.
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
 * Metadata key for injectable services
 */
export const INJECTABLE_METADATA_KEY = Symbol.for('injectable');
/**
 * Metadata key for constructor parameters
 */
export const PARAM_TYPES_METADATA_KEY = 'design:paramtypes';
/**
 * Injectable class decorator
 *
 * Marks a class as injectable and provides metadata for dependency injection.
 *
 * @param options Optional configuration for the injectable service
 */
export function Injectable(options = {}) {
    return function (constructor) {
        // Get constructor parameter types from TypeScript compiler
        const paramTypes = Reflect.getMetadata(PARAM_TYPES_METADATA_KEY, constructor) || [];
        // Create injectable metadata
        const metadata = {
            dependencies: paramTypes,
            lifetime: options.lifetime || ServiceLifetime.Transient,
            token: options.token,
        };
        // Store metadata on the constructor
        Reflect.defineMetadata(INJECTABLE_METADATA_KEY, metadata, constructor);
        return constructor;
    };
}
/**
 * Inject decorator for constructor parameters
 *
 * Explicitly specifies the token to inject for a constructor parameter.
 * Useful when TypeScript reflection doesn't provide enough information.
 *
 * @param token The service token to inject
 */
export function Inject(token) {
    return function (target, propertyKey, parameterIndex) {
        const existingMetadata = Reflect.getMetadata(INJECTABLE_METADATA_KEY, target) || {};
        const dependencies = existingMetadata.dependencies || [];
        // Ensure dependencies array is large enough
        while (dependencies.length <= parameterIndex) {
            dependencies.push(undefined);
        }
        // Set the specific dependency
        dependencies[parameterIndex] = token;
        // Update metadata
        const updatedMetadata = {
            ...existingMetadata,
            dependencies,
        };
        Reflect.defineMetadata(INJECTABLE_METADATA_KEY, updatedMetadata, target);
    };
}
/**
 * Optional decorator for constructor parameters
 *
 * Marks a dependency as optional, allowing injection to succeed
 * even if the service is not registered.
 *
 * @param defaultValue Optional default value to use if service is not found
 */
export function Optional(defaultValue) {
    return function (target, propertyKey, parameterIndex) {
        const existingMetadata = Reflect.getMetadata(INJECTABLE_METADATA_KEY, target) || {};
        const optionalDependencies = existingMetadata.optionalDependencies || new Set();
        optionalDependencies.add(parameterIndex);
        const updatedMetadata = {
            ...existingMetadata,
            optionalDependencies,
            defaultValues: {
                ...existingMetadata.defaultValues,
                [parameterIndex]: defaultValue,
            },
        };
        Reflect.defineMetadata(INJECTABLE_METADATA_KEY, updatedMetadata, target);
    };
}
/**
 * Get injectable metadata from a constructor
 */
export function getInjectableMetadata(constructor) {
    return Reflect.getMetadata(INJECTABLE_METADATA_KEY, constructor);
}
/**
 * Check if a constructor is marked as injectable
 */
export function isInjectable(constructor) {
    return Reflect.hasMetadata(INJECTABLE_METADATA_KEY, constructor);
}
/**
 * Helper function to extract dependency tokens from a constructor
 */
export function getDependencyTokens(constructor) {
    const metadata = getInjectableMetadata(constructor);
    if (!metadata) {
        return [];
    }
    return metadata.dependencies || [];
}
/**
 * Self-binding token type for auto-registration
 */
export const SELF = Symbol('SELF');
/**
 * Factory for creating injectable class decorators with specific lifetimes
 */
export const Singleton = (options = {}) => Injectable({ ...options, lifetime: ServiceLifetime.Singleton });
export const Transient = (options = {}) => Injectable({ ...options, lifetime: ServiceLifetime.Transient });
/**
 * Auto-register decorator that combines Injectable with container registration
 * This is a convenience decorator for common registration patterns
 */
export function AutoRegister(options = {}) {
    return function (constructor) {
        // First make it injectable
        const injectable = Injectable({
            lifetime: options.lifetime,
            token: options.token,
        });
        const decoratedConstructor = injectable(constructor);
        // Store auto-registration metadata for later processing
        const autoRegisterMetadata = {
            constructor: decoratedConstructor,
            options,
        };
        Reflect.defineMetadata('auto-register', autoRegisterMetadata, decoratedConstructor);
        return decoratedConstructor;
    };
}
/**
 * Get auto-registration metadata
 */
export function getAutoRegisterMetadata(constructor) {
    return Reflect.getMetadata('auto-register', constructor);
}
/**
 * Type guard for checking if a value is a constructor
 */
export function isConstructor(value) {
    return typeof value === 'function' && value.prototype && value.prototype.constructor === value;
}
//# sourceMappingURL=Injectable.js.map