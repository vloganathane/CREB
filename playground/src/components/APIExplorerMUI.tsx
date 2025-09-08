import React, { useState } from 'react';
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Card,
  Button,
  Chip,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Tooltip,
  Divider,
  TextField,
  Stack,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Code as CodeIcon,
  ContentCopy as CopyIcon,
  Science as ScienceIcon,
  Calculate as CalculateIcon,
  Visibility as VisibilityIcon,
  Thermostat as ThermostatIcon,
  Build as BuildIcon,
} from '@mui/icons-material';

interface APIMethod {
  name: string;
  description: string;
  parameters: Array<{
    name: string;
    type: string;
    required: boolean;
    description: string;
  }>;
  returnType: string;
  example: string;
  category: 'balancing' | 'visualization' | 'stoichiometry' | 'thermodynamics' | 'utilities';
}

interface APIExplorerProps {
  onInsertCode: (code: string) => void;
}

// Mock API methods for demonstration
const apiMethods: APIMethod[] = [
  {
    name: 'ChemicalEquationBalancer.balance',
    description: 'Balance a chemical equation and return coefficients',
    parameters: [
      {
        name: 'equation',
        type: 'string',
        required: true,
        description: 'Chemical equation to balance (e.g., "H2 + O2 = H2O")',
      },
    ],
    returnType: 'BalanceResult',
    example: `const balancer = new ChemicalEquationBalancer();
const result = balancer.balance('H2 + O2 = H2O');
console.log(result.equation);`,
    category: 'balancing',
  },
  {
    name: 'calculateMolarWeight',
    description: 'Calculate the molecular weight of a chemical formula',
    parameters: [
      {
        name: 'formula',
        type: 'string',
        required: true,
        description: 'Chemical formula (e.g., "H2O", "CO2")',
      },
    ],
    returnType: 'number',
    example: `const weight = calculateMolarWeight('H2O');
console.log(\`Water: \${weight} g/mol\`);`,
    category: 'stoichiometry',
  },
  {
    name: 'MolecularVisualizer.render3D',
    description: 'Render a 3D molecular structure',
    parameters: [
      {
        name: 'molecule',
        type: 'string',
        required: true,
        description: 'SMILES string or molecular formula',
      },
      {
        name: 'options',
        type: 'VisualizationOptions',
        required: false,
        description: 'Rendering options (style, colors, etc.)',
      },
    ],
    returnType: 'VisualizationResult',
    example: `const visualizer = new MolecularVisualizer();
const result = visualizer.render3D('CCO', {
  style: 'ball-and-stick',
  showLabels: true
});`,
    category: 'visualization',
  },
  {
    name: 'StoichiometryCalculator.calculateYield',
    description: 'Calculate theoretical and percent yield for reactions',
    parameters: [
      {
        name: 'reaction',
        type: 'string',
        required: true,
        description: 'Balanced chemical equation',
      },
      {
        name: 'quantities',
        type: 'ReagentQuantities',
        required: true,
        description: 'Initial quantities of reagents',
      },
    ],
    returnType: 'YieldResult',
    example: `const calculator = new StoichiometryCalculator();
const yield = calculator.calculateYield(
  '2H2 + O2 = 2H2O',
  { H2: '4 mol', O2: '2 mol' }
);`,
    category: 'stoichiometry',
  },
];

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'balancing':
      return <ScienceIcon color="primary" />;
    case 'stoichiometry':
      return <CalculateIcon color="secondary" />;
    case 'visualization':
      return <VisibilityIcon color="info" />;
    case 'thermodynamics':
      return <ThermostatIcon color="error" />;
    case 'utilities':
      return <BuildIcon color="success" />;
    default:
      return <ScienceIcon color="primary" />;
  }
};

const getCategoryColor = (category: string): "primary" | "secondary" | "error" | "info" | "warning" | "success" => {
  switch (category) {
    case 'balancing':
      return 'primary';
    case 'stoichiometry':
      return 'secondary';
    case 'visualization':
      return 'info';
    case 'thermodynamics':
      return 'error';
    case 'utilities':
      return 'success';
    default:
      return 'primary';
  }
};

