'use client'

import { createAuthClient } from '@neondatabase/auth/next'

// Neon Auth 客户端（基于 Better Auth）。无需 Provider，useSession 等 hook 由内部 store 驱动。
// 同源请求经本应用的 /api/auth/[...path] 代理到 Neon Auth 服务。
export const authClient = createAuthClient()
