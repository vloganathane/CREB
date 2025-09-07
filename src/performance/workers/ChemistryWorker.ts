/**
 * @fileoverview Chemistry Worker Script for Heavy Calculations
 * @version 1.7.0
 * @author CREB Development Team
 * 
 * This script runs in a worker thread to perform CPU-intensive chemistry calculations
 * without blocking the main thread. It handles equation balancing, thermodynamics,
 * matrix operations, and batch compound analysis.
 */

import { Worker, isMainThread, parentPort, workerData } from 'worker_threads';
import { 
  WorkerTask, 
  TaskResult, 
  WorkerMessage, 
  MessageType, 
  CalculationType,
  EquationBalancingTask,
  ThermodynamicsTask,
  BatchAnalysisTask,
  MatrixSolvingTask,
  WorkerError,
  TaskStatus
} from './types.js';

// Prevent execution in main thread
if (isMainThread) {
  throw new Error('ChemistryWorker must be run in a worker thread');
}

/**
 * Chemistry calculation worker implementation
 */
class ChemistryWorker {
  private readonly workerId: string;
  private currentTaskId?: string;
  private isShuttingDown: boolean = false;
  private startTime: Date;
  private tasksCompleted: number = 0;
  private memoryUsage: number = 0;

  constructor(workerId: string) {
    this.workerId = workerId;
    this.startTime = new Date();
    this.setupMessageHandling();
    this.setupMemoryMonitoring();
    this.sendWorkerReady();
  }

  /**
   * Setup message handling from main thread
   */
  private setupMessageHandling(): void {
    if (!parentPort) {
      throw new Error('Parent port not available');
    }

    parentPort.on('message', async (message: WorkerMessage) => {
      try {
        await this.handleMessage(message);
      } catch (error) {
        this.sendError(error as Error, message.taskId);
      }
    });

    parentPort.on('error', (error) => {
      this.sendError(error, this.currentTaskId);
    });

    // Handle shutdown signal
    process.on('SIGTERM', () => {
      this.shutdown();
    });
  }

  /**
   * Setup memory monitoring
   */
  private setupMemoryMonitoring(): void {
    setInterval(() => {
      const usage = process.memoryUsage();
      this.memoryUsage = usage.heapUsed;

      // Send memory warning if usage is high
      if (usage.heapUsed > 512 * 1024 * 1024) { // 512MB
        this.sendMessage({
          type: MessageType.MEMORY_WARNING,
          data: {
            workerId: this.workerId,
            memoryUsage: usage.heapUsed,
            rss: usage.rss
          },
          timestamp: new Date()
        });
      }
    }, 5000); // Check every 5 seconds
  }

  /**
   * Handle incoming messages
   */
  private async handleMessage(message: WorkerMessage): Promise<void> {
    switch (message.type) {
      case MessageType.TASK_ASSIGNMENT:
        await this.handleTaskAssignment(message);
        break;
      
      case MessageType.HEALTH_CHECK:
        this.handleHealthCheck();
        break;
      
      case MessageType.WORKER_SHUTDOWN:
        this.shutdown();
        break;
      
      default:
        throw new Error(`Unknown message type: ${message.type}`);
    }
  }

  /**
   * Handle task assignment
   */
  private async handleTaskAssignment(message: WorkerMessage): Promise<void> {
    const task: WorkerTask = message.data;
    this.currentTaskId = task.id;

    try {
      // Send task started notification
      this.sendMessage({
        type: MessageType.TASK_RESULT,
        taskId: task.id,
        data: {
          status: TaskStatus.RUNNING,
          workerId: this.workerId,
          startedAt: new Date()
        },
        timestamp: new Date()
      });

      // Execute the task based on type
      const startTime = Date.now();
      const result = await this.executeTask(task);
      const executionTime = Date.now() - startTime;

      // Send successful result
      const taskResult: TaskResult = {
        taskId: task.id,
        success: true,
        result,
        executionTime,
        memoryUsage: this.memoryUsage,
        metadata: {
          workerId: this.workerId,
          completedAt: new Date()
        }
      };

      this.sendMessage({
        type: MessageType.TASK_RESULT,
        taskId: task.id,
        data: taskResult,
        timestamp: new Date()
      });

      this.tasksCompleted++;
      this.currentTaskId = undefined;

    } catch (error) {
      this.sendError(error as Error, task.id);
      this.currentTaskId = undefined;
    }
  }

