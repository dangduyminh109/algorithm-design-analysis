/**
 * Instrumented Algorithm Implementations
 * These functions include performance counter tracking
 */

import { 
  PerformanceCounters, 
  SortingStepWithCounters,
  SearchingStepWithCounters,
  ExtremeStepWithCounters 
} from '@/types/instrumentation';
import { createCounters, cloneCounters } from './instrumentation';

// ============================================================================
// SORTING ALGORITHMS WITH INSTRUMENTATION
// ============================================================================

/**
 * Bubble Sort with instrumentation
 */
export function bubbleSortInstrumented(
  arr: number[],
  withSteps: boolean = false
): { 
  sorted: number[]; 
  counters: PerformanceCounters;
  steps?: SortingStepWithCounters[];
} {
  const array = [...arr];
  const counters = createCounters();
  const steps: SortingStepWithCounters[] = [];
  const n = array.length;

  for (let i = 0; i < n - 1; i++) {
    counters.iterations++;
    let swapped = false;

    for (let j = 0; j < n - i - 1; j++) {
      counters.iterations++;
      counters.comparisons++;
      counters.arrayAccesses += 2;

      if (withSteps) {
        steps.push({
          array: [...array],
          comparing: [j, j + 1],
          swapping: [],
          sorted: Array.from({ length: i }, (_, idx) => n - 1 - idx),
          counters: cloneCounters(counters)
        });
      }

      if (array[j] > array[j + 1]) {
        counters.swaps++;
        counters.arrayAccesses += 2;
        counters.assignments += 2;
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
        swapped = true;

        if (withSteps) {
          steps.push({
            array: [...array],
            comparing: [],
            swapping: [j, j + 1],
            sorted: Array.from({ length: i }, (_, idx) => n - 1 - idx),
            counters: cloneCounters(counters)
          });
        }
      }
    }

    if (!swapped) break;
  }

  return { sorted: array, counters, steps: withSteps ? steps : undefined };
}

/**
 * Selection Sort with instrumentation
 */
export function selectionSortInstrumented(
  arr: number[],
  withSteps: boolean = false
): { 
  sorted: number[]; 
  counters: PerformanceCounters;
  steps?: SortingStepWithCounters[];
} {
  const array = [...arr];
  const counters = createCounters();
  const steps: SortingStepWithCounters[] = [];
  const n = array.length;

  for (let i = 0; i < n - 1; i++) {
    counters.iterations++;
    let minIdx = i;
    counters.assignments++;

    for (let j = i + 1; j < n; j++) {
      counters.iterations++;
      counters.comparisons++;
      counters.arrayAccesses += 2;

      if (withSteps) {
        steps.push({
          array: [...array],
          comparing: [minIdx, j],
          swapping: [],
          sorted: Array.from({ length: i }, (_, idx) => idx),
          currentIndex: minIdx,
          counters: cloneCounters(counters)
        });
      }

      if (array[j] < array[minIdx]) {
        minIdx = j;
        counters.assignments++;
      }
    }

    if (minIdx !== i) {
      counters.swaps++;
      counters.arrayAccesses += 2;
      counters.assignments += 2;
      [array[i], array[minIdx]] = [array[minIdx], array[i]];

      if (withSteps) {
        steps.push({
          array: [...array],
          comparing: [],
          swapping: [i, minIdx],
          sorted: Array.from({ length: i + 1 }, (_, idx) => idx),
          counters: cloneCounters(counters)
        });
      }
    }
  }

  return { sorted: array, counters, steps: withSteps ? steps : undefined };
}

/**
 * Insertion Sort with instrumentation
 */
