'use client';

import { useEffect, useRef } from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-csharp';
import 'prismjs/components/prism-python';

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
}

export default function CodeBlock({ code, language = 'javascript', title }: CodeBlockProps) {
  const codeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (codeRef.current) {
      Prism.highlightElement(codeRef.current);
    }
  }, [code, language]);

  return (
    <div className="bg-gray-900 rounded-lg overflow-hidden shadow-lg">
      {title && (
        <div className="bg-gray-800 px-4 py-2 border-b border-gray-700">
          <h3 className="text-sm font-medium text-gray-200">{title}</h3>
        </div>
      )}
      <div className="relative">
        <pre className="overflow-x-auto p-4 text-sm">
          <code 
            ref={codeRef}
            className={`language-${language} text-gray-100`}
          >
            {code}
          </code>
        </pre>
        
        {/* Copy button */}
        <button
          onClick={() => navigator.clipboard.writeText(code)}
          className="absolute top-2 right-2 bg-gray-700 hover:bg-gray-600 text-gray-300 p-2 rounded transition-colors"
          title="Copy code"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
