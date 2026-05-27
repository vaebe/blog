import { sendJson } from '@/lib/utils'
import { prisma } from '@/lib/prisma'
import { getAuthSession } from '@/lib/auth'

// 返回当前登录用户的 profile（含自定义 role），供客户端做权限相关 UI 判定。
export async function GET() {
  const session = await getAuthSession()
  if (!session?.user) {
    return sendJson({ code: 401, msg: '未登录', data: null })
  }

  const profile = await prisma.profile.findUnique({
    where: { id: session.user.id },
    select: { id: true, role: true, name: true, email: true, image: true }
  })

  return sendJson({ data: profile })
}
