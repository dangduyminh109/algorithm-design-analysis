'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import BenchmarkLab from '@/components/BenchmarkLab';
import BenchmarkResults from '@/components/BenchmarkResults';
import { 
  BenchmarkConfig, 
  BenchmarkResult, 
  BenchmarkRun 
} from '@/types/instrumentation';
import { 
  runBenchmark, 
  aggregateBenchmarkResults, 
  exportToCSV, 
  exportToJSON 
} from '@/lib/benchmarkEngine';

export default function BenchmarkPage() {
  const [benchmarkResult, setBenchmarkResult] = useState<BenchmarkResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [currentRun, setCurrentRun] = useState<BenchmarkRun | null>(null);

  const handleRunBenchmark = async (config: BenchmarkConfig) => {
    setIsRunning(true);
    setBenchmarkResult(null);
    setProgress({ current: 0, total: 0 });

    try {
      const result = await runBenchmark(
        config,
        (current, total, run) => {
          setProgress({ current, total });
          setCurrentRun(run);
        }
      );

      setBenchmarkResult(result);
    } catch (error) {
      console.error('Benchmark error:', error);
      alert('Có lỗi xảy ra khi chạy benchmark. Vui lòng thử lại.');
    } finally {
      setIsRunning(false);
      setCurrentRun(null);
    }
  };

  const handleExportCSV = () => {
    if (!benchmarkResult) return;
    
    const csv = exportToCSV(benchmarkResult);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `benchmark-results-${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExportJSON = () => {
    if (!benchmarkResult) return;
    
    const json = exportToJSON(benchmarkResult);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `benchmark-results-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const aggregatedResults = benchmarkResult 
    ? aggregateBenchmarkResults(benchmarkResult)
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Quay lại trang chủ</span>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {!isRunning && !benchmarkResult && (
          <BenchmarkLab onRunBenchmark={handleRunBenchmark} />
        )}

        {isRunning && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center"
          >
            <Loader2 className="w-16 h-16 mx-auto mb-4 animate-spin text-blue-600" />
            <h2 className="text-2xl font-bold mb-4">Đang Chạy Benchmark...</h2>
            
            {/* Progress Bar */}
            <div className="max-w-md mx-auto mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span>Tiến độ</span>
                <span>{progress.current} / {progress.total}</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
                <motion.div
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 h-full"
                  initial={{ width: 0 }}
                  animate={{ 
                    width: `${progress.total > 0 ? (progress.current / progress.total) * 100 : 0}%` 
                  }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <div className="text-center mt-2 text-sm text-gray-600 dark:text-gray-400">
                {progress.total > 0 
                  ? `${Math.round((progress.current / progress.total) * 100)}%`
                  : '0%'
                }
              </div>
            </div>

            {/* Current Run Info */}
            {currentRun && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 max-w-md mx-auto"
              >
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Đang chạy:
                </p>
                <p className="font-semibold text-lg">
                  {currentRun.algorithmName}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Size: {currentRun.inputSize.toLocaleString()} | 
                  Distribution: {currentRun.dataDistribution}
                </p>
              </motion.div>
            )}

            <p className="text-gray-600 dark:text-gray-400 mt-6">
              Quá trình này có thể mất vài phút tùy thuộc vào cấu hình benchmark...
            </p>
          </motion.div>
        )}

        {benchmarkResult && !isRunning && (
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between"
            >
              <div>
                <h2 className="text-3xl font-bold">Kết Quả Benchmark</h2>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Hoàn thành {benchmarkResult.totalRuns} tests trong{' '}
                  {((benchmarkResult.endTime - benchmarkResult.startTime) / 1000).toFixed(2)}s
                </p>
              </div>
              <button
                onClick={() => {
                  setBenchmarkResult(null);
                  setProgress({ current: 0, total: 0 });
                }}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Chạy Benchmark Mới
              </button>
            </motion.div>

            <BenchmarkResults
              aggregated={aggregatedResults}
              onExportCSV={handleExportCSV}
              onExportJSON={handleExportJSON}
            />
          </div>
        )}
      </div>
    </div>
  );
}
