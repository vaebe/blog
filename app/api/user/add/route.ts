import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


// POST: 创建新文章
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { account, password } = body;

    const newArticle = await prisma.user.create({
      data: {
        nickName: '',
        account,
        password,
        role: 'admin',
        homepage: '',
        avatar: '',
      },
    });

    return NextResponse.json(newArticle, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create article" }, { status: 500 });
  }
}