import { sendJson } from '@/lib/utils'
import { prisma } from '@/lib/prisma'
import { parsePaginationParams, calculatePaginationResult } from '@/lib/pagination'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const searchTerm = searchParams.get('searchTerm') || ''

    // 解析分页参数
    const { page, pageSize, skip } = parsePaginationParams(searchParams)

    const where = {
      title: {
        contains: searchTerm
      }
    }

    // 文章列表与总数相互独立，并行查询
    const [articles, totalArticles] = await Promise.all([
      prisma.article.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: pageSize
      }),
      prisma.article.count({ where })
    ])

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
