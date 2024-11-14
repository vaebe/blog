import { sendJson } from '@/lib/utils'

// 根据 hash 获取图片信息
export async function GET(req: Request) {
  const url = new URL(req.url)
  const fileHash = url.searchParams.get('hash')

  try {
    if (!fileHash) {
      return sendJson({ code: -1, msg: '文件 hash 不存在' })
    }

    const query = {
      type: 'file',
      searchQuery: `"customMetadata.md5" = "${fileHash}"`,
      limit: '1'
    }

    const url = `https://api.imagekit.io/v1/files?${new URLSearchParams(query).toString()}`

    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${btoa(process.env.IMAGEKIT_PRIVATE_KEY + ':')}`
      }
    }).then((res) => res.json())

    if (!Array.isArray(res) || res.length === 0) {
      return sendJson({ data: [] })
    }

    return sendJson({ data: res })
  } catch (error) {
    console.error(error)
    return sendJson({ code: -1, msg: 'Failed to fetch article' })
  }
}
