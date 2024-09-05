import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// DELETE: 删除文章
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json()

    await prisma.article.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Article deleted' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete article' }, { status: 500 })
  }
}
