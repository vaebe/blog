'use client'

import { useState, useEffect } from 'react'
import { Icon } from '@iconify/react'

export default function LayoutHeader() {
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
  )
}