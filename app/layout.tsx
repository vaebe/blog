'use client'

import './globals.css'
import '@/lib/date'
import { Inter as FontSans } from 'next/font/google'
import { cn } from '@/lib/utils'
import { ThemeProvider } from 'next-themes'
import { SessionProvider } from 'next-auth/react'
import { Toaster } from '@/components/ui/toaster'
import { ThemeSwitch } from '@/components/theme-switch'
import { Artdots } from '@/components/artdots'
import Script from 'next/script'

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans'
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh" suppressHydrationWarning>
      <body
        className={cn(
          'min-h-screen flex flex-col bg-white dark:bg-black text-black dark:text-white',
          fontSans.variable
        )}
      >
        <Script
          src="//busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js"
          strategy="lazyOnload"
        />

        <SessionProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
            <Artdots className="fixed top-0 left-0 z-[-1]"></Artdots>
            <ThemeSwitch />
          </ThemeProvider>
        </SessionProvider>

        <Toaster />
      </body>
    </html>
  )
}
