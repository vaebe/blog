import { sendJson } from '@/lib/utils'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions'
import { prisma } from '@/prisma'

// 获取 AI 消息详情
export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return sendJson({ code: 401, msg: `无权限!` })
  }

  try {
    // 从 URL 获取查询参数
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return sendJson({ code: 400, msg: `参数不正确!` })
    }

    const message = await prisma.aIMessage.findMany({
      where: {
        conversationId: id,
        userId: session.user.id
      },
      orderBy: { createdAt: 'asc' }
    })

    return sendJson({ data: message })
  } catch (error) {
    console.error(error)
    return sendJson({ code: -1, msg: `获取AI消息详情失败: ${error}` })
  }
}
