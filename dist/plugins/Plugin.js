/**
 * CREB-JS Base Plugin Implementation
 *
 * Abstract base class providing common plugin functionality including
 * lifecycle management, state tracking, error handling, and extension points.
 *
 * @author Loganathane Virassamy
 * @version 1.7.0
 */
import { EventEmitter } from 'events';
import { PluginState } from './types';
/**
 * Base plugin error class
 */
export class PluginBaseError extends Error {
    constructor(message, pluginId, context = 'unknown', recoverable = true) {
        super(message);
        this.pluginId = pluginId;
        this.context = context;
        this.recoverable = recoverable;
        this.name = 'PluginBaseError';
    }
}
/**
 * Plugin execution timeout error
 */
export class PluginTimeoutError extends PluginBaseError {
    constructor(pluginId, timeout) {
        super(`Plugin execution timed out after ${timeout}ms`, pluginId, 'execution', false);
        this.name = 'PluginTimeoutError';
    }
}
/**
 * Plugin initialization error
 */
export class PluginInitializationError extends PluginBaseError {
    constructor(pluginId, reason) {
        super(`Plugin initialization failed: ${reason}`, pluginId, 'initialization', false);
        this.name = 'PluginInitializationError';
    }
}
/**
 * Abstract base plugin class providing common functionality
 */
export class BasePlugin extends EventEmitter {
    constructor(metadata, extensionPoints = []) {
        super();
        this.metadata = metadata;
        this.extensionPoints = extensionPoints;
        this._state = PluginState.Unloaded;
        this._healthStatus = {
            healthy: true,
            timestamp: new Date()
        };
        this.setMaxListeners(100); // Allow many event listeners
    }
    /**
     * Get current plugin state
     */
    get state() {
        return this._state;
    }
    /**
     * Get plugin configuration
     */
    get config() {
        return this._config;
    }
    /**
     * Get API context
     */
    get apiContext() {
        return this._apiContext;
    }
    /**
     * Get plugin logger
     */
    get logger() {
        return this._logger;
    }
    /**
     * Initialize the plugin with parameters
     */
    async initialize(params) {
        try {
            this._setState(PluginState.Loading);
            this._config = params.config;
            this._apiContext = params.apiContext;
            this._logger = params.logger;
            this._logger.info(`Initializing plugin: ${this.metadata.name}`);
            // Call derived class initialization
            if (this.onInitialize) {
                await this._executeWithTimeout(() => this.onInitialize(params), this._config.timeouts.initialization, 'initialization');
            }
            this._setState(PluginState.Loaded);
            this._logger.info(`Plugin initialized successfully: ${this.metadata.name}`);
        }
        catch (error) {
            this._setState(PluginState.Error);
            this._logger.error(`Plugin initialization failed: ${this.metadata.name}`, error);
            throw new PluginInitializationError(this.metadata.id, error.message);
        }
    }
    /**
     * Activate the plugin
     */
    async activate() {
        try {
            if (this._state !== PluginState.Loaded && this._state !== PluginState.Inactive) {
                throw new Error(`Cannot activate plugin in state: ${this._state}`);
            }
            this._logger.info(`Activating plugin: ${this.metadata.name}`);
            if (this.onActivate) {
                await this._executeWithTimeout(() => this.onActivate(), this._config.timeouts.execution, 'activation');
            }
            this._setState(PluginState.Active);
            this._logger.info(`Plugin activated successfully: ${this.metadata.name}`);
            this.emit('activated');
        }
        catch (error) {
            this._setState(PluginState.Error);
            this._logger.error(`Plugin activation failed: ${this.metadata.name}`, error);
            throw error;
        }
    }
    /**
     * Deactivate the plugin
     */
    async deactivate() {
        try {
            if (this._state !== PluginState.Active) {
                throw new Error(`Cannot deactivate plugin in state: ${this._state}`);
            }
            this._logger.info(`Deactivating plugin: ${this.metadata.name}`);
            if (this.onDeactivate) {
                await this._executeWithTimeout(() => this.onDeactivate(), this._config.timeouts.execution, 'deactivation');
            }
            this._setState(PluginState.Inactive);
            this._logger.info(`Plugin deactivated successfully: ${this.metadata.name}`);
            this.emit('deactivated');
        }
        catch (error) {
            this._setState(PluginState.Error);
            this._logger.error(`Plugin deactivation failed: ${this.metadata.name}`, error);
            throw error;
        }
    }
    /**
     * Cleanup and unload the plugin
     */
    async cleanup() {
        try {
            this._setState(PluginState.Unloading);
            this._logger.info(`Cleaning up plugin: ${this.metadata.name}`);
            if (this.onCleanup) {
                await this._executeWithTimeout(() => this.onCleanup(), this._config.timeouts.cleanup, 'cleanup');
            }
            this.removeAllListeners();
            this._setState(PluginState.Unloaded);
            this._logger.info(`Plugin cleaned up successfully: ${this.metadata.name}`);
        }
        catch (error) {
            this._setState(PluginState.Error);
            this._logger.error(`Plugin cleanup failed: ${this.metadata.name}`, error);
            throw error;
        }
    }
    /**
     * Execute a plugin extension point
     */
    async execute(extensionPoint, input) {
        const startTime = Date.now();
        try {
            if (this._state !== PluginState.Active) {
                throw new Error(`Plugin not active: ${this._state}`);
            }
            const extension = this.extensionPoints.find(ep => ep.name === extensionPoint);
            if (!extension) {
                throw new Error(`Extension point not found: ${extensionPoint}`);
            }
            this._logger.debug(`Executing extension point: ${extensionPoint}`);
            const result = await this._executeWithTimeout(() => extension.handler(input, this._apiContext), this._config.timeouts.execution, 'execution');
            const executionTime = Date.now() - startTime;
            this._logger.debug(`Extension point executed successfully: ${extensionPoint} (${executionTime}ms)`);
            return {
                success: true,
                data: result.data,
                executionTime,
                warnings: result.warnings,
                metadata: result.metadata
            };
        }
        catch (error) {
            const executionTime = Date.now() - startTime;
            const errorMessage = error.message;
            this._logger.error(`Extension point execution failed: ${extensionPoint}`, error);
            return {
                success: false,
                error: errorMessage,
                executionTime
            };
        }
    }
    /**
     * Get plugin health status
     */
    getHealth() {
        try {
            // Update health status if health check is implemented
            if (this.onHealthCheck) {
                const result = this.onHealthCheck();
                this._healthStatus = result instanceof Promise ? this._healthStatus : result;
            }
            return {
                ...this._healthStatus,
                timestamp: new Date()
            };
        }
        catch (error) {
            return {
                healthy: false,
                message: `Health check failed: ${error.message}`,
                timestamp: new Date()
            };
        }
    }
    /**
     * Update plugin configuration
     */
    async updateConfig(config) {
        try {
            const oldConfig = { ...this._config };
            this._config = { ...this._config, ...config };
            this._logger.info(`Updating plugin configuration: ${this.metadata.name}`);
            if (this.onConfigChange) {
                await this._executeWithTimeout(() => this.onConfigChange(this._config), this._config.timeouts.execution, 'config-change');
            }
            this._logger.info(`Plugin configuration updated successfully: ${this.metadata.name}`);
            this.emit('config-changed', { oldConfig, newConfig: this._config });
        }
        catch (error) {
            this._logger.error(`Plugin configuration update failed: ${this.metadata.name}`, error);
            throw error;
        }
    }
    /**
     * Private helper methods
     */
    _setState(state) {
        const oldState = this._state;
        this._state = state;
        this.emit('state-changed', { oldState, newState: state });
    }
    async _executeWithTimeout(operation, timeout, context) {
        return new Promise((resolve, reject) => {
            const timeoutId = setTimeout(() => {
                reject(new PluginTimeoutError(this.metadata.id, timeout));
            }, timeout);
            Promise.resolve(operation())
                .then(result => {
                clearTimeout(timeoutId);
                resolve(result);
            })
                .catch(error => {
                clearTimeout(timeoutId);
                reject(error);
            });
        });
    }
}
/**
 * Simple plugin implementation for basic use cases
 */
