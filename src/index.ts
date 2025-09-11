export { ChemicalEquationBalancer } from './balancer';
export { Stoichiometry } from './stoichiometry';
export { ElementCounter, EquationParser, calculateMolarWeight } from './utils';
export * from './types';
export * from './constants';

// Molecular Visualization System (NEW)
export * from './visualization';

// Reaction Animation System (NEW - Phase 0 Integration)
export { ReactionAnimator } from './visualization/ReactionAnimation';

// Enhanced TypeScript Support (NEW) - Selective exports to avoid conflicts
export {
  // Branded Types
  ChemicalFormula,
  ElementSymbol,
  BalancedEquationString,
  SMILESNotation,
  InChINotation,
  CASNumber,
  
  // Advanced Types
  ValidElement,
  TypedElementCount,
  TypedCompound,
  TypedReaction,
  ReactionType,
  PhaseState,
  
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
  EnhancedBalancedEquation,
  CompoundInfo 
} from './enhancedBalancer';
export { 
  EnhancedStoichiometry,
  EnhancedStoichiometryResult,
  ReactionAnalysis 
} from './enhancedStoichiometry';

// Thermodynamics module (Phase 2 - Advanced Chemistry)
export { 
  ThermodynamicsCalculator,
  ThermodynamicsEquationBalancer,
  EnergyProfileGenerator,
  createEnergyProfile,
  exportEnergyProfile,
  ThermodynamicsResult,
  ReactionConditions,
  ThermodynamicProperties,
  TemperatureProfile,
  EnergyProfile,
  EnergyProfilePoint,
  TransitionState,
  ReactionCoordinate,
  BondChange
} from './thermodynamics';

// Advanced Kinetics & Analytics Module (Phase 2 - v1.5.0)
export {
  ReactionKinetics,
  MechanismAnalyzer,
  ReactionSafetyAnalyzer,
  AdvancedKineticsAnalyzer,
  ArrheniusData,
  KineticsResult,
  CatalystData,
  MechanismStep,
  MechanismAnalysis,
  PathwayComparison,
  SafetyData,
  ToxicityData,
  ReactivityData,
  ReactionSafetyAssessment,
  ThermalHazard,
  ChemicalHazard,
  PhysicalHazard,
  EnvironmentalHazard,
  SafetyRecommendation,
  ReactionClass,
  RateLawType
} from './kinetics';

// Enhanced Data Integration Module (Phase 2 - v1.6.0)
export {
  ChemicalDatabaseManager,
  NISTWebBookIntegration,
  DataValidationService,
  CompoundDatabase,
  ExtendedThermodynamicProperties,
  PhysicalProperties,
  SafetyProperties,
  DatabaseSource,
  DatabaseQuery,
  DataImportResult,
  DataExportOptions,
  ValidationResult,
  ValidationError,
  ValidationWarning,
  DatabaseProvider
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
  IValidator,
  ICompositeValidator,
  ValidationRule,
  ValidationContext,
  ValidationPipelineConfig,
  ValidationMetrics,
  ValidationEvents,
  RuleResult,
  ValidationSeverity
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
  ServiceToken,
  ServiceFactory,
  Constructor,
  ServiceRegistration,
  ContainerOptions,
  ContainerMetrics,
  IDisposable
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
  InjectableMetadata,
  InjectableOptions,
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
  ErrorContext,
  ErrorMetadata
} from './core/errors/CREBError';

export {
  CircuitBreaker,
  CircuitBreakerManager,
  circuitBreakerManager,
  WithCircuitBreaker,
  CircuitBreakerState,
  CircuitBreakerConfig,
  CircuitBreakerMetrics
} from './core/resilience/CircuitBreaker';

export {
  RetryPolicy,
  RetryPolicies,
  RateLimiter,
  WithRetry,
  createRetryPolicy,
  RetryStrategy,
  RetryConfig,
  RetryMetrics,
  RetryResult
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
  CREBConfig,
  PartialCREBConfig,
  CacheConfig,
  PerformanceConfig,
  DataConfig,
  LoggingConfig,
  ConfigValidationResult,
  ConfigChangeEvent,
  ConfigPath,
  ConfigValueType,
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
  AdvancedCacheConfig,
  CacheEntry,
  CacheResult,
  CacheEventListener,
  CacheEvent,
  CacheMetrics,
  CacheStats,
  EvictionStrategy,
  CacheEventType,
  EvictionPolicy,
  IAdvancedCache,
  CacheFactoryConfig,
  MultiLevelCacheConfig
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
  WorkerTask,
  TaskResult,
  WorkerPoolConfig,
  WorkerPoolMetrics,
  WorkerHealthMetrics,
  TaskPriority,
  TaskStatus,
  WorkerStatus,
  CalculationType,
  WorkerError,
  WorkerInstance,
  TaskExecution,
  QueueStats,
  PerformanceBenchmark,
  EquationBalancingTask,
  ThermodynamicsTask,
  BatchAnalysisTask,
  MatrixSolvingTask,
  RecoveryConfig,
  WorkerId,
  TaskId,
  createWorkerId,
  createTaskId
} from './performance/workers/types';

// Plugin System (v1.7.0)
export {
  PluginManager,
  PluginManagerConfig
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
  Plugin,
  PluginMetadata,
  PluginConfig,
  PluginState,
  PluginContext,
  PluginPermission,
  PluginPriority,
  PluginAPIVersion,
  PluginExtensionPoint,
  PluginResult,
  PluginHealthStatus,
  PluginManifest,
  PluginFactory,
  PluginAPIContext,
  PluginServiceRegistry,
  PluginEventSystem,
  PluginStorage,
  PluginHttpClient,
  PluginUtilities,
  PluginLogger,
  PluginError,
  PluginManagerEvents,
  PluginDiscoverySource,
  PluginMarketplaceEntry,
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
  LogLevel,
  LogEntry,
  LogContext,
  LoggerConfig,
  LogDestination,
  LogFormatter,
  LogFilter,
  CorrelationId,
  ErrorInfo,
  PerformanceMetrics,
  Metric,
  MetricType,
  MetricCollector,
  ContextProvider,
  TelemetryEvents,
  ILogger,
  TelemetryConfig,
  MetricStats,
  ContextTrace,
  Timestamp,
  
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
