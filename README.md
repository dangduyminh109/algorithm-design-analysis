# Web Minh Họa Độ Phức Tạp Thuật Toán

## Giao diện trang chủ
![alt text](image.png)

**Nền tảng minh họa tương tác để hiểu độ phức tạp thuật toán**

Ứng dụng web giáo dục được xây dựng bằng Next.js, React, TypeScript và TailwindCSS, cung cấp các minh họa tương tác cho nhiều thuật toán khác nhau bao gồm sắp xếp, tìm kiếm và tìm giá trị cực trị.

## Tính Năng

### Trang Chủ Tương Tác
- **Bong Bóng Hoạt Hình 3D**: Ba bong bóng nổi đại diện cho các danh mục thuật toán khác nhau
- **Hoạt Hình Mượt Mà**: Được xây dựng với Framer Motion cho các hiệu ứng chuyển cảnh đẹp mắt
- **Thiết Kế Responsive**: Hoạt động liền mạch trên mọi kích cỡ thiết bị

### Thuật Toán Sắp Xếp
- **Bubble Sort**: Thuật toán so sánh đơn giản với độ phức tạp O(n²)
- **Selection Sort**: Tìm phần tử nhỏ nhất và đặt ở đầu
- **Insertion Sort**: Xây dựng mảng đã sắp xếp từng phần tử một
- **Quick Sort**: Thuật toán chia để trị với độ phức tạp trung bình O(n log n)
- **Merge Sort**: Thuật toán sắp xếp ổn định với hiệu suất đảm bảo O(n log n)

### Thuật Toán Tìm Kiếm
- **Linear Search**: Tìm kiếm tuần tự qua mảng chưa sắp xếp
- **Binary Search**: Tìm kiếm hiệu quả cho mảng đã sắp xếp với độ phức tạp O(log n)

### Tìm Giá Trị Cực Trị
- **Linear Min/Max**: Quét đơn giản để tìm giá trị nhỏ nhất và lớn nhất
- **Tournament Method**: Phương pháp chia để trị để tìm giá trị cực trị

## Điều Khiển Tương Tác

### Tính Năng Minh Họa
- **Phát/Tạm Dừng/Đặt Lại**: Toàn quyền kiểm soát việc thực thi thuật toán
- **Điều Khiển Tốc Độ**: Điều chỉnh tốc độ hoạt hình từ 0.25x đến 3x
- **Điều Hướng Từng Bước**: Thực hiện thủ công từng bước của thuật toán
- **Mảng Tùy Chỉnh**: Tạo mảng ngẫu nhiên mới hoặc điều chỉnh kích thước mảng
- **Chọn Mục Tiêu**: Đối với thuật toán tìm kiếm, chọn giá trị cần tìm

### Yếu Tố Giáo Dục
- **Mã Với Cú Pháp Nổi Bật**: Xem việc triển khai thực tế
- **Phân Tích Độ Phức Tạp**: Hiểu độ phức tạp thời gian và không gian
- **Minh Họa Mã Màu**: Màu sắc khác nhau cho các trạng thái khác nhau
- **Ứng Dụng Thực Tế**: Học khi nào sử dụng thuật toán nào

## Công Nghệ Sử Dụng

- **Framework Frontend**: Next.js 14 với App Router
- **Ngôn Ngữ**: TypeScript để đảm bảo an toàn kiểu
- **Styling**: TailwindCSS cho thiết kế responsive
- **Hoạt Hình**: Framer Motion cho hoạt hình mượt mà
- **Làm Nổi Bật Mã**: Prism.js cho cú pháp nổi bật
- **Biểu Tượng**: Lucide React cho biểu tượng nhất quán

## Bắt Đầu

### Yêu Cầu Tiên Quyết
- Node.js 18+ 
- npm hoặc yarn

### Cài Đặt

1. **Clone repository**
   ```bash
   git clone <repository-url>
   cd algorithm-complexity-visualizer
   ```

2. **Cài đặt dependencies**
   ```bash
   npm install
   ```

3. **Chạy development server**
   ```bash
   npm run dev
   ```

