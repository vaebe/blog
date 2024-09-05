import { PrismaClient } from '@prisma/client'
import { sendJson } from '@/lib/utils'

const prisma = new PrismaClient()

export async function GET(req: Request) {
  const url = new URL(req.url)
  const account = url.searchParams.get('account')

  try {
    if (!account) {
      return sendJson({ code: -1, msg: '账号不存在' })
    }

    const user = await prisma.user.findUnique({
      where: { account: account }
    })

    return sendJson({ data: user })
  } catch (error) {
    console.log('校验用户失败', error)
    return sendJson({ code: -1, msg: `校验用户失败` })
  }
}