export function insertionSortInstrumented(
  arr: number[],
  withSteps: boolean = false
): { 
  sorted: number[]; 
  counters: PerformanceCounters;
  steps?: SortingStepWithCounters[];
} {
  const array = [...arr];
  const counters = createCounters();
  const steps: SortingStepWithCounters[] = [];
  const n = array.length;

  for (let i = 1; i < n; i++) {
    counters.iterations++;
    const key = array[i];
    counters.arrayAccesses++;
    counters.assignments++;
    let j = i - 1;

    if (withSteps) {
      steps.push({
        array: [...array],
        comparing: [i],
        swapping: [],
        sorted: Array.from({ length: i }, (_, idx) => idx),
        currentIndex: i,
        counters: cloneCounters(counters)
      });
    }

    while (j >= 0) {
      counters.iterations++;
      counters.comparisons++;
      counters.arrayAccesses++;
      
      if (array[j] <= key) break;

      counters.arrayAccesses++;
      counters.assignments++;
      array[j + 1] = array[j];

      if (withSteps) {
        steps.push({
          array: [...array],
          comparing: [j, j + 1],
          swapping: [j, j + 1],
          sorted: Array.from({ length: i }, (_, idx) => idx),
          currentIndex: j,
          counters: cloneCounters(counters)
        });
      }

      j--;
    }

    counters.arrayAccesses++;
    counters.assignments++;
    array[j + 1] = key;
  }

  return { sorted: array, counters, steps: withSteps ? steps : undefined };
}

/**
 * Quick Sort with instrumentation
 */
export function quickSortInstrumented(
  arr: number[],
  withSteps: boolean = false
): { 
  sorted: number[]; 
  counters: PerformanceCounters;
  steps?: SortingStepWithCounters[];
} {
  const array = [...arr];
  const counters = createCounters();
  const steps: SortingStepWithCounters[] = [];

  function partition(low: number, high: number): number {
    counters.recursiveCalls++;
    const pivot = array[high];
    counters.arrayAccesses++;
    let i = low - 1;

    for (let j = low; j < high; j++) {
      counters.iterations++;
      counters.comparisons++;
      counters.arrayAccesses += 2;

      if (withSteps) {
        steps.push({
          array: [...array],
          comparing: [j, high],
          swapping: [],
          sorted: [],
          pivot: high,
          currentIndex: j,
          counters: cloneCounters(counters)
        });
      }

      if (array[j] < pivot) {
        i++;
        counters.swaps++;
        counters.arrayAccesses += 2;
        counters.assignments += 2;
        [array[i], array[j]] = [array[j], array[i]];

        if (withSteps) {
          steps.push({
            array: [...array],
            comparing: [],
            swapping: [i, j],
            sorted: [],
            pivot: high,
            counters: cloneCounters(counters)
          });
        }
      }
    }

    counters.swaps++;
    counters.arrayAccesses += 2;
    counters.assignments += 2;
    [array[i + 1], array[high]] = [array[high], array[i + 1]];

    return i + 1;
  }

  function quickSortHelper(low: number, high: number): void {
    if (low < high) {
      counters.recursiveCalls++;
      const pi = partition(low, high);
      quickSortHelper(low, pi - 1);
      quickSortHelper(pi + 1, high);
    }
  }

  quickSortHelper(0, array.length - 1);
  return { sorted: array, counters, steps: withSteps ? steps : undefined };
}

/**
 * Merge Sort with instrumentation
 */
