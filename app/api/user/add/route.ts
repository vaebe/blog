import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  console.log(req, '-=-=-=-=')

  try {
    const body = await req.json();

    const { id, account, password, nickName='', accountType = '00', homepage='',avatar ='' } = body;

    const newArticle = await prisma.user.create({
      data: {
        id,
        nickName,
        account,
        password,
        accountType, // '00 账号密码 01 github'
        role: '01', // 角色: 00 admin 01 普通用户
        homepage,
        avatar,
      },
    });

    return NextResponse.json(newArticle, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create article" }, { status: 500 });
  }
}