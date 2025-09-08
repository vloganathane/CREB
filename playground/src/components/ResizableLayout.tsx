import React, { useState, useCallback } from 'react';
import {
  Panel,
  PanelGroup,
  PanelResizeHandle,
} from 'react-resizable-panels';
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  Button,
  useMediaQuery,
} from '@mui/material';
import {
  PlayArrow as RunIcon,
  Science as MoleculeIcon,
  ViewStream as SplitIcon,
  ViewAgenda as StackIcon,
} from '@mui/icons-material';

// Import CREB-JS functionality - USING REAL CREB-JS NOW
import { ChemicalEquationBalancer, calculateMolarWeight } from 'creb-js';

import EnhancedCodeEditor from './EnhancedCodeEditor';
import EnhancedConsole from './EnhancedConsole';
import MolecularViewer from './MolecularViewer';
import MobileLayout from './MobileLayout';
import { extractMoleculesFromCode, type MoleculeInfo, type ParsedReaction } from '../utils/moleculeParser';

interface ResizableLayoutProps {
  code: string;
  onCodeChange: (code: string) => void;
  theme?: 'light' | 'dark';
  title?: string;
}

const ResizableLayout: React.FC<ResizableLayoutProps> = ({
  code,
  onCodeChange,
  theme = 'dark',
  title = 'Enhanced Chemistry Playground'
}) => {
  const [layout, setLayout] = useState<'horizontal' | 'vertical'>('horizontal');
  const [selectedMolecules, setSelectedMolecules] = useState<MoleculeInfo[]>([]);
  const [lastReaction, setLastReaction] = useState<ParsedReaction | null>(null);
  
  const isMobile = useMediaQuery('(max-width:900px)');

  // Execute code in a safe environment
  const executeCode = useCallback((codeToExecute: string) => {
    try {
      // Extract molecules from code for auto-visualization
      const extractedMolecules = extractMoleculesFromCode(codeToExecute);
      if (extractedMolecules.length > 0) {
        setSelectedMolecules(extractedMolecules);
      }

      // Remove import statements as they can't work in runtime
      const cleanCode = codeToExecute
        .replace(/import\s+.*?from\s+['"].*?['"];?\s*/g, '')
        .replace(/import\s+['"].*?['"];?\s*/g, '');

      // Create a sandboxed environment for code execution with real CREB-JS
      const enhancedConsole = window.console as Console & { analyzeReaction?: (equation: string) => void };
      const sandbox = {
        console: window.console,
        analyzeReaction: enhancedConsole.analyzeReaction,
        // Provide real CREB-JS functionality
        ChemicalEquationBalancer,
        calculateMolarWeight,
        // Add utility functions
        log: window.console.log,
        error: window.console.error,
        warn: window.console.warn,
      };

      // Execute code with sandbox
      const fn = new Function(...Object.keys(sandbox), cleanCode);
      fn(...Object.values(sandbox));
      
    } catch (error) {
      window.console.error(`Execution error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }, []);

  // Handle molecule selection from console
  const handleMoleculeClick = useCallback((molecule: MoleculeInfo) => {
    setSelectedMolecules([molecule]);
  }, []);

  // Handle reaction analysis
  const handleReactionAnalyze = useCallback((reaction: ParsedReaction) => {
    setLastReaction(reaction);
    // Auto-load molecules from reaction
    const moleculesWithCID = [...reaction.reactants, ...reaction.products].filter(m => m.cid);
    if (moleculesWithCID.length > 0) {
      setSelectedMolecules(moleculesWithCID.slice(0, 3)); // Limit to 3 molecules for performance
    }
  }, []);

  const toggleLayout = useCallback(() => {
    setLayout(prev => prev === 'horizontal' ? 'vertical' : 'horizontal');
  }, []);

  return (
    <Box sx={{ 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      bgcolor: 'background.default',
    }}>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2,
          borderBottom: 1,
          borderColor: 'divider',
          bgcolor: 'background.paper',
          boxShadow: 1,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <MoleculeIcon color="primary" sx={{ fontSize: 28 }} />
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
              {title}
            </Typography>
          </Box>
          
          {lastReaction && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Last Analysis:
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  fontFamily: 'monospace',
                  bgcolor: 'action.hover',
                  px: 1,
                  py: 0.5,
                  borderRadius: 1,
                }}
              >
                {lastReaction.equation}
              </Typography>
            </Box>
          )}
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Button
            variant="contained"
            startIcon={<RunIcon />}
            onClick={() => executeCode(code)}
            sx={{ 
              bgcolor: 'success.main',
              '&:hover': { bgcolor: 'success.dark' },
              fontWeight: 600,
            }}
          >
            Run Code
          </Button>
          
          {!isMobile && (
            <Tooltip title={`Switch to ${layout === 'horizontal' ? 'vertical' : 'horizontal'} layout`}>
              <IconButton onClick={toggleLayout}>
                {layout === 'horizontal' ? <StackIcon /> : <SplitIcon />}
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Box>

      {/* Main Content Area */}
      <Box sx={{ flex: 1, minHeight: 0 }}>
        {isMobile ? (
          // Mobile: Tabbed layout with enhanced UX
          <MobileLayout
            code={code}
            onCodeChange={onCodeChange}
            theme={theme}
          />
        ) : (
          // Desktop: Resizable panels
          <PanelGroup direction={layout}>
            {/* Code Editor Panel */}
            <Panel defaultSize={40} minSize={25}>
              <Box
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRight: layout === 'horizontal' ? 1 : 0,
                  borderBottom: layout === 'vertical' ? 1 : 0,
                  borderColor: 'divider',
                }}
              >
                <EnhancedCodeEditor
                  code={code}
                  onChange={onCodeChange}
                  onExecute={executeCode}
                  theme={theme}
                />
              </Box>
            </Panel>

            <PanelResizeHandle>
              <Box
                sx={{
                  width: layout === 'horizontal' ? 4 : '100%',
                  height: layout === 'vertical' ? 4 : '100%',
                  bgcolor: 'divider',
                  cursor: layout === 'horizontal' ? 'col-resize' : 'row-resize',
                  '&:hover': {
                    bgcolor: 'primary.main',
                  },
                  transition: 'background-color 0.2s',
                }}
              />
            </PanelResizeHandle>

            {/* Console Panel */}
            <Panel defaultSize={30} minSize={20}>
              <Box
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRight: layout === 'horizontal' ? 1 : 0,
                  borderBottom: layout === 'vertical' ? 1 : 0,
                  borderColor: 'divider',
                }}
              >
                <EnhancedConsole
                  theme={theme}
                  onMoleculeClick={handleMoleculeClick}
                  onReactionAnalyze={handleReactionAnalyze}
                />
              </Box>
            </Panel>

            <PanelResizeHandle>
              <Box
                sx={{
                  width: layout === 'horizontal' ? 4 : '100%',
                  height: layout === 'vertical' ? 4 : '100%',
                  bgcolor: 'divider',
                  cursor: layout === 'horizontal' ? 'col-resize' : 'row-resize',
                  '&:hover': {
                    bgcolor: 'primary.main',
                  },
                  transition: 'background-color 0.2s',
                }}
              />
            </PanelResizeHandle>

            {/* Molecular Viewer Panel */}
            <Panel defaultSize={30} minSize={20}>
              <Box
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <MolecularViewer
                  theme={theme}
                  selectedMolecules={selectedMolecules}
                  autoLoad={true}
                  onMoleculeLoad={(name) => {
                    window.console.log(`Loaded molecule: ${name}`);
                  }}
                />
              </Box>
            </Panel>
          </PanelGroup>
        )}
      </Box>
    </Box>
  );
};

export default ResizableLayout;
