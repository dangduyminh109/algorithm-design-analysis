import { SortingStep, SearchingStep, ExtremeStep } from '@/types/algorithm';

// Generate random array
export function generateRandomArray(size: number, min: number = 1, max: number = 100): number[] {
  return Array.from({ length: size }, () => Math.floor(Math.random() * (max - min + 1)) + min);
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
}

// Delay function for animations
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
