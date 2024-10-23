'use client'

import { Icon } from '@iconify/react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'

const themes = [
  { value: 'dark', label: '深色', icon: 'ph:moon-bold' },
  { value: 'light', label: '浅色', icon: 'ph:sun-bold' },
  { value: 'system', label: '系统', icon: 'ph:desktop-bold' }
] as const

export function ThemeSwitch() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="fixed bottom-4 right-4">
      <div className="relative">
        <Button
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-full"
          aria-label="Theme switcher"
        >
          <Icon
            icon={themes.find((t) => t.value === theme)?.icon || themes[0].icon}
            className="w-5 h-5 text-white dark:text-black"
          />
        </Button>

        {isOpen && (
          <div className="absolute bottom-full w-[120px] right-0 mb-2 bg-black dark:bg-white rounded-lg shadow-lg overflow-hidden">
            {themes.map((t) => (
              <button
                key={t.value}
                onClick={() => {
                  setTheme(t.value)
                  setIsOpen(false)
                }}
                className="flex items-center w-full px-4 py-2 text-sm text-white hover:bg-white/15 dark:text-black hover:dark:bg-black/15"
              >
                <Icon icon={t.icon} className="w-4 h-4 mr-2" />
                {t.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
