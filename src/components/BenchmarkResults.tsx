'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';
import { Download, TrendingUp, Activity, Clock } from 'lucide-react';
import { AggregatedMetrics, ComparisonData } from '@/lib/benchmarkEngine';
import { DataDistribution } from '@/types/instrumentation';
import { formatTime, formatCount } from '@/lib/instrumentation';
import DetailedTimingTable from './DetailedTimingTable';

interface BenchmarkResultsProps {
  aggregated: AggregatedMetrics[];
  onExportCSV?: () => void;
  onExportJSON?: () => void;
}

const COLORS = [
  '#3B82F6', // blue
  '#06B6D4', // cyan
  '#10B981', // green
  '#0EA5E9', // sky
  '#14B8A6', // teal
  '#F59E0B', // amber
  '#2563EB', // blue-600
  '#0891B2', // cyan-600
];

export default function BenchmarkResults({ 
  aggregated, 
  onExportCSV, 
  onExportJSON 
}: BenchmarkResultsProps) {
  const [selectedMetric, setSelectedMetric] = useState<'time' | 'comparisons' | 'operations'>('time');
  const [selectedDistribution, setSelectedDistribution] = useState<DataDistribution>('random');
  const [chartType, setChartType] = useState<'line' | 'bar' | 'area'>('line');

  // Memoize expensive computations - must be before early return
  const { distributions, algorithms, filteredData, inputSizes, chartData } = React.useMemo(() => {
    if (aggregated.length === 0) {
      return {
        distributions: [],
        algorithms: [],
        filteredData: [],
        inputSizes: [],
        chartData: []
      };
    }

    console.log('BenchmarkResults - computing data, length:', aggregated.length);
    const distributions = Array.from(new Set(aggregated.map(a => a.distribution)));
    const algorithms = Array.from(new Set(aggregated.map(a => a.algorithmName)));

    // Prepare chart data
    const filteredData = aggregated.filter(a => a.distribution === selectedDistribution);
    const inputSizes = Array.from(new Set(filteredData.map(a => a.inputSize))).sort((a, b) => a - b);

    const chartData = inputSizes.map(size => {
      const dataPoint: any = { inputSize: size };
      
      filteredData
        .filter(a => a.inputSize === size)
        .forEach(a => {
          if (selectedMetric === 'time') {
            dataPoint[a.algorithmName] = a.avgExecutionTime;
          } else if (selectedMetric === 'comparisons') {
            dataPoint[a.algorithmName] = a.avgComparisons;
          } else {
            dataPoint[a.algorithmName] = a.totalOperations;
          }
        });
      
      return dataPoint;
    });

    return { distributions, algorithms, filteredData, inputSizes, chartData };
  }, [aggregated, selectedDistribution, selectedMetric]);

  if (aggregated.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        Chưa có kết quả benchmark. Vui lòng chạy benchmark để xem kết quả.
      </div>
    );
  }

  // Log actual chart data structure for debugging
  console.log('Actual chartData:', JSON.stringify(chartData, null, 2));
  console.log('First data point:', chartData[0]);
  console.log('Algorithms list:', algorithms);

  // Debug logging
  console.log('Chart Debug:', {
    selectedDistribution,
    selectedMetric,
    algorithms,
    inputSizes,
    chartData,
    filteredData: filteredData.length,
    aggregatedSample: aggregated[0]
  });

  // Get summary statistics
  const summaryStats = algorithms.map((algo, idx) => {
    const algoData = filteredData.filter(a => a.algorithmName === algo);
    const totalTime = algoData.reduce((sum, a) => sum + a.avgExecutionTime, 0);
    const totalOps = algoData.reduce((sum, a) => sum + a.totalOperations, 0);
    const avgTime = totalTime / algoData.length;

    return {
      algorithm: algo,
      color: COLORS[idx % COLORS.length],
      avgTime,
      totalOps,
      dataPoints: algoData.length
    };
  });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-xl border-2 border-blue-300">
          <p className="font-bold text-gray-800 mb-2 text-base">Kích thước: {label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-sm mb-1">
              <div 
                className="w-3 h-3 rounded-full shadow-sm" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="font-semibold text-gray-800">{entry.name}:</span>
              <span className="font-bold text-blue-700">
                {selectedMetric === 'time' 
                  ? formatTime(entry.value)
                  : formatCount(entry.value)
                }
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    const commonProps = {
      width: 900,
      height: 450,
      data: chartData
    };

    const xAxisProps = {
      dataKey: 'inputSize',
      stroke: '#666',
      tick: { fill: '#666' },
      label: { value: 'Input Size', position: 'insideBottom', offset: -5, fill: '#666' }
    };

    const yAxisProps = {
      stroke: '#666',
      tick: { fill: '#666' }
    };

    switch (chartType) {
      case 'line':
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
            <XAxis {...xAxisProps} />
            <YAxis {...yAxisProps} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            {algorithms.map((algo, idx) => (
              <Line
                key={algo}
                type="monotone"
                dataKey={algo}
                stroke={COLORS[idx % COLORS.length]}
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            ))}
          </LineChart>
        );

      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
            <XAxis {...xAxisProps} />
            <YAxis {...yAxisProps} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {algorithms.map((algo, idx) => (
              <Bar
                key={algo}
                dataKey={algo}
                fill={COLORS[idx % COLORS.length]}
              />
            ))}
          </BarChart>
        );

      case 'area':
        return (
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
            <XAxis {...xAxisProps} />
            <YAxis {...yAxisProps} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {algorithms.map((algo, idx) => (
              <Area
                key={algo}
                type="monotone"
                dataKey={algo}
                stroke={COLORS[idx % COLORS.length]}
                fill={COLORS[idx % COLORS.length]}
                fillOpacity={0.3}
              />
            ))}
          </AreaChart>
        );
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Summary Cards - Compact Version */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-md border border-gray-200 p-3"
      >
        <div className="flex items-center justify-around gap-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-600" />
            <div className="flex items-baseline gap-1.5">
              <span className="text-xs font-medium text-gray-700">Số test:</span>
              <span className="text-lg font-bold text-blue-600">{aggregated.length}</span>
            </div>
          </div>
          
          <div className="h-6 w-px bg-gray-300"></div>
          
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-cyan-600" />
            <div className="flex items-baseline gap-1.5">
              <span className="text-xs font-medium text-gray-700">Thuật toán:</span>
              <span className="text-lg font-bold text-cyan-600">{algorithms.length}</span>
            </div>
          </div>
          
          <div className="h-6 w-px bg-gray-300"></div>
          
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-green-600" />
            <div className="flex items-baseline gap-1.5">
              <span className="text-xs font-medium text-gray-700">Phân phối:</span>
              <span className="text-lg font-bold text-green-600">{distributions.length}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Distribution Selector */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Phân phối dữ liệu</label>
            <select
              value={selectedDistribution}
              onChange={(e) => setSelectedDistribution(e.target.value as DataDistribution)}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg bg-white text-gray-800 font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              aria-label="Chọn phân phối dữ liệu"
            >
              {distributions.map(dist => (
                <option key={dist} value={dist}>{dist}</option>
              ))}
            </select>
          </div>

          {/* Metric Selector */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Chỉ số</label>
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value as any)}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg bg-white text-gray-800 font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              aria-label="Chọn chỉ số"
            >
              <option value="time">Thời gian thực thi</option>
              <option value="comparisons">Số lần so sánh</option>
              <option value="operations">Tổng phép toán</option>
            </select>
          </div>

          {/* Chart Type Selector */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Loại biểu đồ</label>
            <select
              value={chartType}
              onChange={(e) => setChartType(e.target.value as any)}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg bg-white text-gray-800 font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              aria-label="Chọn loại biểu đồ"
            >
              <option value="line">Biểu đồ đường</option>
              <option value="bar">Biểu đồ cột</option>
              <option value="area">Biểu đồ vùng</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
      >
        <div className="mb-4">
          <h3 className="text-lg font-bold text-gray-800">
            Biểu đồ hiệu suất - {selectedMetric === 'time' ? 'Thời gian thực thi' : selectedMetric === 'comparisons' ? 'Số lần so sánh' : 'Tổng phép toán'}
          </h3>
          <p className="text-sm text-gray-600">
            Phân phối: {selectedDistribution} | Điểm dữ liệu: {chartData.length} | Thuật toán: {algorithms.length}
          </p>
        </div>
        {chartData.length > 0 && algorithms.length > 0 ? (
          <div className="relative bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="absolute left-16 top-6 text-sm font-semibold text-gray-700">
              {selectedMetric === 'time' ? 'Thời gian (ms)' : 'Phép toán'}
            </div>
            <div className="w-full overflow-x-auto flex justify-center" style={{ minHeight: '400px' }}>
              {renderChart()}
            </div>
          </div>
        ) : (
          <div className="h-[500px] flex items-center justify-center border-2 border-gray-300 rounded-lg bg-gray-50">
            <div className="text-center text-gray-600">
              <p className="text-lg font-bold text-gray-700 mb-2">Không có dữ liệu để hiển thị</p>
              <p className="text-sm">
                Phân phối đã chọn: {selectedDistribution}
                <br />
                Chỉ số: {selectedMetric}
                <br />
                Thuật toán: {algorithms.length} ({algorithms.join(', ')})
                <br />
                Điểm dữ liệu biểu đồ: {chartData.length}
                <br />
                Tổng dữ liệu: {aggregated.length}
              </p>
            </div>
          </div>
        )}
      </motion.div>

      {/* Detailed Timing Table */}
      <DetailedTimingTable aggregated={aggregated} />

      {/* Algorithm Statistics Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
      >
        <h3 className="text-xl font-bold text-gray-800 mb-4">Thống kê thuật toán</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-300 bg-gray-50">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Thuật toán</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Thời gian TB</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Tổng phép toán</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Điểm dữ liệu</th>
              </tr>
            </thead>
            <tbody>
              {summaryStats.map((stat) => (
                <tr 
                  key={stat.algorithm}
                  className="border-b border-gray-200 hover:bg-blue-50 transition-colors"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: stat.color }}
                      />
                      <span className="font-semibold text-gray-800">{stat.algorithm}</span>
                    </div>
                  </td>
                  <td className="text-right py-3 px-4 text-gray-700 font-medium">{formatTime(stat.avgTime)}</td>
                  <td className="text-right py-3 px-4 text-gray-700 font-medium">{formatCount(stat.totalOps)}</td>
                  <td className="text-right py-3 px-4 text-gray-700 font-medium">{stat.dataPoints}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Export Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="flex gap-4 justify-center"
      >
        <button
          onClick={onExportCSV}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Download className="w-5 h-5" />
          Export CSV
        </button>
        <button
          onClick={onExportJSON}
          className="px-6 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors flex items-center gap-2"
        >
          <Download className="w-5 h-5" />
          Export JSON
        </button>
      </motion.div>
    </div>
  );
}
