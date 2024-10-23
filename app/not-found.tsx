import Link from 'next/link'
import { Icon } from '@iconify/react'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-6xl font-semibol">404</h1>

        <p className="my-4 text-lg">这里曾经或许有些什么，但是现在它不见了！</p>

        <div className="animate-bounce">
          <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            />
          </svg>
        </div>

        <p className="my-4">不过无需担心，点击下方按钮可以返回首页</p>

        <Link href="/">
          <Button>
            <Icon icon="flowbite:home-outline" className="w-5 h-5 mr-2"></Icon>
            返回首页
          </Button>
        </Link>
      </div>
    </div>
  )
}
