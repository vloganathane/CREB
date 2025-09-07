/**
 * @creb/vue - Vue 3 Composables for CREB-JS
 * Enhanced TypeScript support with complete reactivity
 * Part of Q4 2025 Platform Integration initiative
 */

import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue';
import type { Ref, ComputedRef, WatchStopHandle } from 'vue';
import { 
  EquationBalancer, 
  ThermodynamicsCalculator, 
  PubChemCompound,
  BalanceResult,
  ThermodynamicsResult,
  CompoundData,
  CalculationError
} from '@creb/core';

// Enhanced composable result types
export interface UseEquationBalancerReturn {
  readonly result: Ref<BalanceResult | null>;
  readonly loading: Ref<boolean>;
  readonly error: Ref<CalculationError | null>;
  readonly history: Ref<BalanceResult[]>;
  readonly balance: (equation: string) => Promise<void>;
  readonly clear: () => void;
  readonly isValid: ComputedRef<boolean>;
}

export interface UseThermodynamicsReturn {
  readonly result: Ref<ThermodynamicsResult | null>;
  readonly loading: Ref<boolean>;
  readonly error: Ref<CalculationError | null>;
  readonly temperature: Ref<number>;
  readonly pressure: Ref<number>;
  readonly calculate: (equation: string) => Promise<void>;
  readonly clear: () => void;
  readonly setConditions: (temp: number, press: number) => void;
  readonly isSpontaneous: ComputedRef<boolean>;
}

export interface UseCompoundSearchReturn {
  readonly compounds: Ref<CompoundData[]>;
  readonly loading: Ref<boolean>;
  readonly error: Ref<Error | null>;
  readonly selectedCompound: Ref<CompoundData | null>;
  readonly search: (query: string, type?: 'name' | 'formula' | 'smiles') => Promise<void>;
  readonly clear: () => void;
  readonly selectCompound: (compound: CompoundData | null) => void;
  readonly hasResults: ComputedRef<boolean>;
}

export interface UseMolecularVisualizationReturn {
  readonly structure: Ref<any | null>;
  readonly loading: Ref<boolean>;
  readonly error: Ref<Error | null>;
  readonly renderStyle: Ref<'2d' | '3d' | 'ball-stick' | 'space-fill'>;
  readonly interactive: Ref<boolean>;
  readonly colorScheme: Ref<'default' | 'cpk' | 'element'>;
  readonly generateStructure: (smiles: string) => Promise<void>;
  readonly setRenderStyle: (style: '2d' | '3d' | 'ball-stick' | 'space-fill') => void;
  readonly toggleInteractive: () => void;
}

// Main equation balancing composable
export function useEquationBalancer(): UseEquationBalancerReturn {
  const result = ref<BalanceResult | null>(null);
  const loading = ref(false);
  const error = ref<CalculationError | null>(null);
  const history = ref<BalanceResult[]>([]);
  
  let balancer: EquationBalancer;
  
  onMounted(() => {
    balancer = new EquationBalancer();
  });

  const balance = async (equation: string): Promise<void> => {
    if (!equation.trim()) return;
    
    try {
      loading.value = true;
      error.value = null;
      
      const balanceResult = await balancer.balance(equation);
      
      result.value = balanceResult;
      history.value = [balanceResult, ...history.value.slice(0, 9)]; // Keep last 10
      
    } catch (err) {
      error.value = err as CalculationError;
      result.value = null;
    } finally {
      loading.value = false;
    }
  };

  const clear = (): void => {
    result.value = null;
    error.value = null;
    history.value = [];
  };

  const isValid = computed(() => result.value?.isBalanced ?? false);

  return {
    result,
    loading,
    error,
    history,
    balance,
    clear,
    isValid
  };
}

