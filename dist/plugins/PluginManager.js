/**
 * CREB-JS Plugin Manager
 *
 * Central plugin management system providing plugin discovery, loading,
 * lifecycle management, security sandboxing, and marketplace integration.
 *
 * @author Loganathane Virassamy
 * @version 1.7.0
 */
import { EventEmitter } from 'events';
import { promises as fs } from 'fs';
import * as path from 'path';
import { PluginAPIContextFactory } from './APIContext';
import { PluginState, PluginPermission } from './types';
/**
 * Plugin manager error classes
 */
export class PluginManagerError extends Error {
    constructor(message, operation) {
        super(message);
        this.operation = operation;
        this.name = 'PluginManagerError';
    }
}
export class PluginLoadError extends PluginManagerError {
    constructor(pluginId, reason) {
        super(`Failed to load plugin ${pluginId}: ${reason}`, 'load');
        this.name = 'PluginLoadError';
    }
}
export class PluginSecurityError extends PluginManagerError {
    constructor(pluginId, violation) {
        super(`Security violation in plugin ${pluginId}: ${violation}`, 'security');
        this.name = 'PluginSecurityError';
    }
}
/**
 * Plugin registry for managing loaded plugins
 */
class PluginRegistry {
    constructor() {
        this.plugins = new Map();
        this.manifests = new Map();
    }
    register(manifest, plugin) {
        this.manifests.set(manifest.metadata.id, manifest);
        this.plugins.set(manifest.metadata.id, plugin);
    }
    unregister(pluginId) {
        this.manifests.delete(pluginId);
        this.plugins.delete(pluginId);
    }
    get(pluginId) {
        return this.plugins.get(pluginId);
    }
    getManifest(pluginId) {
        return this.manifests.get(pluginId);
    }
    list() {
        return Array.from(this.plugins.values());
    }
    listByState(state) {
        return this.list().filter(plugin => plugin.state === state);
    }
    listByContext(context) {
        return this.list().filter(plugin => {
            const manifest = this.manifests.get(plugin.metadata.id);
            return manifest?.metadata.context.includes(context);
        });
    }
    has(pluginId) {
        return this.plugins.has(pluginId);
    }
    size() {
        return this.plugins.size;
    }
}
/**
 * Plugin logger implementation
 */
class PluginLoggerImpl {
    constructor(pluginId, level = 'info') {
        this.pluginId = pluginId;
        this.level = level;
    }
    debug(message, ...args) {
        if (this._shouldLog('debug')) {
            console.debug(`[Plugin:${this.pluginId}] ${message}`, ...args);
        }
    }
    info(message, ...args) {
        if (this._shouldLog('info')) {
            console.info(`[Plugin:${this.pluginId}] ${message}`, ...args);
        }
    }
    warn(message, ...args) {
        if (this._shouldLog('warn')) {
            console.warn(`[Plugin:${this.pluginId}] ${message}`, ...args);
        }
    }
    error(message, error, ...args) {
        if (this._shouldLog('error')) {
            console.error(`[Plugin:${this.pluginId}] ${message}`, error, ...args);
        }
    }
    _shouldLog(level) {
        const levels = ['debug', 'info', 'warn', 'error'];
        return levels.indexOf(level) >= levels.indexOf(this.level);
    }
}
/**
 * Main plugin manager class
 */
