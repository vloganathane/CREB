/**
 * CREB-JS Plugin Examples
 *
 * Example plugin implementations demonstrating various plugin patterns
 * and use cases for third-party developers.
 *
 * @author Loganathane Virassamy
 * @version 1.7.0
 */
import { PluginMetadata, PluginManifest } from './types';
/**
 * Example 1: Custom Equation Balancing Algorithm Plugin
 * Demonstrates how to extend CREB's equation balancing capabilities
 */
export declare function createCustomBalancerPlugin(): PluginManifest;
/**
 * Example 2: External Data Provider Plugin
 * Demonstrates how to integrate with external chemistry databases
 */
export declare function createDataProviderPlugin(): PluginManifest;
/**
 * Example 3: Specialized Calculator Plugin
 * Demonstrates domain-specific chemistry calculations
 */
export declare function createSpecializedCalculatorPlugin(): PluginManifest;
/**
 * Plugin marketplace entry examples
 */
export declare const exampleMarketplaceEntries: {
    metadata: PluginMetadata;
    downloads: number;
    rating: number;
    reviews: number;
    verified: boolean;
    downloadUrl: string;
    screenshots: string[];
    readme: string;
}[];
//# sourceMappingURL=examples.d.ts.map