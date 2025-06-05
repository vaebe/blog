'use client'

import React, { useState } from 'react'
import { signIn } from 'next-auth/react'
import { Icon } from '@iconify/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
// import { EmailLoginButton } from './EmailLoginButton'

interface Props {
  setIsLoading: (status: boolean) => void
  closeDialog: () => void
}

const LoginForm = ({ setIsLoading, closeDialog }: Props) => {
  const [account, setAccount] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!account) {
      toast(`请输入邮箱!`)
      return
    }

    if (!password) {
      toast(`请输入密码!`)
      return
    }

    setIsLoading(true)

    const res = await signIn('credentials', {
      account,
      password,
      redirect: false
    })

    setIsLoading(false)

    if (res?.error) {
      toast('请检查您的用户名和密码!')
    } else {
      closeDialog()
      toast('欢迎回来！')
    }
  }

  // function handleEmailLogin() {
  //   if (!account) {
  //     toast(`请输入邮箱!`)
  //     return
  //   }

  //   setIsLoading(true)

  //   signIn('email', {
  //     email: account,
  //     callbackUrl: '/auth/verify-request?provider=email'
  //   }).catch((error) => {
  //     setIsLoading(false)
  //     toast(`登录失败： ${error}`)
  //   })
  // }

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
        <Button className="w-full cursor-pointer" type="submit">
          账号密码登录
        </Button>
      </form>

      {/* <EmailLoginButton onClick={handleEmailLogin}></EmailLoginButton> */}
    </>
  )
}

export { LoginForm }
export default LoginForm
