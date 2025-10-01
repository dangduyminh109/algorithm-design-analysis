'use client';

import { ChevronLeft, Bird, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';

interface HeaderProps {
  title?: string;
  showBackButton?: boolean;
}

export default function Header({ title = 'Algorithm Complexity Visualizer', showBackButton = false }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12 sm:h-14 lg:h-16">
          <div className="flex items-center space-x-2 sm:space-x-4">
            {showBackButton && !isHomePage && (
              <button
                onClick={() => router.back()}
                className="flex items-center space-x-1 sm:space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-xs sm:text-sm font-medium hidden sm:inline">Quay lại</span>
              </button>
            )}
            
            <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <Bird className="w-3 h-3 sm:w-5 sm:h-5 text-white" />
              </div>
              <h1 className="text-sm sm:text-xl font-bold text-blue-400 hidden sm:block">
                Algorithm Complexity Visualizer
              </h1>
              <h1 className="text-xs font-bold text-blue-400 block sm:hidden">
                Algorithm
              </h1>
            </Link>
          </div>

          <nav className="hidden lg:flex items-center space-x-4 xl:space-x-6">
            <Link href="/" className="text-gray-600 hover:text-gray-900 font-medium transition-colors text-sm xl:text-base">
              Trang Chủ
            </Link>
            <Link href="/algorithms/sorting" className="text-gray-600 hover:text-gray-900 font-medium transition-colors text-sm xl:text-base">
              Sắp Xếp
            </Link>
            <Link href="/algorithms/searching" className="text-gray-600 hover:text-gray-900 font-medium transition-colors text-sm xl:text-base">
              Tìm Kiếm
            </Link>
            <Link href="/algorithms/extreme" className="text-gray-600 hover:text-gray-900 font-medium transition-colors text-sm xl:text-base">
              Giá Trị Cực Trị
            </Link>
          </nav>

          <div className="lg:hidden">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-600 hover:text-gray-900 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              ) : (
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200 shadow-lg">
          <nav className="px-4 py-3 space-y-2">
            <Link 
              href="/" 
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 px-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md font-medium transition-colors"
            >
              Trang Chủ
            </Link>
            <Link 
              href="/algorithms/sorting" 
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 px-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md font-medium transition-colors"
            >
              Sắp Xếp
            </Link>
            <Link 
              href="/algorithms/searching" 
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 px-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md font-medium transition-colors"
            >
              Tìm Kiếm
            </Link>
            <Link 
              href="/algorithms/extreme" 
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 px-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md font-medium transition-colors"
            >
              Giá Trị Cực Trị
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
