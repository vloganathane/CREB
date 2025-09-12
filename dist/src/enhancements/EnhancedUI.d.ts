/**
 * CREB Enhanced UI/UX System
 *
 * Addresses: UI/UX improvements, user interaction, accessibility
 * - Modern, responsive interface
 * - Advanced interaction controls
 * - Accessibility features
 * - Real-time feedback systems
 */
export interface UIConfig {
    theme: 'light' | 'dark' | 'scientific' | 'auto';
    accentColor: string;
    fontSize: 'small' | 'medium' | 'large';
    highContrast: boolean;
    touchOptimized: boolean;
    keyboardNavigation: boolean;
    gestureControls: boolean;
    voiceCommands: boolean;
    screenReaderSupport: boolean;
    colorBlindFriendly: boolean;
    reducedMotion: boolean;
    audioFeedback: boolean;
    compactMode: boolean;
    sidePanelPosition: 'left' | 'right' | 'bottom';
    showTooltips: boolean;
    animatedTransitions: boolean;
}
export interface InteractionEvent {
    type: 'click' | 'hover' | 'drag' | 'pinch' | 'voice' | 'keyboard';
    target: string;
    data: any;
    timestamp: number;
}
export interface FeedbackMessage {
    type: 'info' | 'success' | 'warning' | 'error';
    message: string;
    duration?: number;
    persistent?: boolean;
    actions?: FeedbackAction[];
}
export interface FeedbackAction {
    label: string;
    action: () => void;
    style?: 'primary' | 'secondary' | 'danger';
}
export declare class EnhancedUI {
    private config;
    private container;
    private eventManager;
    private feedbackSystem;
    private accessibilityManager;
    private gestureHandler;
    private voiceController;
    constructor(container: HTMLElement, config?: Partial<UIConfig>);
    private mergeConfig;
    private detectTouchDevice;
    private detectMobileDevice;
    private detectReducedMotion;
    private initializeComponents;
    private createMainInterface;
    private createHeader;
    private createMainContent;
    private createViewerControls;
    private createControlPanel;
    private createAnimationSettings;
    private createVisualizationSettings;
    private createExportOptions;
    private createReactionInfo;
    private createFeedbackArea;
    private createAccessibilityToolbar;
    private setupEventHandlers;
    private setupMainControls;
    private setupAnimationControls;
    private setupAccessibilityControls;
    private setupKeyboardNavigation;
    private setupGestureControls;
    private setupVoiceControls;
    private applyTheme;
    private getFontSizeValue;
    private setupAccessibility;
    showMessage(message: FeedbackMessage): void;
    updateProgress(progress: number): void;
    private formatTime;
    onAnimationRequest?: (equation: string) => void;
    onPlaybackToggle?: () => void;
    onStop?: () => void;
    onSeek?: (progress: number) => void;
    onSpeedChange?: (speed: number) => void;
    private validateInput;
    private handleAnimationRequest;
    private togglePlayback;
    private stopAnimation;
    private seekToProgress;
    private setAnimationSpeed;
    private playAnimation;
    private pauseAnimation;
    private stepAnimation;
    private handleViewerZoom;
    private handleMoleculeSelection;
    private toggleHighContrast;
    private toggleLargeText;
    private toggleReducedMotion;
    private toggleAudioFeedback;
    dispose(): void;
}
//# sourceMappingURL=EnhancedUI.d.ts.map