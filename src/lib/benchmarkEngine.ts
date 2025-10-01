/**
 * Benchmark Engine
 * Executes algorithms and collects performance metrics
 */

import { 
  BenchmarkConfig, 
  BenchmarkResult, 
  BenchmarkRun, 
  DataDistribution 
} from '@/types/instrumentation';
import { 
  bubbleSortInstrumented,
  selectionSortInstrumented,
  insertionSortInstrumented,
  quickSortInstrumented,
  mergeSortInstrumented,
  linearSearchInstrumented,
  binarySearchInstrumented,
  linearMinMaxInstrumented,
  tournamentMethodInstrumented
} from './instrumentedAlgorithms';
import { generateTestData, measureTime } from './instrumentation';
import { algorithms } from './algorithms';

/**
 * Get algorithm name from ID
 */
function getAlgorithmName(algorithmId: string): string {
  for (const category of Object.values(algorithms)) {
    const algo = category.find(a => a.id === algorithmId);
    if (algo) return algo.name;
  }
  return algorithmId;
}

/**
 * Run a single algorithm with given configuration
 */
async function runSingleAlgorithm(
  algorithmId: string,
  inputSize: number,
  distribution: DataDistribution,
  runNumber: number
): Promise<BenchmarkRun> {
  const data = generateTestData(inputSize, distribution);
  const startTime = performance.now();

  let result;
  let executionTime;

  // Execute the appropriate algorithm
  switch (algorithmId) {
    // Sorting algorithms
    case 'bubble-sort':
      ({ result, time: executionTime } = measureTime(() => 
        bubbleSortInstrumented(data, false)
      ));
      break;
    
    case 'selection-sort':
      ({ result, time: executionTime } = measureTime(() => 
        selectionSortInstrumented(data, false)
      ));
      break;
    
    case 'insertion-sort':
      ({ result, time: executionTime } = measureTime(() => 
        insertionSortInstrumented(data, false)
      ));
      break;
    
    case 'quick-sort':
      ({ result, time: executionTime } = measureTime(() => 
        quickSortInstrumented(data, false)
      ));
      break;
    
    case 'merge-sort':
      ({ result, time: executionTime } = measureTime(() => 
        mergeSortInstrumented(data, false)
      ));
      break;
    
    // Searching algorithms
    case 'linear-search':
      const linearTarget = data[Math.floor(Math.random() * data.length)];
      ({ result, time: executionTime } = measureTime(() => 
        linearSearchInstrumented(data, linearTarget, false)
      ));
      break;
    
    case 'binary-search':
      const sortedData = [...data].sort((a, b) => a - b);
      const binaryTarget = sortedData[Math.floor(Math.random() * sortedData.length)];
      ({ result, time: executionTime } = measureTime(() => 
        binarySearchInstrumented(sortedData, binaryTarget, false)
      ));
      break;
    
    // Extreme value algorithms
    case 'linear-min-max':
      ({ result, time: executionTime } = measureTime(() => 
        linearMinMaxInstrumented(data, false)
      ));
      break;
    
    case 'tournament-method':
      ({ result, time: executionTime } = measureTime(() => 
        tournamentMethodInstrumented(data, false)
      ));
      break;
    
    default:
      throw new Error(`Unknown algorithm: ${algorithmId}`);
  }

  return {
    algorithmId,
    algorithmName: getAlgorithmName(algorithmId),
    inputSize,
    dataDistribution: distribution,
    counters: result.counters,
    executionTime,
    timestamp: Date.now()
  };
}

/**
 * Run benchmark with progress callback (optimized with batching)
 */
export async function runBenchmark(
  config: BenchmarkConfig,
  onProgress?: (current: number, total: number, currentRun: BenchmarkRun) => void
): Promise<BenchmarkResult> {
  const startTime = Date.now();
  const runs: BenchmarkRun[] = [];
  
  const totalRuns = 
    config.algorithmIds.length * 
    config.inputSizes.length * 
    config.distributions.length * 
    config.runsPerConfig;

  let currentRun = 0;
  const BATCH_SIZE = 5; // Chạy 5 tests rồi yield để UI update
  let batchCount = 0;

  for (const algorithmId of config.algorithmIds) {
    for (const inputSize of config.inputSizes) {
      for (const distribution of config.distributions) {
        for (let runNumber = 0; runNumber < config.runsPerConfig; runNumber++) {
          try {
            const run = await runSingleAlgorithm(
              algorithmId,
              inputSize,
              distribution,
              runNumber
            );
            
            runs.push(run);
            currentRun++;
            batchCount++;

            if (onProgress) {
              onProgress(currentRun, totalRuns, run);
            }

            // Yield to UI after every BATCH_SIZE runs để tránh đứng web
            if (batchCount >= BATCH_SIZE) {
              await new Promise(resolve => setTimeout(resolve, 10));
              batchCount = 0;
            }
          } catch (error) {
            console.error(`Error running ${algorithmId} with size ${inputSize}:`, error);
          }
        }
      }
    }
  }

  const endTime = Date.now();

  return {
    config,
    runs,
    startTime,
    endTime,
    totalRuns
  };
}

/**
 * Calculate average metrics for each algorithm/size/distribution combination
 */
