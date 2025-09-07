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
import { Container } from '../core/Container';
import { PluginAPIContext, PluginAPIVersion, PluginServiceRegistry, PluginEventSystem, PluginStorage, PluginHttpClient, PluginUtilities, PluginPermission, PluginLogger } from './types';
/**
 * Permission denied error for unauthorized plugin operations
 */
export declare class PluginPermissionError extends Error {
    readonly pluginId: string;
    readonly requiredPermission: PluginPermission;
    constructor(pluginId: string, requiredPermission: PluginPermission, operation: string);
}
/**
 * Resource limit exceeded error
 */
export declare class PluginResourceError extends Error {
    readonly pluginId: string;
    readonly resource: string;
    readonly limit: number;
    readonly used: number;
    constructor(pluginId: string, resource: string, limit: number, used: number);
}
/**
 * Main plugin API context implementation
 */
export declare class PluginAPIContextImpl implements PluginAPIContext {
    private readonly container;
    private readonly pluginId;
    private readonly permissions;
    private readonly logger;
    private readonly globalEventSystem;
    private readonly globalStorage;
    readonly version: PluginAPIVersion;
    readonly services: PluginServiceRegistry;
    readonly events: PluginEventSystem;
    readonly storage: PluginStorage;
    readonly http: PluginHttpClient;
    readonly utils: PluginUtilities;
    constructor(container: Container, pluginId: string, permissions: PluginPermission[], logger: PluginLogger, globalEventSystem: EventEmitter, globalStorage: Map<string, any>);
}
/**
 * Plugin API context factory
 */
export declare class PluginAPIContextFactory {
    private readonly container;
    private readonly globalEventSystem;
    private readonly globalStorage;
    constructor(container: Container, globalEventSystem: EventEmitter, globalStorage: Map<string, any>);
    create(pluginId: string, permissions: PluginPermission[], logger: PluginLogger): PluginAPIContext;
}
//# sourceMappingURL=APIContext.d.ts.map