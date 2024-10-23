'use client'

import { Icon } from '@iconify/react'
import { ContentCard } from './ContentCard'
import type { JuejinArticle } from '@/types/juejin'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/link'

function NoFound() {
  return (
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center text-gray-500 dark:text-gray-400 py-8"
    >
      No articles found.
    </motion.p>
  )
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

function ArticleInfo({ articles }: { articles: JuejinArticle[] }) {
  return (
    <motion.ul
      key="content"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="divide-y divide-gray-200 dark:divide-gray-700"
    >
      {articles?.map((article, index) => (
        <motion.li
          key={article.article_info.article_id}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="group py-6 first:pt-0 last:pb-0"
        >
          <Link
            href={`https://juejin.cn/post/${article.article_info.article_id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block transition duration-300 ease-in-out hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg p-4 -m-4"
          >
            <h3 className="text-lg font-semibold mb-2 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition duration-300">
              {article.article_info.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
              {article.article_info.brief_content || 'No description available'}
            </p>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 space-x-4">
              <span className="flex items-center">
                <Icon icon="mdi:star" className="w-4 h-4 mr-1 text-yellow-500" />
                {article.article_info.collect_count}
              </span>
              <span className="flex items-center">
                <Icon icon="mdi:thumb-up" className="w-4 h-4 mr-1 text-green-500" />
                {article.article_info.digg_count}
              </span>
              <span className="flex items-center">
                <Icon icon="mdi:eye" className="w-4 h-4 mr-1 text-blue-500" />
                {article.article_info.view_count}
              </span>
            </div>
          </Link>
        </motion.li>
      ))}
    </motion.ul>
  )
}

export function JueJinArticles() {
  const [articles, setArticles] = useState<JuejinArticle[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch('/api/proxy/juejin/articles').then((res) => res.json())
        if (res.code === 0) {
          setArticles(res?.data?.data || [])
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
      <AnimatePresence>
        {isLoading ? <LoadingComponent /> : <ArticleInfo articles={articles} />}
      </AnimatePresence>

      {articles.length === 0 && !isLoading && <NoFound />}
    </ContentCard>
  )
}
