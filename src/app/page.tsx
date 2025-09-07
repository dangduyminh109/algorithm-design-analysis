'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Header from '@/components/Header';
import AnimatedBubble from '@/components/AnimatedBubble';
import AlgorithmBubble from '@/components/AlgorithmBubble';
import BackgroundEffects from '@/components/BackgroundEffects';
import { Search, BarChart3, TrendingUp, Eye, Code, Zap } from 'lucide-react';
import { algorithms } from '@/lib/algorithms';
import { Algorithm } from '@/types/algorithm';

const algorithmCategories = [
  {
    id: 'sorting',
    name: 'Sorting',
    icon: BarChart3,
    title: 'Thuật toán Sắp xếp',
    description: 'Tìm hiểu các thuật toán sắp xếp phổ biến như Bubble Sort, Quick Sort, Merge Sort và phân tích độ phức tạp thời gian của chúng.',
    features: ['Bubble Sort', 'Quick Sort', 'Merge Sort', 'Selection Sort'],
    complexity: 'O(n log n)',
    color: 'from-blue-300 to-blue-500'
  },
  {
    id: 'searching',
    name: 'Searching',
    icon: Search,
    title: 'Thuật toán Tìm kiếm',
    description: 'Khám phá các phương pháp tìm kiếm hiệu quả từ tìm kiếm tuyến tính đến tìm kiếm nhị phân với độ phức tạp tối ưu.',
    features: ['Linear Search', 'Binary Search', 'Jump Search', 'Interpolation Search'],
    complexity: 'O(log n)',
    color: 'from-cyan-300 to-blue-400'
  },
  {
    id: 'extreme',
    name: 'Extreme',
    icon: TrendingUp,
    title: 'Tìm giá trị Cực trị',
    description: 'Học cách tìm giá trị lớn nhất và nhỏ nhất trong mảng dữ liệu với các thuật toán tối ưu khác nhau.',
    features: ['Linear Min/Max', 'Tournament Method', 'Divide & Conquer', 'Optimization'],
    complexity: 'O(n)',
    color: 'from-blue-200 to-cyan-400'
  }
];

