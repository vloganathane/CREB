import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  Chip,
  CircularProgress,
  Alert,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from '@mui/material';
import {
  Science as MoleculeIcon,
  Refresh as RefreshIcon,
  Fullscreen as FullscreenIcon,
  FullscreenExit as FullscreenExitIcon,
} from '@mui/icons-material';
import { getSdf, getCompounds } from 'creb-pubchem-js';
// Import CREB visualization system - USING REAL CREB-JS NOW  
import { createMolecularVisualization, MolecularVisualization } from 'creb-js';
import type { MoleculeInfo } from '../utils/moleculeParser';

// Type definitions for 3Dmol.js
interface Viewer3DMol {
  clear(): void;
  addModel(data: string, format: string): void;
  setStyle(selection: object, style: object): void;
  addStyle(selection: object, style: object): void;
  zoomTo(): void;
  render(): void;
}

interface Window3DMol {
  createViewer(element: HTMLElement, config?: object): Viewer3DMol;
  rasmolElementColors: object;
}

// Declare global 3Dmol type for TypeScript
declare global {
  interface Window {
    $3Dmol?: Window3DMol;
  }
}

interface MolecularViewerProps {
  theme?: 'light' | 'dark';
  onMoleculeLoad?: (moleculeName: string) => void;
  selectedMolecules?: MoleculeInfo[];
  autoLoad?: boolean;
}

