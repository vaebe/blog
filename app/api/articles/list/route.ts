import { sendJson } from '@/lib/utils'
import { prisma } from '@/prisma'

export async function GET(req: Request) {
  try {
    // 从 URL 获取查询参数
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '10')
    const searchTerm = searchParams.get('searchTerm') || ''

    const skip = (page - 1) * pageSize

    // 查询带有分页和模糊检索的文章
    const articles = await prisma.article.findMany({
      where: {
        title: {
          contains: searchTerm
        }
      },
      orderBy: { createdAt: 'desc' },
      skip: skip,
      take: pageSize
    })

    // 获取文章总数，用于前端分页
    const totalArticles = await prisma.article.count({
      where: {
        title: {
          contains: searchTerm
        }
      }
    })

    return sendJson({
      data: {
        articles,
        totalArticles,
        currentPage: page,
        totalPages: Math.ceil(totalArticles / pageSize)
      }
    })
  } catch (error) {
    return sendJson({ code: -1, msg: `获取文章列表失败：${error}` })
  }
}