export interface AggregatedMetrics {
  algorithmId: string;
  algorithmName: string;
  inputSize: number;
  distribution: DataDistribution;
  avgExecutionTime: number;
  avgComparisons: number;
  avgSwaps: number;
  avgArrayAccesses: number;
  avgRecursiveCalls: number;
  avgIterations: number;
  avgAssignments: number;
  totalOperations: number;
  runs: number;
}

export function aggregateBenchmarkResults(result: BenchmarkResult): AggregatedMetrics[] {
  const grouped = new Map<string, BenchmarkRun[]>();

  // Group runs by algorithm, size, and distribution
  for (const run of result.runs) {
    const key = `${run.algorithmId}-${run.inputSize}-${run.dataDistribution}`;
    if (!grouped.has(key)) {
      grouped.set(key, []);
    }
    grouped.get(key)!.push(run);
  }

  // Calculate averages
  const aggregated: AggregatedMetrics[] = [];

  grouped.forEach((runs, key) => {
    const n = runs.length;
    if (n === 0) return;

    const sum = runs.reduce((acc: {
      executionTime: number;
      comparisons: number;
      swaps: number;
      arrayAccesses: number;
      recursiveCalls: number;
      iterations: number;
      assignments: number;
    }, run: BenchmarkRun) => ({
      executionTime: acc.executionTime + run.executionTime,
      comparisons: acc.comparisons + run.counters.comparisons,
      swaps: acc.swaps + run.counters.swaps,
      arrayAccesses: acc.arrayAccesses + run.counters.arrayAccesses,
      recursiveCalls: acc.recursiveCalls + run.counters.recursiveCalls,
      iterations: acc.iterations + run.counters.iterations,
      assignments: acc.assignments + run.counters.assignments,
    }), {
      executionTime: 0,
      comparisons: 0,
      swaps: 0,
      arrayAccesses: 0,
      recursiveCalls: 0,
      iterations: 0,
      assignments: 0,
    });

    const totalOps = 
      sum.comparisons + sum.swaps + sum.arrayAccesses + 
      sum.recursiveCalls + sum.iterations + sum.assignments;

    aggregated.push({
      algorithmId: runs[0].algorithmId,
      algorithmName: runs[0].algorithmName,
      inputSize: runs[0].inputSize,
      distribution: runs[0].dataDistribution,
      avgExecutionTime: sum.executionTime / n,
      avgComparisons: sum.comparisons / n,
      avgSwaps: sum.swaps / n,
      avgArrayAccesses: sum.arrayAccesses / n,
      avgRecursiveCalls: sum.recursiveCalls / n,
      avgIterations: sum.iterations / n,
      avgAssignments: sum.assignments / n,
      totalOperations: totalOps / n,
      runs: n
    });
  });

  return aggregated.sort((a, b) => {
    if (a.algorithmId !== b.algorithmId) {
      return a.algorithmId.localeCompare(b.algorithmId);
    }
    if (a.inputSize !== b.inputSize) {
      return a.inputSize - b.inputSize;
    }
    return a.distribution.localeCompare(b.distribution);
  });
}

/**
 * Get comparison data for charting
 */
export interface ComparisonData {
  algorithm: string;
  data: { x: number; y: number }[];
}

export function getComparisonData(
  aggregated: AggregatedMetrics[],
  metric: keyof Pick<AggregatedMetrics, 'avgExecutionTime' | 'avgComparisons' | 'avgSwaps' | 'totalOperations'>,
  distribution: DataDistribution
): ComparisonData[] {
  const byAlgorithm = new Map<string, { x: number; y: number }[]>();

  for (const entry of aggregated) {
    if (entry.distribution !== distribution) continue;

    if (!byAlgorithm.has(entry.algorithmName)) {
      byAlgorithm.set(entry.algorithmName, []);
    }

    byAlgorithm.get(entry.algorithmName)!.push({
      x: entry.inputSize,
      y: entry[metric] as number
    });
  }

  return Array.from(byAlgorithm.entries()).map(([algorithm, data]) => ({
    algorithm,
    data: data.sort((a, b) => a.x - b.x)
  }));
}

/**
 * Export benchmark results to CSV
 */
export function exportToCSV(result: BenchmarkResult): string {
  const aggregated = aggregateBenchmarkResults(result);
  
  const headers = [
    'Algorithm',
    'Input Size',
    'Distribution',
    'Avg Time (ms)',
    'Avg Comparisons',
    'Avg Swaps',
    'Avg Array Accesses',
    'Avg Recursive Calls',
    'Avg Iterations',
    'Avg Assignments',
    'Total Operations',
    'Runs'
  ].join(',');

  const rows = aggregated.map(m => [
    m.algorithmName,
    m.inputSize,
    m.distribution,
    m.avgExecutionTime.toFixed(3),
    m.avgComparisons.toFixed(0),
    m.avgSwaps.toFixed(0),
    m.avgArrayAccesses.toFixed(0),
    m.avgRecursiveCalls.toFixed(0),
    m.avgIterations.toFixed(0),
    m.avgAssignments.toFixed(0),
    m.totalOperations.toFixed(0),
    m.runs
  ].join(','));

  return [headers, ...rows].join('\n');
}

/**
 * Export benchmark results to JSON
 */
export function exportToJSON(result: BenchmarkResult): string {
  return JSON.stringify(result, null, 2);
}
