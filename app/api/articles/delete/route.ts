import { revalidateTag } from 'next/cache'
import { sendJson } from '@/lib/utils'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'
import { ARTICLES_CACHE_TAG } from '@/lib/articles'

export async function DELETE(req: Request) {
  const { error } = await requireAdmin()
  if (error) return error

  try {
    const { id } = await req.json()

    await prisma.article.delete({
      where: { id }
    })

    revalidateTag(ARTICLES_CACHE_TAG, 'max')

    return sendJson({ msg: 'success' })
  } catch (error) {
    console.error('删除文章失败:', error)
    return sendJson({ code: -1, msg: '删除文章失败，请稍后重试' })
  }
}
