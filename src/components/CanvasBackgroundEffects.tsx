'use client';

import { useEffect, useRef, useMemo } from 'react';
import { usePerformanceOptimization } from '@/hooks/usePerformanceOptimization';

interface Particle {
  x: number;
  y: number;
  size: number;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  color: {
    r: number;
    g: number;
    b: number;
  };
}

/**
 * Canvas-based Background Effects for better performance
 * Replaces DOM-based Framer Motion animations with Canvas API
 */
export default function CanvasBackgroundEffects() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { isSlowDevice } = usePerformanceOptimization();
  const animationFrameRef = useRef<number>();
  const particlesRef = useRef<Particle[]>([]);

  // Memoize particle settings based on device capability
  const particleSettings = useMemo(() => {
    if (isSlowDevice) {
      return {
        count: 3,
        maxSize: 30,
        minSize: 15,
        speedMultiplier: 0.3,
        opacity: 0.08,
      };
    }
    return {
      count: 6,
      maxSize: 50,
      minSize: 20,
      speedMultiplier: 0.5,
      opacity: 0.15,
    };
  }, [isSlowDevice]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { 
      alpha: true,
      desynchronized: true, // Improve performance
    });
    if (!ctx) return;

    // Setup canvas size
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      
      ctx.scale(dpr, dpr);
      
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
    };
    
    resize();
    window.addEventListener('resize', resize);

    // Initialize particles
    const initParticles = () => {
      particlesRef.current = [];
      const { count, maxSize, minSize, speedMultiplier } = particleSettings;
      
      for (let i = 0; i < count; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.getBoundingClientRect().width,
          y: Math.random() * canvas.getBoundingClientRect().height,
          size: Math.random() * (maxSize - minSize) + minSize,
          vx: (Math.random() - 0.5) * speedMultiplier,
          vy: (Math.random() - 0.5) * speedMultiplier,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.01,
          color: {
            r: 14 + Math.random() * 111, // 14-125 (blue range)
            g: 165 + Math.random() * 46, // 165-211 (cyan-blue range)
            b: 233 + Math.random() * 19, // 233-252 (light blue range)
          },
        });
      }
    };

    initParticles();

    // Animation loop with performance optimization
    let lastFrameTime = performance.now();
    const targetFPS = isSlowDevice ? 30 : 60;
    const frameInterval = 1000 / targetFPS;

    const animate = (currentTime: number) => {
      const deltaTime = currentTime - lastFrameTime;

      // Skip frame if not enough time has passed (throttling)
      if (deltaTime < frameInterval) {
        animationFrameRef.current = requestAnimationFrame(animate);
        return;
      }

      lastFrameTime = currentTime - (deltaTime % frameInterval);

      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      // Update and draw particles
      particlesRef.current.forEach((particle) => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.rotation += particle.rotationSpeed;

        // Bounce off edges with padding
        const padding = particle.size;
        if (particle.x < -padding) particle.x = rect.width + padding;
        if (particle.x > rect.width + padding) particle.x = -padding;
        if (particle.y < -padding) particle.y = rect.height + padding;
        if (particle.y > rect.height + padding) particle.y = -padding;

        // Draw particle with gradient
        ctx.save();
        ctx.translate(particle.x, particle.y);
        ctx.rotate(particle.rotation);

        // Create radial gradient
        const gradient = ctx.createRadialGradient(
          0, 0, 0,
          0, 0, particle.size
        );
        
        const { r, g, b } = particle.color;
        gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${particleSettings.opacity * 1.2})`);
        gradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${particleSettings.opacity * 0.6})`);
        gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(0, 0, particle.size, 0, Math.PI * 2);
        ctx.fill();

        // Add subtle glow effect for high-performance devices
        if (!isSlowDevice) {
          ctx.shadowBlur = 20;
          ctx.shadowColor = `rgba(${r}, ${g}, ${b}, 0.3)`;
        }

        ctx.restore();
      });

      // Draw additional decorative elements (static)
      if (!isSlowDevice) {
        drawDecorativeElements(ctx, rect.width, rect.height);
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    // Cleanup
    return () => {
      window.removeEventListener('resize', resize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isSlowDevice, particleSettings]);

  // Helper function to draw static decorative elements
  const drawDecorativeElements = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number
  ) => {
    // Small decorative circles
    const decorations = [
      { x: width * 0.25, y: height * 0.25, size: 2, opacity: 0.4 },
      { x: width * 0.75, y: height * 0.33, size: 3, opacity: 0.3 },
      { x: width * 0.33, y: height * 0.66, size: 1, opacity: 0.5 },
    ];

    decorations.forEach(({ x, y, size, opacity }) => {
      ctx.fillStyle = `rgba(59, 130, 246, ${opacity})`;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    });
  };

  return (
    <>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ 
          opacity: 0.7,
          mixBlendMode: 'normal',
        }}
      />
      {/* Gradient overlay for depth */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-cyan-50/20 pointer-events-none"
        style={{ opacity: 0.5 }}
      />
    </>
  );
}
