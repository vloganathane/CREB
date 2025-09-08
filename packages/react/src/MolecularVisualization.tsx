/**
 * React Integration for CREB Molecular Visualization
 */

import React, { useEffect, useRef, useState } from 'react';

// Import types and utilities from CREB core
import type { ElementCount } from '../../../src/types';

// Mock the visualization classes for now
interface MoleculeForVisualization {
  elements: string[];
  formula?: string;
}

interface MolecularVisualizationConfig {
  container: any;
  width?: number;
  height?: number;
  mode?: '2d' | '3d' | 'both';
  interactive?: boolean;
}

class MockMolecularVisualization {
  constructor(config: MolecularVisualizationConfig) {
    console.log('Mock visualization created with config:', config);
  }

  loadMolecule(moleculeData: any) {
    console.log('Loading molecule:', moleculeData);
  }

  updateStyle(options: any) {
    console.log('Updating style:', options);
  }

  exportImage(format: 'png' | 'jpg' = 'png'): string {
    return 'data:image/png;base64,mock-image-data';
  }

  resetView() {
    console.log('Resetting view');
  }

  resize(width: number, height: number) {
    console.log('Resizing to:', { width, height });
  }

  destroy() {
    console.log('Destroying visualization');
  }
}

export interface MolecularViewerProps {
  molecule?: MoleculeForVisualization;
  smiles?: string;
  pdb?: string;
  width?: number;
  height?: number;
  mode?: '2d' | '3d' | 'both';
  style?: React.CSSProperties;
  interactive?: boolean;
  showControls?: boolean;
  onMoleculeLoad?: (molecule: any) => void;
  onError?: (error: Error) => void;
  
  // New animation props
  enableAnimation?: boolean;
  animationDuration?: number;
  animationStyle?: 'smooth' | 'stepped' | 'spring';
  showEnergyProfile?: boolean;
  onAnimationFrame?: (frame: any) => void;
}

/**
 * Component for displaying animated chemical reactions
 */
export interface ReactionAnimationProps {
  equation: string;
  width?: number;
  height?: number;
  duration?: number;
  autoPlay?: boolean;
  showControls?: boolean;
  showEnergyProfile?: boolean;
  style?: React.CSSProperties;
  onAnimationStart?: () => void;
  onAnimationEnd?: () => void;
  onFrameUpdate?: (frame: any) => void;
}

/**
 * React component for molecular visualization
 */
export const MolecularViewer: React.FC<MolecularViewerProps> = ({
  molecule,
  smiles,
  pdb,
  width = 600,
  height = 400,
  mode = 'both',
  style,
  interactive = true,
  showControls = true,
  onMoleculeLoad,
  onError
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visualization, setVisualization] = useState<MockMolecularVisualization | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize visualization
  useEffect(() => {
    if (!containerRef.current) return;

    try {
      const viz = new MockMolecularVisualization({
        container: containerRef.current,
        width,
        height,
        mode,
        interactive
      });

      setVisualization(viz);

      return () => {
        viz.destroy();
      };
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to initialize visualization');
      setError(error.message);
      onError?.(error);
    }
  }, [width, height, mode, interactive]);

  // Load molecule data
  useEffect(() => {
    if (!visualization) return;

    setIsLoading(true);
    setError(null);

    try {
      let moleculeData;

      if (molecule) {
        // Create sample data from molecule
        moleculeData = {
          elements: molecule.elements,
          formula: molecule.formula
        };
      } else if (smiles) {
        moleculeData = { smiles };
      } else if (pdb) {
        moleculeData = { pdb };
      } else {
        moleculeData = { smiles: 'O', name: 'Water' };
      }

      visualization.loadMolecule(moleculeData);
      onMoleculeLoad?.(moleculeData);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to load molecule');
      setError(error.message);
      onError?.(error);
    } finally {
      setIsLoading(false);
    }
  }, [visualization, molecule, smiles, pdb, onMoleculeLoad, onError]);

  // Handle resize
  useEffect(() => {
    if (visualization) {
      visualization.resize(width, height);
    }
  }, [visualization, width, height]);

  const handleExportImage = () => {
    if (visualization) {
      const dataUrl = visualization.exportImage('png');
      const link = document.createElement('a');
      link.download = 'molecule.png';
      link.href = dataUrl;
      link.click();
    }
  };

  const handleResetView = () => {
    if (visualization) {
      visualization.resetView();
    }
  };

  return (
    <div style={{ position: 'relative', ...style }}>
      <div
        ref={containerRef}
        style={{
          width,
          height,
          border: '1px solid #ccc',
          borderRadius: '4px',
          backgroundColor: '#f9f9f9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '14px',
          color: '#666'
        }}
      >
        {isLoading ? 'Loading molecule...' : 
         error ? `Error: ${error}` :
         'Molecular Visualization (Mock)'}
      </div>
      
      {showControls && visualization && !isLoading && !error && (
        <div
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            display: 'flex',
            gap: '8px',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            padding: '8px',
            borderRadius: '4px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
        >
          <button
            onClick={handleResetView}
            style={{
              padding: '4px 8px',
              fontSize: '12px',
              border: '1px solid #ccc',
              borderRadius: '2px',
              backgroundColor: 'white',
              cursor: 'pointer'
            }}
          >
            Reset
          </button>
          <button
            onClick={handleExportImage}
            style={{
              padding: '4px 8px',
              fontSize: '12px',
              border: '1px solid #ccc',
              borderRadius: '2px',
              backgroundColor: 'white',
              cursor: 'pointer'
            }}
          >
            Export
          </button>
        </div>
      )}
    </div>
  );
};

