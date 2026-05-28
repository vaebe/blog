import { cacheLife, cacheTag } from 'next/cache'
import { prisma } from '@/lib/prisma'

export const ARTICLES_CACHE_TAG = 'articles'

// 获取全部文章，使用 Next.js Cache Components 缓存，按创建时间倒序
// 写操作后调用 revalidateTag(ARTICLES_CACHE_TAG) 失效缓存
export async function getAllArticles() {
  'use cache'
  cacheTag(ARTICLES_CACHE_TAG)
  cacheLife('hours')

  return prisma.article.findMany({
    orderBy: { createdAt: 'desc' }
  })
}

// 单篇文章详情；按 id 拆 tag，写操作时通过 revalidateTag('article-<id>') 失效
export async function getArticleById(id: string) {
  'use cache'
  cacheTag(ARTICLES_CACHE_TAG, `article-${id}`)
  cacheLife('hours')

  return prisma.article.findUnique({ where: { id } })
}
