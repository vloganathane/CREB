/**
 * Node.js Integration Examples for CREB-JS
 * Server-side chemistry calculations and API endpoints
 */

// Example Express.js API endpoints using CREB-JS
const express = require('express');
const { EquationBalancer } = require('../src/balancer');
const { ThermodynamicsCalculator } = require('../src/thermodynamics');
const { StoichiometryCalculator } = require('../src/stoichiometry');
const { cacheManager } = require('../src/wasm/cache');

const app = express();
app.use(express.json());

// Equation balancing endpoint
app.post('/api/balance', async (req, res) => {
  try {
    const { equation } = req.body;
    
    if (!equation) {
      return res.status(400).json({ error: 'Equation is required' });
    }

    const balancer = new EquationBalancer();
    const result = await cacheManager.equations.balanceEquation(
      equation,
      () => balancer.balance(equation)
    );

    res.json({
      success: true,
      data: result,
      cached: cacheManager.equations.has(equation)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Thermodynamics calculation endpoint
app.post('/api/thermodynamics', async (req, res) => {
  try {
    const { deltaH, deltaS, temperature } = req.body;
    
    if (deltaH === undefined || deltaS === undefined || temperature === undefined) {
      return res.status(400).json({ 
        error: 'deltaH, deltaS, and temperature are required' 
      });
    }

    const calculator = new ThermodynamicsCalculator();
    const result = await cacheManager.thermodynamics.calculateGibbs(
      deltaH,
      deltaS,
      temperature,
      () => calculator.calculateGibbsFreeEnergy(deltaH, deltaS, temperature)
    );

    res.json({
      success: true,
      data: {
        deltaG: result,
        spontaneous: result < 0,
        temperature,
        deltaH,
        deltaS
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Molecular weight calculation endpoint
app.post('/api/molecular-weight', async (req, res) => {
  try {
    const { formula } = req.body;
    
    if (!formula) {
      return res.status(400).json({ error: 'Formula is required' });
    }

    const weight = await cacheManager.molecularWeights.calculateWeight(
      formula,
      () => calculateMolecularWeightFromFormula(formula)
    );

    res.json({
      success: true,
      data: {
        formula,
        molecularWeight: weight,
        unit: 'g/mol'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Stoichiometry calculation endpoint
app.post('/api/stoichiometry', async (req, res) => {
  try {
    const { equation, targetCompound, targetAmount, targetUnit } = req.body;
    
    if (!equation || !targetCompound || targetAmount === undefined) {
      return res.status(400).json({ 
        error: 'equation, targetCompound, and targetAmount are required' 
      });
    }

    const calculator = new StoichiometryCalculator();
    const result = calculator.calculate(equation, targetCompound, targetAmount, targetUnit);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Cache metrics endpoint
app.get('/api/metrics', (req, res) => {
  const metrics = cacheManager.getAggregatedMetrics();
  res.json({
    success: true,
    data: metrics
  });
});

// Batch processing endpoint
app.post('/api/batch', async (req, res) => {
  try {
    const { operations } = req.body;
    
    if (!Array.isArray(operations)) {
      return res.status(400).json({ error: 'operations must be an array' });
    }

    const results = [];
    
    for (const operation of operations) {
      try {
        let result;
        
        switch (operation.type) {
          case 'balance':
            const balancer = new EquationBalancer();
            result = await balancer.balance(operation.equation);
            break;
            
          case 'thermodynamics':
            const thermoCalc = new ThermodynamicsCalculator();
            result = thermoCalc.calculateGibbsFreeEnergy(
              operation.deltaH,
              operation.deltaS,
              operation.temperature
            );
            break;
            
          case 'stoichiometry':
            const stoichCalc = new StoichiometryCalculator();
            result = stoichCalc.calculate(
              operation.equation,
              operation.targetCompound,
              operation.targetAmount,
              operation.targetUnit
            );
            break;
            
          default:
            throw new Error(`Unknown operation type: ${operation.type}`);
        }
        
        results.push({
          id: operation.id,
          success: true,
          data: result
        });
      } catch (error) {
        results.push({
          id: operation.id,
          success: false,
          error: error.message
        });
      }
    }

    res.json({
      success: true,
      data: results
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Helper function for molecular weight calculation
function calculateMolecularWeightFromFormula(formula) {
  const atomicWeights = {
    'H': 1.008, 'He': 4.003, 'Li': 6.94, 'Be': 9.012, 'B': 10.81,
    'C': 12.011, 'N': 14.007, 'O': 15.999, 'F': 18.998, 'Ne': 20.180,
    'Na': 22.990, 'Mg': 24.305, 'Al': 26.982, 'Si': 28.085, 'P': 30.974,
    'S': 32.06, 'Cl': 35.45, 'Ar': 39.948, 'K': 39.098, 'Ca': 40.078,
    'Fe': 55.845, 'Cu': 63.546, 'Zn': 65.38, 'Br': 79.904, 'I': 126.904
  };

  let weight = 0;
  const regex = /([A-Z][a-z]?)(\d*)/g;
  let match;

  while ((match = regex.exec(formula)) !== null) {
    const element = match[1];
    const count = parseInt(match[2] || '1');
    
    if (atomicWeights[element]) {
      weight += atomicWeights[element] * count;
    } else {
      throw new Error(`Unknown element: ${element}`);
    }
  }

  return weight;
}

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('API Error:', error);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`CREB-JS API server running on port ${PORT}`);
  console.log('Available endpoints:');
  console.log('  POST /api/balance - Balance chemical equations');
  console.log('  POST /api/thermodynamics - Calculate thermodynamic properties');
  console.log('  POST /api/molecular-weight - Calculate molecular weights');
  console.log('  POST /api/stoichiometry - Perform stoichiometric calculations');
  console.log('  POST /api/batch - Process multiple operations');
  console.log('  GET  /api/metrics - Get cache metrics');
});

module.exports = app;
