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
      sorted: [],
      explanation: 'Bắt đầu sắp xếp nổi bọt'
    });

    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        steps.push({
          array: [...array],
          comparing: [j, j + 1],
          swapping: [],
          sorted: Array.from({ length: i }, (_, k) => n - 1 - k),
          explanation: `So sánh ${array[j]} và ${array[j + 1]}`
        });

        if (array[j] > array[j + 1]) {
          const temp1 = array[j];
          const temp2 = array[j + 1];
          [array[j], array[j + 1]] = [array[j + 1], array[j]];
          steps.push({
            array: [...array],
            comparing: [j, j + 1],
            swapping: [j, j + 1],
            sorted: Array.from({ length: i }, (_, k) => n - 1 - k),
            explanation: `Hoán đổi vì ${temp1} > ${temp2}`
          });
        }
      }
    }

    steps.push({
      array: [...array],
      comparing: [],
      swapping: [],
      sorted: Array.from({ length: n }, (_, k) => k),
      explanation: 'Hoàn thành sắp xếp'
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
      sorted: [],
      explanation: 'Bắt đầu sắp xếp chọn'
    });

    for (let i = 0; i < n - 1; i++) {
      let minIndex = i;
      
      for (let j = i + 1; j < n; j++) {
        steps.push({
          array: [...array],
          comparing: [minIndex, j],
          swapping: [],
          sorted: Array.from({ length: i }, (_, k) => k),
          explanation: `So sánh ${array[minIndex]} với ${array[j]}`
        });

        if (array[j] < array[minIndex]) {
          minIndex = j;
        }
      }

      if (minIndex !== i) {
        const minValue = array[minIndex];
        [array[i], array[minIndex]] = [array[minIndex], array[i]];
        steps.push({
          array: [...array],
          comparing: [],
          swapping: [i, minIndex],
          sorted: Array.from({ length: i + 1 }, (_, k) => k),
          explanation: `Đặt ${minValue} vào vị trí ${i}`
        });
      }
    }

    steps.push({
      array: [...array],
      comparing: [],
      swapping: [],
      sorted: Array.from({ length: n }, (_, k) => k),
      explanation: 'Hoàn thành sắp xếp'
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
      sorted: [0],
      explanation: 'Bắt đầu sắp xếp chèn'
    });

    for (let i = 1; i < array.length; i++) {
      const key = array[i];
      let j = i - 1;

      steps.push({
        array: [...array],
        comparing: [i],
        swapping: [],
        sorted: Array.from({ length: i }, (_, k) => k),
        currentIndex: i,
        explanation: `Chọn phần tử ${key} để chèn vào đúng vị trí`
      });

      while (j >= 0 && array[j] > key) {
        steps.push({
          array: [...array],
          comparing: [j, j + 1],
          swapping: [],
          sorted: Array.from({ length: i }, (_, k) => k),
          currentIndex: i,
          explanation: `${array[j]} > ${key}: dịch ${array[j]} sang phải`
        });

        const movedValue = array[j];
        array[j + 1] = array[j];
        
        steps.push({
          array: [...array],
          comparing: [j, j + 1],
          swapping: [j, j + 1],
          sorted: Array.from({ length: i }, (_, k) => k),
          currentIndex: i,
          explanation: `Dịch ${movedValue} sang vị trí ${j + 1}`
        });

        j--;
      }
      array[j + 1] = key;

      steps.push({
        array: [...array],
        comparing: [],
        swapping: [],
        sorted: Array.from({ length: i + 1 }, (_, k) => k),
        explanation: `Chèn ${key} vào vị trí ${j + 1}`
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
        pivot: high,
        explanation: `Chọn pivot = ${pivot} tại vị trí ${high}`
      });

      for (let j = low; j < high; j++) {
        steps.push({
          array: [...array],
          comparing: [j, high],
          swapping: [],
          sorted: [],
          pivot: high,
          explanation: `So sánh ${array[j]} với pivot ${pivot}`
        });

        if (array[j] <= pivot) {
          i++;
          if (i !== j) {
            const val1 = array[i];
            const val2 = array[j];
            [array[i], array[j]] = [array[j], array[i]];
            steps.push({
              array: [...array],
              comparing: [i, j],
              swapping: [i, j],
              sorted: [],
              pivot: high,
              explanation: `${val2} ≤ ${pivot}: hoán đổi ${val1} và ${val2}`
            });
          }
        }
      }

      const pivotValue = array[high];
      [array[i + 1], array[high]] = [array[high], array[i + 1]];
      steps.push({
        array: [...array],
        comparing: [],
        swapping: [i + 1, high],
        sorted: [],
        pivot: i + 1,
        explanation: `Đặt pivot ${pivotValue} vào vị trí ${i + 1}`
      });

      return i + 1;
    }

    steps.push({
      array: [...array],
      comparing: [],
      swapping: [],
      sorted: [],
      explanation: 'Bắt đầu sắp xếp nhanh'
    });

    quickSortHelper(0, array.length - 1);

    steps.push({
      array: [...array],
      comparing: [],
      swapping: [],
      sorted: Array.from({ length: array.length }, (_, k) => k),
      explanation: 'Hoàn thành sắp xếp'
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
          sorted: [],
          explanation: `So sánh ${leftArr[i]} và ${rightArr[j]}`
        });

        let mergedValue;
        if (leftArr[i] <= rightArr[j]) {
          mergedValue = leftArr[i];
          array[k] = leftArr[i];
          i++;
        } else {
          mergedValue = rightArr[j];
          array[k] = rightArr[j];
          j++;
        }
        k++;

        steps.push({
          array: [...array],
          comparing: [],
          swapping: [k - 1],
          sorted: [],
          explanation: `Chọn ${mergedValue} để trộn vào vị trí ${k - 1}`
        });
      }

      while (i < leftArr.length) {
        const value = leftArr[i];
        array[k] = leftArr[i];
        steps.push({
          array: [...array],
          comparing: [],
          swapping: [k],
          sorted: [],
          explanation: `Sao chép ${value} từ mảng trái`
        });
        i++;
        k++;
      }

      while (j < rightArr.length) {
        const value = rightArr[j];
        array[k] = rightArr[j];
        steps.push({
          array: [...array],
          comparing: [],
          swapping: [k],
          sorted: [],
          explanation: `Sao chép ${value} từ mảng phải`
        });
        j++;
        k++;
      }
    }

    steps.push({
      array: [...array],
      comparing: [],
      swapping: [],
      sorted: [],
      explanation: 'Bắt đầu sắp xếp trộn'
    });

    mergeSortHelper(0, array.length - 1);

    steps.push({
      array: [...array],
      comparing: [],
      swapping: [],
      sorted: Array.from({ length: array.length }, (_, k) => k),
      explanation: 'Hoàn thành sắp xếp'
    });

    return steps;
  }
}

