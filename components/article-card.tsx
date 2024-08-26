import { Article } from '@prisma/client';
import { Icon } from '@iconify/react'

export function ArticleCard({ article }: { article: Article }) {
  const articleThumbnail = '/images/logo.png'

  return (
    <article className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">

      <img src={article.coverImg || articleThumbnail} alt={article.title} className="w-full h-48 object-cover" />

      <div className="p-6">
        <h2 className="text-xl font-semibold mb-2">{article.title}</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-4">{article.summary}</p>
        <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
          <span>{new Date(article.createdAt).toLocaleDateString()}</span>
          <span>5 分钟</span>
          <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
            未分类
          </span>
        </div>
        <a href={`/article/${article.id}`} className="mt-4 inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline">
          阅读更多 <Icon icon="ph:arrow-right-bold" className="ml-2 h-4 w-4" />
        </a>
      </div>
    </article>
  )
}