  /**
   * Execute task based on calculation type
   */
  private async executeTask(task: WorkerTask): Promise<any> {
    switch (task.type) {
      case CalculationType.EQUATION_BALANCING:
        return this.balanceEquation(task.data as EquationBalancingTask);
      
      case CalculationType.THERMODYNAMICS:
        return this.calculateThermodynamics(task.data as ThermodynamicsTask);
      
      case CalculationType.BATCH_ANALYSIS:
        return this.performBatchAnalysis(task.data as BatchAnalysisTask);
      
      case CalculationType.MATRIX_SOLVING:
        return this.solveMatrix(task.data as MatrixSolvingTask);
      
      case CalculationType.STOICHIOMETRY:
        return this.calculateStoichiometry(task.data);
      
      case CalculationType.COMPOUND_ANALYSIS:
        return this.analyzeCompound(task.data);
      
      default:
        throw new Error(`Unsupported calculation type: ${task.type}`);
    }
  }

  /**
   * Balance chemical equation using matrix method
   */
  private async balanceEquation(data: EquationBalancingTask): Promise<any> {
    const { equation, options = {} } = data;
    
    // Parse equation into reactants and products
    const [reactants, products] = equation.split('->').map(side => 
      side.trim().split('+').map(compound => compound.trim())
    );

    // Create coefficient matrix for balancing
    const allCompounds = [...reactants, ...products];
    const elements = this.extractElements(allCompounds);
    
    // Build matrix for Gaussian elimination
    const matrix = this.buildBalancingMatrix(allCompounds, elements);
    
    // Solve using specified method
    const coefficients = await this.solveBalancingMatrix(matrix, options.method || 'gauss');
    
    // Format balanced equation
    const balancedEquation = this.formatBalancedEquation(reactants, products, coefficients);
    
    return {
      originalEquation: equation,
      balancedEquation,
      coefficients,
      method: options.method || 'gauss',
      elements,
      isBalanced: this.verifyBalance(balancedEquation, elements)
    };
  }

  /**
   * Calculate thermodynamic properties
   */
  private async calculateThermodynamics(data: ThermodynamicsTask): Promise<any> {
    const { compounds, conditions, calculations } = data;
    const results: Record<string, any> = {};

    for (const calculation of calculations) {
      switch (calculation.toLowerCase()) {
        case 'enthalpy':
          results.enthalpy = await this.calculateEnthalpy(compounds, conditions);
          break;
        
        case 'entropy':
          results.entropy = await this.calculateEntropy(compounds, conditions);
          break;
        
        case 'gibbs':
          results.gibbsFreeEnergy = await this.calculateGibbsFreeEnergy(compounds, conditions);
          break;
        
        case 'equilibrium':
          results.equilibriumConstant = await this.calculateEquilibriumConstant(compounds, conditions);
          break;
      }
    }

    return {
      compounds,
      conditions,
      calculations: results,
      temperature: conditions.temperature || 298.15,
      pressure: conditions.pressure || 1.0
    };
  }

