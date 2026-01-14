import { sendJson } from '@/lib/utils'
import { prisma } from '@/lib/prisma'
import { containsSensitiveWord } from '@/lib/sensitive-words'
import { parsePaginationParams, calculatePaginationResult } from '@/lib/pagination'

// 添加留言
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { content, userEmail } = body

    if (!content) {
      return sendJson({ code: -1, msg: '留言内容不能为空!' })
    }

    if (!userEmail) {
      return sendJson({ code: -1, msg: '用户邮箱不能为空!' })
    }

    // 检测敏感词
    if (containsSensitiveWord(content)) {
      return sendJson({ code: -1, msg: '留言内容包含敏感词，请修改后重试!' })
    }

    const message = await prisma.message.create({
      data: {
        content,
        author: { connect: { email: userEmail } }
      }
    })
    return sendJson({ data: message })
  } catch {
    return sendJson({ code: -1, msg: '添加留言失败!' })
  }
}

// 查询留言列表
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)

  // 解析分页参数
  const { page, pageSize, skip } = parsePaginationParams(searchParams)

  try {
    const list = await prisma.message.findMany({
      include: {
        author: {
          select: {
            name: true,
            email: true,
            image: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip,
      take: pageSize
    })

    const total = await prisma.message.count()

    // 计算分页结果
    const pagination = calculatePaginationResult(total, page, pageSize)

    return sendJson({
      data: {
        list,
        total: pagination.total,
        currentPage: pagination.currentPage,
        totalPages: pagination.totalPages
      }
    })
  } catch (error) {
    console.error(error)
    return sendJson({ code: -1, msg: '获取留言信息失败' })
  }
}
