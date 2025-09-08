'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { toast } from 'sonner'
import { emailRegex } from '@/lib/utils'
import { sendEmail } from '@/app/actions/email'

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

interface LoadingPromiseProps {
  message: string
  description: string
}

function EmailSubscription() {
  const [email, setEmail] = useState('')

  async function sendSubscriptionEmail() {
    // 判断是否是一个合法的邮箱
    if (!emailRegex.test(email)) {
      toast.warning('请输入合法的邮箱地址')
      return
    }

    const loadingPromise = new Promise<LoadingPromiseProps>((resolve) => {
      sendEmail({ toEmail: email, subject: '感谢您订阅 vaebe 博客', html: htmlTemplate })
        .then((res) => {
          if (res.code !== 0) {
            resolve({ message: '订阅失败！', description: res.msg })
            return
          }

          setEmail('')

          resolve({ message: '订阅成功！', description: res.msg })
        })
        .catch((error) => {
          resolve({ message: '订阅失败！', description: error })
        })
    })

    toast.promise<LoadingPromiseProps>(loadingPromise, {
      loading: 'Loading...',
      success: (data) => data,
      error: 'Error'
    })
  }

  return (
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
  )
}

export { EmailSubscription }
