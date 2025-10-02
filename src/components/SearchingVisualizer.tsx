'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Shuffle, Search, Settings, Dices, Activity, TreePine } from 'lucide-react';
import { SearchingStep, VisualizationState } from '@/types/algorithm';
import { SearchingAlgorithms, generateUniqueRandomArray, delay } from '@/lib/algorithmUtils';
import { usePerformanceOptimization } from '@/hooks/usePerformanceOptimization';

type ViewMode = 'linear' | 'tree' | 'heatmap';

interface SearchingVisualizerProps {
  algorithm: string;
}

export default function SearchingVisualizer({ algorithm }: SearchingVisualizerProps) {
  const [array, setArray] = useState<number[]>([]);
  const [steps, setSteps] = useState<SearchingStep[]>([]);
  const [target, setTarget] = useState<number>(50);
  const [targetInput, setTargetInput] = useState<string>('50');
  const [targetWarning, setTargetWarning] = useState<string>('');
  const [state, setState] = useState<VisualizationState>({
    isPlaying: false,
    isPaused: false,
    speed: 1,
    currentStep: 0,
    steps: [],
    progress: 0
  });

  // View settings
  const [viewMode, setViewMode] = useState<ViewMode>('linear');
  const [showSettings, setShowSettings] = useState(false);
  const [arraySize, setArraySize] = useState(20);

  // Access tracking for heatmap
  const [accessCount, setAccessCount] = useState<number[]>([]);
  const [searchPath, setSearchPath] = useState<number[]>([]);
  const [comparisons, setComparisons] = useState(0);

  const { isSlowDevice } = usePerformanceOptimization();
  const stateRef = useRef(state);
  const animationRef = useRef<boolean>(false);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  // Initialize array
  const initializeArray = useCallback(() => {
    animationRef.current = false;
    const newArray = generateUniqueRandomArray(arraySize, 10, 100).sort((a, b) => a - b);
    setArray(newArray);
    const randomTarget = newArray[Math.floor(Math.random() * newArray.length)];
    setTarget(randomTarget);
    setTargetInput(randomTarget.toString());
    setTargetWarning('');
    setSteps([]);
    setAccessCount(new Array(newArray.length).fill(0));
    setSearchPath([]);
    setComparisons(0);
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

  // Generate steps and track accesses
  useEffect(() => {
    if (array.length > 0) {
      let algorithmSteps: SearchingStep[] = [];

      switch (algorithm) {
        case 'linear-search':
          algorithmSteps = SearchingAlgorithms.linearSearch(array, target);
          break;
        case 'binary-search':
          algorithmSteps = SearchingAlgorithms.binarySearch(array, target);
          break;
        default:
          algorithmSteps = SearchingAlgorithms.linearSearch(array, target);
      }

      setSteps(algorithmSteps);
      setState(prev => ({
        ...prev,
        steps: algorithmSteps,
        currentStep: 0,
        progress: 0
      }));

      // Track access counts
      const counts = new Array(array.length).fill(0);
      const path: number[] = [];
      let compCount = 0;

      algorithmSteps.forEach(step => {
        if (step.currentIndex !== undefined && step.currentIndex >= 0) {
          counts[step.currentIndex]++;
          if (!path.includes(step.currentIndex)) {
            path.push(step.currentIndex);
          }
          compCount++;
        }
      });

      setAccessCount(counts);
      setSearchPath(path);
      setComparisons(compCount);
    }
  }, [array, target, algorithm]);

  // Animation control
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

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

      const speedMultiplier = Math.max(0.1, Math.min(3, stateRef.current.speed));
      await delay(500 / speedMultiplier);

      while (stateRef.current.isPaused && animationRef.current) {
        await delay(100);
      }
    }

    animationRef.current = false;
    setState(prev => ({ ...prev, isPlaying: false }));
  }, [steps]);

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

  const handleTargetInputChange = (value: string) => {
    setTargetInput(value);
    const num = parseInt(value);
    if (!isNaN(num)) {
      if (num < 10 || num > 100) {
        setTargetWarning('⚠️ Số ngoài phạm vi [10-100]');
      } else if (!array.includes(num)) {
        setTargetWarning('⚠️ Số không có trong mảng');
      } else {
        setTargetWarning('');
      }
    }
  };

  const handleTargetInputBlur = () => {
    const num = parseInt(targetInput);
    if (!isNaN(num) && num >= 10 && num <= 100) {
      setTarget(num);
      if (!array.includes(num)) {
        setTargetWarning('⚠️ Số không có trong mảng - sẽ tìm không thấy');
      }
    } else {
      setTargetInput(target.toString());
      setTargetWarning('');
    }
  };

  const randomizeTarget = () => {
    if (array.length > 0) {
      const randomTarget = array[Math.floor(Math.random() * array.length)];
      setTarget(randomTarget);
      setTargetInput(randomTarget.toString());
      setTargetWarning('');
    }
  };

  // Current step data
  const currentStepData = useMemo(() => {
    return steps[state.currentStep] || { 
      array: array, 
      currentIndex: -1, 
      found: false,
      left: 0,
      right: array.length - 1,
      mid: -1
    };
  }, [steps, state.currentStep, array]);

  // Get heatmap color based on access count
  const getHeatmapColor = (index: number, count: number) => {
    const maxCount = Math.max(...accessCount);
    const intensity = maxCount > 0 ? count / maxCount : 0;
    
    if (currentStepData.found && currentStepData.currentIndex === index) {
      return 'bg-green-500';
    }
    if (currentStepData.currentIndex === index) {
      return 'bg-yellow-500';
    }
    
    if (intensity === 0) return 'bg-gray-200';
    if (intensity < 0.25) return 'bg-blue-100';
    if (intensity < 0.5) return 'bg-blue-300';
    if (intensity < 0.75) return 'bg-blue-500';
    return 'bg-blue-700';
  };

  // Get element color for linear view
  const getElementColor = (index: number) => {
    const { currentIndex, found, left, right } = currentStepData;

    if (found && currentIndex === index) return 'bg-green-500';
    if (currentIndex === index) return 'bg-yellow-500';
    
    if (algorithm === 'binary-search') {
      if (currentStepData.mid === index) return 'bg-purple-500';
      if (left !== undefined && right !== undefined && (index < left || index > right)) {
        return 'bg-gray-300';
      }
    }
    
    return 'bg-blue-500';
  };

  // Render linear view
  const renderLinearView = () => (
    <div className="space-y-4">
      {/* Main array visualization */}
      <div className="flex flex-wrap justify-center gap-2">
        {currentStepData.array.map((value, index) => (
          <motion.div
            key={`search-${index}-${value}`}
            className={`
              ${getElementColor(index)} 
              text-white
              w-12 h-12 rounded-lg flex items-center justify-center
              font-bold text-sm
              ${value === target ? 'ring-2 ring-yellow-400' : ''}
            `}
            animate={{
              scale: currentStepData.currentIndex === index ? 1.15 : 
                     (currentStepData.mid === index ? 1.1 : 1),
              y: currentStepData.found && currentStepData.currentIndex === index ? -10 : 0,
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

      {/* Search path indicator */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <div className="text-sm text-blue-800 font-medium mb-2">Đường Đi Tìm Kiếm:</div>
        <div className="flex flex-wrap gap-2">
          {searchPath.slice(0, state.currentStep + 1).map((idx, i) => (
            <motion.div
              key={`path-${i}-${idx}`}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-blue-200 px-2 py-1 rounded text-xs font-medium"
            >
              {array[idx]} <span className="text-gray-600">(vị trí {idx})</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Binary search range indicator */}
      {algorithm === 'binary-search' && currentStepData.left !== undefined && currentStepData.right !== undefined && (
        <div className="mt-2 p-3 bg-purple-50 rounded-lg">
          <div className="flex items-center justify-center space-x-6 text-sm">
            <span className="text-purple-700">
              <span className="font-bold">Left:</span> {currentStepData.left}
            </span>
            <span className="text-purple-900 font-bold text-lg">
              <span className="font-bold">Mid:</span> {currentStepData.mid}
            </span>
            <span className="text-purple-700">
              <span className="font-bold">Right:</span> {currentStepData.right}
            </span>
          </div>
        </div>
      )}
    </div>
  );

  // Render tree view (for binary search)
  const renderTreeView = () => {
    if (algorithm !== 'binary-search') {
      return <div className="text-center text-gray-500 py-8">Tree view chỉ khả dụng cho Binary Search</div>;
    }

    // Build tree structure based on search path
    const treeNodes: { value: number; index: number; level: number; position: number }[] = [];
    const visited = new Set<number>();
    
    steps.slice(0, state.currentStep + 1).forEach((step, stepIdx) => {
      if (step.mid !== undefined && !visited.has(step.mid)) {
        visited.add(step.mid);
        treeNodes.push({
          value: array[step.mid],
          index: step.mid,
          level: stepIdx,
          position: treeNodes.length
        });
      }
    });

    return (
      <div className="relative h-[300px] overflow-auto">
        <svg width="600" height="300" className="mx-auto">
          {/* Draw tree nodes */}
          {treeNodes.map((node, idx) => {
            const x = 300 + (idx - treeNodes.length / 2) * 80;
            const y = 50 + node.level * 60;
            const isTarget = array[node.index] === target;
            const isCurrent = node.index === currentStepData.mid;

            return (
              <g key={`tree-node-${idx}`}>
                {/* Connection line to parent */}
                {idx > 0 && (
                  <line
                    x1={300 + (Math.floor((idx - 1) / 2) - treeNodes.length / 2) * 80}
                    y1={50 + treeNodes[Math.floor((idx - 1) / 2)].level * 60}
                    x2={x}
                    y2={y}
                    stroke="#cbd5e1"
                    strokeWidth="2"
                  />
                )}
                
                {/* Node circle */}
                <motion.circle
                  cx={x}
                  cy={y}
                  r={20}
                  fill={isTarget ? '#10b981' : isCurrent ? '#eab308' : '#3b82f6'}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: idx * 0.2 }}
                />
                
                {/* Node value */}
                <text
                  x={x}
                  y={y + 5}
                  textAnchor="middle"
                  className="text-sm font-bold fill-white"
                >
                  {node.value}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    );
  };

  // Render heatmap view
  const renderHeatmapView = () => {
    const maxCount = Math.max(...accessCount);
    
    return (
      <div className="space-y-4">
        {/* Heatmap visualization */}
        <div className="flex flex-wrap justify-center gap-2">
          {currentStepData.array.map((value, index) => {
            const count = state.currentStep >= steps.length - 1 ? accessCount[index] : 
                         steps.slice(0, state.currentStep + 1).filter(s => s.currentIndex === index).length;
            
            return (
              <motion.div
                key={`heatmap-${index}-${value}`}
                className={`
                  ${getHeatmapColor(index, count)}
                  ${count > 0 ? 'text-white' : 'text-gray-600'}
                  w-12 h-16 rounded-lg flex flex-col items-center justify-center
                  font-bold text-sm relative
                  ${value === target ? 'ring-2 ring-yellow-400' : ''}
                `}
                animate={{
                  scale: currentStepData.currentIndex === index ? 1.1 : 1,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 400,
                  damping: 25,
                }}
              >
                <div>{value}</div>
                {count > 0 && (
                  <div className="text-xs opacity-75 mt-1">
                    {count}x
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Heatmap legend */}
        <div className="flex items-center justify-center space-x-2 text-xs">
          <span className="text-gray-600">Số lần truy cập:</span>
          <div className="flex items-center space-x-1">
            <div className="w-4 h-4 bg-gray-200 rounded"></div>
            <span>0</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-4 h-4 bg-blue-100 rounded"></div>
            <span>Thấp</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span>Trung Bình</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-4 h-4 bg-blue-700 rounded"></div>
            <span>Cao</span>
          </div>
        </div>

        {/* Access statistics */}
        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Tổng Truy Cập:</span>
              <span className="font-bold ml-2">{accessCount.reduce((a, b) => a + b, 0)}</span>
            </div>
            <div>
              <span className="text-gray-600">Phần Tử Truy Cập Nhiều Nhất:</span>
              <span className="font-bold ml-2">{maxCount} lần</span>
            </div>
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
                <span>Tìm Kiếm</span>
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
            onClick={() => setViewMode('linear')}
            className={`p-2 rounded flex items-center space-x-1 ${viewMode === 'linear' ? 'bg-white shadow' : ''}`}
            title="Linear View"
          >
            <Search className="w-4 h-4" />
            <span className="text-xs">Linear</span>
          </button>
          <button
            onClick={() => setViewMode('tree')}
            className={`p-2 rounded flex items-center space-x-1 ${viewMode === 'tree' ? 'bg-white shadow' : ''}`}
            title="Tree View"
            disabled={algorithm !== 'binary-search'}
          >
            <TreePine className="w-4 h-4" />
            <span className="text-xs">Tree</span>
          </button>
          <button
            onClick={() => setViewMode('heatmap')}
            className={`p-2 rounded flex items-center space-x-1 ${viewMode === 'heatmap' ? 'bg-white shadow' : ''}`}
            title="Heatmap View"
          >
            <Activity className="w-4 h-4" />
            <span className="text-xs">Heatmap</span>
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

      {/* Target Input */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Search className="w-5 h-5 text-blue-600" />
            <label className="text-sm font-medium text-blue-800">Mục Tiêu:</label>
            <div className="flex flex-col">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={targetInput}
                  onChange={(e) => handleTargetInputChange(e.target.value)}
                  onBlur={handleTargetInputBlur}
                  disabled={state.isPlaying}
                  placeholder="Nhập số..."
                  className={`px-3 py-1 border rounded text-center w-24 font-bold ${
                    targetWarning 
                      ? 'border-orange-400 text-orange-800 bg-orange-50' 
                      : 'border-blue-300 text-blue-800'
                  }`}
                />
                <button
                  onClick={randomizeTarget}
                  disabled={state.isPlaying}
                  className="px-2 py-1 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded text-xs transition-colors disabled:opacity-50 flex items-center"
                  title="Chọn số ngẫu nhiên"
                >
                  <Dices className="w-4 h-4" />
                </button>
              </div>
              {targetWarning && (
                <span className="text-xs text-orange-600 mt-1">{targetWarning}</span>
              )}
            </div>
          </div>
          
          {/* Stats */}
          <div className="flex items-center space-x-4">
            <div className="text-sm">
              <span className="text-gray-600">So Sánh:</span>
              <span className="font-bold ml-2">{comparisons}</span>
            </div>
            <div className="text-sm">
              <span className="text-gray-600">Đường Đi:</span>
              <span className="font-bold ml-2">{searchPath.length}</span>
            </div>
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
                min="10"
                max="50"
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
      <div className="relative bg-gray-50 rounded-lg p-4 min-h-[300px]">
        {viewMode === 'linear' && renderLinearView()}
        {viewMode === 'tree' && renderTreeView()}
        {viewMode === 'heatmap' && renderHeatmapView()}

        {/* Legend */}
        <div className="flex flex-wrap justify-center space-x-4 mt-4 text-xs">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span>Chưa Kiểm Tra</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-yellow-500 rounded"></div>
            <span>Đang Kiểm Tra</span>
          </div>
          {algorithm === 'binary-search' && (
            <>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-purple-500 rounded"></div>
                <span>Giữa</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-gray-300 rounded"></div>
                <span>Loại Bỏ</span>
              </div>
            </>
          )}
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span>Tìm Thấy</span>
          </div>
        </div>
      </div>

      {/* Algorithm Status */}
      <div className="mt-4 text-center text-sm text-gray-600">
        {state.isPlaying && !state.isPaused && (
          <span className="text-blue-600">● Đang Tìm Kiếm...</span>
        )}
        {state.isPaused && (
          <span className="text-yellow-600">⏸ Đã Tạm Dừng</span>
        )}
        {!state.isPlaying && currentStepData.found && (
          <span className="text-green-600">✓ Tìm Thấy Tại Vị Trí {currentStepData.currentIndex}!</span>
        )}
        {!state.isPlaying && state.currentStep === steps.length - 1 && !currentStepData.found && (
          <span className="text-red-600">✗ Không Tìm Thấy</span>
        )}
        {!state.isPlaying && state.currentStep === 0 && (
          <span className="text-gray-500">Sẵn Sàng Tìm Kiếm</span>
        )}
      </div>

      {/* Algorithm Info */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
        {algorithm === 'linear-search' && (
          <p>Linear Search kiểm tra tuần tự từng phần tử cho đến khi tìm thấy hoặc hết mảng. Độ phức tạp: O(n)</p>
        )}
        {algorithm === 'binary-search' && (
          <p>Binary Search chia đôi mảng đã sắp xếp ở mỗi bước, loại bỏ một nửa phần tử còn lại. Độ phức tạp: O(log n)</p>
        )}
      </div>
    </div>
  );
}
