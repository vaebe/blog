'use client'

import './globals.css'
import '@/lib/date'
import { Inter as FontSans } from 'next/font/google'
import { cn } from '@/lib/utils'
import { ThemeProvider } from 'next-themes'
import { SessionProvider } from 'next-auth/react'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as SonnerToaster } from '@/components/ui/sonner'

import { Artdots } from '@/components/artdots'
import Script from 'next/script'
import { Analytics } from '@vercel/analytics/react'

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans'
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh" suppressHydrationWarning>
      <head>
        <title>vaebe blog</title>
        <meta
          name="description"
          content="我是 Vaebe，一名全栈开发者，专注于前端技术。我的主要技术栈是 Vue 及其全家桶，目前也在使用 React 来构建项目，比如这个博客，它使用 Next.js。"
        />
        <link rel="alternate" type="application/rss+xml" title="RSS Feed" href="/feed.xml" />
        <link rel="icon" type="image/png" href="/favicon/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="/favicon/favicon.svg" />
        <link rel="shortcut icon" href="/favicon/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
        <link rel="manifest" href="/favicon/site.webmanifest" />
      </head>

      <Script
        src="//busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js"
        strategy="lazyOnload"
      />
      <body
        className={cn(
          'min-h-screen flex flex-col bg-white dark:bg-black text-black dark:text-white',
          fontSans.variable
        )}
      >
        <SessionProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
            <Artdots className="fixed top-0 left-0 z-[-1]"></Artdots>
          </ThemeProvider>
        </SessionProvider>

        <Analytics />

        <Toaster />
        <SonnerToaster position="bottom-center"></SonnerToaster>
      </body>
    </html>
  )
}
