/**
 * Test Cases for Algorithm Visualizers
 * Generates best, average, and worst case scenarios for different algorithms
 */

import { generateUniqueRandomArray } from './algorithmUtils';

export type TestCaseType = 'best' | 'average' | 'worst';

export interface TestCase {
  name: string;
  description: string;
  generate: (size: number) => number[];
}

/**
 * SORTING ALGORITHM TEST CASES
 */

export const SORTING_TEST_CASES: Record<string, Record<TestCaseType, TestCase>> = {
  'bubble-sort': {
    best: {
      name: 'Mảng Đã Sắp Xếp',
      description: 'Mảng đã được sắp xếp tăng dần - O(n)',
      generate: (size: number) => {
        return Array.from({ length: size }, (_, i) => (i + 1) * 5);
      }
    },
    average: {
      name: 'Mảng Ngẫu Nhiên',
      description: 'Mảng với thứ tự ngẫu nhiên - O(n²)',
      generate: (size: number) => {
        return generateUniqueRandomArray(size, 5, 95);
      }
    },
    worst: {
      name: 'Mảng Đảo Ngược',
      description: 'Mảng sắp xếp giảm dần - O(n²)',
      generate: (size: number) => {
        return Array.from({ length: size }, (_, i) => (size - i) * 5);
      }
    }
  },

  'selection-sort': {
    best: {
      name: 'Mảng Đã Sắp Xếp',
      description: 'Mảng đã được sắp xếp tăng dần - O(n²)',
      generate: (size: number) => {
        return Array.from({ length: size }, (_, i) => (i + 1) * 5);
      }
    },
    average: {
      name: 'Mảng Ngẫu Nhiên',
      description: 'Mảng với thứ tự ngẫu nhiên - O(n²)',
      generate: (size: number) => {
        return generateUniqueRandomArray(size, 5, 95);
      }
    },
    worst: {
      name: 'Mảng Đảo Ngược',
      description: 'Mảng sắp xếp giảm dần - O(n²)',
      generate: (size: number) => {
        return Array.from({ length: size }, (_, i) => (size - i) * 5);
      }
    }
  },

  'insertion-sort': {
    best: {
      name: 'Mảng Đã Sắp Xếp',
      description: 'Mảng đã được sắp xếp tăng dần - O(n)',
      generate: (size: number) => {
        return Array.from({ length: size }, (_, i) => (i + 1) * 5);
      }
    },
    average: {
      name: 'Mảng Ngẫu Nhiên',
      description: 'Mảng với thứ tự ngẫu nhiên - O(n²)',
      generate: (size: number) => {
        return generateUniqueRandomArray(size, 5, 95);
      }
    },
    worst: {
      name: 'Mảng Đảo Ngược',
      description: 'Mảng sắp xếp giảm dần - O(n²)',
      generate: (size: number) => {
        return Array.from({ length: size }, (_, i) => (size - i) * 5);
      }
    }
  },

  'quick-sort': {
    best: {
      name: 'Mảng Cân Bằng',
      description: 'Pivot luôn ở giữa sau mỗi lần phân hoạch - O(n log n)',
      generate: (size: number) => {
        // Generate array that results in balanced partitions
        return generateUniqueRandomArray(size, 5, 95);
      }
    },
    average: {
      name: 'Mảng Ngẫu Nhiên',
      description: 'Mảng với thứ tự ngẫu nhiên - O(n log n)',
      generate: (size: number) => {
        return generateUniqueRandomArray(size, 5, 95);
      }
    },
    worst: {
      name: 'Mảng Đã Sắp Xếp',
      description: 'Mảng đã sắp xếp với pivot cuối - O(n²)',
      generate: (size: number) => {
        return Array.from({ length: size }, (_, i) => (i + 1) * 5);
      }
    }
  },

  'merge-sort': {
    best: {
      name: 'Bất Kỳ Mảng Nào',
      description: 'Merge Sort luôn O(n log n) - không phụ thuộc đầu vào',
      generate: (size: number) => {
        return generateUniqueRandomArray(size, 5, 95);
      }
    },
    average: {
      name: 'Mảng Ngẫu Nhiên',
      description: 'Mảng với thứ tự ngẫu nhiên - O(n log n)',
      generate: (size: number) => {
        return generateUniqueRandomArray(size, 5, 95);
      }
    },
    worst: {
      name: 'Mảng Đảo Ngược',
      description: 'Merge Sort vẫn O(n log n) nhưng nhiều merge - O(n log n)',
      generate: (size: number) => {
        return Array.from({ length: size }, (_, i) => (size - i) * 5);
      }
    }
  }
};

