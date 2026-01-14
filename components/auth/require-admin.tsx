'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'

interface RequireAdminProps {
  children: React.ReactNode
}

export function RequireAdmin({ children }: RequireAdminProps) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      toast.error('请先登录')
      router.push('/')
      return
    }

    if (status === 'authenticated' && session?.user?.role !== '00') {
      toast.error('无权限访问')
      router.push('/')
      return
    }
  }, [status, session, router])

  // 加载中或未授权时不显示内容
  if (status === 'loading' || status === 'unauthenticated') {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">正在验证权限...</p>
        </div>
      </div>
    )
  }

  // 已授权但不是管理员
  if (status === 'authenticated' && session?.user?.role !== '00') {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-red-600 text-lg font-medium mb-2">无权限访问</p>
          <p className="text-gray-600">您没有权限访问此页面</p>
        </div>
      </div>
    )
  }

  // 已授权且是管理员，显示内容
  return <>{children}</>
}
