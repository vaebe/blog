import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// PUT: 更新文章
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, title, content, classify, coverImg, summary, status } = body;

    const updatedArticle = await prisma.article.update({
      where: { id },
      data: {
        title,
        content,
        classify,
        coverImg,
        summary,
        status,
      },
    });

    return NextResponse.json(updatedArticle);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update article" }, { status: 500 });
  }
}