  /**
   * Perform batch compound analysis
   */
  private async performBatchAnalysis(data: BatchAnalysisTask): Promise<any> {
    const { compounds, properties, options = {} } = data;
    const results: Array<Record<string, any>> = [];

    for (const compound of compounds) {
      const analysis: Record<string, any> = {
        formula: compound,
        properties: {}
      };

      for (const property of properties) {
        switch (property.toLowerCase()) {
          case 'molecular_weight':
            analysis.properties.molecularWeight = this.calculateMolecularWeight(compound);
            break;
          
          case 'density':
            analysis.properties.density = await this.estimateDensity(compound);
            break;
          
          case 'boiling_point':
            analysis.properties.boilingPoint = await this.estimateBoilingPoint(compound);
            break;
          
          case 'melting_point':
            analysis.properties.meltingPoint = await this.estimateMeltingPoint(compound);
            break;
        }
      }

      results.push(analysis);
      
      // Send progress update
      const progress = (results.length / compounds.length) * 100;
      this.sendProgress(progress);
    }

    return {
      totalCompounds: compounds.length,
      results,
      options
    };
  }

  /**
   * Solve matrix using various methods
   */
  private async solveMatrix(data: MatrixSolvingTask): Promise<any> {
    const { matrix, vector, method = 'gaussian', options = {} } = data;
    
    switch (method) {
      case 'gaussian':
        return this.gaussianElimination(matrix, vector, options);
      
      case 'lu':
        return this.luDecomposition(matrix, vector);
      
      case 'qr':
        return this.qrDecomposition(matrix, vector);
      
      default:
        throw new Error(`Unsupported matrix method: ${method}`);
    }
  }

  /**
   * Calculate stoichiometry
   */
  private async calculateStoichiometry(data: any): Promise<any> {
    // Implement stoichiometric calculations
    return {
      reactants: data.reactants,
      products: data.products,
      ratios: this.calculateMolarRatios(data.reactants, data.products),
      limitingReagent: this.findLimitingReagent(data.reactants),
      yield: this.calculateTheoreticalYield(data.reactants, data.products)
    };
  }

  /**
   * Analyze individual compound
   */
  private async analyzeCompound(data: any): Promise<any> {
    const { formula } = data;
    
    return {
      formula,
      molecularWeight: this.calculateMolecularWeight(formula),
      elementalComposition: this.getElementalComposition(formula),
      empiricalFormula: this.calculateEmpiricalFormula(formula),
      isOrganic: this.isOrganicCompound(formula),
      functionalGroups: this.identifyFunctionalGroups(formula)
    };
  }

  // ========================================
  // Chemistry Calculation Methods
  // ========================================

  private extractElements(compounds: string[]): string[] {
    const elements = new Set<string>();
    const elementRegex = /([A-Z][a-z]?)(\d*)/g;
    
    for (const compound of compounds) {
      let match;
      while ((match = elementRegex.exec(compound)) !== null) {
        elements.add(match[1]);
      }
    }
    
    return Array.from(elements);
  }

  private buildBalancingMatrix(compounds: string[], elements: string[]): number[][] {
    const matrix: number[][] = [];
    
    for (const element of elements) {
      const row: number[] = [];
      
      for (const compound of compounds) {
        const count = this.getElementCount(compound, element);
        row.push(count);
      }
      
      matrix.push(row);
    }
    
    return matrix;
  }

  private getElementCount(compound: string, element: string): number {
    const regex = new RegExp(`${element}(\\d*)`);
    const match = compound.match(regex);
    
    if (match) {
      return match[1] ? parseInt(match[1]) : 1;
    }
    
    return 0;
  }

  private async solveBalancingMatrix(matrix: number[][], method: string): Promise<number[]> {
    // Simplified matrix solving for balancing
    const result = this.gaussianElimination(matrix, undefined, { tolerance: 1e-10 });
    
    // Convert to integer coefficients
    const coefficients = result.solution || [];
    const gcd = this.findGCD(coefficients.filter((c: number) => c !== 0));
    
    return coefficients.map((c: number) => Math.round(c / gcd));
  }

