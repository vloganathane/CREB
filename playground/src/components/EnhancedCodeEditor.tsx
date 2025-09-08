import React, { useState, useRef, useCallback } from 'react';
import { Editor } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  Button,
  Alert,
} from '@mui/material';
import {
  PlayArrow as RunIcon,
  Code as CodeIcon,
  Settings as SettingsIcon,
  Fullscreen as FullscreenIcon,
  FullscreenExit as FullscreenExitIcon,
} from '@mui/icons-material';

interface EnhancedCodeEditorProps {
  code: string;
  onChange: (code: string) => void;
  onExecute: (code: string) => void;
  theme?: 'light' | 'dark';
  language?: string;
}

const EnhancedCodeEditor: React.FC<EnhancedCodeEditorProps> = ({
  code,
  onChange,
  onExecute,
  theme = 'dark',
  language = 'javascript'
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  const handleRun = useCallback(() => {
    try {
      setError(null);
      onExecute(code);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Execution error');
    }
  }, [code, onExecute]);

  const handleEditorDidMount = useCallback((editor: monaco.editor.IStandaloneCodeEditor) => {
    editorRef.current = editor;
    
    // Add keyboard shortcuts
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      handleRun();
    });
    
    // Enhanced editor options
    editor.updateOptions({
      fontSize: 14,
      lineHeight: 20,
      tabSize: 2,
      insertSpaces: true,
      wordWrap: 'on',
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      automaticLayout: true,
      smoothScrolling: true,
      cursorBlinking: 'blink',
      renderWhitespace: 'selection',
      showFoldingControls: 'always',
      folding: true,
      lineNumbers: 'on',
      glyphMargin: true,
      contextmenu: true,
      mouseWheelZoom: true,
    });
  }, [handleRun]);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(!isFullscreen);
  }, [isFullscreen]);

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: isFullscreen ? 'fixed' : 'relative',
        top: isFullscreen ? 0 : 'auto',
        left: isFullscreen ? 0 : 'auto',
        right: isFullscreen ? 0 : 'auto',
        bottom: isFullscreen ? 0 : 'auto',
        zIndex: isFullscreen ? 9999 : 'auto',
        bgcolor: 'background.paper',
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
          <CodeIcon fontSize="small" color="primary" />
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            Chemical Equation Editor
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Tooltip title="Run Code (Ctrl+Enter)">
            <Button
              variant="contained"
              size="small"
              startIcon={<RunIcon />}
              onClick={handleRun}
              sx={{ 
                bgcolor: 'success.main',
                '&:hover': { bgcolor: 'success.dark' },
                fontWeight: 600,
              }}
            >
              Run
            </Button>
          </Tooltip>
          
          <Tooltip title="Settings">
            <IconButton size="small">
              <SettingsIcon />
            </IconButton>
          </Tooltip>
          
          <Tooltip title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}>
            <IconButton size="small" onClick={toggleFullscreen}>
              {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Error Display */}
      {error && (
        <Alert severity="error" onClose={() => setError(null)} sx={{ m: 1 }}>
          {error}
        </Alert>
      )}

      {/* Editor */}
      <Box sx={{ flex: 1, minHeight: 0 }}>
        <Editor
          height="100%"
          language={language}
          theme={theme === 'dark' ? 'vs-dark' : 'light'}
          value={code}
          onChange={(value) => onChange(value || '')}
          onMount={handleEditorDidMount}
          options={{
            fontSize: 14,
            lineHeight: 20,
            tabSize: 2,
            insertSpaces: true,
            wordWrap: 'on',
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            smoothScrolling: true,
            cursorBlinking: 'blink',
            renderWhitespace: 'selection',
            showFoldingControls: 'always',
            folding: true,
            lineNumbers: 'on',
            glyphMargin: true,
            contextmenu: true,
            mouseWheelZoom: true,
            suggest: {
              insertMode: 'replace',
              filterGraceful: true,
              showKeywords: true,
              showSnippets: true,
              showFunctions: true,
              showConstructors: true,
              showFields: true,
              showVariables: true,
              showClasses: true,
              showStructs: true,
              showInterfaces: true,
              showModules: true,
              showProperties: true,
              showEvents: true,
              showOperators: true,
              showUnits: true,
              showValues: true,
              showConstants: true,
              showEnums: true,
              showEnumMembers: true,
              showColors: true,
              showFiles: true,
              showReferences: true,
              showFolders: true,
              showTypeParameters: true,
              showIssues: true,
              showUsers: true,
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default EnhancedCodeEditor;
