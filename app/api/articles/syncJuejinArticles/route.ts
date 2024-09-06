import { getApiUrl } from '@/lib/utils'
import dayjs from 'dayjs'
import { PrismaClient } from '@prisma/client'
import { sendJson } from '@/lib/utils'

const prisma = new PrismaClient()

async function addArticle(info: any) {
  const {
    article_id,
    title,
    cover_image,
    brief_content,
    view_count,
    ctime,
    collect_count,
    digg_count
  } = info.article_info

  const data = {
    title: title,
    content: '',
    classify: '',
    coverImg: cover_image,
    summary: brief_content,
    status: '',
    source: '01',
    userId: 1,
    views: view_count,
    likes: digg_count,
    favorites: collect_count,
    createdAt: dayjs(ctime * 1000).toDate(),
    updatedAt: dayjs(ctime * 1000).toDate()
  }

  // 存在则更新 否则新增
  await prisma.article.upsert({
    where: { id: article_id },
    update: data,
    create: {
      id: article_id,
      ...data
    }
  })
}

let list = []

async function getArticles(index: number) {
  const res = await fetch(getApiUrl(`proxy/juejin/articles?cursor=${index}`)).then((res) =>
    res.json()
  )

  if (res.code !== 0) {
    return sendJson(res)
  }

  const info = res.data

  for (const item of info.data) {
    addArticle(item)
  }

  const nextIndex = index + 10

  // 是否还有更多文章
  if (info.has_more) {
    getArticles(nextIndex)
  }
}

export async function GET(req: Request) {
  try {
    list = []
    const index = 0

    getArticles(index)

    return sendJson({ data: null })
  } catch (error) {
    return sendJson({ code: -1, msg: `同步掘金文章失败: ${error}` })
  }
}
