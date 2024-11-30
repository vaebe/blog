import './globals.css'
import { Inter as FontSans } from 'next/font/google'
import { cn } from '@/lib/utils'
import Script from 'next/script'
import { Analytics } from '@vercel/analytics/react'
import { Providers } from './providers'
import { Metadata } from 'next'

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans'
})

export const metadata: Metadata = {
  title: 'vaebe blog',
  description:
    '我是 Vaebe，一名全栈开发者，专注于前端技术。我的主要技术栈是 Vue 及其全家桶，目前也在使用 React 来构建项目，比如这个博客，它使用 Next.js。',
  icons: {
    icon: [
      {
        url: '/favicon/favicon-96x96.png',
        sizes: '96x96',
        type: 'image/png'
      },
      {
        url: '/favicon/favicon.svg',
        type: 'image/svg+xml'
      }
    ],
    shortcut: ['/favicon/favicon.ico'],
    apple: [
      {
        url: '/favicon/apple-touch-icon.png',
        sizes: '180x180'
      }
    ]
  },
  manifest: '/favicon/site.webmanifest',
  alternates: {
    types: {
      'application/rss+xml': '/feed.xml'
    }
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh" suppressHydrationWarning>
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
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  )
}
