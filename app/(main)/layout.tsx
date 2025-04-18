import LayoutHeader from '@/components/layout/header'
import LayoutFooter from '@/components/layout/footer'
import { ThemeSwitch } from '@/components/theme-switch'
import { Artdots } from '@/components/artdots'

export default function BaseLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <LayoutHeader></LayoutHeader>
      <main className="my-4">{children}</main>
      <LayoutFooter></LayoutFooter>
      <ThemeSwitch />
      <Artdots className="fixed top-0 left-0 z-[-1]" />
    </>
  )
}
