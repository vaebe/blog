import { routerList } from '@/lib/routers'
import Link from 'next/link'
import { Icon } from '@iconify/react'
import { EmailSubscription } from './email-subscription'

export default function LayoutFooter() {
  const githubUserName = process.env.NEXT_PUBLIC_GITHUB_USER_NAME ?? ''
  const repoName = process.env.NEXT_PUBLIC_GITHUB_REPO_NAME ?? 'blog'
  const githubUrl = `https://github.com/${githubUserName}`
  const licenseUrl = `${githubUrl}/${repoName}/blob/main/LICENSE`

  return (
    <footer className="mt-20 border-t border-border">
      <div className="mx-auto max-w-5xl px-4 py-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[1.4fr_1fr_1.6fr] md:gap-12">
          <BrandBlock githubUrl={githubUrl} />
          <NavBlock />
          <SubscribeBlock />
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>© 2024-present {githubUserName}</span>
          <Link
            href={licenseUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-primary"
          >
            Released under the MIT License
          </Link>
        </div>
      </div>
    </footer>
  )
}

function BrandBlock({ githubUrl }: { githubUrl: string }) {
  return (
    <div>
      <h3 className="font-display text-3xl font-bold leading-none">vaebe</h3>
      <p className="mt-3 text-sm text-muted-foreground">前端工程师 · 开源爱好者</p>
      <div className="mt-5 flex items-center gap-3">
        <SocialIcon href={githubUrl} icon="mdi:github" label="GitHub" />
        <SocialIcon
          href="https://juejin.cn/user/712139266339694"
          icon="simple-icons:juejin"
          label="掘金"
        />
        <SocialIcon href="/rss" icon="mingcute:rss-2-fill" label="RSS" external={false} />
      </div>
    </div>
  )
}

function SocialIcon({
  href,
  icon,
  label,
  external = true
}: {
  href: string
  icon: string
  label: string
  external?: boolean
}) {
  return (
    <Link
      href={href}
      target="_blank"
      rel={external ? 'noopener noreferrer' : undefined}
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
    >
      <Icon icon={icon} className="h-4 w-4" />
    </Link>
  )
}

function NavBlock() {
  return (
    <div>
      <h4 className="mb-4 text-sm font-semibold">导航</h4>
      <ul className="space-y-2.5">
        {routerList.map((item) => (
          <li key={item.path}>
            <Link
              href={item.path}
              className="text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

function SubscribeBlock() {
  return (
    <div>
      <h4 className="mb-2 text-sm font-semibold">订阅更新</h4>
      <p className="mb-4 text-sm text-muted-foreground">新文章第一时间送到邮箱</p>
      <EmailSubscription />
    </div>
  )
}
