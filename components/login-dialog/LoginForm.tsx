'use client'

import React, { useState } from 'react'
import { authClient } from '@/lib/auth/client'
import { Icon } from '@iconify/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

interface Props {
  setIsLoading: (status: boolean) => void
  closeDialog: () => void
}

// 邮箱验证码（Email OTP）两步登录：输入邮箱发码 → 输入验证码登录
const LoginForm = ({ setIsLoading, closeDialog }: Props) => {
  const [step, setStep] = useState<'email' | 'otp'>('email')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')

  // 发送验证码
  const sendOtp = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) {
      toast('请输入邮箱!')
      return
    }

    setIsLoading(true)
    const { error } = await authClient.emailOtp.sendVerificationOtp({
      email,
      type: 'sign-in'
    })
    setIsLoading(false)

    if (error) {
      toast(`验证码发送失败：${error.message ?? ''}`)
      return
    }

    setStep('otp')
    toast('验证码已发送，请查收邮箱')
  }

  // 校验验证码并登录
  const verifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!otp) {
      toast('请输入验证码!')
      return
    }

    setIsLoading(true)
    const { error } = await authClient.signIn.emailOtp({ email, otp })
    setIsLoading(false)

    if (error) {
      toast('验证码不正确或已过期!')
      return
    }

    closeDialog()
    toast('欢迎回来！')
  }

  if (step === 'otp') {
    return (
      <form onSubmit={verifyOtp} className="space-y-4">
        <div className="relative rounded-md shadow-sm">
          <label htmlFor="otp" className="sr-only">
            验证码
          </label>
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon icon="mdi:shield-key-outline" className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            id="otp"
            name="otp"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            className="pl-10 block w-full"
            placeholder="请输入邮箱验证码"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
        </div>

        <Button className="w-full cursor-pointer" type="submit">
          验证码登录
        </Button>

        <div className="flex justify-between text-sm text-gray-500">
          <button
            type="button"
            className="cursor-pointer hover:underline"
            onClick={() => setStep('email')}
          >
            返回修改邮箱
          </button>
          <button type="button" className="cursor-pointer hover:underline" onClick={sendOtp}>
            重新发送
          </button>
        </div>
      </form>
    )
  }

  return (
    <form onSubmit={sendOtp} className="space-y-4">
      <div className="relative rounded-md shadow-sm">
        <label htmlFor="email" className="sr-only">
          邮箱
        </label>
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon icon="mdi:email-outline" className="h-5 w-5 text-gray-400" />
        </div>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          className="pl-10 block w-full"
          placeholder="请输入邮箱"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <Button className="w-full cursor-pointer" type="submit">
        发送验证码
      </Button>
    </form>
  )
}

export { LoginForm }
export default LoginForm
