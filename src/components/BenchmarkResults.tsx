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
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="font-semibold mb-2">Input Size: {label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="font-medium">{entry.name}:</span>
              <span>
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
        className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-3"
      >
        <div className="flex items-center justify-around gap-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-600" />
            <div className="flex items-baseline gap-1.5">
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Tests:</span>
              <span className="text-lg font-bold text-blue-600">{aggregated.length}</span>
            </div>
          </div>
          
          <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>
          
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-cyan-600" />
            <div className="flex items-baseline gap-1.5">
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Algorithms:</span>
              <span className="text-lg font-bold text-cyan-600">{algorithms.length}</span>
            </div>
          </div>
          
          <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>
          
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-green-600" />
            <div className="flex items-baseline gap-1.5">
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Distributions:</span>
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
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Distribution Selector */}
          <div>
            <label className="block text-sm font-medium mb-2">Data Distribution</label>
            <select
              value={selectedDistribution}
              onChange={(e) => setSelectedDistribution(e.target.value as DataDistribution)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
            >
              {distributions.map(dist => (
                <option key={dist} value={dist}>{dist}</option>
              ))}
            </select>
          </div>

          {/* Metric Selector */}
          <div>
            <label className="block text-sm font-medium mb-2">Metric</label>
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value as any)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
            >
              <option value="time">Execution Time</option>
              <option value="comparisons">Comparisons</option>
              <option value="operations">Total Operations</option>
            </select>
          </div>

          {/* Chart Type Selector */}
          <div>
            <label className="block text-sm font-medium mb-2">Chart Type</label>
            <select
              value={chartType}
              onChange={(e) => setChartType(e.target.value as any)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
            >
              <option value="line">Line Chart</option>
              <option value="bar">Bar Chart</option>
              <option value="area">Area Chart</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
      >
        <div className="mb-4">
          <h3 className="text-lg font-semibold">
            Performance Chart - {selectedMetric === 'time' ? 'Execution Time' : selectedMetric === 'comparisons' ? 'Comparisons' : 'Total Operations'}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Distribution: {selectedDistribution} | Data points: {chartData.length} | Algorithms: {algorithms.length}
          </p>
        </div>
        {chartData.length > 0 && algorithms.length > 0 ? (
          <div className="relative">
            <div className="absolute left-12 top-0 text-sm font-medium text-gray-600 dark:text-gray-400">
              {selectedMetric === 'time' ? 'Time (ms)' : 'Operations'}
            </div>
            <div className="w-full overflow-x-auto flex justify-center" style={{ minHeight: '400px' }}>
              {renderChart()}
            </div>
          </div>
        ) : (
          <div className="h-[500px] flex items-center justify-center border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900">
            <div className="text-center text-gray-500">
              <p className="text-lg font-semibold mb-2">No data to display</p>
              <p className="text-sm">
                Selected distribution: {selectedDistribution}
                <br />
                Metric: {selectedMetric}
                <br />
                Algorithms found: {algorithms.length} ({algorithms.join(', ')})
                <br />
                Chart data points: {chartData.length}
                <br />
                Total aggregated data: {aggregated.length}
              </p>
            </div>
          </div>
        )}
      </motion.div>

      {/* Algorithm Statistics Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
      >
        <h3 className="text-xl font-semibold mb-4">Algorithm Statistics</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4">Algorithm</th>
                <th className="text-right py-3 px-4">Avg Time</th>
                <th className="text-right py-3 px-4">Total Operations</th>
                <th className="text-right py-3 px-4">Data Points</th>
              </tr>
            </thead>
            <tbody>
              {summaryStats.map((stat) => (
                <tr 
                  key={stat.algorithm}
                  className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: stat.color }}
                      />
                      <span className="font-medium">{stat.algorithm}</span>
                    </div>
                  </td>
                  <td className="text-right py-3 px-4">{formatTime(stat.avgTime)}</td>
                  <td className="text-right py-3 px-4">{formatCount(stat.totalOps)}</td>
                  <td className="text-right py-3 px-4">{stat.dataPoints}</td>
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
