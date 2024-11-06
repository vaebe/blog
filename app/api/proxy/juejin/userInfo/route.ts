import { sendJson } from '@/lib/utils'
import { kv } from '@vercel/kv'
import type { JuejinUserInfo } from '@/types/juejin'
import { TimeInSeconds } from '@/lib/enums'

const InfoKey = 'blog-juejin-user-info'
const JUEJIN_API_URL = `https://api.juejin.cn/user_api/v1/user/get?user_id=${process.env.JUEJIN_USER_ID}`

// 获取掘金用户信息
async function fetchUserInfo() {
  const response = await fetch(JUEJIN_API_URL)

  if (!response.ok) {
    const errorInfo = await response.json()
    throw new Error(errorInfo.msg || 'Failed to fetch user info from Juejin')
  }
  const info = await response.json()

  if (info.err_no !== 0) {
    throw new Error(info.err_msg)
  }
  return info.data
}

export async function GET() {
  try {
    // 取出缓存
    const cachedInfo = await kv.get<JuejinUserInfo>(InfoKey)
    if (cachedInfo) {
      return sendJson({ data: cachedInfo })
    }

    const userInfo = await fetchUserInfo()

    // 缓存数据
    await kv.set(InfoKey, userInfo, { ex: TimeInSeconds.oneDay })

    return sendJson({ data: userInfo })
  } catch (error) {
    console.error(error)
    return sendJson({ code: -1, msg: '获取掘金用户信息失败!' })
  }
}
