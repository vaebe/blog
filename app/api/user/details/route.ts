import { sendJson } from '@/lib/utils'
import { prisma } from '@/prisma'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const account = url.searchParams.get('account')

  try {
    if (!account) {
      return sendJson({ code: -1, msg: '账号不存在' })
    }

    const user = await prisma.user.findUnique({
      where: { email: account }
    })

    return sendJson({ data: user })
  } catch (error) {
    console.log('获取用户详情失败', error)
    return sendJson({ code: -1, msg: `获取用户详情失败` })
  }
}
