'use client'

import LayoutHeader from '@/components/layout/header'
import LayoutFooter from '@/components/layout/footer'
import { ThemeSwitch } from '@/components/theme-switch'

export default function BaseLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <LayoutHeader></LayoutHeader>
      <main className="my-4">{children}</main>
      <LayoutFooter></LayoutFooter>
      <ThemeSwitch />
    </>
  )
}
