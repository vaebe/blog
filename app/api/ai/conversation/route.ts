import { sendJson } from '@/lib/utils'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions'
import { prisma } from '@/prisma'
import { randomUUID } from 'crypto'

// 获取用户的对话分组
export async function GET(req: Request) {
  // 未登录返回 null
  const session = await getServerSession(authOptions)

  try {
    // 从 URL 获取查询参数
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '10')

    const skip = (page - 1) * pageSize

    const list = await prisma.aIConversation.findMany({
      where: {
        userId: session!.user.id
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

export async function POST(req: Request) {
  // 未登录返回 null
  const session = await getServerSession(authOptions)

  try {
    const body = await req.json()
    const { name } = body

    const info = await prisma.aIConversation.create({
      data: {
        id: randomUUID().replaceAll('-', ''),
        name,
        userId: session!.user.id
      }
    })
    return sendJson({ data: info })
  } catch (error) {
    sendJson({ code: -1, msg: `创建对话失败 ${error}` })
  }
}
