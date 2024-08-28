'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from 'react'
import { getApiUrl } from '@/lib/utils'
import { Article } from '@prisma/client'

function ArticleCard({ article }: { article: Article }) {
  return (

    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="line-clamp-2 h-14">{article.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="line-clamp-3">{article.summary}</p>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">查看更多</Button>
      </CardFooter>
    </Card>
  )
}

export function LatestArticles() {
  const [articles, setArticles] = useState<Article[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchArticles = async () => {
      setError('')

      try {
        const res = await fetch(getApiUrl(`articles/list`))
        if (!res.ok) {
          throw new Error('获取文章失败')
        }
        const data = await res.json()

        setArticles(data.articles || [])

      } catch (err) {
        console.error(err)
        setError('获取列表数据失败!')
      }
    }

    fetchArticles()
  }, [])

  return (
    <div >
      <h2 className="text-3xl font-extrabold mb-8">最新文章</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((item) => (<ArticleCard key={item.id} article={item}></ArticleCard>))}
      </div>
    </div>
  )
}