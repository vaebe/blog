'use client'

import { Icon } from '@iconify/react'
import { useTheme } from "next-themes"
import { signOut, useSession } from "next-auth/react";

export default function LayoutHeader() {
  const { theme, setTheme } = useTheme()
  const { data: session, status } = useSession();

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <h1 className="text-3xl font-bold">vaebe</h1>
        <nav className="flex items-center">
          <ul className="flex space-x-4 mr-4">
            <li><a href="/" className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">首页</a></li>
            <li><a href="/articles" className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">文章</a></li>
            <li><a href="/about" className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">关于</a></li>
          </ul>
          <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="p-2 rounded-full bg-gray-200 dark:bg-gray-700">
            <Icon icon={theme === 'dark' ? "ph:sun-bold" : "ph:moon-bold"} className="w-5 h-5" />
          </button>

          {
            status === 'authenticated'
            &&
            <button onClick={() => signOut()} className="ml-2 p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 ">
              <Icon icon="uis:signout" className="w-5 h-5" />
            </button>
          }
        </nav>
      </div>
    </header>
  )
}