'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import { Icon } from '@iconify/react'
import { routerList } from '@/lib/routers'

// 自定义事件名：页眉等处可派发以打开面板
export const TOGGLE_COMMAND_PALETTE = 'toggle-command-palette'

interface Command {
  id: string
  label: string
  hint?: string
  icon: string
  keywords?: string
  run: () => void
}

export function CommandPalette() {
  const router = useRouter()
  const { setTheme } = useTheme()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const listRef = useRef<HTMLDivElement>(null)

  const commands = useMemo<Command[]>(() => {
    const go = (path: string) => () => {
      setOpen(false)
      router.push(path)
    }
    const openExternal = (url: string) => () => {
      setOpen(false)
      window.open(url, '_blank', 'noopener,noreferrer')
    }
    return [
      ...routerList.map((r) => ({
        id: `nav-${r.path}`,
        label: r.name,
        hint: '导航',
        icon: r.icon,
        keywords: r.path,
        run: go(r.path)
      })),
      {
        id: 'theme-light',
        label: '切换到浅色',
        hint: '主题',
        icon: 'ph:sun-bold',
        keywords: 'light theme 浅色 白天',
        run: () => {
          setTheme('light')
          setOpen(false)
        }
      },
      {
        id: 'theme-dark',
        label: '切换到深色',
        hint: '主题',
        icon: 'ph:moon-bold',
        keywords: 'dark theme 深色 黑夜',
        run: () => {
          setTheme('dark')
          setOpen(false)
        }
      },
      {
        id: 'theme-system',
        label: '跟随系统',
        hint: '主题',
        icon: 'ph:desktop-bold',
        keywords: 'system theme 系统',
        run: () => {
          setTheme('system')
          setOpen(false)
        }
      },
      {
        id: 'rss',
        label: 'RSS 订阅',
        hint: '链接',
        icon: 'mingcute:rss-2-fill',
        keywords: 'rss feed 订阅',
        run: openExternal('/rss')
      },
      {
        id: 'github',
        label: 'GitHub 主页',
        hint: '外链',
        icon: 'mdi:github',
        keywords: 'github 仓库 代码',
        run: openExternal('https://github.com/vaebe')
      },
      {
        id: 'juejin',
        label: '掘金主页',
        hint: '外链',
        icon: 'simple-icons:juejin',
        keywords: 'juejin 掘金 文章',
        run: openExternal('https://juejin.cn/user/712139266339694')
      }
    ]
  }, [router, setTheme])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return commands
    return commands.filter((c) =>
      `${c.label} ${c.keywords ?? ''} ${c.hint ?? ''}`.toLowerCase().includes(q)
    )
  }, [commands, query])

  // ⌘K / Ctrl+K 唤起，以及自定义事件
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen((o) => !o)
      }
    }
    const onToggle = () => setOpen((o) => !o)
    window.addEventListener('keydown', onKey)
    window.addEventListener(TOGGLE_COMMAND_PALETTE, onToggle)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener(TOGGLE_COMMAND_PALETTE, onToggle)
    }
  }, [])

  // 打开时重置查询与选中项
  useEffect(() => {
    if (open) {
      setQuery('')
      setActive(0)
    }
  }, [open])

  // 查询变化时把选中项归零
  useEffect(() => {
    setActive(0)
  }, [query])

  const onListKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setActive((i) => Math.min(i + 1, filtered.length - 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setActive((i) => Math.max(i - 1, 0))
      } else if (e.key === 'Enter') {
        e.preventDefault()
        filtered[active]?.run()
      }
    },
    [filtered, active]
  )

  // 选中项滚入可视区
  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(`[data-index="${active}"]`)
    el?.scrollIntoView({ block: 'nearest' })
  }, [active])

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content
          onKeyDown={onListKeyDown}
          className="glass glass-strong fixed left-1/2 top-[18%] z-[101] w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 overflow-hidden rounded-2xl text-popover-foreground data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=open]:slide-in-from-top-2"
        >
          <Dialog.Title className="sr-only">命令面板</Dialog.Title>
          <Dialog.Description className="sr-only">
            搜索并快速导航、切换主题
          </Dialog.Description>

          <div className="flex items-center gap-3 border-b border-border px-4">
            <Icon icon="lucide:search" className="h-4 w-4 shrink-0 text-muted-foreground" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="搜索命令、页面、主题…"
              className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            <kbd className="hidden shrink-0 rounded border border-border px-1.5 py-0.5 text-[10px] text-muted-foreground sm:inline-block">
              ESC
            </kbd>
          </div>

          <div ref={listRef} className="max-h-80 overflow-y-auto p-2">
            {filtered.length === 0 ? (
              <p className="px-3 py-8 text-center text-sm text-muted-foreground">无匹配结果</p>
            ) : (
              filtered.map((c, i) => (
                <button
                  key={c.id}
                  type="button"
                  data-index={i}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => c.run()}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                    i === active ? 'bg-accent text-accent-foreground' : 'text-foreground'
                  }`}
                >
                  <Icon icon={c.icon} className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <span className="flex-1">{c.label}</span>
                  {c.hint && (
                    <span className="text-xs text-muted-foreground">{c.hint}</span>
                  )}
                </button>
              ))
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
