import { SortingStep, SearchingStep, ExtremeStep } from '@/types/algorithm';

// Generate random array
export function generateRandomArray(size: number, min: number = 1, max: number = 100): number[] {
  return Array.from({ length: size }, () => Math.floor(Math.random() * (max - min + 1)) + min);
}

// Generate random array with unique values (no duplicates)
export function generateUniqueRandomArray(size: number, min: number = 1, max: number = 100): number[] {
  const range = max - min + 1;
  
  // If requested size is larger than available range, fall back to regular random array
  if (size > range) {
    console.warn(`Cannot generate ${size} unique numbers in range [${min}, ${max}]. Falling back to regular random array.`);
    return generateRandomArray(size, min, max);
  }
  
  const uniqueNumbers = new Set<number>();
  
  while (uniqueNumbers.size < size) {
    const randomNum = Math.floor(Math.random() * range) + min;
    uniqueNumbers.add(randomNum);
  }
  
  return Array.from(uniqueNumbers);
}

// Sorting Algorithm Implementations with Steps
export class SortingAlgorithms {
  static bubbleSort(arr: number[]): SortingStep[] {
    const steps: SortingStep[] = [];
    const array = [...arr];
    const n = array.length;

    steps.push({
      array: [...array],
      comparing: [],
      swapping: [],
      sorted: []
    });

    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        steps.push({
          array: [...array],
          comparing: [j, j + 1],
          swapping: [],
          sorted: Array.from({ length: i }, (_, k) => n - 1 - k)
        });

        if (array[j] > array[j + 1]) {
          [array[j], array[j + 1]] = [array[j + 1], array[j]];
          steps.push({
            array: [...array],
            comparing: [j, j + 1],
            swapping: [j, j + 1],
            sorted: Array.from({ length: i }, (_, k) => n - 1 - k)
          });
        }
      }
    }

    steps.push({
      array: [...array],
      comparing: [],
      swapping: [],
      sorted: Array.from({ length: n }, (_, k) => k)
    });

    return steps;
  }

  static selectionSort(arr: number[]): SortingStep[] {
    const steps: SortingStep[] = [];
    const array = [...arr];
    const n = array.length;

    steps.push({
      array: [...array],
      comparing: [],
      swapping: [],
      sorted: []
    });

    for (let i = 0; i < n - 1; i++) {
      let minIndex = i;
      
      for (let j = i + 1; j < n; j++) {
        steps.push({
          array: [...array],
          comparing: [minIndex, j],
          swapping: [],
          sorted: Array.from({ length: i }, (_, k) => k)
        });

        if (array[j] < array[minIndex]) {
          minIndex = j;
        }
      }

      if (minIndex !== i) {
        [array[i], array[minIndex]] = [array[minIndex], array[i]];
        steps.push({
          array: [...array],
          comparing: [],
          swapping: [i, minIndex],
          sorted: Array.from({ length: i + 1 }, (_, k) => k)
        });
      }
    }

    steps.push({
      array: [...array],
      comparing: [],
      swapping: [],
      sorted: Array.from({ length: n }, (_, k) => k)
    });

    return steps;
  }

  static insertionSort(arr: number[]): SortingStep[] {
    const steps: SortingStep[] = [];
    const array = [...arr];

    steps.push({
      array: [...array],
      comparing: [],
      swapping: [],
      sorted: [0]
    });

    for (let i = 1; i < array.length; i++) {
      const key = array[i];
      let j = i - 1;

      steps.push({
        array: [...array],
        comparing: [i],
        swapping: [],
        sorted: Array.from({ length: i }, (_, k) => k),
        currentIndex: i
      });

      while (j >= 0 && array[j] > key) {
        steps.push({
          array: [...array],
          comparing: [j, j + 1],
          swapping: [],
          sorted: Array.from({ length: i }, (_, k) => k),
          currentIndex: i
        });

        array[j + 1] = array[j];
        
        steps.push({
          array: [...array],
          comparing: [j, j + 1],
          swapping: [j, j + 1],
          sorted: Array.from({ length: i }, (_, k) => k),
          currentIndex: i
        });

        j--;
      }
      array[j + 1] = key;

      steps.push({
        array: [...array],
        comparing: [],
        swapping: [],
        sorted: Array.from({ length: i + 1 }, (_, k) => k)
      });
    }

    return steps;
  }

  static quickSort(arr: number[]): SortingStep[] {
    const steps: SortingStep[] = [];
    const array = [...arr];

    function quickSortHelper(low: number, high: number) {
      if (low < high) {
        const pivotIndex = partition(low, high);
        quickSortHelper(low, pivotIndex - 1);
        quickSortHelper(pivotIndex + 1, high);
      }
    }

    function partition(low: number, high: number): number {
      const pivot = array[high];
      let i = low - 1;

      steps.push({
        array: [...array],
        comparing: [],
        swapping: [],
        sorted: [],
        pivot: high
      });

      for (let j = low; j < high; j++) {
        steps.push({
          array: [...array],
          comparing: [j, high],
          swapping: [],
          sorted: [],
          pivot: high
        });

        if (array[j] <= pivot) {
          i++;
          if (i !== j) {
            [array[i], array[j]] = [array[j], array[i]];
            steps.push({
              array: [...array],
              comparing: [i, j],
              swapping: [i, j],
              sorted: [],
              pivot: high
            });
          }
        }
      }

      [array[i + 1], array[high]] = [array[high], array[i + 1]];
      steps.push({
        array: [...array],
        comparing: [],
        swapping: [i + 1, high],
        sorted: [],
        pivot: i + 1
      });

      return i + 1;
    }

    steps.push({
      array: [...array],
      comparing: [],
      swapping: [],
      sorted: []
    });

    quickSortHelper(0, array.length - 1);

    steps.push({
      array: [...array],
      comparing: [],
      swapping: [],
      sorted: Array.from({ length: array.length }, (_, k) => k)
    });

    return steps;
  }

  static mergeSort(arr: number[]): SortingStep[] {
    const steps: SortingStep[] = [];
    const array = [...arr];

    function mergeSortHelper(left: number, right: number) {
      if (left >= right) return;

      const mid = Math.floor((left + right) / 2);
      mergeSortHelper(left, mid);
      mergeSortHelper(mid + 1, right);
      merge(left, mid, right);
    }

    function merge(left: number, mid: number, right: number) {
      const leftArr = array.slice(left, mid + 1);
      const rightArr = array.slice(mid + 1, right + 1);
      
      let i = 0, j = 0, k = left;

      while (i < leftArr.length && j < rightArr.length) {
        steps.push({
          array: [...array],
          comparing: [left + i, mid + 1 + j],
          swapping: [],
          sorted: []
        });

        if (leftArr[i] <= rightArr[j]) {
          array[k] = leftArr[i];
          i++;
        } else {
          array[k] = rightArr[j];
          j++;
        }
        k++;

        steps.push({
          array: [...array],
          comparing: [],
          swapping: [k - 1],
          sorted: []
        });
      }

      while (i < leftArr.length) {
        array[k] = leftArr[i];
        steps.push({
          array: [...array],
          comparing: [],
          swapping: [k],
          sorted: []
        });
        i++;
        k++;
      }

      while (j < rightArr.length) {
        array[k] = rightArr[j];
        steps.push({
          array: [...array],
          comparing: [],
          swapping: [k],
          sorted: []
        });
        j++;
        k++;
      }
    }

    steps.push({
      array: [...array],
      comparing: [],
      swapping: [],
      sorted: []
    });

    mergeSortHelper(0, array.length - 1);

    steps.push({
      array: [...array],
      comparing: [],
      swapping: [],
      sorted: Array.from({ length: array.length }, (_, k) => k)
    });

    return steps;
  }
}

