'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Table2, TrendingUp } from 'lucide-react';
import { AggregatedMetrics } from '@/lib/benchmarkEngine';
import { DataDistribution } from '@/types/instrumentation';

interface DetailedTimingTableProps {
  aggregated: AggregatedMetrics[];
}

export default function DetailedTimingTable({ aggregated }: DetailedTimingTableProps) {
  const [selectedMetric, setSelectedMetric] = useState<'time' | 'comparisons' | 'swaps' | 'operations' | 'memory'>('time');
  
  if (aggregated.length === 0) {
    return null;
  }

  // Lấy danh sách các thuật toán, kích thước, và phân phối
  const algorithms = Array.from(new Set(aggregated.map(a => a.algorithmName)));
  const inputSizes = Array.from(new Set(aggregated.map(a => a.inputSize))).sort((a, b) => a - b);
  const distributions = Array.from(new Set(aggregated.map(a => a.distribution)));

  // Tạo hàm lấy giá trị metric
  const getMetricValue = (metric: AggregatedMetrics) => {
    switch (selectedMetric) {
      case 'time':
        return metric.avgExecutionTime;
      case 'comparisons':
        return metric.avgComparisons;
      case 'swaps':
        return metric.avgSwaps;
      case 'memory':
        return metric.avgMemoryUsage;
      case 'operations':
        return metric.totalOperations;
      default:
        return metric.avgExecutionTime;
    }
  };

  // Format số
  const formatValue = (value: number) => {
    if (selectedMetric === 'time') {
      if (value < 1) {
        return `${(value * 1000).toFixed(2)}μs`;
      } else if (value < 1000) {
        return `${value.toFixed(3)}ms`;
      } else {
        return `${(value / 1000).toFixed(2)}s`;
      }
    } else if (selectedMetric === 'memory') {
      if (value < 1024) {
        return `${value.toFixed(0)} B`;
      } else if (value < 1024 * 1024) {
        return `${(value / 1024).toFixed(2)} KB`;
      } else {
        return `${(value / (1024 * 1024)).toFixed(2)} MB`;
      }
    }
    return value.toFixed(0);
  };

  // Xuất dữ liệu ra CSV chi tiết
  const exportDetailedCSV = () => {
    const headers = ['Thuật toán', 'Kịch bản dữ liệu', ...inputSizes.map(s => `n=${s}`)].join(',');
    
    const rows: string[] = [];
    algorithms.forEach(algo => {
      distributions.forEach(dist => {
        const row = [algo, dist];
        inputSizes.forEach(size => {
          const metric = aggregated.find(
            a => a.algorithmName === algo && 
                 a.distribution === dist && 
                 a.inputSize === size
          );
          if (metric) {
            row.push(getMetricValue(metric).toFixed(3));
          } else {
            row.push('N/A');
          }
        });
        rows.push(row.join(','));
      });
    });

    const csv = [headers, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `bang-thoi-gian-${selectedMetric}-${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 space-y-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Table2 className="w-6 h-6 text-blue-600" />
          <div>
            <h3 className="text-xl font-bold text-gray-800">Bảng Thời Gian Chi Tiết</h3>
            <p className="text-sm text-gray-600">
              Kết quả trung bình từ nhiều lần chạy
            </p>
          </div>
        </div>
        <button
          onClick={exportDetailedCSV}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Xuất CSV
        </button>
      </div>

      {/* Metric Selector */}
      <div className="flex gap-2 flex-wrap">
        {(['time', 'comparisons', 'swaps', 'memory', 'operations'] as const).map((metric) => (
          <button
            key={metric}
            onClick={() => setSelectedMetric(metric)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              selectedMetric === metric
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
            }`}
          >
            {metric === 'time' ? 'Thời gian' : 
             metric === 'comparisons' ? 'So sánh' : 
             metric === 'swaps' ? 'Hoán đổi' : 
             metric === 'memory' ? 'Bộ nhớ' : 'Phép toán'}
          </button>
        ))}
      </div>

      {/* Tables - One per distribution */}
      <div className="space-y-6">
        {distributions.map((distribution) => (
          <div key={distribution} className="space-y-2">
            <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-lg border border-blue-200">
              <TrendingUp className="w-5 h-5 text-blue-700" />
              <h4 className="font-bold text-lg text-gray-800">
                Kịch bản: <span className="text-blue-700">{distribution}</span>
              </h4>
            </div>

            <div className="overflow-x-auto border border-gray-300 rounded-lg">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gradient-to-r from-gray-100 to-gray-50">
                    <th className="px-4 py-3 text-left font-bold text-sm border-b-2 border-gray-300 text-gray-800">
                      Thuật toán
                    </th>
                    {inputSizes.map((size) => (
                      <th
                        key={size}
                        className="px-4 py-3 text-right font-bold text-sm border-b-2 border-gray-300 text-gray-800"
                      >
                        n={size.toLocaleString()}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {algorithms.map((algo, algoIdx) => {
                    // Lấy số lần chạy từ metric đầu tiên
                    const firstMetric = aggregated.find(
                      a => a.algorithmName === algo && a.distribution === distribution
                    );
                    
                    return (
                      <tr
                        key={algo}
                        className={`border-b border-gray-200 hover:bg-blue-50 transition-colors ${
                          algoIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                        }`}
                      >
                        <td className="px-4 py-3 font-semibold text-sm text-gray-800">
                          <div>
                            {algo}
                            {firstMetric && (
                              <div className="text-xs text-gray-600 font-normal">
                                ({firstMetric.runs} lần chạy)
                              </div>
                            )}
                          </div>
                        </td>
                        {inputSizes.map((size) => {
                          const metric = aggregated.find(
                            a => a.algorithmName === algo && 
                                 a.distribution === distribution && 
                                 a.inputSize === size
                          );
                          
                          if (!metric) {
                            return (
                              <td
                                key={size}
                                className="px-4 py-3 text-right text-sm text-gray-400 font-medium"
                              >
                                N/A
                              </td>
                            );
                          }

                          const value = getMetricValue(metric);
                          
                          // Tìm min/max để highlight
                          const valuesForSize = algorithms
                            .map(a => aggregated.find(
                              m => m.algorithmName === a && 
                                   m.distribution === distribution && 
                                   m.inputSize === size
                            ))
                            .filter(Boolean)
                            .map(m => getMetricValue(m!));
                          
                          const minValue = Math.min(...valuesForSize);
                          const maxValue = Math.max(...valuesForSize);
                          const isMin = value === minValue && valuesForSize.length > 1;
                          const isMax = value === maxValue && valuesForSize.length > 1;

                          return (
                            <td
                              key={size}
                              className={`px-4 py-3 text-right text-sm font-mono font-semibold ${
                                isMin 
                                  ? 'bg-green-200 text-green-800 shadow-inner' 
                                  : isMax 
                                  ? 'bg-red-200 text-red-800 shadow-inner' 
                                  : 'text-gray-700'
                              }`}
                            >
                              {formatValue(value)}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Legend */}
            <div className="flex gap-4 text-xs text-gray-700 font-medium px-3">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-green-200 border border-green-400 rounded shadow-sm"></div>
                <span>Tốt nhất</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-red-200 border border-red-400 rounded shadow-sm"></div>
                <span>Tệ nhất</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Info */}
      <div className="bg-gradient-to-r from-blue-100 to-cyan-100 rounded-lg p-4 border border-blue-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-700">{algorithms.length}</div>
            <div className="text-xs text-gray-700 font-semibold">Thuật toán</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-cyan-700">{inputSizes.length}</div>
            <div className="text-xs text-gray-700 font-semibold">Kích thước</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-700">{distributions.length}</div>
            <div className="text-xs text-gray-700 font-semibold">Kịch bản</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-700">{aggregated.length}</div>
            <div className="text-xs text-gray-700 font-semibold">Tổng điểm dữ liệu</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
