import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Alert,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  Card,
  CardContent,
} from '@mui/material';
import {
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Science as ScienceIcon,
  Timeline as TimelineIcon,
  Code as CodeIcon,
} from '@mui/icons-material';
import type { ExecutionResult } from '../types';

interface ResultsPanelProps {
  executionResult: ExecutionResult | null;
  isLoading?: boolean;
}

const ResultsPanel: React.FC<ResultsPanelProps> = ({ executionResult, isLoading = false }) => {
  if (isLoading) {
    return (
      <Paper elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TimelineIcon color="primary" />
            <Typography variant="h6">Results</Typography>
            <Chip label="Executing..." size="small" color="primary" />
          </Box>
        </Box>
        <Box sx={{ 
          flex: 1, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 2
        }}>
          <CircularProgress />
          <Typography variant="body2" color="text.secondary">
            Executing code...
          </Typography>
        </Box>
      </Paper>
    );
  }

  if (!executionResult) {
    return (
      <Paper elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TimelineIcon color="primary" />
            <Typography variant="h6">Results</Typography>
            <Chip label="Ready" size="small" color="success" variant="outlined" />
          </Box>
        </Box>
        <Box sx={{ 
          flex: 1, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 2,
          p: 3
        }}>
          <ScienceIcon sx={{ fontSize: 48, color: 'text.disabled' }} />
          <Typography variant="body2" color="text.secondary" textAlign="center">
            Run your code to see results here
          </Typography>
          <Typography variant="caption" color="text.disabled" textAlign="center">
            The Sandpack editor will execute your code automatically
          </Typography>
        </Box>
      </Paper>
    );
  }

  return (
    <Paper elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TimelineIcon color="primary" />
          <Typography variant="h6">Results</Typography>
          <Chip 
            icon={executionResult.success ? <CheckIcon /> : <ErrorIcon />}
            label={executionResult.success ? 'Success' : 'Error'} 
            size="small" 
            color={executionResult.success ? 'success' : 'error'}
          />
        </Box>
      </Box>

      {/* Content */}
      <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
        {/* Status Alert */}
        <Alert 
          severity={executionResult.success ? 'success' : 'error'}
          sx={{ mb: 2 }}
          icon={executionResult.success ? <CheckIcon /> : <ErrorIcon />}
        >
          {executionResult.success 
            ? 'Code executed successfully!' 
            : 'Code execution failed'
          }
        </Alert>

        {/* Error Display */}
        {Boolean(executionResult.error) && (
          <Card sx={{ mb: 2, border: 1, borderColor: 'error.main' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <ErrorIcon color="error" />
                <Typography variant="subtitle2" color="error">
                  Error Details
                </Typography>
              </Box>
              <Typography 
                variant="body2" 
                component="pre"
                sx={{ 
                  fontFamily: 'monospace', 
                  whiteSpace: 'pre-wrap',
                  backgroundColor: 'background.default',
                  p: 1,
                  borderRadius: 1,
                  fontSize: '0.8rem'
                }}
              >
                {String(executionResult.error || 'Unknown error')}
              </Typography>
            </CardContent>
          </Card>
        )}

        {/* Output Display */}
        {Boolean(executionResult.output) && (
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <CodeIcon color="primary" />
                <Typography variant="subtitle2">
                  Console Output
                </Typography>
              </Box>
              <Typography 
                variant="body2" 
                component="pre"
                sx={{ 
                  fontFamily: 'monospace', 
                  whiteSpace: 'pre-wrap',
                  backgroundColor: 'background.default',
                  p: 1,
                  borderRadius: 1,
                  fontSize: '0.8rem'
                }}
              >
                {String(executionResult.output || '')}
              </Typography>
            </CardContent>
          </Card>
        )}

        {/* Result Display */}
        {Boolean(executionResult.result) && (
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <ScienceIcon color="secondary" />
                <Typography variant="subtitle2">
                  Return Value
                </Typography>
              </Box>
              <Typography 
                variant="body2" 
                component="pre"
                sx={{ 
                  fontFamily: 'monospace', 
                  whiteSpace: 'pre-wrap',
                  backgroundColor: 'background.default',
                  p: 1,
                  borderRadius: 1,
                  fontSize: '0.8rem'
                }}
              >
                {typeof executionResult.result === 'string' 
                  ? executionResult.result 
                  : JSON.stringify(executionResult.result, null, 2) || 'No return value'}
              </Typography>
            </CardContent>
          </Card>
        )}

        {/* Visualization Data */}
        {Boolean(executionResult.visualData) && (
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <TimelineIcon color="info" />
                <Typography variant="subtitle2">
                  Visualization Data
                </Typography>
                <Chip 
                  label={executionResult.visualData?.type || 'unknown'} 
                  size="small" 
                  color="info" 
                  variant="outlined"
                />
              </Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Visualization data available for rendering
              </Typography>
              
              {executionResult.visualData?.molecules && (
                <Box sx={{ mt: 1 }}>
                  <Typography variant="caption" fontWeight="bold">
                    Molecules:
                  </Typography>
                  <List dense>
                    {executionResult.visualData.molecules.map((molecule, index) => (
                      <ListItem key={index} sx={{ py: 0 }}>
                        <ListItemIcon sx={{ minWidth: 24 }}>
                          <ScienceIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText 
                          primary={molecule.formula}
                          secondary={molecule.name}
                          primaryTypographyProps={{ variant: 'body2' }}
                          secondaryTypographyProps={{ variant: 'caption' }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {!executionResult.error && !executionResult.output && !executionResult.result && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <WarningIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
            <Typography variant="body2" color="text.secondary">
              No output generated
            </Typography>
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default ResultsPanel;
