import { Suspense } from 'react'
import LayoutHeader from '@/components/layout/header'
import LayoutFooter from '@/components/layout/footer'
import { ThemeSwitch } from '@/components/theme-switch'

export default function BaseLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* header 依赖 usePathname / 登录态 等运行时数据，单独流式渲染，避免阻塞静态外壳 */}
      <Suspense fallback={<div className="sticky top-0 z-50 h-[52px]" />}>
        <LayoutHeader></LayoutHeader>
      </Suspense>
      <main className="my-4">{children}</main>
      <LayoutFooter></LayoutFooter>
      <ThemeSwitch />

      <div className="w-full h-full pointer-events-none fixed inset-0 select-none bg-[url('/grid-black.svg')] bg-top bg-repeat dark:bg-[url('/grid.svg')]"></div>
    </>
  )
}
