'use client'

import '@/lib/date'
import { ThemeProvider } from 'next-themes'
import { SessionProvider } from 'next-auth/react'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as SonnerToaster } from '@/components/ui/sonner'
import { Artdots } from '@/components/artdots'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {children}
        <Artdots className="fixed top-0 left-0 z-[-1]" />
        <Toaster />
        <SonnerToaster position="bottom-center" />
      </ThemeProvider>
    </SessionProvider>
  )
}