/**
 * SEARCHING ALGORITHM TEST CASES
 */

export const SEARCHING_TEST_CASES: Record<string, Record<TestCaseType, TestCase>> = {
  'linear-search': {
    best: {
      name: 'Phần Tử Đầu Tiên',
      description: 'Tìm phần tử ở vị trí đầu - O(1)',
      generate: (size: number) => {
        return Array.from({ length: size }, (_, i) => (i + 1) * 5).sort((a, b) => a - b);
      }
    },
    average: {
      name: 'Phần Tử Ở Giữa',
      description: 'Tìm phần tử ở giữa mảng - O(n/2)',
      generate: (size: number) => {
        return Array.from({ length: size }, (_, i) => (i + 1) * 5).sort((a, b) => a - b);
      }
    },
    worst: {
      name: 'Phần Tử Cuối Cùng',
      description: 'Tìm phần tử ở cuối hoặc không tồn tại - O(n)',
      generate: (size: number) => {
        return Array.from({ length: size }, (_, i) => (i + 1) * 5).sort((a, b) => a - b);
      }
    }
  },

  'binary-search': {
    best: {
      name: 'Phần Tử Ở Giữa',
      description: 'Tìm phần tử ở chính giữa mảng - O(1)',
      generate: (size: number) => {
        return Array.from({ length: size }, (_, i) => (i + 1) * 5).sort((a, b) => a - b);
      }
    },
    average: {
      name: 'Mảng Cân Bằng',
      description: 'Tìm phần tử cần vài lần chia đôi - O(log n)',
      generate: (size: number) => {
        return Array.from({ length: size }, (_, i) => (i + 1) * 5).sort((a, b) => a - b);
      }
    },
    worst: {
      name: 'Phần Tử Ở Đầu/Cuối',
      description: 'Tìm phần tử ở đầu hoặc cuối - O(log n)',
      generate: (size: number) => {
        return Array.from({ length: size }, (_, i) => (i + 1) * 5).sort((a, b) => a - b);
      }
    }
  },

  'jump-search': {
    best: {
      name: 'Phần Tử Tại Jump Point',
      description: 'Tìm phần tử ngay tại điểm nhảy - O(1)',
      generate: (size: number) => {
        return Array.from({ length: size }, (_, i) => (i + 1) * 5).sort((a, b) => a - b);
      }
    },
    average: {
      name: 'Mảng Đều',
      description: 'Tìm phần tử trong block - O(√n)',
      generate: (size: number) => {
        return Array.from({ length: size }, (_, i) => (i + 1) * 5).sort((a, b) => a - b);
      }
    },
    worst: {
      name: 'Phần Tử Cuối Block',
      description: 'Tìm phần tử cuối mỗi block - O(√n)',
      generate: (size: number) => {
        return Array.from({ length: size }, (_, i) => (i + 1) * 5).sort((a, b) => a - b);
      }
    }
  },

  'interpolation-search': {
    best: {
      name: 'Phân Bố Đều - Target Gần',
      description: 'Mảng phân bố đều, target dự đoán chính xác - O(1)',
      generate: (size: number) => {
        return Array.from({ length: size }, (_, i) => (i + 1) * 5).sort((a, b) => a - b);
      }
    },
    average: {
      name: 'Phân Bố Đều',
      description: 'Mảng phân bố đều - O(log log n)',
      generate: (size: number) => {
        return Array.from({ length: size }, (_, i) => (i + 1) * 5).sort((a, b) => a - b);
      }
    },
    worst: {
      name: 'Phân Bố Không Đều',
      description: 'Mảng phân bố không đều - O(n)',
      generate: (size: number) => {
        // Create non-uniform distribution
        const arr = Array.from({ length: size }, (_, i) => {
          if (i < size / 2) return i * 2 + 10;
          return 10 + (size / 2) * 2 + (i - size / 2) * 20;
        });
        return arr.sort((a, b) => a - b);
      }
    }
  }
};

