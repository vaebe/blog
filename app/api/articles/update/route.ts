import { PrismaClient } from '@prisma/client'
import { sendJson } from '@/lib/utils'

const prisma = new PrismaClient()

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
    return sendJson({ code: -1, msg: 'Failed to update article' })
  }
}
