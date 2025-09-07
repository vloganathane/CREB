export { ChemicalEquationBalancer } from './balancer';
export { Stoichiometry } from './stoichiometry';
export { ElementCounter, EquationParser, calculateMolarWeight } from './utils';
export * from './types';
export * from './constants';

// Molecular Visualization System (NEW)
export * from './visualization';

// Enhanced TypeScript Support (NEW) - Selective exports to avoid conflicts
export {
  // Branded Types
  type ChemicalFormula,
  type ElementSymbol,
  type BalancedEquationString,
  type SMILESNotation,
  type InChINotation,
  type CASNumber,
  
  // Advanced Types
  type ValidElement,
  type TypedElementCount,
  type TypedCompound,
  type TypedReaction,
  type ReactionType,
  type PhaseState,
  
  // Type Guards
  isChemicalFormula,
  isElementSymbol,
  isBalancedEquation,
  
  // Utility Functions
  parseFormula,
  createChemicalFormula,
  createElementSymbol,
  
  // Error Types
  ChemicalFormulaError,
  EquationBalancingError
} from './advancedTypes';

export { EnhancedBalancer } from './enhancedBalancerSimple';

// Enhanced PubChem-integrated classes (Phase 2)
export { 
  EnhancedChemicalEquationBalancer,
  type EnhancedBalancedEquation,
  type CompoundInfo 
} from './enhancedBalancer';
export { 
  EnhancedStoichiometry,
  type EnhancedStoichiometryResult,
  type ReactionAnalysis 
} from './enhancedStoichiometry';

// Thermodynamics module (Phase 2 - Advanced Chemistry)
export { 
  ThermodynamicsCalculator,
  ThermodynamicsEquationBalancer,
  EnergyProfileGenerator,
  createEnergyProfile,
  exportEnergyProfile,
  type ThermodynamicsResult,
  type ReactionConditions,
  type ThermodynamicProperties,
  type TemperatureProfile,
  type EnergyProfile,
  type EnergyProfilePoint,
  type TransitionState,
  type ReactionCoordinate,
  type BondChange
} from './thermodynamics';

// Advanced Kinetics & Analytics Module (Phase 2 - v1.5.0)
export {
  ReactionKinetics,
  MechanismAnalyzer,
  ReactionSafetyAnalyzer,
  AdvancedKineticsAnalyzer,
  type ArrheniusData,
  type KineticsResult,
  type CatalystData,
  type MechanismStep,
  type MechanismAnalysis,
  type PathwayComparison,
  type SafetyData,
  type ToxicityData,
  type ReactivityData,
  type ReactionSafetyAssessment,
  type ThermalHazard,
  type ChemicalHazard,
  type PhysicalHazard,
  type EnvironmentalHazard,
  type SafetyRecommendation,
  type ReactionClass,
  type RateLawType
} from './kinetics';

// Enhanced Data Integration Module (Phase 2 - v1.6.0)
export {
  ChemicalDatabaseManager,
  NISTWebBookIntegration,
  DataValidationService,
  type CompoundDatabase,
  type ExtendedThermodynamicProperties,
  type PhysicalProperties,
  type SafetyProperties,
  type DatabaseSource,
  type DatabaseQuery,
  type DataImportResult,
  type DataExportOptions,
  type ValidationResult,
  type ValidationError,
  type ValidationWarning,
  type DatabaseProvider
} from './data';

// Advanced Validation Pipeline (VP-001) - v1.7.0
export {
  ValidationPipeline,
  createValidationPipeline,
  createFastValidationPipeline,
  createThoroughValidationPipeline,
  validateChemicalFormula,
  validateThermodynamicProperties,
  ChemicalFormulaValidator,
  ThermodynamicPropertiesValidator,
  FluentValidationBuilder,
  createValidator,
  createCompositeValidator,
  createChemistryValidator,
  type IValidator,
  type ICompositeValidator,
  type ValidationRule,
  type ValidationContext,
  type ValidationPipelineConfig,
  type ValidationMetrics,
  type ValidationEvents,
  type RuleResult,
  type ValidationSeverity
} from './data';

