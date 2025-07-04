'use client'

import { useEffect, useState, use } from 'react'
import { Article } from '@prisma/client'
import { toast } from 'sonner'
import { getReadingTime } from '@/lib/getReadingTime'
import { Anchor } from './anchor/index'
import { BytemdViewer } from '@/components/bytemd/viewer'
import { Icon } from '@iconify/react'

export default function Component(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params)
  const [article, setArticle] = useState<Article>()
  const [readingTime, setReadingTime] = useState<number>(0)

  useEffect(() => {
    async function fetchArticleDetails() {
      const res = await fetch(`/api/articles/details?id=${params.id}`).then((res) => res.json())
      if (res.code !== 0) {
        toast('获取文章详情失败!')
        return null
      }
      return res.data
    }

    async function getData() {
      const articleData = await fetchArticleDetails()
      if (!articleData) return

      setArticle(articleData)
      setReadingTime(getReadingTime(articleData.content).minutes)
    }

    getData()
  }, [params.id])

  return (
    <div className="max-w-4xl mx-auto my-2">
      <div className="space-y-4 border-b pb-4">
        <h1 className="text-2xl font-bold">{article?.title}</h1>
        <div className="text-gray-500 flex items-center">
          <Icon icon="ri:time-line" /> 阅读时间: {readingTime} 分钟
        </div>
      </div>

      <div className=" mt-4 bg-black/5 dark:bg-white/10 p-2 rounded-md">
        <h2 className="text-lg mb-2 text-gray-600 dark:text-gray-300">导读:</h2>
        <p className="text-gray-500 dark:text-gray-400">{article?.summary}</p>
      </div>

      <div className="bg-black/5 dark:bg-white/10 p-2 rounded-md my-4">
        <h3 className="text-lg font-semibold mb-4">章节目录</h3>
        <Anchor content={article?.content || ''}></Anchor>
      </div>

      <div className="bg-black/5 dark:bg-white/10 p-2 rounded-md">
        <BytemdViewer content={article?.content ?? ''} />
      </div>
    </div>
  )
}
