'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';
import { algorithms } from '@/lib/algorithms';
import Header from '@/components/Header';
import AlgorithmInfo from '@/components/AlgorithmInfo';
import CodeBlock from '@/components/CodeBlock';
import SortingVisualizer from '@/components/SortingVisualizer';
import SearchingVisualizer from '@/components/SearchingVisualizer';
import ExtremeValueVisualizer from '@/components/ExtremeValueVisualizer';
import { motion } from 'framer-motion';

export default function AlgorithmDetailPage() {
  const params = useParams();
  const category = params.category as string;
  const algorithmId = params.algorithm as string;

  const categoryAlgorithms = algorithms[category] || [];
  const algorithm = categoryAlgorithms.find(alg => alg.id === algorithmId);

  const [currentStep, setCurrentStep] = useState(0);
  const [totalSteps, setTotalSteps] = useState(0);

  if (!algorithm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <Header showBackButton />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Không tìm thấy thuật toán</h1>
            <p className="text-gray-600 mt-2">Thuật toán được yêu cầu không tồn tại.</p>
          </div>
        </div>
      </div>
    );
  }

  const handleStepChange = (step: number, total: number) => {
    setCurrentStep(step);
    setTotalSteps(total);
  };

  const renderVisualizer = () => {
    switch (category) {
      case 'sorting':
        return (
          <SortingVisualizer 
            algorithm={algorithmId} 
            onStepChange={handleStepChange}
          />
        );
      case 'searching':
        return (
          <SearchingVisualizer 
            algorithm={algorithmId} 
            onStepChange={handleStepChange}
          />
        );
      case 'extreme':
        return (
          <ExtremeValueVisualizer 
            algorithm={algorithmId} 
            onStepChange={handleStepChange}
          />
        );
      default:
        return (
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <p className="text-gray-600">Visualizer not available for this category.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header showBackButton />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            {algorithm.name}
          </h1>
          <p className="text-lg text-gray-600 capitalize">
            {category} Algorithm Visualization
          </p>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left Column - Algorithm Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="xl:col-span-1"
          >
            <AlgorithmInfo algorithm={algorithm} />
            
            {/* Step Counter */}
            {totalSteps > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="mt-6 bg-white rounded-xl shadow-md p-4"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Execution Progress
                </h3>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Step:</span>
                  <span className="font-mono">
                    {currentStep + 1} / {totalSteps + 1}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((currentStep) / totalSteps) * 100}%` }}
                  />
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Right Column - Visualizer and Code */}
          <div className="xl:col-span-2 space-y-8">
            {/* Visualizer */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Trực Quan Hóa Tương Tác
              </h2>
              {renderVisualizer()}
            </motion.div>

            {/* Code Block */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Cài Đặt
              </h2>
              <CodeBlock 
                code={algorithm.code}
                title={`${algorithm.name} - Cài Đặt JavaScript`}
                language="javascript"
              />
            </motion.div>

            {/* Additional Information */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="bg-white rounded-xl shadow-md p-6"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Cách Hoạt Động
              </h2>
              
              <div className="prose max-w-none text-gray-600">
                {category === 'sorting' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Các Bước Thuật Toán:</h3>
                    <ul className="list-disc list-inside space-y-2">
                      {algorithmId === 'bubble-sort' && (
                        <>
                          <li>So sánh các phần tử liền kề trong mảng</li>
                          <li>Hoán đổi chúng nếu chúng sai thứ tự</li>
                          <li>Lặp lại cho đến khi không còn hoán đổi nào cần thiết</li>
                          <li>Mỗi lượt đảm bảo phần tử lớn nhất &quot;nổi lên&quot; cuối mảng</li>
                        </>
                      )}
                      {algorithmId === 'selection-sort' && (
                        <>
                          <li>Tìm phần tử nhỏ nhất trong phần chưa sắp xếp</li>
                          <li>Hoán đổi nó với phần tử đầu tiên của phần chưa sắp xếp</li>
                          <li>Di chuyển ranh giới giữa phần đã sắp xếp và chưa sắp xếp</li>
                          <li>Lặp lại cho đến khi toàn bộ mảng được sắp xếp</li>
                        </>
                      )}
                      {algorithmId === 'insertion-sort' && (
                        <>
                          <li>Bắt đầu với phần tử thứ hai (phần tử đầu được coi là đã sắp xếp)</li>
                          <li>So sánh phần tử hiện tại với các phần tử trước đó</li>
                          <li>Dịch chuyển các phần tử lớn hơn sang phải</li>
                          <li>Chèn phần tử hiện tại vào vị trí đúng của nó</li>
                        </>
                      )}
                      {algorithmId === 'quick-sort' && (
                        <>
                          <li>Chọn một phần tử pivot từ mảng</li>
                          <li>Phân vùng: sắp xếp lại các phần tử để những phần tử nhỏ hơn đứng trước pivot</li>
                          <li>Áp dụng đệ quy cùng quá trình cho các mảng con</li>
                          <li>Kết hợp kết quả để có mảng đã sắp xếp</li>
                        </>
                      )}
                      {algorithmId === 'merge-sort' && (
                        <>
                          <li>Chia mảng thành hai nửa</li>
                          <li>Sắp xếp đệ quy cả hai nửa</li>
                          <li>Trộn hai nửa đã sắp xếp lại với nhau</li>
                          <li>Quá trình trộn duy trì thứ tự đã sắp xếp</li>
                        </>
                      )}
                    </ul>
                  </div>
                )}

                {category === 'searching' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Các Bước Thuật Toán:</h3>
                    <ul className="list-disc list-inside space-y-2">
                      {algorithmId === 'linear-search' && (
                        <>
                          <li>Bắt đầu từ phần tử đầu tiên của mảng</li>
                          <li>So sánh từng phần tử với giá trị mục tiêu</li>
                          <li>Nếu tìm thấy khớp, trả về chỉ số</li>
                          <li>Nếu đến cuối mà không tìm thấy mục tiêu, trả về -1</li>
                        </>
                      )}
                      {algorithmId === 'binary-search' && (
                        <>
                          <li>Đảm bảo mảng đã được sắp xếp (điều kiện tiên quyết)</li>
                          <li>Đặt ranh giới trái và phải của không gian tìm kiếm</li>
                          <li>Tính chỉ số giữa và so sánh với mục tiêu</li>
                          <li>Loại bỏ một nửa không gian tìm kiếm dựa trên so sánh</li>
                          <li>Lặp lại cho đến khi tìm thấy mục tiêu hoặc không gian tìm kiếm rỗng</li>
                        </>
                      )}
                    </ul>
                  </div>
                )}

                {category === 'extreme' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Các Bước Thuật Toán:</h3>
                    <ul className="list-disc list-inside space-y-2">
                      {algorithmId === 'linear-min-max' && (
                        <>
                          <li>Khởi tạo min và max với phần tử đầu tiên</li>
                          <li>Lặp qua các phần tử còn lại</li>
                          <li>Cập nhật min nếu tìm thấy phần tử nhỏ hơn</li>
                          <li>Cập nhật max nếu tìm thấy phần tử lớn hơn</li>
                          <li>Trả về cả giá trị min và max</li>
                        </>
                      )}
                      {algorithmId === 'tournament-method' && (
                        <>
                          <li>Chia mảng thành các cặp phần tử</li>
                          <li>So sánh các phần tử trong mỗi cặp để tìm min/max cục bộ</li>
                          <li>Áp dụng đệ quy quá trình cho những người thắng</li>
                          <li>Tiếp tục cho đến khi chỉ còn một min và một max</li>
                          <li>Điều này giảm tổng số lần so sánh cần thiết</li>
                        </>
                      )}
                    </ul>
                  </div>
                )}

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">💡 Mẹo:</h4>
                  <p className="text-blue-800 text-sm">
                    Sử dụng điều khiển tốc độ và điều hướng từng bước để hiểu rõ hơn cách thuật toán xử lý dữ liệu.
                    Thử các kích thước mảng và mẫu dữ liệu khác nhau để xem thuật toán hoạt động như thế nào trong các tình huống khác nhau.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
