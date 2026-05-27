'use client'

import '@/lib/date'
import { ThemeProvider } from 'next-themes'
import { Toaster } from '@/components/ui/sonner'

// Neon Auth 的 authClient 基于内部 store，无需 React Provider；
// 故此处仅保留主题与 Toaster。
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
      <Toaster position="bottom-right" />
    </ThemeProvider>
  )
}
