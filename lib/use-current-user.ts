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
  // 失败/无角色时清空缓存，使后续调用可重试，避免“粘性 null”导致一直非管理员。
  promise.then((role) => {
    if (role === null && mePromiseCache?.userId === userId) {
      mePromiseCache = null
    }
  })
  mePromiseCache = { userId, promise }
  return promise
}

// 统一的客户端登录态：Neon Auth 会话 + profiles.role。
// role 不在会话里，需经 /api/me 获取（仅登录后请求一次）。
export function useCurrentUser() {
  const { data, isPending } = authClient.useSession()
  // 记录“某个 userId 对应的角色已解析完成”的结果，避免竞态：
  // 只有当 resolved.userId === 当前 userId 时，role 才被视为已就绪。
  const [resolved, setResolved] = useState<{ userId: string; role: string | null } | null>(null)

  const userId = data?.user?.id

  useEffect(() => {
    if (!userId) {
      mePromiseCache = null
      return
    }

    let active = true
    fetchMeRole(userId).then((r) => {
      if (active) setResolved({ userId, role: r })
    })

    return () => {
      active = false
    }
  }, [userId])

  // 当前用户的角色是否已解析（解析结果须与当前 userId 匹配）。
  const roleResolved = !!userId && resolved?.userId === userId
  const role = roleResolved ? (resolved?.role ?? null) : null

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
    // 会话加载中，或“已登录但该用户角色尚未解析完成”都算加载中，
    // 避免 RequireAdmin 在 role 取回前误判非管理员而跳转。
    isLoading: isPending || (!!userId && !roleResolved)
  }
}
