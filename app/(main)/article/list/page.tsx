import { Article } from '@/generated/prisma/client'
import { getJumpArticleDetailsUrl } from '@/lib/utils'
import { NoFound } from '@/components/no-found'
import { getAllArticles } from '@/lib/articles'
import { ArticleRow } from '@/components/article/article-row'

type GroupedArticles = Record<string, Article[]>

function ArticleListRow({ info }: { info: Article }) {
  const date = new Date(info.createdAt).toLocaleDateString()
  return (
    <ArticleRow
      href={getJumpArticleDetailsUrl(info)}
      title={info.title}
      summary={info.summary}
      meta={[
        <time key="date" dateTime={info.createdAt.toString()}>
          {date}
        </time>,
        <span key="views">{info.views.toLocaleString()} 阅读</span>,
        <span key="likes">{info.likes.toLocaleString()} 赞</span>
      ]}
    />
  )
}

const ArticleList = ({ articleInfo }: { articleInfo: GroupedArticles }) => (
  <>
    {Object.entries(articleInfo)
      .sort(([a], [b]) => Number(b) - Number(a))
      .map(([year, articles]) => (
        <section key={year} className="mt-16 first:mt-0">
          <div className="mb-6 flex items-baseline gap-4">
            <h2 className="font-display text-5xl font-bold leading-none text-primary md:text-6xl">
              {year}
            </h2>
            <p className="text-sm text-muted-foreground">{articles.length} 篇</p>
          </div>

          <div className="divide-y divide-border border-y border-border">
            {articles.map((article) => (
              <ArticleListRow key={article.id} info={article} />
            ))}
          </div>
        </section>
      ))}
  </>
)

const groupArticlesByYear = (articles: Article[]): GroupedArticles => {
  // push 而非展开，避免每篇文章都重建数组形成的 O(n²) 开销
  const grouped: GroupedArticles = {}
  for (const article of articles) {
    const year = new Date(article.createdAt).getFullYear().toString()
    ;(grouped[year] ??= []).push(article)
  }
  return grouped
}

async function getArticles() {
  try {
    const articles = await getAllArticles()
    return groupArticlesByYear(articles ?? [])
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
      <div className="mx-auto max-w-5xl px-4 py-4">
        <div className="py-10 text-center">
          <p className="text-xl text-destructive">
            {error instanceof Error ? error.message : '获取全部文章失败!'}
          </p>
        </div>
      </div>
    )
  }

  const totalCount = Object.values(articles).reduce((acc, arr) => acc + arr.length, 0)

  return (
    <div className="mx-auto max-w-5xl px-4 py-4">
      <header className="mb-14">
        <h1 className="text-5xl font-bold leading-none tracking-tight md:text-6xl">文章</h1>
        <p className="mt-4 text-muted-foreground">
          共 <span className="font-semibold text-foreground">{totalCount}</span> 篇,大多发表在掘金。
        </p>
      </header>

      {Object.keys(articles).length > 0 ? <ArticleList articleInfo={articles} /> : <NoFound />}
    </div>
  )
}