// Thermodynamics calculation composable
export function useThermodynamics(): UseThermodynamicsReturn {
  const result = ref<ThermodynamicsResult | null>(null);
  const loading = ref(false);
  const error = ref<CalculationError | null>(null);
  const temperature = ref(298.15); // 25°C
  const pressure = ref(101325);    // 1 atm

  let calculator: ThermodynamicsCalculator;

  onMounted(() => {
    calculator = new ThermodynamicsCalculator();
  });

  const calculate = async (equation: string): Promise<void> => {
    if (!equation.trim()) return;

    try {
      loading.value = true;
      error.value = null;

      const thermResult = await calculator.calculate(equation, {
        temperature: temperature.value,
        pressure: pressure.value
      });

      result.value = thermResult;

    } catch (err) {
      error.value = err as CalculationError;
      result.value = null;
    } finally {
      loading.value = false;
    }
  };

  const setConditions = (temp: number, press: number): void => {
    temperature.value = temp;
    pressure.value = press;
  };

  const clear = (): void => {
    result.value = null;
    error.value = null;
  };

  const isSpontaneous = computed(() => 
    result.value ? result.value.deltaG < 0 : false
  );

  return {
    result,
    loading,
    error,
    temperature,
    pressure,
    calculate,
    clear,
    setConditions,
    isSpontaneous
  };
}

// Compound search composable with PubChem integration
export function useCompoundSearch(): UseCompoundSearchReturn {
  const compounds = ref<CompoundData[]>([]);
  const loading = ref(false);
  const error = ref<Error | null>(null);
  const selectedCompound = ref<CompoundData | null>(null);

  const search = async (
    query: string,
    type: 'name' | 'formula' | 'smiles' = 'name'
  ): Promise<void> => {
    if (!query.trim()) return;

    try {
      loading.value = true;
      error.value = null;

      let results: CompoundData[] = [];

      switch (type) {
        case 'name':
          results = await PubChemCompound.fromName(query);
          break;
        case 'formula':
          results = await PubChemCompound.fromFormula(query);
          break;
        case 'smiles':
          results = await PubChemCompound.fromSmiles(query);
          break;
      }

      compounds.value = results;

    } catch (err) {
      error.value = err as Error;
      compounds.value = [];
    } finally {
      loading.value = false;
    }
  };

  const clear = (): void => {
    compounds.value = [];
    error.value = null;
    selectedCompound.value = null;
  };

  const selectCompound = (compound: CompoundData | null): void => {
    selectedCompound.value = compound;
  };

  const hasResults = computed(() => compounds.value.length > 0);

  return {
    compounds,
    loading,
    error,
    selectedCompound,
    search,
    clear,
    selectCompound,
    hasResults
  };
}

// Molecular visualization composable (for future 3D integration)
export function useMolecularVisualization(): UseMolecularVisualizationReturn {
  const structure = ref<any>(null);
  const loading = ref(false);
  const error = ref<Error | null>(null);
  const renderStyle = ref<'2d' | '3d' | 'ball-stick' | 'space-fill'>('3d');
  const interactive = ref(true);
  const colorScheme = ref<'default' | 'cpk' | 'element'>('cpk');

  const generateStructure = async (smiles: string): Promise<void> => {
    if (!smiles.trim()) return;

    try {
      loading.value = true;
      error.value = null;

      // This will integrate with the molecular visualization system
      // For now, it's a placeholder that will be completed in Phase 2
      const mockStructure = {
        smiles,
        atoms: [],
        bonds: [],
        coordinates: []
      };

      structure.value = mockStructure;

    } catch (err) {
      error.value = err as Error;
      structure.value = null;
    } finally {
      loading.value = false;
    }
  };

  const setRenderStyle = (style: '2d' | '3d' | 'ball-stick' | 'space-fill'): void => {
    renderStyle.value = style;
  };

  const toggleInteractive = (): void => {
    interactive.value = !interactive.value;
  };

  return {
    structure,
    loading,
    error,
    renderStyle,
    interactive,
    colorScheme,
    generateStructure,
    setRenderStyle,
    toggleInteractive
  };
}

