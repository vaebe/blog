import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get('id'); // 从查询参数中获取 id

  try {
    if (!id) {
      return NextResponse.json({ error: "id 不存在" }, { status: 500 });
    }

    const article = await prisma.article.findUnique({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ data: article });

  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch article" }, { status: 500 });
  }
}