import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { randomUUID } from 'crypto'
import { sendJson } from '@/lib/utils'

const prisma = new PrismaClient()

// POST: 创建新文章
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { title, content, classify, coverImg, summary, status } = body

    const newArticle = await prisma.article.create({
      data: {
        id: randomUUID().replaceAll('-', ''),
        title,
        content,
        classify,
        coverImg,
        summary,
        status,
        userId: 1 // 示例，通常从认证信息中获取用户ID
      }
    })
    return sendJson({ data: newArticle })
  } catch (error) {
    console.warn('创建文章失败:', error)
    sendJson({ code: -1, msg: '创建文章失败!' })
  }
}
