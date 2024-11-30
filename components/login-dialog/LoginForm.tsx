'use client'

import React, { useState } from 'react'
import { signIn } from 'next-auth/react'
import { Icon } from '@iconify/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/hooks/use-toast'
import { EmailLoginButton } from './EmailLoginButton'

interface Props {
  setIsLoading: (status: boolean) => void
}

const LoginForm = ({ setIsLoading }: Props) => {
  const [account, setAccount] = useState('')
  const [password, setPassword] = useState('')
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setIsLoading(true)

    const res = await signIn('credentials', {
      account,
      password
    })

    setIsLoading(false)

    if (res?.error) {
      toast({ title: '登录失败', description: '请检查您的用户名和密码', variant: 'destructive' })
    } else {
      toast({ title: '登录成功', description: '欢迎回来！' })
    }
  }

  function handleEmailLogin() {
    if (!account) {
      toast({ title: '登录失败', description: '请输入邮箱', variant: 'destructive' })
      return
    }

    setIsLoading(true)

    signIn('email', { email: account, callbackUrl: '/auth/verify-request?provider=email' }).catch(
      (error) => {
        setIsLoading(false)
        toast({ title: '登录失败', description: error, variant: 'destructive' })
      }
    )
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Icon icon="mdi:account" className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              id="account"
              name="account"
              type="text"
              className="pl-10 block w-full"
              placeholder="请输入用户名"
              value={account}
              onChange={(e) => setAccount(e.target.value)}
            />
          </div>

          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Icon icon="mdi:lock" className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              id="password"
              name="password"
              type="password"
              className="pl-10 block w-full"
              placeholder="请输入密码"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>
        <Button className="w-full" type="submit">
          账号密码登录
        </Button>
      </form>

      <EmailLoginButton onClick={handleEmailLogin}></EmailLoginButton>
    </>
  )
}

export { LoginForm }
export default LoginForm
