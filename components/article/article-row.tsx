import { Fragment } from 'react'
import Link from 'next/link'
import { Icon } from '@iconify/react'

interface ArticleRowProps {
  href: string
  title: string
  summary?: string | null
  meta: React.ReactNode[]
}

export function ArticleRow({ href, title, summary, meta }: ArticleRowProps) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group -mx-3 flex items-start gap-6 rounded-md px-3 py-5 transition-colors duration-200 hover:bg-accent/40"
    >
      <div className="min-w-0 flex-1">
        <h3 className="line-clamp-2 text-base font-semibold leading-snug tracking-tight transition-colors group-hover:text-primary sm:text-lg">
          {title}
        </h3>
        {summary && (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {summary}
          </p>
        )}
        {meta.length > 0 && (
          <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
            {meta.map((item, i) => (
              <Fragment key={i}>
                {i > 0 && <span className="text-border">·</span>}
                {item}
              </Fragment>
            ))}
          </div>
        )}
      </div>
      <Icon
        icon="lucide:arrow-up-right"
        className="mt-1.5 h-4 w-4 shrink-0 text-muted-foreground transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
      />
    </Link>
  )
}
