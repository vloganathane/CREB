import { useState } from 'react';
import { Search, Code, Play, Book } from 'lucide-react';
import type { APIMethod } from '../types';

const apiMethods: APIMethod[] = [
  {
    name: 'ChemicalEquationBalancer.balance',
    description: 'Balance a chemical equation and return coefficients',
    category: 'balancing',
    returnType: 'BalancedEquation',
    parameters: [
      {
        name: 'equation',
        type: 'string',
        required: true,
        description: 'Chemical equation to balance (e.g., "H2 + O2 = H2O")'
      }
    ],
    example: `const balancer = new ChemicalEquationBalancer();
const result = balancer.balance('H2 + O2 = H2O');
console.log(result);`
  },
  {
    name: 'EnhancedChemicalEquationBalancer.balanceWithCompoundInfo',
    description: 'Balance equation with detailed compound information from PubChem',
    category: 'balancing',
    returnType: 'EnhancedBalancedEquation',
    parameters: [
      {
        name: 'equation',
        type: 'string', 
        required: true,
        description: 'Chemical equation with compound formulas'
      }
    ],
    example: `const enhancedBalancer = new EnhancedChemicalEquationBalancer();
const result = await enhancedBalancer.balanceWithCompoundInfo('C6H12O6 + O2 = CO2 + H2O');
console.log(result);`
  },
  {
    name: 'MolecularVisualizationEngine.createVisualization',
    description: 'Create 2D or 3D molecular visualizations',
    category: 'visualization',
    returnType: 'VisualizationData',
    parameters: [
      {
        name: 'formula',
        type: 'string',
        required: true,
        description: 'Chemical formula to visualize'
      },
      {
        name: 'type',
        type: "'2d' | '3d'",
        required: false,
        defaultValue: '2d',
        description: 'Type of visualization to create'
      }
    ],
    example: `const engine = new MolecularVisualizationEngine();
const viz = engine.createVisualization('C6H6', '2d');
console.log(viz);`
  },
  {
    name: 'SVGRenderer.renderToSVG',
    description: 'Export molecular structures as SVG format',
    category: 'utilities',
    returnType: 'string',
    parameters: [
      {
        name: 'visualization',
        type: 'VisualizationData',
        required: true,
        description: 'Visualization data to export'
      }
    ],
    example: `const renderer = new SVGRenderer();
const svgData = renderer.renderToSVG(visualization);
console.log(svgData);`
  },
  {
    name: 'calculateMolarWeight',
    description: 'Calculate the molecular weight of a chemical compound',
    category: 'utilities',
    returnType: 'number',
    parameters: [
      {
        name: 'formula',
        type: 'string',
        required: true,
        description: 'Chemical formula (e.g., "H2O", "CaCO3")'
      }
    ],
    example: `const weight = calculateMolarWeight('H2O');
console.log('Water molecular weight:', weight, 'g/mol');`
  },
  {
    name: 'Stoichiometry.calculateStoichiometry',
    description: 'Perform stoichiometric calculations for chemical reactions',
    category: 'stoichiometry',
    returnType: 'StoichiometryResult',
    parameters: [
      {
        name: 'equation',
        type: 'string',
        required: true,
        description: 'Balanced chemical equation'
      },
      {
        name: 'reactantMoles',
        type: 'object',
        required: true,
        description: 'Object with reactant formulas as keys and mole amounts as values'
      }
    ],
    example: `const stoich = new Stoichiometry();
const result = stoich.calculateStoichiometry('N2 + 3H2 = 2NH3', { 'N2': 2, 'H2': 6 });
console.log(result);`
  }
];

interface APIExplorerProps {
  onInsertCode?: (code: string) => void;
}

export function APIExplorer({ onInsertCode }: APIExplorerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedMethod, setSelectedMethod] = useState<APIMethod | null>(null);

  const categories = ['All', ...new Set(apiMethods.map(method => method.category))];

  const filteredMethods = apiMethods.filter(method => {
    const matchesSearch = method.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         method.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || method.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const runExample = (method: APIMethod) => {
    if (onInsertCode && method.example) {
      onInsertCode(method.example);
    } else {
      console.log('Running example for:', method.name);
    }
  };

  return (
    <div className="api-explorer">
      <div className="explorer-header">
        <h1>API Explorer</h1>
        <p>Interactive documentation for CREB-JS methods</p>
        
        <div className="search-controls">
          <div className="search-bar">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search methods..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <select 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="category-filter"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="explorer-content">
        <div className="methods-list">
          <h2>Methods ({filteredMethods.length})</h2>
          {filteredMethods.map(method => (
            <div 
              key={method.name} 
              className={`method-item ${selectedMethod?.name === method.name ? 'selected' : ''}`}
              onClick={() => setSelectedMethod(method)}
            >
              <div className="method-header">
                <span className="method-name">{method.name}</span>
                <span className={`method-category ${method.category.toLowerCase()}`}>
                  {method.category}
                </span>
              </div>
              <p className="method-description">{method.description}</p>
            </div>
          ))}
        </div>

        <div className="method-details">
          {selectedMethod ? (
            <div className="details-content">
              <div className="details-header">
                <h2>{selectedMethod.name}</h2>
                <div className="header-actions">
                  <button 
                    className="action-button primary"
                    onClick={() => runExample(selectedMethod)}
                  >
                    <Play size={16} />
                    Try It
                  </button>
                  <button className="action-button secondary">
                    <Book size={16} />
                    Docs
                  </button>
                </div>
              </div>

              <p className="method-description">{selectedMethod.description}</p>

              <div className="method-signature">
                <h3>Signature</h3>
                <code className="signature">
                  {selectedMethod.name}({selectedMethod.parameters.map(param => 
                    `${param.name}${param.required ? '' : '?'}: ${param.type}`
                  ).join(', ')}): {selectedMethod.returnType}
                </code>
              </div>

              <div className="parameters">
                <h3>Parameters</h3>
                {selectedMethod.parameters.length > 0 ? (
                  <table className="params-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Required</th>
                        <th>Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedMethod.parameters.map(param => (
                        <tr key={param.name}>
                          <td><code>{param.name}</code></td>
                          <td><code>{param.type}</code></td>
                          <td>{param.required ? 'Yes' : 'No'}</td>
                          <td>{param.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p>No parameters</p>
                )}
              </div>

              <div className="example">
                <h3>Example</h3>
                <div className="example-code">
                  <div className="code-header">
                    <Code size={16} />
                    <span>JavaScript/TypeScript</span>
                  </div>
                  <pre><code>{selectedMethod.example}</code></pre>
                </div>
              </div>
            </div>
          ) : (
            <div className="no-selection">
              <div className="empty-state">
                <Search size={48} className="empty-icon" />
                <h3>Select a method</h3>
                <p>Choose a method from the list to view detailed documentation</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
