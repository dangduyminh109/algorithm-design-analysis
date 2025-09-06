'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, Shuffle, Search, Settings } from 'lucide-react';
import { SearchingStep, VisualizationState } from '@/types/algorithm';
import { SearchingAlgorithms, generateRandomArray, delay } from '@/lib/algorithmUtils';

interface SearchingVisualizerProps {
  algorithm: string;
  onStepChange?: (step: number, totalSteps: number) => void;
}

export default function SearchingVisualizer({ algorithm, onStepChange }: SearchingVisualizerProps) {
  const [array, setArray] = useState<number[]>([]);
  const [steps, setSteps] = useState<SearchingStep[]>([]);
  const [target, setTarget] = useState<number>(50);
  const [state, setState] = useState<VisualizationState>({
    isPlaying: false,
    isPaused: false,
    speed: 1,
    currentStep: 0,
    steps: [],
    progress: 0
  });

  // Array size and settings
  const [arraySize, setArraySize] = useState(20);
  const [showSettings, setShowSettings] = useState(false);

  // Initialize array
  const initializeArray = useCallback(() => {
    let newArray = generateRandomArray(arraySize, 1, 100);
    
    // For binary search, we need a sorted array
    if (algorithm === 'binary-search') {
      newArray.sort((a, b) => a - b);
    }
    
    setArray(newArray);
    
    // Set target to a random element from the array for better demonstration
    const randomTarget = newArray[Math.floor(Math.random() * newArray.length)];
    setTarget(randomTarget);
    
    setSteps([]);
    setState(prev => ({
      ...prev,
      currentStep: 0,
      progress: 0,
      isPlaying: false,
      isPaused: false
    }));
  }, [arraySize, algorithm]);

  useEffect(() => {
    initializeArray();
  }, [initializeArray]);

  // Generate steps for the selected algorithm
  const generateSteps = useCallback(() => {
    if (array.length === 0) return;

    let algorithmSteps: SearchingStep[] = [];

    switch (algorithm) {
      case 'linear-search':
        algorithmSteps = SearchingAlgorithms.linearSearch(array, target);
        break;
      case 'binary-search':
        // Ensure array is sorted for binary search
        const sortedArray = [...array].sort((a, b) => a - b);
        setArray(sortedArray);
        algorithmSteps = SearchingAlgorithms.binarySearch(sortedArray, target);
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
  }, [array, target, algorithm]);

  useEffect(() => {
    if (array.length > 0) {
      generateSteps();
    }
  }, [generateSteps]);

  // Animation control
  const animate = useCallback(async () => {
    if (steps.length === 0) return;

    setState(prev => ({ ...prev, isPlaying: true, isPaused: false }));

    for (let i = state.currentStep; i < steps.length; i++) {
      if (!state.isPlaying) break;

      setState(prev => ({
        ...prev,
        currentStep: i,
        progress: (i / (steps.length - 1)) * 100
      }));

      onStepChange?.(i, steps.length - 1);

      const speedMultiplier = Math.max(0.1, Math.min(3, state.speed));
      await delay(500 / speedMultiplier);

      // Check if paused
      while (state.isPaused && state.isPlaying) {
        await delay(100);
      }
    }

    setState(prev => ({ ...prev, isPlaying: false }));
  }, [steps, state.currentStep, state.isPlaying, state.isPaused, state.speed, onStepChange]);

  // Control functions
  const handlePlay = () => {
    if (state.currentStep >= steps.length - 1) {
      setState(prev => ({ ...prev, currentStep: 0, progress: 0 }));
    }
    animate();
  };

  const handlePause = () => {
    setState(prev => ({ ...prev, isPaused: !prev.isPaused }));
  };

  const handleReset = () => {
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

  const handleTargetChange = (newTarget: number) => {
    if (!state.isPlaying) {
      setTarget(newTarget);
    }
  };

  // Get current step data
  const currentStepData = steps[state.currentStep] || { 
    array: array, 
    target: target, 
    currentIndex: -1, 
    found: false 
  };

  // Get element color based on state
  const getElementColor = (index: number) => {
    const { currentIndex, found, left, right, mid } = currentStepData;

    if (found && currentIndex === index) return 'bg-green-500';
    if (currentIndex === index) return 'bg-yellow-500';
    
    if (algorithm === 'binary-search') {
      if (mid === index) return 'bg-purple-500';
      if (left !== undefined && right !== undefined) {
        if (index < left || index > right) return 'bg-gray-300';
      }
    }
    
    return 'bg-blue-500';
  };

  // Get element text color
  const getElementTextColor = (index: number) => {
    const { currentIndex, found } = currentStepData;
    
    if ((found && currentIndex === index) || currentIndex === index) {
      return 'text-white';
    }
    
    if (algorithm === 'binary-search') {
      const { left, right } = currentStepData;
      if (left !== undefined && right !== undefined && (index < left || index > right)) {
        return 'text-gray-500';
      }
    }
    
    return 'text-white';
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

      {/* Target Input */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-center space-x-4">
          <Search className="w-5 h-5 text-blue-600" />
          <label className="text-sm font-medium text-blue-800">Mục Tiêu Tìm Kiếm:</label>
          <input
            type="number"
            min="1"
            max="100"
            value={target}
            onChange={(e) => handleTargetChange(parseInt(e.target.value) || 50)}
            disabled={state.isPlaying}
            className="px-3 py-1 border border-blue-300 rounded text-center w-20 text-blue-800 font-bold"
          />
          <span className="text-sm text-blue-600">
            {currentStepData.found ? '✓ Đã Tìm Thấy!' : 'Đang Tìm Kiếm...'}
          </span>
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
      <div className="relative bg-gray-50 rounded-lg p-4 min-h-[200px]">
        <div className="flex flex-wrap justify-center gap-2">
          {currentStepData.array.map((value, index) => (
            <motion.div
              key={index}
              className={`
                ${getElementColor(index)} 
                ${getElementTextColor(index)}
                w-12 h-12 rounded-lg flex items-center justify-center
                font-bold text-sm transition-all duration-300
                ${value === target ? 'ring-2 ring-yellow-400' : ''}
              `}
              layout
              transition={{ duration: 0.3 }}
            >
              {value}
            </motion.div>
          ))}
        </div>

        {/* Binary Search Range Indicator */}
        {algorithm === 'binary-search' && currentStepData.left !== undefined && currentStepData.right !== undefined && (
          <div className="mt-4 text-center text-sm text-gray-600">
            <div className="flex items-center justify-center space-x-4">
              <span>Left: {currentStepData.left}</span>
              <span className="font-bold">Mid: {currentStepData.mid}</span>
              <span>Right: {currentStepData.right}</span>
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="flex flex-wrap justify-center space-x-4 mt-4 text-xs">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span>Unsearched</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-yellow-500 rounded"></div>
            <span>Current</span>
          </div>
          {algorithm === 'binary-search' && (
            <>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-purple-500 rounded"></div>
                <span>Middle</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-gray-300 rounded"></div>
                <span>Eliminated</span>
              </div>
            </>
          )}
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span>Found</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 border-2 border-yellow-400 bg-transparent rounded"></div>
            <span>Target</span>
          </div>
        </div>
      </div>

      {/* Algorithm Status */}
      <div className="mt-4 text-center text-sm text-gray-600">
        {state.isPlaying && !state.isPaused && (
          <span className="text-blue-600">● Searching...</span>
        )}
        {state.isPaused && (
          <span className="text-yellow-600">⏸ Paused</span>
        )}
        {!state.isPlaying && currentStepData.found && (
          <span className="text-green-600">✓ Target found at position {currentStepData.currentIndex}!</span>
        )}
        {!state.isPlaying && state.currentStep === steps.length - 1 && !currentStepData.found && (
          <span className="text-red-600">✗ Target not found in array</span>
        )}
        {!state.isPlaying && state.currentStep === 0 && (
          <span className="text-gray-500">Ready to search</span>
        )}
      </div>

      {/* Algorithm Info */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
        {algorithm === 'linear-search' && (
          <p>Linear Search checks each element sequentially until the target is found or the end is reached.</p>
        )}
        {algorithm === 'binary-search' && (
          <p>Binary Search divides the sorted array in half at each step, eliminating half of the remaining elements.</p>
        )}
      </div>
    </div>
  );
}
