import { PrismaClient } from '@prisma/client'
import { sendJson } from '@/lib/utils'

const prisma = new PrismaClient()

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const {
      id,
      account,
      password,
      nickName = '',
      accountType = '00',
      homepage = '',
      avatar = ''
    } = body

    const newArticle = await prisma.user.create({
      data: {
        id,
        nickName,
        account,
        password,
        accountType, // '00 账号密码 01 github'
        role: '01', // 角色: 00 admin 01 普通用户
        homepage,
        avatar
      }
    })

    return sendJson({ data: newArticle })
  } catch (error) {
    return sendJson({ code: -1, msg: `${error}` })
  }
}
