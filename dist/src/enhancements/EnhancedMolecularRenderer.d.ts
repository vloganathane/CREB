/**
 * CREB Enhanced Molecular Rendering System
 *
 * Addresses: Molecular Rendering, Structure Accuracy, Performance
 * - High-quality 3Dmol.js integration
 * - Accurate molecular structure display
 * - Optimized rendering pipeline
 * - Scientific visualization standards
 */
export interface RenderingConfig {
    useExperimentalData: boolean;
    preferConformers: boolean;
    validateGeometry: boolean;
    hydrogenDisplay: 'auto' | 'show' | 'hide';
    antialiasing: boolean;
    shadows: boolean;
    ambientOcclusion: boolean;
    materialQuality: 'low' | 'medium' | 'high' | 'scientific';
    levelOfDetail: boolean;
    cullingEnabled: boolean;
    instancedRendering: boolean;
    maxAtoms: number;
}
export interface MolecularVisualization {
    id: string;
    structure: string;
    format: 'pdb' | 'sdf' | 'mol2' | 'xyz';
    quality: 'experimental' | 'calculated' | 'predicted';
    confidence: number;
    source: string;
    metadata: MolecularMetadata;
}
export interface MolecularMetadata {
    formula: string;
    molecularWeight: number;
    atomCount: number;
    bondCount: number;
    charge: number;
    multiplicity: number;
    energy?: number;
    symmetry?: string;
}
export interface RenderingValidation {
    geometryValid: boolean;
    bondsReasonable: boolean;
    chargeBalance: boolean;
    stereoChemistry: boolean;
    warnings: string[];
    errors: string[];
}
export declare class EnhancedMolecularRenderer {
    private config;
    private pubchemIntegration;
    private mol3dViewer;
    private renderingCache;
    private validationEngine;
    private qualityAssessment;
    private performanceOptimizer;
    private viewerAvailable;
    constructor(container: HTMLElement, config?: Partial<RenderingConfig>);
    private mergeConfig;
    private initializeMol3D;
    private isViewerAvailable;
    private setupEnhancedRendering;
    private setupScientificLighting;
    private setupMaterialProperties;
    private getMaterialSettings;
    private getColorScheme;
    loadMolecule(identifier: string, options?: LoadingOptions): Promise<MolecularVisualization>;
    private loadHighQualityStructure;
    private generate3DCoordinates;
    private generateConformers;
    private validateStructure;
    private createVisualization;
    private extractMetadata;
    private renderMolecule;
    private getEnhancedStyle;
    private addMolecularSurface;
    private applyHydrogenDisplay;
    private applyLevelOfDetail;
    private renderCachedMolecule;
    private generateId;
    renderReaction(reactants: string[], products: string[], options?: ReactionRenderingOptions): Promise<void>;
    private arrangeReactionLayout;
    getQualityReport(moleculeId: string): QualityReport | null;
    dispose(): void;
}
interface LoadingOptions {
    forceRefresh?: boolean;
    strictValidation?: boolean;
    showSurface?: boolean;
    surfaceType?: 'vdw' | 'sas' | 'ms';
    surfaceOpacity?: number;
    surfaceColor?: string;
    render?: boolean;
}
interface ReactionRenderingOptions extends LoadingOptions {
    moleculeSpacing?: number;
    showArrow?: boolean;
    alignmentMode?: 'center' | 'baseline';
}
interface QualityReport {
    overallScore: number;
    accuracyMetrics: any;
    recommendations: string[];
}
export {};
//# sourceMappingURL=EnhancedMolecularRenderer.d.ts.map