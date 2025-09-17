'use client'

import React, { useState } from 'react'
import { LoginForm } from './LoginForm'
import { GithubLoginButton } from './GithubLoginButton'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogDescription
} from '@/components/ui/dialog'
import { Icon } from '@iconify/react'

interface Props {
  children: React.ReactNode
  onClose?: () => void
}

function LoginTips() {
  return (
    <div className="flex items-center justify-center">
      <span className="bg-gradient-to-r from-indigo-400 via-pink-500 to-yellow-400 gradient-anim bg-clip-text text-transparent font-medium">
        正在登录中
      </span>
      <Icon icon="eos-icons:three-dots-loading" className="h-6! w-6!"></Icon>
    </div>
  )
}

const LoginDialog = ({ onClose, children }: Props) => {
  const [isLoading, setIsLoading] = useState(false)

  const [isOpen, setIsOpen] = useState<boolean>(false)

  function openDialog() {
    setIsOpen(true)
  }

  function closeDialog() {
    setIsOpen(false)
    onClose?.()
  }

  return (
    <>
      <div onClick={openDialog}>{children}</div>

      <Dialog open={isOpen} onOpenChange={closeDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>登录</DialogTitle>

            <DialogDescription className=" text-center">
              {isLoading ? <LoginTips></LoginTips> : '请选择下方任意一种方式登录'}
            </DialogDescription>
          </DialogHeader>

          <LoginForm setIsLoading={setIsLoading} closeDialog={closeDialog} />

          <div className="w-full my-1 h-[1px] bg-gray-300 dark:bg-gray-600"></div>

          <GithubLoginButton setIsLoading={setIsLoading} />
        </DialogContent>
      </Dialog>
    </>
  )
}

export { LoginDialog }
export default LoginDialog
