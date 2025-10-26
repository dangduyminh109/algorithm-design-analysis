'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, Shuffle, TrendingUp, TrendingDown, Settings } from 'lucide-react';
import { ExtremeStep, VisualizationState } from '@/types/algorithm';
import { ExtremeValueAlgorithms, generateUniqueRandomArray, delay } from '@/lib/algorithmUtils';
import { usePerformanceOptimization } from '@/hooks/usePerformanceOptimization';
import OptimizedBar from './OptimizedBar';

interface ExtremeValueVisualizerProps {
  algorithm: string;
  onStepChange?: (step: number, totalSteps: number) => void;
}

export default function ExtremeValueVisualizer({ algorithm, onStepChange }: ExtremeValueVisualizerProps) {
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

  // Performance optimization
  const { isSlowDevice } = usePerformanceOptimization();

  // Array size and settings
  const [arraySize, setArraySize] = useState(isSlowDevice ? 15 : 20);
  const [showSettings, setShowSettings] = useState(false);

  // Initialize array
  const initializeArray = useCallback(() => {
    // Stop any ongoing animation
    if (typeof animationRef !== 'undefined' && animationRef.current) {
      animationRef.current = false;
    }
    
    const newArray = generateUniqueRandomArray(arraySize, 10, 90);
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

  // Generate steps for the selected algorithm
  const generateSteps = useCallback(() => {
    if (array.length === 0) return;

    // Stop any ongoing animation before generating new steps
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
  }, [array, algorithm]);

  useEffect(() => {
    if (array.length > 0) {
      generateSteps();
    }
  }, [generateSteps, array.length]);

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

      onStepChange?.(i, steps.length - 1);

      const speedMultiplier = Math.max(0.1, Math.min(3, stateRef.current.speed));
      await delay(500 / speedMultiplier);

      // Check if paused
      while (stateRef.current.isPaused && animationRef.current) {
        await delay(100);
      }
    }

    animationRef.current = false;
    setState(prev => ({ ...prev, isPlaying: false }));
  }, [steps, onStepChange]);

  // Control functions
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
    // Reset to initial state
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

  // Get current step data
  const currentStepData = steps[state.currentStep] || { 
    array: array, 
    currentIndex: -1, 
    comparing: [] 
  };

  // Get element color based on state
  const getElementColor = (index: number) => {
    const { currentIndex, minIndex, maxIndex, comparing } = currentStepData;

    if (minIndex === index && maxIndex === index) return 'bg-purple-500'; // Same element is both min and max
    if (minIndex === index) return 'bg-green-500'; // Current minimum
    if (maxIndex === index) return 'bg-red-500'; // Current maximum
    if (currentIndex === index) return 'bg-yellow-500'; // Currently examining
    if (comparing.includes(index)) return 'bg-orange-500'; // Being compared
    
    return 'bg-blue-500'; // Unprocessed
  };

  // Get element text color
  const getElementTextColor = (index: number) => {
    return 'text-white';
  };

  // Get bar height for bar chart visualization
  const getBarHeight = (value: number) => {
    const maxHeight = 200;
    const maxValue = Math.max(...currentStepData.array);
    const minValue = Math.min(...currentStepData.array);
    return ((value - minValue) / (maxValue - minValue)) * maxHeight + 20;
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

      {/* Current Min/Max Display */}
      <div className="mb-6 grid grid-cols-2 gap-4">
        <div className="p-4 bg-green-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <TrendingDown className="w-5 h-5 text-green-600" />
            <span className="font-medium text-green-800">Giá Trị Nhỏ Nhất Hiện Tại:</span>
          </div>
          <div className="text-2xl font-bold text-green-800 mt-1">
            {currentStepData.currentMin !== undefined ? currentStepData.currentMin : '—'}
          </div>
          {currentStepData.minIndex !== undefined && (
            <div className="text-sm text-green-600">tại vị trí {currentStepData.minIndex}</div>
          )}
        </div>

        <div className="p-4 bg-red-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-red-600" />
            <span className="font-medium text-red-800">Giá Trị Lớn Nhất Hiện Tại:</span>
          </div>
          <div className="text-2xl font-bold text-red-800 mt-1">
            {currentStepData.currentMax !== undefined ? currentStepData.currentMax : '—'}
          </div>
          {currentStepData.maxIndex !== undefined && (
            <div className="text-sm text-red-600">tại vị trí {currentStepData.maxIndex}</div>
          )}
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
              min="5"
              max="30"
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
      <div className="relative bg-gray-50 rounded-lg p-4 min-h-[300px]">
        {/* Bar Chart Visualization */}
        <div className="flex items-end justify-center space-x-1 h-[220px] mb-4">
          {currentStepData.array.map((value, index) => (
            <motion.div
              key={index}
              className={`${getElementColor(index)} rounded-t-sm relative transition-colors duration-300`}
              style={{
                width: `${Math.max(400 / currentStepData.array.length - 1, 8)}px`,
                height: `${getBarHeight(value)}px`
              }}
              layout
              transition={{ duration: 0.3 }}
            >
              {/* Value label */}
              <span className="absolute -top-6 left-[20%] text-xs text-gray-600 font-medium">
                {value}
              </span>
              {/* Index label */}
              <span className="absolute -bottom-5 left-[20%] text-xs text-gray-500">
                {index}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Number Array Visualization */}
        <div className="flex flex-wrap justify-center gap-2 mt-4">
          {currentStepData.array.map((value, index) => (
            <motion.div
              key={index}
              className={`
                ${getElementColor(index)} 
                ${getElementTextColor(index)}
                w-12 h-12 rounded-lg flex items-center justify-center
                font-bold text-sm transition-all duration-300
              `}
              layout
              transition={{ duration: 0.3 }}
            >
              {value}
            </motion.div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap justify-center space-x-4 mt-4 text-xs">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span>Unprocessed</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-yellow-500 rounded"></div>
            <span>Current</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-orange-500 rounded"></div>
            <span>Comparing</span>
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
      <div className="mt-4 text-center">
        {state.isPlaying && !state.isPaused && (
          <div className="text-blue-600 text-sm">● Finding extreme values...</div>
        )}
        {state.isPaused && (
          <div className="text-yellow-600 text-sm">⏸ Paused</div>
        )}
        {!state.isPlaying && state.currentStep === steps.length - 1 && steps.length > 0 && (
          <div className="text-green-600 text-sm">
             Complete! Min: {currentStepData.currentMin}, Max: {currentStepData.currentMax}
          </div>
        )}
        {!state.isPlaying && state.currentStep === 0 && steps.length === 0 && (
          <div className="text-gray-500 text-sm">Ready to find extreme values</div>
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
        {algorithm === 'linear-min-max' && (
          <p>Linear Min/Max scans through the array once, keeping track of the smallest and largest values encountered.</p>
        )}
        {algorithm === 'tournament-method' && (
          <p>Tournament Method uses a divide-and-conquer approach, comparing elements in pairs to find min/max values efficiently.</p>
        )}
      </div>
    </div>
  );
}
