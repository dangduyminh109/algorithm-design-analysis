'use client';

import { useParams, useRouter } from 'next/navigation';
import { algorithms } from '@/lib/algorithms';
import Header from '@/components/Header';
import { motion } from 'framer-motion';
import { ArrowRight, Clock, Database } from 'lucide-react';

export default function AlgorithmCategoryPage() {
  const params = useParams();
  const router = useRouter();
  const category = params.category as string;

  const categoryAlgorithms = algorithms[category] || [];
  
  const categoryInfo = {
    sorting: {
      title: 'Thuật Toán Sắp Xếp',
      description: 'Khám phá các phương pháp khác nhau để sắp xếp dữ liệu theo thứ tự',
      color: 'blue'
    },
    searching: {
      title: 'Thuật Toán Tìm Kiếm', 
      description: 'Tìm hiểu các phương pháp để tìm kiếm phần tử cụ thể trong tập dữ liệu',
      color: 'green'
    },
    extreme: {
      title: 'Thuật Toán Tìm Giá Trị Cực Trị',
      description: 'Học các thuật toán tìm giá trị nhỏ nhất và lớn nhất',
      color: 'purple'
    }
  };

  const info = categoryInfo[category as keyof typeof categoryInfo];

  if (!info) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <Header showBackButton />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Không tìm thấy danh mục</h1>
            <p className="text-gray-600 mt-2">Danh mục thuật toán được yêu cầu không tồn tại.</p>
          </div>
        </div>
      </div>
    );
  }

  const handleAlgorithmClick = (algorithmId: string) => {
    router.push(`/algorithms/${category}/${algorithmId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header showBackButton />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            {info.title}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {info.description}
          </p>
        </motion.div>

        {/* Algorithm Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoryAlgorithms.map((algorithm, index) => (
            <motion.div
              key={algorithm.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-blue-50 border border-blue-100 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden"
              onClick={() => handleAlgorithmClick(algorithm.id)}
            >
              <div className="p-6">
                {/* Algorithm header */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900">{algorithm.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    algorithm.difficulty === 'Dễ' 
                      ? 'bg-green-100 text-green-800'
                      : algorithm.difficulty === 'Trung Bình'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {algorithm.difficulty}
                  </span>
                </div>

                {/* Description */}
                <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                  {algorithm.description.slice(0, 150)}...
                </p>

                {/* Complexity badges */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <span className="text-gray-600">Time:</span>
                    </div>
                    <code className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                      {algorithm.timeComplexity.average}
                    </code>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <Database className="w-4 h-4 text-purple-600" />
                      <span className="text-gray-600">Space:</span>
                    </div>
                    <code className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">
                      {algorithm.spaceComplexity}
                    </code>
                  </div>
                </div>

                {/* Applications preview */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Best for:</h4>
                  <div className="flex flex-wrap gap-1">
                    {algorithm.applications.slice(0, 2).map((app, idx) => (
                      <span 
                        key={idx}
                        className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                      >
                        {app.length > 25 ? `${app.slice(0, 25)}...` : app}
                      </span>
                    ))}
                    {algorithm.applications.length > 2 && (
                      <span className="text-xs text-gray-400">
                        +{algorithm.applications.length - 2} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Action button */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <span className="text-sm text-gray-500">Click to visualize</span>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                </div>
              </div>

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-blue-500/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </motion.div>
          ))}
        </div>

        {/* Category summary */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 bg-white rounded-xl shadow-md p-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Về thuật toán {info.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Bạn sẽ học được gì:</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Cách các thuật toán khác nhau tiếp cận cùng một vấn đề</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Sự đánh đổi giữa độ phức tạp thời gian và không gian</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Khi nào nên sử dụng từng thuật toán trong thực tế</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Hiểu biết trực quan từng bước một cách chi tiết</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Tính năng tương tác:</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Thực thi hoạt hình từng bước một cách chi tiết</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Tốc độ hoạt hình có thể điều chỉnh</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Làm nổi bật code đồng bộ với trực quan hóa</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Nhập dữ liệu tùy chỉnh và tạo mảng</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