/**
 * Hook for molecular visualization
 */
export const useMolecularVisualization = (config: {
  container: React.RefObject<HTMLElement>;
  width?: number;
  height?: number;
  mode?: '2d' | '3d' | 'both';
}) => {
  const [visualization, setVisualization] = useState<MockMolecularVisualization | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!config.container.current) return;

    const viz = new MockMolecularVisualization({
      container: config.container.current,
      width: config.width || 600,
      height: config.height || 400,
      mode: config.mode || 'both'
    });

    setVisualization(viz);
    setIsReady(true);

    return () => {
      viz.destroy();
      setVisualization(null);
      setIsReady(false);
    };
  }, [config.container, config.width, config.height, config.mode]);

  const loadMolecule = (moleculeData: any) => {
    if (visualization) {
      visualization.loadMolecule(moleculeData);
    }
  };

  const updateStyle = (options: any) => {
    if (visualization) {
      visualization.updateStyle(options);
    }
  };

  const exportImage = (format: 'png' | 'jpg' = 'png') => {
    if (visualization) {
      return visualization.exportImage(format);
    }
    return '';
  };

  const resetView = () => {
    if (visualization) {
      visualization.resetView();
    }
  };

  return {
    visualization,
    isReady,
    loadMolecule,
    updateStyle,
    exportImage,
    resetView
  };
};

/**
 * Component for displaying animated chemical reactions
 */