const APIExplorer: React.FC<APIExplorerProps> = ({ onInsertCode }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedMethod, setExpandedMethod] = useState<string | null>(null);

  const filteredMethods = apiMethods.filter(method =>
    method.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    method.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    method.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categories = Array.from(new Set(filteredMethods.map(method => method.category)));

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
  };

  return (
    <Box sx={{ height: '100%', overflow: 'auto', p: 2 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          API Explorer
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Explore CREB-JS methods and insert code snippets
        </Typography>
        
        <TextField
          fullWidth
          size="small"
          placeholder="Search methods..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mt: 2 }}
        />
      </Box>

      {categories.map((category) => {
        const categoryMethods = filteredMethods.filter(method => method.category === category);
        
        return (
          <Box key={category} sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              {getCategoryIcon(category)}
              <Typography 
                variant="subtitle1" 
                sx={{ ml: 1, textTransform: 'capitalize', fontWeight: 600 }}
              >
                {category}
              </Typography>
              <Chip 
                label={categoryMethods.length} 
                size="small" 
                color={getCategoryColor(category)}
                sx={{ ml: 1 }}
              />
            </Box>

            <Stack spacing={1}>
              {categoryMethods.map((method) => (
                <Card key={method.name} elevation={1}>
                  <Accordion
                    expanded={expandedMethod === method.name}
                    onChange={() => setExpandedMethod(
                      expandedMethod === method.name ? null : method.name
                    )}
                    sx={{ boxShadow: 'none' }}
                  >
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Box>
                        <Typography variant="subtitle2" component="div">
                          {method.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                          {method.description}
                        </Typography>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Box>
                        {/* Parameters */}
                        <Typography variant="body2" fontWeight="bold" gutterBottom>
                          Parameters:
                        </Typography>
                        <List dense sx={{ pl: 2 }}>
                          {method.parameters.map((param, index) => (
                            <ListItem key={index} sx={{ py: 0.5 }}>
                              <ListItemText
                                primary={
                                  <Box component="span">
                                    <Typography component="span" variant="body2" fontWeight="bold">
                                      {param.name}
                                    </Typography>
                                    <Typography component="span" variant="body2" color="text.secondary">
                                      {` (${param.type})`}
                                    </Typography>
                                    {param.required && (
                                      <Chip label="required" size="small" color="error" sx={{ ml: 1, height: 16 }} />
                                    )}
                                  </Box>
                                }
                                secondary={param.description}
                              />
                            </ListItem>
                          ))}
                        </List>

                        {/* Return Type */}
                        <Typography variant="body2" fontWeight="bold" gutterBottom sx={{ mt: 2 }}>
                          Returns: <Typography component="span" fontFamily="monospace">{method.returnType}</Typography>
                        </Typography>

                        {/* Example Code */}
                        <Typography variant="body2" fontWeight="bold" gutterBottom sx={{ mt: 2 }}>
                          Example:
                        </Typography>
                        <Box
                          sx={{
                            backgroundColor: 'background.default',
                            p: 2,
                            borderRadius: 1,
                            fontFamily: 'monospace',
                            fontSize: '0.8rem',
                            overflow: 'auto',
                            border: 1,
                            borderColor: 'divider',
                          }}
                        >
                          <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                            {method.example}
                          </pre>
                        </Box>

                        {/* Actions */}
                        <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                          <Button
                            size="small"
                            startIcon={<CodeIcon />}
                            onClick={() => onInsertCode(method.example)}
                          >
                            Insert Code
                          </Button>
                          <Tooltip title="Copy to clipboard">
                            <IconButton
                              size="small"
                              onClick={() => handleCopyCode(method.example)}
                            >
                              <CopyIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                </Card>
              ))}
            </Stack>

            {category !== categories[categories.length - 1] && (
              <Divider sx={{ mt: 2 }} />
            )}
          </Box>
        );
      })}

      {filteredMethods.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body2" color="text.secondary">
            No methods found matching "{searchTerm}"
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default APIExplorer;
