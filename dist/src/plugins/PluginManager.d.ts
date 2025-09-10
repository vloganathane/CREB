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
import { Container } from '../core/Container';
import { Plugin, PluginState, PluginConfig, PluginManifest, PluginHealthStatus, PluginContext } from './types';
/**
 * Plugin manager configuration
 */
export interface PluginManagerConfig {
    pluginDirectory: string;
    maxPlugins: number;
    healthCheckInterval: number;
    discoveryInterval: number;
    enableHotSwap: boolean;
    enableMarketplace: boolean;
    marketplaceUrl?: string;
    securityLevel: 'strict' | 'moderate' | 'permissive';
    resourceLimits: {
        maxMemoryPerPlugin: number;
        maxCpuTimePerPlugin: number;
        maxNetworkRequestsPerMinute: number;
    };
}
/**
 * Plugin manager error classes
 */
export declare class PluginManagerError extends Error {
    readonly operation: string;
    constructor(message: string, operation: string);
}
export declare class PluginLoadError extends PluginManagerError {
    constructor(pluginId: string, reason: string);
}
export declare class PluginSecurityError extends PluginManagerError {
    constructor(pluginId: string, violation: string);
}
/**
 * Main plugin manager class
 */
export declare class PluginManager extends EventEmitter {
    private readonly container;
    private readonly config;
    private readonly registry;
    private readonly apiContextFactory;
    private readonly globalStorage;
    private readonly discoveredPlugins;
    private healthCheckTimer?;
    private discoveryTimer?;
    constructor(container: Container, config: PluginManagerConfig);
    /**
     * Initialize the plugin manager
     */
    initialize(): Promise<void>;
    /**
     * Shutdown the plugin manager
     */
    shutdown(): Promise<void>;
    /**
     * Load a plugin from manifest
     */
    loadPlugin(manifest: PluginManifest): Promise<void>;
    /**
     * Unload a plugin
     */
    unloadPlugin(pluginId: string): Promise<void>;
    /**
     * Activate a plugin
     */
    activatePlugin(pluginId: string): Promise<void>;
    /**
     * Deactivate a plugin
     */
    deactivatePlugin(pluginId: string): Promise<void>;
    /**
     * Get plugin by ID
     */
    getPlugin(pluginId: string): Plugin | undefined;
    /**
     * List all plugins
     */
    listPlugins(): Plugin[];
    /**
     * List plugins by state
     */
    listPluginsByState(state: PluginState): Plugin[];
    /**
     * List plugins by context
     */
    listPluginsByContext(context: PluginContext): Plugin[];
    /**
     * Get plugin health status
     */
    getPluginHealth(pluginId: string): PluginHealthStatus | undefined;
    /**
     * Update plugin configuration
     */
    updatePluginConfig(pluginId: string, config: Partial<PluginConfig>): Promise<void>;
    /**
     * Hot-swap a plugin (if enabled)
     */
    hotSwapPlugin(pluginId: string, newManifest: PluginManifest): Promise<void>;
    /**
     * Private helper methods
     */
    private _ensurePluginDirectory;
    private _discoverPlugins;
    private _loadPluginFromFile;
    private _performHealthChecks;
    private _validatePluginMetadata;
    private _validatePluginSecurity;
    private _isValidAPIVersion;
}
//# sourceMappingURL=PluginManager.d.ts.map