import { sendJson } from '@/lib/utils'
import * as cheerio from 'cheerio'

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const id = url.searchParams.get('id') // 从查询参数中获取 id

    const res = await fetch(`https://juejin.cn/post/${id}`, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8'
      }
    })

    const htmlContent = await res.text()

    const $ = cheerio.load(htmlContent)

    $('#article-root style').remove()

    return sendJson({ data: $('#article-root').html() })
  } catch (error) {
    return sendJson({ code: -1, msg: `${error}` })
  }
}
