import { sendJson } from '@/lib/utils'
import { prisma } from '@/lib/prisma'
import { parsePaginationParams, calculatePaginationResult } from '@/lib/pagination'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const searchTerm = searchParams.get('searchTerm') || ''

    // 解析分页参数
    const { page, pageSize, skip } = parsePaginationParams(searchParams)

    // 查询带有分页和模糊检索的文章
    const articles = await prisma.article.findMany({
      where: {
        title: {
          contains: searchTerm
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
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

    // 计算分页结果
    const pagination = calculatePaginationResult(totalArticles, page, pageSize)

    return sendJson({
      data: {
        articles,
        totalArticles: pagination.total,
        currentPage: pagination.currentPage,
        totalPages: pagination.totalPages
      }
    })
  } catch (error) {
    console.error('获取文章列表失败:', error)
    return sendJson({ code: -1, msg: '获取文章列表失败，请稍后重试' })
  }
}
