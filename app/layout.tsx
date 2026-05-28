import './globals.css'
import { Geist, Geist_Mono, Bricolage_Grotesque } from 'next/font/google'
import { cn } from '@/lib/utils'
import Script from 'next/script'
import { Analytics } from '@vercel/analytics/react'
import { Providers } from './providers'
import { Metadata } from 'next'

// 正文：Geist —— 中性而有现代感，替换了千篇一律的 Inter
const fontSans = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans'
})

// 等宽：代码与数字标签
const fontMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono'
})

// 展示字：Bricolage Grotesque —— 有性格的怪诞体，用于姓名、年份等大标题
const fontDisplay = Bricolage_Grotesque({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-bricolage'
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
      <body
        className={cn(
          'min-h-screen flex flex-col bg-background text-foreground font-sans antialiased',
          fontSans.variable,
          fontMono.variable,
          fontDisplay.variable
        )}
      >
        <Providers>{children}</Providers>
        <Analytics />
        {/* 第三方统计脚本，hydration 之后再加载，避免阻塞首屏与 TTI */}
        <Script
          src="//busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  )
}
