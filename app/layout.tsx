'use client'

import { useState, useEffect } from 'react'
import { Icon } from '@iconify/react'
import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  return (
    <html lang="zh">
      <body className="min-h-screen flex flex-col bg-gradient-to-b from-gray-100 to-white dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100">
        <header className="sticky top-0 z-50 bg-white dark:bg-gray-800 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <h1 className="text-3xl font-bold">vaebe</h1>
            <nav className="flex items-center">
              <ul className="flex space-x-4 mr-4">
                <li><a href="/" className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">首页</a></li>
                <li><a href="/articles" className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">文章</a></li>
                <li><a href="/about" className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">关于</a></li>
                <li><a href="/contact" className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">联系</a></li>
              </ul>
              <button onClick={toggleDarkMode} className="p-2 rounded-full bg-gray-200 dark:bg-gray-700">
                <Icon icon={darkMode ? "ph:sun-bold" : "ph:moon-bold"} className="w-5 h-5" />
              </button>
            </nav>
          </div>
        </header>

        <main className="flex-grow">
          {children}
        </main>

        <footer className="bg-gray-800 dark:bg-gray-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">关于</h3>
                <p className="text-gray-300">一个分享Web开发和技术见解与经验的个人博客。</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">快速链接</h3>
                <ul className="space-y-2">
                  <li><a href="/" className="text-gray-300 hover:text-white">首页</a></li>
                  <li><a href="/articles" className="text-gray-300 hover:text-white">文章</a></li>
                  <li><a href="/about" className="text-gray-300 hover:text-white">关于</a></li>
                  <li><a href="/contact" className="text-gray-300 hover:text-white">联系</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">订阅</h3>
                <p className="text-gray-300 mb-4">及时获取我们的最新文章和新闻。</p>
                <form className="flex">
                  <input type="email" placeholder="输入您的邮箱" className="flex-grow px-4 py-2 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">订阅</button>
                </form>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-700 text-center">
              <p className="text-gray-300">&copy; 2023 我的技术博客。保留所有权利。</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}