// Combined chemistry calculations composable
export function useChemistryCalculations() {
  const balancer = useEquationBalancer();
  const thermodynamics = useThermodynamics();
  const compoundSearch = useCompoundSearch();
  const molecular = useMolecularVisualization();

  const calculateComplete = async (equation: string): Promise<void> => {
    // Perform equation balancing and thermodynamics calculation together
    await Promise.all([
      balancer.balance(equation),
      thermodynamics.calculate(equation)
    ]);
  };

  const isLoading = computed(() => 
    balancer.loading.value || 
    thermodynamics.loading.value || 
    compoundSearch.loading.value || 
    molecular.loading.value
  );

  const hasError = computed(() => 
    balancer.error.value || 
    thermodynamics.error.value || 
    compoundSearch.error.value || 
    molecular.error.value
  );

  const clearAll = (): void => {
    balancer.clear();
    thermodynamics.clear();
    compoundSearch.clear();
  };

  return {
    balancer,
    thermodynamics,
    compoundSearch,
    molecular,
    calculateComplete,
    isLoading,
    hasError,
    clearAll
  };
}

// Reactive equation input composable with auto-calculation
export function useReactiveEquationInput(debounceMs: number = 500) {
  const equation = ref('');
  const chemistry = useChemistryCalculations();
  let debounceTimer: number | null = null;

  const stopWatcher = watch(equation, (newEquation) => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    debounceTimer = window.setTimeout(async () => {
      if (newEquation.trim()) {
        await chemistry.calculateComplete(newEquation);
      }
    }, debounceMs);
  });

  onUnmounted(() => {
    stopWatcher();
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
  });

  return {
    equation,
    ...chemistry
  };
}

// Local storage persistence composable
export function useChemistryHistory(maxItems: number = 50) {
  const history = ref<Array<{
    equation: string;
    balance: BalanceResult;
    thermodynamics: ThermodynamicsResult;
    timestamp: number;
  }>>([]);

  // Load history from localStorage on mount
  onMounted(() => {
    try {
      const stored = localStorage.getItem('creb-chemistry-history');
      if (stored) {
        history.value = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Failed to load chemistry history:', error);
    }
  });

  // Watch for changes and save to localStorage
  watch(history, (newHistory) => {
    try {
      localStorage.setItem('creb-chemistry-history', JSON.stringify(newHistory));
    } catch (error) {
      console.warn('Failed to save chemistry history:', error);
    }
  }, { deep: true });

  const addToHistory = (
    equation: string,
    balance: BalanceResult,
    thermodynamics: ThermodynamicsResult
  ): void => {
    const entry = {
      equation,
      balance,
      thermodynamics,
      timestamp: Date.now()
    };

    history.value = [entry, ...history.value.slice(0, maxItems - 1)];
  };

  const clearHistory = (): void => {
    history.value = [];
    localStorage.removeItem('creb-chemistry-history');
  };

  const removeFromHistory = (index: number): void => {
    history.value = history.value.filter((_, i) => i !== index);
  };

  return {
    history,
    addToHistory,
    clearHistory,
    removeFromHistory
  };
}

// Performance monitoring composable
export function usePerformanceMonitoring() {
  const metrics = ref({
    calculationTime: 0,
    apiCalls: 0,
    cacheHits: 0,
    errors: 0
  });

  const startTime = ref(0);

  const startTiming = (): void => {
    startTime.value = performance.now();
  };

  const endTiming = (): void => {
    if (startTime.value > 0) {
      metrics.value.calculationTime = performance.now() - startTime.value;
      startTime.value = 0;
    }
  };

  const incrementApiCalls = (): void => {
    metrics.value.apiCalls++;
  };

  const incrementCacheHits = (): void => {
    metrics.value.cacheHits++;
  };

  const incrementErrors = (): void => {
    metrics.value.errors++;
  };

  const reset = (): void => {
    metrics.value = {
      calculationTime: 0,
      apiCalls: 0,
      cacheHits: 0,
      errors: 0
    };
  };

  const cacheHitRatio = computed(() => {
    const total = metrics.value.apiCalls + metrics.value.cacheHits;
    return total > 0 ? metrics.value.cacheHits / total : 0;
  });

  return {
    metrics,
    startTiming,
    endTiming,
    incrementApiCalls,
    incrementCacheHits,
    incrementErrors,
    reset,
    cacheHitRatio
  };
}
