'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { useCallback, useMemo } from 'react';
import { usePerformanceOptimization } from '@/hooks/usePerformanceOptimization';

interface AnimatedBubbleProps {
  category: {
    id: string;
    name: string;
    icon: LucideIcon;
    title: string;
    description: string;
    features: string[];
    complexity: string;
    color: string;
  };
  position: { x: number; y: number } | string; 
  index: number;
  onHover: (categoryId: string | null) => void;
  onClick: (categoryId: string) => void;
  isPushed?: boolean;
}

export default function AnimatedBubble({ 
  category, 
  position, 
  index, 
  onHover, 
  onClick,
  isPushed = false
}: AnimatedBubbleProps) {
  const IconComponent = category.icon;
  const { isSlowDevice } = usePerformanceOptimization();

  // Optimize animation settings based on device capability
  const animationSettings = useMemo(() => {
    const baseSettings = {
      duration: isSlowDevice ? 0.8 : 1.2,
      delay: isSlowDevice ? index * 0.15 : index * 0.3,
      type: isSlowDevice ? "tween" : "spring",
      stiffness: isSlowDevice ? 80 : 100,
      damping: isSlowDevice ? 15 : 12,
    };

    return baseSettings;
  }, [isSlowDevice, index]);

  // Memoized position style calculation with GPU acceleration
  const positionStyle = useMemo(() => {
    if (typeof position === 'object') {
      return {
        position: 'absolute' as const,
        transform: 'translate(-50%, -50%) translateZ(0)',
        willChange: 'transform, left, top',
        backfaceVisibility: 'hidden' as const,
        WebkitFontSmoothing: 'antialiased' as const,
      };
    }
    return {
      transform: 'translateZ(0)',
      willChange: 'transform',
      backfaceVisibility: 'hidden' as const,
      WebkitFontSmoothing: 'antialiased' as const,
    };
  }, [position]);

  // Optimized hover handlers
  const handleMouseEnter = useCallback(() => {
    onHover(category.id);
  }, [onHover, category.id]);

  const handleMouseLeave = useCallback(() => {
    onHover(null);
  }, [onHover]);

  const handleClick = useCallback(() => {
    onClick(category.id);
  }, [onClick, category.id]);

  return (
    <motion.div
      className={typeof position === 'string' ? `absolute cursor-pointer ${position}` : 'cursor-pointer'}
      style={positionStyle}
      initial={{ 
        opacity: 0, 
        scale: 0,
        x: isSlowDevice ? 50 : 100,
        rotate: isSlowDevice ? -90 : -180,
        // Set initial position for coordinate-based positioning
        ...(typeof position === 'object' && {
          left: `${position.x}px`,
          top: `${position.y}px`
        })
      }}
      animate={{ 
        opacity: 1, 
        scale: isPushed ? 0.8 : 1,
        x: 0,
        rotate: 0,
        // Add smooth position animation for coordinate-based positioning
        ...(typeof position === 'object' && {
          left: `${position.x}px`,
          top: `${position.y}px`
        })
      }}
      transition={{ 
        duration: animationSettings.duration, 
        delay: animationSettings.delay,
        type: animationSettings.type,
        stiffness: animationSettings.stiffness,
        damping: animationSettings.damping,
        scale: { 
          duration: isPushed ? 0.3 : 0.5, 
          ease: "easeInOut",
          type: animationSettings.type,
          stiffness: isPushed ? 130 : animationSettings.stiffness,
          damping: isPushed ? 18 : animationSettings.damping
        },
        // Optimized position transitions
        left: { 
          duration: isSlowDevice ? 0.5 : 0.8, 
          ease: "easeInOut",
          type: animationSettings.type,
          stiffness: isSlowDevice ? 60 : 80,
          damping: 15
        },
        top: { 
          duration: isSlowDevice ? 0.5 : 0.8, 
          ease: "easeInOut",
          type: animationSettings.type,
          stiffness: isSlowDevice ? 60 : 80,
          damping: 15
        }
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      whileHover={{ 
        scale: 1.15,
        rotate: [0, -8, 8, 0],
        transition: { 
          duration: isSlowDevice ? 0.3 : 0.5,
          rotate: { 
            duration: isSlowDevice ? 0.5 : 0.8, 
            ease: "easeInOut" 
          }
        }
      }}
      whileTap={{ 
        scale: 0.85,
        rotate: 20,
        transition: { duration: 0.15 }
      }}
    >
      <motion.div 
        className={`
          relative w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 rounded-full 
          bg-gradient-to-br ${category.color}
          shadow-2xl hover:shadow-3xl
          flex items-center justify-center
          text-white
          border border-white/30
          backdrop-blur-md
          overflow-hidden
          group
        `}
        style={{
          background: `
            radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.4) 0%, transparent 50%),
            linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.05) 100%),
            linear-gradient(135deg, #7dd3fc 0%, #0ea5e9 100%)
          `,
          boxShadow: `
            0 8px 32px rgba(59, 130, 246, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.5),
            inset 0 -1px 0 rgba(255, 255, 255, 0.1)
          `,
          filter: 'drop-shadow(0 25px 50px rgba(59, 130, 246, 0.2))'
        }}
        animate={{
          y: [0, -8, 0],
        }}
        transition={{
          duration: 3 + index * 0.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {/* Icon and Name */}
        <div className="text-center z-20 relative">
          <div>
            <IconComponent className="w-8 h-8 sm:w-10 sm:h-10 lg:w-14 lg:h-14 mb-1 sm:mb-2 mx-auto drop-shadow-lg" />
          </div>
          <span className="text-sm sm:text-base lg:text-lg font-bold drop-shadow-md tracking-wide">
            {category.name}
          </span>
        </div>

        {/* Animated glow effect */}
        <motion.div 
          className="absolute inset-0 rounded-full opacity-40"
          style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(125, 211, 252, 0.6) 0%, transparent 70%)'
          }}
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Glass highlight effect */}
        <div 
          className="absolute top-3 left-3 w-12 h-12 rounded-full opacity-60"
          style={{
            background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.2) 50%, transparent 100%)'
          }}
        />

        {/* Secondary highlight */}
        <div 
          className="absolute top-6 right-8 w-6 h-6 rounded-full opacity-40"
          style={{
            background: 'radial-gradient(circle, rgba(255, 255, 255, 0.6) 0%, transparent 70%)'
          }}
        />

        {/* Bottom reflection */}
        <div 
          className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-20 h-4 rounded-full opacity-20"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.4) 50%, transparent 100%)'
          }}
        />

        {/* Ripple effect on hover */}
        <motion.div 
          className="absolute inset-0 rounded-full bg-white"
          initial={{ opacity: 0, scale: 0 }}
          whileHover={{
            opacity: [0, 0.2, 0],
            scale: [1, 1.4, 1.8],
          }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />

        {/* Inner shine effect */}
        <motion.div
          className="absolute top-8 left-8 w-3 h-3 rounded-full opacity-80"
          style={{
            background: 'radial-gradient(circle, rgba(255, 255, 255, 0.9) 0%, transparent 70%)'
          }}
          animate={{
            x: [0, 8, 0],
            y: [0, 4, 0],
            opacity: [0.6, 0.9, 0.6],
            scale: [0.8, 1.2, 0.8]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.div>

      {/* Floating particles around bubble */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full opacity-60"
            style={{
              width: `${Math.random() * 8 + 4}px`,
              height: `${Math.random() * 8 + 4}px`,
              top: `${15 + i * 15}%`,
              left: `${10 + i * 15}%`,
              background: 'radial-gradient(circle, rgba(125, 211, 252, 0.8) 0%, rgba(14, 165, 233, 0.4) 100%)',
              boxShadow: '0 0 10px rgba(125, 211, 252, 0.5)'
            }}
            animate={{
              y: [0, -25, 0],
              x: [0, Math.sin(i) * 20, 0],
              opacity: [0.3, 0.8, 0.3],
              scale: [0.6, 1.2, 0.6]
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: i * 0.4,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Orbital particles */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{ rotate: 360 }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      >
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: '6px',
              height: '6px',
              top: `${50 + Math.sin((i * Math.PI * 2) / 4) * 50}%`,
              left: `${50 + Math.cos((i * Math.PI * 2) / 4) * 50}%`,
              background: 'radial-gradient(circle, rgba(255, 255, 255, 0.8) 0%, rgba(125, 211, 252, 0.6) 100%)',
              boxShadow: '0 0 8px rgba(125, 211, 252, 0.6)'
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.75,
              ease: "easeInOut"
            }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
}
