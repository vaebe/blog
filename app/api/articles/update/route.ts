import { revalidateTag } from 'next/cache'
import { sendJson } from '@/lib/utils'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'
import { ARTICLES_CACHE_TAG } from '@/lib/articles'
import { validateArticleInput } from '@/lib/articles/validate'

export async function PUT(req: Request) {
  const { error } = await requireAdmin()
  if (error) return error

  try {
    const body = await req.json()
    const { id, title, content, classify, coverImg, summary, status } = body

    const valid = validateArticleInput({ title, content, summary })
    if (!valid.ok) return sendJson({ code: -1, msg: valid.msg })

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

    revalidateTag(ARTICLES_CACHE_TAG, 'max')

    return sendJson({ data: updatedArticle })
  } catch (error) {
    console.error(error)
    return sendJson({ code: -1, msg: '更新文章数据失败!' })
  }
}
