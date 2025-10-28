/**
 * Test Cases for Algorithm Visualizers
 * Fixed arrays with appropriate sizes to demonstrate time complexity scenarios
 */

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
      description: 'Mảng đã được sắp xếp tăng dần - O(n) - Không cần swap, chỉ duyệt 1 lần',
      generate: () => {
        // Mảng 12 phần tử đã sắp xếp - Best case vì không cần swap
        return [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60];
      }
    },
    average: {
      name: 'Mảng Ngẫu Nhiên',
      description: 'Mảng với thứ tự ngẫu nhiên - O(n²) - Cần nhiều lần swap và so sánh',
      generate: () => {
        // Mảng 12 phần tử ngẫu nhiên - Average case
        return [35, 10, 55, 25, 60, 15, 40, 5, 50, 30, 20, 45];
      }
    },
    worst: {
      name: 'Mảng Đảo Ngược',
      description: 'Mảng sắp xếp giảm dần - O(n²) - Phải swap tất cả các cặp',
      generate: () => {
        // Mảng 12 phần tử đảo ngược hoàn toàn - Worst case
        return [60, 55, 50, 45, 40, 35, 30, 25, 20, 15, 10, 5];
      }
    }
  },

  'selection-sort': {
    best: {
      name: 'Mảng Đã Sắp Xếp',
      description: 'Mảng đã được sắp xếp tăng dần - O(n²) - Vẫn phải duyệt toàn bộ để tìm min',
      generate: () => {
        // Selection Sort luôn O(n²) dù mảng đã sắp xếp
        return [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60];
      }
    },
    average: {
      name: 'Mảng Ngẫu Nhiên',
      description: 'Mảng với thứ tự ngẫu nhiên - O(n²) - Luôn phải tìm min trong phần chưa sắp xếp',
      generate: () => {
        // Mảng 12 phần tử ngẫu nhiên
        return [35, 10, 55, 25, 60, 15, 40, 5, 50, 30, 20, 45];
      }
    },
    worst: {
      name: 'Mảng Đảo Ngược',
      description: 'Mảng sắp xếp giảm dần - O(n²) - Vẫn phải duyệt và tìm min như bình thường',
      generate: () => {
        // Selection Sort vẫn O(n²) với mảng đảo ngược
        return [60, 55, 50, 45, 40, 35, 30, 25, 20, 15, 10, 5];
      }
    }
  },

  'insertion-sort': {
    best: {
      name: 'Mảng Đã Sắp Xếp',
      description: 'Mảng đã được sắp xếp tăng dần - O(n) - Mỗi phần tử chỉ so sánh 1 lần',
      generate: () => {
        // Mảng 12 phần tử đã sắp xếp - Best case cho Insertion Sort
        return [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60];
      }
    },
    average: {
      name: 'Mảng Ngẫu Nhiên',
      description: 'Mảng với thứ tự ngẫu nhiên - O(n²) - Phần tử cần dịch chuyển trung bình',
      generate: () => {
        // Mảng 12 phần tử với một số phần tử đã gần đúng vị trí
        return [10, 25, 15, 35, 20, 50, 30, 60, 40, 45, 5, 55];
      }
    },
    worst: {
      name: 'Mảng Đảo Ngược',
      description: 'Mảng sắp xếp giảm dần - O(n²) - Mỗi phần tử phải dịch về đầu mảng',
      generate: () => {
        // Mảng 12 phần tử đảo ngược - Worst case cho Insertion Sort
        return [60, 55, 50, 45, 40, 35, 30, 25, 20, 15, 10, 5];
      }
    }
  },

  'quick-sort': {
    best: {
      name: 'Pivot Chia Đôi Hoàn Hảo',
      description: 'Pivot luôn chia đôi mảng - O(n log n) - Mỗi lần partition tạo 2 nửa bằng nhau',
      generate: () => {
        // Mảng 15 phần tử được thiết kế để pivot (phần tử cuối) luôn ở chính giữa
        // Pivot = 40 (cuối cùng): 7 phần tử < 40, và 7 phần tử > 40
        // [20, 10, 50, 5, 30, 60, 15, 35, 25, 70, 45, 55, 65, 75, 40]
        // Sau partition: [20,10,5,30,15,35,25] + 40 + [50,60,70,45,55,65,75]
        // Mỗi nửa tiếp tục được chia đều tương tự → cây đệ quy cân bằng hoàn hảo
        return [20, 10, 50, 5, 30, 60, 15, 35, 25, 70, 45, 55, 65, 75, 40];
      }
    },
    average: {
      name: 'Mảng Ngẫu Nhiên',
      description: 'Mảng ngẫu nhiên - O(n log n) - Pivot chia không hoàn hảo nhưng chấp nhận được',
      generate: () => {
        // Mảng 15 phần tử với thứ tự ngẫu nhiên thực tế
        // Pivot không phải lúc nào cũng ở giữa, tạo partitions không cân bằng hoàn toàn
        // Nhưng trung bình vẫn đạt O(n log n)
        return [35, 10, 55, 25, 70, 15, 50, 5, 65, 30, 20, 60, 45, 40, 75];
      }
    },
    worst: {
      name: 'Mảng Đã Sắp Xếp',
      description: 'Mảng đã sắp xếp với pivot cuối - O(n²) - Pivot luôn là max, tạo partition 0-(n-1)',
      generate: () => {
        // Mảng 15 phần tử đã sắp xếp - Worst case cho Quick Sort với last pivot
        // Mỗi lần partition: pivot (cuối) là phần tử lớn nhất
        // → Tất cả phần tử khác đều nhỏ hơn → partition: (n-1) phần tử + pivot + 0 phần tử
        // → Độ sâu đệ quy = n thay vì log n → O(n²)
        return [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75];
      }
    }
  },

  'merge-sort': {
    best: {
      name: 'Mảng Bất Kỳ',
      description: 'Merge Sort luôn O(n log n) - Luôn chia đôi và merge',
      generate: () => {
        // Mảng 16 phần tử (2^4) - tối ưu cho cây nhị phân
        return [40, 20, 60, 10, 30, 50, 70, 5, 45, 25, 65, 15, 35, 55, 75, 80];
      }
    },
    average: {
      name: 'Mảng Ngẫu Nhiên',
      description: 'Mảng với thứ tự ngẫu nhiên - O(n log n) - Không ảnh hưởng độ phức tạp',
      generate: () => {
        // Mảng 16 phần tử ngẫu nhiên
        return [35, 10, 55, 25, 70, 15, 50, 5, 65, 30, 45, 20, 60, 40, 75, 80];
      }
    },
    worst: {
      name: 'Mảng Đảo Ngược',
      description: 'Merge Sort vẫn O(n log n) - Số lần merge giống nhau',
      generate: () => {
        // Mảng 16 phần tử đảo ngược - vẫn O(n log n)
        return [80, 75, 70, 65, 60, 55, 50, 45, 40, 35, 30, 25, 20, 15, 10, 5];
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
      description: 'Tìm phần tử ở vị trí đầu - O(1) - Tìm thấy ngay lần so sánh đầu tiên',
      generate: () => {
        // Mảng 10 phần tử - target sẽ là phần tử đầu tiên (5)
        return [5, 10, 15, 20, 25, 30, 35, 40, 45, 50];
      }
    },
    average: {
      name: 'Phần Tử Ở Giữa',
      description: 'Tìm phần tử ở giữa mảng - O(n/2) - Duyệt khoảng một nửa mảng',
      generate: () => {
        // Mảng 10 phần tử - target sẽ là phần tử ở giữa (30)
        return [5, 10, 15, 20, 25, 30, 35, 40, 45, 50];
      }
    },
    worst: {
      name: 'Phần Tử Cuối Cùng',
      description: 'Tìm phần tử ở cuối - O(n) - Phải duyệt toàn bộ mảng',
      generate: () => {
        // Mảng 10 phần tử - target sẽ là phần tử cuối cùng (50)
        return [5, 10, 15, 20, 25, 30, 35, 40, 45, 50];
      }
    }
  },

  'binary-search': {
    best: {
      name: 'Phần Tử Ở Giữa',
      description: 'Tìm phần tử ở chính giữa mảng - O(1) - Tìm thấy ngay lần chia đầu tiên',
      generate: () => {
        // Mảng 15 phần tử đã sắp xếp - target sẽ là phần tử giữa (40)
        return [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75];
      }
    },
    average: {
      name: 'Phần Tử Cần Vài Lần Chia',
      description: 'Tìm phần tử cần 2-3 lần chia đôi - O(log n) - Chia đôi vài lần',
      generate: () => {
        // Mảng 15 phần tử - target sẽ ở vị trí cần 2-3 lần chia (60)
        return [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75];
      }
    },
    worst: {
      name: 'Phần Tử Ở Đầu/Cuối',
      description: 'Tìm phần tử ở đầu hoặc cuối - O(log n) - Cần tối đa log n lần chia',
      generate: () => {
        // Mảng 15 phần tử - target sẽ là phần tử đầu (5) hoặc cuối
        return [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75];
      }
    }
  },

  'jump-search': {
    best: {
      name: 'Phần Tử Tại Jump Point',
      description: 'Tìm phần tử ngay tại điểm nhảy - O(1) - Không cần tìm kiếm tuyến tính',
      generate: () => {
        // Mảng 16 phần tử (jump size = 4) - target tại jump point (20)
        return [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80];
      }
    },
    average: {
      name: 'Phần Tử Trong Block',
      description: 'Tìm phần tử trong block - O(√n) - Nhảy + tìm kiếm tuyến tính',
      generate: () => {
        // Mảng 16 phần tử (jump size = 4) - target trong block (47)
        return [5, 10, 15, 20, 25, 30, 35, 40, 45, 47, 55, 60, 65, 70, 75, 80];
      }
    },
    worst: {
      name: 'Phần Tử Cuối Block',
      description: 'Tìm phần tử cuối block - O(√n) - Nhảy nhiều lần + duyệt block',
      generate: () => {
        // Mảng 16 phần tử - target ở cuối block (80)
        return [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80];
      }
    }
  },

  'interpolation-search': {
    best: {
      name: 'Phân Bố Đều - Target Chính Xác',
      description: 'Mảng phân bố đều, dự đoán chính xác - O(1) - Tính toán ra đúng vị trí',
      generate: () => {
        // Mảng 10 phần tử phân bố đều (khoảng cách 10) - target (50) dễ dự đoán
        return [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
      }
    },
    average: {
      name: 'Phân Bố Đều',
      description: 'Mảng phân bố đều - O(log log n) - Dự đoán tốt, hội tụ nhanh',
      generate: () => {
        // Mảng 10 phần tử phân bố đều - target (70) cần vài lần dự đoán
        return [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
      }
    },
    worst: {
      name: 'Phân Bố Cực Kỳ Không Đều',
      description: 'Mảng có giá trị nhỏ và 1 giá trị cực lớn - O(n) - Phải duyệt tuần tự như Linear Search',
      generate: () => {
        // Mảng 12 phần tử: 11 giá trị nhỏ liên tiếp (1-11) và 1 giá trị cực lớn (10000)
        // Target = 11 (phần tử gần cuối nhưng giá trị nhỏ)
        // Do arr[11] = 10000 quá lớn, công thức interpolation luôn dự đoán vị trí ở đầu mảng
        // Thuật toán phải duyệt tuần tự từ index 0 -> 10 như Linear Search
        // Công thức: pos = low + [(11 - arr[low]) * (high - low) / (10000 - arr[low])]
        // Với target = 11 và arr[high] = 10000, pos luôn ≈ low, phải tăng low từng bước
        return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 10000];
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
      description: 'Min và Max ở 2 vị trí đầu - O(n) - Vẫn phải duyệt hết để chắc chắn',
      generate: () => {
        // Mảng 12 phần tử - Min (5) và Max (95) ở đầu nhưng vẫn phải duyệt hết
        return [5, 95, 30, 45, 20, 65, 40, 75, 25, 55, 35, 50];
      }
    },
    average: {
      name: 'Mảng Ngẫu Nhiên',
      description: 'Min và Max ở vị trí ngẫu nhiên - O(n) - Duyệt toàn bộ mảng',
      generate: () => {
        // Mảng 12 phần tử ngẫu nhiên - Min (5) và Max (95) ở giữa
        return [30, 45, 20, 65, 5, 40, 75, 95, 25, 55, 35, 50];
      }
    },
    worst: {
      name: 'Min/Max Ở Cuối',
      description: 'Min và Max ở cuối mảng - O(n) - Update giá trị min/max nhiều lần',
      generate: () => {
        // Mảng 12 phần tử - Min (5) và Max (95) ở cuối, cập nhật nhiều lần
        return [30, 45, 20, 65, 40, 75, 25, 55, 35, 50, 5, 95];
      }
    }
  },

  'tournament-method': {
    best: {
      name: 'Mảng Lũy Thừa 2',
      description: 'Kích thước 2^n - Cây tournament hoàn hảo - O(n) với 3n/2 - 2 so sánh',
      generate: () => {
        // Mảng 16 phần tử (2^4) - Cây tournament cân bằng hoàn hảo
        return [45, 20, 75, 10, 60, 35, 85, 5, 50, 25, 70, 15, 55, 30, 80, 95];
      }
    },
    average: {
      name: 'Mảng Kích Thước Bất Kỳ',
      description: 'Mảng kích thước bất kỳ - O(n) - Xử lý cả cặp và phần tử lẻ',
      generate: () => {
        // Mảng 14 phần tử - Không phải lũy thừa 2, cần xử lý phần tử lẻ
        return [45, 20, 75, 10, 60, 35, 85, 5, 50, 25, 70, 15, 55, 95];
      }
    },
    worst: {
      name: 'Mảng Lẻ',
      description: 'Kích thước lẻ - O(n) - Cần xử lý đặc biệt phần tử cuối',
      generate: () => {
        // Mảng 13 phần tử lẻ - Phần tử cuối không có cặp
        return [45, 20, 75, 10, 60, 35, 85, 5, 50, 25, 70, 15, 95];
      }
    }
  },

  'divide-conquer-minmax': {
    best: {
      name: 'Mảng Cân Bằng',
      description: 'Mảng lũy thừa 2 - O(n) - Cây đệ quy cân bằng, ít so sánh hơn',
      generate: () => {
        // Mảng 16 phần tử (2^4) - Chia đôi đệ quy cân bằng hoàn hảo
        return [45, 20, 75, 10, 60, 35, 85, 5, 50, 25, 70, 15, 55, 30, 80, 95];
      }
    },
    average: {
      name: 'Mảng Ngẫu Nhiên',
      description: 'Mảng với giá trị ngẫu nhiên - O(n) - 3n/2 - 2 so sánh',
      generate: () => {
        // Mảng 12 phần tử ngẫu nhiên
        return [45, 20, 75, 10, 60, 35, 85, 5, 50, 25, 70, 95];
      }
    },
    worst: {
      name: 'Mảng Sắp Xếp',
      description: 'Mảng đã sắp xếp - O(n) - Vẫn 3n/2 - 2 so sánh, không tối ưu hơn',
      generate: () => {
        // Mảng 12 phần tử đã sắp xếp - Min luôn ở nửa trái, Max ở nửa phải
        return [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60];
      }
    }
  }
};

/**
 * Get target value for search algorithms based on test case type
 * Returns the specific target value that demonstrates the complexity scenario
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
 * Adjust search target for specific algorithms with fixed arrays
 * Each algorithm has specific target values that best demonstrate their time complexity
 */
export function getAlgorithmSpecificTarget(
  algorithm: string,
  array: number[],
  testCaseType: TestCaseType
): number {
  if (array.length === 0) return 0;

  switch (algorithm) {
    case 'linear-search':
      // Linear Search với mảng cố định 10 phần tử: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50]
      if (testCaseType === 'best') return 5; // Phần tử đầu - O(1)
      if (testCaseType === 'average') return 30; // Phần tử giữa - O(n/2)
      return 50; // Phần tử cuối - O(n)

    case 'binary-search':
      // Binary Search với mảng cố định 15 phần tử: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75]
      if (testCaseType === 'best') return 40; // Phần tử giữa (index 7) - O(1)
      if (testCaseType === 'average') return 60; // Cần 2-3 lần chia - O(log n)
      return 5; // Phần tử đầu - cần log n lần chia

    case 'jump-search':
      // Jump Search với mảng cố định 16 phần tử, jump size = 4
      // [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80]
      if (testCaseType === 'best') return 20; // Tại jump point (index 3) - O(1)
      if (testCaseType === 'average') return 47; // Trong block - O(√n)
      return 80; // Cuối block - O(√n)

    case 'interpolation-search':
      // Interpolation Search với mảng phân bố đều/không đều
      if (testCaseType === 'best') return 50; // Mảng đều, dự đoán chính xác - O(1)
      if (testCaseType === 'average') return 70; // Mảng đều, cần vài lần - O(log log n)
      // Worst case: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 10000]
      // Tìm 11: Do 10000 quá lớn, interpolation luôn dự đoán vị trí ở đầu
      // Phải duyệt tuần tự từ 1->11, thoái hóa về O(n)
      return 11;

    default:
      return getSearchTarget(array, testCaseType);
  }
}

