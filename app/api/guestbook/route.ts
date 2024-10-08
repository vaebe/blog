import { sendJson } from '@/lib/utils'
import { prisma } from '@/prisma'

// 添加留言
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { content, userEmail } = body

    if (!content) {
      return sendJson({ code: -1, msg: '留言内容不能为空!' })
    }

    if (!userEmail) {
      return sendJson({ code: -1, msg: '用户邮箱不能为空!' })
    }

    const message = await prisma.message.create({
      data: {
        content,
        author: { connect: { email: userEmail } }
      }
    })
    return sendJson({ data: message })
  } catch {
    return sendJson({ code: -1, msg: '添加留言失败!' })
  }
}

// 查询留言列表
export async function GET() {
  return sendJson({ data: 'hello world' })
}
