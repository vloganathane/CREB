/**
 * CREB-JS Plugin API Context Implementation
 * 
 * Provides secure, controlled access to CREB services and utilities
 * for plugins with permission-based sandboxing and resource management.
 * 
 * @author Loganathane Virassamy
 * @version 1.7.0
 */

import { EventEmitter } from 'events';
import { Container, ServiceToken } from '../core/Container';
import {
  PluginAPIContext,
  PluginAPIVersion,
  PluginServiceRegistry,
  PluginEventSystem,
  PluginStorage,
  PluginHttpClient,
  PluginUtilities,
  PluginPermission,
  PluginLogger
} from './types';

/**
 * Permission denied error for unauthorized plugin operations
 */
export class PluginPermissionError extends Error {
  constructor(
    public readonly pluginId: string,
    public readonly requiredPermission: PluginPermission,
    operation: string
  ) {
    super(`Plugin ${pluginId} lacks permission ${requiredPermission} for operation: ${operation}`);
    this.name = 'PluginPermissionError';
  }
}

/**
 * Resource limit exceeded error
 */
export class PluginResourceError extends Error {
  constructor(
    public readonly pluginId: string,
    public readonly resource: string,
    public readonly limit: number,
    public readonly used: number
  ) {
    super(`Plugin ${pluginId} exceeded ${resource} limit: ${used}/${limit}`);
    this.name = 'PluginResourceError';
  }
}

/**
 * Plugin service registry implementation with permission checking
 */
class SecurePluginServiceRegistry implements PluginServiceRegistry {
  constructor(
    private readonly container: Container,
    private readonly pluginId: string,
    private readonly permissions: PluginPermission[],
    private readonly logger: PluginLogger
  ) {}

  get<T>(token: ServiceToken<T>): T | undefined {
    this._checkPermission(PluginPermission.ReadOnly, 'service access');
    
    try {
      return this.container.resolve(token);
    } catch (error) {
      this.logger.warn(`Service access failed for ${String(token)}:`, error);
      return undefined;
    }
  }

  has(token: ServiceToken): boolean {
    this._checkPermission(PluginPermission.ReadOnly, 'service discovery');
    return this.container.isRegistered(token);
  }

  list(): ServiceToken[] {
    this._checkPermission(PluginPermission.ReadOnly, 'service listing');
    return this.container.getRegisteredTokens();
  }

  private _checkPermission(required: PluginPermission, operation: string): void {
    // Check if the plugin has the exact permission or a higher-level permission
    const hasPermission = this.permissions.includes(required) ||
      (required === PluginPermission.ReadOnly && this.permissions.includes(PluginPermission.ReadWrite));
    
    if (!hasPermission) {
      throw new PluginPermissionError(this.pluginId, required, operation);
    }
  }
}

/**
 * Plugin event system implementation with sandboxing
 */
class SandboxedPluginEventSystem implements PluginEventSystem {
  private readonly eventEmitter: EventEmitter;
  private readonly eventPrefix: string;
  private readonly maxListeners = 50;

  constructor(
    private readonly pluginId: string,
    private readonly permissions: PluginPermission[],
    private readonly logger: PluginLogger,
    private readonly globalEventSystem: EventEmitter
  ) {
    this.eventEmitter = new EventEmitter();
    this.eventPrefix = `plugin:${pluginId}:`;
    this.eventEmitter.setMaxListeners(this.maxListeners);
  }

  emit(event: string, data?: any): void {
    this._checkPermission(PluginPermission.ReadWrite, 'event emission');
    
    const namespacedEvent = this._namespaceEvent(event);
    this.logger.debug(`Emitting event: ${namespacedEvent}`);
    
    // Emit both locally and globally
    this.eventEmitter.emit(event, data);
    this.globalEventSystem.emit(namespacedEvent, { pluginId: this.pluginId, data });
  }

