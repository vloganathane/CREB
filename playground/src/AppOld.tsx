import { useState } from 'react';
import { Play, Code, FlaskConical } from 'lucide-react';
import { CodeEditor } from './components/CodeEditor';
import ResultsPanel from './components/ResultsPanel';
import { ChemicalVisualizer } from './components/ChemicalVisualizer';
import ExamplesGallery from './components/ExamplesGallery';
import { APIExplorer } from './components/APIExplorer';
import type { ExecutionResult } from './types';
import './App.css';

function App() {
  const [code, setCode] = useState(`// Welcome to CREB-JS Playground! 🧪
// Currently running with mock implementation for browser compatibility

const balancer = new ChemicalEquationBalancer();
const result = balancer.balance('H2 + O2 = H2O');

console.log('🎉 CREB-JS Playground is working!');
console.log('Original equation: H2 + O2 = H2O');
console.log('Balanced equation:', result.equation);
console.log('Coefficients:', result.coefficients);

// Try the examples in the sidebar for more features!
return result;`);
  
  const [isExecuting, setIsExecuting] = useState(false);
  const [activeTab, setActiveTab] = useState<'examples' | 'api'>('examples');
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);

  const handleRunCode = () => {
    setIsExecuting(true);
  };

  const handleExecutionComplete = (result: ExecutionResult) => {
    setExecutionResult(result);
    setIsExecuting(false);
  };

  const handleLoadExample = (exampleCode: string) => {
    setCode(exampleCode);
  };

  const handleInsertCode = (codeSnippet: string) => {
    setCode(code + '\n\n' + codeSnippet);
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-left">
          <FlaskConical size={24} className="text-blue-400" />
          <h1 className="app-title">CREB-JS Playground</h1>
          <span className="app-subtitle">Interactive Chemical Computation Platform</span>
        </div>
        <div className="header-right">
          <div className="status-badge">
            <span className="status-indicator">🧪</span>
            <span>Mock Mode</span>
          </div>
          <button
            onClick={handleRunCode}
            disabled={isExecuting}
            className="run-button"
          >
            <Play size={16} />
            {isExecuting ? 'Running...' : 'Run Code'}
          </button>
        </div>
      </header>

      <main className="app-main">
        <div className="editor-section">
          <div className="section-header">
            <Code size={20} className="text-blue-400" />
            <h2>Code Editor</h2>
          </div>
          <CodeEditor
            value={code}
            onChange={setCode}
            height="calc(100% - 60px)"
          />
        </div>

        <div className="results-section">
          <ResultsPanel
            code={code}
            isExecuting={isExecuting}
            onExecutionComplete={handleExecutionComplete}
          />
        </div>

        <div className="sidebar">
          <div className="tab-container">
            <div className="tab-buttons">
              <button
                onClick={() => setActiveTab('examples')}
                className={`tab-button ${activeTab === 'examples' ? 'active' : ''}`}
              >
                Examples
              </button>
              <button
                onClick={() => setActiveTab('api')}
                className={`tab-button ${activeTab === 'api' ? 'active' : ''}`}
              >
                API Explorer
              </button>
            </div>
            
            <div className="tab-content">
              {activeTab === 'examples' && (
                <ExamplesGallery onLoadExample={handleLoadExample} />
              )}
              {activeTab === 'api' && (
                <APIExplorer onInsertCode={handleInsertCode} />
              )}
            </div>
          </div>
        </div>

        {executionResult?.visualData && (
          <div className="visualizer-section">
            <ChemicalVisualizer results={executionResult} />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
