import { TimeInSeconds } from '../enums'

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

const GITHUB_API_URL = `https://api.github.com/users/${process.env.NEXT_PUBLIC_GITHUB_USER_NAME}`

export async function fetchGithubUserInfo() {
  const token = process.env.GITHUB_API_TOKEN

  if (!process.env.NEXT_PUBLIC_GITHUB_USER_NAME || !token) {
    throw new Error('GitHub 用户名或 Token 未配置')
  }

  const response = await fetch(GITHUB_API_URL, {
    headers: {
      Accept: 'application/vnd.github.v3+json',
      Authorization: `Bearer ${token}`
    },
    next: { revalidate: TimeInSeconds.oneHour } // 数据缓存一个小时
  })

  if (!response.ok) {
    const errorMessage = await response.text()
    throw new Error(`获取 GitHub 用户信息失败: ${response.statusText} - ${errorMessage}`)
  }

  return response.json()
}
