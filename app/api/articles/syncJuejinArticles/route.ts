import dayjs from 'dayjs'
import { PrismaClient } from '@prisma/client'
import { sendJson } from '@/lib/utils'
import { kv } from '@vercel/kv'

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

async function getArticles(index: number) {
  const res = await fetch(`/api/proxy/juejin/articles?cursor=${index}`).then((res) => res.json())

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

const LastSyncTimeKey = 'blogLastSyncTime'

export async function GET(req: Request) {
  const apiKey = req.headers.get('x-api-key')
  const expectedApiKey = process.env.GITHUB_REPOSITORY_API_KEY

  // 验证 API 密钥
  if (!apiKey || apiKey !== expectedApiKey) {
    return sendJson({ code: -1, msg: '无效的 API 密钥' })
  }

  // 获取上次同步时间
  const lastSyncTime = await kv.get<string>(LastSyncTimeKey)

  console.log('lastSyncTime\r\n', lastSyncTime)

  // 检查是否在一个小时内
  if (lastSyncTime && dayjs().diff(lastSyncTime, 'hour') < 1) {
    return sendJson({ code: -1, msg: '一个小时内只能请求一次' })
  }

  try {
    const index = 0

    getArticles(index)

    // 更新上次同步时间
    await kv.set(LastSyncTimeKey, dayjs().format('YYYY-MM-DD HH:mm:ss'))

    return sendJson({ data: null, msg: '同步掘金文章成功' })
  } catch (error) {
    return sendJson({ code: -1, msg: `同步掘金文章失败: ${error}` })
  }
}
