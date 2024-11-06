import { sendJson } from '@/lib/utils'
import * as cheerio from 'cheerio'

export async function GET(req: Request) {
  try {
    // 参数验证
    const url = new URL(req.url)
    const id = url.searchParams.get('id')
    if (!id) {
      return sendJson({ code: -1, msg: 'Missing article id' })
    }

    // 请求文章内容
    const res = await fetch(`https://juejin.cn/post/${id}`, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'
      }
    })

    if (!res.ok) {
      return sendJson({
        code: -1,
        msg: `Failed to fetch article: ${res.status} ${res.statusText}`
      })
    }

    const htmlContent = await res.text()

    console.error('文章数据', htmlContent)

    const $ = cheerio.load(htmlContent)

    // 清理样式
    $('#article-root style').remove()

    return sendJson({
      code: 0,
      data: $('#article-root').html()
    })
  } catch (error) {
    console.error('Error fetching article:', error)
    return sendJson({
      code: -1,
      msg: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
