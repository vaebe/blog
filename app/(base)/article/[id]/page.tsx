'use client'

import { Viewer } from '@bytemd/react'
import plugins from '@/components/bytemd/plugins'
import { useEffect, useState } from 'react'
import { Article } from '@prisma/client'
import './style.css'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from '@/components/hooks/use-toast'
import { getReadingTime } from '@/lib/getReadingTime'

export default function Component({ params }: { params: { id: string } }) {
  const [article, setArticle] = useState<Article>()
  const [readingTime, setReadingTime] = useState<number>(0)

  useEffect(() => {
    async function getData() {
      const res = await fetch(`/api/articles/details?id=${params.id}`).then((res) => res.json())
      if (res.code !== 0) {
        toast({ variant: 'destructive', title: '警告', description: '获取文章详情失败!' })
        return
      }

      setArticle(res.data)
      setReadingTime(getReadingTime(res.data.content).minutes)
    }
    getData()
  }, [params.id])

  return (
    <Card className="max-w-4xl mx-auto my-10 sm:px-6 lg:px-8">
      <CardHeader className="px-0">
        <CardTitle>{article?.title}</CardTitle>
        <CardDescription>阅读 {readingTime} 分钟</CardDescription>
        <CardDescription>{article?.summary}</CardDescription>
      </CardHeader>

      <Viewer value={article?.content ?? ''} plugins={plugins}></Viewer>
    </Card>
  )
}
