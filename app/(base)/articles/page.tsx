'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Icon } from '@iconify/react'
import { Article } from '@prisma/client'
import { getApiUrl } from '@/lib/utils'
import { ArticleCard } from '@/components/article-card'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

// SearchBar component
interface SearchBarProps {
  onSearch: (term: string) => void
}

function SearchBar({ onSearch }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearchTerm = useDebounce(searchTerm, 300)

  useEffect(() => {
    onSearch(debouncedSearchTerm)
  }, [debouncedSearchTerm, onSearch])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(searchTerm)
  }

  return (
    <Card className="mb-8">
      <CardContent className="pt-6">
        <form onSubmit={handleSearch} className="flex space-x-2">
          <Input
            type="text"
            placeholder="搜索文章..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow"
          />
          <Button type="submit">
            搜索
            <Icon icon="mdi:magnify" className="ml-2 w-5 h-5" />
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

// Pagination component
interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  return (
    <div className="mt-8 flex justify-center items-center space-x-4">
      <Button
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
        variant="outline"
      >
        <Icon icon="mdi:chevron-left" className="mr-2 w-5 h-5" />
        上一页
      </Button>
      <span className="text-gray-600 dark:text-gray-400">第 {currentPage} 页，共 {totalPages} 页</span>
      <Button
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage === totalPages}
        variant="outline"
      >
        下一页
        <Icon icon="mdi:chevron-right" className="ml-2 w-5 h-5" />
      </Button>
    </div>
  )
}

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

function ArticleList({ articles }: { articles: Article[] }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      {articles.map(item => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <ArticleCard article={item} />
        </motion.div>
      ))}
    </motion.div>
  )
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
  const [articles, setArticles] = useState<Article[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchArticles = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const res = await fetch(getApiUrl(`articles/list?page=${currentPage}&pageSize=${6}&searchTerm=${searchTerm}`))
      const data = await res.json()
      
      if (data.code !== 0) {
        throw new Error('获取列表数据失败!')
      }

      setArticles(data.data.articles || [])
      setTotalPages(data.data.totalPages || 1)
    } catch (err) {
      console.error(err)
      setError('获取列表数据失败!')
    } finally {
      setLoading(false)
    }
  }, [currentPage, searchTerm])

  useEffect(() => {
    fetchArticles()
  }, [fetchArticles])

  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term)
    setCurrentPage(1)
  }, [])

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page)
  }, [])

  const renderContent = () => {
    if (loading) {
      return <LoadingState />
    }
    if (error) {
      return <ErrorState message={error} />
    }
    if (articles.length > 0) {
      return <ArticleList articles={articles} />
    }
    return <NoResults />
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.h1 
        className="text-4xl font-bold mb-8 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        文章列表
      </motion.h1>

      <SearchBar onSearch={handleSearch} />

      <AnimatePresence mode="wait">
        {renderContent()}
      </AnimatePresence>

      {!loading && !error && articles.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </motion.div>
      )}
    </div>
  )
}