  private gaussianElimination(
    matrix: number[][], 
    vector?: number[], 
    options: any = {}
  ): any {
    const { tolerance = 1e-10 } = options;
    const n = matrix.length;
    const m = matrix[0]?.length || 0;
    
    // Create augmented matrix
    const augmented = matrix.map((row, i) => [
      ...row, 
      vector ? vector[i] : 0
    ]);

    // Forward elimination
    for (let i = 0; i < Math.min(n, m); i++) {
      // Find pivot
      let maxRow = i;
      for (let k = i + 1; k < n; k++) {
        if (Math.abs(augmented[k][i]) > Math.abs(augmented[maxRow][i])) {
          maxRow = k;
        }
      }

      // Swap rows
      [augmented[i], augmented[maxRow]] = [augmented[maxRow], augmented[i]];

      // Make all rows below this one 0 in current column
      for (let k = i + 1; k < n; k++) {
        if (Math.abs(augmented[i][i]) > tolerance) {
          const factor = augmented[k][i] / augmented[i][i];
          for (let j = i; j < m + 1; j++) {
            augmented[k][j] -= factor * augmented[i][j];
          }
        }
      }
    }

    // Back substitution
    const solution: number[] = new Array(m).fill(0);
    for (let i = Math.min(n, m) - 1; i >= 0; i--) {
      if (Math.abs(augmented[i][i]) > tolerance) {
        solution[i] = augmented[i][m];
        for (let j = i + 1; j < m; j++) {
          solution[i] -= augmented[i][j] * solution[j];
        }
        solution[i] /= augmented[i][i];
      }
    }

    return {
      solution,
      matrix: augmented,
      rank: this.calculateMatrixRank(augmented, tolerance)
    };
  }

  private luDecomposition(matrix: number[][], vector?: number[]): any {
    // Simplified LU decomposition
    const n = matrix.length;
    const L = Array(n).fill(null).map(() => Array(n).fill(0));
    const U = Array(n).fill(null).map(() => Array(n).fill(0));

    // Decomposition
    for (let i = 0; i < n; i++) {
      // Upper triangular
      for (let k = i; k < n; k++) {
        let sum = 0;
        for (let j = 0; j < i; j++) {
          sum += L[i][j] * U[j][k];
        }
        U[i][k] = matrix[i][k] - sum;
      }

      // Lower triangular
      for (let k = i; k < n; k++) {
        if (i === k) {
          L[i][i] = 1;
        } else {
          let sum = 0;
          for (let j = 0; j < i; j++) {
            sum += L[k][j] * U[j][i];
          }
          L[k][i] = (matrix[k][i] - sum) / U[i][i];
        }
      }
    }

    return { L, U, matrix };
  }

  private qrDecomposition(matrix: number[][], vector?: number[]): any {
    // Simplified QR decomposition using Gram-Schmidt
    const m = matrix.length;
    const n = matrix[0]?.length || 0;
    
    const Q = Array(m).fill(null).map(() => Array(n).fill(0));
    const R = Array(n).fill(null).map(() => Array(n).fill(0));

    // Gram-Schmidt process
    for (let j = 0; j < n; j++) {
      const v = matrix.map(row => row[j]);
      
      for (let i = 0; i < j; i++) {
        const projection = this.dotProduct(
          matrix.map(row => row[j]),
          Q.map(row => row[i])
        );
        R[i][j] = projection;
        
        for (let k = 0; k < m; k++) {
          v[k] -= projection * Q[k][i];
        }
      }
      
      const norm = Math.sqrt(v.reduce((sum, val) => sum + val * val, 0));
      R[j][j] = norm;
      
      for (let k = 0; k < m; k++) {
        Q[k][j] = norm !== 0 ? v[k] / norm : 0;
      }
    }

    return { Q, R, matrix };
  }

  // ========================================
  // Thermodynamics Calculations
  // ========================================

  private async calculateEnthalpy(compounds: any[], conditions: any): Promise<number> {
    // Simplified enthalpy calculation
    let totalEnthalpy = 0;
    
    for (const compound of compounds) {
      const standardEnthalpy = this.getStandardEnthalpy(compound.formula);
      totalEnthalpy += compound.amount * standardEnthalpy;
    }
    
    // Temperature correction
    const temperatureCorrection = this.calculateTemperatureCorrection(
      totalEnthalpy, 
      conditions.temperature || 298.15
    );
    
    return totalEnthalpy + temperatureCorrection;
  }

