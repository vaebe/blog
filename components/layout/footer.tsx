'use client'
import { routerList } from '@/lib/routers'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { toast } from 'sonner'
import { emailRegex } from '@/lib/utils'
import { Icon } from '@iconify/react'

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

const htmlTemplate = `
    <!DOCTYPE html>
    <html lang="zh-CN">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>感谢您的订阅</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #4a4a4a;">首先感谢您订阅我的博客！</h1>
        <p>我会不定期更新自己在 vue 、react 相关的实践!</p>
        <p>如果您有任何问题或建议，可以使用邮件或留言板与我联系。</p>
        <p>再次感谢您的支持！</p>
        <p>祝您生活愉快！</p>
      </div>
    </body>
    </html>
  `

function Subscription({ className }: { className: string }) {
  const [email, setEmail] = useState('')

  async function sendSubscriptionEmail() {
    // 判断是否是一个合法的邮箱
    if (!emailRegex.test(email)) {
      toast.warning('请输入合法的邮箱地址')
      return
    }

    const res = await fetch('/api/sendEmail', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        toEmail: email,
        subject: '感谢您订阅 vaebe 博客',
        html: htmlTemplate
      })
    }).then((res) => res.json())

    if (res.code !== 0) {
      toast.warning(res.msg)
      return
    }

    setEmail('')

    toast.success(res.msg)
  }

  return (
    <div className={className}>
      <h3 className="text-lg font-semibold mb-4">订阅</h3>
      <p className="text-gray-500 mb-4">可以及时获取我的最新动态</p>

      <div className=" grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="输入您的邮箱"
            className="rounded-r-none"
          ></Input>

          <Button className="rounded-l-none" onClick={sendSubscriptionEmail}>
            订阅
          </Button>
        </div>

        <Link
          href="/rss"
          target="_blank"
          className="flex items-center justify-end hover:text-gray-500"
        >
          <p className="mr-4 text-lg">RSS 订阅</p>
          <Icon icon="mingcute:rss-2-fill" width="24px"></Icon>
        </Link>
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
