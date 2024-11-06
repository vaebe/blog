import { sendJson } from '@/lib/utils'
import * as cheerio from 'cheerio'

const headers = {
  'Content-Type': 'text/html; charset=utf-8',
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.5',
  'Accept-Encoding': 'gzip, deflate, br',
  Connection: 'keep-alive',
  'Upgrade-Insecure-Requests': '1',
  'Cache-Control': 'max-age=0',
  TE: 'Trailers',
  Referer: 'https://juejin.cn'
}

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
      headers: headers
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