// Searching Algorithm Implementations with Steps
export class SearchingAlgorithms {
  static linearSearch(arr: number[], target: number): SearchingStep[] {
    const steps: SearchingStep[] = [];

    for (let i = 0; i < arr.length; i++) {
      steps.push({
        array: [...arr],
        target,
        currentIndex: i,
        found: arr[i] === target
      });

      if (arr[i] === target) {
        break;
      }
    }

    return steps;
  }

  static binarySearch(arr: number[], target: number): SearchingStep[] {
    const steps: SearchingStep[] = [];
    let left = 0;
    let right = arr.length - 1;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);

      steps.push({
        array: [...arr],
        target,
        currentIndex: mid,
        found: arr[mid] === target,
        left,
        right,
        mid
      });

      if (arr[mid] === target) {
        break;
      } else if (arr[mid] < target) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }

    return steps;
  }

  static jumpSearch(arr: number[], target: number): SearchingStep[] {
    const steps: SearchingStep[] = [];
    const n = arr.length;
    const jumpSize = Math.floor(Math.sqrt(n));
    let prev = 0;
    let curr = jumpSize;

    // Jump through blocks
    while (curr < n && arr[curr] < target) {
      steps.push({
        array: [...arr],
        target,
        currentIndex: curr,
        found: false,
        left: prev,
        right: curr,
        isJumpPoint: true  // Mark as jump point
      });

      prev = curr;
      curr += jumpSize;
    }

    // Check the last block boundary if within array bounds
    if (curr < n) {
      steps.push({
        array: [...arr],
        target,
        currentIndex: curr,
        found: false,
        left: prev,
        right: curr,
        isJumpPoint: true  // Mark as jump point
      });
    }

    // Linear search in the identified block
    const blockEnd = Math.min(curr + 1, n);
    for (let i = prev; i < blockEnd; i++) {
      steps.push({
        array: [...arr],
        target,
        currentIndex: i,
        found: arr[i] === target,
        left: prev,
        right: blockEnd - 1,
        isJumpPoint: false  // Not a jump point, linear search
      });

      if (arr[i] === target) {
        break;
      }
    }

    // If not found, add final step
    if (steps.length === 0 || !steps[steps.length - 1].found) {
      if (steps.length > 0 && !steps[steps.length - 1].found) {
        // Already have a not-found step at the end
      } else {
        steps.push({
          array: [...arr],
          target,
          currentIndex: -1,
          found: false
        });
      }
    }

    return steps;
  }

  static interpolationSearch(arr: number[], target: number): SearchingStep[] {
    const steps: SearchingStep[] = [];
    let left = 0;
    let right = arr.length - 1;

    while (left <= right && target >= arr[left] && target <= arr[right]) {
      if (left === right) {
        steps.push({
          array: [...arr],
          target,
          currentIndex: left,
          found: arr[left] === target,
          left,
          right
        });
        break;
      }

      // Interpolation formula to estimate position
      const pos = left + Math.floor(
        ((right - left) / (arr[right] - arr[left])) * (target - arr[left])
      );

      steps.push({
        array: [...arr],
        target,
        currentIndex: pos,
        found: arr[pos] === target,
        left,
        right,
        mid: pos
      });

      if (arr[pos] === target) {
        break;
      }

      if (arr[pos] < target) {
        left = pos + 1;
      } else {
        right = pos - 1;
      }
    }

    // If target is out of range
    if (left > right || target < arr[left] || target > arr[right]) {
      steps.push({
        array: [...arr],
        target,
        currentIndex: -1,
        found: false
      });
    }

    return steps;
  }
}