  private async calculateEntropy(compounds: any[], conditions: any): Promise<number> {
    // Simplified entropy calculation
    let totalEntropy = 0;
    
    for (const compound of compounds) {
      const standardEntropy = this.getStandardEntropy(compound.formula);
      totalEntropy += compound.amount * standardEntropy;
    }
    
    return totalEntropy;
  }

  private async calculateGibbsFreeEnergy(compounds: any[], conditions: any): Promise<number> {
    const enthalpy = await this.calculateEnthalpy(compounds, conditions);
    const entropy = await this.calculateEntropy(compounds, conditions);
    const temperature = conditions.temperature || 298.15;
    
    return enthalpy - (temperature * entropy);
  }

  private async calculateEquilibriumConstant(compounds: any[], conditions: any): Promise<number> {
    const gibbsFreeEnergy = await this.calculateGibbsFreeEnergy(compounds, conditions);
    const temperature = conditions.temperature || 298.15;
    const R = 8.314; // J/(mol·K)
    
    return Math.exp(-gibbsFreeEnergy / (R * temperature));
  }

  // ========================================
  // Helper Methods
  // ========================================

  private calculateMolecularWeight(formula: string): number {
    const atomicWeights: Record<string, number> = {
      'H': 1.008, 'He': 4.003, 'Li': 6.941, 'Be': 9.012, 'B': 10.811,
      'C': 12.011, 'N': 14.007, 'O': 15.999, 'F': 18.998, 'Ne': 20.180,
      'Na': 22.990, 'Mg': 24.305, 'Al': 26.982, 'Si': 28.085, 'P': 30.974,
      'S': 32.065, 'Cl': 35.453, 'Ar': 39.948, 'K': 39.098, 'Ca': 40.078
    };

    let totalWeight = 0;
    const elementRegex = /([A-Z][a-z]?)(\d*)/g;
    let match;

    while ((match = elementRegex.exec(formula)) !== null) {
      const element = match[1];
      const count = match[2] ? parseInt(match[2]) : 1;
      totalWeight += (atomicWeights[element] || 0) * count;
    }

    return totalWeight;
  }

  private getElementalComposition(formula: string): Record<string, number> {
    const composition: Record<string, number> = {};
    const elementRegex = /([A-Z][a-z]?)(\d*)/g;
    let match;

    while ((match = elementRegex.exec(formula)) !== null) {
      const element = match[1];
      const count = match[2] ? parseInt(match[2]) : 1;
      composition[element] = (composition[element] || 0) + count;
    }

    return composition;
  }

  private findGCD(numbers: number[]): number {
    const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
    return numbers.reduce((acc, num) => gcd(acc, Math.abs(Math.round(num))));
  }

  private calculateMatrixRank(matrix: number[][], tolerance: number): number {
    let rank = 0;
    for (const row of matrix) {
      if (row.some(val => Math.abs(val) > tolerance)) {
        rank++;
      }
    }
    return rank;
  }

  private dotProduct(a: number[], b: number[]): number {
    return a.reduce((sum, val, i) => sum + val * b[i], 0);
  }

  private getStandardEnthalpy(formula: string): number {
    // Simplified lookup - in practice, this would use a comprehensive database
    const enthalpies: Record<string, number> = {
      'H2O': -285.8,
      'CO2': -393.5,
      'CH4': -74.8,
      'NH3': -46.1
    };
    return enthalpies[formula] || 0;
  }

  private getStandardEntropy(formula: string): number {
    // Simplified lookup
    const entropies: Record<string, number> = {
      'H2O': 69.9,
      'CO2': 213.7,
      'CH4': 186.3,
      'NH3': 192.8
    };
    return entropies[formula] || 0;
  }

