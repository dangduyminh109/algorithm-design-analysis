/**
 * Performance Counter Utilities for Algorithm Instrumentation
 */

import { PerformanceCounters } from '@/types/instrumentation';

/**
 * Creates a new counter object with all values set to 0
 */
export function createCounters(): PerformanceCounters {
  return {
    comparisons: 0,
    swaps: 0,
    arrayAccesses: 0,
    recursiveCalls: 0,
    iterations: 0,
    assignments: 0,
  };
}

/**
 * Resets all counters to 0
 */
export function resetCounters(counters: PerformanceCounters): void {
  counters.comparisons = 0;
  counters.swaps = 0;
  counters.arrayAccesses = 0;
  counters.recursiveCalls = 0;
  counters.iterations = 0;
  counters.assignments = 0;
}

/**
 * Creates a deep copy of counters
 */
export function cloneCounters(counters: PerformanceCounters): PerformanceCounters {
  return {
    comparisons: counters.comparisons,
    swaps: counters.swaps,
    arrayAccesses: counters.arrayAccesses,
    recursiveCalls: counters.recursiveCalls,
    iterations: counters.iterations,
    assignments: counters.assignments,
  };
}

/**
 * Counter tracking class with convenient methods
 */
export class CounterTracker {
  private counters: PerformanceCounters;

  constructor() {
    this.counters = createCounters();
  }

  // Increment methods
  incrementComparisons(count: number = 1): void {
    this.counters.comparisons += count;
  }

  incrementSwaps(count: number = 1): void {
    this.counters.swaps += count;
  }

  incrementArrayAccesses(count: number = 1): void {
    this.counters.arrayAccesses += count;
  }

  incrementRecursiveCalls(count: number = 1): void {
    this.counters.recursiveCalls += count;
  }

  incrementIterations(count: number = 1): void {
    this.counters.iterations += count;
  }

  incrementAssignments(count: number = 1): void {
    this.counters.assignments += count;
  }

  // Get current counters
  getCounters(): PerformanceCounters {
    return cloneCounters(this.counters);
  }

  // Get reference to counters (for direct manipulation)
  getCountersRef(): PerformanceCounters {
    return this.counters;
  }

  // Reset all counters
  reset(): void {
    resetCounters(this.counters);
  }

  // Get total operations
  getTotalOperations(): number {
    return (
      this.counters.comparisons +
      this.counters.swaps +
      this.counters.arrayAccesses +
      this.counters.recursiveCalls +
      this.counters.iterations +
      this.counters.assignments
    );
  }

  // Get summary report
  getReport(): string {
    return `
Performance Report:
- Comparisons: ${this.counters.comparisons}
- Swaps: ${this.counters.swaps}
- Array Accesses: ${this.counters.arrayAccesses}
- Recursive Calls: ${this.counters.recursiveCalls}
- Iterations: ${this.counters.iterations}
- Assignments: ${this.counters.assignments}
- Total Operations: ${this.getTotalOperations()}
    `.trim();
  }
}

/**
 * Instrumented Array wrapper for automatic access tracking
 */
export class InstrumentedArray<T = number> {
  private data: T[];
  private counters: PerformanceCounters;

  constructor(array: T[], counters: PerformanceCounters) {
    this.data = [...array];
    this.counters = counters;
  }

  // Get element with tracking
  get(index: number): T {
    this.counters.arrayAccesses++;
    return this.data[index];
  }

  // Set element with tracking
  set(index: number, value: T): void {
    this.counters.arrayAccesses++;
    this.counters.assignments++;
    this.data[index] = value;
  }

  // Swap with tracking
  swap(i: number, j: number): void {
    this.counters.arrayAccesses += 2;
    this.counters.swaps++;
    const temp = this.data[i];
    this.data[i] = this.data[j];
    this.data[j] = temp;
  }

  // Compare with tracking
  compare(i: number, j: number, compareFn?: (a: T, b: T) => number): number {
    this.counters.arrayAccesses += 2;
    this.counters.comparisons++;
    
    if (compareFn) {
      return compareFn(this.data[i], this.data[j]);
    }
    
    // Default comparison for numbers
    return (this.data[i] as any) - (this.data[j] as any);
  }

  // Get length
  get length(): number {
    return this.data.length;
  }

  // Get raw array (for final result)
  toArray(): T[] {
    return [...this.data];
  }

  // Get element without tracking (use sparingly)
  peekAt(index: number): T {
    return this.data[index];
  }
}

/**
 * Utility to measure execution time
 */
export function measureTime<T>(fn: () => T): { result: T; time: number } {
  const start = performance.now();
  const result = fn();
  const time = performance.now() - start;
  return { result, time };
}

/**
 * Create test data for benchmarking
 */
export function generateTestData(size: number, distribution: string): number[] {
  switch (distribution) {
    case 'random':
      return Array.from({ length: size }, () => Math.floor(Math.random() * 1000));
    
    case 'sorted':
      return Array.from({ length: size }, (_, i) => i);
    
    case 'reversed':
      return Array.from({ length: size }, (_, i) => size - i);
    
    case 'nearly-sorted':
      const nearlySorted = Array.from({ length: size }, (_, i) => i);
      // Swap 10% of elements
      const swapCount = Math.floor(size * 0.1);
      for (let i = 0; i < swapCount; i++) {
        const idx1 = Math.floor(Math.random() * size);
        const idx2 = Math.floor(Math.random() * size);
        [nearlySorted[idx1], nearlySorted[idx2]] = [nearlySorted[idx2], nearlySorted[idx1]];
      }
      return nearlySorted;
    
    case 'few-unique':
      const uniqueValues = [1, 2, 3, 4, 5];
      return Array.from({ length: size }, () => 
        uniqueValues[Math.floor(Math.random() * uniqueValues.length)]
      );
    
    default:
      return Array.from({ length: size }, () => Math.floor(Math.random() * 1000));
  }
}

/**
 * Format counter value with commas
 */
export function formatCount(count: number): string {
  return count.toLocaleString();
}

/**
 * Format execution time
 */
export function formatTime(ms: number): string {
  if (ms < 1) {
    return `${(ms * 1000).toFixed(2)}μs`;
  } else if (ms < 1000) {
    return `${ms.toFixed(2)}ms`;
  } else {
    return `${(ms / 1000).toFixed(2)}s`;
  }
}

/**
 * Calculate operations per second
 */
export function calculateOpsPerSecond(operations: number, timeMs: number): number {
  return (operations / timeMs) * 1000;
}