// Searching Algorithm Implementations with Steps
export class SearchingAlgorithms {
  static linearSearch(arr: number[], target: number): SearchingStep[] {
    const steps: SearchingStep[] = [];

    for (let i = 0; i < arr.length; i++) {
      const found = arr[i] === target;
      steps.push({
        array: [...arr],
        target,
        currentIndex: i,
        found,
        explanation: found ? `Tìm thấy ${target} tại vị trí ${i}` : `Kiểm tra vị trí ${i}: ${arr[i]} ≠ ${target}`
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
      const found = arr[mid] === target;
      
      let explanation = '';
      if (found) {
        explanation = `Tìm thấy ${target} tại vị trí ${mid}`;
      } else if (arr[mid] < target) {
        explanation = `${arr[mid]} < ${target}: tìm bên phải`;
      } else {
        explanation = `${arr[mid]} > ${target}: tìm bên trái`;
      }

      steps.push({
        array: [...arr],
        target,
        currentIndex: mid,
        found,
        left,
        right,
        mid,
        explanation
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

    // Initial state: highlight starting position (index 0)
    steps.push({
      array: [...arr],
      target,
      currentIndex: 0,
      found: false,
      left: 0,
      right: 0,
      isJumpPoint: false,
      explanation: `Bắt đầu Jump Search với bước nhảy ${jumpSize}`
    });

    // Jump through blocks
    while (curr < n && arr[curr] < target) {
      steps.push({
        array: [...arr],
        target,
        currentIndex: curr,
        found: false,
        left: prev,
        right: curr,
        isJumpPoint: true,
        explanation: `Nhảy đến vị trí ${curr}: ${arr[curr]} < ${target}`
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
        isJumpPoint: true,
        explanation: `Kiểm tra vị trí ${curr}: ${arr[curr]} ≥ ${target}, tìm trong khối`
      });
    }

    // Linear search in the identified block
    const blockEnd = Math.min(curr + 1, n);
    for (let i = prev; i < blockEnd; i++) {
      const found = arr[i] === target;
      steps.push({
        array: [...arr],
        target,
        currentIndex: i,
        found,
        left: prev,
        right: blockEnd - 1,
        isJumpPoint: false,
        explanation: found ? `Tìm thấy ${target} tại vị trí ${i}` : `Tìm tuyến tính: ${arr[i]} ≠ ${target}`
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
          found: false,
          explanation: `Không tìm thấy ${target} trong mảng`
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
        const found = arr[left] === target;
        steps.push({
          array: [...arr],
          target,
          currentIndex: left,
          found,
          left,
          right,
          explanation: found ? `Tìm thấy ${target} tại vị trí ${left}` : `Không tìm thấy ${target}`
        });
        break;
      }

      // Interpolation formula to estimate position
      const pos = left + Math.floor(
        ((right - left) / (arr[right] - arr[left])) * (target - arr[left])
      );

      const found = arr[pos] === target;
      let explanation = '';
      if (found) {
        explanation = `Tìm thấy ${target} tại vị trí ${pos}`;
      } else if (arr[pos] < target) {
        explanation = `Ước lượng vị trí ${pos}: ${arr[pos]} < ${target}, tìm bên phải`;
      } else {
        explanation = `Ước lượng vị trí ${pos}: ${arr[pos]} > ${target}, tìm bên trái`;
      }

      steps.push({
        array: [...arr],
        target,
        currentIndex: pos,
        found,
        left,
        right,
        mid: pos,
        explanation
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
        found: false,
        explanation: `${target} nằm ngoài phạm vi mảng`
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
      comparing: [0],
      explanation: `Khởi tạo: min = max = ${arr[0]}`
    });

    for (let i = 1; i < arr.length; i++) {
      steps.push({
        array: [...arr],
        currentMin: min,
        currentMax: max,
        currentIndex: i,
        minIndex,
        maxIndex,
        comparing: [i],
        explanation: `Kiểm tra phần tử ${arr[i]} tại vị trí ${i}`
      });

      const oldMin = min;
      const oldMax = max;
      
      if (arr[i] < min) {
        min = arr[i];
        minIndex = i;
      }
      if (arr[i] > max) {
        max = arr[i];
        maxIndex = i;
      }

      let explanation = '';
      if (arr[i] < oldMin && arr[i] > oldMax) {
        explanation = `${arr[i]} là min mới`;
      } else if (arr[i] > oldMax && arr[i] >= oldMin) {
        explanation = `${arr[i]} là max mới`;
      } else if (arr[i] < oldMin) {
        explanation = `${arr[i]} là min mới`;
      } else if (arr[i] > oldMax) {
        explanation = `${arr[i]} là max mới`;
      } else {
        explanation = `${arr[i]} không thay đổi min/max`;
      }

      steps.push({
        array: [...arr],
        currentMin: min,
        currentMax: max,
        currentIndex: i,
        minIndex,
        maxIndex,
        comparing: [],
        explanation
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
          comparing: [start],
          explanation: `Phần tử đơn tại vị trí ${start}: ${arr[start]}`
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
          comparing: [start, end],
          explanation: `So sánh cặp [${start},${end}]: min=${min}, max=${max}`
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
        comparing: [left.minIndex, left.maxIndex, right.minIndex, right.maxIndex],
        explanation: `Trộn kết quả: min=${finalMin}, max=${finalMax}`
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
          comparing: [start],
          explanation: `Phần tử đơn tại ${start}: ${arr[start]}`
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
          comparing: [start, end],
          explanation: `So sánh [${start},${end}]: min=${min}, max=${max}`
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
        comparing: Array.from({ length: end - start + 1 }, (_, i) => start + i),
        explanation: `Chia đoạn [${start},${end}] tại vị trí ${mid}`
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
        comparing: [left.minIndex, left.maxIndex, right.minIndex, right.maxIndex],
        explanation: `Kết hợp: min=${finalMin}, max=${finalMax}`
      });

      return { min: finalMin, max: finalMax, minIndex: finalMinIndex, maxIndex: finalMaxIndex };
    }

    dcHelper(0, arr.length - 1);
    return steps;
  }
}

// Delay function for animations
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
