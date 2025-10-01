'use client';

import React, { useEffect, useRef } from 'react';
import katex from 'katex';

interface LaTeXProps {
  formula: string;
  inline?: boolean;
  className?: string;
}

export default function LaTeX({ formula, inline = false, className = '' }: LaTeXProps) {
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (containerRef.current && formula) {
      try {
        // Remove $ signs if present
        const cleanFormula = formula.replace(/^\$+|\$+$/g, '').trim();
        
        // Clear any existing content first
        containerRef.current.innerHTML = '';
        
        // Use renderToString to get HTML string
        const html = katex.renderToString(cleanFormula, {
          throwOnError: false,
          displayMode: false, // Always use inline mode to avoid duplication
        });
        
        // Set the HTML directly - this ensures only KaTeX output is shown
        containerRef.current.innerHTML = html;
      } catch (error) {
        console.error('KaTeX render error:', error);
        // Only show plain text as fallback if error occurs
        if (containerRef.current) {
          containerRef.current.textContent = formula;
        }
      }
    }
  }, [formula, inline]);

  return (
    <span
      ref={containerRef}
      className={`katex-wrapper ${inline ? 'inline-block' : 'block my-2'} ${className}`}
      style={{
        fontSize: inline ? 'inherit' : '1.2rem',
        fontWeight: inline ? 'inherit' : '500'
      }}
    />
  );
}
