import { auth } from '@/lib/auth/server'
import { prisma } from '@/lib/prisma'
import { sendJson } from '@/lib/utils'

// 读取当前 Neon Auth 会话（含 user）。无会话返回 null。
export async function getAuthSession() {
  const { data } = await auth.getSession()
  return data
}

// 服务端管理员校验：先校验登录态，再用 profiles.role 判定是否为管理员（00）。
export async function requireAdmin() {
  const session = await getAuthSession()

  if (!session?.user) {
    return {
      error: sendJson({ code: 401, msg: '请先登录' }),
      session: null
    }
  }

  const profile = await prisma.profile.findUnique({
    where: { id: session.user.id },
    select: { role: true }
  })

  if (profile?.role !== '00') {
    return {
      error: sendJson({ code: 403, msg: '无权限操作' }),
      session: null
    }
  }

  return { error: null, session }
}
