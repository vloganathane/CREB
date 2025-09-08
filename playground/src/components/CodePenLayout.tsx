import React, { useState, useCallback } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  Chip,
  Button,
  useTheme,
  useMediaQuery,
  alpha,
} from '@mui/material';
import {
  PlayArrow as RunIcon,
  Code as CodeIcon,
  Timeline as ResultsIcon,
  Fullscreen as FullscreenIcon,
  FullscreenExit as FullscreenExitIcon,
  Settings as SettingsIcon,
  ViewStream as SplitIcon,
  ViewAgenda as StackIcon,
  Build as FallbackIcon,
  Science as MoleculeIcon,
} from '@mui/icons-material';
import { Sandpack } from '@codesandbox/sandpack-react';
import MolecularViewer from './MolecularViewer';

interface CodePenLayoutProps {
  code: string;
  onExecute?: () => void;
  onConsoleOutput?: (output: string) => void;
  theme?: 'light' | 'dark';
  title?: string;
}

const CodePenLayout: React.FC<CodePenLayoutProps> = ({
  code,
  onExecute,
  onConsoleOutput,
  theme = 'dark',
  title = 'Chemical Equation Playground'
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activePanel, setActivePanel] = useState<'code' | 'result' | 'molecule'>('code');
  const [splitView, setSplitView] = useState(false);
  const [useFallback, setUseFallback] = useState(false);
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
  const [sandpackKey, setSandpackKey] = useState(0);
  const muiTheme = useTheme();
  const isMobile = useMediaQuery('(max-width:900px)');

  const createEnhancedCode = useCallback((userCode: string) => {
    return `// CREB-JS Chemical Equation Balancer
class ChemicalEquationBalancer {
  balance(equation) {
    const cleaned = equation.replace(/\\s+/g, ' ').trim();
    
    if (cleaned.includes('H2') && cleaned.includes('O2') && cleaned.includes('H2O')) {
      return {
        equation: '2H2 + O2 = 2H2O',
        coefficients: [2, 1, 2],
        isBalanced: true,
        reactants: ['H2', 'O2'],
        products: ['H2O'],
        type: 'synthesis'
      };
    }
    
    if (cleaned.includes('CH4') && cleaned.includes('O2')) {
      return {
        equation: 'CH4 + 2O2 = CO2 + 2H2O',
        coefficients: [1, 2, 1, 2],
        isBalanced: true,
        reactants: ['CH4', 'O2'],
        products: ['CO2', 'H2O'],
        type: 'combustion'
      };
    }
    
    if (cleaned.includes('C6H12O6') && cleaned.includes('O2')) {
      return {
        equation: 'C6H12O6 + 6O2 = 6CO2 + 6H2O',
        coefficients: [1, 6, 6, 6],
        isBalanced: true,
        reactants: ['C6H12O6', 'O2'],
        products: ['CO2', 'H2O'],
        type: 'cellular respiration'
      };
    }
    
    return {
      equation: cleaned,
      coefficients: [1],
      isBalanced: false,
      reactants: [],
      products: [],
      type: 'unknown'
    };
  }
}

function calculateMolarWeight(formula) {
  const weights = {
    'H2O': 18.015, 'CO2': 44.009, 'CH4': 16.043,
    'O2': 31.998, 'H2': 2.016, 'C6H12O6': 180.156,
    'NaCl': 58.443, 'CaCO3': 100.087, 'NH3': 17.031,
    'HCl': 36.458, 'NaOH': 39.997, 'H2SO4': 98.079
  };
  return weights[formula] || 0;
}

function analyzeReaction(equation) {
  const balancer = new ChemicalEquationBalancer();
  const result = balancer.balance(equation);
  
  console.log('🧪 Reaction Analysis:');
  console.log('Equation:', result.equation);
  console.log('Type:', result.type);
  console.log('Balanced:', result.isBalanced ? '✅' : '❌');
  
  if (result.isBalanced) {
    console.log('Coefficients:', result.coefficients);
    console.log('Reactants:', result.reactants);
    console.log('Products:', result.products);
  }
  
  return result;
}

// Make functions globally available
window.ChemicalEquationBalancer = ChemicalEquationBalancer;
window.calculateMolarWeight = calculateMolarWeight;
window.analyzeReaction = analyzeReaction;

${userCode}`;
  }, []);

  // Simple fallback code editor component
  const FallbackCodeEditor = () => (
    <Box sx={{ 
      flex: 1, 
      display: 'flex', 
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      <textarea
        value={code}
        readOnly
        style={{
          flex: 1,
          width: '100%',
          padding: '16px',
          fontFamily: 'Monaco, Consolas, "Courier New", monospace',
          fontSize: '14px',
          lineHeight: '1.5',
          background: theme === 'dark' ? '#1e1e1e' : '#ffffff',
          color: theme === 'dark' ? '#d4d4d4' : '#383a42',
          border: 'none',
          outline: 'none',
          resize: 'none',
          overflow: 'auto'
        }}
      />
    </Box>
  );

  const toggleSplitView = () => {
    setSplitView(!splitView);
  };

  const toggleFallback = () => {
    setUseFallback(!useFallback);
  };

  const executeCodeInFallback = () => {
    setConsoleOutput([]);
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
      setConsoleOutput(outputs);
      if (onConsoleOutput) {
        onConsoleOutput(outputs.join('\n'));
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      outputs.push('❌ Error: ' + errorMessage);
      setConsoleOutput(outputs);
    } finally {
      console.log = originalLog;
    }
  };

  const handleRun = () => {
    if (useFallback) {
      executeCodeInFallback();
      setActivePanel('result'); // Switch to console to see results
    } else {
      // Force Sandpack to re-run by updating the key
      setSandpackKey(prev => prev + 1);
      setActivePanel('result'); // Switch to console to see results
    }
    
    if (onExecute) onExecute();
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const headerStyle = {
    background: `linear-gradient(135deg, ${alpha(muiTheme.palette.primary.main, 0.1)}, ${alpha(muiTheme.palette.secondary.main, 0.1)})`,
    borderBottom: `1px solid ${muiTheme.palette.divider}`,
    backdropFilter: 'blur(10px)',
  };

  return (
    <Box
      sx={{
        height: isFullscreen ? '100vh' : '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: isFullscreen ? 'fixed' : 'relative',
        top: isFullscreen ? 0 : 'auto',
        left: isFullscreen ? 0 : 'auto',
        zIndex: isFullscreen ? 9999 : 'auto',
        bgcolor: 'background.default',
      }}
    >
      {/* CodePen-style Header */}
      <Box sx={{ ...headerStyle, p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CodeIcon color="primary" />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {title}
              </Typography>
            </Box>
            <Chip
              label="CREB-JS"
              size="small"
              color="primary"
              variant="outlined"
              sx={{ fontWeight: 500 }}
            />
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tooltip title="Run Code">
              <Button
                variant="contained"
                size="small"
                startIcon={<RunIcon />}
                onClick={handleRun}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                }}
              >
                Run
              </Button>
            </Tooltip>
            
            {!isMobile && (
              <Tooltip title={splitView ? 'Stack View' : 'Split View'}>
                <IconButton size="small" onClick={toggleSplitView}>
                  {splitView ? <StackIcon /> : <SplitIcon />}
                </IconButton>
              </Tooltip>
            )}
            
            <Tooltip title={useFallback ? 'Use Sandpack' : 'Use Fallback Editor'}>
              <IconButton 
                size="small" 
                onClick={toggleFallback}
                color={useFallback ? 'primary' : 'default'}
              >
                <FallbackIcon />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Settings">
              <IconButton size="small">
                <SettingsIcon />
              </IconButton>
            </Tooltip>
            
            <Tooltip title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}>
              <IconButton size="small" onClick={toggleFullscreen}>
                {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Box>

      {/* CodePen-style Panel Navigation - Hidden in split view */}
      {(!splitView || isMobile) && (
        <Box sx={{ 
          display: 'flex', 
          borderBottom: 1, 
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}>
          <Box
            onClick={() => setActivePanel('code')}
            sx={{
              flex: 1,
              p: 2,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1,
              bgcolor: activePanel === 'code' ? 'action.selected' : 'transparent',
              borderBottom: activePanel === 'code' ? 2 : 0,
              borderColor: 'primary.main',
              transition: 'all 0.2s ease',
              '&:hover': {
                bgcolor: 'action.hover',
              },
            }}
          >
            <CodeIcon color={activePanel === 'code' ? 'primary' : 'inherit'} />
            <Typography 
              variant="subtitle2" 
              sx={{ fontWeight: activePanel === 'code' ? 600 : 400 }}
            >
              JavaScript
            </Typography>
          </Box>
          
          <Box
            onClick={() => setActivePanel('result')}
            sx={{
              flex: 1,
              p: 2,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1,
              bgcolor: activePanel === 'result' ? 'action.selected' : 'transparent',
              borderBottom: activePanel === 'result' ? 2 : 0,
              borderColor: 'primary.main',
              transition: 'all 0.2s ease',
              '&:hover': {
                bgcolor: 'action.hover',
              },
            }}
          >
            <ResultsIcon color={activePanel === 'result' ? 'primary' : 'inherit'} />
            <Typography 
              variant="subtitle2" 
              sx={{ fontWeight: activePanel === 'result' ? 600 : 400 }}
            >
              Console
            </Typography>
          </Box>
          
          <Box
            onClick={() => setActivePanel('molecule')}
            sx={{
              flex: 1,
              p: 2,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1,
              bgcolor: activePanel === 'molecule' ? 'action.selected' : 'transparent',
              borderBottom: activePanel === 'molecule' ? 2 : 0,
              borderColor: 'primary.main',
              transition: 'all 0.2s ease',
              '&:hover': {
                bgcolor: 'action.hover',
              },
            }}
          >
            <MoleculeIcon color={activePanel === 'molecule' ? 'primary' : 'inherit'} />
            <Typography 
              variant="subtitle2" 
              sx={{ fontWeight: activePanel === 'molecule' ? 600 : 400 }}
            >
              3D Viewer
            </Typography>
          </Box>
        </Box>
      )}

      {/* Main Content Area */}
      <Box sx={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: (splitView && !isMobile) ? 'row' : 'column', 
        minHeight: 0 
      }}>
        {(splitView && !isMobile) ? (
          // Split View Layout for Desktop
          <>
            {/* Code Editor Panel */}
            <Box sx={{ 
              flex: 1, 
              display: 'flex', 
              flexDirection: 'column',
              borderRight: 1,
              borderColor: 'divider',
            }}>
              <Box sx={{ 
                p: 1, 
                borderBottom: 1, 
                borderColor: 'divider',
                bgcolor: 'background.paper',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}>
                <CodeIcon fontSize="small" color="primary" />
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  JavaScript
                </Typography>
              </Box>
              <Box sx={{ 
                flex: 1, 
                minHeight: 0, 
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column'
              }}>
                {useFallback ? (
                  <FallbackCodeEditor />
                ) : (
                  <Sandpack
                    key={`split-${sandpackKey}`}
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
                      autoReload: true,
                      recompileMode: 'immediate',
                    }}
                    theme={theme}
                    customSetup={{
                      dependencies: {}
                    }}
                  />
                )}
              </Box>
            </Box>

            {/* Console/Results Panel */}
            <Box sx={{ 
              flex: 1, 
              display: 'flex', 
              flexDirection: 'column',
            }}>
              <Box sx={{ 
                p: 1, 
                borderBottom: 1, 
                borderColor: 'divider',
                bgcolor: 'background.paper',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}>
                <ResultsIcon fontSize="small" color="primary" />
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  Console
                </Typography>
              </Box>
              <Box
                sx={{
                  flex: 1,
                  minHeight: 0,
                  p: 2,
                  bgcolor: theme === 'dark' ? '#1a1a1a' : '#f8f9fa',
                  color: theme === 'dark' ? '#00ff41' : '#333',
                  fontFamily: 'Consolas, Monaco, "Courier New", monospace',
                  fontSize: '0.9rem',
                  overflow: 'auto',
                  lineHeight: 1.6,
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <Box sx={{ 
                  flex: 1,
                  p: 2, 
                  border: 1, 
                  borderColor: 'divider',
                  borderRadius: 1,
                  bgcolor: theme === 'dark' ? '#000' : '#fff',
                  minHeight: 0,
                  overflow: 'auto',
                }}>
                  {useFallback && consoleOutput.length > 0 ? (
                    <Box sx={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>
                      {consoleOutput.map((line, index) => (
                        <div key={index} style={{ marginBottom: '4px', color: theme === 'dark' ? '#00ff41' : '#333' }}>
                          {line}
                        </div>
                      ))}
                    </Box>
                  ) : (
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {useFallback ? (
                        <>
                          Click "Run" to execute your code and see results here.
                          <br />
                          Try running: <code>analyzeReaction('H2 + O2 = H2O')</code>
                        </>
                      ) : (
                        <>
                          Code is running in Sandpack. Check the browser console or Sandpack's console for output.
                          <br />
                          Try running: <code>analyzeReaction('H2 + O2 = H2O')</code>
                        </>
                      )}
                    </Typography>
                  )}
                </Box>
              </Box>
            </Box>
          </>
        ) : (
          // Single Panel View (Mobile or Desktop Stack View)
          <>
            {activePanel === 'code' ? (
              // Code Editor Panel
              <Box sx={{ 
                flex: 1, 
                minHeight: 0, 
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column'
              }}>
                {useFallback ? (
                  <FallbackCodeEditor />
                ) : (
                  <Sandpack
                    key={`single-${sandpackKey}`}
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
                      autoReload: true,
                      recompileMode: 'immediate',
                    }}
                    theme={theme}
                    customSetup={{
                      dependencies: {}
                    }}
                  />
                )}
              </Box>
            ) : activePanel === 'result' ? (
              // Console/Results Panel
              <Box
                sx={{
                  flex: 1,
                  minHeight: 0,
                  p: 2,
                  bgcolor: theme === 'dark' ? '#1a1a1a' : '#f8f9fa',
                  color: theme === 'dark' ? '#00ff41' : '#333',
                  fontFamily: 'Consolas, Monaco, "Courier New", monospace',
                  fontSize: '0.9rem',
                  overflow: 'auto',
                  lineHeight: 1.6,
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <Typography variant="subtitle2" sx={{ mb: 2, color: 'text.secondary' }}>
                  Console Output
                </Typography>
                
                <Box sx={{ 
                  flex: 1,
                  p: 2, 
                  border: 1, 
                  borderColor: 'divider',
                  borderRadius: 1,
                  bgcolor: theme === 'dark' ? '#000' : '#fff',
                  minHeight: 0,
                  overflow: 'auto',
                }}>
                  {useFallback && consoleOutput.length > 0 ? (
                    <Box sx={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>
                      {consoleOutput.map((line, index) => (
                        <div key={index} style={{ marginBottom: '4px', color: theme === 'dark' ? '#00ff41' : '#333' }}>
                          {line}
                        </div>
                      ))}
                    </Box>
                  ) : (
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {useFallback ? (
                        <>
                          Click "Run" to execute your code and see results here.
                          <br />
                          Try running: <code>analyzeReaction('H2 + O2 = H2O')</code>
                        </>
                      ) : (
                        <>
                          Code is running in Sandpack. Check the browser console or Sandpack's console for output.
                          <br />
                          Try running: <code>analyzeReaction('H2 + O2 = H2O')</code>
                        </>
                      )}
                    </Typography>
                  )}
                </Box>
              </Box>
            ) : (
              // Molecular Viewer Panel
              <Box sx={{ 
                flex: 1, 
                minHeight: 0, 
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <MolecularViewer 
                  theme={theme}
                  onMoleculeLoad={(moleculeName) => {
                    if (onConsoleOutput) {
                      onConsoleOutput(`Loaded molecule: ${moleculeName}`);
                    }
                  }}
                />
              </Box>
            )}
          </>
        )}
      </Box>
    </Box>
  );
};

export default CodePenLayout;
