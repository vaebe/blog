'use client'

import { useState, useEffect, useCallback } from 'react'
import { Article } from '@prisma/client'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/link'
import { Eye } from 'lucide-react'
import { getJumpArticleDetailsUrl } from '@/lib/utils'

const LoadingSkeleton = () => (
  <Card>
    <CardContent className="p-4">
      <Skeleton className="h-6 w-3/4 mb-2" />
      <div className="flex items-center space-x-4">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-16" />
      </div>
    </CardContent>
  </Card>
)

const LoadingState = () => (
  <div className="space-y-12">
    {Array.from({ length: 2 }).map((_, yearIndex) => (
      <div key={yearIndex} className="space-y-4">
        <Skeleton className="h-10 w-24 mb-6" />
        {Array.from({ length: 3 }).map((_, articleIndex) => (
          <LoadingSkeleton key={articleIndex} />
        ))}
      </div>
    ))}
  </div>
)

const ErrorState = ({ message }: { message: string }) => (
  <div className="text-center py-10">
    <p className="text-xl text-destructive">{message || '嗯 ? 这里貌似出现了一些问题!'}</p>
  </div>
)

const ArticleInfo = ({ info }: { info: Article }) => {
  const date = new Date(info.createdAt).toLocaleDateString()

  return (
    <Link
      href={getJumpArticleDetailsUrl(info)}
      target="_blank"
      className="block hover:bg-accent rounded-lg transition-colors duration-200 p-4"
    >
      <h3 className="text-lg font-medium mb-2">{info.title}</h3>
      <div className="flex items-center text-sm text-muted-foreground">
        <time dateTime={info.createdAt.toString()}>{date}</time>
        <span className="ml-4 flex items-center">
          <Eye className="w-4 h-4 mr-1" aria-hidden="true" />
          <span>{info.views}</span>
        </span>
      </div>
    </Link>
  )
}

type GroupedArticles = Record<string, Article[]>

const ArticleList = ({ articleInfo }: { articleInfo: GroupedArticles }) => (
  <>
    {Object.entries(articleInfo)
      .sort(([a], [b]) => Number(b) - Number(a))
      .map(([year, articles]) => (
        <div key={year} className="mb-12">
          <h2 className="text-3xl font-bold mb-6">{year}</h2>
          <div className="space-y-4">
            {articles.map((article) => (
              <Card key={article.id}>
                <ArticleInfo info={article} />
              </Card>
            ))}
          </div>
        </div>
      ))}
  </>
)

const NoResults = () => (
  <div className="text-center py-10">
    <p className="text-xl text-muted-foreground">这里曾经有一些东西 , 现在不见了!</p>
  </div>
)

type FetchStatus = 'idle' | 'loading' | 'error' | 'success'

export default function ArticlesPage() {
  const [articles, setArticles] = useState<GroupedArticles>({})
  const [status, setStatus] = useState<FetchStatus>('idle')
  const [error, setError] = useState('')

  const groupArticlesByYear = (articles: Article[]): GroupedArticles => {
    return articles.reduce((acc: GroupedArticles, article: Article) => {
      const year = new Date(article.createdAt).getFullYear().toString()
      acc[year] = [...(acc[year] || []), article]
      return acc
    }, {})
  }

  const fetchArticles = useCallback(async () => {
    setStatus('loading')

    try {
      const res = await fetch('/api/articles/all')
      if (!res.ok) throw new Error('Network response was not ok')

      const data = await res.json()
      if (data.code !== 0) throw new Error(data.message || '获取全部文章失败!')

      setArticles(groupArticlesByYear(data.data ?? []))
      setStatus('success')
    } catch (err) {
      console.error('Failed to fetch articles:', err)
      setError(err instanceof Error ? err.message : '获取列表数据失败!')
      setStatus('error')
    }
  }, [])

  useEffect(() => {
    fetchArticles()
  }, [fetchArticles])

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return <LoadingState />
      case 'error':
        return <ErrorState message={error} />
      case 'success':
        return Object.keys(articles).length > 0 ? (
          <ArticleList articleInfo={articles} />
        ) : (
          <NoResults />
        )
      default:
        return null
    }
  }

  return <div className="max-w-4xl mx-auto px-2">{renderContent()}</div>
}
