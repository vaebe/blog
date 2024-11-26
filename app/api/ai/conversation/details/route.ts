import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions'
import { sendJson } from '@/lib/utils'
import { prisma } from '@/prisma'
import { getServerSession } from 'next-auth'

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return sendJson({ code: 401, msg: `无权限!` })
  }

  const url = new URL(req.url)
  const id = url.searchParams.get('id') // 从查询参数中获取 id

  if (!id) {
    return sendJson({ code: 400, msg: '参数不正确!' })
  }

  try {
    const info = await prisma.aIConversation.findUnique({
      where: { id: id }
    })

    return sendJson({ data: info })
  } catch (error) {
    console.error(error)
    return sendJson({ code: -1, msg: '获取AI对话详情失败!' })
  }
}