  on(event: string, handler: (data: any) => void): void {
    this._checkPermission(PluginPermission.ReadOnly, 'event listening');
    
    const wrappedHandler = this._wrapHandler(handler, event);
    this.eventEmitter.on(event, wrappedHandler);
    
    // Also listen to global events
    const namespacedEvent = this._namespaceEvent(event);
    this.globalEventSystem.on(namespacedEvent, wrappedHandler);
  }

  off(event: string, handler: (data: any) => void): void {
    this.eventEmitter.off(event, handler);
    
    const namespacedEvent = this._namespaceEvent(event);
    this.globalEventSystem.off(namespacedEvent, handler);
  }

  once(event: string, handler: (data: any) => void): void {
    this._checkPermission(PluginPermission.ReadOnly, 'event listening');
    
    const wrappedHandler = this._wrapHandler(handler, event);
    this.eventEmitter.once(event, wrappedHandler);
    
    const namespacedEvent = this._namespaceEvent(event);
    this.globalEventSystem.once(namespacedEvent, wrappedHandler);
  }

  private _namespaceEvent(event: string): string {
    return `${this.eventPrefix}${event}`;
  }

  private _wrapHandler(handler: (data: any) => void, event: string): (data: any) => void {
    return (data: any) => {
      try {
        handler(data);
      } catch (error) {
        this.logger.error(`Event handler error for ${event}:`, error as Error);
      }
    };
  }

  private _checkPermission(required: PluginPermission, operation: string): void {
    // Check if the plugin has the exact permission or a higher-level permission
    const hasPermission = this.permissions.includes(required) ||
      (required === PluginPermission.ReadOnly && this.permissions.includes(PluginPermission.ReadWrite));
    
    if (!hasPermission) {
      throw new PluginPermissionError(this.pluginId, required, operation);
    }
  }
}

/**
 * Plugin storage implementation with isolation
 */
class IsolatedPluginStorage implements PluginStorage {
  private readonly storagePrefix: string;

  constructor(
    private readonly pluginId: string,
    private readonly permissions: PluginPermission[],
    private readonly logger: PluginLogger,
    private readonly storage: Map<string, any> = new Map()
  ) {
    this.storagePrefix = `plugin:${pluginId}:`;
  }

  async get(key: string): Promise<any> {
    this._checkPermission(PluginPermission.ReadOnly, 'storage read');
    
    const namespacedKey = this._namespaceKey(key);
    return this.storage.get(namespacedKey);
  }

  async set(key: string, value: any): Promise<void> {
    this._checkPermission(PluginPermission.ReadWrite, 'storage write');
    
    const namespacedKey = this._namespaceKey(key);
    this.storage.set(namespacedKey, value);
    this.logger.debug(`Storage set: ${namespacedKey}`);
  }

  async delete(key: string): Promise<void> {
    this._checkPermission(PluginPermission.ReadWrite, 'storage delete');
    
    const namespacedKey = this._namespaceKey(key);
    this.storage.delete(namespacedKey);
    this.logger.debug(`Storage delete: ${namespacedKey}`);
  }

  async clear(): Promise<void> {
    this._checkPermission(PluginPermission.ReadWrite, 'storage clear');
    
    const keysToDelete = Array.from(this.storage.keys())
      .filter(key => key.startsWith(this.storagePrefix));
    
    keysToDelete.forEach(key => this.storage.delete(key));
    this.logger.debug(`Storage cleared for plugin: ${this.pluginId}`);
  }

  async keys(): Promise<string[]> {
    this._checkPermission(PluginPermission.ReadOnly, 'storage enumeration');
    
    return Array.from(this.storage.keys())
      .filter(key => key.startsWith(this.storagePrefix))
      .map(key => key.substring(this.storagePrefix.length));
  }

  private _namespaceKey(key: string): string {
    return `${this.storagePrefix}${key}`;
  }

