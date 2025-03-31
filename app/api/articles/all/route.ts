import { sendJson } from '@/lib/utils'
import { prisma } from '@/prisma'
import { Article } from '@prisma/client'
import { kv } from '@vercel/kv'
import { TimeInSeconds } from '@/lib/enums'

const InfoKey = 'blog-all-articles'

export async function GET() {
  const cachedInfo = await kv.get<Article[]>(InfoKey)

  if (cachedInfo) {
    return sendJson({ data: cachedInfo })
  }

  try {
    const articles = await prisma.article.findMany({
      orderBy: { createdAt: 'desc' }
    })

    await kv.set(InfoKey, articles, { ex: TimeInSeconds.oneDay })

    return sendJson({ data: articles })
  } catch (error) {
    return sendJson({ code: -1, msg: `获取所有文章失败：${error}` })
  }
}
