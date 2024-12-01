import { sendJson } from '@/lib/utils'
import { prisma } from '@/prisma'

export async function PUT(req: Request) {
  try {
    const body = await req.json()
    const { id, name, desc } = body

    const dataToUpdate: { name: string; desc?: string } = { name }

    // desc 字段存在才更新
    if (desc) {
      dataToUpdate.desc = desc
    }

    const updatedArticle = await prisma.aIConversation.update({
      where: { id },
      data: dataToUpdate
    })

    return sendJson({ data: updatedArticle })
  } catch (error) {
    console.error(error)
    return sendJson({ code: -1, msg: '更新对话失败!' })
  }
}
