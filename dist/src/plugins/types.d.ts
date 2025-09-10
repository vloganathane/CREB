/**
 * CREB-JS Plugin System Types
 *
 * Type definitions for the plugin system including plugin interfaces,
 * API contexts, lifecycle management, and security configurations.
 *
 * @author Loganathane Virassamy
 * @version 1.7.0
 */
import { ServiceToken } from '../core/Container';
/**
 * Plugin API version for compatibility checking
 */
export type PluginAPIVersion = '1.0.0' | '1.1.0' | '2.0.0';
/**
 * Plugin execution context with permission levels
 */
export declare enum PluginContext {
    Calculation = "calculation",
    DataProvider = "data-provider",
    UI = "ui",
    System = "system"
}
/**
 * Plugin permission levels for security sandboxing
 */
export declare enum PluginPermission {
    ReadOnly = "read-only",
    ReadWrite = "read-write",
    SystemAccess = "system-access",
    NetworkAccess = "network-access"
}
/**
 * Plugin lifecycle states
 */
export declare enum PluginState {
    Unloaded = "unloaded",
    Loading = "loading",
    Loaded = "loaded",
    Active = "active",
    Inactive = "inactive",
    Error = "error",
    Unloading = "unloading"
}
/**
 * Plugin priority levels for execution order
 */
export declare enum PluginPriority {
    Critical = 1000,
    High = 750,
    Normal = 500,
    Low = 250,
    Background = 100
}
/**
 * Plugin metadata for discovery and management
 */
