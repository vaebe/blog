import { sendJson } from '@/lib/utils'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions'
import { prisma } from '@/prisma'
import { randomUUID } from 'crypto'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return sendJson({ code: 401, msg: `无权限!` })
  }

  try {
    const body = await req.json()
    const {
      content,
      conversationId,
      role,
      experimentalAttachments = {},
      toolInvocations = {},
      annotations = {}
    } = body

    const info = await prisma.aIMessage.create({
      data: {
        id: randomUUID().replaceAll('-', ''),
        role,
        content,
        conversationId,
        userId: session!.user.id,
        experimentalAttachments,
        toolInvocations,
        annotations
      }
    })
    return sendJson({ data: info })
  } catch (error) {
    sendJson({ code: -1, msg: `创建对话失败 ${error}` })
  }
}
