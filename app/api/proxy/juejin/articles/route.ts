import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  try {
    // 从 URL 获取查询参数
    const { searchParams } = new URL(req.url)
    const cursor = parseInt(searchParams.get('cursor') || '0')

    const res = await fetch('https://api.juejin.cn/content_api/v1/article/query_list', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user_id: process.env.JUEJIN_USER_ID,
        sort_type: 2,
        cursor: `${cursor}`
      })
    })

    const data = await res.json()
    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 })
  }
}
