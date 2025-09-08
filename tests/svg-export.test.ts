/**
 * SVG Export System Tests
 * Comprehensive testing for SVG molecular structure export
 */

import { SVGRenderer } from '../src/visualization/SVGRenderer';
import { Canvas2DRenderer, type Molecule2D } from '../src/visualization/Canvas2DRenderer';

describe('SVG Export System', () => {
  let mockCanvas: any;
  let mockMolecule: Molecule2D;

  beforeEach(() => {
    // Create mock canvas for Canvas2DRenderer tests
    mockCanvas = {
      width: 600,
      height: 400,
      getContext: () => ({
        fillStyle: '',
        strokeStyle: '',
        lineWidth: 1,
        lineCap: 'round',
        font: '12px Arial',
        textAlign: 'center',
        textBaseline: 'middle',
        fillRect: jest.fn(),
        beginPath: jest.fn(),
        moveTo: jest.fn(),
        lineTo: jest.fn(),
        arc: jest.fn(),
        fill: jest.fn(),
        stroke: jest.fn(),
        fillText: jest.fn()
      }),
      toDataURL: jest.fn((type = 'image/png') => {
        if (type === 'image/jpeg' || type === 'image/jpg') {
          return 'data:image/jpeg;base64,mock';
        }
        return 'data:image/png;base64,mock';
      }),
      style: {}
    };

    // Create mock molecule data
    mockMolecule = {
      atoms: [
        { element: 'O', position: { x: 100, y: 100 }, bonds: [0, 1] },
        { element: 'H', position: { x: 80, y: 120 }, bonds: [0] },
        { element: 'H', position: { x: 120, y: 120 }, bonds: [0] }
      ],
      bonds: [
        { atom1: 0, atom2: 1, order: 1, type: 'single' },
        { atom1: 0, atom2: 2, order: 1, type: 'single' }
      ]
    };
  });

  describe('SVGRenderer', () => {
    let svgRenderer: SVGRenderer;

    beforeEach(() => {
      svgRenderer = new SVGRenderer({
        width: 600,
        height: 400,
        backgroundColor: '#ffffff',
        includeStyles: true,
        includeInteractivity: true
      });
    });

    test('should create SVGRenderer with default config', () => {
      const renderer = new SVGRenderer();
      expect(renderer).toBeInstanceOf(SVGRenderer);
    });

    test('should load molecule correctly', () => {
      svgRenderer.loadMolecule(mockMolecule);
      expect(svgRenderer.getMolecule()).toBe(mockMolecule);
    });

    test('should export basic SVG', () => {
      svgRenderer.loadMolecule(mockMolecule);
      const svg = svgRenderer.exportSVG();
      
      expect(svg).toContain('<svg');
      expect(svg).toContain('width="600"');
      expect(svg).toContain('height="400"');
      expect(svg).toContain('xmlns="http://www.w3.org/2000/svg"');
      expect(svg).toContain('</svg>');
    });

    test('should include metadata when requested', () => {
      svgRenderer.loadMolecule(mockMolecule);
      const svg = svgRenderer.exportSVG({ includeMetadata: true });
      
      expect(svg).toContain('<title>');
      expect(svg).toContain('<desc>');
      expect(svg).toContain('<metadata>');
      expect(svg).toContain('<creb:atomCount>3</creb:atomCount>');
      expect(svg).toContain('<creb:bondCount>2</creb:bondCount>');
    });

    test('should include interactive elements when requested', () => {
      svgRenderer.loadMolecule(mockMolecule);
      const svg = svgRenderer.exportSVG({ interactive: true });
      
      expect(svg).toContain('data-element="O"');
      expect(svg).toContain('data-atom-id="0"');
      expect(svg).toContain(':hover');
      expect(svg).toContain('cursor: pointer');
    });

    test('should include animations when requested', () => {
      svgRenderer.loadMolecule(mockMolecule);
      const svg = svgRenderer.exportSVG({ animations: true });
      
      expect(svg).toContain('@keyframes');
      expect(svg).toContain('animation:');
    });

    test('should render atoms correctly', () => {
      svgRenderer.loadMolecule(mockMolecule);
      const svg = svgRenderer.exportSVG();
      
      // Should contain atoms
      expect(svg).toContain('<g id="atoms">');
      expect(svg).toContain('class="atom-circle"');
      expect(svg).toContain('class="atom-label"');
      
      // Should contain elements
      expect(svg).toContain('>O</text>');
      expect(svg).toContain('>H</text>');
    });

    test('should render bonds correctly', () => {
      svgRenderer.loadMolecule(mockMolecule);
      const svg = svgRenderer.exportSVG();
      
      expect(svg).toContain('<g id="bonds">');
      expect(svg).toContain('<line');
      expect(svg).toContain('class="bond-line bond-single"');
    });

    test('should handle different bond orders', () => {
      const moleculeWithDoubleBond: Molecule2D = {
        atoms: [
          { element: 'C', position: { x: 100, y: 100 }, bonds: [0] },
          { element: 'C', position: { x: 150, y: 100 }, bonds: [0] }
        ],
        bonds: [
          { atom1: 0, atom2: 1, order: 2, type: 'double' }
        ]
      };

      svgRenderer.loadMolecule(moleculeWithDoubleBond);
      const svg = svgRenderer.exportSVG();
      
      expect(svg).toContain('bond-double');
    });

    test('should generate empty SVG when no molecule loaded', () => {
      const svg = svgRenderer.exportSVG();
      
      expect(svg).toContain('<svg');
      expect(svg).toContain('2D Molecular Structure');
      expect(svg).toContain('Load a molecule to visualize');
    });

    test('should use correct atom colors', () => {
      svgRenderer.loadMolecule(mockMolecule);
      const svg = svgRenderer.exportSVG();
      
      // Oxygen should be red
      expect(svg).toContain('fill="#ff0d0d"');
      // Hydrogen should be white
      expect(svg).toContain('fill="#ffffff"');
    });

    test('should calculate contrasting text colors', () => {
      svgRenderer.loadMolecule(mockMolecule);
      const svg = svgRenderer.exportSVG();
      
      // White atoms should have black text
      expect(svg).toContain('fill="#000000"');
      // Dark atoms should have white text
      expect(svg).toContain('fill="#ffffff"');
    });

    test('should update configuration correctly', () => {
      svgRenderer.updateConfig({
        backgroundColor: '#f0f0f0',
        atomRadius: 25
      });

      svgRenderer.loadMolecule(mockMolecule);
      const svg = svgRenderer.exportSVG();
      
      expect(svg).toContain('fill="#f0f0f0"');
      expect(svg).toContain('r="25.00"');
    });
  });

  describe('Canvas2DRenderer SVG Export', () => {
    let renderer: Canvas2DRenderer;

    beforeEach(() => {
      renderer = new Canvas2DRenderer(mockCanvas);
    });

    test('should export PNG by default', () => {
      const result = renderer.exportImage('png');
      expect(result).toBe('data:image/png;base64,mock');
    });

    test('should export JPG when requested', () => {
      const result = renderer.exportImage('jpg');
      expect(result).toBe('data:image/jpeg;base64,mock');
    });

    test('should export SVG when requested', () => {
      renderer.loadMolecule(mockMolecule);
      const result = renderer.exportImage('svg');
      
      expect(result).toContain('<svg');
      expect(result).toContain('xmlns="http://www.w3.org/2000/svg"');
    });

    test('should export SVG with advanced options', () => {
      renderer.loadMolecule(mockMolecule);
      const svg = renderer.exportSVG({
        interactive: true,
        includeMetadata: true,
        animations: true
      });
      
      expect(svg).toContain('class="atom-group"');
      expect(svg).toContain('<atomCount>');
      expect(svg).toContain('Generated by CREB-JS');
    });

    test('should handle empty molecule for SVG export', () => {
      const svg = renderer.exportSVG();
      
      expect(svg).toContain('<svg');
      expect(svg).toContain('2D Molecular Structure');
    });
  });

  describe('SVG Content Validation', () => {
    let svgRenderer: SVGRenderer;

    beforeEach(() => {
      svgRenderer = new SVGRenderer();
      svgRenderer.loadMolecule(mockMolecule);
    });

    test('should generate valid XML', () => {
      const svg = svgRenderer.exportSVG();
      
      // Basic XML structure checks
      expect(svg).toMatch(/^<svg/);
      expect(svg).toMatch(/<\/svg>$/);
      
      // No unclosed tags
      const openTags = (svg.match(/<[^\/][^>]*>/g) || []).length;
      const closeTags = (svg.match(/<\/[^>]*>/g) || []).length;
      const selfClosing = (svg.match(/<[^>]*\/>/g) || []).length;
      
      expect(openTags).toBe(closeTags + selfClosing);
    });

    test('should have proper SVG namespace', () => {
      const svg = svgRenderer.exportSVG();
      expect(svg).toContain('xmlns="http://www.w3.org/2000/svg"');
    });

    test('should have valid viewBox', () => {
      const svg = svgRenderer.exportSVG();
      expect(svg).toMatch(/viewBox="\d+ \d+ \d+ \d+"/);
    });

    test('should have proper CSS in defs', () => {
      const svg = svgRenderer.exportSVG();
      
      expect(svg).toContain('<defs>');
      expect(svg).toContain('<style type="text/css">');
      expect(svg).toContain('</style>');
      expect(svg).toContain('</defs>');
    });

    test('should have structured groups', () => {
      const svg = svgRenderer.exportSVG();
      
      expect(svg).toContain('<g id="bonds">');
      expect(svg).toContain('<g id="atoms">');
      expect(svg).toContain('</g>');
    });
  });

  describe('Export Performance', () => {
    test('should export quickly for small molecules', () => {
      const svgRenderer = new SVGRenderer();
      svgRenderer.loadMolecule(mockMolecule);
      
      const startTime = performance.now();
      const svg = svgRenderer.exportSVG();
      const endTime = performance.now();
      
      expect(endTime - startTime).toBeLessThan(100); // Should complete in <100ms
      expect(svg.length).toBeGreaterThan(100); // Should generate substantial content
    });

    test('should handle larger molecules efficiently', () => {
      // Create a larger molecule (benzene ring)
      const largeMolecule: Molecule2D = {
        atoms: Array.from({ length: 20 }, (_, i) => ({
          element: i % 2 === 0 ? 'C' : 'H',
          position: { x: 100 + i * 20, y: 100 + Math.sin(i) * 20 },
          bonds: []
        })),
        bonds: Array.from({ length: 19 }, (_, i) => ({
          atom1: i,
          atom2: i + 1,
          order: 1,
          type: 'single'
        }))
      };

      const svgRenderer = new SVGRenderer();
      svgRenderer.loadMolecule(largeMolecule);
      
      const startTime = performance.now();
      const svg = svgRenderer.exportSVG({ interactive: true, includeMetadata: true });
      const endTime = performance.now();
      
      expect(endTime - startTime).toBeLessThan(500); // Should complete in <500ms
      expect(svg).toContain('<creb:atomCount>20</creb:atomCount>');
      expect(svg).toContain('<creb:bondCount>19</creb:bondCount>');
    });
  });

  describe('File Download', () => {
    let svgRenderer: SVGRenderer;
    let mockCreateElement: jest.SpyInstance;
    let mockCreateObjectURL: jest.SpyInstance;
    let mockRevokeObjectURL: jest.SpyInstance;

    beforeEach(() => {
      svgRenderer = new SVGRenderer();
      
      // Mock global objects for DOM operations
      global.document = {
        createElement: jest.fn()
      } as any;
      
      global.URL = {
        createObjectURL: jest.fn(),
        revokeObjectURL: jest.fn()
      } as any;
      
      // Mock DOM methods
      const mockLink = {
        href: '',
        download: '',
        click: jest.fn()
      };

      mockCreateElement = jest.spyOn(global.document, 'createElement').mockReturnValue(mockLink as any);
      mockCreateObjectURL = jest.spyOn(global.URL, 'createObjectURL').mockReturnValue('blob:mock-url');
      mockRevokeObjectURL = jest.spyOn(global.URL, 'revokeObjectURL').mockImplementation();
    });

    afterEach(() => {
      if (mockCreateElement) mockCreateElement.mockRestore();
      if (mockCreateObjectURL) mockCreateObjectURL.mockRestore();
      if (mockRevokeObjectURL) mockRevokeObjectURL.mockRestore();
      
      // Clean up global mocks
      delete (global as any).document;
      delete (global as any).URL;
    });

    test('should create download link for SVG file', () => {
      svgRenderer.loadMolecule(mockMolecule);
      svgRenderer.exportAsFile('test-molecule.svg');
      
      expect(mockCreateElement).toHaveBeenCalledWith('a');
      expect(mockCreateObjectURL).toHaveBeenCalled();
      expect(mockRevokeObjectURL).toHaveBeenCalled();
    });
  });

  describe('Integration Tests', () => {
    test('should work with CREB equation balancing data', () => {
      // Mock CREB equation result data
      const mockCrebData = {
        equation: 'H2 + O2 -> H2O',
        balanced: '2H2 + O2 -> 2H2O',
        molecules: [
          { formula: 'H2O', atoms: mockMolecule.atoms, bonds: mockMolecule.bonds }
        ]
      };

      const svgRenderer = new SVGRenderer();
      svgRenderer.loadMolecule(mockCrebData.molecules[0] as Molecule2D);
      const svg = svgRenderer.exportSVG({ includeMetadata: true });
      
      expect(svg).toContain('<creb:atomCount>3</creb:atomCount>');
      expect(svg).toContain('Generated by CREB-JS');
    });

    test('should integrate with React component props', () => {
      // Mock React component props structure
      const mockReactProps = {
        molecule: mockMolecule,
        exportFormat: 'svg' as const,
        interactive: true,
        showMetadata: true
      };

      const svgRenderer = new SVGRenderer({
        includeInteractivity: mockReactProps.interactive
      });
      
      svgRenderer.loadMolecule(mockReactProps.molecule);
      const svg = svgRenderer.exportSVG({
        interactive: mockReactProps.interactive,
        includeMetadata: mockReactProps.showMetadata
      });
      
      expect(svg).toContain('cursor: pointer');
      expect(svg).toContain('<metadata>');
    });
  });
});
