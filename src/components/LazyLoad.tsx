'use client';

import { lazy, Suspense, ComponentType, ReactNode } from 'react';
import { motion } from 'framer-motion';

interface LazyLoadProps {
  children: ReactNode;
  fallback?: ReactNode;
  className?: string;
}

// Loading skeleton component
const LoadingSkeleton = ({ className = '' }: { className?: string }) => (
  <motion.div 
    className={`animate-pulse bg-gray-200 rounded-lg ${className}`}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.3 }}
  >
    <div className="h-full w-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg">
      <motion.div
        className="h-full w-full bg-gradient-to-r from-transparent via-white/50 to-transparent"
        animate={{ x: [-100, 100] }}
        transition={{ 
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  </motion.div>
);

// Generic lazy wrapper component
export default function LazyLoad({ children, fallback, className = '' }: LazyLoadProps) {
  return (
    <Suspense fallback={fallback || <LoadingSkeleton className={className} />}>
      {children}
    </Suspense>
  );
}

// Higher-order component for lazy loading
export function withLazyLoading<P extends object>(
  Component: ComponentType<P>,
  fallbackComponent?: ComponentType
) {
  const LazyComponent = lazy(() => 
    Promise.resolve({ default: Component })
  );

  const WrappedComponent = (props: P) => {
    const FallbackComponent = fallbackComponent;
    return (
      <Suspense fallback={FallbackComponent ? <FallbackComponent /> : <LoadingSkeleton />}>
        <LazyComponent {...(props as any)} />
      </Suspense>
    );
  };

  WrappedComponent.displayName = `LazyLoaded(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
}

// Specific loading components for different algorithm visualizers
export const SortingVisualizerSkeleton = () => (
  <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
    <div className="flex items-center justify-between">
      <div className="flex space-x-2">
        <LoadingSkeleton className="w-10 h-10 rounded" />
        <LoadingSkeleton className="w-10 h-10 rounded" />
        <LoadingSkeleton className="w-10 h-10 rounded" />
      </div>
      <LoadingSkeleton className="w-24 h-8 rounded" />
    </div>
    <LoadingSkeleton className="w-full h-4 rounded" />
    <div className="flex items-end space-x-1 h-64">
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i} 
          className="flex-1 rounded-t"
          style={{ height: `${Math.random() * 100 + 20}%` }}
        >
          <LoadingSkeleton className="w-full h-full" />
        </div>
      ))}
    </div>
  </div>
);

export const AlgorithmInfoSkeleton = () => (
  <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
    <LoadingSkeleton className="w-3/4 h-8 rounded" />
    <LoadingSkeleton className="w-full h-4 rounded" />
    <LoadingSkeleton className="w-full h-4 rounded" />
    <LoadingSkeleton className="w-2/3 h-4 rounded" />
    <div className="space-y-2 mt-4">
      <LoadingSkeleton className="w-1/2 h-6 rounded" />
      <LoadingSkeleton className="w-full h-32 rounded" />
    </div>
  </div>
);

// Lazy load algorithm components
export const LazySortingVisualizer = lazy(() => 
  import('./SortingVisualizer').then(module => ({ default: module.default }))
);

export const LazySearchingVisualizer = lazy(() => 
  import('./SearchingVisualizer').then(module => ({ default: module.default }))
);

export const LazyExtremeValueVisualizer = lazy(() => 
  import('./ExtremeValueVisualizer').then(module => ({ default: module.default }))
);

export const LazyAlgorithmInfo = lazy(() => 
  import('./AlgorithmInfo').then(module => ({ default: module.default }))
);

export const LazyCodeBlock = lazy(() => 
  import('./CodeBlock').then(module => ({ default: module.default }))
);