export class PluginManager extends EventEmitter {
    constructor(container, config) {
        super();
        this.container = container;
        this.config = config;
        this.registry = new PluginRegistry();
        this.globalStorage = new Map();
        this.discoveredPlugins = new Map();
        this.apiContextFactory = new PluginAPIContextFactory(container, this, // Use this EventEmitter as global event system
        this.globalStorage);
        this.setMaxListeners(0); // Unlimited listeners for plugin events
    }
    /**
     * Initialize the plugin manager
     */
    async initialize() {
        try {
            // Ensure plugin directory exists
            await this._ensurePluginDirectory();
            // Start periodic health checks
            if (this.config.healthCheckInterval > 0) {
                this.healthCheckTimer = setInterval(() => this._performHealthChecks(), this.config.healthCheckInterval);
            }
            // Start plugin discovery
            if (this.config.discoveryInterval > 0) {
                this.discoveryTimer = setInterval(() => this._discoverPlugins(), this.config.discoveryInterval);
            }
            // Initial plugin discovery
            await this._discoverPlugins();
            console.info(`Plugin manager initialized with ${this.registry.size()} plugins`);
        }
        catch (error) {
            throw new PluginManagerError(`Failed to initialize plugin manager: ${error.message}`, 'initialize');
        }
    }
    /**
     * Shutdown the plugin manager
     */
    async shutdown() {
        try {
            // Clear timers
            if (this.healthCheckTimer) {
                clearInterval(this.healthCheckTimer);
            }
            if (this.discoveryTimer) {
                clearInterval(this.discoveryTimer);
            }
            // Unload all plugins
            const activePlugins = this.registry.listByState(PluginState.Active);
            for (const plugin of activePlugins) {
                await this.unloadPlugin(plugin.metadata.id);
            }
            console.info('Plugin manager shutdown complete');
        }
        catch (error) {
            throw new PluginManagerError(`Failed to shutdown plugin manager: ${error.message}`, 'shutdown');
        }
    }
    /**
     * Load a plugin from manifest
     */
    async loadPlugin(manifest) {
        try {
            const { metadata } = manifest;
            // Check if already loaded
            if (this.registry.has(metadata.id)) {
                throw new Error(`Plugin already loaded: ${metadata.id}`);
            }
            // Check plugin limits
            if (this.registry.size() >= this.config.maxPlugins) {
                throw new Error(`Maximum plugin limit reached: ${this.config.maxPlugins}`);
            }
            // Validate plugin metadata
            this._validatePluginMetadata(metadata);
            // Check security permissions
            this._validatePluginSecurity(metadata);
            // Create plugin instance
            const logger = new PluginLoggerImpl(metadata.id);
            const apiContext = this.apiContextFactory.create(metadata.id, metadata.permissions, logger);
            const plugin = manifest.factory({
                metadata,
                config: manifest.config,
                apiContext,
                logger
            });
            // Initialize plugin
            await plugin.initialize({
                metadata,
                config: manifest.config,
                apiContext,
                logger
            });
            // Register plugin
            this.registry.register(manifest, plugin);
            // Activate plugin if auto-load is enabled
            if (manifest.config.autoLoad) {
                await this.activatePlugin(metadata.id);
            }
            this.emit('plugin-loaded', plugin);
            logger.info(`Plugin loaded successfully: ${metadata.name}`);
        }
        catch (error) {
            const errorInfo = {
                pluginId: manifest.metadata.id,
                error: error,
                context: 'loading',
                timestamp: new Date(),
                recoverable: false
            };
            this.emit('plugin-error', errorInfo);
            throw new PluginLoadError(manifest.metadata.id, error.message);
        }
    }
    /**
     * Unload a plugin
     */
    async unloadPlugin(pluginId) {
        try {
            const plugin = this.registry.get(pluginId);
            if (!plugin) {
                throw new Error(`Plugin not found: ${pluginId}`);
            }
            // Deactivate if active
            if (plugin.state === PluginState.Active) {
                await this.deactivatePlugin(pluginId);
            }
            // Cleanup plugin
            await plugin.cleanup();
            // Unregister
            this.registry.unregister(pluginId);
            this.emit('plugin-unloaded', pluginId);
            console.info(`Plugin unloaded: ${pluginId}`);
        }
        catch (error) {
            const errorInfo = {
                pluginId,
                error: error,
                context: 'unloading',
                timestamp: new Date(),
                recoverable: true
            };
            this.emit('plugin-error', errorInfo);
            throw error;
        }
    }
    /**
     * Activate a plugin
     */
    async activatePlugin(pluginId) {
        try {
            const plugin = this.registry.get(pluginId);
            if (!plugin) {
                throw new Error(`Plugin not found: ${pluginId}`);
            }
            await plugin.activate();
            this.emit('plugin-activated', plugin);
        }
        catch (error) {
            const errorInfo = {
                pluginId,
                error: error,
                context: 'activation',
                timestamp: new Date(),
                recoverable: true
            };
            this.emit('plugin-error', errorInfo);
            throw error;
        }
    }
    /**
     * Deactivate a plugin
     */
    async deactivatePlugin(pluginId) {
        try {
            const plugin = this.registry.get(pluginId);
            if (!plugin) {
                throw new Error(`Plugin not found: ${pluginId}`);
            }
            await plugin.deactivate();
            this.emit('plugin-deactivated', plugin);
        }
        catch (error) {
            const errorInfo = {
                pluginId,
                error: error,
                context: 'deactivation',
                timestamp: new Date(),
                recoverable: true
            };
            this.emit('plugin-error', errorInfo);
            throw error;
        }
    }
    /**
     * Get plugin by ID
     */
    getPlugin(pluginId) {
        return this.registry.get(pluginId);
    }
    /**
     * List all plugins
     */
    listPlugins() {
        return this.registry.list();
    }
    /**
     * List plugins by state
     */
    listPluginsByState(state) {
        return this.registry.listByState(state);
    }
    /**
     * List plugins by context
     */
    listPluginsByContext(context) {
        return this.registry.listByContext(context);
    }
    /**
     * Get plugin health status
     */
    getPluginHealth(pluginId) {
        const plugin = this.registry.get(pluginId);
        return plugin?.getHealth();
    }
    /**
     * Update plugin configuration
     */
    async updatePluginConfig(pluginId, config) {
        const plugin = this.registry.get(pluginId);
        if (!plugin) {
            throw new Error(`Plugin not found: ${pluginId}`);
        }
        await plugin.updateConfig(config);
    }
    /**
     * Hot-swap a plugin (if enabled)
     */
    async hotSwapPlugin(pluginId, newManifest) {
        if (!this.config.enableHotSwap) {
            throw new Error('Hot-swap is disabled');
        }
        try {
            // Unload old plugin
            await this.unloadPlugin(pluginId);
            // Load new plugin
            await this.loadPlugin(newManifest);
            console.info(`Plugin hot-swapped: ${pluginId}`);
        }
        catch (error) {
            throw new PluginManagerError(`Hot-swap failed for ${pluginId}: ${error.message}`, 'hot-swap');
        }
    }
    /**
     * Private helper methods
     */
    async _ensurePluginDirectory() {
        try {
            await fs.mkdir(this.config.pluginDirectory, { recursive: true });
        }
        catch (error) {
            // Directory might already exist
        }
    }
    async _discoverPlugins() {
        try {
            const pluginFiles = await fs.readdir(this.config.pluginDirectory);
            for (const file of pluginFiles) {
                if (file.endsWith('.js') || file.endsWith('.ts')) {
                    const pluginPath = path.join(this.config.pluginDirectory, file);
                    await this._loadPluginFromFile(pluginPath);
                }
            }
        }
        catch (error) {
            console.warn('Plugin discovery failed:', error);
        }
    }
    async _loadPluginFromFile(filePath) {
        try {
            // Dynamic import would be used here in a real implementation
            // For now, we'll skip the actual file loading
            console.debug(`Discovering plugin at: ${filePath}`);
        }
        catch (error) {
            console.warn(`Failed to load plugin from ${filePath}:`, error);
        }
    }
    _performHealthChecks() {
        const plugins = this.registry.list();
        for (const plugin of plugins) {
            try {
                const health = plugin.getHealth();
                this.emit('plugin-health-check', plugin.metadata.id, health);
                if (!health.healthy) {
                    console.warn(`Plugin health check failed: ${plugin.metadata.id} - ${health.message}`);
                }
            }
            catch (error) {
                const errorInfo = {
                    pluginId: plugin.metadata.id,
                    error: error,
                    context: 'health-check',
                    timestamp: new Date(),
                    recoverable: true
                };
                this.emit('plugin-error', errorInfo);
            }
        }
    }
    _validatePluginMetadata(metadata) {
        if (!metadata.id || !metadata.name || !metadata.version) {
            throw new Error('Plugin metadata must include id, name, and version');
        }
        if (!this._isValidAPIVersion(metadata.apiVersion)) {
            throw new Error(`Unsupported API version: ${metadata.apiVersion}`);
        }
    }
    _validatePluginSecurity(metadata) {
        const { securityLevel } = this.config;
        if (securityLevel === 'strict') {
            // In strict mode, only allow read-only permissions by default
            const dangerousPermissions = [
                PluginPermission.SystemAccess,
                PluginPermission.NetworkAccess
            ];
            const hasDangerousPermissions = metadata.permissions.some(p => dangerousPermissions.includes(p));
            if (hasDangerousPermissions) {
                throw new PluginSecurityError(metadata.id, 'Dangerous permissions not allowed in strict mode');
            }
        }
    }
    _isValidAPIVersion(version) {
        const supportedVersions = ['1.0.0', '1.1.0'];
        return supportedVersions.includes(version);
    }
}
//# sourceMappingURL=PluginManager.js.map