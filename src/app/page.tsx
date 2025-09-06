'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { Search, BarChart3, TrendingUp } from 'lucide-react';

const algorithmCategories = [
  {
    id: 'sorting',
    name: 'Thuật Toán Sắp Xếp',
    icon: BarChart3,
    position: 'top' // Bong bóng trên cùng
  },
  {
    id: 'searching',
    name: 'Thuật Toán Tìm Kiếm',
    icon: Search,
    position: 'bottom-left' // Bong bóng dưới trái
  },
  {
    id: 'extreme',
    name: 'Tìm Giá Trị Cực Trị',
    icon: TrendingUp,
    position: 'bottom-right' // Bong bóng dưới phải
  }
];

export default function HomePage() {
  const router = useRouter();

  const handleCategoryClick = (categoryId: string) => {
    router.push(`/algorithms/${categoryId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-255">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-3xl md:text-4xl font-bold text-gray-900 mb-6"
                    >
                        Algorithm Complexity{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                            Visualizer
                        </span>
                    </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Hình ảnh trực quan tương tác giúp chúng ta hiểu cách thuật toán hoạt động từng bước.
          </motion.p>
        </div>

        {/* Bubble Layout - Triangle Formation */}
        <div className="relative flex flex-col items-center space-y-16 max-w-4xl mx-auto">
          {algorithmCategories.map((category, index) => {
            const IconComponent = category.icon;
            
            // Position bubbles in triangle formation
            const getPositionClasses = () => {
              switch(category.position) {
                case 'top':
                  return 'mx-auto'; // Center top
                case 'bottom-left':
                  return 'mr-auto ml-8'; // Left side
                case 'bottom-right':
                  return 'ml-auto mr-24'; // Right side
                default:
                  return 'mx-auto';
              }
            };

            // Gradient intensity based on position (darker towards center concept)
            const getGradientIntensity = () => {
              switch(category.position) {
                case 'top':
                  return 'from-blue-300 to-blue-500'; // Medium intensity
                case 'bottom-left':
                  return 'from-blue-300 to-blue-600'; // Lighter
                case 'bottom-right':
                  return 'from-blue-400 to-blue-500'; // Lighter
                default:
                  return 'from-blue-300 to-blue-500';
              }
            };
            
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, scale: 0.5, y: 100 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ 
                  duration: 0.8, 
                  delay: index * 0.3,
                  type: "spring",
                  stiffness: 100,
                  damping: 10
                }}
                whileHover={{ 
                  scale: 1.1,
                  transition: { duration: 0.3 }
                }}
                whileTap={{ scale: 0.95 }}
                className={`cursor-pointer ${getPositionClasses()}`}
                onClick={() => handleCategoryClick(category.id)}
              >
                <div className="relative group">
                  {/* Main bubble */}
                  <div className={`
                    relative w-72 h-72 rounded-full 
                    bg-gradient-to-br ${getGradientIntensity()}
                    hover:from-blue-400 hover:to-blue-600
                    shadow-2xl hover:shadow-3xl
                    transition-all duration-500
                    flex flex-col items-center justify-center
                    text-white p-6
                    border-4 border-white/20
                  `}>
                    {/* Floating animation */}
                    <motion.div
                      animate={{ 
                        y: [0, -15, 0],
                        rotate: [0, 1, -1, 0]
                      }}
                      transition={{ 
                        duration: 4, 
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="text-center"
                    >
                      <IconComponent className="w-20 h-20 mb-6 mx-auto drop-shadow-lg" />
                      <h3 className="text-2xl font-bold drop-shadow-md">
                        {category.name}
                      </h3>
                    </motion.div>

                    {/* Subtle glow effect */}
                    <div className={`
                      absolute inset-0 rounded-full 
                      bg-gradient-to-br ${getGradientIntensity()}
                      opacity-0 group-hover:opacity-30 
                      transition-opacity duration-500
                      blur-2xl scale-110
                    `} />

                    {/* Ripple effect on hover */}
                    <div className="
                      absolute inset-0 rounded-full
                      bg-white bg-opacity-10
                      opacity-0 group-hover:opacity-100
                      transition-all duration-500
                      transform group-hover:scale-110
                    " />
                  </div>

                  {/* Hover text */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileHover={{ opacity: 1, y: 0 }}
                    className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 
                               text-center text-gray-700 font-medium
                               bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full
                               shadow-lg whitespace-nowrap"
                  >
                    Nhấp để Khám Phá
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Additional info section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="mt-24 text-center"
        >
          <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Học độ phức tạp thuật toán một cách trực quan
            </h2>
            <p className="text-gray-600 leading-relaxed text-lg mb-8">
              Trang web thể hiện cách các thuật toán khác nhau xử lý dữ liệu, so sánh hiệu suất của chúng và hiểu sâu hơn về
              ký hiệu Big-O thông qua các minh họa hoạt hình.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="text-center bg-blue-50 p-6 rounded-xl"
              >
                <h3 className="font-bold text-gray-900 mb-3 text-lg">Trực Quan Hóa Tương Tác</h3>
                <p className="text-sm text-gray-600">Minh họa hoạt hình từng bước của quá trình thực thi thuật toán</p>
              </motion.div>
              
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="text-center bg-blue-50 p-6 rounded-xl"
              >
                <h3 className="font-bold text-gray-900 mb-3 text-lg">Giải Thích Mã Nguồn</h3>
                <p className="text-sm text-gray-600">Mã nguồn được tô sáng cú pháp với giải thích chi tiết</p>
              </motion.div>
              
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="text-center bg-blue-50 p-6 rounded-xl"
              >
                <h3 className="font-bold text-gray-900 mb-3 text-lg">Phân Tích Hiệu Suất</h3>
                <p className="text-sm text-gray-600">Độ phức tạp Big-O và ứng dụng thực tế</p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
