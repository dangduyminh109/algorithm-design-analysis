'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Shuffle, TrendingUp, TrendingDown, Settings, BarChart3, GitBranch, Grid3x3 } from 'lucide-react';
import { ExtremeStep, VisualizationState } from '@/types/algorithm';
import { ExtremeValueAlgorithms, generateUniqueRandomArray, delay } from '@/lib/algorithmUtils';
import { usePerformanceOptimization } from '@/hooks/usePerformanceOptimization';

type ViewMode = 'bar' | 'tree' | 'matrix';

interface ExtremeValueVisualizerProps {
  algorithm: string;
  onStepChange?: (step: number, totalSteps: number) => void;
}

export default function ExtremeValueVisualizer({ 
  algorithm, 
  onStepChange 
}: ExtremeValueVisualizerProps) {
  const [array, setArray] = useState<number[]>([]);
  const [steps, setSteps] = useState<ExtremeStep[]>([]);
  const [state, setState] = useState<VisualizationState>({
    isPlaying: false,
    isPaused: false,
    speed: 1,
    currentStep: 0,
    steps: [],
    progress: 0
  });

  // View settings
  const [viewMode, setViewMode] = useState<ViewMode>('bar');
  const [showSettings, setShowSettings] = useState(false);
  const [arraySize, setArraySize] = useState(16);

  // Statistics
  const [comparisons, setComparisons] = useState(0);
  const [comparisonPairs, setComparisonPairs] = useState<[number, number][]>([]);

  const { isSlowDevice } = usePerformanceOptimization();
  const stateRef = useRef(state);
  const animationRef = useRef<boolean>(false);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  // Initialize array
  const initializeArray = useCallback(() => {
    if (typeof animationRef !== 'undefined' && animationRef.current) {
      animationRef.current = false;
    }
    
    const newArray = generateUniqueRandomArray(arraySize, 10, 90);
    setArray(newArray);
    setSteps([]);
    setComparisons(0);
    setComparisonPairs([]);
    setState(prev => ({
      ...prev,
      currentStep: 0,
      progress: 0,
      isPlaying: false,
      isPaused: false,
      steps: []
    }));
  }, [arraySize]);

  useEffect(() => {
    initializeArray();
  }, [initializeArray]);

  // Generate steps
  const generateSteps = useCallback(() => {
    if (array.length === 0) return;
    animationRef.current = false;

    let algorithmSteps: ExtremeStep[] = [];

    switch (algorithm) {
      case 'linear-min-max':
        algorithmSteps = ExtremeValueAlgorithms.linearMinMax([...array]);
        break;
      case 'tournament-method':
        algorithmSteps = ExtremeValueAlgorithms.tournamentMinMax([...array]);
        break;
      default:
        algorithmSteps = ExtremeValueAlgorithms.linearMinMax([...array]);
    }

    setSteps(algorithmSteps);
    setState(prev => ({
      ...prev,
      steps: algorithmSteps,
      currentStep: 0,
      progress: 0,
      isPlaying: false,
      isPaused: false
    }));

    // Calculate comparisons
    let compCount = 0;
    const pairs: [number, number][] = [];
    
    algorithmSteps.forEach(step => {
      if (step.comparing && step.comparing.length === 2) {
        compCount++;
        pairs.push([step.comparing[0], step.comparing[1]]);
      }
    });
    
    setComparisons(compCount);
    setComparisonPairs(pairs);
  }, [array, algorithm]);

  useEffect(() => {
    if (array.length > 0) {
      generateSteps();
    }
  }, [generateSteps, array.length]);

  // Animation control
  const animate = useCallback(async () => {
    if (steps.length === 0) return;
    
    animationRef.current = false;
    await delay(50);

    animationRef.current = true;
    setState(prev => ({ ...prev, isPlaying: true, isPaused: false }));

    let currentStepIndex = stateRef.current.currentStep;

    for (let i = currentStepIndex; i < steps.length; i++) {
      if (!animationRef.current) break;

      setState(prev => ({
        ...prev,
        currentStep: i,
        progress: (i / (steps.length - 1)) * 100
      }));

      onStepChange?.(i, steps.length - 1);

      const speedMultiplier = Math.max(0.1, Math.min(3, stateRef.current.speed));
      await delay(500 / speedMultiplier);

      while (stateRef.current.isPaused && animationRef.current) {
        await delay(100);
      }
    }

    animationRef.current = false;
    setState(prev => ({ ...prev, isPlaying: false }));
  }, [steps, onStepChange]);

  // Control functions
  const handlePlay = async () => {
    if (stateRef.current.currentStep >= steps.length - 1) {
      setState(prev => ({ ...prev, currentStep: 0, progress: 0 }));
      await new Promise(resolve => setTimeout(resolve, 10));
    }
    animate();
  };

  const handlePause = () => {
    setState(prev => ({ ...prev, isPaused: !prev.isPaused }));
  };

  const handleReset = () => {
    animationRef.current = false;
    setState(prev => ({
      ...prev,
      isPlaying: false,
      isPaused: false,
      currentStep: 0,
      progress: 0
    }));
  };

  const handleSpeedChange = (newSpeed: number) => {
    setState(prev => ({ ...prev, speed: newSpeed }));
  };

  const handleStepSlider = (step: number) => {
    if (!state.isPlaying) {
      setState(prev => ({
        ...prev,
        currentStep: Math.min(step, steps.length - 1),
        progress: (step / (steps.length - 1)) * 100
      }));
    }
  };

  // Current step data
  const currentStepData = useMemo(() => {
    return steps[state.currentStep] || { 
      array: array, 
      currentIndex: -1,
      comparing: [],
      currentMin: undefined,
      currentMax: undefined,
      minIndex: undefined,
      maxIndex: undefined
    };
  }, [steps, state.currentStep, array]);

  // Color functions
  const getElementColor = (index: number) => {
    const { currentIndex, comparing, minIndex, maxIndex } = currentStepData;

    if (minIndex === index && maxIndex === index) return 'bg-purple-500';
    if (minIndex === index) return 'bg-green-500';
    if (maxIndex === index) return 'bg-red-500';
    if (comparing && comparing.includes(index)) return 'bg-orange-500';
    if (currentIndex === index) return 'bg-yellow-500';
    
    return 'bg-blue-500';
  };

  const getBarHeight = (value: number) => {
    const maxHeight = 220;
    const maxValue = Math.max(...currentStepData.array);
    return (value / maxValue) * maxHeight;
  };

  // Render bar view
  const renderBarView = () => (
    <div className="space-y-4">
      {/* Bar Chart */}
      <div className="flex items-end justify-center space-x-1 h-[240px]">
        {currentStepData.array.map((value, index) => (
          <motion.div
            key={`bar-${index}-${value}`}
            className={`${getElementColor(index)} rounded-t-sm relative`}
            style={{
              width: `${Math.max(400 / currentStepData.array.length - 1, 8)}px`,
              height: `${getBarHeight(value)}px`,
              transform: 'translateZ(0)',
              willChange: 'transform',
            }}
            animate={{
              scale: currentStepData.comparing?.includes(index) ? 1.1 : 1,
              y: currentStepData.currentIndex === index ? -10 : 0,
            }}
            transition={{
              type: 'spring',
              stiffness: 400,
              damping: 25,
            }}
          >
            <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-700 font-medium">
              {value}
            </span>
            <span className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 text-xs text-gray-500">
              {index}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Number Array */}
      <div className="flex flex-wrap justify-center gap-2">
        {currentStepData.array.map((value, index) => (
          <motion.div
            key={`box-${index}-${value}`}
            className={`
              ${getElementColor(index)} 
              text-white
              w-12 h-12 rounded-lg flex items-center justify-center
              font-bold text-sm
            `}
            animate={{
              scale: currentStepData.comparing?.includes(index) || currentStepData.currentIndex === index ? 1.15 : 1,
            }}
            transition={{
              type: 'spring',
              stiffness: 400,
              damping: 25,
            }}
          >
            {value}
          </motion.div>
        ))}
      </div>
    </div>
  );

  // Render tournament tree view
  const renderTreeView = () => {
    if (algorithm !== 'tournament-method') {
      return <div className="text-center text-gray-500 py-8">Tree view chỉ khả dụng cho Tournament Method</div>;
    }

    // Build tournament tree structure
    const treeData: { value: number; index: number; level: number; position: number; type: 'min' | 'max' | 'both' }[] = [];
    
    // Add leaf nodes (original array)
    currentStepData.array.forEach((value, index) => {
      treeData.push({
        value,
        index,
        level: 0,
        position: index,
        type: 'both'
      });
    });

    const svgWidth = Math.max(600, currentStepData.array.length * 40);
    const svgHeight = 300;
    const leafSpacing = svgWidth / (currentStepData.array.length + 1);

    return (
      <div className="relative overflow-x-auto">
        <svg width={svgWidth} height={svgHeight} className="mx-auto">
          {/* Draw leaf nodes */}
          {treeData.map((node, idx) => {
            const x = (node.position + 1) * leafSpacing;
            const y = svgHeight - 40;
            const isMin = currentStepData.minIndex === node.index;
            const isMax = currentStepData.maxIndex === node.index;
            const isComparing = currentStepData.comparing?.includes(node.index);

            return (
              <g key={`tree-${idx}`}>
                {/* Node circle */}
                <motion.circle
                  cx={x}
                  cy={y}
                  r={15}
                  fill={isMin && isMax ? '#a855f7' : isMin ? '#10b981' : isMax ? '#ef4444' : isComparing ? '#fb923c' : '#3b82f6'}
                  initial={{ scale: 0 }}
                  animate={{ scale: isComparing ? 1.2 : 1 }}
                  transition={{ duration: 0.3 }}
                />
                
                {/* Value */}
                <text
                  x={x}
                  y={y + 4}
                  textAnchor="middle"
                  className="text-xs font-bold fill-white"
                >
                  {node.value}
                </text>

                {/* Index label */}
                <text
                  x={x}
                  y={y + 30}
                  textAnchor="middle"
                  className="text-xs fill-gray-500"
                >
                  [{node.index}]
                </text>
              </g>
            );
          })}

          {/* Draw comparison lines for current step */}
          {currentStepData.comparing && currentStepData.comparing.length === 2 && (
            <g>
              <line
                x1={(currentStepData.comparing[0] + 1) * leafSpacing}
                y1={svgHeight - 40}
                x2={(currentStepData.comparing[1] + 1) * leafSpacing}
                y2={svgHeight - 40}
                stroke="#fb923c"
                strokeWidth="3"
                strokeDasharray="5,5"
              >
                <animate
                  attributeName="stroke-opacity"
                  values="1;0.3;1"
                  dur="1s"
                  repeatCount="indefinite"
                />
              </line>
            </g>
          )}

          {/* Draw result indicators */}
          {currentStepData.minIndex !== undefined && (
            <g>
              <text
                x={(currentStepData.minIndex + 1) * leafSpacing}
                y={svgHeight - 70}
                textAnchor="middle"
                className="text-sm font-bold fill-green-600"
              >
                MIN
              </text>
              <motion.path
                d={`M ${(currentStepData.minIndex + 1) * leafSpacing} ${svgHeight - 65} l -5 10 l 10 0 z`}
                fill="#10b981"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
              />
            </g>
          )}

          {currentStepData.maxIndex !== undefined && (
            <g>
              <text
                x={(currentStepData.maxIndex + 1) * leafSpacing}
                y={20}
                textAnchor="middle"
                className="text-sm font-bold fill-red-600"
              >
                MAX
              </text>
              <motion.path
                d={`M ${(currentStepData.maxIndex + 1) * leafSpacing} 25 l -5 -10 l 10 0 z`}
                fill="#ef4444"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
              />
            </g>
          )}
        </svg>

        {/* Legend for tree view */}
        <div className="mt-4 text-center text-sm text-gray-600">
          <p>Tournament Method so sánh các cặp phần tử để tìm min/max hiệu quả</p>
        </div>
      </div>
    );
  };

  // Render comparison matrix view
  const renderMatrixView = () => {
    return (
      <div className="space-y-4">
        {/* Comparison Matrix */}
        <div className="p-4 bg-white rounded-lg">
          <h3 className="text-sm font-bold text-gray-700 mb-3 text-center">Ma Trận So Sánh</h3>
          <div className="overflow-x-auto">
            <table className="mx-auto border-collapse">
              <tbody>
                {currentStepData.array.map((rowValue, rowIdx) => (
                  <tr key={`row-${rowIdx}`}>
                    {currentStepData.array.map((colValue, colIdx) => {
                      const hasCompared = comparisonPairs
                        .slice(0, state.currentStep + 1)
                        .some(([a, b]) => 
                          (a === rowIdx && b === colIdx) || (a === colIdx && b === rowIdx)
                        );
                      const isCurrentComparison = currentStepData.comparing?.includes(rowIdx) && 
                                                  currentStepData.comparing?.includes(colIdx) &&
                                                  rowIdx !== colIdx;

                      return (
                        <td
                          key={`cell-${rowIdx}-${colIdx}`}
                          className={`
                            w-8 h-8 border border-gray-300 text-center text-xs
                            ${rowIdx === colIdx ? 'bg-gray-100' : ''}
                            ${hasCompared && rowIdx !== colIdx ? 'bg-blue-100' : ''}
                            ${isCurrentComparison ? 'bg-yellow-300 font-bold' : ''}
                          `}
                        >
                          {rowIdx === colIdx ? '—' : hasCompared ? '✓' : ''}
                        </td>
                      );
                    })}
                    <td className="pl-2 text-xs text-gray-600 font-medium">{rowValue}</td>
                  </tr>
                ))}
                <tr>
                  {currentStepData.array.map((value, idx) => (
                    <td key={`footer-${idx}`} className="pt-2 text-xs text-gray-600 text-center font-medium">
                      {value}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-3 text-xs text-gray-500 text-center">
            <span className="inline-block w-4 h-4 bg-blue-100 border border-gray-300 mr-1"></span> Đã so sánh
            <span className="inline-block w-4 h-4 bg-yellow-300 border border-gray-300 ml-3 mr-1"></span> Đang so sánh
          </div>
        </div>

        {/* Comparison pairs list */}
        <div className="p-3 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-bold text-gray-700 mb-2">Các Cặp Đã So Sánh:</h4>
          <div className="flex flex-wrap gap-2">
            {comparisonPairs.slice(0, state.currentStep + 1).map(([a, b], idx) => (
              <motion.div
                key={`pair-${idx}`}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-blue-100 px-3 py-1 rounded text-xs font-medium"
              >
                ({array[a]}, {array[b]})
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      {/* Control Panel */}
      <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={state.isPlaying ? handlePause : handlePlay}
            disabled={steps.length === 0}
            className="btn-primary flex items-center space-x-2"
          >
            {state.isPlaying ? (
              <>
                <Pause className="w-4 h-4" />
                <span>{state.isPaused ? 'Tiếp Tục' : 'Tạm Dừng'}</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>Chạy</span>
              </>
            )}
          </button>

          <button onClick={handleReset} className="btn-secondary flex items-center space-x-2">
            <RotateCcw className="w-4 h-4" />
            <span>Đặt Lại</span>
          </button>

          <button onClick={initializeArray} className="btn-secondary flex items-center space-x-2">
            <Shuffle className="w-4 h-4" />
            <span>Mảng Mới</span>
          </button>

          <button
            onClick={() => setShowSettings(!showSettings)}
            className="btn-secondary flex items-center space-x-2"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>

        {/* View Mode Selector */}
        <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setViewMode('bar')}
            className={`p-2 rounded flex items-center space-x-1 ${viewMode === 'bar' ? 'bg-white shadow' : ''}`}
            title="Bar View"
          >
            <BarChart3 className="w-4 h-4" />
            <span className="text-xs">Bars</span>
          </button>
          <button
            onClick={() => setViewMode('tree')}
            className={`p-2 rounded flex items-center space-x-1 ${viewMode === 'tree' ? 'bg-white shadow' : ''}`}
            title="Tournament Tree"
            disabled={algorithm !== 'tournament-method'}
          >
            <GitBranch className="w-4 h-4" />
            <span className="text-xs">Tree</span>
          </button>
          <button
            onClick={() => setViewMode('matrix')}
            className={`p-2 rounded flex items-center space-x-1 ${viewMode === 'matrix' ? 'bg-white shadow' : ''}`}
            title="Comparison Matrix"
          >
            <Grid3x3 className="w-4 h-4" />
            <span className="text-xs">Matrix</span>
          </button>
        </div>

        {/* Speed Control */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Tốc Độ:</span>
          <input
            type="range"
            min="0.25"
            max="3"
            step="0.25"
            value={state.speed}
            onChange={(e) => handleSpeedChange(parseFloat(e.target.value))}
            className="w-20"
          />
          <span className="text-sm text-gray-600 w-8">{state.speed}x</span>
        </div>
      </div>

      {/* Current Min/Max Display */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-1">
            <TrendingDown className="w-5 h-5 text-green-600" />
            <span className="font-medium text-green-800">Min Hiện Tại:</span>
          </div>
          <div className="text-2xl font-bold text-green-800">
            {currentStepData.currentMin !== undefined ? currentStepData.currentMin : '—'}
          </div>
          {currentStepData.minIndex !== undefined && (
            <div className="text-sm text-green-600">tại vị trí {currentStepData.minIndex}</div>
          )}
        </div>

        <div className="bg-red-50 rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-1">
            <TrendingUp className="w-5 h-5 text-red-600" />
            <span className="font-medium text-red-800">Max Hiện Tại:</span>
          </div>
          <div className="text-2xl font-bold text-red-800">
            {currentStepData.currentMax !== undefined ? currentStepData.currentMax : '—'}
          </div>
          {currentStepData.maxIndex !== undefined && (
            <div className="text-sm text-red-600">tại vị trí {currentStepData.maxIndex}</div>
          )}
        </div>

        <div className="bg-blue-50 rounded-lg p-3">
          <div className="font-medium text-blue-800 mb-1">Số So Sánh:</div>
          <div className="text-2xl font-bold text-blue-800">{comparisons}</div>
          <div className="text-sm text-blue-600">
            {algorithm === 'tournament-method' ? 'Tournament: O(n)' : 'Linear: O(n)'}
          </div>
        </div>
      </div>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 p-4 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center space-x-4">
              <label className="text-sm text-gray-600">Kích Thước Mảng:</label>
              <input
                type="range"
                min="4"
                max="20"
                value={arraySize}
                onChange={(e) => setArraySize(parseInt(e.target.value))}
                className="flex-1"
                disabled={state.isPlaying}
              />
              <span className="text-sm text-gray-600 w-8">{arraySize}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
          <span>Tiến Trình</span>
          <span>Bước {state.currentStep + 1} / {steps.length}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${state.progress}%` }}
          />
        </div>
        <input
          type="range"
          min="0"
          max={steps.length - 1}
          value={state.currentStep}
          onChange={(e) => handleStepSlider(parseInt(e.target.value))}
          className="w-full mt-2"
          disabled={state.isPlaying}
        />
      </div>

      {/* Visualization Area */}
      <div className="relative bg-gray-50 rounded-lg p-4 min-h-[350px]">
        {viewMode === 'bar' && renderBarView()}
        {viewMode === 'tree' && renderTreeView()}
        {viewMode === 'matrix' && renderMatrixView()}

        {/* Legend */}
        <div className="flex flex-wrap justify-center space-x-4 mt-4 text-xs">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span>Chưa Xử Lý</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-yellow-500 rounded"></div>
            <span>Hiện Tại</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-orange-500 rounded"></div>
            <span>Đang So Sánh</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span>Minimum</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span>Maximum</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-purple-500 rounded"></div>
            <span>Min & Max</span>
          </div>
        </div>
      </div>

      {/* Algorithm Status */}
      <div className="mt-4 text-center text-sm text-gray-600">
        {state.isPlaying && !state.isPaused && (
          <span className="text-blue-600">● Đang Tìm Giá Trị Cực Trị...</span>
        )}
        {state.isPaused && (
          <span className="text-yellow-600">⏸ Đã Tạm Dừng</span>
        )}
        {!state.isPlaying && state.currentStep === steps.length - 1 && steps.length > 0 && (
          <span className="text-green-600">
            ✓ Hoàn Thành! Min: {currentStepData.currentMin}, Max: {currentStepData.currentMax}
          </span>
        )}
        {!state.isPlaying && state.currentStep === 0 && (
          <span className="text-gray-500">Sẵn Sàng Tìm Giá Trị Cực Trị</span>
        )}
      </div>

      {/* Algorithm Info */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
        {algorithm === 'linear-min-max' && (
          <p>Linear Min/Max quét qua mảng một lần, theo dõi giá trị nhỏ nhất và lớn nhất. Độ phức tạp: O(n) với ~2n so sánh.</p>
        )}
        {algorithm === 'tournament-method' && (
          <p>Tournament Method sử dụng chiến lược chia để trị, so sánh các phần tử theo cặp để tìm min/max hiệu quả hơn. Độ phức tạp: O(n) với ~3n/2 so sánh.</p>
        )}
      </div>
    </div>
  );
}
