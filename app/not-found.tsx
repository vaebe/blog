import Link from 'next/link'
import { Icon } from '@iconify/react'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="text-center">
        <h1 className="font-display text-[8rem] leading-none md:text-[11rem]">404</h1>

        <p className="mt-2 text-lg text-muted-foreground">
          这里曾经或许有些什么，但现在它不见了。
        </p>

        <Link href="/" className="mt-8 inline-block">
          <Button className="rounded-full px-6">
            <Icon icon="flowbite:home-outline" className="mr-2 h-5 w-5" />
            返回首页
          </Button>
        </Link>
      </div>
    </div>
  )
}