// Extreme Value Algorithm Implementations with Steps
export class ExtremeValueAlgorithms {
  static linearMinMax(arr: number[]): ExtremeStep[] {
    const steps: ExtremeStep[] = [];
    
    if (arr.length === 0) return steps;

    let min = arr[0];
    let max = arr[0];
    let minIndex = 0;
    let maxIndex = 0;

    steps.push({
      array: [...arr],
      currentMin: min,
      currentMax: max,
      currentIndex: 0,
      minIndex: 0,
      maxIndex: 0,
      comparing: [0]
    });

    for (let i = 1; i < arr.length; i++) {
      steps.push({
        array: [...arr],
        currentMin: min,
        currentMax: max,
        currentIndex: i,
        minIndex,
        maxIndex,
        comparing: [i]
      });

      if (arr[i] < min) {
        min = arr[i];
        minIndex = i;
      }
      if (arr[i] > max) {
        max = arr[i];
        maxIndex = i;
      }

      steps.push({
        array: [...arr],
        currentMin: min,
        currentMax: max,
        currentIndex: i,
        minIndex,
        maxIndex,
        comparing: []
      });
    }

    return steps;
  }

  static tournamentMinMax(arr: number[]): ExtremeStep[] {
    const steps: ExtremeStep[] = [];
    
    if (arr.length === 0) return steps;

    function tournamentHelper(start: number, end: number): { min: number; max: number; minIndex: number; maxIndex: number } {
      if (start === end) {
        steps.push({
          array: [...arr],
          currentMin: arr[start],
          currentMax: arr[start],
          currentIndex: start,
          minIndex: start,
          maxIndex: start,
          comparing: [start]
        });
        return { min: arr[start], max: arr[start], minIndex: start, maxIndex: start };
      }

      if (end - start === 1) {
        const min = Math.min(arr[start], arr[end]);
        const max = Math.max(arr[start], arr[end]);
        const minIndex = arr[start] <= arr[end] ? start : end;
        const maxIndex = arr[start] >= arr[end] ? start : end;

        steps.push({
          array: [...arr],
          currentMin: min,
          currentMax: max,
          currentIndex: start,
          minIndex,
          maxIndex,
          comparing: [start, end]
        });

        return { min, max, minIndex, maxIndex };
      }

      const mid = Math.floor((start + end) / 2);
      const left = tournamentHelper(start, mid);
      const right = tournamentHelper(mid + 1, end);

      const finalMin = Math.min(left.min, right.min);
      const finalMax = Math.max(left.max, right.max);
      const finalMinIndex = left.min <= right.min ? left.minIndex : right.minIndex;
      const finalMaxIndex = left.max >= right.max ? left.maxIndex : right.maxIndex;

      steps.push({
        array: [...arr],
        currentMin: finalMin,
        currentMax: finalMax,
        currentIndex: mid,
        minIndex: finalMinIndex,
        maxIndex: finalMaxIndex,
        comparing: [left.minIndex, left.maxIndex, right.minIndex, right.maxIndex]
      });

      return { min: finalMin, max: finalMax, minIndex: finalMinIndex, maxIndex: finalMaxIndex };
    }

    tournamentHelper(0, arr.length - 1);
    return steps;
  }

