import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Trực Quan Hóa Độ Phức Tạp Thuật Toán',
  description: 'Trực quan hóa tương tác về độ phức tạp thuật toán cho các thuật toán sắp xếp, tìm kiếm và tìm giá trị cực trị',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
