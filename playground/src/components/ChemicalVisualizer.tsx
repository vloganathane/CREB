import { Atom, FlaskConical, Eye } from 'lucide-react';
import type { ExecutionResult } from '../types';

interface ChemicalVisualizerProps {
  results: ExecutionResult | null;
}

export function ChemicalVisualizer({ results }: ChemicalVisualizerProps) {
  if (!results || !results.success) {
    return (
      <div className="chemical-visualizer empty">
        <div className="empty-state">
          <FlaskConical size={48} className="empty-icon" />
          <p>Run code with chemical data to see visualization</p>
        </div>
      </div>
    );
  }

  // Mock visualization for now - will integrate with real CREB-JS later
  const mockMolecule = {
    formula: 'H2O',
    name: 'Water',
    molecularWeight: 18.015,
    structure: '2D/3D visualization will appear here'
  };

  return (
    <div className="chemical-visualizer">
      <div className="visualizer-tabs">
        <button className="tab active">
          <Atom size={16} />
          2D Structure
        </button>
        <button className="tab">
          <Eye size={16} />
          3D Model
        </button>
      </div>
      
      <div className="visualization-content">
        <div className="molecule-info">
          <h3>{mockMolecule.name}</h3>
          <p>Formula: {mockMolecule.formula}</p>
          <p>Molecular Weight: {mockMolecule.molecularWeight} g/mol</p>
        </div>
        
        <div className="structure-viewer">
          <div className="placeholder-structure">
            <FlaskConical size={64} />
            <p>2D/3D molecular structure</p>
            <p className="placeholder-text">
              {mockMolecule.structure}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
