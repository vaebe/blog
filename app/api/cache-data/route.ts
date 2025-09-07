import { sendJson } from '@/lib/utils'
import { prisma } from '@/lib/prisma'

// 这里获取数据仍设置为 api 接口的原因是可以使用 nextjs 的缓存功能
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const key = searchParams.get('key')

    if (!key) {
      return sendJson({ code: 400, msg: '缓存数据的 key 不能为空！' })
    }

    const cacheData = await prisma.cacheData.findUnique({
      where: {
        key: key
      }
    })

    return sendJson({ data: cacheData })
  } catch (error) {
    return sendJson({ code: -1, msg: `获取缓存数据失败：${error}` })
  }
}
