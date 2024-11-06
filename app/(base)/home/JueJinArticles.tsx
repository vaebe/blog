'use client'

import { Icon } from '@iconify/react'
import { ContentCard } from './ContentCard'
import { useEffect, useState } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/link'
import { Article } from '@prisma/client'

function NoFound() {
  return <p className="text-center text-gray-500 dark:text-gray-400 py-8">No articles found.</p>
}

function LoadingComponent() {
  return (
    <div className="space-y-6">
      {[...Array(3)].map((_, index) => (
        <div key={index}>
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-1/4" />
          {index < 2 && <div className="my-6 border-b border-gray-200 dark:border-gray-700"></div>}
        </div>
      ))}
    </div>
  )
}

function ArticleInfo({ articles }: { articles: Article[] }) {
  return (
    <div key="content" className="divide-y divide-gray-200 dark:divide-gray-700">
      {articles?.map((article) => (
        <div key={article.id} className="group py-4 first:pt-0 last:pb-0">
          <Link
            href={`https://juejin.cn/post/${article.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block transition duration-300 ease-in-out hover:bg-black/10 dark:hover:bg-white/10 rounded p-2"
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
            </div>
          </Link>
        </div>
      ))}
    </div>
  )
}

export function JueJinArticles() {
  const [articles, setArticles] = useState<Article[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch('/api/articles/all').then((res) => res.json())

        if (res.code === 0) {
          const list: Article[] = res?.data || []
          const sortedData = list.sort((a, b) => b.likes - a.likes).slice(0, 6)
          setArticles(sortedData)
        }
      } catch (error) {
        console.error('Failed to fetch articles:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

  return (
    <ContentCard title="掘金文章" titleIcon="simple-icons:juejin">
      {isLoading ? <LoadingComponent /> : <ArticleInfo articles={articles} />}

      {articles.length === 0 && !isLoading && <NoFound />}
    </ContentCard>
  )
}