export const ReactionAnimation: React.FC<ReactionAnimationProps> = ({
  equation,
  width = 800,
  height = 600,
  duration = 8000,
  autoPlay = false,
  showControls = true,
  showEnergyProfile = true,
  style,
  onAnimationStart,
  onAnimationEnd,
  onFrameUpdate
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [animator, setAnimator] = useState<any>(null);

  // Initialize animation when equation changes
  useEffect(() => {
    if (equation && canvasRef.current) {
      initializeAnimation();
    }
  }, [equation]);

  // Auto play when enabled
  useEffect(() => {
    if (autoPlay && animator && !isPlaying) {
      playAnimation();
    }
  }, [autoPlay, animator]);

  const initializeAnimation = async () => {
    if (!canvasRef.current) return;

    setIsLoading(true);
    setError(null);

    try {
      // Dynamically import the ReactionAnimator
      const { ReactionAnimator } = await import('../../../src/visualization/ReactionAnimation');
      
      const animatorInstance = new ReactionAnimator({
        duration,
        fps: 30,
        showEnergyProfile,
        style: 'smooth'
      });

      // Mock equation balancing and animation generation
      console.log(`Initializing animation for: ${equation}`);
      
      setAnimator(animatorInstance);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initialize animation');
    } finally {
      setIsLoading(false);
    }
  };

  const playAnimation = async () => {
    if (!animator || !canvasRef.current || isPlaying) return;

    setIsPlaying(true);
    setProgress(0);
    
    if (onAnimationStart) {
      onAnimationStart();
    }

    try {
      await animator.playAnimation(canvasRef.current, (frame: any) => {
        setProgress(frame.time);
        if (onFrameUpdate) {
          onFrameUpdate(frame);
        }
      });

      if (onAnimationEnd) {
        onAnimationEnd();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Animation playback failed');
    } finally {
      setIsPlaying(false);
    }
  };

  const pauseAnimation = () => {
    if (animator) {
      animator.pauseAnimation();
      setIsPlaying(false);
    }
  };

  const resetAnimation = () => {
    if (animator) {
      animator.resetAnimation();
      setIsPlaying(false);
      setProgress(0);
    }
  };

  return (
    <div style={{ position: 'relative', ...style }}>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{
          border: '1px solid #ccc',
          borderRadius: '8px',
          backgroundColor: 'white',
          display: 'block'
        }}
      />
      
      {showControls && (
        <div
          style={{
            position: 'absolute',
            bottom: '10px',
            left: '10px',
            right: '10px',
            background: 'rgba(255, 255, 255, 0.9)',
            padding: '10px',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}
        >
          <button
            onClick={playAnimation}
            disabled={isLoading || isPlaying}
            style={{
              padding: '6px 12px',
              border: 'none',
              borderRadius: '4px',
              backgroundColor: '#4facfe',
              color: 'white',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            {isLoading ? 'Loading...' : isPlaying ? 'Playing...' : 'Play'}
          </button>
          
          <button
            onClick={pauseAnimation}
            disabled={!isPlaying}
            style={{
              padding: '6px 12px',
              border: 'none',
              borderRadius: '4px',
              backgroundColor: '#ffa502',
              color: 'white',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            Pause
          </button>
          
          <button
            onClick={resetAnimation}
            disabled={isLoading}
            style={{
              padding: '6px 12px',
              border: 'none',
              borderRadius: '4px',
              backgroundColor: '#ff6b6b',
              color: 'white',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            Reset
          </button>
          
          <div style={{ flex: 1, marginLeft: '10px' }}>
            <div style={{ fontSize: '12px', marginBottom: '2px' }}>
              Progress: {Math.round(progress * 100)}%
            </div>
            <div
              style={{
                width: '100%',
                height: '4px',
                backgroundColor: '#e9ecef',
                borderRadius: '2px',
                overflow: 'hidden'
              }}
            >
              <div
                style={{
                  width: `${progress * 100}%`,
                  height: '100%',
                  backgroundColor: '#4facfe',
                  transition: 'width 0.3s ease'
                }}
              />
            </div>
          </div>
        </div>
      )}
      
      {error && (
        <div
          style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            right: '10px',
            background: '#ffebee',
            border: '1px solid #f44336',
            color: '#c62828',
            padding: '8px',
            borderRadius: '4px',
            fontSize: '12px'
          }}
        >
          Error: {error}
        </div>
      )}
    </div>
  );
};

/**
 * Component for displaying chemical reactions (static view)
 */
export interface ReactionViewerProps {
  reactants: MoleculeForVisualization[];
  products: MoleculeForVisualization[];
  width?: number;
  height?: number;
  style?: React.CSSProperties;
}

export const ReactionViewer: React.FC<ReactionViewerProps> = ({
  reactants,
  products,
  width = 800,
  height = 400,
  style
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentStep, setCurrentStep] = useState<'reactants' | 'products'>('reactants');

  useEffect(() => {
    if (!containerRef.current) return;

    const molecules = currentStep === 'reactants' ? reactants : products;
    if (molecules.length === 0) return;

    try {
      console.log('Visualizing reaction step:', currentStep, molecules);
    } catch (error) {
      console.error('Failed to visualize reaction:', error);
    }
  }, [reactants, products, currentStep]);

  return (
    <div style={{ ...style }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '10px',
          gap: '10px'
        }}
      >
        <button
          onClick={() => setCurrentStep('reactants')}
          style={{
            padding: '8px 16px',
            backgroundColor: currentStep === 'reactants' ? '#007bff' : '#f8f9fa',
            color: currentStep === 'reactants' ? 'white' : '#333',
            border: '1px solid #ccc',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Reactants
        </button>
        <span style={{ display: 'flex', alignItems: 'center', fontSize: '18px' }}>
          →
        </span>
        <button
          onClick={() => setCurrentStep('products')}
          style={{
            padding: '8px 16px',
            backgroundColor: currentStep === 'products' ? '#007bff' : '#f8f9fa',
            color: currentStep === 'products' ? 'white' : '#333',
            border: '1px solid #ccc',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Products
        </button>
      </div>
      
      <div
        ref={containerRef}
        style={{
          width,
          height,
          border: '1px solid #ccc',
          borderRadius: '4px',
          backgroundColor: '#f9f9f9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '14px',
          color: '#666'
        }}
      >
        Reaction Visualization (Mock) - {currentStep}
      </div>
    </div>
  );
};

export default {
  MolecularViewer,
  ReactionViewer,
  useMolecularVisualization
};
