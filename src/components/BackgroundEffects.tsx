'use client';

import { motion } from 'framer-motion';

export default function BackgroundEffects() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Floating geometric shapes */}
      <motion.div 
        className="absolute top-20 left-10 w-32 h-32 rounded-full opacity-15"
        style={{
          background: 'radial-gradient(circle at 30% 30%, rgba(125, 211, 252, 0.6) 0%, rgba(14, 165, 233, 0.3) 100%)'
        }}
        animate={{ 
          y: [0, -30, 0],
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360]
        }}
        transition={{ 
          duration: 8, 
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.div 
        className="absolute top-40 right-20 w-24 h-24 rounded-full opacity-10"
        style={{
          background: 'radial-gradient(circle at 30% 30%, rgba(59, 130, 246, 0.5) 0%, rgba(96, 165, 250, 0.2) 100%)'
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
          background: 'radial-gradient(circle at 30% 30%, rgba(34, 211, 238, 0.6) 0%, rgba(6, 182, 212, 0.3) 100%)'
        }}
        animate={{ 
          x: [0, 40, 0],
          scale: [1, 0.7, 1],
          rotate: [0, 90, 180, 270, 360]
        }}
        transition={{ 
          duration: 12, 
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Additional floating elements */}
      <motion.div 
        className="absolute top-1/3 left-1/2 w-16 h-16 bg-green-200 rounded-full opacity-20"
        animate={{ 
          y: [0, -20, 0],
          x: [0, 20, 0],
          scale: [0.8, 1.3, 0.8]
        }}
        transition={{ 
          duration: 6, 
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <motion.div 
        className="absolute bottom-1/4 right-1/3 w-28 h-28 bg-yellow-200 rounded-full opacity-15"
        animate={{ 
          rotate: [0, 360],
          scale: [1, 1.1, 0.9, 1]
        }}
        transition={{ 
          duration: 15, 
          repeat: Infinity,
          ease: "linear"
        }}
      />

      {/* Animated lines/paths */}
      <svg className="absolute inset-0 w-full h-full opacity-10">
        <motion.path
          d="M0,100 Q150,50 300,100 T600,100"
          stroke="url(#gradient1)"
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.path
          d="M100,200 Q250,150 400,200 T700,200"
          stroke="url(#gradient2)"
          strokeWidth="1.5"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        <defs>
          <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0"/>
            <stop offset="50%" stopColor="#3B82F6" stopOpacity="0.6"/>
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0"/>
          </linearGradient>
          <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0"/>
            <stop offset="50%" stopColor="#8B5CF6" stopOpacity="0.4"/>
            <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0"/>
          </linearGradient>
        </defs>
      </svg>

      {/* Floating particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full opacity-30"
          style={{
            width: `${Math.random() * 6 + 2}px`,
            height: `${Math.random() * 6 + 2}px`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            background: 'radial-gradient(circle, rgba(125, 211, 252, 0.8) 0%, rgba(14, 165, 233, 0.4) 100%)',
            boxShadow: '0 0 8px rgba(125, 211, 252, 0.4)'
          }}
          animate={{
            y: [0, -150, 0],
            opacity: [0, 0.6, 0],
            scale: [0, 1.2, 0]
          }}
          transition={{
            duration: Math.random() * 6 + 4,
            repeat: Infinity,
            delay: Math.random() * 3,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
}
