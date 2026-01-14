import { sendJson, generateUUID } from '@/lib/utils'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'

export async function POST(req: Request) {
  const { error, session } = await requireAdmin()
  if (error) return error

  try {
    const body = await req.json()
    const { title, content, classify, coverImg, summary } = body

    const newArticle = await prisma.article.create({
      data: {
        id: generateUUID(),
        title,
        content,
        classify,
        coverImg,
        summary,
        status: '01',
        source: '00',
        userId: parseInt(session!.user.id)
      }
    })
    return sendJson({ data: newArticle })
  } catch (error) {
    console.error(error)
    return sendJson({ code: -1, msg: '创建文章失败，请稍后重试' })
  }
}
