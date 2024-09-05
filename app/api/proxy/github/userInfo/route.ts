import { NextResponse } from 'next/server'

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
      return NextResponse.json(`获取 GitHub 用户信息失败: ${response.statusText}`, { status: 500 })
    }

    const userInfo = await response.json()
    return NextResponse.json(userInfo, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 })
  }
}
