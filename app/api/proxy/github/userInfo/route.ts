import { sendJson } from '@/lib/utils'

export async function GET() {
  const url = `https://api.github.com/users/${process.env.NEXT_PUBLIC_GITHUB_USER_NAME}`

  try {
    const response = await fetch(url, {
      headers: {
        Accept: 'application/vnd.github.v3+json',
        Authorization: `Bearer ${process.env.GITHUB_API_TOKEN}`
      }
    })

    if (!response.ok) {
      return sendJson({ code: -1, msg: `获取 GitHub 用户信息失败: ${response.statusText}` })
    }

    const userInfo = await response.json()
    return sendJson({ data: userInfo })
  } catch (error) {
    return sendJson({ code: -1, msg: `获取 GitHub 用户信息失败: ${error}` })
  }
}
