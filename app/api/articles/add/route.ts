import { revalidateTag } from 'next/cache'
import { sendJson, generateUUID } from '@/lib/utils'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'
import { ARTICLES_CACHE_TAG } from '@/lib/articles'
import { validateArticleInput } from '@/lib/articles/validate'

export async function POST(req: Request) {
  const { error, session } = await requireAdmin()
  if (error) return error

  try {
    const body = await req.json()
    const { title, content, classify, coverImg, summary } = body

    const valid = validateArticleInput({ title, content, summary })
    if (!valid.ok) return sendJson({ code: -1, msg: valid.msg })

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
        userId: session!.user.id
      }
    })
    revalidateTag(ARTICLES_CACHE_TAG, 'max')

    return sendJson({ data: newArticle })
  } catch (error) {
    console.error(error)
    return sendJson({ code: -1, msg: '创建文章失败，请稍后重试' })
  }
}
