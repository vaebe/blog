import { notFound } from 'next/navigation'
import { Article } from '@/generated/prisma/client'
import { getArticleById } from '@/lib/articles'
import { getReadingTime } from '@/lib/getReadingTime'
import { Anchor } from './anchor/index'
import { BytemdViewer } from '@/components/bytemd/viewer'
import { Icon } from '@iconify/react'
import Link from 'next/link'

function MetaItem({ icon, children }: { icon: string; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <Icon icon={icon} className="h-4 w-4" />
      {children}
    </span>
  )
}

interface ArticleDetailProps {
  params: Promise<{ id: string }>
}

export async function ArticleDetail({ params }: ArticleDetailProps) {
  const { id } = await params

  let article: Article | null = null
  try {
    article = await getArticleById(id)
  } catch {
    article = null
  }

  if (!article) {
    notFound()
  }

  const date = new Date(article.createdAt).toLocaleDateString()
  const hasContent = !!article.content?.trim()
  const readingTime = hasContent ? getReadingTime(article.content ?? '').minutes : 0

  return (
    <article className="mx-auto max-w-5xl px-4 py-6">
      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_220px] lg:gap-12">
        {/* 主栏：标题 / 元信息 / 导读 / 正文 */}
        <div className="min-w-0">
          <header>
            <h1 className="text-3xl font-bold leading-tight tracking-tight md:text-[2.5rem]">
              {article.title}
            </h1>
            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
              <MetaItem icon="ri:calendar-line">{date}</MetaItem>
              {readingTime > 0 && <MetaItem icon="ri:time-line">{readingTime} 分钟阅读</MetaItem>}
              <MetaItem icon="ri:eye-line">{article.views}</MetaItem>
              <MetaItem icon="ri:thumb-up-line">{article.likes}</MetaItem>
            </div>
          </header>

          {article.summary && (
            <div className="mt-8 rounded-2xl border border-border bg-accent/40 p-5">
              <p className="mb-1.5 text-sm font-semibold text-primary">导读</p>
              <p className="leading-relaxed text-muted-foreground">{article.summary}</p>
            </div>
          )}

          {hasContent ? (
            <div className="mt-8 min-w-0 rounded-2xl border border-border bg-card p-6 shadow-soft sm:p-8">
              <BytemdViewer content={article.content ?? ''} />
            </div>
          ) : (
            <div className="mt-8 rounded-2xl border border-border bg-card p-10 text-center shadow-soft">
              {article.source !== '00' ? (
                <>
                  <p className="text-muted-foreground">本文同步自掘金，完整内容请前往原文阅读。</p>
                  <Link
                    href={`https://juejin.cn/post/${id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm text-primary-foreground transition-transform hover:scale-[1.03]"
                  >
                    <Icon icon="simple-icons:juejin" className="h-4 w-4" /> 去掘金读全文
                  </Link>
                </>
              ) : (
                <p className="text-muted-foreground">本文暂无正文内容。</p>
              )}
            </div>
          )}
        </div>

        {/* 侧栏：粘性目录（有正文才显示） */}
        {hasContent && (
          <aside className="hidden lg:block">
            <div className="sticky top-24 rounded-2xl border border-border bg-card p-5 shadow-soft">
              <p className="mb-3 text-sm font-semibold text-foreground">目录</p>
              <Anchor content={article.content || ''} />
            </div>
          </aside>
        )}
      </div>
    </article>
  )
}
