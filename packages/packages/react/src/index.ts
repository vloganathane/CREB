/**
 * @creb/react - React Hooks for CREB-JS
 * Enhanced TypeScript support with complete type safety
 * Part of Q4 2025 Platform Integration initiative
 */

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { 
  EquationBalancer, 
  ThermodynamicsCalculator, 
  PubChemCompound,
  BalanceResult,
  ThermodynamicsResult,
  CompoundData,
  CalculationError
} from '@creb/core';

// Enhanced hook result types with loading states
export interface UseEquationBalancerResult {
  readonly result: BalanceResult | null;
  readonly loading: boolean;
  readonly error: CalculationError | null;
  readonly balance: (equation: string) => Promise<void>;
  readonly clear: () => void;
  readonly history: readonly BalanceResult[];
}

export interface UseThermodynamicsResult {
  readonly result: ThermodynamicsResult | null;
  readonly loading: boolean;
  readonly error: CalculationError | null;
  readonly calculate: (
    equation: string,
    temperature?: number,
    pressure?: number
  ) => Promise<void>;
  readonly clear: () => void;
  readonly conditions: {
    temperature: number;
    pressure: number;
  };
  readonly setConditions: (temperature: number, pressure: number) => void;
}

export interface UseCompoundSearchResult {
  readonly compounds: readonly CompoundData[];
  readonly loading: boolean;
  readonly error: Error | null;
  readonly search: (query: string, type?: 'name' | 'formula' | 'smiles') => Promise<void>;
  readonly clear: () => void;
  readonly selectedCompound: CompoundData | null;
  readonly selectCompound: (compound: CompoundData | null) => void;
}

export interface UseMolecularVisualizationResult {
  readonly structure: any | null; // Will be proper molecular structure type
  readonly loading: boolean;
  readonly error: Error | null;
  readonly generateStructure: (smiles: string) => Promise<void>;
  readonly renderOptions: {
    style: '2d' | '3d' | 'ball-stick' | 'space-fill';
    interactive: boolean;
    colorScheme: 'default' | 'cpk' | 'element';
  };
  readonly setRenderOptions: (options: Partial<UseMolecularVisualizationResult['renderOptions']>) => void;
}

