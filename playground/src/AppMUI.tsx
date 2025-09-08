import React, { useState } from 'react';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Container,
  Paper,
  Chip,
  Box,
} from '@mui/material';
import {
  Science as ScienceIcon,
  BugReport as BugIcon,
  Code as CodeIcon,
} from '@mui/icons-material';
import { Sandpack } from '@codesandbox/sandpack-react';
import ExamplesGallery from './components/ExamplesGalleryMUI';
import APIExplorer from './components/APIExplorerMUI';
import ResultsPanel from './components/ResultsPanelMUI';
import type { ExecutionResult } from './types';

// Dark theme for chemistry/science feel
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#2196f3', // Blue for chemistry
    },
    secondary: {
      main: '#ff9800', // Orange for reactions
    },
    background: {
      default: '#0a0a0a',
      paper: '#1e1e1e',
    },
    success: {
      main: '#4caf50',
    },
    error: {
      main: '#f44336',
    },
    warning: {
      main: '#ff9800',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});

// Initial code for the playground
const initialCode = `// Welcome to CREB-JS Playground! 🧪
// Powered by Material UI + Sandpack

const balancer = new ChemicalEquationBalancer();
const result = balancer.balance('H2 + O2 = H2O');

console.log('🎉 CREB-JS Playground with Material UI!');
console.log('Original equation: H2 + O2 = H2O');
console.log('Balanced equation:', result.equation);
console.log('Coefficients:', result.coefficients);

// Try more examples from the sidebar!
return result;`;

// CREB-JS files for Sandpack
const crebFiles = {
  '/creb-mock.js': `// Mock CREB-JS implementation for Sandpack
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

// Export for use in main code
window.ChemicalEquationBalancer = ChemicalEquationBalancer;
window.calculateMolarWeight = calculateMolarWeight;`,
};

function App() {
  const [activeTab, setActiveTab] = useState<'examples' | 'api'>('examples');
  const [code, setCode] = useState(initialCode);
  const [executionResult] = useState<ExecutionResult | null>(null);

  const handleLoadExample = (exampleCode: string) => {
    setCode(exampleCode);
  };

  const handleInsertCode = (codeSnippet: string) => {
    setCode(prev => prev + '\n\n' + codeSnippet);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1, minHeight: '100vh' }}>
        {/* App Bar */}
        <AppBar position="static" elevation={0}>
          <Toolbar>
            <ScienceIcon sx={{ mr: 2 }} />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              CREB-JS Playground
            </Typography>
            <Typography variant="body2" sx={{ mr: 2, opacity: 0.8 }}>
              Interactive Chemical Computation Platform
            </Typography>
            <Chip
              icon={<BugIcon />}
              label="Material UI + Sandpack"
              color="secondary"
              variant="outlined"
              size="small"
            />
          </Toolbar>
        </AppBar>

        <Container maxWidth={false} sx={{ mt: 2, mb: 2 }}>
          <Box sx={{ display: 'flex', gap: 2, height: 'calc(100vh - 120px)' }}>
            {/* Code Editor with Sandpack */}
            <Box sx={{ flex: 2, display: 'flex', flexDirection: 'column' }}>
              <Paper elevation={3} sx={{ height: '100%', overflow: 'hidden' }}>
                <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CodeIcon color="primary" />
                    <Typography variant="h6">Code Editor</Typography>
                    <Chip label="Sandpack" size="small" color="primary" variant="outlined" />
                  </Box>
                </Box>
                <Box sx={{ height: 'calc(100% - 80px)' }}>
                  <Sandpack
                    template="vanilla"
                    files={{
                      '/index.js': code,
                      ...crebFiles,
                    }}
                    customSetup={{
                      entry: '/index.js',
                    }}
                    options={{
                      showNavigator: false,
                      showTabs: false,
                      showLineNumbers: true,
                      showInlineErrors: true,
                      wrapContent: true,
                      editorHeight: '100%',
                    }}
                    theme="dark"
                  />
                </Box>
              </Paper>
            </Box>

            {/* Results Panel */}
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <ResultsPanel executionResult={executionResult} />
            </Box>

            {/* Sidebar */}
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <Paper elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                {/* Tab Headers */}
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Box sx={{ display: 'flex' }}>
                    <Box
                      component="button"
                      onClick={() => setActiveTab('examples')}
                      sx={{
                        flex: 1,
                        p: 2,
                        border: 'none',
                        backgroundColor: activeTab === 'examples' ? 'primary.main' : 'transparent',
                        color: activeTab === 'examples' ? 'primary.contrastText' : 'text.primary',
                        cursor: 'pointer',
                        borderBottom: activeTab === 'examples' ? 2 : 0,
                        borderBottomColor: 'primary.main',
                        '&:hover': {
                          backgroundColor: activeTab === 'examples' ? 'primary.dark' : 'action.hover',
                        },
                      }}
                    >
                      <Typography variant="button">Examples</Typography>
                    </Box>
                    <Box
                      component="button"
                      onClick={() => setActiveTab('api')}
                      sx={{
                        flex: 1,
                        p: 2,
                        border: 'none',
                        backgroundColor: activeTab === 'api' ? 'primary.main' : 'transparent',
                        color: activeTab === 'api' ? 'primary.contrastText' : 'text.primary',
                        cursor: 'pointer',
                        borderBottom: activeTab === 'api' ? 2 : 0,
                        borderBottomColor: 'primary.main',
                        '&:hover': {
                          backgroundColor: activeTab === 'api' ? 'primary.dark' : 'action.hover',
                        },
                      }}
                    >
                      <Typography variant="button">API Explorer</Typography>
                    </Box>
                  </Box>
                </Box>

                {/* Tab Content */}
                <Box sx={{ flex: 1, overflow: 'hidden' }}>
                  {activeTab === 'examples' && (
                    <ExamplesGallery onLoadExample={handleLoadExample} />
                  )}
                  {activeTab === 'api' && (
                    <APIExplorer onInsertCode={handleInsertCode} />
                  )}
                </Box>
              </Paper>
            </Box>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
