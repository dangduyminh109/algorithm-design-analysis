'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Settings, 
  TrendingUp,
  BarChart3,
  Zap
} from 'lucide-react';
import { BenchmarkConfig, BenchmarkResult, DataDistribution } from '@/types/instrumentation';
import { algorithms } from '@/lib/algorithms';

interface BenchmarkLabProps {
  onRunBenchmark?: (config: BenchmarkConfig) => void;
}

export default function BenchmarkLab({ onRunBenchmark }: BenchmarkLabProps) {
  const [selectedAlgorithms, setSelectedAlgorithms] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<'sorting' | 'searching' | 'extreme'>('sorting');
  const [inputSizes, setInputSizes] = useState<number[]>([10, 50, 100, 500, 1000]);
  const [customSize, setCustomSize] = useState<string>('');
  const [distributions, setDistributions] = useState<DataDistribution[]>(['random']);
  const [runsPerConfig, setRunsPerConfig] = useState<number>(3);
  const [isRunning, setIsRunning] = useState(false);

  const availableDistributions: { value: DataDistribution; label: string; description: string }[] = [
    { value: 'random', label: 'Random', description: 'Dữ liệu ngẫu nhiên' },
    { value: 'sorted', label: 'Sorted', description: 'Đã sắp xếp tăng dần' },
    { value: 'reversed', label: 'Reversed', description: 'Sắp xếp giảm dần' },
    { value: 'nearly-sorted', label: 'Nearly Sorted', description: 'Gần như đã sắp xếp' },
    { value: 'few-unique', label: 'Few Unique', description: 'Ít giá trị duy nhất' },
  ];

  const toggleAlgorithm = (algorithmId: string) => {
    setSelectedAlgorithms(prev =>
      prev.includes(algorithmId)
        ? prev.filter(id => id !== algorithmId)
        : [...prev, algorithmId]
    );
  };

  const toggleDistribution = (dist: DataDistribution) => {
    setDistributions(prev =>
      prev.includes(dist)
        ? prev.filter(d => d !== dist)
        : [...prev, dist]
    );
  };

  const addCustomSize = () => {
    const size = parseInt(customSize);
    if (!isNaN(size) && size > 0 && size <= 100000 && !inputSizes.includes(size)) {
      setInputSizes(prev => [...prev, size].sort((a, b) => a - b));
      setCustomSize('');
    }
  };

  const removeSize = (size: number) => {
    setInputSizes(prev => prev.filter(s => s !== size));
  };

  const calculateTotalBenchmarks = () => {
    return selectedAlgorithms.length * inputSizes.length * distributions.length * runsPerConfig;
  };

  const handleRunBenchmark = () => {
    if (selectedAlgorithms.length === 0) {
      alert('Vui lòng chọn ít nhất một thuật toán');
      return;
    }
    if (inputSizes.length === 0) {
      alert('Vui lòng chọn ít nhất một kích thước đầu vào');
      return;
    }
    if (distributions.length === 0) {
      alert('Vui lòng chọn ít nhất một phân phối dữ liệu');
      return;
    }

    const totalBenchmarks = calculateTotalBenchmarks();
    const maxBenchmarks = 500; // Giới hạn an toàn
    const warningThreshold = 200; // Ngưỡng cảnh báo

    // Cảnh báo nếu quá nhiều
    if (totalBenchmarks > maxBenchmarks) {
      alert(
        `Quá nhiều benchmark!\n\n` +
        `Tổng số: ${totalBenchmarks} tests\n` +
        `Giới hạn: ${maxBenchmarks} tests\n\n` +
        `Gợi ý:\n` +
        `• Giảm số thuật toán (hiện: ${selectedAlgorithms.length})\n` +
        `• Giảm kích thước đầu vào (hiện: ${inputSizes.length})\n` +
        `• Giảm phân phối dữ liệu (hiện: ${distributions.length})\n` +
        `• Giảm số lần chạy (hiện: ${runsPerConfig})`
      );
      return;
    }

    // Cảnh báo nhẹ nếu nhiều
    if (totalBenchmarks > warningThreshold) {
      const confirmed = confirm(
        `Cảnh báo: Bạn sắp chạy ${totalBenchmarks} tests\n\n` +
        `Điều này có thể mất vài phút và làm trình duyệt tạm dừng.\n\n` +
        `Bạn có chắc muốn tiếp tục?`
      );
      if (!confirmed) return;
    }

    const config: BenchmarkConfig = {
      algorithmIds: selectedAlgorithms,
      inputSizes,
      distributions,
      runsPerConfig
    };

    setIsRunning(true);
    onRunBenchmark?.(config);
  };

  const handleReset = () => {
    setSelectedAlgorithms([]);
    setInputSizes([10, 50, 100, 500, 1000]);
    setDistributions(['random']);
    setRunsPerConfig(3);
    setIsRunning(false);
  };

  const categoryAlgorithms = algorithms[selectedCategory] || [];

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-2"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
          Benchmark Lab
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          So sánh hiệu suất của các thuật toán với dữ liệu thực tế
        </p>
      </motion.div>

      {/* Category Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
      >
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Chọn Danh Mục
        </h2>
        <div className="flex gap-3">
          {(['sorting', 'searching', 'extreme'] as const).map((category) => (
            <button
              key={category}
              onClick={() => {
                setSelectedCategory(category);
                setSelectedAlgorithms([]);
              }}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white shadow-lg scale-105'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {category === 'sorting' ? 'Sắp Xếp' : category === 'searching' ? 'Tìm Kiếm' : 'Tìm Cực Trị'}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Algorithm Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Chọn Thuật Toán ({selectedAlgorithms.length} đã chọn)
          </h2>
          {selectedAlgorithms.length > 5 && (
            <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full">
               Nhiều thuật toán
            </span>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {categoryAlgorithms.map((algo) => (
            <button
              key={algo.id}
              onClick={() => toggleAlgorithm(algo.id)}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                selectedAlgorithms.includes(algo.id)
                  ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-semibold text-sm">{algo.name}</h3>
                {selectedAlgorithms.includes(algo.id) && (
                  <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Avg: {algo.timeComplexity.average}
              </p>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Input Sizes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
      >
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Kích Thước Đầu Vào
        </h2>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {inputSizes.map((size) => (
              <div
                key={size}
                className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center gap-2"
              >
                <span className="font-medium">{size.toLocaleString()}</span>
                <button
                  onClick={() => removeSize(size)}
                  className="text-red-600 hover:text-red-700"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="number"
              value={customSize}
              onChange={(e) => setCustomSize(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addCustomSize()}
              placeholder="Thêm kích thước tùy chỉnh (1-100000)"
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
              min="1"
              max="100000"
            />
            <button
              onClick={addCustomSize}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Thêm
            </button>
          </div>
        </div>
      </motion.div>

      {/* Data Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
      >
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Phân Phối Dữ Liệu
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {availableDistributions.map((dist) => (
            <button
              key={dist.value}
              onClick={() => toggleDistribution(dist.value)}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                distributions.includes(dist.value)
                  ? 'border-cyan-600 bg-cyan-50 dark:bg-cyan-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-semibold text-sm">{dist.label}</h3>
                {distributions.includes(dist.value) && (
                  <div className="w-5 h-5 bg-cyan-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {dist.description}
              </p>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Runs Configuration */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
      >
        <h2 className="text-xl font-semibold mb-4">Số Lần Chạy Mỗi Cấu Hình</h2>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min="1"
            max="10"
            value={runsPerConfig}
            onChange={(e) => setRunsPerConfig(parseInt(e.target.value))}
            className="flex-1"
          />
          <span className="text-2xl font-bold text-blue-600 w-12 text-center">
            {runsPerConfig}
          </span>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          Mỗi cấu hình sẽ được chạy {runsPerConfig} lần và lấy giá trị trung bình
        </p>
      </motion.div>

      {/* Benchmark Summary */}
      {selectedAlgorithms.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className={`rounded-xl p-4 ${
            calculateTotalBenchmarks() > 200 
              ? 'bg-red-50 dark:bg-red-900/20 border-2 border-red-300 dark:border-red-700' 
              : calculateTotalBenchmarks() > 100
              ? 'bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-300 dark:border-yellow-700'
              : 'bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-300 dark:border-blue-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-sm mb-1">
                Tổng số tests: <span className="text-2xl">{calculateTotalBenchmarks()}</span>
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {selectedAlgorithms.length} thuật toán × {inputSizes.length} kích thước × {distributions.length} phân phối × {runsPerConfig} lần chạy
              </p>
            </div>
            <div className="text-right">
              {calculateTotalBenchmarks() > 200 ? (
                <span className="text-red-600 font-semibold text-sm flex items-center gap-1">
                  <span className="text-xl"></span> Quá nhiều!
                </span>
              ) : calculateTotalBenchmarks() > 100 ? (
                <span className="text-yellow-600 font-semibold text-sm flex items-center gap-1">
                  <span className="text-xl"></span> Nhiều
                </span>
              ) : (
                <span className="text-green-600 font-semibold text-sm flex items-center gap-1">
                  <span className="text-xl">✓</span> OK
                </span>
              )}
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Ước tính: ~{Math.ceil(calculateTotalBenchmarks() / 10)} giây
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Control Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="flex gap-4 justify-center"
      >
        <button
          onClick={handleRunBenchmark}
          disabled={isRunning || selectedAlgorithms.length === 0}
          className={`px-8 py-4 rounded-xl font-semibold text-lg flex items-center gap-2 transition-all ${
            isRunning || selectedAlgorithms.length === 0
              ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:shadow-lg hover:scale-105'
          }`}
        >
          {isRunning ? (
            <>
              <Pause className="w-5 h-5 animate-pulse" />
              Đang Chạy...
            </>
          ) : (
            <>
              <Play className="w-5 h-5" />
              Chạy Benchmark
            </>
          )}
        </button>
        <button
          onClick={handleReset}
          className="px-8 py-4 bg-gray-200 dark:bg-gray-700 rounded-xl font-semibold text-lg flex items-center gap-2 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
        >
          <RotateCcw className="w-5 h-5" />
          Đặt Lại
        </button>
      </motion.div>

      {/* Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-6"
      >
        <h3 className="text-lg font-semibold mb-3">Tổng Quan Benchmark</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-3xl font-bold text-blue-600">{selectedAlgorithms.length}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Thuật toán</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-cyan-600">{inputSizes.length}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Kích thước</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-green-600">{distributions.length}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Phân phối</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-orange-600">
              {selectedAlgorithms.length * inputSizes.length * distributions.length * runsPerConfig}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Tổng số test</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
