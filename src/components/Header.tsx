'use client';

import { ChevronLeft, Bird } from 'lucide-react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

interface HeaderProps {
  title?: string;
  showBackButton?: boolean;
}

export default function Header({ title = 'Algorithm Complexity Visualizer', showBackButton = false }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  return (
    <header className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            {showBackButton && !isHomePage && (
              <button
                onClick={() => router.back()}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
                <span className="text-sm font-medium">Quay lại</span>
              </button>
            )}
            
            <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <Bird className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900 hidden sm:block">
                {title}
              </h1>
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
              Trang Chủ
            </Link>
            <Link href="/algorithms/sorting" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
              Sắp Xếp
            </Link>
            <Link href="/algorithms/searching" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
              Tìm Kiếm
            </Link>
            <Link href="/algorithms/extreme" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
              Giá Trị Cực Trị
            </Link>
          </nav>

          <div className="md:hidden">
            <button className="text-gray-600 hover:text-gray-900">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
