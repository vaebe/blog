'use client'

import { Icon } from '@iconify/react'
import { signOut, useSession } from 'next-auth/react'
import { routerList } from '@/lib/routers'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'

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
      className={`sticky top-0 z-50 bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm transition-all duration-300 ease-in-out ${scrolled ? 'shadow-md' : ''}`}
    >
      <div className="flex justify-between items-center px-2 sm:px-4 lg:px-6 py-2">
        <Link href="/" className="flex items-center space-x-2 group">
          <Icon
            icon="lucide:feather"
            className="w-8 h-8 text-primary group-hover:text-primary/80 transition-colors duration-300"
          />
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

          {status === 'authenticated' && (
            <Avatar>
              <AvatarImage src={session.user.image as string} alt="@shadcn" />
              <AvatarFallback>{session.user.name ?? 'LL'}</AvatarFallback>
            </Avatar>
          )}

          {status === 'authenticated' && (
            <button
              onClick={() => signOut()}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300 ease-in-out transform hover:scale-110"
              aria-label="Sign out"
            >
              <Icon icon="uis:signout" className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