/**
 * EXTREME VALUE ALGORITHM TEST CASES
 */

export const EXTREME_TEST_CASES: Record<string, Record<TestCaseType, TestCase>> = {
  'linear-min-max': {
    best: {
      name: 'Min/Max Ở Đầu',
      description: 'Min và Max ở 2 vị trí đầu tiên - O(n)',
      generate: (size: number) => {
        const arr = generateUniqueRandomArray(size - 2, 20, 80);
        return [10, 90, ...arr];
      }
    },
    average: {
      name: 'Mảng Ngẫu Nhiên',
      description: 'Min và Max ở vị trí ngẫu nhiên - O(n)',
      generate: (size: number) => {
        return generateUniqueRandomArray(size, 10, 90);
      }
    },
    worst: {
      name: 'Min/Max Ở Cuối',
      description: 'Min và Max ở cuối mảng - O(n)',
      generate: (size: number) => {
        const arr = generateUniqueRandomArray(size - 2, 20, 80);
        return [...arr, 10, 90];
      }
    }
  },

  'divide-conquer-minmax': {
    best: {
      name: 'Mảng Cân Bằng',
      description: 'Cây divide & conquer cân bằng - O(n)',
      generate: (size: number) => {
        return generateUniqueRandomArray(size, 10, 90);
      }
    },
    average: {
      name: 'Mảng Ngẫu Nhiên',
      description: 'Mảng với giá trị ngẫu nhiên - O(n)',
      generate: (size: number) => {
        return generateUniqueRandomArray(size, 10, 90);
      }
    },
    worst: {
      name: 'Mảng Sắp Xếp',
      description: 'Mảng đã sắp xếp - vẫn O(n) nhưng nhiều so sánh hơn',
      generate: (size: number) => {
        return Array.from({ length: size }, (_, i) => (i + 1) * 5);
      }
    }
  }
};

/**
 * Get target value for search algorithms based on test case type
 */
export function getSearchTarget(array: number[], testCaseType: TestCaseType): number {
  if (array.length === 0) return 0;

  switch (testCaseType) {
    case 'best':
      // For linear search: first element
      // For binary search: middle element
      return array[Math.floor(array.length / 2)];
    
    case 'average':
      // Element somewhere in the array
      return array[Math.floor(array.length * 0.6)];
    
    case 'worst':
      // For linear search: last element
      // For binary/jump search: first or last element
      return array[array.length - 1];
    
    default:
      return array[0];
  }
}

/**
 * Adjust search target for specific algorithms
 */
export function getAlgorithmSpecificTarget(
  algorithm: string,
  array: number[],
  testCaseType: TestCaseType
): number {
  if (array.length === 0) return 0;

  switch (algorithm) {
    case 'linear-search':
      if (testCaseType === 'best') return array[0]; // First element
      if (testCaseType === 'average') return array[Math.floor(array.length / 2)];
      return array[array.length - 1]; // Last element

    case 'binary-search':
      if (testCaseType === 'best') return array[Math.floor(array.length / 2)]; // Middle
      if (testCaseType === 'average') return array[Math.floor(array.length * 0.7)];
      return array[0]; // First element (worst for binary search with many divisions)

    case 'jump-search':
      const jumpSize = Math.floor(Math.sqrt(array.length));
      if (testCaseType === 'best') return array[jumpSize - 1]; // At jump point
      if (testCaseType === 'average') return array[Math.floor(array.length / 2)];
      return array[jumpSize * 2 - 1]; // End of a block

    case 'interpolation-search':
      if (testCaseType === 'best') return array[Math.floor(array.length / 2)];
      if (testCaseType === 'average') return array[Math.floor(array.length * 0.6)];
      return array[array.length - 1];

    default:
      return getSearchTarget(array, testCaseType);
  }
}

