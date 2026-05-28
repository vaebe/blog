import { Icon } from '@iconify/react'
import Link from 'next/link'
import Image from 'next/image'
import type { GithubPinnedRepoInfo } from '@/lib/github/pinned-repos'
import { GitHubPinnedReposCacheDataKey } from '@/lib/github/pinned-repos'
import { getCacheDataByKey } from '@/lib/cache-data'

function NoFound() {
  return <div className="text-center text-muted-foreground py-8">No repositories found.</div>
}

// 自绘的富信息项目卡：复刻 GitHub 社交卡的密度(头像/owner/repo/描述/数据/语言条),
// 头像走 github.com/{owner}.png(稳定),按语言色上色 —— 精致且零破图。
// featured = 在 bento 里占 2x2 的大卡，头像/标题/描述更大。
function ProjectCard({
  repo,
  featured = false,
  className = ''
}: {
  repo: GithubPinnedRepoInfo
  featured?: boolean
  className?: string
}) {
  const color = repo.primaryLanguage?.color ?? '#ff4500'
  const owner = repo.url.replace(/^https?:\/\/github\.com\//, '').split('/')[0]
  const avatarSize = featured ? 128 : 80

  return (
    <Link
      href={repo.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 ${featured ? 'p-7' : 'p-5'} ${className}`}
    >
      {/* 语言色微光 + 角落淡化的代码符号 */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(120% 120% at 100% 0%, color-mix(in oklab, ${color} 12%, transparent), transparent 55%)`
        }}
      />
      <span
        aria-hidden
        className={`pointer-events-none absolute -right-3 -top-5 font-display font-extrabold leading-none opacity-[0.06] ${featured ? 'text-[8rem]' : 'text-[5rem]'}`}
        style={{ color }}
      >
        {'</>'}
      </span>

      <div className="relative">
        {/* 头像 + owner / repo */}
        <div className={`flex items-center ${featured ? 'gap-4' : 'gap-3'}`}>
          <Image
            src={`https://github.com/${owner}.png?size=${avatarSize}`}
            alt={`${owner} avatar`}
            width={avatarSize}
            height={avatarSize}
            unoptimized
            className={`shrink-0 rounded-full ring-1 ring-border ${featured ? 'h-16 w-16' : 'h-11 w-11'}`}
          />
          <div className="min-w-0">
            <div className="truncate text-xs text-muted-foreground">{owner} /</div>
            <div
              className={`truncate font-display font-bold leading-tight transition-colors group-hover:text-primary ${featured ? 'text-3xl' : 'text-lg'}`}
            >
              {repo.name}
            </div>
          </div>
        </div>

        {/* 描述 */}
        <p
          className={`mt-4 text-sm leading-relaxed text-muted-foreground ${featured ? 'line-clamp-5 min-h-[7rem] md:text-base' : 'line-clamp-2 min-h-[2.5rem]'}`}
        >
          {repo.description || '暂无描述'}
        </p>
      </div>

      {/* 数据行（推到底部） */}
      <div className="relative mt-auto pt-5">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          {repo.primaryLanguage && (
            <span className="flex items-center">
              <span
                className="mr-1.5 h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: color }}
              />
              {repo.primaryLanguage.name}
            </span>
          )}
          <span className="flex items-center">
            <Icon icon="mdi:star" className="mr-1 h-4 w-4" />
            {repo.stargazerCount}
          </span>
          <span className="flex items-center">
            <Icon icon="mdi:source-fork" className="mr-1 h-4 w-4" />
            {repo.forkCount}
          </span>
        </div>
      </div>

      {/* 底部语言色条（GitHub 语言条的感觉） */}
      <span
        aria-hidden
        className="absolute bottom-0 left-0 h-1 w-full opacity-60"
        style={{ backgroundColor: color }}
      />
    </Link>
  )
}

export async function GithubProject() {
  let repos: GithubPinnedRepoInfo[] = []

  try {
    const res = await getCacheDataByKey<GithubPinnedRepoInfo[]>({
      key: GitHubPinnedReposCacheDataKey
    })

    if (res.code === 0 && res.data) {
      repos = res.data
    }
  } catch {
    repos = []
  }

  return (
    <section>
      <h2 className="mb-7 text-2xl font-semibold tracking-tight">精选项目</h2>
      {repos.length === 0 ? (
        <NoFound />
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3 md:auto-rows-[260px]">
          {repos.map((repo, i) => (
            <ProjectCard
              key={repo.id}
              repo={repo}
              featured={i === 0}
              className={i === 0 ? 'md:col-span-2 md:row-span-2' : ''}
            />
          ))}
        </div>
      )}
    </section>
  )
}
