'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  X, 
  BookOpen, 
  TrendingUp,
  Zap,
  CheckCircle,
  XCircle,
  Info
} from 'lucide-react';
import Link from 'next/link';
import { AlgorithmTheory } from '@/types/theory';
import { getAllTheories, searchTheories, getTheoriesByCategory } from '@/lib/theoryDatabase';
import LaTeX from '@/components/LaTeX';
import Header from '@/components/Header';

export default function TheoryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTheory, setSelectedTheory] = useState<AlgorithmTheory | null>(null);
  const [selectedForComparison, setSelectedForComparison] = useState<Set<string>>(new Set());
  const [showComparison, setShowComparison] = useState(false);

  const allTheories = useMemo(() => getAllTheories(), []);

  const filteredTheories = useMemo(() => {
    let theories = allTheories;

    if (selectedCategory !== 'all') {
      theories = getTheoriesByCategory(selectedCategory);
    }

    if (searchQuery.trim()) {
      theories = searchTheories(searchQuery);
    }

    return theories;
  }, [allTheories, selectedCategory, searchQuery]);

  const categories = [
    { id: 'all', name: 'Tất Cả', icon: BookOpen },
    { id: 'sorting', name: 'Sắp Xếp', icon: TrendingUp },
    { id: 'searching', name: 'Tìm Kiếm', icon: Search },
    { id: 'extreme', name: 'Cực Trị', icon: Zap },
  ];

  const toggleComparison = (id: string) => {
    const newSet = new Set(selectedForComparison);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      if (newSet.size < 3) { // Limit to 3 algorithms for comparison
        newSet.add(id);
      }
    }
    setSelectedForComparison(newSet);
  };

  const PropertyBadge = ({ value, trueLabel, falseLabel }: { value: boolean; trueLabel: string; falseLabel: string }) => (
    <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm ${
      value 
        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' 
        : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
    }`}>
      {value ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
      <span>{value ? trueLabel : falseLabel}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <Header title="Theory Explorer" showBackButton={true} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
            Theory Explorer
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Khám phá lý thuyết chi tiết về các thuật toán
          </p>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6"
        >
          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm thuật toán..."
              className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="flex gap-2 flex-wrap">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                    selectedCategory === category.id
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {category.name}
                </button>
              );
            })}
          </div>

          {/* Comparison Mode Info */}
          {selectedForComparison.size > 0 && (
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-600" />
                <span className="text-sm">
                  {selectedForComparison.size} thuật toán đã chọn để so sánh
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    if (selectedForComparison.size >= 2) {
                      setShowComparison(true);
                    }
                  }}
                  disabled={selectedForComparison.size < 2}
                  className={`text-sm font-medium px-4 py-1 rounded-lg transition-colors ${
                    selectedForComparison.size >= 2
                      ? 'bg-cyan-600 text-white hover:bg-cyan-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Xem So Sánh ({selectedForComparison.size})
                </button>
                <button
                  onClick={() => setSelectedForComparison(new Set())}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Xóa tất cả
                </button>
              </div>
            </div>
          )}
        </motion.div>

        {/* Theories Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold">Thuật Toán</th>
                  <th className="text-center py-4 px-6 font-semibold">Best</th>
                  <th className="text-center py-4 px-6 font-semibold">Average</th>
                  <th className="text-center py-4 px-6 font-semibold">Worst</th>
                  <th className="text-center py-4 px-6 font-semibold">Space</th>
                  <th className="text-center py-4 px-6 font-semibold">Stable</th>
                  <th className="text-center py-4 px-6 font-semibold">In-Place</th>
                  <th className="text-center py-4 px-6 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTheories.map((theory, idx) => (
                  <motion.tr
                    key={theory.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  >
                    <td className="py-4 px-6">
                      <div>
                        <div className="font-semibold text-lg">{theory.name}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {theory.category}
                        </div>
                      </div>
                    </td>
                    <td className="text-center py-4 px-6">
                      <div className="inline-block bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded">
                        <LaTeX formula={theory.timeComplexity.best.formula} inline />
                      </div>
                    </td>
                    <td className="text-center py-4 px-6">
                      <div className="inline-block bg-yellow-100 dark:bg-yellow-900/30 px-2 py-1 rounded">
                        <LaTeX formula={theory.timeComplexity.average.formula} inline />
                      </div>
                    </td>
                    <td className="text-center py-4 px-6">
                      <div className="inline-block bg-red-100 dark:bg-red-900/30 px-2 py-1 rounded">
                        <LaTeX formula={theory.timeComplexity.worst.formula} inline />
                      </div>
                    </td>
                    <td className="text-center py-4 px-6">
                      <div className="inline-block bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded">
                        <LaTeX formula={theory.spaceComplexity.auxiliary.formula} inline />
                      </div>
                    </td>
                    <td className="text-center py-4 px-6">
                      {theory.properties.stable ? (
                        <CheckCircle className="w-5 h-5 text-green-600 mx-auto" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600 mx-auto" />
                      )}
                    </td>
                    <td className="text-center py-4 px-6">
                      {theory.properties.inPlace ? (
                        <CheckCircle className="w-5 h-5 text-green-600 mx-auto" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600 mx-auto" />
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => setSelectedTheory(theory)}
                          className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                        >
                          Chi tiết
                        </button>
                        <button
                          onClick={() => toggleComparison(theory.id)}
                          className={`px-3 py-1 rounded-lg transition-colors text-sm ${
                            selectedForComparison.has(theory.id)
                              ? 'bg-cyan-600 text-white'
                              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                          }`}
                        >
                          {selectedForComparison.has(theory.id) ? 'Đã chọn' : 'So sánh'}
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredTheories.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              Không tìm thấy thuật toán phù hợp.
            </div>
          )}
        </motion.div>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedTheory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedTheory(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between z-10">
                <h2 className="text-2xl font-bold">{selectedTheory.name}</h2>
                <button
                  onClick={() => setSelectedTheory(null)}
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {/* Overview */}
                <div>
                  <h3 className="text-xl font-semibold mb-3">Tổng Quan</h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    {selectedTheory.description.overview}
                  </p>
                </div>

                {/* Time Complexity */}
                <div>
                  <h3 className="text-xl font-semibold mb-3">Time Complexity</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {(['best', 'average', 'worst'] as const).map((case_) => (
                      <div key={case_} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-2 capitalize">
                          {case_}
                        </div>
                        <LaTeX formula={selectedTheory.timeComplexity[case_].formula} />
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                          {selectedTheory.timeComplexity[case_].explanation}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Properties */}
                <div>
                  <h3 className="text-xl font-semibold mb-3">Thuộc Tính</h3>
                  <div className="flex flex-wrap gap-2">
                    <PropertyBadge value={selectedTheory.properties.stable} trueLabel="Stable" falseLabel="Unstable" />
                    <PropertyBadge value={selectedTheory.properties.inPlace} trueLabel="In-Place" falseLabel="Not In-Place" />
                    <PropertyBadge value={selectedTheory.properties.adaptive} trueLabel="Adaptive" falseLabel="Not Adaptive" />
                    <PropertyBadge value={selectedTheory.properties.recursive} trueLabel="Recursive" falseLabel="Iterative" />
                    <PropertyBadge value={selectedTheory.properties.comparison} trueLabel="Comparison-Based" falseLabel="Non-Comparison" />
                  </div>
                </div>

                {/* How It Works */}
                <div>
                  <h3 className="text-xl font-semibold mb-3">Cách Hoạt Động</h3>
                  <ol className="list-decimal list-inside space-y-2">
                    {selectedTheory.description.howItWorks.map((step, idx) => (
                      <li key={idx} className="text-gray-700 dark:text-gray-300">
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Pros and Cons */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-green-600">Ưu Điểm</h3>
                    <ul className="space-y-2">
                      {selectedTheory.tradeoffs.pros.map((pro, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700 dark:text-gray-300">{pro}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-red-600">Nhược Điểm</h3>
                    <ul className="space-y-2">
                      {selectedTheory.tradeoffs.cons.map((con, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700 dark:text-gray-300">{con}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Applications */}
                <div>
                  <h3 className="text-xl font-semibold mb-3">Ứng Dụng Thực Tế</h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {selectedTheory.practical.realWorldApplications.map((app, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Zap className="w-4 h-4 text-blue-600 flex-shrink-0 mt-1" />
                        <span className="text-gray-700 dark:text-gray-300">{app}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* History */}
                {selectedTheory.history && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold">Lịch Sử</h3>
                      {selectedTheory.history.wikipediaUrl && (
                        <a 
                          href={selectedTheory.history.wikipediaUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline text-sm"
                        >
                          <span>Wikipedia</span>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      )}
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">
                      <strong>Người phát minh:</strong> {selectedTheory.history.inventor || 'Không rõ'} 
                      {selectedTheory.history.year && ` (${selectedTheory.history.year})`}
                    </p>
                    {selectedTheory.history.motivation && (
                      <p className="text-gray-700 dark:text-gray-300 mt-2">
                        {selectedTheory.history.motivation}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Comparison Modal */}
      <AnimatePresence>
        {showComparison && selectedForComparison.size >= 2 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowComparison(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-xl shadow-2xl max-w-7xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between z-10 shadow-sm">
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                    So Sánh Thuật Toán
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Phân tích chi tiết về lý thuyết và hiệu năng
                  </p>
                </div>
                <button
                  onClick={() => setShowComparison(false)}
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                {(() => {
                  const comparisonTheories = Array.from(selectedForComparison)
                    .map(id => allTheories.find(t => t.id === id))
                    .filter(Boolean) as AlgorithmTheory[];

                  const algorithmColors = [
                    'from-blue-400 to-blue-500',
                    'from-cyan-400 to-cyan-500',
                    'from-sky-400 to-sky-500',
                  ];

                  const getComplexityColor = (bigO: string) => {
                    if (bigO.includes('1') || bigO === 'O(1)') return 'text-green-600 bg-green-50 dark:bg-green-900/20 border-green-200';
                    if (bigO.includes('log n')) return 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200';
                    if (bigO.includes('n²') || bigO.includes('n^2')) return 'text-orange-600 bg-orange-50 dark:bg-orange-900/20 border-orange-200';
                    if (bigO.includes('n log n')) return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200';
                    if (bigO.includes('2^n') || bigO.includes('n!')) return 'text-red-600 bg-red-50 dark:bg-red-900/20 border-red-200';
                    return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 border-blue-200';
                  };

                  return (
                    <div className="space-y-6">
                      {/* Algorithm Cards Header */}
                      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${comparisonTheories.length}, 1fr)` }}>
                        {comparisonTheories.map((theory, idx) => (
                          <motion.div
                            key={theory.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border-2 border-gray-200 dark:border-gray-700"
                          >
                            <h3 className={`text-2xl font-bold mb-2 bg-gradient-to-r ${algorithmColors[idx]} bg-clip-text text-transparent`}>
                              {theory.name}
                            </h3>
                            <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                              {theory.category}
                            </span>
                            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                              <div className="flex items-center justify-between">
                                <span className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">Difficulty</span>
                                <span className={`text-sm font-semibold px-3 py-1 rounded ${
                                  theory.difficulty === 'Dễ' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                                  theory.difficulty === 'Trung Bình' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' :
                                  'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                                }`}>
                                  {theory.difficulty}
                                </span>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      {/* Quick Stats Overview */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
                      >
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                          <TrendingUp className="w-5 h-5 text-blue-600" />
                          Tổng Quan Hiệu Năng
                        </h3>
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-700/50">
                              <tr>
                                <th className="text-left py-3 px-4 font-semibold text-sm">Metric</th>
                                {comparisonTheories.map((theory, idx) => (
                                  <th key={theory.id} className="text-center py-3 px-4">
                                    <span className={`inline-flex items-center gap-1 text-sm font-semibold bg-gradient-to-r ${algorithmColors[idx]} bg-clip-text text-transparent`}>
                                      {theory.name}
                                    </span>
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                              <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                <td className="py-3 px-4 font-medium text-sm">Best Case</td>
                                {comparisonTheories.map((theory) => (
                                  <td key={theory.id} className="text-center py-3 px-4">
                                    <div className={`inline-block px-3 py-1.5 rounded-lg border ${getComplexityColor(theory.timeComplexity.best.bigO)}`}>
                                      <LaTeX formula={theory.timeComplexity.best.formula} inline />
                                    </div>
                                  </td>
                                ))}
                              </tr>
                              <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                <td className="py-3 px-4 font-medium text-sm">Average Case</td>
                                {comparisonTheories.map((theory) => (
                                  <td key={theory.id} className="text-center py-3 px-4">
                                    <div className={`inline-block px-3 py-1.5 rounded-lg border ${getComplexityColor(theory.timeComplexity.average.bigO)}`}>
                                      <LaTeX formula={theory.timeComplexity.average.formula} inline />
                                    </div>
                                  </td>
                                ))}
                              </tr>
                              <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                <td className="py-3 px-4 font-medium text-sm">Worst Case</td>
                                {comparisonTheories.map((theory) => (
                                  <td key={theory.id} className="text-center py-3 px-4">
                                    <div className={`inline-block px-3 py-1.5 rounded-lg border ${getComplexityColor(theory.timeComplexity.worst.bigO)}`}>
                                      <LaTeX formula={theory.timeComplexity.worst.formula} inline />
                                    </div>
                                  </td>
                                ))}
                              </tr>
                              <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                <td className="py-3 px-4 font-medium text-sm">Space</td>
                                {comparisonTheories.map((theory) => (
                                  <td key={theory.id} className="text-center py-3 px-4">
                                    <div className={`inline-block px-3 py-1.5 rounded-lg border ${getComplexityColor(theory.spaceComplexity.auxiliary.bigO)}`}>
                                      <LaTeX formula={theory.spaceComplexity.auxiliary.formula} inline />
                                    </div>
                                  </td>
                                ))}
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </motion.div>

                      {/* Properties Comparison - Visual Grid */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
                      >
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                          <Filter className="w-5 h-5 text-cyan-600" />
                          Thuộc Tính So Sánh
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                          {['stable', 'inPlace', 'adaptive', 'recursive', 'comparison'].map((prop) => (
                            <div key={prop} className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                              <div className="text-sm font-semibold mb-3 text-center capitalize">
                                {prop === 'inPlace' ? 'In-Place' : prop}
                              </div>
                              <div className="space-y-2">
                                {comparisonTheories.map((theory, idx) => {
                                  const value = theory.properties[prop as keyof typeof theory.properties];
                                  return (
                                    <div key={theory.id} className="flex items-center justify-between gap-2 p-2 bg-white dark:bg-gray-800 rounded">
                                      <span className={`text-xs font-medium bg-gradient-to-r ${algorithmColors[idx]} bg-clip-text text-transparent`}>
                                        {theory.name.split(' ')[0]}
                                      </span>
                                      {value ? (
                                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                                      ) : (
                                        <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>

                      {/* Detailed Complexity with Formula */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
                      >
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                          <BookOpen className="w-5 h-5 text-blue-600" />
                          Công Thức Chi Tiết
                        </h3>
                        <div className="space-y-5">
                          {(['best', 'average', 'worst'] as const).map((case_) => (
                            <div key={case_}>
                              <div className="text-base font-bold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">
                                {case_ === 'best' ? 'Best Case' : case_ === 'average' ? 'Average Case' : 'Worst Case'}
                              </div>
                              <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${comparisonTheories.length}, 1fr)` }}>
                                {comparisonTheories.map((theory, idx) => (
                                  <div key={theory.id} className="bg-gray-50 dark:bg-gray-700/50 p-5 rounded-lg border-2 border-gray-200 dark:border-gray-600 hover:border-blue-400 dark:hover:border-cyan-400 transition-colors">
                                    <div className={`text-sm font-bold mb-3 bg-gradient-to-r ${algorithmColors[idx]} bg-clip-text text-transparent`}>
                                      {theory.name}
                                    </div>
                                    <div className="text-center mb-3 py-2">
                                      <LaTeX 
                                        key={`${theory.id}-${case_}-formula`}
                                        formula={theory.timeComplexity[case_].formula} 
                                      />
                                    </div>
                                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                      {theory.timeComplexity[case_].explanation}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>

                      {/* Side-by-side Pros and Cons */}
                      <div className="grid gap-6" style={{ gridTemplateColumns: `repeat(${comparisonTheories.length}, 1fr)` }}>
                        {comparisonTheories.map((theory, idx) => (
                          <motion.div
                            key={theory.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 + idx * 0.1 }}
                            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border-2 border-gray-200 dark:border-gray-700"
                          >
                            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 border-b-2 border-gray-200 dark:border-gray-700">
                              <h3 className={`font-bold text-lg bg-gradient-to-r ${algorithmColors[idx]} bg-clip-text text-transparent`}>
                                {theory.name}
                              </h3>
                            </div>
                            
                            {/* Pros */}
                            <div className="p-5 border-b border-gray-200 dark:border-gray-700">
                              <h4 className="text-base font-bold text-green-600 dark:text-green-400 mb-3 flex items-center gap-2">
                                <CheckCircle className="w-5 h-5" />
                                Ưu Điểm
                              </h4>
                              <ul className="space-y-2.5">
                                {theory.tradeoffs.pros.map((pro, proIdx) => (
                                  <li key={proIdx} className="text-sm flex items-start gap-2 leading-relaxed">
                                    <span className="text-green-600 dark:text-green-400 flex-shrink-0 mt-1">•</span>
                                    <span className="text-gray-700 dark:text-gray-300">{pro}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            
                            {/* Cons */}
                            <div className="p-5">
                              <h4 className="text-base font-bold text-red-600 dark:text-red-400 mb-3 flex items-center gap-2">
                                <XCircle className="w-5 h-5" />
                                Nhược Điểm
                              </h4>
                              <ul className="space-y-2.5">
                                {theory.tradeoffs.cons.map((con, conIdx) => (
                                  <li key={conIdx} className="text-sm flex items-start gap-2 leading-relaxed">
                                    <span className="text-red-600 dark:text-red-400 flex-shrink-0 mt-1">•</span>
                                    <span className="text-gray-700 dark:text-gray-300">{con}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      {/* Best Use Cases */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
                      >
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                          <Zap className="w-5 h-5 text-amber-600" />
                          Khi Nào Nên Sử Dụng
                        </h3>
                        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${comparisonTheories.length}, 1fr)` }}>
                          {comparisonTheories.map((theory, idx) => (
                            <div key={theory.id} className="bg-gray-50 dark:bg-gray-700/50 p-5 rounded-lg border-2 border-gray-200 dark:border-gray-600 hover:border-amber-400 dark:hover:border-amber-500 transition-colors">
                              <div className={`text-base font-bold mb-3 bg-gradient-to-r ${algorithmColors[idx]} bg-clip-text text-transparent`}>
                                {theory.name}
                              </div>
                              <ul className="space-y-2.5">
                                {theory.practical.bestUseCase.map((useCase, ucIdx) => (
                                  <li key={ucIdx} className="text-sm flex items-start gap-2 leading-relaxed">
                                    <Zap className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                                    <span className="text-gray-700 dark:text-gray-300">{useCase}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </motion.div>

                      {/* Recommendation Banner */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-xl shadow-lg p-6"
                      >
                        <h3 className="text-xl font-bold mb-3 flex items-center gap-2 text-blue-700 dark:text-blue-300">
                          <Info className="w-6 h-6" />
                          Kết Luận So Sánh
                        </h3>
                        <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                          Mỗi thuật toán có ưu nhược điểm riêng. Hãy chọn thuật toán phù hợp dựa trên:
                          kích thước dữ liệu, yêu cầu về bộ nhớ, tính stability, và ngữ cảnh sử dụng cụ thể.
                        </p>
                      </motion.div>
                    </div>
                  );
                })()}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
