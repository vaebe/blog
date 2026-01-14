import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions'
import { sendJson } from '@/lib/utils'

export async function getAuthSession() {
  return await getServerSession(authOptions)
}

export async function requireAdmin() {
  const session = await getAuthSession()

  if (!session?.user) {
    return {
      error: sendJson({ code: 401, msg: '请先登录' }),
      session: null
    }
  }

  if (session.user.role !== '00') {
    return {
      error: sendJson({ code: 403, msg: '无权限操作' }),
      session: null
    }
  }

  return { error: null, session }
}
