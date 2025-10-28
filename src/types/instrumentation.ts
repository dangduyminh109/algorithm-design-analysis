/**
 * Performance Counter Types for Algorithm Instrumentation
 */

export interface PerformanceCounters {
  comparisons: number;
  swaps: number;
  arrayAccesses: number;
  recursiveCalls: number;
  iterations: number;
  assignments: number;
  memoryUsage: number; // in bytes
}

export interface InstrumentationResult<T = any> {
  result: T;
  counters: PerformanceCounters;
  executionTime: number;
  inputSize: number;
}

export interface BenchmarkRun {
  algorithmId: string;
  algorithmName: string;
  inputSize: number;
  dataDistribution: DataDistribution;
  counters: PerformanceCounters;
  executionTime: number;
  memoryUsage: number; // in bytes
  timestamp: number;
}

export type DataDistribution = 
  | 'random' 
  | 'sorted' 
  | 'reversed' 
  | 'nearly-sorted'
  | 'few-unique';

export interface BenchmarkConfig {
  algorithmIds: string[];
  inputSizes: number[];
  distributions: DataDistribution[];
  runsPerConfig: number;
}

export interface BenchmarkResult {
  config: BenchmarkConfig;
  runs: BenchmarkRun[];
  startTime: number;
  endTime: number;
  totalRuns: number;
}

/**
 * Instrumented Algorithm Function Type
 */
export type InstrumentedAlgorithm<TInput = any, TOutput = any> = (
  input: TInput,
  counters: PerformanceCounters
) => TOutput;

/**
 * Algorithm with Steps (for visualization)
 */
export interface InstrumentedStep {
  counters: PerformanceCounters;
  timestamp: number;
}

export interface SortingStepWithCounters {
  array: number[];
  comparing: number[];
  swapping: number[];
  pivot?: number;
  sorted: number[];
  currentIndex?: number;
  counters: PerformanceCounters;
}

export interface SearchingStepWithCounters {
  array: number[];
  target: number;
  currentIndex: number;
  found: boolean;
  left?: number;
  right?: number;
  mid?: number;
  isJumpPoint?: boolean;  // For Jump Search visualization
  counters: PerformanceCounters;
}

export interface ExtremeStepWithCounters {
  array: number[];
  currentMin?: number;
  currentMax?: number;
  currentIndex: number;
  minIndex?: number;
  maxIndex?: number;
  comparing: number[];
  counters: PerformanceCounters;
}
