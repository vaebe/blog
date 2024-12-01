import { sendJson } from '@/lib/utils'
import { prisma } from '@/prisma'

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json()

    await prisma.aIConversation.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        messages: {
          updateMany: {
            where: { conversationId: id },
            data: { deletedAt: new Date() }
          }
        }
      }
    })

    return sendJson({ msg: 'success' })
  } catch (error) {
    return sendJson({ code: -1, msg: error instanceof Error ? error.message : '删除对话失败!' })
  }
}