export function mergeSortInstrumented(
  arr: number[],
  withSteps: boolean = false
): { 
  sorted: number[]; 
  counters: PerformanceCounters;
  steps?: SortingStepWithCounters[];
} {
  const array = [...arr];
  const counters = createCounters();
  const steps: SortingStepWithCounters[] = [];

  function merge(left: number, mid: number, right: number): void {
    const n1 = mid - left + 1;
    const n2 = right - mid;

    const L: number[] = [];
    const R: number[] = [];

    for (let i = 0; i < n1; i++) {
      counters.iterations++;
      counters.arrayAccesses++;
      L[i] = array[left + i];
    }

    for (let j = 0; j < n2; j++) {
      counters.iterations++;
      counters.arrayAccesses++;
      R[j] = array[mid + 1 + j];
    }

    let i = 0, j = 0, k = left;

    while (i < n1 && j < n2) {
      counters.iterations++;
      counters.comparisons++;
      counters.arrayAccesses += 3;
      counters.assignments++;

      if (L[i] <= R[j]) {
        array[k] = L[i];
        i++;
      } else {
        array[k] = R[j];
        j++;
      }

      if (withSteps) {
        steps.push({
          array: [...array],
          comparing: [left + i - 1, mid + 1 + j - 1],
          swapping: [],
          sorted: [],
          counters: cloneCounters(counters)
        });
      }

      k++;
    }

    while (i < n1) {
      counters.iterations++;
      counters.arrayAccesses += 2;
      counters.assignments++;
      array[k] = L[i];
      i++;
      k++;
    }

    while (j < n2) {
      counters.iterations++;
      counters.arrayAccesses += 2;
      counters.assignments++;
      array[k] = R[j];
      j++;
      k++;
    }
  }

  function mergeSortHelper(left: number, right: number): void {
    if (left < right) {
      counters.recursiveCalls++;
      const mid = Math.floor((left + right) / 2);
      mergeSortHelper(left, mid);
      mergeSortHelper(mid + 1, right);
      merge(left, mid, right);
    }
  }

  mergeSortHelper(0, array.length - 1);
  return { sorted: array, counters, steps: withSteps ? steps : undefined };
}

// ============================================================================
// SEARCHING ALGORITHMS WITH INSTRUMENTATION
// ============================================================================

/**
 * Linear Search with instrumentation
 */
export function linearSearchInstrumented(
  arr: number[],
  target: number,
  withSteps: boolean = false
): {
  found: boolean;
  index: number;
  counters: PerformanceCounters;
  steps?: SearchingStepWithCounters[];
} {
  const counters = createCounters();
  const steps: SearchingStepWithCounters[] = [];

  for (let i = 0; i < arr.length; i++) {
    counters.iterations++;
    counters.comparisons++;
    counters.arrayAccesses++;

    if (withSteps) {
      steps.push({
        array: [...arr],
        target,
        currentIndex: i,
        found: false,
        counters: cloneCounters(counters)
      });
    }

    if (arr[i] === target) {
      if (withSteps) {
        steps.push({
          array: [...arr],
          target,
          currentIndex: i,
          found: true,
          counters: cloneCounters(counters)
        });
      }
      return { found: true, index: i, counters, steps: withSteps ? steps : undefined };
    }
  }

  return { found: false, index: -1, counters, steps: withSteps ? steps : undefined };
}

/**
 * Binary Search with instrumentation
 */
export function binarySearchInstrumented(
  arr: number[],
  target: number,
  withSteps: boolean = false
): {
  found: boolean;
  index: number;
  counters: PerformanceCounters;
  steps?: SearchingStepWithCounters[];
} {
  const counters = createCounters();
  const steps: SearchingStepWithCounters[] = [];
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    counters.iterations++;
    const mid = Math.floor((left + right) / 2);
    counters.comparisons++;
    counters.arrayAccesses++;

    if (withSteps) {
      steps.push({
        array: [...arr],
        target,
        currentIndex: mid,
        found: false,
        left,
        right,
        mid,
        counters: cloneCounters(counters)
      });
    }

    if (arr[mid] === target) {
      if (withSteps) {
        steps.push({
          array: [...arr],
          target,
          currentIndex: mid,
          found: true,
          left,
          right,
          mid,
          counters: cloneCounters(counters)
        });
      }
      return { found: true, index: mid, counters, steps: withSteps ? steps : undefined };
    }

    counters.comparisons++;
    counters.arrayAccesses++;

    if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return { found: false, index: -1, counters, steps: withSteps ? steps : undefined };
}

// ============================================================================
// EXTREME VALUE ALGORITHMS WITH INSTRUMENTATION
// ============================================================================