export interface PluginMetadata {
    readonly id: string;
    readonly name: string;
    readonly version: string;
    readonly description: string;
    readonly author: string;
    readonly homepage?: string;
    readonly repository?: string;
    readonly license: string;
    readonly apiVersion: PluginAPIVersion;
    readonly context: PluginContext[];
    readonly permissions: PluginPermission[];
    readonly priority: PluginPriority;
    readonly dependencies?: string[];
    readonly conflicts?: string[];
    readonly keywords: string[];
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
/**
 * Plugin configuration interface
 */
export interface PluginConfig {
    readonly enabled: boolean;
    readonly autoLoad: boolean;
    readonly settings: Record<string, any>;
    readonly timeouts: {
        initialization: number;
        execution: number;
        cleanup: number;
    };
    readonly resources: {
        maxMemory: number;
        maxCpuTime: number;
        maxNetworkRequests: number;
    };
}
/**
 * Plugin initialization parameters
 */
export interface PluginInitParams {
    readonly metadata: PluginMetadata;
    readonly config: PluginConfig;
    readonly apiContext: PluginAPIContext;
    readonly logger: PluginLogger;
}
/**
 * Plugin lifecycle hooks interface
 */
export interface PluginLifecycle {
    /**
     * Called when plugin is being initialized
     */
    onInitialize?(params: PluginInitParams): Promise<void> | void;
    /**
     * Called when plugin is activated
     */
    onActivate?(): Promise<void> | void;
    /**
     * Called when plugin is deactivated
     */
    onDeactivate?(): Promise<void> | void;
    /**
     * Called when plugin is being unloaded
     */
    onCleanup?(): Promise<void> | void;
    /**
     * Called when plugin configuration changes
     */
    onConfigChange?(newConfig: PluginConfig): Promise<void> | void;
    /**
     * Called periodically for health checks
     */
    onHealthCheck?(): Promise<PluginHealthStatus> | PluginHealthStatus;
}
/**
 * Plugin health status
 */
export interface PluginHealthStatus {
    readonly healthy: boolean;
    readonly message?: string;
    readonly metrics?: Record<string, number>;
    readonly timestamp: Date;
}
/**
 * Plugin error information
 */
export interface PluginError {
    readonly pluginId: string;
    readonly error: Error;
    readonly context: string;
    readonly timestamp: Date;
    readonly recoverable: boolean;
}
/**
 * Plugin execution result
 */
export interface PluginResult<T = any> {
    readonly success: boolean;
    readonly data?: T;
    readonly error?: string;
    readonly warnings?: string[];
    readonly executionTime: number;
    readonly metadata?: Record<string, any>;
}
/**
 * Plugin logger interface
 */
export interface PluginLogger {
    debug(message: string, ...args: any[]): void;
    info(message: string, ...args: any[]): void;
    warn(message: string, ...args: any[]): void;
    error(message: string, error?: Error, ...args: any[]): void;
}
/**
 * Plugin API context interface providing access to CREB services
 */
export interface PluginAPIContext {
    readonly version: PluginAPIVersion;
    readonly services: PluginServiceRegistry;
    readonly events: PluginEventSystem;
    readonly storage: PluginStorage;
    readonly http: PluginHttpClient;
    readonly utils: PluginUtilities;
}
/**
 * Plugin service registry for accessing CREB services
 */
export interface PluginServiceRegistry {
    get<T>(token: ServiceToken<T>): T | undefined;
    has(token: ServiceToken): boolean;
    list(): ServiceToken[];
}
/**
 * Plugin event system for communication
 */
export interface PluginEventSystem {
    emit(event: string, data?: any): void;
    on(event: string, handler: (data: any) => void): void;
    off(event: string, handler: (data: any) => void): void;
    once(event: string, handler: (data: any) => void): void;
}
/**
 * Plugin storage interface for persistent data
 */
export interface PluginStorage {
    get(key: string): Promise<any>;
    set(key: string, value: any): Promise<void>;
    delete(key: string): Promise<void>;
    clear(): Promise<void>;
    keys(): Promise<string[]>;
}
/**
 * Plugin HTTP client for external API access
 */
export interface PluginHttpClient {
    get(url: string, options?: RequestInit): Promise<Response>;
    post(url: string, data?: any, options?: RequestInit): Promise<Response>;
    put(url: string, data?: any, options?: RequestInit): Promise<Response>;
    delete(url: string, options?: RequestInit): Promise<Response>;
}
/**
 * Plugin utilities for common operations
 */
export interface PluginUtilities {
    validateFormula(formula: string): boolean;
    parseFormula(formula: string): Record<string, number>;
    calculateMolarWeight(formula: string): number;
    formatNumber(value: number, precision?: number): string;
    sanitizeInput(input: string): string;
}
/**
 * Plugin extension point for different calculation types
 */
export interface PluginExtensionPoint {
    readonly name: string;
    readonly description: string;
    readonly inputTypes: string[];
    readonly outputType: string;
    readonly handler: PluginExtensionHandler;
}
/**
 * Plugin extension handler function
 */
export type PluginExtensionHandler<TInput = any, TOutput = any> = (input: TInput, context: PluginAPIContext) => Promise<PluginResult<TOutput>> | PluginResult<TOutput>;
/**
 * Plugin manifest for registration
 */
export interface PluginManifest {
    readonly metadata: PluginMetadata;
    readonly config: PluginConfig;
    readonly extensionPoints: PluginExtensionPoint[];
    readonly factory: PluginFactory;
}
/**
 * Plugin factory function for creating plugin instances
 */
export type PluginFactory = (params: PluginInitParams) => Plugin;
/**
 * Main plugin interface that all plugins must implement
 */
export interface Plugin extends PluginLifecycle {
    readonly metadata: PluginMetadata;
    readonly state: PluginState;
    readonly extensionPoints: PluginExtensionPoint[];
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
}
/**
 * Plugin manager events
 */
export interface PluginManagerEvents {
    'plugin-loaded': {
        plugin: Plugin;
    };
    'plugin-unloaded': {
        pluginId: string;
    };
    'plugin-activated': {
        plugin: Plugin;
    };
    'plugin-deactivated': {
        plugin: Plugin;
    };
    'plugin-error': {
        error: PluginError;
    };
    'plugin-health-check': {
        pluginId: string;
        status: PluginHealthStatus;
    };
}
/**
 * Plugin discovery source configuration
 */
export interface PluginDiscoverySource {
    readonly type: 'local' | 'npm' | 'url' | 'git';
    readonly location: string;
    readonly pattern?: string;
    readonly credentials?: Record<string, string>;
}
/**
 * Plugin marketplace entry
 */
export interface PluginMarketplaceEntry {
    readonly metadata: PluginMetadata;
    readonly downloads: number;
    readonly rating: number;
    readonly reviews: number;
    readonly verified: boolean;
    readonly downloadUrl: string;
    readonly screenshots?: string[];
    readonly readme?: string;
}
//# sourceMappingURL=types.d.ts.map