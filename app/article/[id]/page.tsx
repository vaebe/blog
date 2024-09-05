'use client'

import { Viewer } from '@bytemd/react'
import bytemdPlugins from '@/lib/bytemdPlugins'
import { useEffect, useState } from 'react'
import { Article } from '@prisma/client'
import './style.css'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getApiUrl } from '@/lib/utils'

export default function Component({ params }: { params: { id: string } }) {
  const [article, setArticle] = useState<Article>()

  useEffect(() => {
    async function getData() {
      const res = await fetch(getApiUrl(`articles/details?id=${params.id}`))
      if (!res.ok) {
        throw new Error('获取文章失败')
      }
      const data = await res.json()
      setArticle(data.data)
    }
    getData()
  }, [params.id])

  return (
    <Card className="max-w-4xl mx-auto my-10 sm:px-6 lg:px-8">
      <CardHeader className="px-0">
        <CardTitle>{article?.title}</CardTitle>
        <CardDescription>{article?.summary}</CardDescription>
      </CardHeader>

      <Viewer value={article?.content ?? ''} plugins={bytemdPlugins}></Viewer>
    </Card>
  )
}
