'use client'

import { Icon } from '@iconify/react'
import { signOut, useSession } from 'next-auth/react'
import { routerList } from '@/lib/routers'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

function NavList() {
  return (
    <ul className="flex space-x-1">
      {routerList.map((item) => (
        <li key={item.path}>
          <Link
            href={item.path}
            className="px-6 py-1 text-lg font-medium rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-100 ease-in-out"
          >
            {item.name}
          </Link>
        </li>
      ))}
    </ul>
  )
}

function UserAvatarItem({
  icon,
  name,
  onClick
}: {
  icon: string
  name: string
  onClick?: () => void
}) {
  return (
    <div
      className="py-0.5 flex items-center cursor-pointer rounded bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300 ease-in-out transform hover:scale-110"
      onClick={onClick}
    >
      <Icon icon={icon} className="w-5 h-5 mx-2" />
      <span>{name}</span>
    </div>
  )
}

function UserAvatar({ session }: { session: any }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="flex items-center space-x-2 cursor-pointer">
          <Avatar className="w-8 h-8">
            <AvatarImage src={session.user.image ?? ''} alt="user" />
            <AvatarFallback>{session.user.name ?? 'll'}</AvatarFallback>
          </Avatar>

          <span>{session?.user?.name ?? 'll'}</span>
        </div>
      </PopoverTrigger>
      <PopoverContent>
        <div className="grid gap-2">
          {session?.user?.role === '00' && (
            <Link href="/article/add" target="_blank">
              <UserAvatarItem icon="lucide:feather" name="写文章" />
            </Link>
          )}

          <UserAvatarItem name="退出登录" icon="lucide:log-out" onClick={() => signOut()} />
        </div>
      </PopoverContent>
    </Popover>
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

  const githubName = process.env.NEXT_PUBLIC_GITHUB_USER_NAME

  return (
    <header
      className={`sticky top-0 z-50 bg-white/80 dark:bg-black/90 backdrop-blur-sm transition-all duration-300 ease-in-out ${scrolled ? 'shadow-md' : ''}`}
    >
      <div className="flex justify-between items-center px-2 sm:px-4 lg:px-6 py-2">
        <Link href="/" className="flex items-center space-x-2 group">
          <h1 className="text-2xl font-bold">{githubName}</h1>
        </Link>

        <nav className="hidden md:block">
          <NavList />
        </nav>

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
