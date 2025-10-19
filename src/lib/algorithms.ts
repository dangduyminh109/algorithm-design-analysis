import { Algorithm } from '@/types/algorithm';
import { ALGORITHM_CODE_SAMPLES } from './codeSamples';

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
      defaultLanguage: 'javascript',
      codeSnippets: ALGORITHM_CODE_SAMPLES['bubble-sort']
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
      defaultLanguage: 'javascript',
      codeSnippets: ALGORITHM_CODE_SAMPLES['selection-sort']
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
      defaultLanguage: 'javascript',
      codeSnippets: ALGORITHM_CODE_SAMPLES['insertion-sort']
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
      defaultLanguage: 'javascript',
      codeSnippets: ALGORITHM_CODE_SAMPLES['quick-sort']
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
      defaultLanguage: 'javascript',
      codeSnippets: ALGORITHM_CODE_SAMPLES['merge-sort']
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
      defaultLanguage: 'javascript',
      codeSnippets: ALGORITHM_CODE_SAMPLES['linear-search']
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
      defaultLanguage: 'javascript',
      codeSnippets: ALGORITHM_CODE_SAMPLES['binary-search']
    },
    {
      id: 'jump-search',
      name: 'Jump Search',
      category: 'searching',
      timeComplexity: {
        best: 'O(1)',
        average: 'O(√n)',
        worst: 'O(√n)'
      },
      spaceComplexity: 'O(1)',
      description: 'Jump Search là thuật toán tìm kiếm cho mảng đã sắp xếp bằng cách nhảy qua các khối có kích thước cố định (thường là √n) thay vì kiểm tra từng phần tử. Khi tìm thấy khối chứa giá trị, nó thực hiện tìm kiếm tuyến tính trong khối đó. Thuật toán này nhanh hơn Linear Search nhưng chậm hơn Binary Search.',
      applications: [
        'Tập dữ liệu đã sắp xếp với kích thước trung bình',
        'Khi Binary Search quá phức tạp để implement',
        'Hệ thống với chi phí nhảy thấp hơn so sánh',
        'Tìm kiếm trong dữ liệu tuần tự'
      ],
      difficulty: 'Trung Bình',
      defaultLanguage: 'javascript',
      codeSnippets: ALGORITHM_CODE_SAMPLES['jump-search']
    },
    {
      id: 'interpolation-search',
      name: 'Interpolation Search',
      category: 'searching',
      timeComplexity: {
        best: 'O(1)',
        average: 'O(log log n)',
        worst: 'O(n)'
      },
      spaceComplexity: 'O(1)',
      description: 'Interpolation Search là cải tiến của Binary Search cho mảng đã sắp xếp với dữ liệu phân bố đều. Thay vì luôn chia đôi, nó ước tính vị trí của giá trị cần tìm dựa trên công thức nội suy. Với dữ liệu phân bố đều, nó có thể đạt O(log log n), nhanh hơn Binary Search đáng kể.',
      applications: [
        'Dữ liệu đã sắp xếp và phân bố đều',
        'Tập dữ liệu lớn với phân bố uniform',
        'Tra cứu trong từ điển và danh bạ',
        'Hệ thống cần tìm kiếm cực nhanh'
      ],
      difficulty: 'Khó',
      defaultLanguage: 'javascript',
      codeSnippets: ALGORITHM_CODE_SAMPLES['interpolation-search']
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
      description: 'Thuật toán Linear Min/Max quét qua toàn bộ mảng một lần để tìm giá trị nhỏ nhất và lớn nhất. Đây là cách tiếp cận trực quan và tối ưu nhất về độ phức tạp thời gian, vì mọi phần tử đều phải được kiểm tra ít nhất một lần để đảm bảo tìm được giá trị cực trị chính xác.',
      applications: [
        'Phân tích thống kê',
        'Tiền xử lý dữ liệu',
        'Xác thực phạm vi',
        'Thiết lập giới hạn hiển thị cho trực quan hóa'
      ],
      difficulty: 'Dễ',
      defaultLanguage: 'javascript',
      codeSnippets: ALGORITHM_CODE_SAMPLES['linear-min-max']
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
      defaultLanguage: 'javascript',
      codeSnippets: ALGORITHM_CODE_SAMPLES['tournament-method']
    },
    {
      id: 'divide-conquer-minmax',
      name: 'Divide & Conquer Min/Max',
      category: 'extreme',
      timeComplexity: {
        best: 'O(n)',
        average: 'O(n)',
        worst: 'O(n)'
      },
      spaceComplexity: 'O(log n)',
      description: 'Thuật toán Divide & Conquer tìm min/max bằng cách chia mảng thành hai nửa, đệ quy tìm min/max của mỗi nửa, sau đó so sánh để tìm min/max tổng thể. Phương pháp này hiệu quả về số lần so sánh (3n/2 - 2) và dễ song song hóa.',
      applications: [
        'Xử lý song song và phân tán',
        'Tối ưu số lần so sánh',
        'Big Data analytics',
        'Thuật toán đệ quy cao cấp'
      ],
      difficulty: 'Trung Bình',
      defaultLanguage: 'javascript',
      codeSnippets: ALGORITHM_CODE_SAMPLES['divide-conquer-minmax']
    }
  ]
};
