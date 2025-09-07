import { Algorithm } from '@/types/algorithm';

export const algorithms: Record<string, Algorithm[]> = {
  sorting: [
    {
      id: 'bubble-sort',
      name: 'Bubble Sort',
      category: 'sorting',
      timeComplexity: {
        best: 'O(n)',
        average: 'O(n²)',
        worst: 'O(n²)'
      },
      spaceComplexity: 'O(1)',
      description: 'Bubble Sort là thuật toán sắp xếp đơn giản hoạt động bằng cách lặp qua mảng và so sánh các cặp phần tử liền kề, hoán đổi chúng nếu chúng không đúng thứ tự. Quá trình này được lặp lại cho đến khi không còn hoán đổi nào xảy ra. Tên gọi "bubble" (bong bóng) xuất phát từ cách các phần tử nhỏ "nổi" lên đầu mảng như bong bóng nước.',
      applications: [
        'Tập dữ liệu nhỏ hoặc dữ liệu gần như đã được sắp xếp',
        'Mục đích giáo dục để hiểu khái niệm sắp xếp',
        'Khi tính đơn giản quan trọng hơn hiệu suất',
        'Làm thủ tục con trong các thuật toán phức tạp hơn'
      ],
      difficulty: 'Dễ',
      code: `function bubbleSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        // Swap elements
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}`
    },
    {
      id: 'selection-sort',
      name: 'Selection Sort',
      category: 'sorting',
      timeComplexity: {
        best: 'O(n²)',
        average: 'O(n²)',
        worst: 'O(n²)'
      },
      spaceComplexity: 'O(1)',
      description: 'Selection Sort chia danh sách đầu vào thành hai phần: phần đã sắp xếp ở bên trái và phần chưa sắp xếp ở bên phải. Ban đầu, phần đã sắp xếp rỗng và phần chưa sắp xếp là toàn bộ danh sách. Thuật toán liên tục chọn phần tử nhỏ nhất từ phần chưa sắp xếp và di chuyển nó đến cuối phần đã sắp xếp.',
      applications: [
        'Tập dữ liệu nhỏ khi tính đơn giản quan trọng',
        'Môi trường bị hạn chế bộ nhớ',
        'Khi cần giảm thiểu số lần ghi',
        'Mục đích giáo dục'
      ],
      difficulty: 'Dễ',
      code: `function selectionSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let minIndex = i;
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIndex]) {
        minIndex = j;
      }
    }
    if (minIndex !== i) {
      [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
    }
  }
  return arr;
}`
    },
    {
      id: 'insertion-sort',
      name: 'Insertion Sort',
      category: 'sorting',
      timeComplexity: {
        best: 'O(n)',
        average: 'O(n²)',
        worst: 'O(n²)'
      },
      spaceComplexity: 'O(1)',
      description: 'Insertion Sort lặp qua mảng và tại mỗi lần lặp, nó lấy một phần tử, tìm vị trí phù hợp của nó và chèn nó vào đó. Mặc dù có độ phức tạp thời gian trung bình O(n²), nó hoạt động cực kỳ tốt trên các mảng nhỏ hoặc gần như đã được sắp xếp với hiệu suất trường hợp tốt nhất O(n).',
      applications: [
        'Tập dữ liệu nhỏ hoặc dữ liệu gần như đã sắp xếp',
        'Sắp xếp trực tuyến (sắp xếp dữ liệu khi nó đến)',
        'Làm thủ tục con trong các thuật toán lai như Timsort',
        'Khi cần hành vi thích ứng'
      ],
      difficulty: 'Dễ',
      code: `function insertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    let key = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = key;
  }
  return arr;
}`
    },
    {
      id: 'quick-sort',
      name: 'Quick Sort',
      category: 'sorting',
      timeComplexity: {
        best: 'O(n log n)',
        average: 'O(n log n)',
        worst: 'O(n²)'
      },
      spaceComplexity: 'O(log n)',
      description: 'Quick Sort là thuật toán chia để trị chọn một phần tử làm pivot và phân vùng mảng xung quanh nó. Các phần tử nhỏ hơn pivot đi về bên trái, và các phần tử lớn hơn đi về bên phải. Thuật toán sau đó đệ quy sắp xếp các mảng con.',
      applications: [
        'Sắp xếp đa năng trong hầu hết ngôn ngữ lập trình',
        'Tập dữ liệu lớn khi hiệu suất trường hợp trung bình quan trọng',
        'Yêu cầu sắp xếp tại chỗ',
        'Sắp xếp hiệu quả với cache'
      ],
      difficulty: 'Trung Bình',
      code: `function quickSort(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    const pivotIndex = partition(arr, low, high);
    quickSort(arr, low, pivotIndex - 1);
    quickSort(arr, pivotIndex + 1, high);
  }
  return arr;
}

function partition(arr, low, high) {
  const pivot = arr[high];
  let i = low - 1;
  
  for (let j = low; j < high; j++) {
    if (arr[j] <= pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return i + 1;
}`
    },
    {
      id: 'merge-sort',
      name: 'Merge Sort',
      category: 'sorting',
      timeComplexity: {
        best: 'O(n log n)',
        average: 'O(n log n)',
        worst: 'O(n log n)'
      },
      spaceComplexity: 'O(n)',
      description: 'Merge Sort là thuật toán chia để trị chia mảng thành hai nửa, sắp xếp chúng riêng biệt, và sau đó gộp chúng lại với nhau. Nó đảm bảo độ phức tạp thời gian O(n log n) trong tất cả trường hợp và có tính ổn định.',
      applications: [
        'Tập dữ liệu lớn yêu cầu sắp xếp ổn định',
        'Sắp xếp ngoài (sắp xếp dữ liệu không vừa trong bộ nhớ)',
        'Cần đảm bảo hiệu suất O(n log n)',
        'Môi trường xử lý song song'
      ],
      difficulty: 'Trung Bình',
      code: `function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  
  return merge(left, right);
}

function merge(left, right) {
  const result = [];
  let i = 0, j = 0;
  
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      result.push(left[i]);
      i++;
    } else {
      result.push(right[j]);
      j++;
    }
  }
  
  return result.concat(left.slice(i)).concat(right.slice(j));
}`
    }
  ],
  searching: [
    {
      id: 'linear-search',
      name: 'Linear Search',
      category: 'searching',
      timeComplexity: {
        best: 'O(1)',
        average: 'O(n)',
        worst: 'O(n)'
      },
      spaceComplexity: 'O(1)',
      description: 'Linear Search kiểm tra từng phần tử trong mảng tuần tự cho đến khi tìm thấy phần tử đích hoặc đến cuối mảng. Đây là thuật toán tìm kiếm đơn giản nhất và hoạt động trên cả mảng đã sắp xếp và chưa sắp xếp.',
      applications: [
        'Tập dữ liệu chưa được sắp xếp',
        'Tập dữ liệu nhỏ khi tính đơn giản quan trọng',
        'Khi các phần tử cần được truy cập tuần tự',
        'Tìm tất cả các lần xuất hiện của một phần tử'
      ],
      difficulty: 'Dễ',
      code: `function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) {
      return i; // Element found at index i
    }
  }
  return -1; // Element not found
}`
    },
    {
      id: 'binary-search',
      name: 'Binary Search',
      category: 'searching',
      timeComplexity: {
        best: 'O(1)',
        average: 'O(log n)',
        worst: 'O(log n)'
      },
      spaceComplexity: 'O(1)',
      description: 'Binary Search hoạt động trên các mảng đã sắp xếp bằng cách liên tục chia không gian tìm kiếm làm đôi. Nó so sánh mục tiêu với phần tử giữa và loại bỏ một nửa các phần tử còn lại ở mỗi bước.',
      applications: [
        'Tập dữ liệu đã được sắp xếp',
        'Tập dữ liệu lớn yêu cầu tìm kiếm nhanh',
        'Lập chỉ mục cơ sở dữ liệu',
        'Tìm điểm chèn cho các phần tử mới'
      ],
      difficulty: 'Trung Bình',
      code: `function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    
    if (arr[mid] === target) {
      return mid; // Element found
    } else if (arr[mid] < target) {
      left = mid + 1; // Search right half
    } else {
      right = mid - 1; // Search left half
    }
  }
  
  return -1; // Element not found
}`
    }
  ],
  extreme: [
    {
      id: 'linear-min-max',
      name: 'Linear Min/Max',
      category: 'extreme',
      timeComplexity: {
        best: 'O(n)',
        average: 'O(n)',
        worst: 'O(n)'
      },
      spaceComplexity: 'O(1)',
      description: 'Thuật toán Linear Min/Max quét qua toàn bộ mảng một lần để tìm giá trị nhỏ nhất và lớn nhất. Nó đơn giản và hiệu quả cho nhiệm vụ cụ thể này.',
      applications: [
        'Phân tích thống kê',
        'Tiền xử lý dữ liệu',
        'Xác thực phạm vi',
        'Thiết lập giới hạn hiển thị cho trực quan hóa'
      ],
      difficulty: 'Dễ',
      code: `function findMinMax(arr) {
  if (arr.length === 0) return null;
  
  let min = arr[0];
  let max = arr[0];
  
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < min) {
      min = arr[i];
    }
    if (arr[i] > max) {
      max = arr[i];
    }
  }
  
  return { min, max };
}`
    },
    {
      id: 'tournament-method',
      name: 'Tournament',
      category: 'extreme',
      timeComplexity: {
        best: 'O(n)',
        average: 'O(n)',
        worst: 'O(n)'
      },
      spaceComplexity: 'O(log n)',
      description: 'Phương pháp Tournament tìm min/max bằng cách ghép cặp các phần tử và so sánh chúng trong cấu trúc giống như giải đấu. Nó giảm số lần so sánh cần thiết và có thể dễ dàng song song hóa.',
      applications: [
        'Môi trường xử lý song song',
        'Khi việc giảm thiểu so sánh quan trọng',
        'Triển khai phần cứng',
        'Tìm cả min và max đồng thời'
      ],
      difficulty: 'Trung Bình',
      code: `function tournamentMinMax(arr) {
  if (arr.length === 0) return null;
  if (arr.length === 1) return { min: arr[0], max: arr[0] };
  
  function tournamentHelper(start, end) {
    if (start === end) {
      return { min: arr[start], max: arr[start] };
    }
    
    if (end - start === 1) {
      return {
        min: Math.min(arr[start], arr[end]),
        max: Math.max(arr[start], arr[end])
      };
    }
    
    const mid = Math.floor((start + end) / 2);
    const left = tournamentHelper(start, mid);
    const right = tournamentHelper(mid + 1, end);
    
    return {
      min: Math.min(left.min, right.min),
      max: Math.max(left.max, right.max)
    };
  }
  
  return tournamentHelper(0, arr.length - 1);
}`
    }
  ]
};