  private _checkPermission(required: PluginPermission, operation: string): void {
    // Check if the plugin has the exact permission or a higher-level permission
    const hasPermission = this.permissions.includes(required) ||
      (required === PluginPermission.ReadOnly && this.permissions.includes(PluginPermission.ReadWrite));
    
    if (!hasPermission) {
      throw new PluginPermissionError(this.pluginId, required, operation);
    }
  }
}

/**
 * Plugin HTTP client implementation with rate limiting
 */
class RateLimitedPluginHttpClient implements PluginHttpClient {
  private requestCount = 0;
  private lastResetTime = Date.now();
  private readonly resetInterval = 60000; // 1 minute

  constructor(
    private readonly pluginId: string,
    private readonly permissions: PluginPermission[],
    private readonly logger: PluginLogger,
    private readonly maxRequestsPerMinute = 100
  ) {}

  async get(url: string, options?: RequestInit): Promise<Response> {
    return this._makeRequest('GET', url, undefined, options);
  }

  async post(url: string, data?: any, options?: RequestInit): Promise<Response> {
    return this._makeRequest('POST', url, data, options);
  }

  async put(url: string, data?: any, options?: RequestInit): Promise<Response> {
    return this._makeRequest('PUT', url, data, options);
  }

  async delete(url: string, options?: RequestInit): Promise<Response> {
    return this._makeRequest('DELETE', url, undefined, options);
  }

  private async _makeRequest(
    method: string,
    url: string,
    data?: any,
    options?: RequestInit
  ): Promise<Response> {
    this._checkPermission(PluginPermission.NetworkAccess, 'HTTP request');
    this._checkRateLimit();

    const requestOptions: RequestInit = {
      ...options,
      method,
      headers: {
        'User-Agent': `CREB-Plugin/${this.pluginId}`,
        ...options?.headers
      }
    };

    if (data && (method === 'POST' || method === 'PUT')) {
      if (typeof data === 'object') {
        requestOptions.body = JSON.stringify(data);
        requestOptions.headers = {
          'Content-Type': 'application/json',
          ...requestOptions.headers
        };
      } else {
        requestOptions.body = data;
      }
    }

    try {
      this.logger.debug(`Making ${method} request to: ${url}`);
      const response = await fetch(url, requestOptions);
      
      if (!response.ok) {
        this.logger.warn(`HTTP request failed: ${response.status} ${response.statusText}`);
      }
      
      return response;
    } catch (error) {
      this.logger.error(`HTTP request error:`, error as Error);
      throw error;
    }
  }

  private _checkPermission(required: PluginPermission, operation: string): void {
    // Check if the plugin has the exact permission or a higher-level permission
    const hasPermission = this.permissions.includes(required) ||
      (required === PluginPermission.ReadOnly && this.permissions.includes(PluginPermission.ReadWrite));
    
    if (!hasPermission) {
      throw new PluginPermissionError(this.pluginId, required, operation);
    }
  }

  private _checkRateLimit(): void {
    const now = Date.now();
    
    if (now - this.lastResetTime >= this.resetInterval) {
      this.requestCount = 0;
      this.lastResetTime = now;
    }

    if (this.requestCount >= this.maxRequestsPerMinute) {
      throw new PluginResourceError(
        this.pluginId,
        'HTTP requests per minute',
        this.maxRequestsPerMinute,
        this.requestCount
      );
    }

    this.requestCount++;
  }
}

/**
 * Plugin utilities implementation
 */
class PluginUtilitiesImpl implements PluginUtilities {
  constructor(
    private readonly pluginId: string,
    private readonly logger: PluginLogger
  ) {}

  validateFormula(formula: string): boolean {
    try {
      // Basic chemical formula validation - allow simple molecular formulas
      const trimmedFormula = formula.trim();
      if (!trimmedFormula) return false;
      
      // Allow simple formulas like H2O, CO2, NaCl, etc.
      const formulaRegex = /^([A-Z][a-z]?\d*)+$/;
      return formulaRegex.test(trimmedFormula);
    } catch (error) {
      this.logger.warn(`Formula validation error:`, error);
      return false;
    }
  }