// Dependency Injection Container (v1.6.0 - Architecture Improvement)
export {
  Container,
  ServiceLifetime,
  CircularDependencyError,
  ServiceNotFoundError,
  MaxDepthExceededError,
  createToken,
  container,
  type ServiceToken,
  type ServiceFactory,
  type Constructor,
  type ServiceRegistration,
  type ContainerOptions,
  type ContainerMetrics,
  type IDisposable
} from './core/Container';

export {
  Injectable,
  Inject,
  Optional,
  Singleton,
  Transient,
  getInjectableMetadata,
  isInjectable,
  getDependencyTokens,
  type InjectableMetadata,
  type InjectableOptions,
  INJECTABLE_METADATA_KEY
} from './core/decorators/Injectable';

// Dependency Injection Setup (v1.6.0 - Full Integration)
export {
  setupCREBContainer,
  initializeCREBDI,
  getService,
  createChildContainer,
  CREBServices,
  IConfigManagerToken,
  IBalancerToken,
  IEnhancedBalancerToken,
  IStoichiometryToken,
  IThermodynamicsCalculatorToken,
  IStorageProviderToken,
  ICacheToken,
  IWorkerPoolToken,
  ITaskQueueToken,
} from './DISetup';

// Enhanced Error Handling (v1.6.0 - Resilience & Reliability)
export {
  CREBError,
  ValidationError as CREBValidationError,
  NetworkError,
  ExternalAPIError,
  ComputationError,
  SystemError,
  ErrorAggregator,
  ErrorUtils,
  ErrorCategory,
  ErrorSeverity,
  type ErrorContext,
  type ErrorMetadata
} from './core/errors/CREBError';

export {
  CircuitBreaker,
  CircuitBreakerManager,
  circuitBreakerManager,
  WithCircuitBreaker,
  CircuitBreakerState,
  type CircuitBreakerConfig,
  type CircuitBreakerMetrics
} from './core/resilience/CircuitBreaker';

export {
  RetryPolicy,
  RetryPolicies,
  RateLimiter,
  WithRetry,
  createRetryPolicy,
  RetryStrategy,
  type RetryConfig,
  type RetryMetrics,
  type RetryResult
} from './core/resilience/RetryPolicy';

export {
  EnhancedNISTIntegration,
  EnhancedPubChemIntegration,
  EnhancedSQLiteStorage,
  SystemHealthMonitor,
  GracefulDegradationService,
  demonstrateEnhancedErrorHandling
} from './core/ErrorHandlingIntegrationExample';

// Export configuration management
export {
  ConfigManager,
  configManager,
  getConfig,
  setConfig,
  getFullConfig
} from './config/ConfigManager';

export {
  type CREBConfig,
  type PartialCREBConfig,
  type CacheConfig,
  type PerformanceConfig,
  type DataConfig,
  type LoggingConfig,
  type ConfigValidationResult,
  type ConfigChangeEvent,
  type ConfigPath,
  type ConfigValueType,
  isCREBConfig
} from './config/types';

export {
  defaultConfig,
  validateConfig,
  generateSchemaDocumentation
} from './config/schemas/validation';

// Advanced Caching System (v1.6.0 - Performance Optimization)
export {
  AdvancedCache,
  CacheFactory,
  CachedThermodynamicsCalculator,
  CachedChemicalDatabase,
  CachedEquationBalancer,
  MultiLevelCache,
  demonstrateAdvancedCaching
} from './performance/cache/CacheIntegration';

export {
  type AdvancedCacheConfig,
  type CacheEntry,
  type CacheResult,
  type CacheEventListener,
  type CacheEvent,
  type CacheMetrics,
  type CacheStats,
  type EvictionStrategy,
  type CacheEventType,
  type EvictionPolicy,
  type IAdvancedCache,
  type CacheFactoryConfig,
  type MultiLevelCacheConfig
} from './performance/cache/types';

export {
  LRUEvictionPolicy,
  LFUEvictionPolicy,
  FIFOEvictionPolicy,
  TTLEvictionPolicy,
  RandomEvictionPolicy,
  AdaptiveEvictionPolicy,
  EvictionPolicyFactory
} from './performance/cache/EvictionPolicies';

