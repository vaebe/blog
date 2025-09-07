import { sendJson } from '@/lib/utils'
import { prisma } from '@/lib/prisma'

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
    console.error(error)
    return sendJson({ code: -1, msg: '获取文章详情失败!' })
  }
}
