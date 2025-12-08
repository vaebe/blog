import { Icon } from '@iconify/react'
import { ContentCard } from './ContentCard'
import Link from 'next/link'
import { Article } from '@/generated/prisma/client'
import { TimeInSeconds } from '@/lib/enums'
import dayjs from 'dayjs'

function NoFound() {
  return <p className="text-center text-gray-500 dark:text-gray-400 py-8">No articles found.</p>
}

function ArticleList({ articles }: { articles: Article[] }) {
  return (
    <div key="content" className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {articles?.map((article) => (
        <div
          key={article.id}
          className="block transition duration-300 ease-in-out hover:bg-black/10 dark:hover:bg-white/10 rounded p-2"
        >
          <Link
            href={`https://juejin.cn/post/${article.id}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <h3 className="text-lg font-semibold mb-2 transition duration-300">{article.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
              {article.summary || 'No description available'}
            </p>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 space-x-4">
              <span className="flex items-center">
                <Icon icon="mdi:star" className="w-4 h-4 mr-1 text-yellow-500" />
                {article.favorites}
              </span>
              <span className="flex items-center">
                <Icon icon="mdi:thumb-up" className="w-4 h-4 mr-1 text-green-500" />
                {article.likes}
              </span>
              <span className="flex items-center">
                <Icon icon="mdi:eye" className="w-4 h-4 mr-1 text-blue-500" />
                {article.views}
              </span>
              <span className="flex items-center">
                <Icon icon="mdi:clock-time-five-outline" className="w-4 h-4 mr-1" />
                {dayjs(article.createdAt).format('YYYY-MM-DD HH:mm:ss')}
              </span>
            </div>
          </Link>
        </div>
      ))}
    </div>
  )
}

async function getJueJinArticles() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/articles/all`, {
      next: { revalidate: TimeInSeconds.oneHour }
    })
    const json = await res.json()
    return json.code === 0 ? json.data : []
  } catch {
    return []
  }
}

export async function JueJinArticles() {
  const list = (await getJueJinArticles()) as Article[]

  // 先安收藏数排序获取前六个，然后根据创建时间排序
  const articles = list
    .sort((a, b) => b.likes - a.likes)
    .slice(0, 6)
    .sort((a, b) => dayjs(b.createdAt).unix() - dayjs(a.createdAt).unix())

  return (
    <ContentCard title="掘金">
      {articles.length === 0 ? <NoFound /> : <ArticleList articles={articles} />}
    </ContentCard>
  )
}
