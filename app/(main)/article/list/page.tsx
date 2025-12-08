import { Article } from '@/generated/prisma/client'
import { Card } from '@/components/ui/card'
import Link from 'next/link'
import { Eye, ThumbsUp, Star } from 'lucide-react'
import { getJumpArticleDetailsUrl } from '@/lib/utils'
import { NoFound } from '@/components/no-found'
import { TimeInSeconds } from '@/lib/enums'

type GroupedArticles = Record<string, Article[]>

const ArticleInfo = ({ info }: { info: Article }) => {
  const date = new Date(info.createdAt).toLocaleDateString()

  return (
    <Link href={getJumpArticleDetailsUrl(info)} target="_blank">
      <h3 className="text-lg font-medium">{info.title}</h3>

      <p className="my-4">{info.summary}</p>

      <div className="flex items-center justify-between text-sm text-muted-foreground ">
        <div className="flex items-center space-x-4">
          <p className=" flex items-center">
            <ThumbsUp className="w-4 h-4 mr-1" aria-hidden="true" />
            <span>{info.likes}</span>
          </p>

          <p className="flex items-center">
            <Star className="w-4 h-4 mr-1" aria-hidden="true" />
            <span>{info.favorites}</span>
          </p>

          <p className=" flex items-center">
            <Eye className="w-4 h-4 mr-1" aria-hidden="true" />
            <span>{info.views}</span>
          </p>
        </div>

        <time dateTime={info.createdAt.toString()}>{date}</time>
      </div>
    </Link>
  )
}

const ArticleList = ({ articleInfo }: { articleInfo: GroupedArticles }) => (
  <>
    {Object.entries(articleInfo)
      .sort(([a], [b]) => Number(b) - Number(a))
      .map(([year, articles]) => (
        <div key={year}>
          <div className="my-8 flex items-center">
            <h2 className="text-3xl font-bold">{year}</h2>
            <p className="ml-4 text-lg text-black/50 dark:text-white/50">
              {articles.length ?? 0} 篇
            </p>
          </div>

          <div className="space-y-4">
            {articles.map((article) => (
              <Card
                key={article.id}
                className="hover:bg-accen rounded-lg transition-colors duration-200 p-4"
              >
                <ArticleInfo info={article} />
              </Card>
            ))}
          </div>
        </div>
      ))}
  </>
)

const groupArticlesByYear = (articles: Article[]): GroupedArticles => {
  return articles.reduce((acc: GroupedArticles, article: Article) => {
    const year = new Date(article.createdAt).getFullYear().toString()
    acc[year] = [...(acc[year] || []), article]
    return acc
  }, {})
}

async function getArticles() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/articles/all`, {
      next: { revalidate: TimeInSeconds.oneHour } // 缓存 1小时 or 使用 cache: 'no-store' 不缓存
    })

    if (!res.ok) {
      throw new Error('Failed to fetch articles')
    }

    const data = await res.json()
    if (data.code !== 0) {
      throw new Error(data.message || '获取全部文章失败!')
    }

    return groupArticlesByYear(data.data ?? [])
  } catch (error) {
    console.error('Failed to fetch articles:', error)
    throw error
  }
}

export default async function ArticlesPage() {
  let articles: GroupedArticles = {}

  try {
    articles = await getArticles()
  } catch (error) {
    return (
      <div className="max-w-4xl mx-auto px-2">
        <div className="text-center py-10">
          <p className="text-xl text-destructive">
            {error instanceof Error ? error.message : '获取全部文章失败!'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-2">
      {Object.keys(articles).length > 0 ? <ArticleList articleInfo={articles} /> : <NoFound />}
    </div>
  )
}
