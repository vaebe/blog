'use client'

import { Icon } from '@iconify/react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

const themes = [
  { value: 'dark', label: '深色', icon: 'ph:moon-bold' },
  { value: 'light', label: '浅色', icon: 'ph:sun-bold' },
  { value: 'system', label: '系统', icon: 'ph:desktop-bold' }
] as const

export function ThemeSwitch() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="fixed bottom-4 right-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon" className="p-2 rounded-full" aria-label="Theme switcher">
            <Icon
              icon={themes.find((t) => t.value === theme)?.icon || themes[0].icon}
              className="w-5 h-5 text-white dark:text-black"
            />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          {themes.map((t) => (
            <DropdownMenuItem
              key={t.value}
              className="cursor-pointer"
              onClick={() => {
                setTheme(t.value)
              }}
            >
              <div className="flex items-center">
                <Icon icon={t.icon} className="w-4 h-4 mr-2" />
                {t.label}
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
