import { sendJson } from '@/lib/utils'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions'

// todo 获取用户可以使用的模型
export async function GET() {
  // 未登录返回 null
  const session = await getServerSession(authOptions)

  // 判断用户 id 是否存在执行对应的逻辑
  if (session?.user.id) {
  }

  try {
    return sendJson({ data: [] })
  } catch (error) {
    console.error(error)
    return sendJson({ code: -1, msg: '获取模型失败!' })
  }
}
