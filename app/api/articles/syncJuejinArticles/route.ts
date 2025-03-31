import dayjs from 'dayjs'
import { sendJson } from '@/lib/utils'
import { prisma } from '@/prisma'
import { AnyObject } from '@/types'

async function addArticle(info: AnyObject) {
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

let syncArticleNameList: string[] = []

async function getArticles(index: number) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/proxy/juejin/articles?cursor=${index}`
  ).then((res) => res.json())

  if (res?.code !== 0) {
    throw new Error('同步掘金文章失败!')
  }

  const info = res.data

  for (const item of info.data) {
    addArticle(item)

    syncArticleNameList.push(item.article_info.title)
  }

  const nextIndex = index + 10

  // 是否还有更多文章
  if (info.has_more) {
    await getArticles(nextIndex)
  }
}

export async function GET(req: Request) {
  syncArticleNameList = []

  const apiKey = req.headers.get('x-api-key')
  const expectedApiKey = process.env.GITHUB_REPOSITORY_API_KEY

  // 验证 API 密钥
  if (!apiKey || apiKey !== expectedApiKey) {
    return sendJson({ code: -1, msg: '无效的 API 密钥' })
  }

  try {
    const index = 0

    await getArticles(index)

    console.log(syncArticleNameList)

    return sendJson({ data: syncArticleNameList, msg: '同步掘金文章成功' })
  } catch (error) {
    return sendJson({ code: -1, msg: `同步掘金文章失败：${error}` })
  }
}