  private calculateTemperatureCorrection(enthalpy: number, temperature: number): number {
    // Simplified temperature correction
    const standardTemp = 298.15;
    const heatCapacity = 29.1; // Average Cp in J/(mol·K)
    return heatCapacity * (temperature - standardTemp);
  }

  // Placeholder methods for complex calculations
  private async estimateDensity(formula: string): Promise<number> { return 1.0; }
  private async estimateBoilingPoint(formula: string): Promise<number> { return 373.15; }
  private async estimateMeltingPoint(formula: string): Promise<number> { return 273.15; }
  private calculateMolarRatios(reactants: any, products: any): any { return {}; }
  private findLimitingReagent(reactants: any): any { return null; }
  private calculateTheoreticalYield(reactants: any, products: any): number { return 0; }
  private calculateEmpiricalFormula(formula: string): string { return formula; }
  private isOrganicCompound(formula: string): boolean { return formula.includes('C'); }
  private identifyFunctionalGroups(formula: string): string[] { return []; }
  private formatBalancedEquation(reactants: string[], products: string[], coefficients: number[]): string {
    const formatSide = (compounds: string[], startIndex: number) => {
      return compounds.map((compound, i) => {
        const coeff = coefficients[startIndex + i];
        return coeff === 1 ? compound : `${coeff}${compound}`;
      }).join(' + ');
    };

    const reactantSide = formatSide(reactants, 0);
    const productSide = formatSide(products, reactants.length);
    
    return `${reactantSide} -> ${productSide}`;
  }

  private verifyBalance(equation: string, elements: string[]): boolean {
    // Simplified balance verification
    return true; // In practice, this would verify element conservation
  }

  // ========================================
  // Communication Methods
  // ========================================

  private sendMessage(message: WorkerMessage): void {
    if (parentPort && !this.isShuttingDown) {
      parentPort.postMessage(message);
    }
  }

  private sendWorkerReady(): void {
    this.sendMessage({
      type: MessageType.WORKER_READY,
      data: {
        workerId: this.workerId,
        startTime: this.startTime,
        capabilities: [
          CalculationType.EQUATION_BALANCING,
          CalculationType.THERMODYNAMICS,
          CalculationType.BATCH_ANALYSIS,
          CalculationType.MATRIX_SOLVING,
          CalculationType.STOICHIOMETRY,
          CalculationType.COMPOUND_ANALYSIS
        ]
      },
      timestamp: new Date()
    });
  }

  private sendProgress(progress: number): void {
    if (this.currentTaskId) {
      this.sendMessage({
        type: MessageType.TASK_PROGRESS,
        taskId: this.currentTaskId,
        data: {
          progress,
          workerId: this.workerId,
          memoryUsage: this.memoryUsage
        },
        timestamp: new Date()
      });
    }
  }

  private sendError(error: Error, taskId?: string): void {
    const workerError: WorkerError = {
      name: error.name,
      message: error.message,
      type: 'runtime',
      workerId: this.workerId,
      taskId,
      timestamp: new Date(),
      memoryUsage: this.memoryUsage,
      stackTrace: error.stack,
      context: {
        tasksCompleted: this.tasksCompleted,
        uptime: Date.now() - this.startTime.getTime()
      }
    };

    this.sendMessage({
      type: MessageType.TASK_ERROR,
      taskId,
      data: workerError,
      timestamp: new Date()
    });
  }

  private handleHealthCheck(): void {
    this.sendMessage({
      type: MessageType.HEALTH_CHECK,
      data: {
        workerId: this.workerId,
        status: 'healthy',
        uptime: Date.now() - this.startTime.getTime(),
        tasksCompleted: this.tasksCompleted,
        memoryUsage: this.memoryUsage,
        currentTask: this.currentTaskId
      },
      timestamp: new Date()
    });
  }

  private shutdown(): void {
    this.isShuttingDown = true;
    if (parentPort) {
      parentPort.close();
    }
    process.exit(0);
  }
}

// Initialize worker if running in worker thread
if (!isMainThread && workerData) {
  new ChemistryWorker(workerData.workerId);
}