/**
 * Linear Min/Max with instrumentation
 */
export function linearMinMaxInstrumented(
  arr: number[],
  withSteps: boolean = false
): {
  min: number;
  max: number;
  minIndex: number;
  maxIndex: number;
  counters: PerformanceCounters;
  steps?: ExtremeStepWithCounters[];
} {
  const counters = createCounters();
  const steps: ExtremeStepWithCounters[] = [];

  if (arr.length === 0) {
    return {
      min: 0,
      max: 0,
      minIndex: -1,
      maxIndex: -1,
      counters,
      steps: withSteps ? steps : undefined
    };
  }

  let min = arr[0];
  let max = arr[0];
  let minIndex = 0;
  let maxIndex = 0;
  counters.arrayAccesses += 2;
  counters.assignments += 4;

  for (let i = 1; i < arr.length; i++) {
    counters.iterations++;
    counters.arrayAccesses++;

    if (withSteps) {
      steps.push({
        array: [...arr],
        currentMin: min,
        currentMax: max,
        currentIndex: i,
        minIndex,
        maxIndex,
        comparing: [i],
        counters: cloneCounters(counters)
      });
    }

    counters.comparisons++;
    if (arr[i] < min) {
      counters.arrayAccesses++;
      counters.assignments += 2;
      min = arr[i];
      minIndex = i;
    }

    counters.comparisons++;
    counters.arrayAccesses++;
    if (arr[i] > max) {
      counters.assignments += 2;
      max = arr[i];
      maxIndex = i;
    }
  }

  return { min, max, minIndex, maxIndex, counters, steps: withSteps ? steps : undefined };
}

/**
 * Tournament Method with instrumentation
 */
export function tournamentMethodInstrumented(
  arr: number[],
  withSteps: boolean = false
): {
  min: number;
  max: number;
  minIndex: number;
  maxIndex: number;
  counters: PerformanceCounters;
  steps?: ExtremeStepWithCounters[];
} {
  const counters = createCounters();
  const steps: ExtremeStepWithCounters[] = [];

  if (arr.length === 0) {
    return {
      min: 0,
      max: 0,
      minIndex: -1,
      maxIndex: -1,
      counters,
      steps: withSteps ? steps : undefined
    };
  }

  let min = arr[0];
  let max = arr[0];
  let minIndex = 0;
  let maxIndex = 0;
  counters.arrayAccesses += 2;

  // Process pairs
  for (let i = 1; i < arr.length; i += 2) {
    counters.iterations++;
    
    if (i + 1 < arr.length) {
      counters.comparisons++;
      counters.arrayAccesses += 2;

      let localMin, localMax, localMinIdx, localMaxIdx;

      if (arr[i] < arr[i + 1]) {
        localMin = arr[i];
        localMax = arr[i + 1];
        localMinIdx = i;
        localMaxIdx = i + 1;
      } else {
        localMin = arr[i + 1];
        localMax = arr[i];
        localMinIdx = i + 1;
        localMaxIdx = i;
      }

      if (withSteps) {
        steps.push({
          array: [...arr],
          currentMin: min,
          currentMax: max,
          currentIndex: i,
          minIndex,
          maxIndex,
          comparing: [i, i + 1],
          counters: cloneCounters(counters)
        });
      }

      counters.comparisons++;
      if (localMin < min) {
        counters.assignments += 2;
        min = localMin;
        minIndex = localMinIdx;
      }

      counters.comparisons++;
      if (localMax > max) {
        counters.assignments += 2;
        max = localMax;
        maxIndex = localMaxIdx;
      }
    } else {
      // Handle odd element
      counters.arrayAccesses++;
      counters.comparisons += 2;

      if (arr[i] < min) {
        counters.assignments += 2;
        min = arr[i];
        minIndex = i;
      }

      if (arr[i] > max) {
        counters.assignments += 2;
        max = arr[i];
        maxIndex = i;
      }
    }
  }

  return { min, max, minIndex, maxIndex, counters, steps: withSteps ? steps : undefined };
}

