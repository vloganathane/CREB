import React, { useEffect, useRef } from 'react';
import { Box, Paper, Typography, Chip, IconButton, Tooltip } from '@mui/material';
import { Code as CodeIcon, PlayArrow as RunIcon, Clear as ClearIcon } from '@mui/icons-material';
import { Sandpack, SandpackConsole } from '@codesandbox/sandpack-react';

interface CodeEditorProps {
  code: string;
  onCodeChange?: (code: string) => void;
  onConsoleOutput?: (output: string) => void;
  isLoading?: boolean;
  theme?: 'light' | 'dark';
}

const CodeEditorMUI: React.FC<CodeEditorProps> = ({ 
  code, 
  onCodeChange, 
  onConsoleOutput,
  isLoading = false,
  theme = 'dark'
}) => {
  const sandpackRef = useRef<any>(null);

  const createEnhancedCode = (userCode: string) => {
    return `// CREB-JS Mock Implementation
class ChemicalEquationBalancer {
  balance(equation) {
    const cleaned = equation.replace(/\\s+/g, ' ').trim();
    
    // Basic H2 + O2 = H2O example
    if (cleaned.includes('H2') && cleaned.includes('O2') && cleaned.includes('H2O')) {
      return {
        equation: '2H2 + O2 = 2H2O',
        coefficients: [2, 1, 2],
        isBalanced: true,
        reactants: ['H2', 'O2'],
        products: ['H2O']
      };
    }
    
    // Basic combustion example
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
    'H2O': 18.015,
    'CO2': 44.009,
    'CH4': 16.043,
    'O2': 31.998,
    'H2': 2.016,
    'C6H12O6': 180.156,
    'NaCl': 58.443,
    'CaCO3': 100.087
  };
  
  return weights[formula] || 0;
}

// Make available globally
window.ChemicalEquationBalancer = ChemicalEquationBalancer;
window.calculateMolarWeight = calculateMolarWeight;

// User code starts here
${userCode}`;
  };

  const handleRunCode = () => {
    if (onConsoleOutput) {
      onConsoleOutput('🚀 Code execution started...');
    }
  };
  return (
    <Paper elevation={0} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CodeIcon color="primary" />
          <Typography variant="h6">Code Editor</Typography>
          <Chip 
            label="Sandpack" 
            size="small" 
            color="primary" 
            variant="outlined" 
          />
          {isLoading && (
            <Chip 
              label="Running..." 
              size="small" 
              color="warning" 
              variant="filled" 
            />
          )}
          <Box sx={{ flexGrow: 1 }} />
          <Tooltip title="Run Code">
            <IconButton 
              color="primary" 
              onClick={handleRunCode}
              size="small"
            >
              <RunIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Sandpack Editor */}
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
            recompileMode: 'immediate',
            recompileDelay: 200,
            bundlerURL: undefined, // Use default bundler
          }}
          theme={theme}
        />
      </Box>
    </Paper>
  );
};

export default CodeEditorMUI;
