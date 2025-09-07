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
export declare enum ServiceLifetime {
    Singleton = "singleton",
    Transient = "transient"
}
/**
 * Injectable metadata interface
 */
export interface InjectableMetadata {
    dependencies?: any[];
    lifetime?: ServiceLifetime;
    token?: string | symbol;
}
/**
 * Injectable decorator options
 */
export interface InjectableOptions {
    lifetime?: ServiceLifetime;
    token?: string | symbol;
}
/**
 * Metadata key for injectable services
 */
export declare const INJECTABLE_METADATA_KEY: unique symbol;
/**
 * Metadata key for constructor parameters
 */
export declare const PARAM_TYPES_METADATA_KEY = "design:paramtypes";
/**
 * Injectable class decorator
 *
 * Marks a class as injectable and provides metadata for dependency injection.
 *
 * @param options Optional configuration for the injectable service
 */
export declare function Injectable(options?: InjectableOptions): <T extends new (...args: any[]) => any>(constructor: T) => T;
/**
 * Inject decorator for constructor parameters
 *
 * Explicitly specifies the token to inject for a constructor parameter.
 * Useful when TypeScript reflection doesn't provide enough information.
 *
 * @param token The service token to inject
 */
export declare function Inject(token: any): (target: any, propertyKey: string | symbol | undefined, parameterIndex: number) => void;
/**
 * Optional decorator for constructor parameters
 *
 * Marks a dependency as optional, allowing injection to succeed
 * even if the service is not registered.
 *
 * @param defaultValue Optional default value to use if service is not found
 */
export declare function Optional(defaultValue?: any): (target: any, propertyKey: string | symbol | undefined, parameterIndex: number) => void;
/**
 * Get injectable metadata from a constructor
 */
export declare function getInjectableMetadata(constructor: any): InjectableMetadata | undefined;
/**
 * Check if a constructor is marked as injectable
 */
export declare function isInjectable(constructor: any): boolean;
/**
 * Helper function to extract dependency tokens from a constructor
 */
export declare function getDependencyTokens(constructor: any): any[];
/**
 * Self-binding token type for auto-registration
 */
export declare const SELF: unique symbol;
/**
 * Factory for creating injectable class decorators with specific lifetimes
 */
export declare const Singleton: (options?: Omit<InjectableOptions, "lifetime">) => <T extends new (...args: any[]) => any>(constructor: T) => T;
export declare const Transient: (options?: Omit<InjectableOptions, "lifetime">) => <T extends new (...args: any[]) => any>(constructor: T) => T;
/**
 * Auto-registration helper for common patterns
 */
export interface AutoRegisterOptions {
    lifetime?: ServiceLifetime;
    token?: any;
    as?: any[];
}
/**
 * Auto-register decorator that combines Injectable with container registration
 * This is a convenience decorator for common registration patterns
 */
export declare function AutoRegister(options?: AutoRegisterOptions): <T extends new (...args: any[]) => any>(constructor: T) => T;
/**
 * Get auto-registration metadata
 */
export declare function getAutoRegisterMetadata(constructor: any): any;
/**
 * Type guard for checking if a value is a constructor
 */
export declare function isConstructor(value: any): value is new (...args: any[]) => any;
//# sourceMappingURL=Injectable.d.ts.map