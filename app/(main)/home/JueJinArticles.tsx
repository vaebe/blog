import { Icon } from '@iconify/react'
import Link from 'next/link'
import { Article } from '@/generated/prisma/client'
import { getAllArticles } from '@/lib/articles'
import { getJumpArticleDetailsUrl } from '@/lib/utils'
import { ArticleRow } from '@/components/article/article-row'
import dayjs from 'dayjs'

function NoFound() {
  return <p className="text-center text-muted-foreground py-8">No articles found.</p>
}

export async function JueJinArticles() {
  let list: Article[] = []
  try {
    list = (await getAllArticles()) as Article[]
  } catch {
    list = []
  }

  // 先按收藏排序取前 6,再按创建时间倒序展示;用 toSorted 避免污染上游缓存数组
  const articles = list
    .toSorted((a, b) => b.likes - a.likes)
    .slice(0, 6)
    .toSorted((a, b) => dayjs(b.createdAt).unix() - dayjs(a.createdAt).unix())

  return (
    <section>
      <div className="mb-7 flex items-baseline justify-between gap-4">
        <h2 className="text-2xl font-semibold tracking-tight">掘金文章</h2>
        <Link
          href="https://juejin.cn/user/712139266339694"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-primary"
        >
          去主页看更多
          <Icon icon="lucide:arrow-up-right" className="h-4 w-4" />
        </Link>
      </div>

      {articles.length === 0 ? (
        <NoFound />
      ) : (
        <div className="divide-y divide-border border-y border-border">
          {articles.map((article) => (
            <ArticleRow
              key={article.id}
              href={getJumpArticleDetailsUrl(article)}
              title={article.title}
              summary={article.summary}
              meta={[
                <time key="date" dateTime={article.createdAt.toString()}>
                  {dayjs(article.createdAt).format('YYYY/M/D')}
                </time>,
                <span key="views">{article.views.toLocaleString()} 阅读</span>,
                <span key="likes">{article.likes.toLocaleString()} 赞</span>
              ]}
            />
          ))}
        </div>
      )}
    </section>
  )
}
