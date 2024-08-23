'use client'

import './globals.css'
import 'bytemd/dist/index.css'
import 'juejin-markdown-themes/dist/juejin.css'
import { Inter as FontSans } from "next/font/google"
import { cn } from "@/lib/utils"
import LayoutHeader from '@/components/layout/header'
import LayoutFooter from '@/components/layout/footer'
import { ThemeProvider } from 'next-themes'

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export default function RootLayout({ children, }: { children: React.ReactNode }) {
  return (
    <html lang="zh">
      <body
        className={cn(
          "min-h-screen flex flex-col bg-gradient-to-b from-gray-100 to-white dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100",
          fontSans.variable
        )}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <LayoutHeader></LayoutHeader>

          <main className="flex-grow">
            {children}
          </main>

          <LayoutFooter></LayoutFooter>
        </ThemeProvider>
      </body>
    </html>
  )
}