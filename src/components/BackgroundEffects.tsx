'use client';

import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { usePerformanceOptimization } from '@/hooks/usePerformanceOptimization';

export default function BackgroundEffects() {
  const { isSlowDevice } = usePerformanceOptimization();

  // Optimize animation settings based on device performance
  const animationSettings = useMemo(() => {
    if (isSlowDevice) {
      return {
        particleCount: 3, // Reduced particle count
        animationDuration: 12, // Slower animations
        reducedOpacity: 0.05, // Lower opacity
        enableComplex: false, // Disable complex animations
      };
    }
    return {
      particleCount: 6,
      animationDuration: 8,
      reducedOpacity: 0.15,
      enableComplex: true,
    };
  }, [isSlowDevice]);

  // Memoized particle data to prevent recalculation
  const particles = useMemo(() => {
    const particleData = [];
    for (let i = 0; i < animationSettings.particleCount; i++) {
      particleData.push({
        id: i,
        size: Math.random() * 40 + 20,
        x: Math.random() * 100,
        y: Math.random() * 100,
        duration: animationSettings.animationDuration + Math.random() * 4,
        delay: Math.random() * 2,
      });
    }
    return particleData;
  }, [animationSettings.particleCount, animationSettings.animationDuration]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Optimized floating geometric shapes */}
      {particles.map((particle) => (
        <motion.div 
          key={particle.id}
          className="absolute rounded-full"
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            opacity: animationSettings.reducedOpacity,
            background: `radial-gradient(circle at 30% 30%, rgba(125, 211, 252, 0.6) 0%, rgba(14, 165, 233, 0.3) 100%)`,
            willChange: 'transform',
            backfaceVisibility: 'hidden',
          }}
          animate={animationSettings.enableComplex ? { 
            y: [0, -30, 0],
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360]
          } : {
            y: [0, -15, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ 
            duration: particle.duration, 
            repeat: Infinity,
            ease: "easeInOut",
            delay: particle.delay,
          }}
        />
      ))}

      {/* Simplified gradient overlay for low-end devices */}
      {!isSlowDevice && (
        <>
          <motion.div 
            className="absolute top-40 right-20 w-24 h-24 rounded-full opacity-10"
            style={{
              background: 'radial-gradient(circle at 30% 30%, rgba(59, 130, 246, 0.5) 0%, rgba(96, 165, 250, 0.2) 100%)',
              willChange: 'transform',
            }}
            animate={{ 
              y: [0, 25, 0],
              x: [0, -15, 0],
              rotate: [0, -180, -360]
            }}
            transition={{ 
              duration: 10, 
              repeat: Infinity,
              ease: "linear"
            }}
          />
          
          <motion.div 
            className="absolute bottom-32 left-1/4 w-20 h-20 rounded-full opacity-20"
            style={{
              background: 'radial-gradient(circle at 30% 30%, rgba(34, 211, 238, 0.6) 0%, rgba(6, 182, 212, 0.3) 100%)',
              willChange: 'transform',
            }}
            animate={{ 
              x: [0, 40, 0],
              scale: [1, 0.7, 1],
            }}
            transition={{ 
              duration: 12, 
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </>
      )}

      {/* Simplified animated elements for all devices */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-cyan-50/20 pointer-events-none" />
      
      {/* Static decorative elements for performance */}
      <div className="absolute top-1/4 right-1/3 w-2 h-2 bg-blue-300/40 rounded-full" />
      <div className="absolute bottom-1/3 left-1/4 w-1 h-1 bg-cyan-400/50 rounded-full" />
      <div className="absolute top-2/3 right-1/4 w-3 h-3 bg-blue-200/30 rounded-full" />
    </div>
  );
}
