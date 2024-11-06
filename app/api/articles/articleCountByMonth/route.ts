import { sendJson } from '@/lib/utils'
import { prisma } from '@/prisma'

export async function GET() {
  try {
    const list = await prisma.$queryRaw<{ month: string; count: number }[]>`
    SELECT DATE_FORMAT(createdAt, '%Y-%m') AS month, COUNT(*) AS count
    FROM article
    WHERE isDeleted = 0
    GROUP BY month
    ORDER BY month ASC;
  `

    const formattedCounts = list.map((item) => ({
      month: item.month,
      count: Number(item.count)
    }))

    return sendJson({ data: formattedCounts })
  } catch (error) {
    return sendJson({ code: -1, msg: `按月查询文章数量失败: ${error}` })
  }
}
