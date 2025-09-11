'use client';

import { motion, AnimatePresence, MotionConfig } from 'framer-motion';
import { ReactNode, useMemo } from 'react';
import { usePerformanceOptimization } from '@/hooks/usePerformanceOptimization';

interface OptimizedAnimationProps {
  children: ReactNode;
  type?: 'slide' | 'fade' | 'scale' | 'bounce';
  duration?: number;
  delay?: number;
  reducedMotion?: boolean;
  className?: string;
}

// Predefined animation variants for better performance
const animationVariants = {
  slide: {
    initial: { x: -50, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: 50, opacity: 0 },
  },
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  scale: {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.8, opacity: 0 },
  },
  bounce: {
    initial: { y: -20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: 20, opacity: 0 },
  },
};

export default function OptimizedAnimation({
  children,
  type = 'fade',
  duration = 0.5,
  delay = 0,
  reducedMotion = false,
  className = '',
}: OptimizedAnimationProps) {
  const { isSlowDevice } = usePerformanceOptimization();

  // Optimize settings based on device capability
  const optimizedSettings = useMemo(() => {
    const shouldReduceMotion = reducedMotion || isSlowDevice;
    
    return {
      duration: shouldReduceMotion ? duration * 0.5 : duration,
      ease: shouldReduceMotion ? 'linear' : 'easeOut',
      type: shouldReduceMotion ? 'tween' : 'spring',
      bounce: shouldReduceMotion ? 0 : 0.3,
    };
  }, [reducedMotion, isSlowDevice, duration]);

  const variants = animationVariants[type];

  return (
    <MotionConfig
      transition={{
        duration: optimizedSettings.duration,
        ease: optimizedSettings.ease,
        type: optimizedSettings.type,
        bounce: optimizedSettings.bounce,
      }}
    >
      <motion.div
        className={className}
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{
          delay,
          ...optimizedSettings,
        }}
        // Performance optimizations
        style={{
          willChange: 'transform, opacity',
          backfaceVisibility: 'hidden',
          transform: 'translateZ(0)',
        }}
      >
        {children}
      </motion.div>
    </MotionConfig>
  );
}

// Optimized AnimatePresence wrapper
interface OptimizedAnimatePresenceProps {
  children: ReactNode;
  mode?: 'wait' | 'sync' | 'popLayout';
  presenceAffectsLayout?: boolean;
}

export function OptimizedAnimatePresence({
  children,
  mode = 'wait',
  presenceAffectsLayout = false,
}: OptimizedAnimatePresenceProps) {
  return (
    <AnimatePresence
      mode={mode}
      presenceAffectsLayout={presenceAffectsLayout}
    >
      {children}
    </AnimatePresence>
  );
}

// Memoized motion components for better performance
export const OptimizedMotionDiv = motion.div;
export const OptimizedMotionSpan = motion.span;
export const OptimizedMotionButton = motion.button;
