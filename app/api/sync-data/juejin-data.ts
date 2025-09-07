import dayjs from 'dayjs'
import { prisma } from '@/lib/prisma'
import { AnyObject } from '@/types'
import { fetchJuejinUserArticles } from '@/lib/juejin/fetch-user-articles'

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

const syncArticleNameList: string[] = []

export async function getArticles(index: number) {
  const info = await fetchJuejinUserArticles(index)

  for (const item of info.data) {
    await addArticle(item)

    syncArticleNameList.push(item.article_info.title)
  }

  const nextIndex = index + 10

  // 是否还有更多文章
  if (info.has_more) {
    await getArticles(nextIndex)
  }

  return syncArticleNameList
}
