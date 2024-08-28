import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { sendJson } from '@/lib/utils'

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const list = await prisma.$queryRaw<
      { month: string; count: number }[]
    >`
    SELECT DATE_FORMAT(createdAt, '%Y-%m') AS month, COUNT(*) AS count
    FROM Article
    WHERE isDeleted = 0
    GROUP BY month
    ORDER BY month ASC;
  `;

  const formattedCounts = list.map(item => ({
    month: item.month,
    count: Number(item.count),
  }));

    return sendJson({ data: formattedCounts });
  } catch (error) {
    console.log(error)
    return sendJson({code: -1, msg: '按月查询文章数量失败！'});
  }
}