/**
 * Jump Search with instrumentation
 */
export function jumpSearchInstrumented(
  arr: number[],
  target: number,
  withSteps: boolean = false
): {
  found: boolean;
  index: number;
  counters: PerformanceCounters;
  steps?: SearchingStepWithCounters[];
} {
  const counters = createCounters();
  const steps: SearchingStepWithCounters[] = [];
  const n = arr.length;
  const jumpSize = Math.floor(Math.sqrt(n));
  let prev = 0;
  let curr = jumpSize;

  // Initial state: highlight starting position (index 0)
  if (withSteps) {
    steps.push({
      array: [...arr],
      target,
      currentIndex: 0,
      found: false,
      left: 0,
      right: 0,
      isJumpPoint: false,
      counters: cloneCounters(counters)
    });
  }

  // Jump through blocks
  while (curr < n && arr[curr] < target) {
    counters.iterations++;
    counters.comparisons++;
    counters.arrayAccesses++;

    if (withSteps) {
      steps.push({
        array: [...arr],
        target,
        currentIndex: curr,
        found: false,
        left: prev,
        right: curr,
        isJumpPoint: true,  // Mark as jump point
        counters: cloneCounters(counters)
      });
    }

    prev = curr;
    curr += jumpSize;
  }

  // Check the last block boundary if within array bounds
  if (curr < n) {
    counters.comparisons++;
    counters.arrayAccesses++;
    
    if (withSteps) {
      steps.push({
        array: [...arr],
        target,
        currentIndex: curr,
        found: false,
        left: prev,
        right: curr,
        isJumpPoint: true,  // Mark as jump point
        counters: cloneCounters(counters)
      });
    }
  }

  // Linear search in the identified block
  const blockEnd = Math.min(curr + 1, n);
  for (let i = prev; i < blockEnd; i++) {
    counters.iterations++;
    counters.comparisons++;
    counters.arrayAccesses++;

    if (withSteps) {
      steps.push({
        array: [...arr],
        target,
        currentIndex: i,
        found: arr[i] === target,
        left: prev,
        right: blockEnd - 1,
        isJumpPoint: false,  // Not a jump point, linear search
        counters: cloneCounters(counters)
      });
    }

    if (arr[i] === target) {
      return { found: true, index: i, counters, steps: withSteps ? steps : undefined };
    }
  }

  return { found: false, index: -1, counters, steps: withSteps ? steps : undefined };
}

/**
 * Interpolation Search with instrumentation
 */
export function interpolationSearchInstrumented(
  arr: number[],
  target: number,
  withSteps: boolean = false
): {
  found: boolean;
  index: number;
  counters: PerformanceCounters;
  steps?: SearchingStepWithCounters[];
} {
  const counters = createCounters();
  const steps: SearchingStepWithCounters[] = [];
  let left = 0;
  let right = arr.length - 1;

  while (left <= right && target >= arr[left] && target <= arr[right]) {
    counters.iterations++;
    counters.comparisons += 2; // Check range boundaries
    counters.arrayAccesses += 2;

    if (left === right) {
      counters.comparisons++;
      counters.arrayAccesses++;
      
      if (withSteps) {
        steps.push({
          array: [...arr],
          target,
          currentIndex: left,
          found: arr[left] === target,
          left,
          right,
          counters: cloneCounters(counters)
        });
      }

      if (arr[left] === target) {
        return { found: true, index: left, counters, steps: withSteps ? steps : undefined };
      }
      break;
    }

    // Interpolation formula
    const pos = left + Math.floor(
      ((right - left) / (arr[right] - arr[left])) * (target - arr[left])
    );
    counters.arrayAccesses += 2;

    if (withSteps) {
      steps.push({
        array: [...arr],
        target,
        currentIndex: pos,
        found: false,
        left,
        right,
        mid: pos,
        counters: cloneCounters(counters)
      });
    }

    counters.comparisons++;
    counters.arrayAccesses++;

    if (arr[pos] === target) {
      if (withSteps) {
        steps.push({
          array: [...arr],
          target,
          currentIndex: pos,
          found: true,
          left,
          right,
          mid: pos,
          counters: cloneCounters(counters)
        });
      }
      return { found: true, index: pos, counters, steps: withSteps ? steps : undefined };
    }

    counters.comparisons++;
    counters.arrayAccesses++;

    if (arr[pos] < target) {
      left = pos + 1;
    } else {
      right = pos - 1;
    }
  }

  return { found: false, index: -1, counters, steps: withSteps ? steps : undefined };
}

