/**
 * Extended Algorithm Theory Types
 */

export interface ComplexityAnalysis {
  formula: string; // LaTeX formula
  explanation: string;
  bigO: string;
  proof?: string; // Optional mathematical proof
}

export interface AlgorithmTheory {
  id: string;
  name: string;
  category: 'sorting' | 'searching' | 'extreme' | 'graph' | 'dynamic-programming' | 'greedy';
  
  // Complexity Information
  timeComplexity: {
    best: ComplexityAnalysis;
    average: ComplexityAnalysis;
    worst: ComplexityAnalysis;
  };
  
  spaceComplexity: {
    auxiliary: ComplexityAnalysis;
    total: ComplexityAnalysis;
  };
  
  // Algorithm Properties
  properties: {
    stable: boolean;
    inPlace: boolean;
    adaptive: boolean;
    online: boolean;
    recursive: boolean;
    comparison: boolean;
  };
  
  // Detailed Description
  description: {
    overview: string;
    howItWorks: string[];
    keyInsights: string[];
  };
  
  // Mathematical Analysis
  mathematics: {
    recurrenceRelation?: string; // LaTeX
    masterTheorem?: string;
    amortizedAnalysis?: string;
    invariants?: string[];
  };
  
  // Practical Information
  practical: {
    bestUseCase: string[];
    worstUseCase: string[];
    optimizations: string[];
    realWorldApplications: string[];
  };
  
  // Comparison Metrics
  metrics: {
    averageComparisons: string; // Formula
    averageSwaps: string; // Formula
    cacheFriendly: 'high' | 'medium' | 'low';
    parallelizable: boolean;
  };
  
  // Trade-offs
  tradeoffs: {
    pros: string[];
    cons: string[];
    vsAlternatives?: Record<string, string>; // Compare with other algorithms
  };
  
  // Additional Resources
  resources: {
    papers?: string[];
    books?: string[];
    visualizations?: string[];
  };
  
  // Tags for filtering
  tags: string[];
  difficulty: 'Dễ' | 'Trung Bình' | 'Khó' | 'Rất Khó';
  
  // Historical Context
  history?: {
    inventor?: string;
    year?: number;
    motivation?: string;
    wikipediaUrl?: string;
  };
}

export interface TheoryComparison {
  algorithms: string[]; // Algorithm IDs
  comparisonPoints: {
    aspect: string;
    values: Record<string, string | number>;
  }[];
}

export interface ComplexityClass {
  name: string;
  notation: string; // LaTeX
  description: string;
  examples: string[];
  growthRate: number; // For sorting/visualization
}
