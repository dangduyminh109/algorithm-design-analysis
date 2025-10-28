'use client';

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FlaskConical, ChevronDown } from 'lucide-react';
import { TestCaseType } from '@/lib/testCases';

interface TestCaseSelectorProps {
  onSelectTestCase: (type: TestCaseType) => void;
  disabled?: boolean;
  testCases: {
    best: { name: string; description: string; generate: (size: number) => number[] };
    average: { name: string; description: string; generate: (size: number) => number[] };
    worst: { name: string; description: string; generate: (size: number) => number[] };
  };
}

export default function TestCaseSelector({
  onSelectTestCase,
  disabled = false,
  testCases
}: TestCaseSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Update dropdown position when opening
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      const dropdownHeight = 350;

      // Open upward if not enough space below
      const shouldOpenUpward = spaceBelow < dropdownHeight && spaceAbove > spaceBelow;
      setOpenUpward(shouldOpenUpward);

      // Calculate position
      setDropdownPosition({
        top: shouldOpenUpward ? rect.top - 8 : rect.bottom + 8,
        left: rect.left
      });
    }
  }, [isOpen]);

  const handleSelect = (type: TestCaseType) => {
    onSelectTestCase(type);
    setIsOpen(false);
  };

  const testCaseOptions: Array<{ type: TestCaseType; label: string; color: string }> = [
    { type: 'best', label: 'Tốt Nhất', color: 'bg-green-500' },
    { type: 'average', label: 'Trung Bình', color: 'bg-yellow-500' },
    { type: 'worst', label: 'Xấu Nhất', color: 'bg-red-500' }
  ];

  const renderDropdown = () => {
    if (typeof window === 'undefined') return null;

    return createPortal(
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop to close dropdown */}
            <div
              className="fixed inset-0 z-[9998]"
              onClick={() => setIsOpen(false)}
            />

            {/* Dropdown menu */}
            <motion.div
              initial={{ opacity: 0, y: openUpward ? 10 : -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: openUpward ? 10 : -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="fixed w-80 bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden z-[9999]"
              style={{
                top: openUpward ? 'auto' : `${dropdownPosition.top}px`,
                bottom: openUpward ? `${window.innerHeight - dropdownPosition.top}px` : 'auto',
                left: `${dropdownPosition.left}px`,
                maxHeight: '350px',
                overflowY: 'auto'
              }}
            >
              {testCaseOptions.map((option) => {
                const caseData = testCases[option.type];
                const arraySize = caseData.generate(0).length; // Get actual array size
                return (
                  <button
                    key={option.type}
                    onClick={() => handleSelect(option.type)}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`w-3 h-3 rounded-full ${option.color} mt-1 flex-shrink-0`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-gray-900">{option.label}</span>
                          <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                            Kích thước: {arraySize}
                          </span>
                        </div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-500">{caseData.name}</span>
                        </div>
                        <p className="text-xs text-gray-600 leading-relaxed">
                          {caseData.description}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}

              {/* Info footer */}
              <div className="px-4 py-2 bg-blue-50 border-t border-blue-100">
                <p className="text-xs text-blue-700">
                  💡 Chọn test case để xem thuật toán hoạt động trong các tình huống khác nhau
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>,
      document.body
    );
  };

  return (
    <>
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className="btn-secondary flex items-center space-x-2"
        title="Chọn test case"
      >
        <FlaskConical className="w-4 h-4" />
        <span>Test Case</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {renderDropdown()}
    </>
  );
}

