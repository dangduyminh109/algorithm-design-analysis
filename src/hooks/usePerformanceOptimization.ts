'use client';

import { useEffect, useRef, useCallback } from 'react';

/**
 * Hook to optimize component performance using various strategies
 */
export function usePerformanceOptimization() {
  const rafRef = useRef<number>();
  const frameTimeRef = useRef(0);
  const isSlowDeviceRef = useRef(false);

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
    };

    detectPerformance();
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

      // Skip frame if device is struggling (> 20ms frame time)
      if (isSlowDeviceRef.current && deltaTime > 20) {
        return;
      }

      callback();
    });
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return {
    requestOptimizedFrame,
    isSlowDevice: isSlowDeviceRef.current,
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
