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
