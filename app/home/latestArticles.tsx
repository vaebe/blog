'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from 'react'
import { getApiUrl } from '@/lib/utils'
import { Article } from '@prisma/client'
import { BaseLoading } from '@/components/base-loading'

function ArticleCard({ article }: { article: Article }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle >
          <p className="line-clamp-1">{article.title}</p>
        </CardTitle>
      </CardHeader>
      <CardContent >
        <p className="line-clamp-2"> {article.summary}</p>
      </CardContent>
    </Card>
  )
}

export function LatestArticles() {
  const [articles, setArticles] = useState<Article[]>([])
  const [error, setError] = useState('')
  const [isLoading, setLoading] = useState(false)

  useEffect(() => {
    function fetchArticles() {
      setError('')
      setLoading(true)

      fetch(getApiUrl(`articles/list?pageSize=6`))
        .then(res => res.json())
        .then(res => {
          if (res.code !== 0) {
            setError('获取列表数据失败!')
            return
          }

          setArticles(res.data.articles || [])
        })
        .catch((err) => {
          console.error(err)
          setError('获取列表数据失败!')
        })
        .finally(() => {
          setLoading(false)
        })
    }

    fetchArticles()
  }, [])

  return (
    <>
      <div className="grid gap-6">
        {articles.map((item) => (<ArticleCard key={item.id} article={item}></ArticleCard>))}
      </div>

      <BaseLoading isLoading={isLoading} />

      {error && <p className="text-center my-10 text-lg">{error}</p>}
    </>
  )
}