/**
 * Comprehensive Algorithm Theory Database
 */

import { AlgorithmTheory } from '@/types/theory';

export const algorithmTheories: Record<string, AlgorithmTheory> = {
  'bubble-sort': {
    id: 'bubble-sort',
    name: 'Bubble Sort',
    category: 'sorting',
    
    timeComplexity: {
      best: {
        formula: '$O(n)$',
        bigO: 'O(n)',
        explanation: 'Đạt được khi mảng đã được sắp xếp, chỉ cần một lượt quét để xác nhận không có swap nào xảy ra.',
        proof: 'Với mảng đã sắp xếp, mỗi phần tử được so sánh đúng 1 lần, tổng n-1 so sánh.'
      },
      average: {
        formula: '$O(n^2)$',
        bigO: 'O(n²)',
        explanation: 'Trung bình cần n/2 lượt quét để hoàn thành, mỗi lượt có n-i so sánh.',
        proof: 'Tổng số so sánh: $\\sum_{i=1}^{n-1}(n-i) = \\frac{n(n-1)}{2} = O(n^2)$'
      },
      worst: {
        formula: '$O(n^2)$',
        bigO: 'O(n²)',
        explanation: 'Xảy ra khi mảng sắp xếp ngược, mỗi phần tử phải "nổi" lên vị trí đúng.',
        proof: 'Cần n-1 lượt quét đầy đủ, mỗi lượt $n-i$ so sánh: $\\frac{n(n-1)}{2}$ so sánh tổng.'
      }
    },
    
    spaceComplexity: {
      auxiliary: {
        formula: '$O(1)$',
        bigO: 'O(1)',
        explanation: 'Chỉ cần một số biến tạm để swap, không phụ thuộc vào kích thước đầu vào.',
      },
      total: {
        formula: '$O(n)$',
        bigO: 'O(n)',
        explanation: 'Bao gồm không gian lưu trữ của mảng đầu vào.',
      }
    },
    
    properties: {
      stable: true,
      inPlace: true,
      adaptive: true,
      online: false,
      recursive: false,
      comparison: true,
    },
    
    description: {
      overview: 'Bubble Sort là thuật toán sắp xếp đơn giản nhất, hoạt động bằng cách liên tục so sánh và hoán đổi các cặp phần tử liền kề nếu chúng sai thứ tự.',
      howItWorks: [
        'Bắt đầu từ đầu mảng, so sánh hai phần tử liền kề',
        'Nếu phần tử trước lớn hơn phần tử sau, hoán đổi chúng',
        'Di chuyển sang cặp tiếp theo và lặp lại cho đến cuối mảng',
        'Sau mỗi lượt, phần tử lớn nhất "nổi" lên cuối',
        'Lặp lại cho đến khi không còn hoán đổi nào xảy ra'
      ],
      keyInsights: [
        'Mỗi lượt đảm bảo ít nhất 1 phần tử ở đúng vị trí',
        'Có thể tối ưu bằng cách dừng sớm nếu không có swap',
        'Phần tử nhỏ di chuyển chậm (1 vị trí/lượt), phần tử lớn nhanh'
      ]
    },
    
    mathematics: {
      recurrenceRelation: '$T(n) = T(n-1) + O(n)$',
      invariants: [
        'Sau lượt thứ i, i phần tử lớn nhất đã ở vị trí cuối',
        'Các phần tử đã được sắp xếp luôn duy trì thứ tự'
      ]
    },
    
    practical: {
      bestUseCase: [
        'Mảng rất nhỏ (< 10 phần tử)',
        'Mảng gần như đã được sắp xếp',
        'Mục đích giáo dục',
        'Khi cần thuật toán đơn giản nhất'
      ],
      worstUseCase: [
        'Mảng lớn (> 1000 phần tử)',
        'Mảng ngẫu nhiên hoặc sắp xếp ngược',
        'Ứng dụng yêu cầu hiệu suất cao'
      ],
      optimizations: [
        'Early termination: Dừng nếu không có swap trong 1 lượt',
        'Cocktail Sort: Quét theo cả 2 hướng',
        'Giảm phạm vi: Không so sánh phần đã sắp xếp'
      ],
      realWorldApplications: [
        'Polygon filling trong đồ họa máy tính',
        'Sắp xếp các phần tử trong embedded systems với bộ nhớ hạn chế'
      ]
    },
    
    metrics: {
      averageComparisons: '$\\frac{n(n-1)}{2}$',
      averageSwaps: '$\\frac{n(n-1)}{4}$',
      cacheFriendly: 'high',
      parallelizable: false
    },
    
    tradeoffs: {
      pros: [
        'Cực kỳ đơn giản để hiểu và implement',
        'Stable sort - giữ thứ tự tương đối',
        'In-place - không cần bộ nhớ phụ',
        'Adaptive - nhanh với dữ liệu gần sắp xếp',
        'Dễ debug'
      ],
      cons: [
        'Hiệu suất kém với dữ liệu lớn (O(n²))',
        'Nhiều so sánh và swap không cần thiết',
        'Không hiệu quả ngay cả khi đã tối ưu',
        'Không phù hợp production code'
      ],
      vsAlternatives: {
        'insertion-sort': 'Insertion Sort nhanh hơn cho mảng nhỏ và adaptive tốt hơn',
        'quick-sort': 'Quick Sort nhanh hơn nhiều (O(n log n)) cho mảng lớn',
        'merge-sort': 'Merge Sort đảm bảo O(n log n) nhưng cần thêm bộ nhớ'
      }
    },
    
    tags: ['simple', 'quadratic', 'comparison-based', 'stable', 'in-place'],
    difficulty: 'Dễ',
    
    history: {
      inventor: 'Iverson, Kenneth E.',
      year: 1962,
      motivation: 'Được phân tích và công bố lần đầu trong luận văn của Iverson, mặc dù thuật toán có thể đã tồn tại từ trước đó',
      wikipediaUrl: 'https://en.wikipedia.org/wiki/Bubble_sort'
    },
    
    resources: {
      papers: [
        'Knuth, D. (1998). The Art of Computer Programming, Vol. 3: Sorting and Searching'
      ],
      visualizations: [
        'https://visualgo.net/en/sorting',
        'https://www.toptal.com/developers/sorting-algorithms'
      ]
    }
  },

  'quick-sort': {
    id: 'quick-sort',
    name: 'Quick Sort',
    category: 'sorting',
    
    timeComplexity: {
      best: {
        formula: '$O(n \\log n)$',
        bigO: 'O(n log n)',
        explanation: 'Đạt được khi pivot luôn chia mảng thành hai phần bằng nhau.',
        proof: 'Với partition cân bằng: $T(n) = 2T(n/2) + O(n)$. Theo Master Theorem: $T(n) = O(n \\log n)$'
      },
      average: {
        formula: '$O(n \\log n)$',
        bigO: 'O(n log n)',
        explanation: 'Với pivot ngẫu nhiên, xác suất cao đạt được partition gần cân bằng.',
        proof: 'Số phép so sánh trung bình: $C(n) = 2n \\ln n \\approx 1.39n \\log_2 n$'
      },
      worst: {
        formula: '$O(n^2)$',
        bigO: 'O(n²)',
        explanation: 'Xảy ra khi pivot luôn là phần tử nhỏ nhất hoặc lớn nhất, ví dụ mảng đã sắp xếp với pivot chọn ở đầu hoặc cuối.',
        proof: 'Partition không cân bằng: $T(n) = T(n-1) + O(n) = O(n^2)$'
      }
    },
    
    spaceComplexity: {
      auxiliary: {
        formula: '$O(\\log n)$',
        bigO: 'O(log n)',
        explanation: 'Không gian cần thiết cho call stack đệ quy, worst case có thể lên đến tuyến tính khi partition không cân bằng.',
      },
      total: {
        formula: '$O(n + \\log n)$',
        bigO: 'O(n)',
        explanation: 'Bao gồm mảng đầu vào cộng với call stack đệ quy.',
      }
    },
    
    properties: {
      stable: false,
      inPlace: true,
      adaptive: false,
      online: false,
      recursive: true,
      comparison: true,
    },
    
    description: {
      overview: 'Quick Sort là thuật toán chia để trị (divide-and-conquer) chọn một pivot và phân vùng mảng thành các phần tử nhỏ hơn và lớn hơn pivot.',
      howItWorks: [
        'Chọn một phần tử làm pivot (đầu, cuối, giữa, hoặc ngẫu nhiên)',
        'Partition: Sắp xếp lại mảng sao cho phần tử < pivot ở bên trái, > pivot ở bên phải',
        'Đặt pivot vào vị trí đúng',
        'Đệ quy sắp xếp mảng con bên trái pivot',
        'Đệ quy sắp xếp mảng con bên phải pivot'
      ],
      keyInsights: [
        'Không cần merge step như Merge Sort',
        'Hiệu suất phụ thuộc nhiều vào việc chọn pivot',
        'Cache-friendly do truy cập tuần tự',
        'Có thể song song hóa dễ dàng'
      ]
    },
    
    mathematics: {
      recurrenceRelation: '$T(n) = T(k) + T(n-k-1) + O(n)$, với k là vị trí pivot',
      masterTheorem: 'Trường hợp cân bằng: $T(n) = 2T(n/2) + O(n) = O(n \\log n)$',
      amortizedAnalysis: 'Với randomized pivot, xác suất cao đạt O(n log n)',
      invariants: [
        'Sau partition, pivot ở đúng vị trí cuối cùng',
        'Mọi phần tử bên trái pivot < pivot',
        'Mọi phần tử bên phải pivot > pivot'
      ]
    },
    
    practical: {
      bestUseCase: [
        'Mảng lớn với dữ liệu ngẫu nhiên',
        'Khi cần sắp xếp in-place',
        'Hệ thống có cache memory tốt',
        'Khi average-case performance quan trọng hơn worst-case'
      ],
      worstUseCase: [
        'Mảng đã sắp xếp (với pivot không tốt)',
        'Khi cần stable sort',
        'Khi worst-case O(n²) không chấp nhận được',
        'Dữ liệu với nhiều duplicate keys'
      ],
      optimizations: [
        'Randomized pivot để tránh worst case',
        'Median-of-three pivot selection',
        'Hybrid: chuyển sang Insertion Sort cho mảng nhỏ (< 10)',
        'Three-way partitioning cho nhiều duplicate',
        'Tail recursion optimization'
      ],
      realWorldApplications: [
        'Thư viện chuẩn C (qsort)',
        'Database indexing và sorting',
        'Parallel computing applications',
        'Real-time systems (với introsort fallback)'
      ]
    },
    
    metrics: {
      averageComparisons: '$1.39n \\log_2 n$',
      averageSwaps: '$0.33n \\log_2 n$',
      cacheFriendly: 'high',
      parallelizable: true
    },
    
    tradeoffs: {
      pros: [
        'Rất nhanh trong trường hợp trung bình (O(n log n))',
        'In-place sorting - ít bộ nhớ phụ',
        'Cache-efficient - locality tốt',
        'Dễ song song hóa',
        'Thực tế nhanh hơn Merge Sort'
      ],
      cons: [
        'Không stable - không giữ thứ tự tương đối',
        'Worst case O(n²)',
        'Hiệu suất phụ thuộc vào pivot selection',
        'Không adaptive',
        'Đệ quy có thể gây stack overflow'
      ],
      vsAlternatives: {
        'merge-sort': 'Quick Sort nhanh hơn thực tế nhưng không stable và có worst case tệ hơn',
        'heap-sort': 'Quick Sort nhanh hơn trung bình nhưng Heap Sort đảm bảo O(n log n)',
        'intro-sort': 'Introsort kết hợp Quick Sort và Heap Sort để tránh worst case'
      }
    },
    
    tags: ['divide-conquer', 'fast', 'comparison-based', 'in-place', 'unstable'],
    difficulty: 'Trung Bình',
    
    history: {
      inventor: 'C.A.R. Hoare (Tony Hoare)',
      year: 1959,
      motivation: 'Phát triển trong thời gian làm việc tại Moscow State University để sắp xếp từ điển dịch máy Anh-Nga',
      wikipediaUrl: 'https://en.wikipedia.org/wiki/Quicksort'
    },
    
    resources: {
      papers: [
        'Hoare, C. A. R. (1962). "Quicksort". The Computer Journal. 5 (1): 10–16',
        'Sedgewick, R. (1977). "Quicksort". Stanford University PhD thesis'
      ]
    }
  },

  'merge-sort': {
    id: 'merge-sort',
    name: 'Merge Sort',
    category: 'sorting',
    
    timeComplexity: {
      best: {
        formula: '$O(n \\log n)$',
        bigO: 'O(n log n)',
        explanation: 'Luôn chia mảng thành hai nửa và merge, không phụ thuộc vào dữ liệu đầu vào.',
        proof: '$T(n) = 2T(n/2) + O(n)$. Theo Master Theorem: $T(n) = O(n \\log n)$'
      },
      average: {
        formula: '$O(n \\log n)$',
        bigO: 'O(n log n)',
        explanation: 'Giống best case vì thuật toán hoạt động nhất quán bất kể đầu vào.',
        proof: 'Depth của cây đệ quy: $\\log n$. Merge ở mỗi level: $O(n)$. Tổng: $O(n \\log n)$'
      },
      worst: {
        formula: '$O(n \\log n)$',
        bigO: 'O(n log n)',
        explanation: 'Đảm bảo hiệu suất ổn định cho mọi trường hợp đầu vào.',
        proof: 'Không có worst case tệ hơn vì thuật toán deterministic'
      }
    },
    
    spaceComplexity: {
      auxiliary: {
        formula: '$O(n)$',
        bigO: 'O(n)',
        explanation: 'Cần mảng phụ để thực hiện thao tác merge hai mảng con.',
      },
      total: {
        formula: '$O(n)$',
        bigO: 'O(n)',
        explanation: 'Bao gồm mảng đầu vào cộng với mảng phụ cho merge.',
      }
    },
    
    properties: {
      stable: true,
      inPlace: false,
      adaptive: false,
      online: false,
      recursive: true,
      comparison: true,
    },
    
    description: {
      overview: 'Merge Sort là thuật toán chia để trị chia mảng thành 2 nửa, sắp xếp riêng rẽ, sau đó gộp (merge) chúng lại.',
      howItWorks: [
        'Chia mảng thành 2 nửa bằng nhau',
        'Đệ quy sắp xếp nửa trái',
        'Đệ quy sắp xếp nửa phải',
        'Merge 2 nửa đã sắp xếp thành một mảng',
        'Base case: mảng có 1 phần tử đã được sắp xếp'
      ],
      keyInsights: [
        'Đảm bảo O(n log n) cho mọi trường hợp',
        'Stable sort - quan trọng cho multi-key sorting',
        'Phù hợp cho external sorting (dữ liệu lớn hơn RAM)',
        'Có thể song song hóa tự nhiên'
      ]
    },
    
    mathematics: {
      recurrenceRelation: '$T(n) = 2T(n/2) + O(n)$',
      masterTheorem: 'Case 2 của Master Theorem: $a=2, b=2, f(n)=O(n) \\Rightarrow T(n)=O(n \\log n)$',
      invariants: [
        'Mỗi subarray đệ quy được sắp xếp',
        'Merge operation giữ tính stable'
      ]
    },
    
    practical: {
      bestUseCase: [
        'Khi cần stable sort',
        'Khi cần đảm bảo O(n log n) worst case',
        'External sorting (dữ liệu trên disk)',
        'Linked list sorting',
        'Parallel và distributed sorting'
      ],
      worstUseCase: [
        'Môi trường bộ nhớ hạn chế',
        'Mảng nhỏ (overhead của đệ quy)',
        'Khi in-place sorting là bắt buộc'
      ],
      optimizations: [
        'Hybrid với Insertion Sort cho mảng nhỏ',
        'In-place merge (phức tạp hơn)',
        'Natural merge sort (tận dụng runs đã sắp xếp)',
        'Bottom-up merge sort (iterative, không đệ quy)',
        'Parallel merge sort'
      ],
      realWorldApplications: [
        'Timsort (Python, Java) - hybrid với Insertion Sort',
        'External sorting trong databases',
        'Parallel sorting algorithms',
        'Sắp xếp linked lists',
        'Inversion count problems'
      ]
    },
    
    metrics: {
      averageComparisons: '$n \\log_2 n - n + 1$',
      averageSwaps: '$n \\log_2 n$',
      cacheFriendly: 'medium',
      parallelizable: true
    },
    
    tradeoffs: {
      pros: [
        'Đảm bảo O(n log n) cho mọi trường hợp',
        'Stable sort',
        'Predictable performance',
        'Tốt cho external sorting',
        'Dễ song song hóa',
        'Tốt cho linked lists'
      ],
      cons: [
        'Cần O(n) bộ nhớ phụ',
        'Không in-place',
        'Không adaptive',
        'Overhead của đệ quy',
        'Chậm hơn Quick Sort trong thực tế (cache miss)'
      ],
      vsAlternatives: {
        'quick-sort': 'Merge Sort stable và đảm bảo O(n log n) nhưng cần thêm bộ nhớ',
        'heap-sort': 'Merge Sort stable nhưng Heap Sort in-place',
        'timsort': 'Timsort là hybrid tối ưu của Merge Sort và Insertion Sort'
      }
    },
    
    tags: ['divide-conquer', 'stable', 'guaranteed', 'comparison-based'],
    difficulty: 'Trung Bình',
    
    history: {
      inventor: 'John von Neumann',
      year: 1945,
      motivation: 'Phát triển cho máy tính EDVAC, một trong những thuật toán đầu tiên được thiết kế cho máy tính điện tử',
      wikipediaUrl: 'https://en.wikipedia.org/wiki/Merge_sort'
    },
    
    resources: {
      papers: [
        'Von Neumann, J. (1945). "First Draft of a Report on the EDVAC"',
        'Knuth, D. (1998). TAOCP Vol. 3: Sorting and Searching, Section 5.2.4'
      ]
    }
  },

  'binary-search': {
    id: 'binary-search',
    name: 'Binary Search',
    category: 'searching',
    
    timeComplexity: {
      best: {
        formula: '$O(1)$',
        bigO: 'O(1)',
        explanation: 'Tìm thấy ngay ở vị trí giữa mảng trong lần kiểm tra đầu tiên.',
      },
      average: {
        formula: '$O(\\log n)$',
        bigO: 'O(log n)',
        explanation: 'Mỗi bước loại bỏ một nửa không gian tìm kiếm còn lại.',
        proof: '$T(n) = T(n/2) + O(1) = O(\\log n)$'
      },
      worst: {
        formula: '$O(\\log n)$',
        bigO: 'O(log n)',
        explanation: 'Phần tử cần tìm nằm ở đầu, cuối hoặc không tồn tại trong mảng.',
        proof: 'Số lần chia đôi tối đa: $\\lceil \\log_2 n \\rceil$'
      }
    },
    
    spaceComplexity: {
      auxiliary: {
        formula: '$O(1)$',
        bigO: 'O(1)',
        explanation: 'Phiên bản lặp chỉ cần vài biến cố định. Phiên bản đệ quy cần O(log n) cho call stack.',
      },
      total: {
        formula: '$O(n)$',
        bigO: 'O(n)',
        explanation: 'Bao gồm mảng đầu vào đã được sắp xếp.',
      }
    },
    
    properties: {
      stable: false,
      inPlace: true,
      adaptive: false,
      online: false,
      recursive: false,
      comparison: true,
    },
    
    description: {
      overview: 'Binary Search tìm kiếm phần tử trong mảng đã sắp xếp bằng cách liên tục chia đôi không gian tìm kiếm.',
      howItWorks: [
        'Bắt đầu với left = 0, right = n-1',
        'Tính mid = (left + right) / 2',
        'So sánh arr[mid] với target',
        'Nếu bằng: tìm thấy, return mid',
        'Nếu arr[mid] < target: tìm bên phải (left = mid + 1)',
        'Nếu arr[mid] > target: tìm bên trái (right = mid - 1)',
        'Lặp lại cho đến khi tìm thấy hoặc left > right'
      ],
      keyInsights: [
        'Yêu cầu mảng phải được sắp xếp trước',
        'Logarithmic time - cực kỳ nhanh cho mảng lớn',
        'Có thể áp dụng cho bất kỳ cấu trúc monotonic nào',
        'Cơ sở cho nhiều thuật toán khác'
      ]
    },
    
    mathematics: {
      recurrenceRelation: '$T(n) = T(n/2) + O(1)$',
      masterTheorem: '$T(n) = O(\\log n)$ theo Master Theorem',
      invariants: [
        'Nếu target tồn tại, nó nằm trong [left, right]',
        'Mọi phần tử ngoài [left, right] đã bị loại bỏ'
      ]
    },
    
    practical: {
      bestUseCase: [
        'Tìm kiếm trong mảng đã sắp xếp',
        'Database indexing',
        'Tìm insertion point',
        'Range queries',
        'Optimization problems với monotonic function'
      ],
      worstUseCase: [
        'Mảng chưa sắp xếp',
        'Frequent insertions/deletions',
        'Mảng rất nhỏ (Linear Search đơn giản hơn)'
      ],
      optimizations: [
        'Interpolation search cho uniform distribution',
        'Exponential search cho unbounded arrays',
        'Binary search on answer (cho optimization)',
        'Fractional cascading cho multi-dimensional'
      ],
      realWorldApplications: [
        'Database B-tree indexing',
        'Dictionary/phonebook lookups',
        'Version control systems (git bisect)',
        'Finding bugs in code (binary search debugging)',
        'Resource allocation problems'
      ]
    },
    
    metrics: {
      averageComparisons: '$\\log_2 n$',
      averageSwaps: '$0$',
      cacheFriendly: 'medium',
      parallelizable: false
    },
    
    tradeoffs: {
      pros: [
        'Cực kỳ nhanh: O(log n)',
        'Đơn giản để implement',
        'Ít bộ nhớ',
        'Predictable performance',
        'Áp dụng rộng rãi'
      ],
      cons: [
        'Yêu cầu mảng đã sắp xếp',
        'Không hiệu quả cho frequent updates',
        'Random access cần (không tốt cho linked list)',
        'Edge cases dễ gây bug (off-by-one)'
      ],
      vsAlternatives: {
        'linear-search': 'Binary Search O(log n) vs Linear O(n), nhưng cần sắp xếp trước',
        'hash-table': 'Hash table O(1) average nhưng không hỗ trợ range queries',
        'b-tree': 'B-tree tốt hơn cho disk-based data'
      }
    },
    
    tags: ['divide-conquer', 'logarithmic', 'sorted-required', 'comparison-based'],
    difficulty: 'Trung Bình',
    
    history: {
      inventor: 'John Mauchly',
      year: 1946,
      motivation: 'Được công bố lần đầu tiên trong bài báo khoa học, mặc dù ý tưởng cơ bản đã tồn tại từ thời cổ đại',
      wikipediaUrl: 'https://en.wikipedia.org/wiki/Binary_search_algorithm'
    },
    
    resources: {
      papers: [
        'Knuth, D. (1998). TAOCP Vol. 3, Section 6.2.1',
        'Bentley, J. (2000). Programming Pearls, Column 4'
      ]
    }
  },

  'linear-search': {
    id: 'linear-search',
    name: 'Linear Search',
    category: 'searching',
    
    timeComplexity: {
      best: {
        formula: '$O(1)$',
        bigO: 'O(1)',
        explanation: 'Phần tử cần tìm nằm ngay ở vị trí đầu tiên của mảng.',
        proof: 'Chỉ cần một phép so sánh duy nhất.'
      },
      average: {
        formula: '$O(n)$',
        bigO: 'O(n)',
        explanation: 'Trung bình phải duyệt qua khoảng một nửa số phần tử để tìm thấy.',
        proof: 'Xác suất tìm thấy tại mỗi vị trí là 1/n, tổng số phép so sánh trung bình: $\\sum_{i=1}^{n}\\frac{i}{n} = \\frac{n+1}{2} = O(n)$'
      },
      worst: {
        formula: '$O(n)$',
        bigO: 'O(n)',
        explanation: 'Phần tử cần tìm nằm ở cuối mảng hoặc không tồn tại trong mảng.',
        proof: 'Phải duyệt qua tất cả n phần tử trong mảng.'
      }
    },
    
    spaceComplexity: {
      auxiliary: {
        formula: '$O(1)$',
        bigO: 'O(1)',
        explanation: 'Chỉ cần một số biến cố định để lưu index và giá trị cần tìm.',
      },
      total: {
        formula: '$O(n)$',
        bigO: 'O(n)',
        explanation: 'Bao gồm không gian lưu trữ của mảng đầu vào.',
      }
    },
    
    properties: {
      stable: true,
      inPlace: true,
      adaptive: false,
      recursive: false,
      comparison: true,
      online: true
    },
    
    description: {
      overview: 'Thuật toán tìm kiếm đơn giản nhất, duyệt tuần tự qua từng phần tử trong mảng cho đến khi tìm thấy hoặc hết mảng.',
      howItWorks: [
        'Bắt đầu từ phần tử đầu tiên của mảng',
        'So sánh phần tử hiện tại với giá trị cần tìm',
        'Nếu trùng khớp, trả về vị trí (index)',
        'Nếu không, chuyển sang phần tử tiếp theo',
        'Lặp lại cho đến khi tìm thấy hoặc hết mảng',
        'Trả về -1 nếu không tìm thấy'
      ],
      keyInsights: [
        'Không yêu cầu mảng được sắp xếp',
        'Đơn giản nhưng kém hiệu quả với dữ liệu lớn',
        'Tối ưu cho mảng nhỏ hoặc tìm kiếm một lần'
      ]
    },
    
    mathematics: {},
    
    tradeoffs: {
      pros: [
        'Cực kỳ đơn giản, dễ hiểu và dễ implement',
        'Không yêu cầu mảng phải được sắp xếp trước',
        'Hoạt động tốt với mảng nhỏ (n < 100)',
        'Không cần thêm bộ nhớ phụ',
        'Có thể dừng ngay khi tìm thấy'
      ],
      cons: [
        'Rất chậm với mảng lớn O(n)',
        'Không tận dụng được thông tin về thứ tự',
        'Phải duyệt tuần tự, không thể skip',
        'Không phù hợp cho tìm kiếm lặp lại nhiều lần'
      ]
    },
    
    practical: {
      bestUseCase: [
        'Mảng nhỏ (< 100 phần tử)',
        'Mảng chưa được sắp xếp',
        'Tìm kiếm một lần duy nhất',
        'Dữ liệu không có cấu trúc đặc biệt'
      ],
      worstUseCase: [
        'Mảng lớn đã được sắp xếp',
        'Tìm kiếm lặp lại nhiều lần',
        'Dữ liệu có cấu trúc có thể tận dụng'
      ],
      optimizations: [
        'Sentinel search: thêm phần tử canh gác để giảm số lần kiểm tra',
        'Skip search: nhảy vài phần tử một lúc'
      ],
      realWorldApplications: [
        'Tìm kiếm trong danh sách nhỏ',
        'Kiểm tra sự tồn tại của phần tử',
        'Tìm kiếm trong linked list',
        'Baseline để so sánh với thuật toán khác'
      ]
    },
    
    tags: ['sequential', 'linear', 'unsorted', 'simple'],
    difficulty: 'Dễ',
    
    metrics: {
      averageComparisons: 'n/2',
      averageSwaps: '0',
      cacheFriendly: 'high',
      parallelizable: false
    },
    
    history: {
      inventor: 'Không rõ (ancient algorithm)',
      year: undefined,
      motivation: 'Thuật toán cơ bản và tự nhiên nhất, đã tồn tại từ thời cổ đại',
      wikipediaUrl: 'https://en.wikipedia.org/wiki/Linear_search'
    },
    
    resources: {
      papers: [
        'Knuth, D. (1998). TAOCP Vol. 3, Section 6.1'
      ]
    }
  },

  'linear-min-max': {
    id: 'linear-min-max',
    name: 'Linear Min/Max',
    category: 'extreme',
    
    timeComplexity: {
      best: {
        formula: '$O(n)$',
        bigO: 'O(n)',
        explanation: 'Phải duyệt qua tất cả phần tử ít nhất một lần để xác định giá trị cực trị.',
        proof: 'Không thể biết min/max mà không xem tất cả n phần tử.'
      },
      average: {
        formula: '$O(n)$',
        bigO: 'O(n)',
        explanation: 'Luôn cần n-1 phép so sánh để xác định giá trị cực trị.',
        proof: 'Mỗi phần tử được so sánh đúng một lần.'
      },
      worst: {
        formula: '$O(n)$',
        bigO: 'O(n)',
        explanation: 'Vẫn phải duyệt qua toàn bộ mảng để đảm bảo tìm được đúng giá trị cực trị.',
        proof: 'n-1 so sánh là cận dưới tối ưu.'
      }
    },
    
    spaceComplexity: {
      auxiliary: {
        formula: '$O(1)$',
        bigO: 'O(1)',
        explanation: 'Chỉ cần một hoặc hai biến để lưu giá trị cực trị hiện tại.',
      },
      total: {
        formula: '$O(n)$',
        bigO: 'O(n)',
        explanation: 'Bao gồm không gian lưu trữ của mảng đầu vào.',
      }
    },
    
    properties: {
      stable: true,
      inPlace: true,
      adaptive: false,
      recursive: false,
      comparison: true,
      online: false
    },
    
    description: {
      overview: 'Thuật toán đơn giản để tìm giá trị nhỏ nhất hoặc lớn nhất trong mảng bằng cách duyệt tuần tự.',
      howItWorks: [
        'Khởi tạo min/max = phần tử đầu tiên',
        'Duyệt qua các phần tử còn lại',
        'So sánh mỗi phần tử với min/max hiện tại',
        'Cập nhật min/max nếu tìm thấy giá trị nhỏ/lớn hơn',
        'Trả về min/max cuối cùng'
      ],
      keyInsights: [
        'Thuật toán tối ưu về mặt lý thuyết',
        'Không thể tìm min/max nhanh hơn O(n)',
        'Có thể tìm cả min và max với 3n/2 so sánh'
      ]
    },
    
    mathematics: {},
    
    tradeoffs: {
      pros: [
        'Đơn giản và dễ implement',
        'Tối ưu về thời gian O(n) - không thể làm tốt hơn',
        'Chỉ cần O(1) bộ nhớ',
        'Có thể tìm cả min và max chỉ với 3n/2 so sánh',
        'Hoạt động với mọi loại dữ liệu có thể so sánh'
      ],
      cons: [
        'Phải duyệt toàn bộ mảng, không thể skip',
        'Không tận dụng được cấu trúc đặc biệt của dữ liệu',
        'Không phù hợp cho tìm kiếm lặp lại nhiều lần'
      ]
    },
    
    practical: {
      bestUseCase: [
        'Tìm min/max một lần trong mảng',
        'Dữ liệu không có cấu trúc đặc biệt',
        'Khi cần cả min và max',
        'Mảng nhỏ đến trung bình'
      ],
      worstUseCase: [
        'Cần tìm top-k phần tử lớn/nhỏ nhất',
        'Tìm kiếm lặp lại nhiều lần'
      ],
      optimizations: [
        'Simultaneous min-max: tìm cả min và max với 3n/2 so sánh',
        'Pair comparison: so sánh từng cặp trước'
      ],
      realWorldApplications: [
        'Tìm nhiệt độ cao nhất/thấp nhất',
        'Tìm điểm số cao nhất/thấp nhất',
        'Phân tích thống kê cơ bản',
        'Preprocessing cho các thuật toán khác'
      ]
    },
    
    tags: ['linear', 'optimal', 'simple', 'single-pass'],
    difficulty: 'Dễ',
    
    metrics: {
      averageComparisons: 'n-1',
      averageSwaps: '0',
      cacheFriendly: 'high',
      parallelizable: true
    },
    
    history: {
      inventor: 'Không rõ (ancient algorithm)',
      year: undefined,
      motivation: 'Thuật toán cơ bản để tìm giá trị lớn nhất/nhỏ nhất trong tập dữ liệu',
      wikipediaUrl: 'https://en.wikipedia.org/wiki/Selection_algorithm'
    },
    
    resources: {
      papers: [
        'Knuth, D. (1998). TAOCP Vol. 3, Section 5.3.3'
      ]
    }
  },

  'tournament-method': {
    id: 'tournament-method',
    name: 'Tournament Method',
    category: 'extreme',
    
    timeComplexity: {
      best: {
        formula: '$O(n)$',
        bigO: 'O(n)',
        explanation: 'Cần xây dựng cây tournament hoàn chỉnh với n-1 lượt so sánh.',
        proof: 'Mỗi vòng loại cần n/2 so sánh, tổng log(n) vòng: n-1 so sánh.'
      },
      average: {
        formula: '$O(n)$',
        bigO: 'O(n)',
        explanation: 'Tìm giá trị lớn nhất cần n-1 so sánh, tìm giá trị lớn thứ hai chỉ cần thêm logarit lượt so sánh.',
        proof: 'Tổng: n-1 + log(n) = O(n)'
      },
      worst: {
        formula: '$O(n)$',
        bigO: 'O(n)',
        explanation: 'Hiệu quả cao khi cần tìm nhiều giá trị cực trị nhờ tái sử dụng kết quả.',
        proof: 'Tìm k phần tử lớn nhất: n + k*log(n) so sánh.'
      }
    },
    
    spaceComplexity: {
      auxiliary: {
        formula: '$O(n)$',
        bigO: 'O(n)',
        explanation: 'Cần lưu trữ cây tournament với n-1 node nội bộ.',
      },
      total: {
        formula: '$O(n)$',
        bigO: 'O(n)',
        explanation: 'Bao gồm mảng đầu vào cộng với cấu trúc cây tournament.',
      }
    },
    
    properties: {
      stable: false,
      inPlace: false,
      adaptive: false,
      recursive: true,
      comparison: true,
      online: false
    },
    
    description: {
      overview: 'Thuật toán tìm cực trị dựa trên cấu trúc cây, tương tự như giải đấu thể thao. Hiệu quả khi cần tìm nhiều giá trị cực trị.',
      howItWorks: [
        'Chia mảng thành các cặp phần tử',
        'So sánh từng cặp, "người thắng" đi tiếp',
        'Lặp lại với các "người thắng" cho đến khi còn 1',
        'Phần tử cuối cùng là max/min',
        'Có thể tìm second max bằng cách xem các đối thủ của max'
      ],
      keyInsights: [
        'Tối ưu khi cần tìm k phần tử lớn/nhỏ nhất',
        'Lưu lại thông tin từ các vòng so sánh trước',
        'Tìm second max chỉ cần thêm log(n) so sánh'
      ]
    },
    
    mathematics: {},
    
    tradeoffs: {
      pros: [
        'Hiệu quả khi tìm nhiều cực trị (top-k)',
        'Tìm second max chỉ cần thêm log(n) so sánh',
        'Có thể tái sử dụng kết quả trung gian',
        'Dễ song song hóa'
      ],
      cons: [
        'Cần thêm O(n) bộ nhớ cho cây',
        'Phức tạp hơn linear search',
        'Overhead lớn với mảng nhỏ',
        'Không in-place'
      ]
    },
    
    practical: {
      bestUseCase: [
        'Tìm top-k phần tử lớn/nhỏ nhất',
        'Cần tìm second max/min',
        'Dữ liệu lớn, tìm kiếm lặp lại nhiều lần',
        'Có thể song song hóa'
      ],
      worstUseCase: [
        'Chỉ cần tìm min/max một lần',
        'Mảng nhỏ',
        'Bộ nhớ hạn chế'
      ],
      optimizations: [
        'Lazy evaluation: chỉ tính khi cần',
        'Parallel tournament: song song hóa các nhánh'
      ],
      realWorldApplications: [
        'Giải đấu thể thao (xếp hạng)',
        'Tìm top-k sản phẩm bán chạy',
        'Selection algorithms',
        'Heap construction'
      ]
    },
    
    tags: ['divide-conquer', 'tree-based', 'optimal-comparison', 'top-k'],
    difficulty: 'Trung Bình',
    
    metrics: {
      averageComparisons: 'n + k*log(n)',
      averageSwaps: '0',
      cacheFriendly: 'medium',
      parallelizable: true
    },
    
    history: {
      inventor: 'Schreier, Alexander',
      year: 1932,
      motivation: 'Phát triển dựa trên ý tưởng giải đấu thể thao để tối ưu hóa số lần so sánh khi tìm min/max',
      wikipediaUrl: 'https://en.wikipedia.org/wiki/Selection_algorithm#Tournament_algorithm'
    },
    
    resources: {
      papers: [
        'Knuth, D. (1998). TAOCP Vol. 3, Section 5.3.3',
        'Tournament Method for Selection Problems'
      ]
    }
  }
};

// Export functions to get theories
export function getTheoryById(id: string): AlgorithmTheory | undefined {
  return algorithmTheories[id];
}

export function getAllTheories(): AlgorithmTheory[] {
  return Object.values(algorithmTheories);
}

export function getTheoriesByCategory(category: string): AlgorithmTheory[] {
  return Object.values(algorithmTheories).filter(t => t.category === category);
}

export function getTheoriesByTag(tag: string): AlgorithmTheory[] {
  return Object.values(algorithmTheories).filter(t => t.tags.includes(tag));
}

export function searchTheories(query: string): AlgorithmTheory[] {
  const lowercaseQuery = query.toLowerCase();
  return Object.values(algorithmTheories).filter(t =>
    t.name.toLowerCase().includes(lowercaseQuery) ||
    t.description.overview.toLowerCase().includes(lowercaseQuery) ||
    t.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
}
