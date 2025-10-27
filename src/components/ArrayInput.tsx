'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit3, Check, X } from 'lucide-react';

interface ArrayInputProps {
  onArrayChange: (newArray: number[]) => void;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
  minValue?: number;
  maxValue?: number;
  maxLength?: number;
}

export default function ArrayInput({
  onArrayChange,
  disabled = false,
  className = '',
  placeholder = 'Ví dụ: 45, 23, 78, 12, 56',
  minValue = 1,
  maxValue = 100,
  maxLength = 100
}: ArrayInputProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');

  const handleInputChange = (value: string) => {
    setInputValue(value);
    setError('');
  };

  const validateAndParseArray = (input: string): { valid: boolean; array?: number[]; error?: string } => {
    if (!input.trim()) {
      return { valid: false, error: 'Vui lòng nhập ít nhất một số' };
    }

    // Parse input - support comma, space, or semicolon separation
    const cleanInput = input.replace(/[;،]/g, ','); // Replace semicolons and Arabic commas with commas
    const parts = cleanInput.split(/[,\s]+/).filter(part => part.trim() !== '');

    if (parts.length === 0) {
      return { valid: false, error: 'Vui lòng nhập ít nhất một số' };
    }

    if (parts.length > maxLength) {
      return { valid: false, error: `Mảng không được vượt quá ${maxLength} phần tử` };
    }

    const numbers: number[] = [];
    for (let i = 0; i < parts.length; i++) {
      const num = parseFloat(parts[i]);
      
      if (isNaN(num)) {
        return { valid: false, error: `"${parts[i]}" không phải là số hợp lệ` };
      }

      if (!Number.isInteger(num)) {
        return { valid: false, error: `"${parts[i]}" phải là số nguyên` };
      }

      if (num < minValue || num > maxValue) {
        return { valid: false, error: `Giá trị phải nằm trong khoảng ${minValue}-${maxValue}` };
      }

      numbers.push(num);
    }

    return { valid: true, array: numbers };
  };

  const handleSubmit = () => {
    const result = validateAndParseArray(inputValue);
    
    if (!result.valid) {
      setError(result.error || 'Đầu vào không hợp lệ');
      return;
    }

    if (result.array) {
      onArrayChange(result.array);
      setIsEditing(false);
      setInputValue('');
      setError('');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setInputValue('');
    setError('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <div className={className}>
      {!isEditing ? (
        <button
          onClick={() => setIsEditing(true)}
          disabled={disabled}
          className="btn-secondary flex items-center space-x-2"
          title="Nhập mảng tùy chỉnh"
        >
          <Edit3 className="w-4 h-4" />
          <span>Nhập Mảng</span>
        </button>
      ) : (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3"
          >
            <div>
              <label className="block text-sm font-medium text-blue-900 mb-2">
                Nhập mảng (phân cách bởi dấu phẩy hoặc khoảng trắng):
              </label>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => handleInputChange(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder={placeholder}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  error
                    ? 'border-red-300 focus:ring-red-500 bg-red-50'
                    : 'border-blue-300 focus:ring-blue-500'
                }`}
                autoFocus
              />
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-red-600 mt-1"
                >
                  ⚠ {error}
                </motion.p>
              )}
              <p className="text-xs text-blue-600 mt-1">
                Giá trị từ {minValue} đến {maxValue}, tối đa {maxLength} phần tử
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleSubmit}
                className="btn-primary flex items-center space-x-1 text-sm"
              >
                <Check className="w-4 h-4" />
                <span>Áp Dụng</span>
              </button>
              <button
                onClick={handleCancel}
                className="btn-secondary flex items-center space-x-1 text-sm"
              >
                <X className="w-4 h-4" />
                <span>Hủy</span>
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}

