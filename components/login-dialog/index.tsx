'use client'

import React, { useState } from 'react'
import { FullScreenLoading } from '@/components/screen-loading'
import { LoginForm } from './LoginForm'
import { GithubLoginButton } from './GithubLoginButton'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogDescription
} from '@/components/ui/dialog'

interface Props {
  children: React.ReactNode
  onClose?: () => void
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
            <DialogDescription>请选择下方任意一种方式登录</DialogDescription>
          </DialogHeader>

          <FullScreenLoading isLoading={isLoading} message="正在登录..."></FullScreenLoading>

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