export default function HomePage() {
  const router = useRouter();
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [hoveredAlgorithm, setHoveredAlgorithm] = useState<Algorithm | null>(null);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [pushedAway, setPushedAway] = useState<boolean>(false);

  const handleCategoryClick = (categoryId: string) => {
    if (expandedCategory === categoryId) {
      // If already expanded, navigate to category page
      router.push(`/algorithms/${categoryId}`);
    } else {
      // Expand to show algorithm bubbles and push others away
      setExpandedCategory(categoryId);
      setPushedAway(true);
    }
  };

  const handleAlgorithmClick = (algorithmId: string) => {
    // Find which category this algorithm belongs to
    const categoryKey = Object.keys(algorithms).find(key => 
      algorithms[key].some(alg => alg.id === algorithmId)
    );
    if (categoryKey) {
      router.push(`/algorithms/${categoryKey}/${algorithmId}`);
    }
  };

  const handleBubbleHover = (categoryId: string | null) => {
    setHoveredCategory(categoryId);
    if (categoryId === null) {
      setHoveredAlgorithm(null);
    }
  };

  const handleBackgroundClick = () => {
    setExpandedCategory(null);
    setHoveredCategory(null);
    setHoveredAlgorithm(null);
    setPushedAway(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-cyan-50 to-blue-200 relative overflow-hidden">
      <Header />
      
      {/* Background animated effects */}
      <BackgroundEffects />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          
          {/* Left side - Content */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Algorithm
              </h1>
              
              <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-6">
                Complexity Visualizer
              </h2>
              
              <p className="text-xl text-gray-600 leading-relaxed mb-8">
                Khám phá và hiểu sâu về độ phức tạp thuật toán thông qua 
                <span className="text-blue-600 font-semibold"> trực quan hóa tương tác</span> và 
                <span className="text-purple-600 font-semibold"> animation sinh động</span>.
              </p>
            </motion.div>

            {/* Category and Algorithm description when hovering */}
            <motion.div
              className="overflow-hidden"
              layout
            >
              {(hoveredCategory || hoveredAlgorithm) && (
                <motion.div 
                  className="bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-white/60 mt-6"
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  layoutId="category-info"
                >
                  {hoveredAlgorithm ? (
                    // Algorithm information
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1 }}
                    >
                      <motion.h3 
                        className="text-2xl font-bold text-gray-900 mb-3"
                        initial={{ x: -20 }}
                        animate={{ x: 0 }}
                        transition={{ delay: 0.1 }}
                      >
                        {hoveredAlgorithm.name}
                      </motion.h3>
                      <motion.p 
                        className="text-gray-700 mb-4 leading-relaxed"
                        initial={{ x: -20 }}
                        animate={{ x: 0 }}
                        transition={{ delay: 0.15 }}
                      >
                        {hoveredAlgorithm.description}
                      </motion.p>
                      <div className="space-y-3">
                        <motion.div
                          initial={{ x: -20 }}
                          animate={{ x: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                            Độ phức tạp thời gian:
                          </span>
                          <motion.span 
                            className="ml-2 px-3 py-1 bg-gradient-to-r from-green-100 to-blue-100 text-green-800 rounded-full text-sm font-mono"
                            whileHover={{ scale: 1.05 }}
                          >
                            {hoveredAlgorithm.timeComplexity.average}
                          </motion.span>
                        </motion.div>
                        <motion.div
                          initial={{ x: -20 }}
                          animate={{ x: 0 }}
                          transition={{ delay: 0.22 }}
                        >
                          <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                            Độ phức tạp không gian:
                          </span>
                          <motion.span 
                            className="ml-2 px-3 py-1 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800 rounded-full text-sm font-mono"
                            whileHover={{ scale: 1.05 }}
                          >
                            {hoveredAlgorithm.spaceComplexity}
                          </motion.span>
                        </motion.div>
                        <div>
                          <motion.span 
                            className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2 block"
                            initial={{ x: -20 }}
                            animate={{ x: 0 }}
                            transition={{ delay: 0.25 }}
                          >
                            Ứng dụng:
                          </motion.span>
                          <div className="flex flex-wrap gap-2">
                            {hoveredAlgorithm.applications.slice(0, 3).map((app, index) => (
                              <motion.span
                                key={index}
                                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200 transition-colors"
                                initial={{ opacity: 0, y: 10, scale: 0.8 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{ delay: 0.3 + index * 0.05 }}
                                whileHover={{ scale: 1.05, y: -2 }}
                              >
                                {app}
                              </motion.span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ) : algorithmCategories.find(cat => cat.id === hoveredCategory) && (() => {
                    const category = algorithmCategories.find(cat => cat.id === hoveredCategory)!;
                    return (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                      >
                        <motion.h3 
                          className="text-2xl font-bold text-gray-900 mb-3"
                          initial={{ x: -20 }}
                          animate={{ x: 0 }}
                          transition={{ delay: 0.1 }}
                        >
                          {category.title}
                        </motion.h3>
                        <motion.p 
                          className="text-gray-700 mb-4 leading-relaxed"
                          initial={{ x: -20 }}
                          animate={{ x: 0 }}
                          transition={{ delay: 0.15 }}
                        >
                          {category.description}
                        </motion.p>
                        <div className="space-y-3">
                          <motion.div
                            initial={{ x: -20 }}
                            animate={{ x: 0 }}
                            transition={{ delay: 0.2 }}
                          >
                            <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                              Độ phức tạp:
                            </span>
                            <motion.span 
                              className="ml-2 px-3 py-1 bg-gradient-to-r from-green-100 to-blue-100 text-green-800 rounded-full text-sm font-mono"
                              whileHover={{ scale: 1.05 }}
                            >
                              {category.complexity}
                            </motion.span>
                          </motion.div>
                          <div>
                            <motion.span 
                              className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2 block"
                              initial={{ x: -20 }}
                              animate={{ x: 0 }}
                              transition={{ delay: 0.25 }}
                            >
                              Thuật toán bao gồm:
                            </motion.span>
                            <div className="flex flex-wrap gap-2">
                              {category.features.map((feature, index) => (
                                <motion.span
                                  key={index}
                                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200 transition-colors"
                                  initial={{ opacity: 0, y: 10, scale: 0.8 }}
                                  animate={{ opacity: 1, y: 0, scale: 1 }}
                                  transition={{ delay: 0.3 + index * 0.05 }}
                                  whileHover={{ scale: 1.05, y: -2 }}
                                >
                                  {feature}
                                </motion.span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })()}
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* Right side - Bubbles */}
          <div className="relative flex justify-center items-center" onClick={handleBackgroundClick}>
            <div className="relative w-full max-w-2xl h-[700px]" onClick={(e) => e.stopPropagation()}>
              {algorithmCategories.map((category, index) => {
                // Define main bubble positions in coordinate system (x, y from container)
                const mainBubblePositions = [
                  { x: 300, y: 180 },  // Sorting - top center (moved down to avoid header)
                  { x: 100, y: 500 },  // Searching - bottom left (dịch trái 50px)
                  { x: 500, y: 500 }   // Extreme - bottom right (dịch trái 150px)
                ];

                // Calculate pushed away positions when a category is expanded  
                const getPushedPosition = (currentIndex: number, expandedIndex: number) => {
                  const basePos = mainBubblePositions[currentIndex];
                  if (!pushedAway || currentIndex === expandedIndex) {
                    return basePos;
                  }

                  switch (expandedIndex) {
                    case 0: // Top center expanded (Sorting)
                      if (currentIndex === 1) return { x: basePos.x - 50, y: basePos.y }; // Push left further
                      if (currentIndex === 2) return { x: basePos.x + 50, y: basePos.y }; // Push right further
                      break;
                    case 1: // Bottom left expanded (Searching)
                      if (currentIndex === 0) return { x: basePos.x + 100, y: basePos.y }; // Push top-center to right
                      if (currentIndex === 2) return { x: basePos.x + 50, y: basePos.y }; // Push right further
                      break;
                    case 2: // Bottom right expanded (Extreme)
                      if (currentIndex === 0) return { x: basePos.x - 100, y: basePos.y }; // Push top-center to left
                      if (currentIndex === 1) return { x: basePos.x - 50, y: basePos.y }; // Push left further
                      break;
                  }
                  return basePos;
                };

                const expandedIndex = algorithmCategories.findIndex(cat => cat.id === expandedCategory);
                const mainBubblePos = getPushedPosition(index, expandedIndex);
                
                return (
                  <div key={category.id}>
                    <AnimatedBubble
                      category={category}
                      position={mainBubblePos}
                      index={index}
                      onHover={handleBubbleHover}
                      onClick={handleCategoryClick}
                      isPushed={pushedAway && expandedCategory !== category.id}
                    />
                    
                    {/* Algorithm sub-bubbles */}
                    <AnimatePresence>
                      {expandedCategory === category.id && (
                        <>
                          {algorithms[category.id]?.slice(0, 4).map((algorithm, algIndex) => {
                            // Calculate child bubble positions relative to parent bubble center
                            const parentRadius = 96; // Main bubble radius (192px diameter - w-48 h-48)
                            const childRadius = 56;  // Child bubble radius (112px diameter - w-28 h-28)
                            const gap = 50; // Gap between parent and child edges (balanced to avoid overlap and header)
                            const totalDistance = parentRadius + childRadius + gap; // 177px from parent center
                            
                            const childPositions = [
                              // For top center bubble (Sorting) - compass formation around parent
                              [
                                { x: mainBubblePos.x, y: mainBubblePos.y - totalDistance },      // Top
                                { x: mainBubblePos.x - totalDistance, y: mainBubblePos.y },     // Left  
                                { x: mainBubblePos.x + totalDistance, y: mainBubblePos.y },     // Right
                                { x: mainBubblePos.x, y: mainBubblePos.y + totalDistance }      // Bottom
                              ],
                              // For bottom left bubble (Searching) - square formation
                              [
                                { x: mainBubblePos.x - totalDistance * 0.7, y: mainBubblePos.y - totalDistance * 0.7 }, // Top-left
                                { x: mainBubblePos.x + totalDistance * 0.7, y: mainBubblePos.y - totalDistance * 0.7 }, // Top-right
                                { x: mainBubblePos.x - totalDistance * 0.7, y: mainBubblePos.y + totalDistance * 0.7 }, // Bottom-left
                                { x: mainBubblePos.x + totalDistance * 0.7, y: mainBubblePos.y + totalDistance * 0.7 }  // Bottom-right
                              ],
                              // For bottom right bubble (Extreme) - square formation
                              [
                                { x: mainBubblePos.x - totalDistance * 0.7, y: mainBubblePos.y - totalDistance * 0.7 }, // Top-left
                                { x: mainBubblePos.x + totalDistance * 0.7, y: mainBubblePos.y - totalDistance * 0.7 }, // Top-right
                                { x: mainBubblePos.x - totalDistance * 0.7, y: mainBubblePos.y + totalDistance * 0.7 }, // Bottom-left
                                { x: mainBubblePos.x + totalDistance * 0.7, y: mainBubblePos.y + totalDistance * 0.7 }  // Bottom-right
                              ]
                            ];

                            const childPosition = childPositions[index][algIndex];
                            
                            return (
                              <AlgorithmBubble
                                key={algorithm.id}
                                algorithm={algorithm}
                                position={childPosition}
                                index={algIndex}
                                onHover={setHoveredAlgorithm}
                                onClick={handleAlgorithmClick}
                                parentPosition={{ x: mainBubblePos.x, y: mainBubblePos.y }}
                              />
                            );
                          })}
                        </>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom info section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-20"
        >

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Eye,
                title: "Trực Quan Hóa",
                description: "Mô tả chi tiết từng bước giúp hiểu rõ thuật toán",
                gradient: "from-blue-500 to-cyan-500"
              },
              {
                icon: Code, 
                title: "Phân Tích Code",
                description: "Mã nguồn được giải thích chi tiết",
                gradient: "from-blue-500 to-cyan-500"
              },
              {
                icon: Zap,
                title: "Độ Phức Tạp", 
                description: "Phân tích Big-O và hiệu suất thực tế",
                gradient: "from-blue-500 to-cyan-500"
              }
            ].map((item, index) => {
              const IconComponent = item.icon;
              return (
              <motion.div
                key={index}
                className="text-center bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                }}
              >
                <motion.div 
                  className={`w-12 h-12 bg-gradient-to-r ${item.gradient} rounded-full flex items-center justify-center mx-auto mb-4`}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <IconComponent className="w-5 h-5 text-white" />
                </motion.div>
                <h3 className="font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </motion.div>
            );
            })}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
