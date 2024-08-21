'use client'

import { useState, useEffect } from 'react'
import { Icon } from '@iconify/react'

const defaultImg = 'https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/4af0d3c574644fe0b49afc70d7b49260~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5ZSQ6K-X:q75.awebp?rk3s=f64ab15b&x-expires=1724809262&x-signature=gGiA1puP828uatVz8vNPsrVAZSE%3D'


export default function ArticlesPage() {
  const [articles, setArticles] = useState([])
  const [totalPages, setTotalPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true)
      setError(null)

      try {
        const res = await fetch(`http://localhost:3000/api/articles/list?page=${currentPage}&searchTerm=${searchTerm}`)
        if (!res.ok) {
          throw new Error('获取文章失败')
        }
        const data = await res.json()

        setArticles(data.articles || [])
        setTotalPages(data.totalPages || 1)
      } catch (err) {
        console.error(err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchArticles()
  }, [currentPage, searchTerm])

  const handleSearch = (e) => {
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
            className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          {articles.map(article => (
            <article key={article.id} className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
              <img src={article.image || defaultImg} alt={article.title} className="w-full h-48 object-center" />
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2">{article.title}</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-4">{article.excerpt}</p>
                <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                  <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                  <span>{article.readTime || '5 分钟'}</span>
                  <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                    {article.category || '未分类'}
                  </span>
                </div>
                <a href={`/articles/${article.id}`} className="mt-4 inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline">
                  阅读更多 <Icon icon="ph:arrow-right-bold" className="ml-2 h-4 w-4" />
                </a>
              </div>
            </article>
          ))}
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