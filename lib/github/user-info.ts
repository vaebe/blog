import { createCacheData } from '../cache-data'
import { TimeInSeconds } from '../enums'
import { ApiRes } from '../utils'

export interface GithubUserInfo {
  login: string
  id: number
  node_id: string
  avatar_url: string
  gravatar_id: string
  url: string
  html_url: string
  followers_url: string
  following_url: string
  gists_url: string
  starred_url: string
  subscriptions_url: string
  organizations_url: string
  repos_url: string
  events_url: string
  received_events_url: string
  type: string
  site_admin: boolean
  name: string
  company: string
  blog: string
  location: string
  email: string
  hireable: string
  bio: string
  twitter_username: string
  public_repos: number
  public_gists: number
  followers: number
  following: number
  created_at: string
  updated_at: string
}

const GITHUB_USER_NAME = process.env.NEXT_PUBLIC_GITHUB_USER_NAME
const GITHUB_API_URL = `https://api.github.com/users/${GITHUB_USER_NAME}`
const GITHUB_API_TOKEN = process.env.GITHUB_API_TOKEN

export async function getGithubUserInfo(): Promise<ApiRes<GithubUserInfo>> {
  if (!GITHUB_USER_NAME || !GITHUB_API_TOKEN) {
    return { code: -1, msg: 'GitHub 用户名或 Token 未配置' }
  }

  try {
    const res = await fetch(GITHUB_API_URL, {
      headers: {
        Accept: 'application/vnd.github.v3+json',
        Authorization: `Bearer ${GITHUB_API_TOKEN}`
      },
      next: { revalidate: TimeInSeconds.oneHour } // 数据缓存一个小时
    })

    if (!res.ok) {
      const errMsg = await res.text()
      return { code: -1, msg: `获取 GitHub 用户信息失败: ${res.statusText} - ${errMsg}` }
    }

    const data = await res.json()

    return { code: 0, data, msg: '获取 GitHub 用户信息成功' }
  } catch (error) {
    return { code: -1, msg: `获取 GitHub 用户信息失败：${error}` }
  }
}

export const GithubUserInfoCacheDataKey = 'github_user_info'

export async function saveGithubUserInfoToCache(): Promise<ApiRes> {
  try {
    const res = await getGithubUserInfo()

    if (res.code !== 0) {
      return { code: -1, msg: res.msg }
    }

    const data = res.data

    if (!data) {
      return { code: -1, msg: '获取 GitHub 用户信息失败' }
    }

    return createCacheData({
      key: GithubUserInfoCacheDataKey,
      data: JSON.stringify(data),
      desc: 'GitHub 用户信息'
    })
  } catch (error) {
    return { code: -1, msg: `保存 GitHub 用户信息失败：${error}` }
  }
}
