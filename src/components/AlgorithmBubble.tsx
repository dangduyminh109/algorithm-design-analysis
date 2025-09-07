'use client';

import { motion } from 'framer-motion';
import { Algorithm } from '@/types/algorithm';

interface AlgorithmBubbleProps {
  algorithm: Algorithm;
  position: { x: number; y: number } | string; // Support both coordinate system and legacy string
  index: number;
  onHover: (algorithm: Algorithm | null) => void;
  onClick: (algorithmId: string) => void;
  parentPosition: { x: number; y: number };
}

export default function AlgorithmBubble({
  algorithm,
  position,
  index,
  onHover,
  onClick,
  parentPosition
}: AlgorithmBubbleProps) {
  const bubbleStyle = {
    background: `
      radial-gradient(circle at 30% 20%, rgba(147, 197, 253, 0.9) 0%, transparent 50%),
      radial-gradient(circle at 70% 80%, rgba(191, 219, 254, 0.7) 0%, transparent 50%),
      linear-gradient(135deg, rgba(219, 234, 254, 0.95) 0%, rgba(147, 197, 253, 0.8) 100%)
    `,
    backdropFilter: 'blur(15px)',
    border: '2px solid rgba(147, 197, 253, 0.4)',
    boxShadow: `
      inset 0 2px 4px rgba(255, 255, 255, 0.7),
      inset 0 -2px 4px rgba(147, 197, 253, 0.3),
      0 8px 25px rgba(59, 130, 246, 0.2),
      0 4px 10px rgba(59, 130, 246, 0.15)
    `,
  };

  // Calculate the offset from parent center to bubble final position
  const getInitialOffset = () => {
    // If position is coordinate object, return zero offset (already positioned)
    if (typeof position === 'object') {
      return { x: 0, y: 0 };
    }
    
    // Parse position classes to determine direction (legacy support)
    if (position.includes('top-')) return { x: 0, y: 40 }; // Start from center, move up
    if (position.includes('bottom-')) return { x: 0, y: -40 }; // Start from center, move down
    if (position.includes('left-')) return { x: 40, y: 0 }; // Start from center, move left
    if (position.includes('right-')) return { x: -40, y: 0 }; // Start from center, move right
    return { x: 0, y: 0 }; // Default center
  };

  const initialOffset = getInitialOffset();

  // Get positioning style
  const getPositionStyle = () => {
    if (typeof position === 'object') {
      return {
        position: 'absolute' as const,
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'translate(-50%, -50%)' // Center the bubble on the coordinate
      };
    }
    return {}; // Use className for legacy string positions
  };

  const positionStyle = getPositionStyle();

  return (
    <motion.div
      className={typeof position === 'string' ? `absolute cursor-pointer ${position}` : 'cursor-pointer'}
      style={{
        ...positionStyle,
        filter: 'drop-shadow(0 0 15px rgba(59, 130, 246, 0.3))'
      }}
      initial={{ 
        opacity: 0, 
        scale: 0.3, // Start smaller
        x: initialOffset.x, // Start from calculated offset (towards parent center)
        y: initialOffset.y, // Start from calculated offset (towards parent center)
        rotate: 0
      }}
      animate={{ 
        opacity: 1, 
        scale: 1,
        x: 0,
        y: 0,
        rotate: 0
      }}
      exit={{ 
        opacity: 0, 
        scale: 0.2,
        x: initialOffset.x, // Return towards parent center when exiting
        y: initialOffset.y, // Return towards parent center when exiting
        rotate: 180,
        transition: {
          duration: 0.5,
          type: "spring",
          stiffness: 150,
          damping: 20
        }
      }}
      transition={{ 
        duration: 0.8, 
        delay: 0.3 + index * 0.15, // Staggered appearance
        type: "spring",
        stiffness: 120,
        damping: 12,
        // Different easing for different properties
        opacity: { duration: 0.4, delay: 0.3 + index * 0.15 },
        scale: { 
          duration: 0.6, 
          delay: 0.3 + index * 0.15,
          type: "spring",
          stiffness: 200,
          damping: 15
        },
        // Smooth movement from center to final position
        x: { 
          duration: 0.8, 
          delay: 0.4 + index * 0.15,
          type: "spring",
          stiffness: 100,
          damping: 20
        },
        y: { 
          duration: 0.8, 
          delay: 0.4 + index * 0.15,
          type: "spring",
          stiffness: 100,
          damping: 20
        }
      }}
      whileHover={{ 
        scale: 1.15,
        rotate: [0, -3, 3, 0],
        transition: { duration: 0.4 }
      }}
      whileTap={{ scale: 0.9 }}
      onMouseEnter={() => onHover(algorithm)}
      onMouseLeave={() => onHover(null)}
      onClick={() => onClick(algorithm.id)}
    >
      {/* Main bubble with glass effect - larger for better visibility */}
      <motion.div
        className="relative w-28 h-28 rounded-full flex flex-col items-center justify-center overflow-hidden z-30"
        style={bubbleStyle}
        animate={{
          y: [0, -6, 0],
        }}
        transition={{
          duration: 3 + index * 0.4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: index * 0.2
        }}
      >
        {/* Orbital particles with connection awareness */}
        {[...Array(4)].map((_, i) => {
          const angle = (i * 360) / 4;
          return (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 bg-blue-400 rounded-full"
              style={{
                left: '50%',
                top: '50%',
              }}
              animate={{
                x: [
                  0,
                  Math.cos((angle * Math.PI) / 180) * 32,
                  Math.cos(((angle + 180) * Math.PI) / 180) * 32,
                  0
                ],
                y: [
                  0,
                  Math.sin((angle * Math.PI) / 180) * 32,
                  Math.sin(((angle + 180) * Math.PI) / 180) * 32,
                  0
                ],
                opacity: [0.7, 1, 0.7],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                delay: i * 0.4 + index * 0.1,
                ease: "linear",
              }}
            />
          );
        })}

        {/* Central floating particles - fewer for less crowding */}
        {[...Array(2)].map((_, i) => (
          <motion.div
            key={`center-${i}`}
            className="absolute w-1 h-1 bg-blue-300 rounded-full"
            animate={{
              x: [0, Math.random() * 32 - 16, 0],
              y: [0, Math.random() * 32 - 16, 0],
              opacity: [0.5, 1, 0.5],
              scale: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 2.5 + Math.random() * 1.5,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
            style={{
              left: `${45 + Math.random() * 10}%`,
              top: `${45 + Math.random() * 10}%`,
            }}
          />
        ))}

        {/* Algorithm name - larger font for better visibility */}
        <motion.div 
          className="text-base font-medium text-blue-700 text-center leading-tight px-2 z-10"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 + index * 0.2 }}
        >
          {algorithm.name.length > 16 ? `${algorithm.name.slice(0, 16)}...` : algorithm.name}
        </motion.div>

        {/* Animated glow effect similar to main bubble */}
        <motion.div 
          className="absolute inset-0 rounded-full opacity-40"
          style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(147, 197, 253, 0.6) 0%, transparent 70%)'
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

        {/* Additional glass highlights like main bubble */}
        <div 
          className="absolute top-2 left-2 w-6 h-6 rounded-full opacity-60"
          style={{
            background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.2) 50%, transparent 100%)'
          }}
        />

        {/* Secondary highlight */}
        <div 
          className="absolute top-3 right-4 w-3 h-3 rounded-full opacity-40"
          style={{
            background: 'radial-gradient(circle, rgba(255, 255, 255, 0.6) 0%, transparent 70%)'
          }}
        />

        {/* Bottom reflection */}
        <div 
          className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-12 h-2 rounded-full opacity-20"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.4) 50%, transparent 100%)'
          }}
        />

        {/* Glass highlight effect like parent */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.6) 0%, transparent 50%)',
          }}
          animate={{
            opacity: [0.7, 1, 0.7],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Inner shine effect like main bubble */}
        <motion.div
          className="absolute top-4 left-4 w-2 h-2 rounded-full opacity-80"
          style={{
            background: 'radial-gradient(circle, rgba(255, 255, 255, 0.9) 0%, transparent 70%)'
          }}
          animate={{
            x: [0, 4, 0],
            y: [0, 2, 0],
            opacity: [0.6, 0.9, 0.6],
            scale: [0.8, 1.2, 0.8]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Enhanced ripple effect on hover similar to main bubble */}
        <motion.div 
          className="absolute inset-0 rounded-full bg-white"
          initial={{ opacity: 0, scale: 0 }}
          whileHover={{
            opacity: [0, 0.2, 0],
            scale: [1, 1.3, 1.6],
          }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />

        {/* Continuous ripple effect */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-blue-300 opacity-0"
          animate={{
            scale: [1, 1.4, 1.8],
            opacity: [0, 0.4, 0],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            delay: index * 0.5,
          }}
        />
      </motion.div>

      {/* Enhanced ambient glow effect */}
      <motion.div
        className="absolute inset-0 rounded-full opacity-0"
        style={{
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, transparent 60%)',
          filter: 'blur(20px)',
          transform: 'scale(2.5)',
        }}
        animate={{
          opacity: [0, 0.4, 0],
          scale: [2, 2.5, 2],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          delay: index * 0.7,
          ease: "easeInOut"
        }}
      />
    </motion.div>
  );
}
