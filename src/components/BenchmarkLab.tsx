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
    <div className="w-full max-w-7xl mx-auto p-4 space-y-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-1"
      >
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
          Benchmark Lab
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          So sánh hiệu suất của các thuật toán với dữ liệu thực tế
        </p>
      </motion.div>

      {/* Top Row: Category, Input Sizes, Runs Config */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        {/* Category Selection - Compact Box */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Chọn Danh Mục
          </h2>
          <div className="grid grid-cols-3 gap-2">
            {(['sorting', 'searching', 'extreme'] as const).map((category) => (
              <button
                key={category}
                onClick={() => {
                  setSelectedCategory(category);
                  setSelectedAlgorithms([]);
                }}
                className={`py-3 rounded-lg font-medium text-xs transition-all flex items-center justify-center ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white shadow-lg scale-105'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <span className="text-center leading-tight">
                  {category === 'sorting' ? 'Sắp Xếp' : category === 'searching' ? 'Tìm Kiếm' : 'Cực Trị'}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Input Sizes - Compact */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Kích Thước Đầu Vào
          </h2>
          <div className="space-y-2">
            <div className="flex flex-wrap gap-1.5">
              {inputSizes.map((size) => (
                <div
                  key={size}
                  className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 rounded text-xs flex items-center gap-1"
                >
                  <span className="font-medium">{size.toLocaleString()}</span>
                  <button
                    onClick={() => removeSize(size)}
                    className="text-red-600 hover:text-red-700 text-sm"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-1">
              <input
                type="number"
                value={customSize}
                onChange={(e) => setCustomSize(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addCustomSize()}
                placeholder="Thêm (1-100000)"
                className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                min="1"
                max="100000"
              />
              <button
                onClick={addCustomSize}
                className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Runs Configuration - Compact */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h2 className="text-sm font-semibold mb-3">Số Lần Chạy</h2>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="1"
              max="10"
              value={runsPerConfig}
              onChange={(e) => setRunsPerConfig(parseInt(e.target.value))}
              className="flex-1"
            />
            <span className="text-2xl font-bold text-blue-600 w-10 text-center">
              {runsPerConfig}
            </span>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
            Chạy {runsPerConfig}× mỗi cấu hình
          </p>
        </div>
      </motion.div>

      {/* Middle Row: Algorithms and Distributions Side by Side */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {/* Algorithm Selection */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Chọn Thuật Toán ({selectedAlgorithms.length})
            </h2>
            {selectedAlgorithms.length > 5 && (
              <span className="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded-full">
                Nhiều
              </span>
            )}
          </div>
          <div className="grid grid-cols-1 gap-2 max-h-[400px] overflow-y-auto pr-2">
            {categoryAlgorithms.map((algo) => (
              <button
                key={algo.id}
                onClick={() => toggleAlgorithm(algo.id)}
                className={`p-3 rounded-lg border-2 transition-all text-left ${
                  selectedAlgorithms.includes(algo.id)
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm">{algo.name}</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Avg: {algo.timeComplexity.average}
                    </p>
                  </div>
                  {selectedAlgorithms.includes(algo.id) && (
                    <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 ml-2">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Data Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Phân Phối Dữ Liệu
          </h2>
          <div className="grid grid-cols-1 gap-2">
            {availableDistributions.map((dist) => (
              <button
                key={dist.value}
                onClick={() => toggleDistribution(dist.value)}
                className={`p-3 rounded-lg border-2 transition-all text-left ${
                  distributions.includes(dist.value)
                    ? 'border-cyan-600 bg-cyan-50 dark:bg-cyan-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm">{dist.label}</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {dist.description}
                    </p>
                  </div>
                  {distributions.includes(dist.value) && (
                    <div className="w-5 h-5 bg-cyan-600 rounded-full flex items-center justify-center flex-shrink-0 ml-2">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Bottom Row: Summary and Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        {/* Benchmark Summary Stats - Compact */}
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg p-4 md:col-span-2">
          <h3 className="text-sm font-semibold mb-3">Tổng Quan Benchmark</h3>
          <div className="grid grid-cols-4 gap-3 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">{selectedAlgorithms.length}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Thuật toán</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-cyan-600">{inputSizes.length}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Kích thước</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{distributions.length}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Phân phối</div>
            </div>
            <div>
              <div className={`text-2xl font-bold ${
                calculateTotalBenchmarks() > 200 ? 'text-red-600' : 
                calculateTotalBenchmarks() > 100 ? 'text-yellow-600' : 
                'text-orange-600'
              }`}>
                {calculateTotalBenchmarks()}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Tổng test</div>
            </div>
          </div>
          {selectedAlgorithms.length > 0 && (
            <div className={`mt-3 p-2 rounded-lg text-center text-xs ${
              calculateTotalBenchmarks() > 200 
                ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300' 
                : calculateTotalBenchmarks() > 100
                ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
            }`}>
              {calculateTotalBenchmarks() > 200 ? (
                <>⚠️ Quá nhiều! Giảm số lượng để tránh treo trình duyệt</>
              ) : calculateTotalBenchmarks() > 100 ? (
                <>⏱️ Nhiều test - Ước tính ~{Math.ceil(calculateTotalBenchmarks() / 10)} giây</>
              ) : (
                <>✓ OK - Ước tính ~{Math.ceil(calculateTotalBenchmarks() / 10)} giây</>
              )}
            </div>
          )}
        </div>

        {/* Control Buttons - Vertical Stack */}
        <div className="flex flex-col gap-2">
          <button
            onClick={handleRunBenchmark}
            disabled={isRunning || selectedAlgorithms.length === 0}
            className={`flex-1 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
              isRunning || selectedAlgorithms.length === 0
                ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:shadow-lg hover:scale-[1.02]'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-4 h-4 animate-pulse" />
                Đang Chạy...
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Chạy Benchmark
              </>
            )}
          </button>
          <button
            onClick={handleReset}
            className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            Đặt Lại
          </button>
        </div>
      </motion.div>
    </div>
  );
}
