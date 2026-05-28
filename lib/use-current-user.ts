'use client'

import { useEffect, useState } from 'react'
import { authClient } from '@/lib/auth/client'

interface CurrentUser {
  id: string
  name: string | null
  email: string | null
  image: string | null
  role: string | null
}

// 模块级缓存：同一个 userId 下复用同一个 /api/me promise，
// 避免 Header / AddMessage 等多个组件同时挂载时发起多次相同请求。
let mePromiseCache: { userId: string; promise: Promise<string | null> } | null = null

function fetchMeRole(userId: string): Promise<string | null> {
  if (mePromiseCache?.userId === userId) {
    return mePromiseCache.promise
  }
  const promise = fetch('/api/me')
    .then((res) => res.json())
    .then((res) => (res?.data?.role ?? null) as string | null)
    .catch(() => null)
  mePromiseCache = { userId, promise }
  return promise
}

// 统一的客户端登录态：Neon Auth 会话 + profiles.role。
// role 不在会话里，需经 /api/me 获取（仅登录后请求一次）。
export function useCurrentUser() {
  const { data, isPending } = authClient.useSession()
  const [role, setRole] = useState<string | null>(null)
  const [roleLoading, setRoleLoading] = useState(false)

  const userId = data?.user?.id

  useEffect(() => {
    if (!userId) {
      setRole(null)
      mePromiseCache = null
      return
    }

    let active = true
    setRoleLoading(true)
    fetchMeRole(userId)
      .then((r) => {
        if (active) setRole(r)
      })
      .finally(() => {
        if (active) setRoleLoading(false)
      })

    return () => {
      active = false
    }
  }, [userId])

  const user: CurrentUser | null = data?.user
    ? {
        id: data.user.id,
        name: data.user.name ?? null,
        email: data.user.email ?? null,
        image: data.user.image ?? null,
        role
      }
    : null

  return {
    user,
    role,
    isAuthenticated: !!data?.user,
    isAdmin: role === '00',
    isLoading: isPending || roleLoading
  }
}
