'use client';

import { memo } from 'react';
import { motion, MotionStyle } from 'framer-motion';

interface OptimizedBarProps {
  value: number;
  height: number;
  width: number;
  color: string;
  isComparing: boolean;
  isSwapping: boolean;
  isSorted: boolean;
  index: number;
}

/**
 * Optimized Bar Component with GPU acceleration
 * Uses CSS transforms instead of layout animations for better performance
 */
const OptimizedBar = memo(({ 
  value, 
  height, 
  width,
  color, 
  isComparing, 
  isSwapping,
  isSorted,
  index 
}: OptimizedBarProps) => {
  
  // GPU-accelerated styles
  const barStyle: MotionStyle = {
    width: `${width}px`,
    height: `${height}px`,
    // Force GPU acceleration
    transform: 'translateZ(0)',
    willChange: 'transform',
    backfaceVisibility: 'hidden',
    WebkitFontSmoothing: 'antialiased',
  };

  // Animation variants for different states
  const animationProps = {
    scale: isComparing ? 1.08 : 1,
    y: isSwapping ? -15 : 0,
  };

  return (
    <motion.div
      className={`${color} rounded-t-sm relative`}
      style={barStyle}
      animate={animationProps}
      transition={{
        type: 'spring',
        stiffness: 500,
        damping: 30,
        mass: 0.5,
      }}
    >
      {/* Value label - only show for smaller arrays or specific states */}
      {(width > 8 || isComparing || isSwapping) && (
        <motion.span 
          className="absolute -top-6 left-0 right-0 text-center text-xs text-gray-700 font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: isComparing || isSwapping ? 1 : 0.7 }}
          transition={{ duration: 0.2 }}
          style={{
            transform: 'translateZ(0)',
            willChange: 'opacity',
          }}
        >
          {value}
        </motion.span>
      )}

      {/* Highlight effect for comparing/swapping */}
      {(isComparing || isSwapping) && (
        <motion.div
          className="absolute inset-0 bg-white rounded-t-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          style={{
            transform: 'translateZ(0)',
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Sorted checkmark indicator for larger bars */}
      {isSorted && width > 15 && (
        <motion.div
          className="absolute top-1 left-0 right-0 flex justify-center"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            type: 'spring',
            stiffness: 400,
            damping: 15,
          }}
        >
          <svg 
            className="w-3 h-3 text-white" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={3} 
              d="M5 13l4 4L19 7" 
            />
          </svg>
        </motion.div>
      )}
    </motion.div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison for React.memo
  // Only re-render if these props actually change
  return (
    prevProps.value === nextProps.value &&
    prevProps.height === nextProps.height &&
    prevProps.width === nextProps.width &&
    prevProps.color === nextProps.color &&
    prevProps.isComparing === nextProps.isComparing &&
    prevProps.isSwapping === nextProps.isSwapping &&
    prevProps.isSorted === nextProps.isSorted &&
    prevProps.index === nextProps.index
  );
});

OptimizedBar.displayName = 'OptimizedBar';

export default OptimizedBar;
