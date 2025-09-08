import React, { useEffect, useState } from 'react';
import { Terminal, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import type { ExecutionResult } from '../types';
import { crebExecutor } from '../CREBExecutorMock';

interface ResultsPanelProps {
  code: string;
  isExecuting: boolean;
  onExecutionComplete: (result: ExecutionResult) => void;
}

const ResultsPanel: React.FC<ResultsPanelProps> = ({ 
  code, 
  isExecuting, 
  onExecutionComplete 
}) => {
  const [result, setResult] = useState<ExecutionResult | null>(null);

  useEffect(() => {
    const executeCode = async () => {
      try {
        const executionResult = await crebExecutor.executeCode(code);
        setResult(executionResult);
        onExecutionComplete(executionResult);
      } catch (error) {
        const errorResult: ExecutionResult = {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error occurred',
        };
        setResult(errorResult);
        onExecutionComplete(errorResult);
      }
    };

    if (isExecuting && code.trim()) {
      executeCode();
    }
  }, [isExecuting, code, onExecutionComplete]);

  const formatResult = (data: unknown): string => {
    if (data === null || data === undefined) return 'null';
    if (typeof data === 'string') return data;
    if (typeof data === 'number' || typeof data === 'boolean') return String(data);
    
    try {
      return JSON.stringify(data, null, 2);
    } catch {
      return String(data);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="border-b border-gray-700 p-4">
        <div className="flex items-center gap-2">
          <Terminal size={20} className="text-green-400" />
          <h2 className="text-lg font-semibold text-white">Results</h2>
          {isExecuting && <Loader size={16} className="animate-spin text-blue-400" />}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {!result && !isExecuting && (
          <div className="text-center text-gray-400 py-8">
            <Terminal size={48} className="mx-auto mb-4 opacity-50" />
            <p>Run some code to see results here</p>
          </div>
        )}

        {isExecuting && (
          <div className="flex items-center gap-2 text-blue-400">
            <Loader size={16} className="animate-spin" />
            <span>Executing code...</span>
          </div>
        )}

        {result && (
          <div className="space-y-4">
            {/* Execution Status */}
            <div className={`flex items-center gap-2 p-3 rounded-lg ${
              result.success 
                ? 'bg-green-500/10 border border-green-500/20' 
                : 'bg-red-500/10 border border-red-500/20'
            }`}>
              {result.success ? (
                <CheckCircle size={16} className="text-green-400" />
              ) : (
                <AlertCircle size={16} className="text-red-400" />
              )}
              <span className={result.success ? 'text-green-400' : 'text-red-400'}>
                {result.success ? 'Execution successful' : 'Execution failed'}
              </span>
            </div>

            {/* Console Output */}
            {result.output && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-gray-300">Console Output:</h3>
                <div className="bg-gray-900 rounded-lg p-3 font-mono text-sm">
                  <pre className="text-gray-300 whitespace-pre-wrap">{result.output}</pre>
                </div>
              </div>
            )}

            {/* Execution Result */}
            {result.result !== undefined && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-gray-300">Return Value:</h3>
                <div className="bg-gray-900 rounded-lg p-3 font-mono text-sm">
                  <pre className="text-blue-300 whitespace-pre-wrap">
                    {formatResult(result.result)}
                  </pre>
                </div>
              </div>
            )}

            {/* Error Details */}
            {result.error && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-red-400">Error:</h3>
                <div className="bg-red-900/20 border border-red-500/20 rounded-lg p-3 font-mono text-sm">
                  <pre className="text-red-300 whitespace-pre-wrap">{result.error}</pre>
                </div>
              </div>
            )}

            {/* Visualization Data */}
            {result.visualData && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-purple-400">Visualization Data:</h3>
                <div className="bg-purple-900/20 border border-purple-500/20 rounded-lg p-3">
                  <div className="text-purple-300 text-sm mb-2">
                    Type: {result.visualData.type}
                  </div>
                  {result.visualData.equations && (
                    <div className="space-y-1">
                      <div className="text-purple-300 text-sm">Equations:</div>
                      {result.visualData.equations.map((eq, idx) => (
                        <div key={idx} className="font-mono text-purple-200 bg-purple-900/30 p-2 rounded">
                          {eq}
                        </div>
                      ))}
                    </div>
                  )}
                  {result.visualData.molecules && (
                    <div className="space-y-1">
                      <div className="text-purple-300 text-sm">Molecules:</div>
                      {result.visualData.molecules.map((mol, idx) => (
                        <div key={idx} className="font-mono text-purple-200 bg-purple-900/30 p-2 rounded">
                          <div>Formula: {mol.formula}</div>
                          {mol.name && <div>Name: {mol.name}</div>}
                          {mol.structure && <div>Structure: {mol.structure}</div>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultsPanel;
