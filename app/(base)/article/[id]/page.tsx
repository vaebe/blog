'use client'

import { useEffect, useState } from 'react'
import { Article } from '@prisma/client'
import { Card, CardDescription, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { toast } from '@/components/hooks/use-toast'
import { getReadingTime } from '@/lib/getReadingTime'
import { Anchor } from './anchor/index'
import { BytemdViewer } from '@/components/bytemd/viewer'

export default function Component({ params }: { params: { id: string } }) {
  const [pageType, setPageType] = useState<string>()
  const [article, setArticle] = useState<Article>()
  const [readingTime, setReadingTime] = useState<number>(0)

  const [details, setDetails] = useState<string>('')

  useEffect(() => {
    async function getData() {
      const res = await fetch(`/api/articles/details?id=${params.id}`).then((res) => res.json())
      if (res.code !== 0) {
        toast({ variant: 'destructive', title: '警告', description: '获取文章详情失败!' })
        return
      }

      setArticle(res.data)
      setReadingTime(getReadingTime(res.data.content).minutes)
      setPageType(res.data.source)

      // 博客创建的文章直接返回
      if (res.data.source === '00') return

      fetch(`/api/proxy/juejin/details?id=${params.id}`)
        .then((res) => res.json())
        .then((res) => {
          if (res.code !== 0) {
            toast({ variant: 'destructive', title: '警告', description: '获取文章详情失败!' })
            return
          }

          setDetails(res.data)
        })
    }
    getData()
  }, [params.id])

  return (
    <div className="flex justify-center items-start">
      <Card className="w-full max-w-4xl my-10 p-4 sm:px-6 lg:px-8">
        <CardHeader className="px-0">
          <CardTitle>{article?.title}</CardTitle>
          <CardDescription>阅读 {readingTime} 分钟</CardDescription>
          <CardDescription>{article?.summary}</CardDescription>
        </CardHeader>

        {pageType === '00' ? (
          <BytemdViewer content={article?.content ?? ''} />
        ) : (
          <div dangerouslySetInnerHTML={{ __html: details }} />
        )}
      </Card>

      <Card className="sticky top-[12vh] ml-4 w-[240px] hidden lg:block">
        <CardContent className="pt-4">
          <Anchor content={details || article?.content || ''}></Anchor>
        </CardContent>
      </Card>
    </div>
  )
}
