import React, { useState, useCallback, useEffect } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  Chip,
  Button,
  Paper,
  Divider,
} from '@mui/material';
import {
  Timeline as ResultsIcon,
  Clear as ClearIcon,
  Download as ExportIcon,
  Science as MoleculeIcon,
  PlayArrow as RunIcon,
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { parseChemicalEquation, type MoleculeInfo, type ParsedReaction } from '../utils/moleculeParser';

interface ConsoleEntry {
  id: string;
  type: 'log' | 'error' | 'warn' | 'success' | 'equation' | 'molecule';
  content: string;
  timestamp: Date;
  data?: unknown;
  molecules?: MoleculeInfo[];
  reaction?: ParsedReaction;
}

interface EnhancedConsoleProps {
  theme?: 'light' | 'dark';
  onMoleculeClick?: (molecule: MoleculeInfo) => void;
  onReactionAnalyze?: (reaction: ParsedReaction) => void;
}

const EnhancedConsole: React.FC<EnhancedConsoleProps> = ({
  theme = 'dark',
  onMoleculeClick,
  onReactionAnalyze,
}) => {
  const [entries, setEntries] = useState<ConsoleEntry[]>([]);
  const [isClearing, setIsClearing] = useState(false);

  // Add entry to console
  const addEntry = useCallback((entry: Omit<ConsoleEntry, 'id' | 'timestamp'>) => {
    const newEntry: ConsoleEntry = {
      ...entry,
      id: `${Date.now()}-${Math.random()}`,
      timestamp: new Date(),
    };
    
    setEntries(prev => [...prev, newEntry]);
  }, []);

  // Add log entry
  const log = useCallback((content: string, type: ConsoleEntry['type'] = 'log', data?: unknown) => {
    addEntry({ type, content, data });
  }, [addEntry]);

  // Add equation analysis
  const analyzeEquation = useCallback((equation: string) => {
    try {
      const reaction = parseChemicalEquation(equation);
      
      addEntry({
        type: 'equation',
        content: `Equation: ${reaction.equation}`,
        reaction,
        molecules: [...reaction.reactants, ...reaction.products],
      });
      
      if (reaction.isBalanced) {
        addEntry({
          type: 'success',
          content: '✓ Equation is balanced',
        });
      } else {
        addEntry({
          type: 'warn',
          content: '⚠ Equation may not be balanced',
        });
      }
      
      // Show molecule details
      const uniqueMolecules = Array.from(
        new Map([...reaction.reactants, ...reaction.products].map(m => [m.formula, m])).values()
      );
      
      uniqueMolecules.forEach(molecule => {
        addEntry({
          type: 'molecule',
          content: `${molecule.name} (${molecule.formula})`,
          data: molecule,
        });
      });
      
      if (onReactionAnalyze) {
        onReactionAnalyze(reaction);
      }
      
    } catch (error) {
      addEntry({
        type: 'error',
        content: `Error parsing equation: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });
    }
  }, [addEntry, onReactionAnalyze]);

  // Clear console
  const clearConsole = useCallback(() => {
    setIsClearing(true);
    setTimeout(() => {
      setEntries([]);
      setIsClearing(false);
    }, 200);
  }, []);

  // Export console output
  const exportOutput = useCallback(() => {
    const output = entries
      .map(entry => `[${entry.timestamp.toLocaleTimeString()}] ${entry.content}`)
      .join('\n');
    
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `console-output-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [entries]);

  // Handle molecule click
  const handleMoleculeClick = useCallback((molecule: MoleculeInfo) => {
    log(`Loading molecule: ${molecule.name}`, 'log');
    if (onMoleculeClick) {
      onMoleculeClick(molecule);
    }
  }, [log, onMoleculeClick]);

  // Expose methods globally for code execution
  useEffect(() => {
    const originalConsole = window.console;
    (window as unknown as { console: typeof console & { analyzeReaction: typeof analyzeEquation } }).console = {
      ...console,
      log: (content: string) => log(content, 'log'),
      error: (content: string) => log(content, 'error'),
      warn: (content: string) => log(content, 'warn'),
      analyzeReaction: analyzeEquation,
      clear: clearConsole,
    };
    
    return () => {
      // Restore original console
      window.console = originalConsole;
    };
  }, [log, analyzeEquation, clearConsole]);

  const getEntryIcon = (type: ConsoleEntry['type']) => {
    switch (type) {
      case 'success': return <SuccessIcon color="success" fontSize="small" />;
      case 'error': return <ErrorIcon color="error" fontSize="small" />;
      case 'warn': return <WarningIcon color="warning" fontSize="small" />;
      case 'equation': return <RunIcon color="primary" fontSize="small" />;
      case 'molecule': return <MoleculeIcon color="secondary" fontSize="small" />;
      default: return <ResultsIcon color="inherit" fontSize="small" />;
    }
  };

  const getEntryColor = (type: ConsoleEntry['type']) => {
    switch (type) {
      case 'success': return 'success.main';
      case 'error': return 'error.main';
      case 'warn': return 'warning.main';
      case 'equation': return 'primary.main';
      case 'molecule': return 'secondary.main';
      default: return theme === 'dark' ? '#00ff41' : '#333';
    }
  };

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: theme === 'dark' ? '#1a1a1a' : '#f8f9fa',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 1,
          borderBottom: 1,
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ResultsIcon fontSize="small" color="primary" />
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            Enhanced Console
          </Typography>
          <Chip 
            label={`${entries.length} entries`} 
            size="small" 
            color="primary" 
            variant="outlined" 
          />
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Tooltip title="Export Output">
            <span>
              <IconButton 
                size="small" 
                onClick={exportOutput}
                disabled={entries.length === 0}
              >
                <ExportIcon />
              </IconButton>
            </span>
          </Tooltip>
          
          <Tooltip title="Clear Console">
            <span>
              <IconButton 
                size="small" 
                onClick={clearConsole}
                disabled={entries.length === 0}
              >
                <ClearIcon />
              </IconButton>
            </span>
          </Tooltip>
        </Box>
      </Box>

      {/* Console Output */}
      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          p: 1,
          fontFamily: 'Consolas, Monaco, "Courier New", monospace',
          fontSize: '0.9rem',
          lineHeight: 1.6,
        }}
      >
        {entries.length === 0 ? (
          <Box
            sx={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'text.secondary',
            }}
          >
            <Typography variant="body2" sx={{ textAlign: 'center' }}>
              Console output will appear here.<br />
              Try running: <code>analyzeReaction('H2 + O2 → H2O')</code>
            </Typography>
          </Box>
        ) : (
          <Box sx={{ opacity: isClearing ? 0.3 : 1, transition: 'opacity 0.2s' }}>
            {entries.map((entry) => (
              <Box key={entry.id} sx={{ mb: 1 }}>
                {entry.type === 'equation' && entry.reaction && (
                  <Paper
                    elevation={1}
                    sx={{
                      p: 2,
                      mb: 1,
                      bgcolor: theme === 'dark' ? '#2a2a2a' : '#fff',
                      border: 1,
                      borderColor: 'primary.main',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <RunIcon color="primary" fontSize="small" />
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        Chemical Equation Analysis
                      </Typography>
                    </Box>
                    
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        fontFamily: 'monospace',
                        fontSize: '1.1rem',
                        color: 'primary.main',
                        mb: 1,
                      }}
                    >
                      {entry.reaction.equation}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                      <Chip 
                        label={entry.reaction.isBalanced ? 'Balanced' : 'Not Balanced'} 
                        color={entry.reaction.isBalanced ? 'success' : 'warning'}
                        size="small"
                      />
                      <Chip 
                        label={`${entry.reaction.reactants.length} Reactants`} 
                        size="small"
                        variant="outlined"
                      />
                      <Chip 
                        label={`${entry.reaction.products.length} Products`} 
                        size="small"
                        variant="outlined"
                      />
                    </Box>
                    
                    <Divider sx={{ my: 1 }} />
                    
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {[...entry.reaction.reactants, ...entry.reaction.products]
                        .filter((mol, idx, arr) => arr.findIndex(m => m.formula === mol.formula) === idx)
                        .map(molecule => (
                          <Button
                            key={molecule.formula}
                            size="small"
                            variant="outlined"
                            startIcon={<MoleculeIcon />}
                            onClick={() => handleMoleculeClick(molecule)}
                            sx={{
                              textTransform: 'none',
                              borderColor: molecule.cid ? 'secondary.main' : 'text.disabled',
                              color: molecule.cid ? 'secondary.main' : 'text.disabled',
                            }}
                          >
                            {molecule.name}
                          </Button>
                        ))}
                    </Box>
                  </Paper>
                )}
                
                {entry.type !== 'equation' && (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 1,
                      color: getEntryColor(entry.type),
                    }}
                  >
                    <Box sx={{ mt: 0.5 }}>
                      {getEntryIcon(entry.type)}
                    </Box>
                    
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          fontFamily: 'monospace',
                          whiteSpace: 'pre-wrap',
                          wordBreak: 'break-word',
                        }}
                      >
                        {entry.content}
                      </Typography>
                      
                      {entry.type === 'molecule' && entry.data && (
                        <Button
                          size="small"
                          variant="text"
                          startIcon={<MoleculeIcon />}
                          onClick={() => handleMoleculeClick(entry.data as MoleculeInfo)}
                          sx={{ 
                            mt: 0.5,
                            textTransform: 'none',
                            fontSize: '0.8rem',
                          }}
                        >
                          View in 3D
                        </Button>
                      )}
                    </Box>
                    
                    <Typography
                      variant="caption"
                      sx={{ 
                        color: 'text.disabled',
                        fontSize: '0.7rem',
                        mt: 0.5,
                      }}
                    >
                      {entry.timestamp.toLocaleTimeString()}
                    </Typography>
                  </Box>
                )}
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default EnhancedConsole;
