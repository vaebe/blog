'use client'

import { Icon } from '@iconify/react'
import { useTheme } from 'next-themes'
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

  // 用 View Transitions API：明暗从点击处以圆形 clip-path 扩散切换
  const applyTheme = (next: string, e: React.MouseEvent) => {
    const startVT = (
      document as Document & {
        startViewTransition?: (cb: () => void) => { ready: Promise<void> }
      }
    ).startViewTransition

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (!startVT || prefersReduced) {
      setTheme(next)
      return
    }

    const x = e.clientX
    const y = e.clientY
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    )

    const transition = startVT.call(document, () => setTheme(next))
    transition.ready.then(() => {
      document.documentElement.animate(
        {
          clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`]
        },
        {
          duration: 580,
          easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
          pseudoElement: '::view-transition-new(root)'
        }
      )
    })
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            aria-label="Theme switcher"
            className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-border bg-card text-foreground shadow-soft transition-transform hover:scale-105"
          >
            <Icon
              icon={themes.find((t) => t.value === theme)?.icon || themes[0].icon}
              className="h-5 w-5"
            />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-36">
          {themes.map((t) => {
            const active = theme === t.value
            return (
              <DropdownMenuItem
                key={t.value}
                className="flex cursor-pointer items-center justify-between gap-2"
                onClick={(e) => applyTheme(t.value, e)}
              >
                <span className="flex items-center gap-2">
                  <Icon icon={t.icon} className="h-4 w-4 text-muted-foreground" />
                  {t.label}
                </span>
                {active && <Icon icon="lucide:check" className="h-4 w-4 text-primary" />}
              </DropdownMenuItem>
            )
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
