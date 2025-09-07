/**
 * CREB-JS Plugin System
 * 
 * Export all plugin system components for easy access
 * 
 * @author Loganathane Virassamy
 * @version 1.7.0
 */

// Core plugin system
export { PluginManager, PluginManagerConfig } from './PluginManager';
export { BasePlugin, SimplePlugin, PluginBuilder } from './Plugin';
export { PluginAPIContextImpl, PluginAPIContextFactory } from './APIContext';

// Types and interfaces
export * from './types';

// Plugin examples and utilities
export * from './examples';
