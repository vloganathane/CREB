/**
 * CREB-JS Dependency Injection Integration Example
 *
 * Demonstrates how to integrate the new DI container with existing
 * CREB-JS components for better testability and modularity.
 *
 * @author Loganathane Virassamy
 * @version 1.6.0
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Container, createToken, ServiceLifetime } from '../core/Container';
import { Injectable, Singleton } from '../core/decorators/Injectable';
// Define service tokens for better type safety
const ILoggerToken = createToken('ILogger');
const ICacheToken = createToken('ICache');
const ICalculatorToken = createToken('ICalculator');
// Enhanced service implementations with DI support
let EnhancedLogger = class EnhancedLogger {
    constructor() {
        this.prefix = '[CREB-JS]';
    }
    info(message) {
        console.log(`${this.prefix} INFO: ${message}`);
    }
    warn(message) {
        console.warn(`${this.prefix} WARN: ${message}`);
    }
    error(message) {
        console.error(`${this.prefix} ERROR: ${message}`);
    }
};
EnhancedLogger = __decorate([
    Injectable()
], EnhancedLogger);
let SimpleCache = class SimpleCache {
    constructor() {
        this.cache = new Map();
    }
    get(key) {
        return this.cache.get(key);
    }
    set(key, value) {
        this.cache.set(key, value);
    }
    clear() {
        this.cache.clear();
    }
    size() {
        return this.cache.size;
    }
};
SimpleCache = __decorate([
    Injectable()
], SimpleCache);
let CachedCalculator = class CachedCalculator {
    constructor(cache, logger) {
        this.cache = cache;
        this.logger = logger;
    }
    calculate(equation) {
        this.logger.info(`Calculating: ${equation}`);
        // Check cache first
        const cached = this.cache.get(equation);
        if (cached) {
            this.logger.info('Using cached result');
            return cached;
        }
        // Simulate calculation
        const result = {
            equation,
            coefficients: [1, 1, 1, 1], // Simplified
            isBalanced: true,
            timestamp: new Date().toISOString(),
        };
        // Cache the result
        this.cache.set(equation, result);
        this.logger.info('Result calculated and cached');
        return result;
    }
};
CachedCalculator = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [Object, Object])
], CachedCalculator);
/**
 * Application service composition using DI container
 */
let CREBApplication = class CREBApplication {
    constructor(calculator, cache, logger) {
        this.calculator = calculator;
        this.cache = cache;
        this.logger = logger;
    }
    async initialize() {
        this.logger.info('Initializing CREB-JS application with DI container');
        this.cache.clear();
        this.logger.info('Application initialized successfully');
    }
    processReaction(equation) {
        this.logger.info(`Processing reaction: ${equation}`);
        try {
            const result = this.calculator.calculate(equation);
            this.logger.info('Reaction processed successfully');
            return result;
        }
        catch (error) {
            this.logger.error(`Failed to process reaction: ${error}`);
            throw error;
        }
    }
    getCacheStats() {
        return {
            size: this.cache.size(),
        };
    }
};
CREBApplication = __decorate([
    Singleton(),
    __metadata("design:paramtypes", [Object, Object, Object])
], CREBApplication);
/**
 * Container configuration and setup
 */
export function setupDIContainer() {
    const container = new Container({
        enableCircularDependencyDetection: true,
        enablePerformanceTracking: true,
        maxResolutionDepth: 50,
    });
    // Register services using manual dependency specification
    container.registerClass(EnhancedLogger, [], ServiceLifetime.Singleton, ILoggerToken);
    container.registerClass(SimpleCache, [], ServiceLifetime.Singleton, ICacheToken);
    container.registerClass(CachedCalculator, [ICacheToken, ILoggerToken], ServiceLifetime.Singleton, ICalculatorToken);
    container.registerClass(CREBApplication, [ICalculatorToken, ICacheToken, ILoggerToken], ServiceLifetime.Singleton);
    return container;
}
/**
 * Example usage demonstrating the DI container benefits
 */
export async function demonstrateDIIntegration() {
    console.log('🧪 CREB-JS Dependency Injection Integration Demo\n');
    // Setup container
    const container = setupDIContainer();
    // Get application instance
    const app = container.resolve(CREBApplication);
    // Initialize
    await app.initialize();
    // Process some reactions
    const reactions = [
        'H2 + O2 = H2O',
        'CH4 + 2O2 = CO2 + 2H2O',
        'H2 + O2 = H2O', // Duplicate to test caching
        'C6H12O6 + 6O2 = 6CO2 + 6H2O'
    ];
    console.log('📊 Processing reactions with DI-enhanced services:\n');
    for (const reaction of reactions) {
        try {
            console.log(`⚗️  Processing: ${reaction}`);
            const result = app.processReaction(reaction);
            console.log(`✅ Result: ${result.isBalanced ? 'Balanced' : 'Not balanced'}`);
            console.log(`   Coefficients: [${result.coefficients.join(', ')}]\n`);
        }
        catch (error) {
            console.log(`❌ Error: ${error}\n`);
        }
    }
    // Show cache stats
    const cacheStats = app.getCacheStats();
    console.log(`💾 Cache Statistics: ${cacheStats.size} cached results`);
    // Show container metrics
    const metrics = container.getMetrics();
    console.log('\n📈 Container Performance Metrics:');
    console.log(`   Resolutions: ${metrics.resolutions}`);
    console.log(`   Singletons Created: ${metrics.singletonCreations}`);
    console.log(`   Average Resolution Time: ${metrics.averageResolutionTime.toFixed(2)}ms`);
    console.log(`   Peak Resolution Depth: ${metrics.peakResolutionDepth}`);
    // Demonstrate child container
    console.log('\n🔧 Testing child container inheritance:');
    const childContainer = container.createChild();
    const childApp = childContainer.resolve(CREBApplication);
    console.log(`   Child app cache size: ${childApp.getCacheStats().size}`);
    // Clean up
    container.dispose();
    console.log('\n🧹 Container disposed and resources cleaned up');
}
/**
 * Testing benefits with DI - Mock implementations
 */
class MockLogger {
    constructor() {
        this.logs = [];
    }
    info(message) {
        this.logs.push(`INFO: ${message}`);
    }
    warn(message) {
        this.logs.push(`WARN: ${message}`);
    }
    error(message) {
        this.logs.push(`ERROR: ${message}`);
    }
}
export function createTestContainer() {
    const container = new Container();
    // Register mock implementations for testing
    container.registerInstance(ILoggerToken, new MockLogger());
    container.registerClass(SimpleCache, [], ServiceLifetime.Singleton, ICacheToken);
    container.registerClass(CachedCalculator, [ICacheToken, ILoggerToken], ServiceLifetime.Singleton, ICalculatorToken);
    container.registerClass(CREBApplication, [ICalculatorToken, ICacheToken, ILoggerToken], ServiceLifetime.Singleton);
    return container;
}
// Export tokens for use in other modules
export { ILoggerToken, ICacheToken, ICalculatorToken, CREBApplication, CachedCalculator, EnhancedLogger, SimpleCache, MockLogger, };
// Run demo if called directly
if (require.main === module) {
    demonstrateDIIntegration().catch(console.error);
}
//# sourceMappingURL=DIIntegrationExample.js.map