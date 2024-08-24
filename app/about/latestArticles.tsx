import { Icon } from '@iconify/react'
import { SectionContainer } from './sectionContainer'
import { fetchJuejinArticles } from '@/lib/api'
import type { JuejinArticle, JuejinArticlesInfo } from '@/lib/api'
import { useEffect, useState } from "react"


export function LatestArticles() {
  const [articlesInfo, setArticlesInfo] = useState<JuejinArticlesInfo>()
  const [articles, setArticles] = useState<JuejinArticle[]>([])

  useEffect(() => {
    const loadData = async () => {
      const info = await fetchJuejinArticles()
      setArticlesInfo(info)
      setArticles(info.data)
    }
    loadData()
  }, [])


  return (
    <SectionContainer title='最新文章' titleIcon='mdi:pencil'>
      <ul className="space-y-4">
        {articles?.map((article) => (
          <li key={article.article_info.article_id} className="border-b border-gray-200 dark:border-gray-700 pb-2">
            <a
              href={article.article_info.cover_image}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-500 dark:hover:text-blue-400"
            >
              {article.article_info.title}
            </a>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              <Icon icon="mdi:eye" className="inline mr-1" /> {article.article_info.view_count}
              <Icon icon="mdi:thumb-up" className="inline mx-1 ml-3" /> {article.article_info.digg_count}
            </p>
          </li>
        ))}
      </ul>
    </SectionContainer>
  )
}