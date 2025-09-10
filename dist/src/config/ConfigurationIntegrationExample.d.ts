/**
 * Configuration Management Integration Example
 *
 * This example demonstrates all features of the CREB configuration system:
 * - Type-safe configuration access
 * - Environment variable overrides
 * - Configuration validation
 * - Hot-reload capability
 * - Runtime configuration updates
 * - Event handling
 */
import { ConfigManager } from './ConfigManager';
/**
 * Example: Basic Configuration Usage
 */
export declare function basicConfigurationExample(): void;
/**
 * Example: Environment Variable Integration
 */
export declare function environmentVariableExample(): void;
/**
 * Example: Configuration Validation
 */
export declare function configurationValidationExample(): void;
/**
 * Example: File-based Configuration
 */
export declare function fileBasedConfigurationExample(): Promise<void>;
/**
 * Example: Event Handling and Change Tracking
 */
export declare function eventHandlingExample(): void;
/**
 * Example: Hot-reload Configuration (Simulated)
 */
export declare function hotReloadExample(): Promise<void>;
/**
 * Example: Configuration Metadata and History
 */
export declare function metadataAndHistoryExample(): void;
/**
 * Example: Documentation Generation
 */
export declare function documentationGenerationExample(): void;
/**
 * Example: Integration with Application Components
 */
export declare class ExampleChemistryCalculator {
    private configManager;
    constructor(configManager: ConfigManager);
    performCalculation(): void;
    private reinitializeCalculationEngine;
    private updateBatchProcessing;
}
/**
 * Example: Application Integration
 */
export declare function applicationIntegrationExample(): void;
/**
 * Run all examples
 */
export declare function runAllConfigurationExamples(): Promise<void>;
export { ConfigManager, getConfig, setConfig } from './ConfigManager';
export * from './types';
//# sourceMappingURL=ConfigurationIntegrationExample.d.ts.map