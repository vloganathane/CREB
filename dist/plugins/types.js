/**
 * CREB-JS Plugin System Types
 *
 * Type definitions for the plugin system including plugin interfaces,
 * API contexts, lifecycle management, and security configurations.
 *
 * @author Loganathane Virassamy
 * @version 1.7.0
 */
/**
 * Plugin execution context with permission levels
 */
export var PluginContext;
(function (PluginContext) {
    PluginContext["Calculation"] = "calculation";
    PluginContext["DataProvider"] = "data-provider";
    PluginContext["UI"] = "ui";
    PluginContext["System"] = "system";
})(PluginContext || (PluginContext = {}));
/**
 * Plugin permission levels for security sandboxing
 */
export var PluginPermission;
(function (PluginPermission) {
    PluginPermission["ReadOnly"] = "read-only";
    PluginPermission["ReadWrite"] = "read-write";
    PluginPermission["SystemAccess"] = "system-access";
    PluginPermission["NetworkAccess"] = "network-access";
})(PluginPermission || (PluginPermission = {}));
/**
 * Plugin lifecycle states
 */
export var PluginState;
(function (PluginState) {
    PluginState["Unloaded"] = "unloaded";
    PluginState["Loading"] = "loading";
    PluginState["Loaded"] = "loaded";
    PluginState["Active"] = "active";
    PluginState["Inactive"] = "inactive";
    PluginState["Error"] = "error";
    PluginState["Unloading"] = "unloading";
})(PluginState || (PluginState = {}));
/**
 * Plugin priority levels for execution order
 */
export var PluginPriority;
(function (PluginPriority) {
    PluginPriority[PluginPriority["Critical"] = 1000] = "Critical";
    PluginPriority[PluginPriority["High"] = 750] = "High";
    PluginPriority[PluginPriority["Normal"] = 500] = "Normal";
    PluginPriority[PluginPriority["Low"] = 250] = "Low";
    PluginPriority[PluginPriority["Background"] = 100] = "Background";
})(PluginPriority || (PluginPriority = {}));
//# sourceMappingURL=types.js.map