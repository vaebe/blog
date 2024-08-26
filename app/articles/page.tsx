'use client'

import { useState, useEffect } from 'react'
import { Icon } from '@iconify/react'
import { Article } from '@prisma/client';
import { getApiUrl } from '@/lib/utils'
import { ArticleCard } from '@/components/article-card'

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true)
      setError('')

      try {
        const res = await fetch(getApiUrl(`articles/list?page=${currentPage}&searchTerm=${searchTerm}`))
        if (!res.ok) {
          throw new Error('获取文章失败')
        }
        const data = await res.json()

        setArticles(data.articles || [])
        setTotalPages(data.totalPages || 1)
      } catch (err) {
        console.error(err)
        setError('获取列表数据失败!')
      } finally {
        setLoading(false)
      }
    }

    fetchArticles()
  }, [currentPage, searchTerm])

  const handleSearch = (e: any) => {
    e.preventDefault()
    setCurrentPage(1)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8">文章列表</h1>

      {/* 搜索栏 */}
      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex">
          <input
            type="text"
            placeholder="搜索文章..."
            className="w-full px-4 py-2 rounded-l-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            type="submit"
            className="w-[100px] bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            搜索
          </button>
        </div>
      </form>

      {/* 加载状态 */}
      {loading && (
        <div className="text-center py-10">
          <Icon icon="eos-icons:loading" className="w-10 h-10 mx-auto text-blue-500 animate-spin" />
          <p className="mt-2 text-gray-600 dark:text-gray-400">加载中...</p>
        </div>
      )}

      {/* 错误状态 */}
      {error && (
        <div className="text-center py-10">
          <Icon icon="clarity:error-standard-line" className="w-10 h-10 mx-auto text-red-500" />
          <p className="mt-2 text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* 文章列表 */}
      {!loading && !error && (
        <div className="space-y-8">
          {articles.map(item => (<ArticleCard key={item.id} article={item}></ArticleCard>))}
        </div>
      )}

      {/* 分页 */}
      {!loading && !error && articles.length > 0 && (
        <div className="mt-8 flex justify-center items-center space-x-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-300 disabled:text-gray-500"
          >
            上一页
          </button>
          <span className="text-gray-600 dark:text-gray-400">第 {currentPage} 页，共 {totalPages} 页</span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-300 disabled:text-gray-500"
          >
            下一页
          </button>
        </div>
      )}

      {/* 无结果提示 */}
      {!loading && !error && articles.length === 0 && (
        <div className="text-center py-10">
          <Icon icon="clarity:no-data-line" className="w-10 h-10 mx-auto text-gray-400" />
          <p className="mt-2 text-gray-600 dark:text-gray-400">没有找到相关文章</p>
        </div>
      )}
    </div>
  )
}