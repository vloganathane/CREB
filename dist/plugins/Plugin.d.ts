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
import { Plugin, PluginMetadata, PluginState, PluginConfig, PluginAPIContext, PluginLogger, PluginInitParams, PluginExtensionPoint, PluginResult, PluginHealthStatus } from './types';
/**
 * Base plugin error class
 */
export declare class PluginBaseError extends Error {
    readonly pluginId: string;
    readonly context: string;
    readonly recoverable: boolean;
    constructor(message: string, pluginId: string, context?: string, recoverable?: boolean);
}
/**
 * Plugin execution timeout error
 */
export declare class PluginTimeoutError extends PluginBaseError {
    constructor(pluginId: string, timeout: number);
}
/**
 * Plugin initialization error
 */
export declare class PluginInitializationError extends PluginBaseError {
    constructor(pluginId: string, reason: string);
}
/**
 * Abstract base plugin class providing common functionality
 */
export declare abstract class BasePlugin extends EventEmitter implements Plugin {
    readonly metadata: PluginMetadata;
    readonly extensionPoints: PluginExtensionPoint[];
    private _state;
    private _config;
    private _apiContext;
    private _logger;
    private _healthStatus;
    constructor(metadata: PluginMetadata, extensionPoints?: PluginExtensionPoint[]);
    /**
     * Get current plugin state
     */
    get state(): PluginState;
    /**
     * Get plugin configuration
     */
    get config(): PluginConfig;
    /**
     * Get API context
     */
    get apiContext(): PluginAPIContext;
    /**
     * Get plugin logger
     */
    get logger(): PluginLogger;
    /**
     * Initialize the plugin with parameters
     */
    initialize(params: PluginInitParams): Promise<void>;
    /**
     * Activate the plugin
     */
    activate(): Promise<void>;
    /**
     * Deactivate the plugin
     */
    deactivate(): Promise<void>;
    /**
     * Cleanup and unload the plugin
     */
    cleanup(): Promise<void>;
    /**
     * Execute a plugin extension point
     */
    execute<TInput, TOutput>(extensionPoint: string, input: TInput): Promise<PluginResult<TOutput>>;
    /**
     * Get plugin health status
     */
    getHealth(): PluginHealthStatus;
    /**
     * Update plugin configuration
     */
    updateConfig(config: Partial<PluginConfig>): Promise<void>;
    /**
     * Abstract lifecycle hooks for derived classes to implement
     */
    abstract onInitialize?(params: PluginInitParams): Promise<void> | void;
    abstract onActivate?(): Promise<void> | void;
    abstract onDeactivate?(): Promise<void> | void;
    abstract onCleanup?(): Promise<void> | void;
    abstract onConfigChange?(newConfig: PluginConfig): Promise<void> | void;
    abstract onHealthCheck?(): Promise<PluginHealthStatus> | PluginHealthStatus;
    /**
     * Private helper methods
     */
    private _setState;
    private _executeWithTimeout;
}
/**
 * Simple plugin implementation for basic use cases
 */
export declare class SimplePlugin extends BasePlugin {
    private readonly handlers;
    constructor(metadata: PluginMetadata, extensionPoints?: PluginExtensionPoint[], handlers?: {
        onInitialize?: (params: PluginInitParams) => Promise<void> | void;
        onActivate?: () => Promise<void> | void;
        onDeactivate?: () => Promise<void> | void;
        onCleanup?: () => Promise<void> | void;
        onConfigChange?: (config: PluginConfig) => Promise<void> | void;
        onHealthCheck?: () => Promise<PluginHealthStatus> | PluginHealthStatus;
    });
    onInitialize(params: PluginInitParams): Promise<void>;
    onActivate(): Promise<void>;
    onDeactivate(): Promise<void>;
    onCleanup(): Promise<void>;
    onConfigChange(newConfig: PluginConfig): Promise<void>;
    onHealthCheck(): PluginHealthStatus;
}
/**
 * Plugin builder for fluent plugin creation
 */
export declare class PluginBuilder {
    private _metadata;
    private _extensionPoints;
    private _handlers;
    static create(): PluginBuilder;
    metadata(metadata: PluginMetadata): PluginBuilder;
    addExtensionPoint(extensionPoint: PluginExtensionPoint): PluginBuilder;
    onInitialize(handler: (params: PluginInitParams) => Promise<void> | void): PluginBuilder;
    onActivate(handler: () => Promise<void> | void): PluginBuilder;
    onDeactivate(handler: () => Promise<void> | void): PluginBuilder;
    onCleanup(handler: () => Promise<void> | void): PluginBuilder;
    onConfigChange(handler: (config: PluginConfig) => Promise<void> | void): PluginBuilder;
    onHealthCheck(handler: () => Promise<PluginHealthStatus> | PluginHealthStatus): PluginBuilder;
    build(): SimplePlugin;
}
//# sourceMappingURL=Plugin.d.ts.map