// Main equation balancing hook
export function useEquationBalancer(): UseEquationBalancerResult {
  const [result, setResult] = useState<BalanceResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<CalculationError | null>(null);
  const [history, setHistory] = useState<BalanceResult[]>([]);
  
  const balancerRef = useRef<EquationBalancer>();
  
  // Initialize balancer
  useEffect(() => {
    balancerRef.current = new EquationBalancer();
  }, []);

  const balance = useCallback(async (equation: string) => {
    if (!balancerRef.current || !equation.trim()) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const balanceResult = await balancerRef.current.balance(equation);
      
      setResult(balanceResult);
      setHistory(prev => [balanceResult, ...prev.slice(0, 9)]); // Keep last 10
      
    } catch (err) {
      setError(err as CalculationError);
      setResult(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const clear = useCallback(() => {
    setResult(null);
    setError(null);
    setHistory([]);
  }, []);

  return {
    result,
    loading,
    error,
    balance,
    clear,
    history
  };
}

// Thermodynamics calculation hook
export function useThermodynamics(): UseThermodynamicsResult {
  const [result, setResult] = useState<ThermodynamicsResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<CalculationError | null>(null);
  const [conditions, setConditionsState] = useState({
    temperature: 298.15, // 25°C
    pressure: 101325    // 1 atm
  });

  const calculatorRef = useRef<ThermodynamicsCalculator>();

  useEffect(() => {
    calculatorRef.current = new ThermodynamicsCalculator();
  }, []);

  const calculate = useCallback(async (
    equation: string,
    temperature?: number,
    pressure?: number
  ) => {
    if (!calculatorRef.current || !equation.trim()) return;

    try {
      setLoading(true);
      setError(null);

      const temp = temperature ?? conditions.temperature;
      const press = pressure ?? conditions.pressure;

      const thermResult = await calculatorRef.current.calculate(equation, {
        temperature: temp,
        pressure: press
      });

      setResult(thermResult);

    } catch (err) {
      setError(err as CalculationError);
      setResult(null);
    } finally {
      setLoading(false);
    }
  }, [conditions]);

  const setConditions = useCallback((temperature: number, pressure: number) => {
    setConditionsState({ temperature, pressure });
  }, []);

  const clear = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return {
    result,
    loading,
    error,
    calculate,
    clear,
    conditions,
    setConditions
  };
}

// Compound search hook with PubChem integration
export function useCompoundSearch(): UseCompoundSearchResult {
  const [compounds, setCompounds] = useState<CompoundData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [selectedCompound, setSelectedCompound] = useState<CompoundData | null>(null);

  const search = useCallback(async (
    query: string,
    type: 'name' | 'formula' | 'smiles' = 'name'
  ) => {
    if (!query.trim()) return;

    try {
      setLoading(true);
      setError(null);

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

      setCompounds(results);

    } catch (err) {
      setError(err as Error);
      setCompounds([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const clear = useCallback(() => {
    setCompounds([]);
    setError(null);
    setSelectedCompound(null);
  }, []);

  const selectCompound = useCallback((compound: CompoundData | null) => {
    setSelectedCompound(compound);
  }, []);

  return {
    compounds,
    loading,
    error,
    search,
    clear,
    selectedCompound,
    selectCompound
  };
}

// Molecular visualization hook (for future 3D integration)
export function useMolecularVisualization(): UseMolecularVisualizationResult {
  const [structure, setStructure] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [renderOptions, setRenderOptionsState] = useState({
    style: '3d' as const,
    interactive: true,
    colorScheme: 'cpk' as const
  });

  const generateStructure = useCallback(async (smiles: string) => {
    if (!smiles.trim()) return;

    try {
      setLoading(true);
      setError(null);

      // This will integrate with the molecular visualization system
      // For now, it's a placeholder that will be completed in Phase 2
      const mockStructure = {
        smiles,
        atoms: [],
        bonds: [],
        coordinates: []
      };

      setStructure(mockStructure);

    } catch (err) {
      setError(err as Error);
      setStructure(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const setRenderOptions = useCallback((
    options: Partial<UseMolecularVisualizationResult['renderOptions']>
  ) => {
    setRenderOptionsState(prev => ({ ...prev, ...options }));
  }, []);

  return {
    structure,
    loading,
    error,
    generateStructure,
    renderOptions,
    setRenderOptions
  };
}

// Combined chemistry calculation hook
export function useChemistryCalculations() {
  const balancer = useEquationBalancer();
  const thermodynamics = useThermodynamics();
  const compoundSearch = useCompoundSearch();
  const molecular = useMolecularVisualization();

  const calculateComplete = useCallback(async (equation: string) => {
    // Perform equation balancing and thermodynamics calculation together
    await Promise.all([
      balancer.balance(equation),
      thermodynamics.calculate(equation)
    ]);
  }, [balancer.balance, thermodynamics.calculate]);

  const isLoading = useMemo(() => 
    balancer.loading || thermodynamics.loading || compoundSearch.loading || molecular.loading,
    [balancer.loading, thermodynamics.loading, compoundSearch.loading, molecular.loading]
  );

  const hasError = useMemo(() => 
    balancer.error || thermodynamics.error || compoundSearch.error || molecular.error,
    [balancer.error, thermodynamics.error, compoundSearch.error, molecular.error]
  );

  const clearAll = useCallback(() => {
    balancer.clear();
    thermodynamics.clear();
    compoundSearch.clear();
  }, [balancer.clear, thermodynamics.clear, compoundSearch.clear]);

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

// Debounced calculation hook for real-time input
export function useDebouncedChemistryCalculation(delay: number = 500) {
  const [debouncedValue, setDebouncedValue] = useState('');
  const chemistry = useChemistryCalculations();

  useEffect(() => {
    const handler = setTimeout(() => {
      if (debouncedValue.trim()) {
        chemistry.calculateComplete(debouncedValue);
      }
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [debouncedValue, delay, chemistry.calculateComplete]);

  const setEquation = useCallback((equation: string) => {
    setDebouncedValue(equation);
  }, []);

  return {
    ...chemistry,
    setEquation,
    currentEquation: debouncedValue
  };
}

// Local storage persistence hook
export function useChemistryHistory(maxItems: number = 50) {
  const [history, setHistory] = useState<Array<{
    equation: string;
    balance: BalanceResult;
    thermodynamics: ThermodynamicsResult;
    timestamp: number;
  }>>([]);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('creb-chemistry-history');
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (error) {
      console.warn('Failed to load chemistry history:', error);
    }
  }, []);

  // Save to localStorage when history changes
  useEffect(() => {
    try {
      localStorage.setItem('creb-chemistry-history', JSON.stringify(history));
    } catch (error) {
      console.warn('Failed to save chemistry history:', error);
    }
  }, [history]);

  const addToHistory = useCallback((
    equation: string,
    balance: BalanceResult,
    thermodynamics: ThermodynamicsResult
  ) => {
    const entry = {
      equation,
      balance,
      thermodynamics,
      timestamp: Date.now()
    };

    setHistory(prev => [entry, ...prev.slice(0, maxItems - 1)]);
  }, [maxItems]);

  const clearHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem('creb-chemistry-history');
  }, []);

  const removeFromHistory = useCallback((index: number) => {
    setHistory(prev => prev.filter((_, i) => i !== index));
  }, []);

  return {
    history,
    addToHistory,
    clearHistory,
    removeFromHistory
  };
}
