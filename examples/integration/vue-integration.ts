/**
 * Integration tests and examples for Vue composables package
 */

import { ref, computed } from 'vue';
import { useEquationBalancer, useThermodynamics, useMolecularWeight } from '../packages/vue';

// Example Vue composition using CREB composables
export function useChemistryCalculations() {
  const equation = ref('H2 + O2 -> H2O');
  const formula = ref('H2O');
  
  const { balance, result: balanceResult, loading: balanceLoading } = useEquationBalancer();
  const { calculate, result: thermoResult } = useThermodynamics();
  const { calculateWeight, weight } = useMolecularWeight();

  const balanceEquation = async () => {
    await balance(equation.value);
  };

  const calculateThermodynamics = async () => {
    await calculate({
      deltaH: -285.8,
      deltaS: -163.2,
      temperature: 298.15
    });
  };

  const calculateMolecularWeight = async () => {
    await calculateWeight(formula.value);
  };

  const isCalculating = computed(() => balanceLoading.value);

  return {
    equation,
    formula,
    balanceResult,
    thermoResult,
    weight,
    isCalculating,
    balanceEquation,
    calculateThermodynamics,
    calculateMolecularWeight
  };
}

// Vue component example (composition API)
export const ChemistryCalculatorComposition = {
  setup() {
    const {
      equation,
      formula,
      balanceResult,
      thermoResult,
      weight,
      isCalculating,
      balanceEquation,
      calculateThermodynamics,
      calculateMolecularWeight
    } = useChemistryCalculations();

    return {
      equation,
      formula,
      balanceResult,
      thermoResult,
      weight,
      isCalculating,
      balanceEquation,
      calculateThermodynamics,
      calculateMolecularWeight
    };
  },
  template: `
    <div class="chemistry-calculator">
      <h2>Chemistry Calculator</h2>
      
      <section>
        <h3>Equation Balancer</h3>
        <input v-model="equation" placeholder="Enter chemical equation" />
        <button @click="balanceEquation" :disabled="isCalculating">
          Balance Equation
        </button>
        <div v-if="balanceResult">
          <p>Balanced: {{ balanceResult.balanced }}</p>
          <p>Coefficients: {{ balanceResult.coefficients.join(', ') }}</p>
        </div>
      </section>

      <section>
        <h3>Thermodynamics</h3>
        <button @click="calculateThermodynamics">
          Calculate Gibbs Free Energy
        </button>
        <div v-if="thermoResult">
          <p>ΔG: {{ thermoResult.deltaG }} kJ/mol</p>
          <p>Spontaneous: {{ thermoResult.spontaneous ? 'Yes' : 'No' }}</p>
        </div>
      </section>

      <section>
        <h3>Molecular Weight</h3>
        <input v-model="formula" placeholder="Enter molecular formula" />
        <button @click="calculateMolecularWeight">
          Calculate Weight
        </button>
        <p v-if="weight">Molecular Weight: {{ weight }} g/mol</p>
      </section>
    </div>
  `
};

// Vue component example (options API)
export const ChemistryCalculatorOptions = {
  data() {
    return {
      equation: 'H2 + O2 -> H2O',
      formula: 'H2O',
      balanceResult: null,
      thermoResult: null,
      weight: null,
      loading: false
    };
  },
  methods: {
    async balanceEquation() {
      this.loading = true;
      try {
        const { balance } = useEquationBalancer();
        this.balanceResult = await balance(this.equation);
      } finally {
        this.loading = false;
      }
    },
    async calculateThermodynamics() {
      const { calculate } = useThermodynamics();
      this.thermoResult = await calculate({
        deltaH: -285.8,
        deltaS: -163.2,
        temperature: 298.15
      });
    },
    async calculateMolecularWeight() {
      const { calculateWeight } = useMolecularWeight();
      this.weight = await calculateWeight(this.formula);
    }
  },
  template: `
    <div class="chemistry-calculator">
      <h2>Chemistry Calculator (Options API)</h2>
      
      <section>
        <h3>Equation Balancer</h3>
        <input v-model="equation" placeholder="Enter chemical equation" />
        <button @click="balanceEquation" :disabled="loading">
          Balance Equation
        </button>
        <div v-if="balanceResult">
          <p>Balanced: {{ balanceResult.balanced }}</p>
          <p>Coefficients: {{ balanceResult.coefficients.join(', ') }}</p>
        </div>
      </section>

      <section>
        <h3>Thermodynamics</h3>
        <button @click="calculateThermodynamics">
          Calculate Gibbs Free Energy
        </button>
        <div v-if="thermoResult">
          <p>ΔG: {{ thermoResult.deltaG }} kJ/mol</p>
          <p>Spontaneous: {{ thermoResult.spontaneous ? 'Yes' : 'No' }}</p>
        </div>
      </section>

      <section>
        <h3>Molecular Weight</h3>
        <input v-model="formula" placeholder="Enter molecular formula" />
        <button @click="calculateMolecularWeight">
          Calculate Weight
        </button>
        <p v-if="weight">Molecular Weight: {{ weight }} g/mol</p>
      </section>
    </div>
  `
};

export default {
  ChemistryCalculatorComposition,
  ChemistryCalculatorOptions,
  useChemistryCalculations
};
