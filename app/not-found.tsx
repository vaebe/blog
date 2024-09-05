import Link from 'next/link'
import { Icon } from '@iconify/react'

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
      <div className="text-center">
        <h1 className="mb-4 text-6xl font-semibold text-white">404</h1>
        <p className="mb-4 text-lg text-white">哎呀! 看来您迷路了。</p>
        <div className="animate-bounce">
          <svg
            className="mx-auto h-16 w-16 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            />
          </svg>
        </div>
        <p className="mt-4 text-gray-100">别担心,让我们带您回到安全的地方。</p>
        <Link
          href="/"
          className="inline-flex items-center px-4 py-2 mt-8 font-semibold text-purple-600 bg-white rounded-lg shadow-md hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-purple-200 transition-colors duration-200"
        >
          <Icon icon="flowbite:home-outline" className="w-5 h-5 mr-2"></Icon>
          返回首页
        </Link>
      </div>
    </div>
  )
}
