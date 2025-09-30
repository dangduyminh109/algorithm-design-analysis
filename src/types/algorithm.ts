export type CodeLanguage = 'javascript' | 'java' | 'cpp' | 'csharp' | 'c' | 'python';

export interface Algorithm {
  id: string;
  name: string;
  category: 'sorting' | 'searching' | 'extreme';
  timeComplexity: {
    best: string;
    average: string;
    worst: string;
  };
  spaceComplexity: string;
  description: string;
  applications: string[];
  difficulty: 'Dễ' | 'Trung Bình' | 'Khó';
  codeSnippets: Partial<Record<CodeLanguage, string>>;
  defaultLanguage?: CodeLanguage;
}

export interface SortingStep {
  array: number[];
  comparing: number[];
  swapping: number[];
  pivot?: number;
  sorted: number[];
  currentIndex?: number;
}

export interface SearchingStep {
  array: number[];
  target: number;
  currentIndex: number;
  found: boolean;
  left?: number;
  right?: number;
  mid?: number;
}

export interface ExtremeStep {
  array: number[];
  currentMin?: number;
  currentMax?: number;
  currentIndex: number;
  minIndex?: number;
  maxIndex?: number;
  comparing: number[];
}

export interface VisualizationState {
  isPlaying: boolean;
  isPaused: boolean;
  speed: number;
  currentStep: number;
  steps: (SortingStep | SearchingStep | ExtremeStep)[];
  progress: number;
}

export interface AlgorithmCategory {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  algorithms: Algorithm[];
}
