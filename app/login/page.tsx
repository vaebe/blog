'use client'

import React, { useState } from 'react'
import { signIn } from 'next-auth/react'
import { Icon } from '@iconify/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/hooks/use-toast'
import { motion, AnimatePresence } from 'framer-motion'
import { FullScreenLoading } from '@/components/screen-loading'

interface LoginFormProps {
  onSubmit: (account: string, password: string) => Promise<void>
}

const LoginForm = ({ onSubmit }: LoginFormProps) => {
  const [account, setAccount] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(account, password)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="account" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            用户名
          </Label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Icon icon="mdi:account" className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              id="account"
              name="account"
              type="text"
              required
              className="pl-10 block w-full border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="请输入用户名"
              value={account}
              onChange={(e) => setAccount(e.target.value)}
            />
          </div>
        </div>
        <div>
          <Label
            htmlFor="password"
            className="text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            密码
          </Label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Icon icon="mdi:lock" className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              id="password"
              name="password"
              type="password"
              required
              className="pl-10 block w-full border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="请输入密码"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>
      </div>
      <Button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition-colors duration-300"
      >
        登录
      </Button>
    </form>
  )
}

interface GithubLoginButtonProps {
  onClick: () => void
}

const GithubLoginButton = ({ onClick }: GithubLoginButtonProps) => (
  <Button
    className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors duration-300"
    onClick={onClick}
  >
    <Icon icon="mdi:github" className="mr-2 h-5 w-5" />
    Github 登录
  </Button>
)

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleCredentialsLogin = async (account: string, password: string) => {
    setIsLoading(true)
    const res = await signIn('credentials', {
      redirect: false,
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

  function handleGithubLogin() {
    setIsLoading(true)

    signIn('github').catch((error) => {
      setIsLoading(false)
      toast({ title: '登录失败', description: error, variant: 'destructive' })
    })
  }

  return (
    <div className="flex items-center justify-center min-h-screen dark:from-gray-900 dark:to-gray-800 transition-all duration-500">
      <FullScreenLoading isLoading={isLoading}></FullScreenLoading>

      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md p-8 space-y-4 bg-white dark:bg-gray-800 rounded-2xl shadow transition-all duration-300 hover:shadow-xl"
        >
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">登录</h2>
          </div>

          <LoginForm onSubmit={handleCredentialsLogin} />

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                  或者使用
                </span>
              </div>
            </div>

            <div className="mt-6">
              <GithubLoginButton onClick={handleGithubLogin} />
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default LoginPage
