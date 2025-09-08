import React, { useState, useCallback } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Fab,
} from '@mui/material';
import {
  PlayArrow as RunIcon,
  Code as CodeIcon,
  Timeline as ResultsIcon,
  Science as MoleculeIcon,
} from '@mui/icons-material';

// Import CREB-JS functionality - USING REAL CREB-JS NOW
import { ChemicalEquationBalancer, calculateMolarWeight } from 'creb-js';

import EnhancedCodeEditor from './EnhancedCodeEditor';
import EnhancedConsole from './EnhancedConsole';
import MolecularViewer from './MolecularViewer';
import { extractMoleculesFromCode, type MoleculeInfo, type ParsedReaction } from '../utils/moleculeParser';

interface MobileLayoutProps {
  code: string;
  onCodeChange: (code: string) => void;
  theme?: 'light' | 'dark';
  title?: string;
}

type TabValue = 'code' | 'console' | 'viewer';

const MobileLayout: React.FC<MobileLayoutProps> = ({
  code,
  onCodeChange,
  theme = 'dark'
}) => {
  const [activeTab, setActiveTab] = useState<TabValue>('code');
  const [selectedMolecules, setSelectedMolecules] = useState<MoleculeInfo[]>([]);
  const [lastReaction, setLastReaction] = useState<ParsedReaction | null>(null);
  const [showRunButton, setShowRunButton] = useState(true);

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
      
      // Auto-switch to console to see results
      setActiveTab('console');
      
    } catch (error) {
      window.console.error(`Execution error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setActiveTab('console');
    }
  }, []);

  // Handle molecule selection from console
  const handleMoleculeClick = useCallback((molecule: MoleculeInfo) => {
    setSelectedMolecules([molecule]);
    // Switch to 3D viewer when molecule is clicked
    setActiveTab('viewer');
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

  const handleTabChange = useCallback((_: React.SyntheticEvent, newValue: TabValue) => {
    setActiveTab(newValue);
    // Hide run button when not on code tab
    setShowRunButton(newValue === 'code');
  }, []);

  const getTabIcon = (tab: TabValue) => {
    switch (tab) {
      case 'code': return <CodeIcon />;
      case 'console': return <ResultsIcon />;
      case 'viewer': return <MoleculeIcon />;
    }
  };

  const getTabLabel = (tab: TabValue) => {
    switch (tab) {
      case 'code': return 'Code';
      case 'console': return 'Console';
      case 'viewer': return '3D Viewer';
    }
  };

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
          p: 1.5,
          borderBottom: 1,
          borderColor: 'divider',
          bgcolor: 'background.paper',
          boxShadow: 1,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <MoleculeIcon color="primary" sx={{ fontSize: 24 }} />
          <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main', fontSize: '1.1rem' }}>
            CREB-JS
          </Typography>
        </Box>
        
        {lastReaction && (
          <Box sx={{ flex: 1, mx: 1, minWidth: 0 }}>
            <Typography 
              variant="caption" 
              sx={{ 
                fontFamily: 'monospace',
                bgcolor: 'action.hover',
                px: 1,
                py: 0.25,
                borderRadius: 0.5,
                fontSize: '0.7rem',
                display: 'block',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {lastReaction.equation}
            </Typography>
          </Box>
        )}
      </Box>

      {/* Tab Navigation */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            minHeight: 56,
            '& .MuiTab-root': {
              minHeight: 56,
              fontSize: '0.9rem',
              fontWeight: 500,
            },
          }}
        >
          <Tab
            value="code"
            icon={getTabIcon('code')}
            label={getTabLabel('code')}
            iconPosition="start"
          />
          <Tab
            value="console"
            icon={getTabIcon('console')}
            label={getTabLabel('console')}
            iconPosition="start"
          />
          <Tab
            value="viewer"
            icon={getTabIcon('viewer')}
            label={getTabLabel('viewer')}
            iconPosition="start"
          />
        </Tabs>
      </Box>

      {/* Tab Content */}
      <Box sx={{ flex: 1, minHeight: 0, position: 'relative' }}>
        {activeTab === 'code' && (
          <Box sx={{ height: '100%' }}>
            <EnhancedCodeEditor
              code={code}
              onChange={onCodeChange}
              onExecute={executeCode}
              theme={theme}
            />
          </Box>
        )}

        {activeTab === 'console' && (
          <Box sx={{ height: '100%' }}>
            <EnhancedConsole
              theme={theme}
              onMoleculeClick={handleMoleculeClick}
              onReactionAnalyze={handleReactionAnalyze}
            />
          </Box>
        )}

        {activeTab === 'viewer' && (
          <Box sx={{ height: '100%' }}>
            <MolecularViewer
              theme={theme}
              selectedMolecules={selectedMolecules}
              autoLoad={true}
              onMoleculeLoad={(name) => {
                window.console.log(`Loaded molecule: ${name}`);
              }}
            />
          </Box>
        )}
      </Box>

      {/* Floating Action Button for Running Code */}
      {showRunButton && (
        <Fab
          color="success"
          onClick={() => executeCode(code)}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            bgcolor: 'success.main',
            '&:hover': {
              bgcolor: 'success.dark',
            },
            zIndex: 1000,
          }}
        >
          <RunIcon />
        </Fab>
      )}
    </Box>
  );
};

export default MobileLayout;