export class SimplePlugin extends BasePlugin {
    constructor(metadata, extensionPoints = [], handlers = {}) {
        super(metadata, extensionPoints);
        this.handlers = handlers;
    }
    async onInitialize(params) {
        if (this.handlers.onInitialize) {
            await this.handlers.onInitialize(params);
        }
    }
    async onActivate() {
        if (this.handlers.onActivate) {
            await this.handlers.onActivate();
        }
    }
    async onDeactivate() {
        if (this.handlers.onDeactivate) {
            await this.handlers.onDeactivate();
        }
    }
    async onCleanup() {
        if (this.handlers.onCleanup) {
            await this.handlers.onCleanup();
        }
    }
    async onConfigChange(newConfig) {
        if (this.handlers.onConfigChange) {
            await this.handlers.onConfigChange(newConfig);
        }
    }
    onHealthCheck() {
        if (this.handlers.onHealthCheck) {
            const result = this.handlers.onHealthCheck();
            if (result instanceof Promise) {
                // For async health checks, return a default status and handle async separately
                return {
                    healthy: true,
                    message: 'Health check in progress',
                    timestamp: new Date()
                };
            }
            return result;
        }
        return {
            healthy: true,
            message: 'Plugin is running normally',
            timestamp: new Date()
        };
    }
}
/**
 * Plugin builder for fluent plugin creation
 */
export class PluginBuilder {
    constructor() {
        this._extensionPoints = [];
        this._handlers = {};
    }
    static create() {
        return new PluginBuilder();
    }
    metadata(metadata) {
        this._metadata = metadata;
        return this;
    }
    addExtensionPoint(extensionPoint) {
        this._extensionPoints.push(extensionPoint);
        return this;
    }
    onInitialize(handler) {
        this._handlers.onInitialize = handler;
        return this;
    }
    onActivate(handler) {
        this._handlers.onActivate = handler;
        return this;
    }
    onDeactivate(handler) {
        this._handlers.onDeactivate = handler;
        return this;
    }
    onCleanup(handler) {
        this._handlers.onCleanup = handler;
        return this;
    }
    onConfigChange(handler) {
        this._handlers.onConfigChange = handler;
        return this;
    }
    onHealthCheck(handler) {
        this._handlers.onHealthCheck = handler;
        return this;
    }
    build() {
        if (!this._metadata) {
            throw new Error('Plugin metadata is required');
        }
        return new SimplePlugin(this._metadata, this._extensionPoints, this._handlers);
    }
}
//# sourceMappingURL=Plugin.js.map