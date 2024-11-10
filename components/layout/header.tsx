'use client'

import { Icon } from '@iconify/react'
import { signOut, useSession } from 'next-auth/react'
import { routerList } from '@/lib/routers'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { BlogLogo } from '@/components/blog-logo'
import { Session } from 'next-auth'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

function NavList() {
  return (
    <ul className="flex space-x-1">
      {routerList.map((item) => (
        <li key={item.path}>
          <Link
            href={item.path}
            target={item?.linkTarget}
            className="flex items-center px-2 md:px-4 py-0.5 text-lg font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-all duration-100 ease-in-out"
          >
            <Icon icon={item.icon} width={22} height={22} className="mr-1"></Icon>
            <span className="hidden md:block">{item.name}</span>
          </Link>
        </li>
      ))}
    </ul>
  )
}

function UserAvatar({ session }: { session: Session }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center space-x-2 cursor-pointer">
          <Avatar className="w-8 h-8">
            <AvatarImage src={session?.user?.image ?? ''} alt="user" />
            <AvatarFallback>{session?.user?.name ?? 'll'}</AvatarFallback>
          </Avatar>

          <span>{session?.user?.name ?? 'll'}</span>
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>{session?.user.email}</DropdownMenuLabel>

        <DropdownMenuSeparator />

        {session?.user?.role === '00' && (
          <Link href="/article/add" target="_blank">
            <DropdownMenuItem className="cursor-pointer">
              <div className="flex items-center">
                <Icon icon="lucide:feather" className="w-5 h-5 mx-2" />
                <span>写文章</span>
              </div>
            </DropdownMenuItem>
          </Link>
        )}

        <DropdownMenuItem className="cursor-pointer" onClick={() => signOut()}>
          <div className="flex items-center">
            <Icon icon="lucide:log-out" className="w-5 h-5 mx-2" />
            <span>退出登录</span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default function LayoutHeader() {
  const { data: session, status } = useSession()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 bg-white/80 dark:bg-black/90 backdrop-blur-sm transition-all duration-300 ease-in-out ${scrolled ? 'shadow-md' : ''}`}
    >
      <div className="flex justify-between items-center px-2 sm:px-4 lg:px-6 py-2">
        <Link href="/" className="flex items-center space-x-2 group">
          <BlogLogo></BlogLogo>
        </Link>

        <NavList />

        <div className="flex items-center space-x-4">
          {status === 'unauthenticated' && (
            <Link href="/login">
              <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-white dark:bg-gray-800 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300 shadow-sm hover:shadow-md">
                <Icon icon="ri:aed-line" className="mr-2 w-5 h-5" />
                登录
              </div>
            </Link>
          )}

          {status === 'authenticated' && <UserAvatar session={session} />}
        </div>
      </div>
    </header>
  )
}
