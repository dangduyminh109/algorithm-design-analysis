'use client';

import { useEffect, useRef, useCallback, useState } from 'react';

/**
 * Hook to optimize component performance using various strategies
 * Enhanced with FPS monitoring and dynamic quality adjustment
 */
export function usePerformanceOptimization() {
  const rafRef = useRef<number>();
  const frameTimeRef = useRef(0);
  const isSlowDeviceRef = useRef(false);
  const [fps, setFps] = useState(60);
  const [deviceTier, setDeviceTier] = useState<'high' | 'mid' | 'low'>('mid');
  
  const frameCountRef = useRef(0);
  const lastFpsUpdateRef = useRef(performance.now());

  // Detect device performance capabilities
  useEffect(() => {
    const detectPerformance = () => {
      // Check device memory (if available)
      const deviceMemory = (navigator as any).deviceMemory;
      const hardwareConcurrency = navigator.hardwareConcurrency || 2;
      
      // Check connection speed
      const connection = (navigator as any).connection;
      const effectiveType = connection?.effectiveType;
      
      // Determine if device is slow
      isSlowDeviceRef.current = 
        (deviceMemory && deviceMemory < 4) ||
        hardwareConcurrency < 4 ||
        effectiveType === 'slow-2g' ||
        effectiveType === '2g';
      
      // Set initial device tier
      if (deviceMemory >= 8 && hardwareConcurrency >= 8) {
        setDeviceTier('high');
      } else if (deviceMemory >= 4 && hardwareConcurrency >= 4) {
        setDeviceTier('mid');
      } else {
        setDeviceTier('low');
      }
    };

    detectPerformance();
  }, []);

  // Real-time FPS monitoring
  useEffect(() => {
    const measureFps = (currentTime: number) => {
      frameCountRef.current++;
      
      const timeSinceLastUpdate = currentTime - lastFpsUpdateRef.current;
      
      // Update FPS every second
      if (timeSinceLastUpdate >= 1000) {
        const currentFps = Math.round((frameCountRef.current * 1000) / timeSinceLastUpdate);
        setFps(currentFps);
        
        // Dynamic tier adjustment based on actual FPS
        if (currentFps > 55) {
          setDeviceTier('high');
        } else if (currentFps > 40) {
          setDeviceTier('mid');
        } else {
          setDeviceTier('low');
        }
        
        frameCountRef.current = 0;
        lastFpsUpdateRef.current = currentTime;
      }
      
      rafRef.current = requestAnimationFrame(measureFps);
    };
    
    rafRef.current = requestAnimationFrame(measureFps);
    
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  // Optimized RAF with frame timing
  const requestOptimizedFrame = useCallback((callback: () => void) => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    rafRef.current = requestAnimationFrame((time) => {
      // Calculate frame time
      const deltaTime = time - frameTimeRef.current;
      frameTimeRef.current = time;

      // Skip frame if device is struggling (> 20ms frame time = <50 FPS)
      if (isSlowDeviceRef.current && deltaTime > 20) {
        return;
      }

      callback();
    });
  }, []);

  return {
    requestOptimizedFrame,
    isSlowDevice: isSlowDeviceRef.current,
    fps,
    deviceTier,
  };
}

/**
 * Hook for optimized array virtualization
 */
export function useVirtualization(itemCount: number, itemHeight: number, containerHeight: number) {
  const visibleStart = useRef(0);
  const visibleEnd = useRef(Math.ceil(containerHeight / itemHeight));

  const updateVisibleRange = useCallback((scrollTop: number) => {
    const start = Math.floor(scrollTop / itemHeight);
    const end = Math.min(
      itemCount - 1,
      start + Math.ceil(containerHeight / itemHeight) + 1
    );

    visibleStart.current = start;
    visibleEnd.current = end;
  }, [itemCount, itemHeight, containerHeight]);

  return {
    visibleStart: visibleStart.current,
    visibleEnd: visibleEnd.current,
    updateVisibleRange,
  };
}

/**
 * Hook for debounced animations
 */
export function useAnimationDebounce(delay: number = 16) {
  const timeoutRef = useRef<NodeJS.Timeout>();

  const debouncedAnimate = useCallback((callback: () => void) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(callback, delay);
  }, [delay]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedAnimate;
}

/**
 * Hook for throttled function calls
 * Limits execution to once per specified delay
 */
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number = 16
): T {
  const lastRunRef = useRef(Date.now());
  const timeoutRef = useRef<NodeJS.Timeout>();

  const throttledFunction = useCallback((...args: Parameters<T>) => {
    const now = Date.now();
    const timeSinceLastRun = now - lastRunRef.current;

    if (timeSinceLastRun >= delay) {
      lastRunRef.current = now;
      callback(...args);
    } else {
      // Schedule for next available slot
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = setTimeout(() => {
        lastRunRef.current = Date.now();
        callback(...args);
      }, delay - timeSinceLastRun);
    }
  }, [callback, delay]) as T;

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return throttledFunction;
}

/**
 * Hook for intersection observer with performance optimization
 */
export function useIntersectionObserver(
  elementRef: React.RefObject<Element>,
  callback: (isIntersecting: boolean) => void,
  options?: IntersectionObserverInit
) {
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        callback(entry.isIntersecting);
      },
      {
        rootMargin: '50px',
        threshold: 0.1,
        ...options,
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [elementRef, callback, options]);
}
