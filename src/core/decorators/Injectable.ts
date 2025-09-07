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
export enum ServiceLifetime {
  Singleton = 'singleton',
  Transient = 'transient',
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
export function Injectable(options: InjectableOptions = {}) {
  return function <T extends new (...args: any[]) => any>(constructor: T): T {
    // Get constructor parameter types from TypeScript compiler
    const paramTypes = Reflect.getMetadata(PARAM_TYPES_METADATA_KEY, constructor) || [];
    
    // Create injectable metadata
    const metadata: InjectableMetadata = {
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
export function Inject(token: any) {
  return function (target: any, propertyKey: string | symbol | undefined, parameterIndex: number) {
    const existingMetadata = Reflect.getMetadata(INJECTABLE_METADATA_KEY, target) || {};
    const dependencies = existingMetadata.dependencies || [];
    
    // Ensure dependencies array is large enough
    while (dependencies.length <= parameterIndex) {
      dependencies.push(undefined);
    }
    
    // Set the specific dependency
    dependencies[parameterIndex] = token;
    
    // Update metadata
    const updatedMetadata: InjectableMetadata = {
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
export function Optional(defaultValue?: any) {
  return function (target: any, propertyKey: string | symbol | undefined, parameterIndex: number) {
    const existingMetadata = Reflect.getMetadata(INJECTABLE_METADATA_KEY, target) || {};
    const optionalDependencies = existingMetadata.optionalDependencies || new Set();
    
    optionalDependencies.add(parameterIndex);
    
    const updatedMetadata: InjectableMetadata = {
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
export function getInjectableMetadata(constructor: any): InjectableMetadata | undefined {
  return Reflect.getMetadata(INJECTABLE_METADATA_KEY, constructor);
}

/**
 * Check if a constructor is marked as injectable
 */
export function isInjectable(constructor: any): boolean {
  return Reflect.hasMetadata(INJECTABLE_METADATA_KEY, constructor);
}

/**
 * Helper function to extract dependency tokens from a constructor
 */
export function getDependencyTokens(constructor: any): any[] {
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
export const Singleton = (options: Omit<InjectableOptions, 'lifetime'> = {}) =>
  Injectable({ ...options, lifetime: ServiceLifetime.Singleton });

export const Transient = (options: Omit<InjectableOptions, 'lifetime'> = {}) =>
  Injectable({ ...options, lifetime: ServiceLifetime.Transient });

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
export function AutoRegister(options: AutoRegisterOptions = {}) {
  return function <T extends new (...args: any[]) => any>(constructor: T): T {
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
export function getAutoRegisterMetadata(constructor: any) {
  return Reflect.getMetadata('auto-register', constructor);
}

/**
 * Type guard for checking if a value is a constructor
 */
export function isConstructor(value: any): value is new (...args: any[]) => any {
  return typeof value === 'function' && value.prototype && value.prototype.constructor === value;
}
