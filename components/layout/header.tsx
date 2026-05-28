'use client'

import { Icon } from '@iconify/react'
import { authClient } from '@/lib/auth/client'
import { useCurrentUser } from '@/lib/use-current-user'
import { routerList } from '@/lib/routers'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { BlogLogo } from '@/components/blog-logo'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { LoginDialog } from '@/components/login-dialog'
import { usePathname } from 'next/navigation'
import { TOGGLE_COMMAND_PALETTE } from '@/components/command-palette'

function CommandKHint() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(TOGGLE_COMMAND_PALETTE))}
      aria-label="打开命令面板"
      className="hidden items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground md:inline-flex"
    >
      <Icon icon="lucide:search" className="h-4 w-4" />
      <kbd className="font-sans text-xs">⌘K</kbd>
    </button>
  )
}

function NavList() {
  const pathname = usePathname()

  return (
    <ul className="flex items-center gap-1">
      {routerList.map((item) => {
        const active = pathname === item.path
        return (
          <li key={item.path}>
            <Link
              href={item.path}
              aria-label={item.name}
              className={`relative flex items-center gap-1.5 px-2.5 py-2 text-sm font-medium transition-colors md:px-3 ${
                active ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon icon={item.icon} className="h-4 w-4" />
              <span className="hidden md:block">{item.name}</span>
              {active && (
                <span
                  aria-hidden
                  className="absolute bottom-0 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-primary"
                />
              )}
            </Link>
          </li>
        )
      })}
    </ul>
  )
}

interface CurrentUser {
  name: string | null
  email: string | null
  image: string | null
}

function UserAvatar({ user, isAdmin }: { user: CurrentUser; isAdmin: boolean }) {
  const name = user?.name ?? '用户'
  const initial = Array.from(name)[0]?.toUpperCase() ?? 'U'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="group flex cursor-pointer items-center gap-2 rounded-full py-1 pl-1 pr-2.5 transition-colors hover:bg-accent"
        >
          <Avatar className="h-7 w-7 ring-1 ring-border">
            <AvatarImage src={user?.image ?? ''} alt={name} />
            <AvatarFallback className="text-xs">{initial}</AvatarFallback>
          </Avatar>
          <span className="hidden max-w-[100px] truncate text-sm font-medium sm:inline">
            {name}
          </span>
          <Icon
            icon="lucide:chevron-down"
            className="hidden h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180 sm:inline"
          />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-60">
        <div className="px-2 py-2">
          <p className="truncate text-sm font-medium">{name}</p>
          {user?.email && (
            <p className="mt-0.5 truncate text-xs text-muted-foreground">{user.email}</p>
          )}
        </div>

        <DropdownMenuSeparator />

        {isAdmin && (
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link href="/article/add" target="_blank" rel="noopener noreferrer">
              <Icon icon="lucide:feather" className="mr-2 h-4 w-4" />
              写文章
            </Link>
          </DropdownMenuItem>
        )}

        <DropdownMenuItem
          className="cursor-pointer text-muted-foreground focus:text-foreground"
          onClick={() => authClient.signOut()}
        >
          <Icon icon="lucide:log-out" className="mr-2 h-4 w-4" />
          退出登录
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default function LayoutHeader() {
  const { user, isAuthenticated, isAdmin } = useCurrentUser()
  const [scrolled, setScrolled] = useState(false)
  // 登录态依赖客户端 session，挂载后再渲染，避免与 SSR 不一致导致 hydration 报错
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ease-in-out ${scrolled ? 'border-b border-border bg-background/90 shadow-soft backdrop-blur-sm' : 'bg-transparent'}`}
    >
      <div className="flex justify-between items-center px-2 sm:px-4 lg:px-6 py-2">
        <Link href="/" className="group flex items-center gap-2">
          <BlogLogo></BlogLogo>
          <span className="hidden font-display text-lg font-bold leading-none tracking-tight transition-colors group-hover:text-primary sm:inline">
            vaebe
          </span>
        </Link>

        <NavList />

        <div className="flex items-center space-x-3">
          <CommandKHint />

          {mounted && !isAuthenticated && (
            <LoginDialog>
              <button
                type="button"
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground shadow-soft transition-all duration-200 hover:brightness-110"
              >
                <Icon icon="lucide:log-in" className="h-4 w-4" />
                登录
              </button>
            </LoginDialog>
          )}

          {mounted && isAuthenticated && user && <UserAvatar user={user} isAdmin={isAdmin} />}
        </div>
      </div>
    </header>
  )
}
