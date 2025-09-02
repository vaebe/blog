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

      <div className="w-full h-full pointer-events-none fixed inset-0 select-none bg-[url('/grid-black.svg')] bg-top bg-repeat dark:bg-[url('/grid.svg')]"></div>
    </>
  )
}
