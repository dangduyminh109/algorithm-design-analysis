'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, Shuffle, Search, Settings, Dices } from 'lucide-react';
import { SearchingStep, VisualizationState } from '@/types/algorithm';
import { SearchingAlgorithms, generateUniqueRandomArray, delay } from '@/lib/algorithmUtils';
import { usePerformanceOptimization } from '@/hooks/usePerformanceOptimization';

interface SearchingVisualizerProps {
  algorithm: string;
}

export default function SearchingVisualizer({ algorithm }: SearchingVisualizerProps) {
  const [array, setArray] = useState<number[]>([]);
  const [steps, setSteps] = useState<SearchingStep[]>([]);
  const [target, setTarget] = useState<number>(50);
  const [targetInput, setTargetInput] = useState<string>('50'); // State cho input string
  const [targetWarning, setTargetWarning] = useState<string>(''); // State cho cảnh báo
  const [state, setState] = useState<VisualizationState>({
    isPlaying: false,
    isPaused: false,
    speed: 1,
    currentStep: 0,
    steps: [],
    progress: 0
  });

  // Performance optimization
  const { isSlowDevice } = usePerformanceOptimization();

  // Array size and settings
  const [arraySize, setArraySize] = useState(isSlowDevice ? 15 : 20);
  const [showSettings, setShowSettings] = useState(false);

    // Initialize array
  const initializeArray = useCallback(() => {
    // Stop any ongoing animation
    animationRef.current = false;
    
    const newArray = generateUniqueRandomArray(arraySize, 10, 100).sort((a, b) => a - b); // Keep sorted for binary search
    setArray(newArray);
    const randomTarget = newArray[Math.floor(Math.random() * newArray.length)];
    setTarget(randomTarget);
    setTargetInput(randomTarget.toString());
    setTargetWarning('');
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


  useEffect(() => {
    if (array.length > 0) {
      let algorithmSteps: SearchingStep[] = [];

      switch (algorithm) {
        case 'linear-search':
          algorithmSteps = SearchingAlgorithms.linearSearch(array, target);
          break;
        case 'binary-search':
          // Array should already be sorted from initializeArray
          algorithmSteps = SearchingAlgorithms.binarySearch(array, target);
          break;
        case 'jump-search':
          algorithmSteps = SearchingAlgorithms.jumpSearch(array, target);
          break;
        case 'interpolation-search':
          algorithmSteps = SearchingAlgorithms.interpolationSearch(array, target);
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
    }
  }, [array, target, algorithm]);

  // Animation control with ref for state access
  const stateRef = useRef(state);
  const animationRef = useRef<boolean>(false);
  
  // Update ref when state changes
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

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

      const speedMultiplier = Math.max(0.1, Math.min(3, stateRef.current.speed));
      await delay(500 / speedMultiplier);

      // Check if paused
      while (stateRef.current.isPaused && animationRef.current) {
        await delay(100);
      }
    }

    animationRef.current = false;
    setState(prev => ({ ...prev, isPlaying: false }));
  }, [steps]);

  // Control functions
  const handlePlay = async () => {
    // Only reset if we're at the end and not currently playing
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
    // Reset to initial search state
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

  const handleTargetInputChange = (inputValue: string) => {
    if (state.isPlaying) return;
    
    setTargetInput(inputValue);
    
    // Clear warning initially
    setTargetWarning('');
    
    // If input is empty, allow it but don't update target
    if (inputValue.trim() === '') {
      return;
    }
    
    // Parse the input
    const numValue = parseInt(inputValue);
    
    // Check if it's a valid number
    if (isNaN(numValue)) {
      setTargetWarning('Vui lòng nhập số hợp lệ');
      return;
    }
    
    // Update target
    setTarget(numValue);
    
    // Check if number exists in array and show warning
    if (!array.includes(numValue)) {
      setTargetWarning('Số này không có trong mảng');
    }
  };
  
  const handleTargetInputBlur = () => {
    // If input is empty on blur, restore last valid target
    if (targetInput.trim() === '') {
      setTargetInput(target.toString());
    }
  };
  
  const randomizeTarget = () => {
    if (state.isPlaying || array.length === 0) return;
    
    const randomTarget = array[Math.floor(Math.random() * array.length)];
    setTarget(randomTarget);
    setTargetInput(randomTarget.toString());
    setTargetWarning('');
  };

  // Get current step data
  const currentStepData = (steps.length > 0 && steps[state.currentStep]) ? steps[state.currentStep] : { 
    array: array, 
    target: target, 
    currentIndex: -1, 
    found: false 
  };

  // Get element color based on state
  const getElementColor = (index: number) => {
    const { currentIndex, found, left, right, mid, isJumpPoint } = currentStepData;

    if (found && currentIndex === index) return 'bg-green-500';
    
    // Jump point visualization for Jump Search
    if (algorithm === 'jump-search' && isJumpPoint && currentIndex === index) {
      return 'bg-white border-2 border-blue-400';
    }
    
    if (currentIndex === index) return 'bg-yellow-500';
    
    if (algorithm === 'binary-search') {
      if (mid === index) return 'bg-purple-500';
      if (left !== undefined && right !== undefined) {
        if (index < left || index > right) return 'bg-gray-400';
      }
    }
    
    // Jump Search: only show eliminated (full gray) for elements before and including previous jump point
    if (algorithm === 'jump-search' && state.currentStep > 0) {
      if (left !== undefined) {
        // Gray out elements up to and including the previous jump point (left)
        if (index <= left) return 'bg-gray-400';
      }
    }
    
    return 'bg-blue-500';
  };

  // Get element text color
  const getElementTextColor = (index: number) => {
    const { currentIndex, found, left, isJumpPoint } = currentStepData;
    
    // Jump point with white background needs dark text
    if (algorithm === 'jump-search' && isJumpPoint && currentIndex === index && !found) {
      return 'text-blue-600 font-bold';
    }
    
    if ((found && currentIndex === index) || currentIndex === index) {
      return 'text-white';
    }
    
    // Hide text for eliminated elements (same color as background)
    if (algorithm === 'binary-search') {
      const { left, right } = currentStepData;
      if (left !== undefined && right !== undefined && (index < left || index > right)) {
        return 'text-gray-400';
      }
    }
    
    // Jump Search: hide text for elements up to and including previous jump point (eliminated)
    if (algorithm === 'jump-search' && state.currentStep > 0) {
      if (left !== undefined && index <= left) {
        return 'text-gray-400';
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
          <div className="flex flex-col">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={targetInput}
                onChange={(e) => handleTargetInputChange(e.target.value)}
                onBlur={handleTargetInputBlur}
                disabled={state.isPlaying}
                placeholder="Nhập số cần tìm..."
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
                title="Chọn số ngẫu nhiên từ mảng"
              >
                <Dices className="w-4 h-4" />
              </button>
            </div>
            {targetWarning && (
              <span className="text-xs text-orange-600 mt-1 flex items-center">
                {targetWarning}
              </span>
            )}
          </div>
          <span className="text-sm text-blue-600">
            {currentStepData.found ? ' Đã Tìm Thấy!' : 'Đang Tìm Kiếm...'}
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
          <span>Tiến Trình</span>
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
              key={`search-${index}-${value}`}
              className={`
                ${getElementColor(index)} 
                ${getElementTextColor(index)}
                w-12 h-12 rounded-lg flex items-center justify-center
                font-bold text-sm
                ${value === target ? 'ring-2 ring-yellow-400' : ''}
              `}
              style={{
                transform: 'translateZ(0)',
                willChange: 'transform',
                backfaceVisibility: 'hidden',
              }}
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

        {/* Search Range Indicator */}
        {(algorithm === 'binary-search' || algorithm === 'jump-search' || algorithm === 'interpolation-search') && 
         currentStepData.left !== undefined && currentStepData.right !== undefined && (
          <div className="mt-4 text-center text-sm text-gray-600">
            <div className="flex items-center justify-center space-x-4">
              <span>Left: {currentStepData.left}</span>
              {currentStepData.mid !== undefined && (
                <span className="font-bold">
                  {algorithm === 'interpolation-search' ? 'Pos' : 'Mid'}: {currentStepData.mid}
                </span>
              )}
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
          {algorithm === 'jump-search' && (
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-white border-2 border-blue-400 rounded"></div>
              <span>Jump Point</span>
            </div>
          )}
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
          {(algorithm === 'jump-search') && (
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-gray-400 rounded"></div>
              <span>Eliminated</span>
            </div>
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
      <div className="mt-4 text-center">
        {state.isPlaying && !state.isPaused && (
          <div className="text-blue-600 text-sm">● Searching...</div>
        )}
        {state.isPaused && (
          <div className="text-yellow-600 text-sm">⏸ Paused</div>
        )}
        {!state.isPlaying && currentStepData.found && (
          <div className="text-green-600 text-sm"> Target found at position {currentStepData.currentIndex}!</div>
        )}
        {!state.isPlaying && state.currentStep === steps.length - 1 && !currentStepData.found && (
          <div className="text-red-600 text-sm">✗ Target not found in array</div>
        )}
        {!state.isPlaying && state.currentStep === 0 && steps.length === 0 && (
          <div className="text-gray-500 text-sm">Ready to search</div>
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

      {/* Algorithm Info */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
        {algorithm === 'linear-search' && (
          <p>Linear Search checks each element sequentially until the target is found or the end is reached.</p>
        )}
        {algorithm === 'binary-search' && (
          <p>Binary Search divides the sorted array in half at each step, eliminating half of the remaining elements.</p>
        )}
        {algorithm === 'jump-search' && (
          <p>Jump Search jumps ahead by fixed steps (√n), then performs linear search in the identified block. Works on sorted arrays.</p>
        )}
        {algorithm === 'interpolation-search' && (
          <p>Interpolation Search estimates the position of the target using interpolation formula. Most efficient on uniformly distributed sorted arrays.</p>
        )}
      </div>
    </div>
  );
}
