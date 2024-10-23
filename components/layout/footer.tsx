'use client'
import { routerList } from '@/lib/routers'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function LayoutFooter() {
  const githubUserName = process.env.NEXT_PUBLIC_GITHUB_USER_NAME ?? ''

  return (
    <footer className="dark:text-white bg-transparent">
      <div className="max-w-5xl mx-auto px-2 my-4">
        <NavList></NavList>

        <Subscription className="mt-4"></Subscription>

        <Copyright githubUserName={githubUserName}></Copyright>
      </div>
    </footer>
  )
}

function NavList() {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">快速链接</h3>
      <ul className="flex items-center space-x-2">
        {routerList.map((item) => (
          <li key={item.path}>
            <Link href={item.path} className="text-gray-500 hover:text-black hover:dark:text-white">
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

function Subscription({ className }: { className: string }) {
  return (
    <div className={className}>
      <h3 className="text-lg font-semibold mb-4">订阅</h3>
      <p className="text-gray-500 mb-4">可以及时获取我的最新动态</p>

      <div className="flex items-center">
        <Input type="email" placeholder="输入您的邮箱" className="rounded-r-none"></Input>

        <Button className=" rounded-l-none">订阅</Button>
      </div>
    </div>
  )
}

function Copyright({ githubUserName }: { githubUserName: string }) {
  return (
    <div className="mt-8 pt-8 border-t text-center">
      <Link
        href={`https://github.com/${githubUserName}/blog/blob/main/LICENSE`}
        target="_blank"
        rel="noopener noreferrer"
        className="mr-2 hover:text-blue-500 dark:hover:text-blue-400"
      >
        Released under the MIT License.
      </Link>
      <Link
        href={`https://github.com/${githubUserName}`}
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-blue-500 dark:hover:text-blue-400"
      >
        Copyright © 2024-present {githubUserName}.
      </Link>
    </div>
  )
}
