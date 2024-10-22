'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Icon } from '@iconify/react'
import { Article } from '@prisma/client'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/link'

function LoadingState() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-4"
    >
      {[...Array(3)].map((_, index) => (
        <Card key={index}>
          <CardContent className="p-4">
            <Skeleton className="h-6 w-2/3 mb-2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full mt-2" />
          </CardContent>
        </Card>
      ))}
    </motion.div>
  )
}

function ErrorState({ message }: { message: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="text-center py-10"
    >
      <Icon icon="mdi:alert-circle" className="w-16 h-16 mx-auto text-red-500 mb-4" />
      <p className="text-xl font-semibold text-red-600 dark:text-red-400">{message}</p>
    </motion.div>
  )
}

function ArticleInfo({ info }: { info: Article }) {
  return (
    <Link href={`/article/${info.id}`} target="_blank">
      <div className="mb-2">
        <p className="text-lg font-medium">{info.title}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          <span>{new Date(info.createdAt).toLocaleDateString()}</span>

          <span className="ml-4">阅读: {info.views}</span>
        </p>
      </div>
    </Link>
  )
}

function ArticleList({ articleInfo }: { articleInfo: Record<string, Article[]> }) {
  const content = Object.keys(articleInfo)
    .sort((a, b) => Number(b) - Number(a))
    .map((item) => {
      return (
        <div key={item}>
          <p className="text-3xl font-bold my-8">{item}</p>
          {articleInfo[item].map((subItem) => (
            <motion.div
              key={subItem.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ArticleInfo info={subItem}></ArticleInfo>
            </motion.div>
          ))}
        </div>
      )
    })

  return <>{content}</>
}

function NoResults() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="text-center py-10"
    >
      <Icon icon="mdi:file-document-outline" className="w-16 h-16 mx-auto text-gray-400 mb-4" />
      <p className="text-xl font-semibold text-gray-600 dark:text-gray-400">没有找到相关文章</p>
    </motion.div>
  )
}

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Record<string, Article[]>>({})
  const [articleTotal, setArticleTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchArticles = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const res = await fetch(`/api/articles/all`).then((res) => res.json())

      if (res.code !== 0) {
        throw new Error('获取全部文章失败!')
      }

      const list = res.data ?? []

      setArticleTotal(list.length)

      const data: Record<string, Article[]> = {}

      list.map((item: Article) => {
        const year = new Date(item.createdAt).getFullYear()

        if (!data[year]) {
          data[year] = []
        }

        data[year].push(item)
      })

      setArticles(data)
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
    if (loading) {
      return <LoadingState />
    }

    if (error) {
      return <ErrorState message={error} />
    }

    if (articleTotal > 0) {
      return <ArticleList articleInfo={articles} />
    }

    return <NoResults />
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <AnimatePresence mode="wait">{renderContent()}</AnimatePresence>
    </div>
  )
}
