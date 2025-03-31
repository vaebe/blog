import { sendJson } from '@/lib/utils'
import { prisma } from '@/prisma'

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json()

    await prisma.article.delete({
      where: { id }
    })

    return sendJson({ msg: 'success' })
  } catch (error) {
    return sendJson({ code: -1, msg: `删除文章失败：${error}` })
  }
}
