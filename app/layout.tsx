'use client'

import { useState, useEffect } from 'react'
import { Icon } from '@iconify/react'
import './globals.css'
import { Inter as FontSans } from "next/font/google"
import { cn } from "@/lib/utils"
import LayoutHeader from '@/components/layout/header'
import LayoutFooter from '@/components/layout/footer'

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  return (
    <html lang="zh">
      <body
        className={cn(
          "min-h-screen flex flex-col bg-gradient-to-b from-gray-100 to-white dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100",
          fontSans.variable
        )}>

        <LayoutHeader></LayoutHeader>

        <main className="flex-grow">
          {children}
        </main>

        <LayoutFooter></LayoutFooter>
      </body>
    </html>
  )
}