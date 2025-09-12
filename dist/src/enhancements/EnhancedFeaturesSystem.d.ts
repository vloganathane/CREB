/**
 * CREB Enhanced Features System
 *
 * Addresses: Additional functionality, enhanced capabilities
 * - Advanced equation parsing and validation
 * - Multi-format import/export
 * - Collaboration features
 * - Educational tools and analytics
 * - Advanced visualization modes
 */
export interface FeatureConfig {
    supportedFormats: string[];
    enableCloudSync: boolean;
    enableCollaboration: boolean;
    showStepByStep: boolean;
    enableQuizMode: boolean;
    provideTutorials: boolean;
    trackProgress: boolean;
    enableVRMode: boolean;
    enableARMode: boolean;
    enable3DPrinting: boolean;
    enableMolecularDynamics: boolean;
    enableAnalytics: boolean;
    provideInsights: boolean;
    enableComparisons: boolean;
    showStatistics: boolean;
}
export interface EquationParseResult {
    isValid: boolean;
    balanced: boolean;
    reactants: MoleculeInfo[];
    products: MoleculeInfo[];
    reactionType: string;
    mechanism: string[];
    thermodynamics: ThermodynamicData;
    errors: string[];
    warnings: string[];
    suggestions: string[];
}
export interface MoleculeInfo {
    formula: string;
    name: string;
    commonNames: string[];
    molecularWeight: number;
    phase: 'solid' | 'liquid' | 'gas' | 'aqueous';
    hazards: string[];
    properties: MolecularProperties;
}
export interface MolecularProperties {
    meltingPoint: number;
    boilingPoint: number;
    density: number;
    solubility: number;
    stability: string;
    toxicity: string;
}
export interface ThermodynamicData {
    deltaH: number;
    deltaS: number;
    deltaG: number;
    activationEnergy: number;
    equilibriumConstant: number;
    temperature: number;
}
export declare class EnhancedFeaturesSystem {
    private config;
    private equationParser;
    private importExportManager;
    private educationalTools;
    private visualizationModes;
    private analyticsEngine;
    private collaborationManager;
    constructor(config?: Partial<FeatureConfig>);
    private mergeConfig;
    parseEquation(equation: string): Promise<EquationParseResult>;
    validateEquation(equation: string): Promise<ValidationResult>;
    private validateChemistry;
    private isValidMolecule;
    private checkReactionFeasibility;
    private identifySafetyIssues;
    private generateSuggestions;
    importReaction(file: File): Promise<ImportResult>;
    exportReaction(reaction: ReactionData, format: string, options?: ExportOptions): Promise<Blob>;
    getSupportedFormats(): FormatInfo[];
    getStepByStepExplanation(equation: string): Promise<StepByStepExplanation>;
    generateQuiz(topic: string, difficulty: string): Promise<Quiz>;
    getTutorial(reactionType: string): Promise<Tutorial>;
    getProgressReport(): ProgressReport;
    enableVRMode(container: HTMLElement): Promise<VRViewer>;
    enableARMode(video: HTMLVideoElement): Promise<ARViewer>;
    generate3DPrintModel(molecules: MoleculeInfo[]): Promise<PrintModel>;
    runMolecularDynamics(system: MolecularSystem, parameters: MDParameters): Promise<MDSimulation>;
    getReactionInsights(equation: string): Promise<ReactionInsights>;
    compareReactions(equations: string[]): Promise<ReactionComparison>;
    getUsageStatistics(): UsageStatistics;
    shareReaction(reaction: ReactionData): Promise<ShareResult>;
    joinCollaborativeSession(sessionId: string): Promise<CollaborativeSession>;
    createCollaborativeSession(): Promise<CollaborativeSession>;
    searchMoleculeDatabase(query: string): Promise<MoleculeInfo[]>;
    getMoleculeInfo(formula: string): Promise<MoleculeInfo | null>;
    predictProducts(reactants: string[], conditions: ReactionConditions): Promise<string[]>;
    suggestReactionConditions(equation: string): Promise<ReactionConditions[]>;
    dispose(): void;
}
interface ValidationResult {
    syntaxValid: boolean;
    chemicallyValid: boolean;
    balanced: boolean;
    feasible: boolean;
    safetyIssues: string[];
    suggestions: string[];
}
interface ImportResult {
    success: boolean;
    reaction: ReactionData | null;
    errors: string[];
    warnings: string[];
}
interface ExportOptions {
    includeMetadata: boolean;
    format3D: boolean;
    compression: 'none' | 'gzip' | 'bzip2';
    quality: 'low' | 'medium' | 'high';
}
interface FormatInfo {
    extension: string;
    name: string;
    description: string;
    canImport: boolean;
    canExport: boolean;
    supports3D: boolean;
}
interface StepByStepExplanation {
    steps: ExplanationStep[];
    totalTime: number;
    difficulty: string;
    concepts: string[];
}
interface ExplanationStep {
    title: string;
    description: string;
    visualization: string;
    duration: number;
    concepts: string[];
}
interface Quiz {
    id: string;
    title: string;
    questions: QuizQuestion[];
    timeLimit: number;
    passingScore: number;
}
interface QuizQuestion {
    id: string;
    type: 'multiple-choice' | 'fill-in' | 'drag-drop' | 'draw';
    question: string;
    options?: string[];
    correctAnswer: string;
    explanation: string;
    points: number;
}
interface Tutorial {
    id: string;
    title: string;
    description: string;
    lessons: TutorialLesson[];
    estimatedTime: number;
    prerequisites: string[];
}
interface TutorialLesson {
    title: string;
    content: string;
    interactiveElements: InteractiveElement[];
    quiz?: QuizQuestion[];
}
interface InteractiveElement {
    type: 'animation' | 'simulation' | 'calculator' | 'model';
    config: any;
}
interface ProgressReport {
    totalSessions: number;
    totalTime: number;
    reactionsStudied: number;
    quizzesTaken: number;
    averageScore: number;
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
}
interface ReactionInsights {
    reactionType: string;
    mechanism: string;
    keyFeatures: string[];
    applicationAreas: string[];
    relatedReactions: string[];
    industrialUses: string[];
    environmentalImpact: EnvironmentalImpact;
    economicFactors: EconomicFactors;
}
interface EnvironmentalImpact {
    carbonFootprint: number;
    wasteProducts: string[];
    sustainability: 'low' | 'medium' | 'high';
    greenAlternatives: string[];
}
interface EconomicFactors {
    costEffectiveness: 'low' | 'medium' | 'high';
    scalability: 'small' | 'pilot' | 'industrial';
    marketValue: number;
    competitiveAdvantages: string[];
}
interface ReactionComparison {
    reactions: ComparedReaction[];
    similarities: string[];
    differences: string[];
    efficiency: EfficiencyComparison;
    recommendations: string[];
}
interface ComparedReaction {
    equation: string;
    type: string;
    yield: number;
    selectivity: number;
    cost: number;
    environmentalScore: number;
}
interface EfficiencyComparison {
    mostEfficient: string;
    leastWasteful: string;
    mostEconomical: string;
    mostSustainable: string;
}
interface UsageStatistics {
    totalReactions: number;
    popularReactionTypes: {
        [key: string]: number;
    };
    averageSessionTime: number;
    userEngagement: number;
    featureUsage: {
        [key: string]: number;
    };
}
interface ReactionData {
    equation: string;
    metadata: any;
    visualization: any;
    conditions: ReactionConditions;
}
interface ReactionConditions {
    temperature: number;
    pressure: number;
    pH: number;
    catalyst: string;
    solvent: string;
    atmosphere: string;
}
interface ShareResult {
    shareId: string;
    shareUrl: string;
    expiresAt: Date;
    permissions: string[];
}
interface CollaborativeSession {
    sessionId: string;
    participants: Participant[];
    reactions: ReactionData[];
    chat: ChatMessage[];
    whiteboard: WhiteboardElement[];
}
interface Participant {
    id: string;
    name: string;
    role: 'owner' | 'editor' | 'viewer';
    isOnline: boolean;
}
interface ChatMessage {
    id: string;
    userId: string;
    message: string;
    timestamp: Date;
    type: 'text' | 'reaction' | 'file';
}
interface WhiteboardElement {
    id: string;
    type: 'text' | 'drawing' | 'molecule' | 'arrow';
    position: {
        x: number;
        y: number;
    };
    data: any;
}
interface VRViewer {
}
interface ARViewer {
}
interface PrintModel {
}
interface MolecularSystem {
}
interface MDParameters {
}
interface MDSimulation {
}
export {};
//# sourceMappingURL=EnhancedFeaturesSystem.d.ts.map