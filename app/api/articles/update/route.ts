import { sendJson } from '@/lib/utils'
import { prisma } from '@/prisma'

export async function PUT(req: Request) {
  try {
    const body = await req.json()
    const { id, title, content, classify, coverImg, summary, status } = body

    const updatedArticle = await prisma.article.update({
      where: { id },
      data: {
        title,
        content,
        classify,
        coverImg,
        summary,
        status
      }
    })

    return sendJson({ data: updatedArticle })
  } catch (error) {
    console.error(error)
    return sendJson({ code: -1, msg: '更新文章数据失败!' })
  }
}
