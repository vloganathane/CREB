import React, { useState } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Button, 
  Chip,
  Alert,
  CircularProgress
} from '@mui/material';
import { 
  Code as CodeIcon, 
  PlayArrow as RunIcon,
  CheckCircle as SuccessIcon 
} from '@mui/icons-material';
import { Sandpack } from '@codesandbox/sandpack-react';

interface CodeEditorFallbackProps {
  code: string;
  onConsoleOutput?: (output: string) => void;
  theme?: 'light' | 'dark';
}

const CodeEditorFallback: React.FC<CodeEditorFallbackProps> = ({ 
  code, 
  onConsoleOutput,
  theme = 'dark'
}) => {
  const [sandpackError, setSandpackError] = useState(false);
  const [localExecution, setLocalExecution] = useState<string[]>([]);
  const [executing, setExecuting] = useState(false);

  const createEnhancedCode = (userCode: string) => {
    return `// CREB-JS Mock Implementation
class ChemicalEquationBalancer {
  balance(equation) {
    const cleaned = equation.replace(/\\s+/g, ' ').trim();
    
    if (cleaned.includes('H2') && cleaned.includes('O2') && cleaned.includes('H2O')) {
      return {
        equation: '2H2 + O2 = 2H2O',
        coefficients: [2, 1, 2],
        isBalanced: true,
        reactants: ['H2', 'O2'],
        products: ['H2O']
      };
    }
    
    if (cleaned.includes('CH4') && cleaned.includes('O2')) {
      return {
        equation: 'CH4 + 2O2 = CO2 + 2H2O',
        coefficients: [1, 2, 1, 2],
        isBalanced: true,
        reactants: ['CH4', 'O2'],
        products: ['CO2', 'H2O']
      };
    }
    
    return {
      equation: cleaned,
      coefficients: [1],
      isBalanced: false,
      reactants: [],
      products: []
    };
  }
}

function calculateMolarWeight(formula) {
  const weights = {
    'H2O': 18.015, 'CO2': 44.009, 'CH4': 16.043,
    'O2': 31.998, 'H2': 2.016, 'C6H12O6': 180.156,
    'NaCl': 58.443, 'CaCO3': 100.087
  };
  return weights[formula] || 0;
}

window.ChemicalEquationBalancer = ChemicalEquationBalancer;
window.calculateMolarWeight = calculateMolarWeight;

${userCode}`;
  };

  const executeCodeLocally = () => {
    setExecuting(true);
    const outputs: string[] = [];
    
    // Mock console.log capture
    const originalLog = console.log;
    console.log = (...args) => {
      const output = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ');
      outputs.push(output);
      originalLog(...args);
    };

    try {
      // Execute the enhanced code
      eval(createEnhancedCode(code));
      setLocalExecution(outputs);
      if (onConsoleOutput) {
        onConsoleOutput(outputs.join('\\n'));
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      outputs.push('❌ Error: ' + errorMessage);
      setLocalExecution(outputs);
    } finally {
      console.log = originalLog;
      setExecuting(false);
    }
  };

  const handleSandpackError = () => {
    setSandpackError(true);
  };

  if (sandpackError) {
    return (
      <Paper elevation={0} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CodeIcon color="primary" />
            <Typography variant="h6">Code Editor (Fallback Mode)</Typography>
            <Chip label="Local Execution" size="small" color="secondary" />
          </Box>
        </Box>
        
        <Box sx={{ p: 2 }}>
          <Alert severity="info" sx={{ mb: 2 }}>
            Sandpack unavailable. Using local execution mode.
          </Alert>
          
          <Box sx={{ 
            bgcolor: 'background.paper', 
            border: 1, 
            borderColor: 'divider',
            borderRadius: 1,
            p: 2,
            fontFamily: 'monospace',
            fontSize: '0.9rem',
            minHeight: 200,
            mb: 2
          }}>
            <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{code}</pre>
          </Box>
          
          <Button
            variant="contained"
            startIcon={executing ? <CircularProgress size={16} /> : <RunIcon />}
            onClick={executeCodeLocally}
            disabled={executing}
            sx={{ mb: 2 }}
          >
            {executing ? 'Executing...' : 'Run Code'}
          </Button>
          
          {localExecution.length > 0 && (
            <Box sx={{
              bgcolor: 'grey.900',
              color: 'green',
              p: 2,
              borderRadius: 1,
              fontFamily: 'monospace',
              fontSize: '0.85rem',
              maxHeight: 300,
              overflow: 'auto'
            }}>
              <Typography variant="subtitle2" sx={{ color: 'white', mb: 1 }}>
                Console Output:
              </Typography>
              {localExecution.map((line, index) => (
                <div key={index}>{line}</div>
              ))}
            </Box>
          )}
        </Box>
      </Paper>
    );
  }

  return (
    <Paper elevation={0} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CodeIcon color="primary" />
          <Typography variant="h6">Code Editor</Typography>
          <Chip label="Sandpack" size="small" color="primary" variant="outlined" />
          <Box sx={{ flexGrow: 1 }} />
          <Button
            size="small"
            startIcon={<SuccessIcon />}
            onClick={handleSandpackError}
            color="secondary"
          >
            Switch to Fallback
          </Button>
        </Box>
      </Box>

      <Box sx={{ flex: 1, minHeight: 0 }}>
        <Sandpack
          template="vanilla"
          files={{
            '/index.js': createEnhancedCode(code),
          }}
          options={{
            showNavigator: false,
            showTabs: false,
            showLineNumbers: true,
            showInlineErrors: true,
            wrapContent: true,
            editorHeight: '100%',
            autorun: true,
          }}
          theme={theme}
        />
      </Box>
    </Paper>
  );
};

export default CodeEditorFallback;
