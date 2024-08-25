import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const res = await fetch('https://api.juejin.cn/content_api/v1/article/query_list', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "user_id": process.env.JUEJIN_USER_ID,
        "sort_type": 2,
        "cursor": "0"
      })
    })

    const data = await res.json();
    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}