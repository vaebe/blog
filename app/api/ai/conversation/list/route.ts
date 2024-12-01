import { sendJson } from '@/lib/utils'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions'
import { prisma } from '@/prisma'

// 获取用户的对话分组
export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return sendJson({ code: 401, msg: `无权限!` })
  }

  try {
    // 从 URL 获取查询参数
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '10')

    const skip = (page - 1) * pageSize

    const list = await prisma.aIConversation.findMany({
      where: {
        userId: session!.user.id,
        deletedAt: null
      },
      orderBy: { createdAt: 'desc' },
      skip: skip,
      take: pageSize
    })

    const total = await prisma.aIConversation.count({
      where: {
        userId: session!.user.id
      }
    })

    return sendJson({
      data: {
        list,
        total,
        currentPage: page,
        totalPages: Math.ceil(total / pageSize)
      }
    })
  } catch (error) {
    return sendJson({ code: -1, msg: `获取对话列表失败: ${error}` })
  }
}
