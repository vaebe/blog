import { TimeInSeconds } from '../enums'

const JUEJIN_API_URL = `https://api.juejin.cn/user_api/v1/user/get`

export interface JuejinUserInfo {
  user_name: string
  avatar_large: string
  power: string
  description: string
  followee_count: number
  follower_count: number
  post_article_count: number
  got_digg_count: number
  got_view_count: number
}

export async function fetchJuejinUserInfo(): Promise<JuejinUserInfo> {
  const userId = process.env.JUEJIN_USER_ID

  if (!userId) {
    throw new Error('JUEJIN_USER_ID 未配置')
  }

  const url = `${JUEJIN_API_URL}?user_id=${userId}`

  const response = await fetch(url, { next: { revalidate: TimeInSeconds.oneHour } })

  if (!response.ok) {
    const errorInfo = await response.json().catch(() => ({}))
    throw new Error(errorInfo.msg || '掘金用户信息请求失败')
  }

  const info = await response.json()

  if (info.err_no !== 0) {
    throw new Error(info.err_msg || '掘金用户信息返回错误')
  }

  return info.data
}
