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
import { PluginPermission } from './types';
/**
 * Permission denied error for unauthorized plugin operations
 */
export class PluginPermissionError extends Error {
    constructor(pluginId, requiredPermission, operation) {
        super(`Plugin ${pluginId} lacks permission ${requiredPermission} for operation: ${operation}`);
        this.pluginId = pluginId;
        this.requiredPermission = requiredPermission;
        this.name = 'PluginPermissionError';
    }
}
/**
 * Resource limit exceeded error
 */
export class PluginResourceError extends Error {
    constructor(pluginId, resource, limit, used) {
        super(`Plugin ${pluginId} exceeded ${resource} limit: ${used}/${limit}`);
        this.pluginId = pluginId;
        this.resource = resource;
        this.limit = limit;
        this.used = used;
        this.name = 'PluginResourceError';
    }
}
/**
 * Plugin service registry implementation with permission checking
 */
class SecurePluginServiceRegistry {
    constructor(container, pluginId, permissions, logger) {
        this.container = container;
        this.pluginId = pluginId;
        this.permissions = permissions;
        this.logger = logger;
    }
    get(token) {
        this._checkPermission(PluginPermission.ReadOnly, 'service access');
        try {
            return this.container.resolve(token);
        }
        catch (error) {
            this.logger.warn(`Service access failed for ${String(token)}:`, error);
            return undefined;
        }
    }
    has(token) {
        this._checkPermission(PluginPermission.ReadOnly, 'service discovery');
        return this.container.isRegistered(token);
    }
    list() {
        this._checkPermission(PluginPermission.ReadOnly, 'service listing');
        return this.container.getRegisteredTokens();
    }
    _checkPermission(required, operation) {
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
class SandboxedPluginEventSystem {
    constructor(pluginId, permissions, logger, globalEventSystem) {
        this.pluginId = pluginId;
        this.permissions = permissions;
        this.logger = logger;
        this.globalEventSystem = globalEventSystem;
        this.maxListeners = 50;
        this.eventEmitter = new EventEmitter();
        this.eventPrefix = `plugin:${pluginId}:`;
        this.eventEmitter.setMaxListeners(this.maxListeners);
    }
    emit(event, data) {
        this._checkPermission(PluginPermission.ReadWrite, 'event emission');
        const namespacedEvent = this._namespaceEvent(event);
        this.logger.debug(`Emitting event: ${namespacedEvent}`);
        // Emit both locally and globally
        this.eventEmitter.emit(event, data);
        this.globalEventSystem.emit(namespacedEvent, { pluginId: this.pluginId, data });
    }
    on(event, handler) {
        this._checkPermission(PluginPermission.ReadOnly, 'event listening');
        const wrappedHandler = this._wrapHandler(handler, event);
        this.eventEmitter.on(event, wrappedHandler);
        // Also listen to global events
        const namespacedEvent = this._namespaceEvent(event);
        this.globalEventSystem.on(namespacedEvent, wrappedHandler);
    }
    off(event, handler) {
        this.eventEmitter.off(event, handler);
        const namespacedEvent = this._namespaceEvent(event);
        this.globalEventSystem.off(namespacedEvent, handler);
    }
    once(event, handler) {
        this._checkPermission(PluginPermission.ReadOnly, 'event listening');
        const wrappedHandler = this._wrapHandler(handler, event);
        this.eventEmitter.once(event, wrappedHandler);
        const namespacedEvent = this._namespaceEvent(event);
        this.globalEventSystem.once(namespacedEvent, wrappedHandler);
    }
    _namespaceEvent(event) {
        return `${this.eventPrefix}${event}`;
    }
    _wrapHandler(handler, event) {
        return (data) => {
            try {
                handler(data);
            }
            catch (error) {
                this.logger.error(`Event handler error for ${event}:`, error);
            }
        };
    }
    _checkPermission(required, operation) {
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
class IsolatedPluginStorage {
    constructor(pluginId, permissions, logger, storage = new Map()) {
        this.pluginId = pluginId;
        this.permissions = permissions;
        this.logger = logger;
        this.storage = storage;
        this.storagePrefix = `plugin:${pluginId}:`;
    }
    async get(key) {
        this._checkPermission(PluginPermission.ReadOnly, 'storage read');
        const namespacedKey = this._namespaceKey(key);
        return this.storage.get(namespacedKey);
    }
    async set(key, value) {
        this._checkPermission(PluginPermission.ReadWrite, 'storage write');
        const namespacedKey = this._namespaceKey(key);
        this.storage.set(namespacedKey, value);
        this.logger.debug(`Storage set: ${namespacedKey}`);
    }
    async delete(key) {
        this._checkPermission(PluginPermission.ReadWrite, 'storage delete');
        const namespacedKey = this._namespaceKey(key);
        this.storage.delete(namespacedKey);
        this.logger.debug(`Storage delete: ${namespacedKey}`);
    }
    async clear() {
        this._checkPermission(PluginPermission.ReadWrite, 'storage clear');
        const keysToDelete = Array.from(this.storage.keys())
            .filter(key => key.startsWith(this.storagePrefix));
        keysToDelete.forEach(key => this.storage.delete(key));
        this.logger.debug(`Storage cleared for plugin: ${this.pluginId}`);
    }
    async keys() {
        this._checkPermission(PluginPermission.ReadOnly, 'storage enumeration');
        return Array.from(this.storage.keys())
            .filter(key => key.startsWith(this.storagePrefix))
            .map(key => key.substring(this.storagePrefix.length));
    }
    _namespaceKey(key) {
        return `${this.storagePrefix}${key}`;
    }
    _checkPermission(required, operation) {
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
class RateLimitedPluginHttpClient {
    constructor(pluginId, permissions, logger, maxRequestsPerMinute = 100) {
        this.pluginId = pluginId;
        this.permissions = permissions;
        this.logger = logger;
        this.maxRequestsPerMinute = maxRequestsPerMinute;
        this.requestCount = 0;
        this.lastResetTime = Date.now();
        this.resetInterval = 60000; // 1 minute
    }
    async get(url, options) {
        return this._makeRequest('GET', url, undefined, options);
    }
    async post(url, data, options) {
        return this._makeRequest('POST', url, data, options);
    }
    async put(url, data, options) {
        return this._makeRequest('PUT', url, data, options);
    }
    async delete(url, options) {
        return this._makeRequest('DELETE', url, undefined, options);
    }
    async _makeRequest(method, url, data, options) {
        this._checkPermission(PluginPermission.NetworkAccess, 'HTTP request');
        this._checkRateLimit();
        const requestOptions = {
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
            }
            else {
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
        }
        catch (error) {
            this.logger.error(`HTTP request error:`, error);
            throw error;
        }
    }
    _checkPermission(required, operation) {
        // Check if the plugin has the exact permission or a higher-level permission
        const hasPermission = this.permissions.includes(required) ||
            (required === PluginPermission.ReadOnly && this.permissions.includes(PluginPermission.ReadWrite));
        if (!hasPermission) {
            throw new PluginPermissionError(this.pluginId, required, operation);
        }
    }
    _checkRateLimit() {
        const now = Date.now();
        if (now - this.lastResetTime >= this.resetInterval) {
            this.requestCount = 0;
            this.lastResetTime = now;
        }
        if (this.requestCount >= this.maxRequestsPerMinute) {
            throw new PluginResourceError(this.pluginId, 'HTTP requests per minute', this.maxRequestsPerMinute, this.requestCount);
        }
        this.requestCount++;
    }
}
/**
 * Plugin utilities implementation
 */
class PluginUtilitiesImpl {
    constructor(pluginId, logger) {
        this.pluginId = pluginId;
        this.logger = logger;
    }
    validateFormula(formula) {
        try {
            // Basic chemical formula validation - allow simple molecular formulas
            const trimmedFormula = formula.trim();
            if (!trimmedFormula)
                return false;
            // Allow simple formulas like H2O, CO2, NaCl, etc.
            const formulaRegex = /^([A-Z][a-z]?\d*)+$/;
            return formulaRegex.test(trimmedFormula);
        }
        catch (error) {
            this.logger.warn(`Formula validation error:`, error);
            return false;
        }
    }
    parseFormula(formula) {
        try {
            const elements = {};
            const regex = /([A-Z][a-z]?)(\d*)/g;
            let match;
            while ((match = regex.exec(formula)) !== null) {
                const element = match[1];
                const count = match[2] ? parseInt(match[2], 10) : 1;
                elements[element] = (elements[element] || 0) + count;
            }
            return elements;
        }
        catch (error) {
            this.logger.error(`Formula parsing error:`, error);
            return {};
        }
    }
    calculateMolarWeight(formula) {
        try {
            // Simplified molar weight calculation
            const atomicWeights = {
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
                }
                else {
                    this.logger.warn(`Unknown element in formula: ${element}`);
                }
            }
            return totalWeight;
        }
        catch (error) {
            this.logger.error(`Molar weight calculation error:`, error);
            return 0;
        }
    }
    formatNumber(value, precision = 2) {
        try {
            return value.toFixed(precision);
        }
        catch (error) {
            this.logger.warn(`Number formatting error:`, error);
            return String(value);
        }
    }
    sanitizeInput(input) {
        try {
            // Basic input sanitization
            return input
                .trim()
                .replace(/[<>\"'&]/g, '') // Remove potentially dangerous characters
                .substring(0, 1000); // Limit length
        }
        catch (error) {
            this.logger.warn(`Input sanitization error:`, error);
            return '';
        }
    }
}
/**
 * Main plugin API context implementation
 */
export class PluginAPIContextImpl {
    constructor(container, pluginId, permissions, logger, globalEventSystem, globalStorage) {
        this.container = container;
        this.pluginId = pluginId;
        this.permissions = permissions;
        this.logger = logger;
        this.globalEventSystem = globalEventSystem;
        this.globalStorage = globalStorage;
        this.version = '1.0.0';
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
    constructor(container, globalEventSystem, globalStorage) {
        this.container = container;
        this.globalEventSystem = globalEventSystem;
        this.globalStorage = globalStorage;
    }
    create(pluginId, permissions, logger) {
        return new PluginAPIContextImpl(this.container, pluginId, permissions, logger, this.globalEventSystem, this.globalStorage);
    }
}
//# sourceMappingURL=APIContext.js.map