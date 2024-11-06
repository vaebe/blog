import { sendJson } from '@/lib/utils'
import { kv } from '@vercel/kv'
import type { GithubUserInfo } from '@/types/github'
import { TimeInSeconds } from '@/lib/enums'

const InfoKey = 'blog-github-user-info'
const GITHUB_API_URL = `https://api.github.com/users/${process.env.NEXT_PUBLIC_GITHUB_USER_NAME}`

async function fetchUserInfo() {
  const response = await fetch(GITHUB_API_URL, {
    headers: {
      Accept: 'application/vnd.github.v3+json',
      Authorization: `Bearer ${process.env.GITHUB_API_TOKEN}`
    }
  })

  if (!response.ok) {
    const errorMessage = await response.text()
    throw new Error(`获取 GitHub 用户信息失败: ${response.statusText} - ${errorMessage}`)
  }

  return response.json()
}

export async function GET() {
  try {
    const cachedInfo = await kv.get<GithubUserInfo>(InfoKey)
    if (cachedInfo) {
      return sendJson({ data: cachedInfo })
    }

    const userInfo = await fetchUserInfo()
    await kv.set(InfoKey, userInfo, { ex: TimeInSeconds.oneWeek })

    return sendJson({ data: userInfo })
  } catch (error) {
    console.error(error)
    return sendJson({ code: -1, msg: '获取 GitHub 用户信息失败!' })
  }
}