  parseFormula(formula: string): Record<string, number> {
    try {
      const elements: Record<string, number> = {};
      const regex = /([A-Z][a-z]?)(\d*)/g;
      let match;

      while ((match = regex.exec(formula)) !== null) {
        const element = match[1];
        const count = match[2] ? parseInt(match[2], 10) : 1;
        elements[element] = (elements[element] || 0) + count;
      }

      return elements;
    } catch (error) {
      this.logger.error(`Formula parsing error:`, error as Error);
      return {};
    }
  }

  calculateMolarWeight(formula: string): number {
    try {
      // Simplified molar weight calculation
      const atomicWeights: Record<string, number> = {
        H: 1.008, He: 4.003, Li: 6.941, Be: 9.012, B: 10.811,
        C: 12.011, N: 14.007, O: 15.999, F: 18.998, Ne: 20.180,
        Na: 22.990, Mg: 24.305, Al: 26.982, Si: 28.086, P: 30.974,
        S: 32.065, Cl: 35.453, Ar: 39.948, K: 39.098, Ca: 40.078
      };

      const elements = this.parseFormula(formula);
      let totalWeight = 0;

      for (const [element, count] of Object.entries(elements)) {
        const weight = atomicWeights[element];
        if (weight) {
          totalWeight += weight * count;
        } else {
          this.logger.warn(`Unknown element in formula: ${element}`);
        }
      }

      return totalWeight;
    } catch (error) {
      this.logger.error(`Molar weight calculation error:`, error as Error);
      return 0;
    }
  }

  formatNumber(value: number, precision: number = 2): string {
    try {
      return value.toFixed(precision);
    } catch (error) {
      this.logger.warn(`Number formatting error:`, error);
      return String(value);
    }
  }

  sanitizeInput(input: string): string {
    try {
      // Basic input sanitization
      return input
        .trim()
        .replace(/[<>\"'&]/g, '') // Remove potentially dangerous characters
        .substring(0, 1000); // Limit length
    } catch (error) {
      this.logger.warn(`Input sanitization error:`, error);
      return '';
    }
  }
}

/**
 * Main plugin API context implementation
 */
export class PluginAPIContextImpl implements PluginAPIContext {
  public readonly version: PluginAPIVersion = '1.0.0';
  public readonly services: PluginServiceRegistry;
  public readonly events: PluginEventSystem;
  public readonly storage: PluginStorage;
  public readonly http: PluginHttpClient;
  public readonly utils: PluginUtilities;

  constructor(
    private readonly container: Container,
    private readonly pluginId: string,
    private readonly permissions: PluginPermission[],
    private readonly logger: PluginLogger,
    private readonly globalEventSystem: EventEmitter,
    private readonly globalStorage: Map<string, any>
  ) {
    this.services = new SecurePluginServiceRegistry(container, pluginId, permissions, logger);
    this.events = new SandboxedPluginEventSystem(pluginId, permissions, logger, globalEventSystem);
    this.storage = new IsolatedPluginStorage(pluginId, permissions, logger, globalStorage);
    this.http = new RateLimitedPluginHttpClient(pluginId, permissions, logger);
    this.utils = new PluginUtilitiesImpl(pluginId, logger);
  }
}

/**
 * Plugin API context factory
 */
export class PluginAPIContextFactory {
  constructor(
    private readonly container: Container,
    private readonly globalEventSystem: EventEmitter,
    private readonly globalStorage: Map<string, any>
  ) {}

  create(
    pluginId: string,
    permissions: PluginPermission[],
    logger: PluginLogger
  ): PluginAPIContext {
    return new PluginAPIContextImpl(
      this.container,
      pluginId,
      permissions,
      logger,
      this.globalEventSystem,
      this.globalStorage
    );
  }
}
