import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    // 从 URL 获取查询参数
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const searchTerm = searchParams.get('searchTerm') || '';

    const pageSize = 10; // 每页显示文章数量
    const skip = (page - 1) * pageSize; // 计算需要跳过的记录数

    // 查询带有分页和模糊检索的文章
    const articles = await prisma.article.findMany({
      where: {
        title: {
          contains: searchTerm, // 模糊搜索标题
        },
      },
      orderBy: { createdAt: 'desc' }, // 按创建时间排序
      skip: skip, // 跳过的文章数
      take: pageSize, // 获取的文章数
    });

    // 获取文章总数，用于前端分页
    const totalArticles = await prisma.article.count({
      where: {
        title: {
          contains: searchTerm, // 检索条件相同
        },
      },
    });

    return NextResponse.json({
      articles,
      totalArticles,
      currentPage: page,
      totalPages: Math.ceil(totalArticles / pageSize),
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch articles" }, { status: 500 });
  }
}