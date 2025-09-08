import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Stack,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Science as ScienceIcon,
  LocalFireDepartment as FireIcon,
  WaterDrop as WaterIcon,
  AutoFixHigh as AutoFixIcon,
  Calculate as CalculateIcon,
} from '@mui/icons-material';
import { examples } from '../examples';

interface ExamplesGalleryProps {
  onLoadExample: (code: string) => void;
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'balancing':
      return <AutoFixIcon color="primary" />;
    case 'stoichiometry':
      return <CalculateIcon color="secondary" />;
    case 'combustion':
      return <FireIcon color="error" />;
    case 'aqueous':
      return <WaterIcon color="info" />;
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
    case 'combustion':
      return 'error';
    case 'aqueous':
      return 'info';
    default:
      return 'primary';
  }
};

const ExamplesGallery: React.FC<ExamplesGalleryProps> = ({ onLoadExample }) => {
  const categories = Array.from(new Set(examples.map(ex => ex.category)));

  return (
    <Box sx={{ height: '100%', overflow: 'auto', p: 2 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Code Examples
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Click any example to load it into the editor
        </Typography>
      </Box>

      {categories.map((category) => {
        const categoryExamples = examples.filter(ex => ex.category === category);
        
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
                label={categoryExamples.length} 
                size="small" 
                color={getCategoryColor(category)}
                sx={{ ml: 1 }}
              />
            </Box>

            <Stack spacing={1}>
              {categoryExamples.map((example) => (
                <Card 
                  key={example.id} 
                  elevation={1}
                  sx={{ 
                    cursor: 'pointer',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      elevation: 3,
                      transform: 'translateY(-2px)',
                      backgroundColor: 'action.hover',
                    },
                  }}
                  onClick={() => onLoadExample(example.code)}
                >
                  <CardContent sx={{ pb: 1 }}>
                    <Typography variant="subtitle2" component="div" gutterBottom>
                      {example.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                      {example.description}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ pt: 0, pb: 2, px: 2 }}>
                    <Button 
                      size="small" 
                      color="primary"
                      startIcon={<ScienceIcon />}
                    >
                      Load Example
                    </Button>
                    <Chip 
                      label={example.difficulty} 
                      size="small" 
                      variant="outlined"
                      color={
                        example.difficulty === 'beginner' ? 'success' :
                        example.difficulty === 'intermediate' ? 'warning' : 'error'
                      }
                    />
                  </CardActions>
                </Card>
              ))}
            </Stack>

            {category !== categories[categories.length - 1] && (
              <Divider sx={{ mt: 2 }} />
            )}
          </Box>
        );
      })}

      {/* Quick Actions */}
      <Box sx={{ mt: 4, p: 2, backgroundColor: 'background.paper', borderRadius: 1 }}>
        <Typography variant="subtitle2" gutterBottom>
          Quick Actions
        </Typography>
        <List dense>
          <ListItem disablePadding>
            <ListItemButton onClick={() => onLoadExample('// Clear editor\nconsole.log("Ready for new code!");')}>
              <ListItemIcon>
                <AutoFixIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Clear Editor" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={() => onLoadExample(examples[0].code)}>
              <ListItemIcon>
                <ScienceIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Load First Example" />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Box>
  );
};

export default ExamplesGallery;
