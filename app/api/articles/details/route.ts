import { PrismaClient } from '@prisma/client'
import { sendJson } from '@/lib/utils'

const prisma = new PrismaClient()

export async function GET(req: Request) {
  const url = new URL(req.url)
  const id = url.searchParams.get('id') // 从查询参数中获取 id

  try {
    if (!id) {
      return sendJson({ code: -1, msg: 'id 不存在' })
    }

    const article = await prisma.article.findUnique({
      where: { id: id }
    })

    return sendJson({ data: article })
  } catch (error) {
    return sendJson({ code: -1, msg: 'Failed to fetch article' })
  }
}
