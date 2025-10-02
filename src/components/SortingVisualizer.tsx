'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Shuffle, Settings, BarChart3, Circle, Gauge, Grid } from 'lucide-react';
import { SortingStep, VisualizationState } from '@/types/algorithm';
import { SortingAlgorithms, generateUniqueRandomArray, delay } from '@/lib/algorithmUtils';
import { usePerformanceOptimization } from '@/hooks/usePerformanceOptimization';

type ViewMode = 'bar' | 'dot' | 'circular' | 'grid';

interface SortingVisualizerProps {
  algorithm: string;
  onStepChange?: (step: number, totalSteps: number) => void;
}

export default function SortingVisualizer({ 
  algorithm, 
  onStepChange 
}: SortingVisualizerProps) {
  const [array, setArray] = useState<number[]>([]);
  const [steps, setSteps] = useState<SortingStep[]>([]);
  const [state, setState] = useState<VisualizationState>({
    isPlaying: false,
    isPaused: false,
    speed: 1,
    currentStep: 0,
    steps: [],
    progress: 0
  });

  // View mode and settings
  const [viewMode, setViewMode] = useState<ViewMode>('bar');
  const [showStats, setShowStats] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [arraySize, setArraySize] = useState(30);

  // Performance counters
  const [comparisons, setComparisons] = useState(0);
  const [swaps, setSwaps] = useState(0);
  const [arrayAccesses, setArrayAccesses] = useState(0);

  const { isSlowDevice } = usePerformanceOptimization();
  const stateRef = useRef(state);
  const animationRef = useRef<boolean>(false);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  // Initialize array
  const initializeArray = useCallback(() => {
    animationRef.current = false;
    const newArray = generateUniqueRandomArray(arraySize, 5, 95);
    setArray(newArray);
    setSteps([]);
    setComparisons(0);
    setSwaps(0);
    setArrayAccesses(0);
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

    let algorithmSteps: SortingStep[] = [];

    switch (algorithm) {
      case 'bubble-sort':
        algorithmSteps = SortingAlgorithms.bubbleSort([...array]);
        break;
      case 'selection-sort':
        algorithmSteps = SortingAlgorithms.selectionSort([...array]);
        break;
      case 'insertion-sort':
        algorithmSteps = SortingAlgorithms.insertionSort([...array]);
        break;
      case 'quick-sort':
        algorithmSteps = SortingAlgorithms.quickSort([...array]);
        break;
      case 'merge-sort':
        algorithmSteps = SortingAlgorithms.mergeSort([...array]);
        break;
      default:
        algorithmSteps = SortingAlgorithms.bubbleSort([...array]);
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

    // Calculate stats
    let compCount = 0;
    let swapCount = 0;
    algorithmSteps.forEach(step => {
      if (step.comparing.length > 0) compCount++;
      if (step.swapping.length > 0) swapCount++;
    });
    setComparisons(compCount);
    setSwaps(swapCount);
    setArrayAccesses(compCount * 2 + swapCount * 2);
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
      const baseDelay = isSlowDevice ? 400 : 300;
      await delay(baseDelay / speedMultiplier);

      while (stateRef.current.isPaused && animationRef.current) {
        await delay(100);
      }
    }

    animationRef.current = false;
    setState(prev => ({ ...prev, isPlaying: false }));
  }, [steps, onStepChange, isSlowDevice]);

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
    if (steps.length > 0 && steps[0]) {
      setArray([...steps[0].array]);
    }
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
    return steps[state.currentStep] || { array: array, comparing: [], swapping: [], sorted: [] };
  }, [steps, state.currentStep, array]);

  // Color and style functions
  const getBarColor = useCallback((index: number) => {
    const { comparing, swapping, sorted, pivot } = currentStepData;
    if (sorted.includes(index)) return 'bg-green-500';
    if (pivot === index) return 'bg-purple-500';
    if (swapping.includes(index)) return 'bg-red-500';
    if (comparing.includes(index)) return 'bg-yellow-500';
    return 'bg-blue-500';
  }, [currentStepData]);

  const getBarHeight = useCallback((value: number) => {
    const maxHeight = 300;
    const maxValue = Math.max(...currentStepData.array);
    return (value / maxValue) * maxHeight;
  }, [currentStepData.array]);

  // Render different view modes
  const renderBarView = () => (
    <div className="flex items-end justify-center space-x-1 h-[320px]">
      {currentStepData.array.map((value, index) => (
        <motion.div
          key={`bar-${index}-${value}`}
          className={`${getBarColor(index)} rounded-t-sm relative`}
          style={{
            width: `${Math.max(600 / currentStepData.array.length - 1, 3)}px`,
            height: `${getBarHeight(value)}px`,
            transform: 'translateZ(0)',
            willChange: 'transform',
          }}
          animate={{
            scale: currentStepData.comparing.includes(index) ? 1.08 : 1,
            y: currentStepData.swapping.includes(index) ? -15 : 0,
          }}
          transition={{
            type: 'spring',
            stiffness: 500,
            damping: 30,
          }}
        >
          {currentStepData.array.length <= 30 && (
            <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-700 font-medium">
              {value}
            </span>
          )}
        </motion.div>
      ))}
    </div>
  );

  const renderDotView = () => {
    const maxValue = Math.max(...currentStepData.array);
    const gridHeight = 20;
    
    return (
      <div className="relative h-[320px] w-full">
        {/* Grid background */}
        <div className="absolute inset-0 grid gap-0" style={{ gridTemplateRows: `repeat(${gridHeight}, 1fr)` }}>
          {Array.from({ length: gridHeight }).map((_, i) => (
            <div key={i} className="border-b border-gray-200"></div>
          ))}
        </div>
        
        {/* Dots */}
        <div className="absolute inset-0 flex items-end justify-center space-x-2">
          {currentStepData.array.map((value, index) => {
            const dotY = ((maxValue - value) / maxValue) * 280;
            return (
              <motion.div
                key={`dot-${index}-${value}`}
                className="relative"
                style={{ width: `${Math.max(600 / currentStepData.array.length - 2, 8)}px` }}
              >
                <motion.div
                  className={`${getBarColor(index)} rounded-full absolute left-1/2 transform -translate-x-1/2`}
                  style={{
                    width: '12px',
                    height: '12px',
                  }}
                  animate={{
                    y: -dotY - 20,
                    scale: currentStepData.comparing.includes(index) || currentStepData.swapping.includes(index) ? 1.5 : 1,
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 25,
                  }}
                />
                {/* Value label */}
                {currentStepData.array.length <= 20 && (
                  <motion.span
                    className="absolute left-1/2 transform -translate-x-1/2 text-xs text-gray-700 font-medium"
                    animate={{ y: -dotY - 35 }}
                  >
                    {value}
                  </motion.span>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderCircularView = () => {
    const radius = 120;
    const centerX = 150;
    const centerY = 150;
    const angleStep = (2 * Math.PI) / currentStepData.array.length;

    return (
      <div className="relative h-[320px] flex items-center justify-center">
        <svg width="300" height="300" viewBox="0 0 300 300">
          {/* Circle guide */}
          <circle cx={centerX} cy={centerY} r={radius} fill="none" stroke="#e5e7eb" strokeWidth="1" />
          
          {/* Array elements */}
          {currentStepData.array.map((value, index) => {
            const angle = index * angleStep - Math.PI / 2;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);
            const colorClass = getBarColor(index);
            const color = colorClass.includes('green') ? '#10b981' :
                         colorClass.includes('red') ? '#ef4444' :
                         colorClass.includes('yellow') ? '#eab308' :
                         colorClass.includes('purple') ? '#a855f7' : '#3b82f6';

            return (
              <g key={`circular-${index}-${value}`}>
                <motion.circle
                  cx={x}
                  cy={y}
                  r={currentStepData.comparing.includes(index) || currentStepData.swapping.includes(index) ? 10 : 6}
                  fill={color}
                  animate={{
                    r: currentStepData.comparing.includes(index) || currentStepData.swapping.includes(index) ? 10 : 6,
                  }}
                  transition={{ duration: 0.2 }}
                />
                <text
                  x={x}
                  y={y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-xs font-bold fill-white"
                >
                  {value}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    );
  };

  const renderGridView = () => (
    <div className="grid grid-cols-10 gap-2 p-4">
      {currentStepData.array.map((value, index) => (
        <motion.div
          key={`grid-${index}-${value}`}
          className={`${getBarColor(index)} rounded-lg flex items-center justify-center font-bold text-white text-sm h-12`}
          animate={{
            scale: currentStepData.comparing.includes(index) || currentStepData.swapping.includes(index) ? 1.15 : 1,
            rotate: currentStepData.swapping.includes(index) ? [0, -5, 5, 0] : 0,
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
  );

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
            className={`p-2 rounded ${viewMode === 'bar' ? 'bg-white shadow' : ''}`}
            title="Bar Chart"
          >
            <BarChart3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('dot')}
            className={`p-2 rounded ${viewMode === 'dot' ? 'bg-white shadow' : ''}`}
            title="Dot Plot"
          >
            <Circle className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('circular')}
            className={`p-2 rounded ${viewMode === 'circular' ? 'bg-white shadow' : ''}`}
            title="Circular View"
          >
            <Gauge className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow' : ''}`}
            title="Grid View"
          >
            <Grid className="w-4 h-4" />
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
                max="100"
                value={arraySize}
                onChange={(e) => setArraySize(parseInt(e.target.value))}
                className="flex-1"
                disabled={state.isPlaying}
              />
              <span className="text-sm text-gray-600 w-8">{arraySize}</span>
            </div>
            <div className="flex items-center space-x-4 mt-2">
              <label className="text-sm text-gray-600">
                <input
                  type="checkbox"
                  checked={showStats}
                  onChange={(e) => setShowStats(e.target.checked)}
                  className="mr-2"
                />
                Hiển Thị Thống Kê
              </label>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats Display */}
      {showStats && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="text-xs text-blue-600 font-medium">So Sánh</div>
            <div className="text-2xl font-bold text-blue-800">{comparisons}</div>
          </div>
          <div className="bg-red-50 rounded-lg p-3">
            <div className="text-xs text-red-600 font-medium">Hoán Đổi</div>
            <div className="text-2xl font-bold text-red-800">{swaps}</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-3">
            <div className="text-xs text-purple-600 font-medium">Truy Cập Mảng</div>
            <div className="text-2xl font-bold text-purple-800">{arrayAccesses}</div>
          </div>
        </div>
      )}

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
        {viewMode === 'dot' && renderDotView()}
        {viewMode === 'circular' && renderCircularView()}
        {viewMode === 'grid' && renderGridView()}

        {/* Legend */}
        <div className="flex flex-wrap justify-center space-x-4 mt-4 text-xs">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span>Chưa Sắp Xếp</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-yellow-500 rounded"></div>
            <span>Đang So Sánh</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span>Đang Hoán Đổi</span>
          </div>
          {algorithm === 'quick-sort' && (
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-purple-500 rounded"></div>
              <span>Pivot</span>
            </div>
          )}
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span>Đã Sắp Xếp</span>
          </div>
        </div>
      </div>

      {/* Algorithm Status */}
      <div className="mt-4 text-center text-sm text-gray-600">
        {state.isPlaying && !state.isPaused && (
          <span className="text-blue-600">● Đang Chạy...</span>
        )}
        {state.isPaused && (
          <span className="text-yellow-600">⏸ Đã Tạm Dừng</span>
        )}
        {!state.isPlaying && state.currentStep === steps.length - 1 && steps.length > 0 && (
          <span className="text-green-600">✓ Hoàn Thành Sắp Xếp!</span>
        )}
        {!state.isPlaying && state.currentStep === 0 && (
          <span className="text-gray-500">Sẵn Sàng Bắt Đầu</span>
        )}
      </div>
    </div>
  );
}
