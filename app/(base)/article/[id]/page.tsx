'use client'

import { useEffect, useState } from 'react'
import { Article } from '@prisma/client'
import { Card, CardDescription, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { toast } from '@/components/hooks/use-toast'
import { getReadingTime } from '@/lib/getReadingTime'
import { Anchor } from './anchor/index'
import { BytemdViewer } from '@/components/bytemd/viewer'
import { Icon } from '@iconify/react'

export default function Component({ params }: { params: { id: string } }) {
  const [article, setArticle] = useState<Article>()
  const [readingTime, setReadingTime] = useState<number>(0)

  useEffect(() => {
    async function fetchArticleDetails() {
      const res = await fetch(`/api/articles/details?id=${params.id}`).then((res) => res.json())
      if (res.code !== 0) {
        toast({ variant: 'destructive', title: '警告', description: '获取文章详情失败!' })
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
    <div className="flex justify-center items-start gap-4 mt-[4vh]">
      <div className="w-full max-w-5xl">
        <CardHeader className="space-y-2 border-b px-4 sm:px-6 lg:px-8">
          <CardTitle>{article?.title}</CardTitle>
          <CardDescription className="text-sm text-gray-400 flex items-center">
            <Icon icon="ri:time-line" />
            阅读时间: {readingTime} 分钟
          </CardDescription>
        </CardHeader>

        <CardContent className="mt-4 px-4 sm:px-6 lg:px-8">
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">导读:</h2>
            <p className="text-gray-600 bg-gray-100 p-4 rounded-md">{article?.summary}</p>
          </div>

          <BytemdViewer content={article?.content ?? ''} />
        </CardContent>
      </div>

      <Card className="sticky top-14 w-64 hidden lg:block h-fit max-h-[calc(100vh-4rem)] overflow-y-auto">
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold mb-4">目录</h3>
          <Anchor content={article?.content || ''}></Anchor>
        </CardContent>
      </Card>
    </div>
  )
}
