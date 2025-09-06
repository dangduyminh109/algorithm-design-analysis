'use client';

import { Algorithm } from '@/types/algorithm';
import { Clock, Database, Lightbulb, Star } from 'lucide-react';

interface AlgorithmInfoProps {
  algorithm: Algorithm;
}

export default function AlgorithmInfo({ algorithm }: AlgorithmInfoProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Dễ': return 'text-green-600 bg-green-100';
      case 'Trung Bình': return 'text-yellow-600 bg-yellow-100';
      case 'Khó': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold text-gray-900">{algorithm.name}</h2>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(algorithm.difficulty)}`}>
            {algorithm.difficulty}
          </span>
        </div>
        <p className="text-gray-600 leading-relaxed">{algorithm.description}</p>
      </div>

      {/* Complexity Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-2 mb-3">
            <Clock className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Độ Phức Tạp Thời Gian</h3>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span className="font-medium text-green-800">Trường Hợp Tốt Nhất:</span>
              <code className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-mono">
                {algorithm.timeComplexity.best}
              </code>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
              <span className="font-medium text-yellow-800">Trường Hợp Trung Bình:</span>
              <code className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm font-mono">
                {algorithm.timeComplexity.average}
              </code>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
              <span className="font-medium text-red-800">Trường Hợp Xấu Nhất:</span>
              <code className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-mono">
                {algorithm.timeComplexity.worst}
              </code>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-2 mb-3">
            <Database className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900">Độ Phức Tạp Không Gian</h3>
          </div>
          
          <div className="p-4 bg-purple-50 rounded-lg text-center">
            <code className="bg-purple-100 text-purple-800 px-3 py-2 rounded text-lg font-mono">
              {algorithm.spaceComplexity}
            </code>
          </div>

          {/* Additional info */}
          <div className="mt-6">
            <div className="flex items-center space-x-2 mb-3">
              <Star className="w-5 h-5 text-orange-600" />
              <h3 className="text-lg font-semibold text-gray-900">Danh Mục</h3>
            </div>
            <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium capitalize">
              Thuật Toán {algorithm.category === 'sorting' ? 'Sắp Xếp' : algorithm.category === 'searching' ? 'Tìm Kiếm' : 'Giá Trị Cực Trị'}
            </span>
          </div>
        </div>
      </div>

      {/* Applications */}
      <div>
        <div className="flex items-center space-x-2 mb-3">
          <Lightbulb className="w-5 h-5 text-yellow-600" />
          <h3 className="text-lg font-semibold text-gray-900">Ứng Dụng Thực Tế</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {algorithm.applications.map((application, index) => (
            <div key={index} className="flex items-start space-x-2 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <span className="text-gray-700 text-sm">{application}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Big-O Notation Explanation */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2">Hiểu về Ký Hiệu Big-O</h4>
        <p className="text-blue-800 text-sm">
          Ký hiệu Big-O mô tả độ phức tạp tính toán của thuật toán khi kích thước đầu vào tăng lên.
          Nó giúp chúng ta hiểu cách thuật toán mở rộng và so sánh các phương pháp khác nhau.
        </p>
      </div>
    </div>
  );
}