// Worker Thread System (v1.7.0 - Advanced Parallel Computing)
export {
  CREBWorkerManager,
  WorkerPool,
  TaskQueue,
  TaskBuilder,
  WorkerPerformanceMonitor,
  createWorkerManager,
  createCriticalTask,
  createBatchTasks
} from './performance/workers';

export {
  type WorkerTask,
  type TaskResult,
  type WorkerPoolConfig,
  type WorkerPoolMetrics,
  type WorkerHealthMetrics,
  type TaskPriority,
  type TaskStatus,
  type WorkerStatus,
  type CalculationType,
  type WorkerError,
  type WorkerInstance,
  type TaskExecution,
  type QueueStats,
  type PerformanceBenchmark,
  type EquationBalancingTask,
  type ThermodynamicsTask,
  type BatchAnalysisTask,
  type MatrixSolvingTask,
  type RecoveryConfig,
  type WorkerId,
  type TaskId,
  createWorkerId,
  createTaskId
} from './performance/workers/types';

// Plugin System (v1.7.0)
export {
  PluginManager,
  type PluginManagerConfig
} from './plugins/PluginManager';

export {
  BasePlugin,
  SimplePlugin,
  PluginBuilder
} from './plugins/Plugin';

export {
  PluginAPIContextImpl,
  PluginAPIContextFactory
} from './plugins/APIContext';

export {
  type Plugin,
  type PluginMetadata,
  type PluginConfig,
  type PluginState,
  type PluginContext,
  type PluginPermission,
  type PluginPriority,
  type PluginAPIVersion,
  type PluginExtensionPoint,
  type PluginResult,
  type PluginHealthStatus,
  type PluginManifest,
  type PluginFactory,
  type PluginAPIContext,
  type PluginServiceRegistry,
  type PluginEventSystem,
  type PluginStorage,
  type PluginHttpClient,
  type PluginUtilities,
  type PluginLogger,
  type PluginError,
  type PluginManagerEvents,
  type PluginDiscoverySource,
  type PluginMarketplaceEntry,
  PluginContext as PluginContextEnum,
  PluginPermission as PluginPermissionEnum,
  PluginPriority as PluginPriorityEnum,
  PluginState as PluginStateEnum
} from './plugins/types';

export {
  createCustomBalancerPlugin,
  createDataProviderPlugin,
  createSpecializedCalculatorPlugin,
  exampleMarketplaceEntries
} from './plugins/examples';

// Telemetry System (v1.8.0)
export {
  // Core Telemetry System
  TelemetrySystem,
  initializeTelemetry,
  telemetry,
  
  // Structured Logging
  StructuredLogger,
  LoggerFactory,
  ConsoleDestination,
  FileDestination,
  LevelFilter,
  ModuleFilter,
  logger,
  createLogger,
  createConsoleLogger,
  createFileLogger,
  createMultiDestinationLogger,
  
  // Metrics and Performance
  MetricsRegistry,
  PerformanceProfiler,
  globalMetrics,
  globalProfiler,
  counter,
  gauge,
  histogram,
  time,
  timeAsync,
  Profile,
  
  // Context Management
  ContextManager,
  ContextUtils,
  globalContextManager,
  getCurrentContext,
  getCurrentCorrelationId,
  setContext,
  setCorrelationId,
  runWithContext,
  runWithContextAsync,
  withContext,
  
  // Telemetry Types
  type LogLevel,
  type LogEntry,
  type LogContext,
  type LoggerConfig,
  type LogDestination,
  type LogFormatter,
  type LogFilter,
  type CorrelationId,
  type ErrorInfo,
  type PerformanceMetrics,
  type Metric,
  type MetricType,
  type MetricCollector,
  type ContextProvider,
  type TelemetryEvents,
  type ILogger,
  type TelemetryConfig,
  type MetricStats,
  type ContextTrace,
  type Timestamp,
  
  // Utility Functions
  createCorrelationId,
  createTimestamp,
  isLogLevel,
  isLogEntry,
  isMetric,
  LOG_LEVELS,
  PERFORMANCE_THRESHOLDS,
  DEFAULT_TELEMETRY_CONFIG
} from './core/telemetry';
