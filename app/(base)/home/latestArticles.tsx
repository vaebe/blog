'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getApiUrl, getArticleDetailsUrl } from '@/lib/utils'
import { Article } from '@prisma/client'
import { Icon } from '@iconify/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

function ArticleCard({ article }: { article: Article }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="line-clamp-1 text-lg">{article.title}</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="line-clamp-2 text-sm text-gray-600 dark:text-gray-300">{article.summary}</p>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export function LatestArticles() {
  const [articles, setArticles] = useState<Article[]>([])
  const [error, setError] = useState('')
  const [isLoading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchArticles() {
      try {
        setError('')
        setLoading(true)
        const response = await fetch('/api/articles/list?pageSize=6')
        const res = await response.json()

        if (res.code !== 0) {
          throw new Error('获取列表数据失败!')
        }

        setArticles(res.data.articles || [])
      } catch (err) {
        console.error(err)
        setError('获取列表数据失败!')
      } finally {
        setLoading(false)
      }
    }

    fetchArticles()
  }, [])

  if (isLoading) {
    return <ArticlesSkeleton />
  }

  if (error) {
    return <ErrorMessage message={error} />
  }

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-center mb-6">最新文章</h2>
      <AnimatePresence>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((item) => (
            <Link key={item.id} href={getArticleDetailsUrl(item)} target="_blank">
              <ArticleCard article={item} />
            </Link>
          ))}
        </div>
      </AnimatePresence>
      <div className="text-center">
        <Link href="/articles">
          <Button variant="outline" size="lg">
            查看更多
            <Icon icon="mdi:arrow-right" className="ml-2 w-5 h-5" />
          </Button>
        </Link>
      </div>
    </div>
  )
}

function ArticlesSkeleton() {
  return (
    <div className="space-y-8">
      <Skeleton className="h-10 w-48 mx-auto mb-6" />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="h-48">
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-5/6" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="text-center py-10">
      <Icon icon="mdi:alert-circle" className="w-16 h-16 text-red-500 mx-auto mb-4" />
      <p className="text-xl font-semibold text-red-600">{message}</p>
    </div>
  )
}