/**
 * Divide & Conquer Min/Max with instrumentation
 */
export function divideConquerMinMaxInstrumented(
  arr: number[],
  withSteps: boolean = false
): {
  min: number;
  max: number;
  minIndex: number;
  maxIndex: number;
  counters: PerformanceCounters;
  steps?: ExtremeStepWithCounters[];
} {
  const counters = createCounters();
  const steps: ExtremeStepWithCounters[] = [];

  if (arr.length === 0) {
    return {
      min: 0,
      max: 0,
      minIndex: -1,
      maxIndex: -1,
      counters,
      steps: withSteps ? steps : undefined
    };
  }

  function dcHelper(start: number, end: number): { min: number; max: number; minIndex: number; maxIndex: number } {
    counters.iterations++;

    // Base case: one element
    if (start === end) {
      counters.arrayAccesses++;
      counters.assignments += 4;

      if (withSteps) {
        steps.push({
          array: [...arr],
          currentMin: arr[start],
          currentMax: arr[start],
          currentIndex: start,
          minIndex: start,
          maxIndex: start,
          comparing: [start],
          counters: cloneCounters(counters)
        });
      }

      return { min: arr[start], max: arr[start], minIndex: start, maxIndex: start };
    }

    // Base case: two elements
    if (end - start === 1) {
      counters.comparisons++;
      counters.arrayAccesses += 2;

      const min = Math.min(arr[start], arr[end]);
      const max = Math.max(arr[start], arr[end]);
      const minIndex = arr[start] <= arr[end] ? start : end;
      const maxIndex = arr[start] >= arr[end] ? start : end;
      counters.assignments += 4;

      if (withSteps) {
        steps.push({
          array: [...arr],
          currentMin: min,
          currentMax: max,
          currentIndex: start,
          minIndex,
          maxIndex,
          comparing: [start, end],
          counters: cloneCounters(counters)
        });
      }

      return { min, max, minIndex, maxIndex };
    }

    // Divide and conquer
    const mid = Math.floor((start + end) / 2);
    const left = dcHelper(start, mid);
    const right = dcHelper(mid + 1, end);

    counters.comparisons += 2; // Compare min and max from both halves
    const finalMin = Math.min(left.min, right.min);
    const finalMax = Math.max(left.max, right.max);
    const finalMinIndex = left.min <= right.min ? left.minIndex : right.minIndex;
    const finalMaxIndex = left.max >= right.max ? left.maxIndex : right.maxIndex;
    counters.assignments += 4;

    if (withSteps) {
      steps.push({
        array: [...arr],
        currentMin: finalMin,
        currentMax: finalMax,
        currentIndex: mid,
        minIndex: finalMinIndex,
        maxIndex: finalMaxIndex,
        comparing: [left.minIndex, left.maxIndex, right.minIndex, right.maxIndex],
        counters: cloneCounters(counters)
      });
    }

    return { min: finalMin, max: finalMax, minIndex: finalMinIndex, maxIndex: finalMaxIndex };
  }

  const result = dcHelper(0, arr.length - 1);
  return { ...result, counters, steps: withSteps ? steps : undefined };
}
