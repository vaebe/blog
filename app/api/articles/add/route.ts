import { sendJson, generateUUID } from '@/lib/utils'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
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
        userId: 1 // 示例，通常从认证信息中获取用户ID
      }
    })
    return sendJson({ data: newArticle })
  } catch (error) {
    sendJson({ code: -1, msg: `创建文章失败：${error}` })
  }
}
