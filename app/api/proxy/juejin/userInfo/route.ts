import { sendJson } from '@/lib/utils'

export async function GET() {
  try {
    const res = await fetch(
      `https://api.juejin.cn/user_api/v1/user/get?user_id=${process.env.JUEJIN_USER_ID}`
    )

    if (!res.ok) {
      const info = await res.json()
      return sendJson({ code: -1, msg: info })
    }

    const info = await res.json()

    if (info.err_no !== 0) {
      return sendJson({ code: -1, msg: info.err_msg })
    }

    return sendJson({ data: info.data })
  } catch (error) {
    return sendJson({ code: -1, msg: '获取掘金用户信息失败!' })
  }
}