4. **Mở trình duyệt**
   Điều hướng đến [http://localhost:3000](http://localhost:3000)

## Cấu Trúc Dự Án

```
src/
├── app/                          # Trang Next.js App Router
│   ├── algorithms/
│   │   └── [category]/
│   │       ├── page.tsx         # Trang danh sách danh mục
│   │       └── [algorithm]/
│   │           └── page.tsx     # Trang chi tiết thuật toán
│   ├── globals.css              # Styles toàn cục
│   ├── layout.tsx               # Layout gốc
│   └── page.tsx                 # Trang chủ
├── components/                   # Các component React có thể tái sử dụng
│   ├── AlgorithmInfo.tsx        # Hiển thị thông tin thuật toán
│   ├── CodeBlock.tsx            # Trình xem mã với cú pháp nổi bật
│   ├── ExtremeValueVisualizer.tsx # Trình minh họa thuật toán Min/Max
│   ├── Header.tsx               # Header điều hướng
│   ├── SearchingVisualizer.tsx  # Trình minh họa thuật toán tìm kiếm
│   └── SortingVisualizer.tsx    # Trình minh họa thuật toán sắp xếp
├── lib/                         # Hàm tiện ích và dữ liệu
│   ├── algorithms.ts            # Định nghĩa và metadata thuật toán
│   └── algorithmUtils.ts        # Triển khai thuật toán với các bước
└── types/                       # Định nghĩa kiểu TypeScript
    └── algorithm.ts             # Các kiểu liên quan đến thuật toán
```

## Hệ Thống Thiết Kế

### Bảng Màu
- **Chính**: Tông màu xanh dương cho các yếu tố giao diện chính
- **Thành Công**: Xanh lá cho trạng thái hoàn thành/đúng
- **Cảnh Báo**: Vàng cho trạng thái so sánh/hiện tại
- **Nguy Hiểm**: Đỏ cho trạng thái đổi chỗ/lỗi
- **Tím**: Cho các yếu tố đặc biệt (pivot, giữa, v.v.)

### Nguyên Tắc Hoạt Hình
- **Chuyển Cảnh Mượt Mà**: Tất cả thay đổi trạng thái đều được hoạt hình
- **Hiệu Suất**: Hoạt hình được tối ưu hóa không làm chặn UI
- **Kiểm Soát Người Dùng**: Người dùng có thể kiểm soát tốc độ hoạt hình và tạm dừng/tiếp tục

## Mục Tiêu Giáo Dục

Nền tảng này giúp sinh viên và lập trình viên:

1. **Minh Họa Khái Niệm Trừu Tượng**: Xem cách thuật toán hoạt động từng bước
2. **Hiểu Độ Phức Tạp**: Học ký hiệu Big-O qua ví dụ thực tế
3. **So Sánh Thuật Toán**: Xem các cách tiếp cận khác nhau giải quyết cùng một vấn đề
4. **Luyện Tập Giải Quyết Vấn Đề**: Hiểu khi nào sử dụng thuật toán nào

## Kết Quả Học Tập Chính

- **Phân Tích Thuật Toán**: Hiểu độ phức tạp thời gian và không gian
- **Mẫu Giải Quyết Vấn Đề**: Nhận biết chia để trị, cách tiếp cận tham lam
- **Đánh Đổi Hiệu Suất**: Khi nào ưu tiên thời gian vs không gian vs tính ổn định
- **Ứng Dụng Thực Tế**: Nơi các thuật toán này được sử dụng trong thực tế

## Tùy Chỉnh

### Thêm Thuật Toán Mới

1. **Định nghĩa thuật toán** trong `src/lib/algorithms.ts`
2. **Triển khai logic từng bước** trong `src/lib/algorithmUtils.ts`
3. **Thêm logic minh họa** vào component visualizer thích hợp
4. **Cập nhật routing** nếu cần

### Chỉnh Sửa Minh Họa

Các component visualizer có tính module và có thể dễ dàng tùy chỉnh:
- Thay đổi màu sắc trong hàm `getElementColor`
- Điều chỉnh thời gian hoạt hình trong các lời gọi `delay`
- Chỉnh sửa layout trong cấu trúc JSX

## Thiết Kế Responsive

- **Phương pháp mobile-first**: Tối ưu cho màn hình nhỏ trước
- **Layout linh hoạt**: Grid và flexbox cho components responsive
- **Thân thiện với cảm ứng**: Tất cả yếu tố tương tác hoạt động trên thiết bị cảm ứng
- **Typography dễ đọc**: Kích thước font và tỷ lệ tương phản phù hợp

## Tối Ưu Hiệu Suất

- **Chia nhỏ mã**: Tự động chia nhỏ mã dựa trên route
- **Lazy loading**: Components tải khi cần
- **Hoạt hình tối ưu**: Hoạt hình dựa trên RAF cho hiệu suất mượt mà
- **Quản lý bộ nhớ**: Dọn dẹp timer hoạt hình đúng cách

## Đóng Góp

Chào mừng các đóng góp! Các lĩnh vực có thể cải thiện:

- Các thuật toán bổ sung (heap sort, radix sort, v.v.)
- Nhiều kiểu minh họa hơn (dựa trên cây, dựa trên đồ thị)
- Chế độ so sánh thuật toán
- Đo lường hiệu suất
- Nội dung giáo dục bổ sung

## Giấy Phép

Dự án này được cấp phép theo Giấy phép MIT - xem file LICENSE để biết chi tiết.

## Lời Cảm Ơn

- Triển khai thuật toán lấy cảm hứng từ sách giáo khoa khoa học máy tính
- Thiết kế trực quan chịu ảnh hưởng từ các nền tảng giáo dục hiện đại
- Được xây dựng với công nghệ web hiện đại để có trải nghiệm người dùng tối ưu

---

**Chúc Học Vui Vẻ!**

Được tạo ra với tình yêu dành cho giáo dục khoa học máy tính