  static divideConquerMinMax(arr: number[]): ExtremeStep[] {
    const steps: ExtremeStep[] = [];
    
    if (arr.length === 0) return steps;

    function dcHelper(start: number, end: number): { min: number; max: number; minIndex: number; maxIndex: number } {
      // Base case: one element
      if (start === end) {
        steps.push({
          array: [...arr],
          currentMin: arr[start],
          currentMax: arr[start],
          currentIndex: start,
          minIndex: start,
          maxIndex: start,
          comparing: [start]
        });
        return { min: arr[start], max: arr[start], minIndex: start, maxIndex: start };
      }

      // Base case: two elements
      if (end - start === 1) {
        const min = Math.min(arr[start], arr[end]);
        const max = Math.max(arr[start], arr[end]);
        const minIndex = arr[start] <= arr[end] ? start : end;
        const maxIndex = arr[start] >= arr[end] ? start : end;

        steps.push({
          array: [...arr],
          currentMin: min,
          currentMax: max,
          currentIndex: start,
          minIndex,
          maxIndex,
          comparing: [start, end]
        });

        return { min, max, minIndex, maxIndex };
      }

      // Divide and conquer
      const mid = Math.floor((start + end) / 2);
      
      steps.push({
        array: [...arr],
        currentMin: arr[start],
        currentMax: arr[end],
        currentIndex: mid,
        minIndex: start,
        maxIndex: end,
        comparing: Array.from({ length: end - start + 1 }, (_, i) => start + i)
      });

      const left = dcHelper(start, mid);
      const right = dcHelper(mid + 1, end);

      const finalMin = Math.min(left.min, right.min);
      const finalMax = Math.max(left.max, right.max);
      const finalMinIndex = left.min <= right.min ? left.minIndex : right.minIndex;
      const finalMaxIndex = left.max >= right.max ? left.maxIndex : right.maxIndex;

      steps.push({
        array: [...arr],
        currentMin: finalMin,
        currentMax: finalMax,
        currentIndex: mid,
        minIndex: finalMinIndex,
        maxIndex: finalMaxIndex,
        comparing: [left.minIndex, left.maxIndex, right.minIndex, right.maxIndex]
      });

      return { min: finalMin, max: finalMax, minIndex: finalMinIndex, maxIndex: finalMaxIndex };
    }

    dcHelper(0, arr.length - 1);
    return steps;
  }
}

// Delay function for animations
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
