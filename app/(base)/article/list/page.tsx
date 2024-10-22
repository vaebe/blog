'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Article } from '@prisma/client'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/link'
import { Eye } from 'lucide-react'

type GroupedArticles = Record<string, Article[]>

const LoadingState = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="space-y-12"
  >
    {[...Array(2)].map((_, yearIndex) => (
      <div key={yearIndex} className="space-y-4">
        <Skeleton className="h-10 w-24 mb-6" /> {/* Year skeleton */}
        {[...Array(3)].map((_, articleIndex) => (
          <Card key={articleIndex}>
            <CardContent className="p-4">
              <Skeleton className="h-6 w-3/4 mb-2" /> {/* Article title skeleton */}
              <div className="flex items-center space-x-4">
                <Skeleton className="h-4 w-24" /> {/* Date skeleton */}
                <Skeleton className="h-4 w-16" /> {/* Views skeleton */}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    ))}
  </motion.div>
)

const ErrorState = ({ message }: { message: string }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="text-center py-10"
  >
    <p className="text-xl text-destructive">{message || '嗯 ? 这里貌似出现了一些问题!'}</p>
  </motion.div>
)

const ArticleInfo = ({ info }: { info: Article }) => (
  <Link
    href={`/article/${info.id}`}
    className="block hover:bg-accent rounded-lg transition-colors duration-200 p-4"
  >
    <h3 className="text-lg font-medium mb-2">{info.title}</h3>
    <div className="flex items-center text-sm text-muted-foreground">
      <span>{new Date(info.createdAt).toLocaleDateString()}</span>
      <span className="ml-4 flex items-center">
        <Eye className="w-4 h-4 mr-1" />
        {info.views}
      </span>
    </div>
  </Link>
)

const ArticleList = ({ articleInfo }: { articleInfo: GroupedArticles }) => (
  <>
    {Object.entries(articleInfo)
      .sort(([a], [b]) => Number(b) - Number(a))
      .map(([year, articles]) => (
        <motion.section
          key={year}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold mb-6">{year}</h2>
          <div className="space-y-4">
            {articles.map((article) => (
              <Card key={article.id}>
                <ArticleInfo info={article} />
              </Card>
            ))}
          </div>
        </motion.section>
      ))}
  </>
)

const NoResults = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="text-center py-10"
  >
    <p className="text-xl text-muted-foreground">这里曾经有一些东西 , 现在不见了!</p>
  </motion.div>
)

export default function ArticlesPage() {
  const [articles, setArticles] = useState<GroupedArticles>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchArticles = useCallback(async () => {
    try {
      const res = await fetch('/api/articles/all')
      const data = await res.json()

      if (data.code !== 0) {
        throw new Error('获取全部文章失败!')
      }

      const groupedArticles = (data.data ?? []).reduce((acc: GroupedArticles, article: Article) => {
        const year = new Date(article.createdAt).getFullYear().toString()
        acc[year] = [...(acc[year] || []), article]
        return acc
      }, {})

      setArticles(groupedArticles)
    } catch (err) {
      console.error(err)
      setError('获取列表数据失败!')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchArticles()
  }, [fetchArticles])

  const renderContent = () => {
    if (loading) return <LoadingState />
    if (error) return <ErrorState message={error} />
    return Object.keys(articles).length > 0 ? <ArticleList articleInfo={articles} /> : <NoResults />
  }

  return (
    <div className="max-w-5xl mx-auto my-4">
      <AnimatePresence mode="wait">{renderContent()}</AnimatePresence>
    </div>
  )
}