const MolecularViewer: React.FC<MolecularViewerProps> = ({
  theme = 'dark',
  onMoleculeLoad,
  selectedMolecules = [],
  autoLoad = false
}) => {
  const viewerRef = useRef<HTMLDivElement>(null);
  const [viewer, setViewer] = useState<Viewer3DMol | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedMolecule, setSelectedMolecule] = useState('water');
  const [customCID, setCustomCID] = useState('');
  const [moleculeInfo, setMoleculeInfo] = useState<{
    name?: string;
    formula?: string;
    molecularWeight?: number;
    iupacName?: string;
    cid?: string;
  } | null>(null);

  // Common molecules with their PubChem CIDs
  const commonMolecules = useMemo(() => ({
    water: { cid: '962', name: 'Water (H₂O)', formula: 'H2O' },
    methane: { cid: '297', name: 'Methane (CH₄)', formula: 'CH4' },
    glucose: { cid: '5793', name: 'Glucose (C₆H₁₂O₆)', formula: 'C6H12O6' },
    caffeine: { cid: '2519', name: 'Caffeine', formula: 'C8H10N4O2' },
    aspirin: { cid: '2244', name: 'Aspirin', formula: 'C9H8O4' },
    ethanol: { cid: '702', name: 'Ethanol (C₂H₆O)', formula: 'C2H6O' },
    benzene: { cid: '241', name: 'Benzene (C₆H₆)', formula: 'C6H6' },
    co2: { cid: '280', name: 'Carbon Dioxide (CO₂)', formula: 'CO2' },
    ammonia: { cid: '222', name: 'Ammonia (NH₃)', formula: 'NH3' },
    salt: { cid: '5234', name: 'Sodium Chloride (NaCl)', formula: 'NaCl' }
  }), []);

  // Load 3Dmol.js from CDN
  useEffect(() => {
    const load3DMol = () => {
      if (window.$3Dmol) {
        setLoading(false);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/3Dmol/2.0.4/3Dmol-min.js';
      script.onload = () => {
        setLoading(false);
      };
      script.onerror = () => {
        setError('Failed to load 3Dmol.js library');
        setLoading(false);
      };
      document.head.appendChild(script);
    };

    load3DMol();
  }, []);

  // Initialize viewer when 3Dmol is loaded
  useEffect(() => {
    if (!loading && !error && viewerRef.current && window.$3Dmol && !viewer) {
      try {
        const $3Dmol = window.$3Dmol;
        const newViewer = $3Dmol.createViewer(viewerRef.current, {
          defaultcolors: $3Dmol.rasmolElementColors
        });
        setViewer(newViewer);
      } catch {
        setError('Failed to initialize molecular viewer');
      }
    }
  }, [loading, error, viewer]);

  // Load molecule when viewer is ready
  const loadMolecule = useCallback(async (cid: string) => {
    if (!viewer) return;

    try {
      setLoading(true);
      setMoleculeInfo(null); // Clear previous molecule info
      console.log(`Loading molecule with CID: ${cid} using enhanced CREB PubChem package`);
      viewer.clear();
      
      // Use enhanced CREB PubChem package to get both structured data and SDF separately
      try {
        // Get structured compound data
        const compounds = await getCompounds(parseInt(cid));
        const compound = compounds[0];
        
        // Get SDF data
        const sdf = await getSdf(parseInt(cid));
        
        console.log(`CREB PubChem: Retrieved compound data and SDF for CID ${cid}`);
        console.log(`- Name: ${compound.iupacName || compound.molecularFormula}`);
        console.log(`- Molecular Weight: ${compound.molecularWeight}`);
        console.log(`- Formula: ${compound.molecularFormula}`);
        console.log(`- SDF Data Length: ${sdf.length} characters`);
        
        // Store structured molecule information
        setMoleculeInfo({
          name: compound.iupacName,
          formula: compound.molecularFormula,
          molecularWeight: compound.molecularWeight,
          iupacName: compound.iupacName,
          cid: cid
        });
        // Add molecule to viewer using SDF data from CREB PubChem
        viewer.addModel(sdf, 'sdf');
        
        // Style the molecule
        viewer.setStyle({}, {
          stick: {
            radius: 0.25,
            singleBonds: false,
            colorscheme: 'Jmol'
          }
        });
        
        // Add ball and stick representation
        viewer.addStyle({}, {
          sphere: {
            radius: 0.3,
            colorscheme: 'Jmol'
          }
        });
        
        viewer.zoomTo();
        viewer.render();
        
        if (onMoleculeLoad) {
          const molData = Object.values(commonMolecules).find(mol => mol.cid === cid);
          const moleculeName = compound.iupacName || molData?.name || `Molecule CID: ${cid}`;
          onMoleculeLoad(moleculeName);
        }
        
        setError(null);
        console.log(`Successfully loaded molecule CID: ${cid} using enhanced CREB PubChem`);
        
      } catch (pubchemError) {
        console.warn(`Enhanced CREB PubChem failed, falling back to direct SDF fetch:`, pubchemError);
        
        // Fallback to direct SDF fetch if enhanced method fails
        const url = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/SDF`;
        console.log(`Fallback: Fetching SDF from: ${url}`);
        
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Fallback SDF fetch failed: ${response.status} ${response.statusText}`);
        }
        
        const sdfData = await response.text();
        console.log(`Fallback: Received SDF data length: ${sdfData.length}`);
        
        // Add molecule to viewer
        viewer.addModel(sdfData, 'sdf');
        
        // Style the molecule
        viewer.setStyle({}, {
          stick: {
            radius: 0.25,
            singleBonds: false,
            colorscheme: 'Jmol'
          }
        });
        
        // Add ball and stick representation
        viewer.addStyle({}, {
          sphere: {
            radius: 0.3,
            colorscheme: 'Jmol'
          }
        });
        
        viewer.zoomTo();
        viewer.render();
        
        if (onMoleculeLoad) {
          const molData = Object.values(commonMolecules).find(mol => mol.cid === cid);
          onMoleculeLoad(molData?.name || `Molecule CID: ${cid}`);
        }
        
        setError(null);
        console.log(`Successfully loaded molecule CID: ${cid} using fallback method`);
      }
      
    } catch (err) {
      const errorMessage = `Failed to load molecule: ${err instanceof Error ? err.message : 'Unknown error'}`;
      console.error(errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [viewer, onMoleculeLoad, commonMolecules]);

  useEffect(() => {
    if (viewer && selectedMolecule) {
      loadMolecule(commonMolecules[selectedMolecule as keyof typeof commonMolecules].cid);
    }
  }, [viewer, selectedMolecule, loadMolecule, commonMolecules]);

  // Auto-load molecules when selectedMolecules prop changes
  useEffect(() => {
    if (viewer && selectedMolecules && selectedMolecules.length > 0 && autoLoad) {
      const moleculeToLoad = selectedMolecules[0];
      if (moleculeToLoad.cid) {
        loadMolecule(moleculeToLoad.cid);
      }
    }
  }, [viewer, selectedMolecules, autoLoad, loadMolecule]);

  const handleMoleculeChange = (moleculeKey: string) => {
    setSelectedMolecule(moleculeKey);
  };

  const loadCustomMolecule = () => {
    if (customCID.trim()) {
      loadMolecule(customCID.trim());
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const refreshViewer = () => {
    if (viewer) {
      viewer.zoomTo();
      viewer.render();
    }
  };

  if (loading) {
    return (
      <Box sx={{ 
        height: '100%', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 2
      }}>
        <CircularProgress />
        <Typography variant="body2" color="text.secondary">
          Loading 3D Molecular Viewer...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

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
      {/* Header */}
      <Box sx={{ 
        p: 2, 
        borderBottom: 1, 
        borderColor: 'divider',
        bgcolor: 'background.paper',
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <MoleculeIcon color="primary" />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              3D Molecular Viewer
            </Typography>
            <Chip label="Enhanced CREB PubChem" size="small" color="primary" variant="outlined" />
            <Chip label="3Dmol.js" size="small" color="secondary" variant="outlined" />
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tooltip title="Refresh View">
              <IconButton size="small" onClick={refreshViewer}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            
            <Tooltip title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}>
              <IconButton size="small" onClick={toggleFullscreen}>
                {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Molecule Selection */}
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Select Molecule</InputLabel>
            <Select
              value={selectedMolecule}
              label="Select Molecule"
              onChange={(e) => handleMoleculeChange(e.target.value)}
            >
              {Object.entries(commonMolecules).map(([key, molecule]) => (
                <MenuItem key={key} value={key}>
                  {molecule.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            size="small"
            label="Custom PubChem CID"
            value={customCID}
            onChange={(e) => setCustomCID(e.target.value)}
            placeholder="e.g., 2519"
            sx={{ width: 150 }}
          />

          <Button
            variant="outlined"
            size="small"
            onClick={loadCustomMolecule}
            disabled={!customCID.trim()}
          >
            Load
          </Button>
        </Box>
      </Box>

      {/* 3D Viewer */}
      <Box
        ref={viewerRef}
        sx={{
          flex: 1,
          minHeight: 0,
          bgcolor: theme === 'dark' ? '#000' : '#fff',
          position: 'relative',
          '& canvas': {
            display: 'block !important',
          },
        }}
      />

      {/* Info */}
      <Box sx={{ 
        p: 1, 
        borderTop: 1, 
        borderColor: 'divider',
        bgcolor: 'background.paper',
      }}>
        <Typography variant="caption" color="text.secondary">
          Interactive 3D visualization • Drag to rotate • Scroll to zoom • Right-click for options
        </Typography>
        
        {/* Enhanced Molecule Information from CREB PubChem */}
        {moleculeInfo && (
          <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center' }}>
            <Typography variant="caption" color="primary" sx={{ fontWeight: 600 }}>
              CREB PubChem Data:
            </Typography>
            {moleculeInfo.formula && (
              <Chip 
                label={`Formula: ${moleculeInfo.formula}`}
                size="small" 
                variant="outlined" 
                color="secondary"
              />
            )}
            {moleculeInfo.molecularWeight && (
              <Chip 
                label={`MW: ${moleculeInfo.molecularWeight.toFixed(2)} g/mol`}
                size="small" 
                variant="outlined" 
                color="info"
              />
            )}
            {moleculeInfo.cid && (
              <Chip 
                label={`CID: ${moleculeInfo.cid}`}
                size="small" 
                variant="outlined" 
                color="primary"
              />
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default MolecularViewer;
