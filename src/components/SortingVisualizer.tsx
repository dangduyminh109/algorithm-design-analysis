'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Shuffle, Settings } from 'lucide-react';
import { SortingStep, VisualizationState } from '@/types/algorithm';
import { SortingAlgorithms, generateUniqueRandomArray, delay } from '@/lib/algorithmUtils';
import { usePerformanceOptimization, useAnimationDebounce } from '@/hooks/usePerformanceOptimization';
import OptimizedAnimation from './OptimizedAnimation';
import OptimizedBar from './OptimizedBar';

interface SortingVisualizerProps {
  algorithm: string;
  onStepChange?: (step: number, totalSteps: number) => void;
}

export default function SortingVisualizer({ algorithm, onStepChange }: SortingVisualizerProps) {
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

  // Performance optimization hooks
  const { requestOptimizedFrame, isSlowDevice } = usePerformanceOptimization();
  const debouncedAnimate = useAnimationDebounce(isSlowDevice ? 32 : 16);

  // Use ref to track current state for animation
  const stateRef = useRef(state);
  const animationRef = useRef<boolean>(false);
  
  // Update ref when state changes
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  // Array size and settings
  const [arraySize, setArraySize] = useState(isSlowDevice ? 20 : 30);
  const [showSettings, setShowSettings] = useState(false);

  // Memoize array generation for better performance
  const initializeArray = useCallback(() => {
    // Stop any ongoing animation
    animationRef.current = false;
    
    const newArray = generateUniqueRandomArray(arraySize, 5, 95);
    setArray(newArray);
    setSteps([]);
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

  // Memoized steps generation for better performance
  const generateSteps = useCallback(() => {
    if (array.length === 0) return;

    // Stop any ongoing animation before generating new steps
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
  }, [array, algorithm]);

  useEffect(() => {
    if (array.length > 0) {
      // Debounce step generation to avoid excessive computation
      debouncedAnimate(() => generateSteps());
    }
  }, [generateSteps, debouncedAnimate, array.length]);

  // Optimized animation control with frame management
  const animate = useCallback(async () => {
    if (steps.length === 0) return;

    // Stop any existing animation first
    animationRef.current = false;
    await delay(50);

    animationRef.current = true;
    setState(prev => ({ ...prev, isPlaying: true, isPaused: false }));

    // Get current step from state ref to avoid stale closure
    let currentStepIndex = stateRef.current.currentStep;

    for (let i = currentStepIndex; i < steps.length; i++) {
      // Check if we should stop
      if (!animationRef.current) break;

      setState(prev => ({
        ...prev,
        currentStep: i,
        progress: (i / (steps.length - 1)) * 100
      }));

      onStepChange?.(i, steps.length - 1);

      // Adaptive delay based on device performance
      const speedMultiplier = Math.max(0.1, Math.min(3, stateRef.current.speed));
      const baseDelay = isSlowDevice ? 400 : 300;
      await delay(baseDelay / speedMultiplier);

      // Check if paused
      while (stateRef.current.isPaused && animationRef.current) {
        await delay(100);
      }
    }

    animationRef.current = false;
    setState(prev => ({ ...prev, isPlaying: false }));
  }, [steps, onStepChange, isSlowDevice]);

  // Control functions with performance optimization
  const handlePlay = async () => {    
    // Only reset if we're at the end
    if (stateRef.current.currentStep >= steps.length - 1) {
      setState(prev => ({ ...prev, currentStep: 0, progress: 0 }));
      // Wait for state to update
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
    // Reset array to original unsorted state
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

  // Memoized step data for better performance
  const currentStepData = useMemo(() => {
    return steps[state.currentStep] || { array: array, comparing: [], swapping: [], sorted: [] };
  }, [steps, state.currentStep, array]);

  // Memoized color calculation
  const getBarColor = useCallback((index: number) => {
    const { comparing, swapping, sorted, pivot } = currentStepData;

    if (sorted.includes(index)) return 'bg-green-500';
    if (pivot === index) return 'bg-purple-500';
    if (swapping.includes(index)) return 'bg-red-500';
    if (comparing.includes(index)) return 'bg-yellow-500';
    return 'bg-blue-500';
  }, [currentStepData]);

  // Memoized height calculation
  const getBarHeight = useCallback((value: number) => {
    const maxHeight = isSlowDevice ? 250 : 300;
    const maxValue = Math.max(...currentStepData.array);
    return (value / maxValue) * maxHeight;
  }, [currentStepData.array, isSlowDevice]);

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
                <span>{state.isPaused ? 'Resume' : 'Pause'}</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>Play</span>
              </>
            )}
          </button>

          <button
            onClick={handleReset}
            className="btn-secondary flex items-center space-x-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Đặt Lại</span>
          </button>

          <button
            onClick={initializeArray}
            className="btn-secondary flex items-center space-x-2"
          >
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
        </motion.div>
      )}

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
          <span>Progress</span>
          <span>Step {state.currentStep + 1} of {steps.length}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${state.progress}%` }}
          />
        </div>
        
        {/* Step Slider */}
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
        <div className="flex items-end justify-center space-x-1 h-[320px]">
          {currentStepData.array.map((value, index) => (
            <OptimizedBar
              key={`bar-${index}-${value}`}
              value={value}
              height={getBarHeight(value)}
              width={Math.max(600 / currentStepData.array.length - 1, 3)}
              color={getBarColor(index)}
              isComparing={currentStepData.comparing.includes(index)}
              isSwapping={currentStepData.swapping.includes(index)}
              isSorted={currentStepData.sorted.includes(index)}
              index={index}
            />
          ))}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap justify-center space-x-4 mt-4 text-xs">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span>Unsorted</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-yellow-500 rounded"></div>
            <span>Comparing</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span>Swapping</span>
          </div>
          {algorithm === 'quick-sort' && (
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-purple-500 rounded"></div>
              <span>Pivot</span>
            </div>
          )}
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span>Sorted</span>
          </div>
        </div>
      </div>

      {/* Algorithm Status */}
      <div className="mt-4 text-center">
        {state.isPlaying && !state.isPaused && (
          <div className="text-blue-600 text-sm">● Running...</div>
        )}
        {state.isPaused && (
          <div className="text-yellow-600 text-sm">⏸ Paused</div>
        )}
        {!state.isPlaying && state.currentStep === steps.length - 1 && steps.length > 0 && (
          <div className="text-green-600 text-sm"> Sorting Complete!</div>
        )}
        {!state.isPlaying && state.currentStep === 0 && steps.length === 0 && (
          <div className="text-gray-500 text-sm">Ready to start</div>
        )}
        
        {/* Step Explanation */}
        {steps.length > 0 && currentStepData.explanation && (
          <div className="mt-2 p-3 bg-blue-50 rounded-lg">
            <div className="text-sm font-medium text-blue-800">
              {currentStepData.explanation}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
