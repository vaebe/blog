'use client'

import { Icon } from '@iconify/react'
import { useTheme } from 'next-themes'

export function ThemeSwitch() {
  const { theme, setTheme } = useTheme()

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="fixed bottom-4 right-4 p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300 ease-in-out transform hover:scale-110"
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <Icon
        icon={theme === 'dark' ? 'ph:sun-bold' : 'ph:moon-bold'}
        className="w-5 h-5 text-gray-600 dark:text-gray-300"
      />
    </button>
  )
}
