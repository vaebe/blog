import { sendJson } from '@/lib/utils'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'

export async function DELETE(req: Request) {
  const { error } = await requireAdmin()
  if (error) return error

  try {
    const { id } = await req.json()

    await prisma.article.delete({
      where: { id }
    })

    return sendJson({ msg: 'success' })
  } catch (error) {
    console.error('删除文章失败:', error)
    return sendJson({ code: -1, msg: '删除文章失败，请稍后重试' })
  }
}
