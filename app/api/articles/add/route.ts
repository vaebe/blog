import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


// POST: 创建新文章
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id, title, content, classify, coverImg, summary, status } = body;

    const newArticle = await prisma.article.create({
      data: {
        id,
        title,
        content,
        classify,
        coverImg,
        summary,
        status,
        userId: 1, // 示例，通常从认证信息中获取用户ID
      },
    });

    return NextResponse.json(newArticle, { status: 200 });
  } catch (error) {
    console.log(error, '-=-=--=')
    return NextResponse.json({ error: "Failed to create article" }, { status: 500 });
  }
}