import { Suspense } from 'react'
import { JueJinArticles } from './home/JueJinArticles'
import { GithubProject } from './home/GithubProject'
import { UserProfile } from './home/UserProfile'
import { TechnologyStack } from './home/TechnologyStack'
import { Skeleton } from '@/components/ui/skeleton'
import { Reveal } from '@/components/reveal'

function SectionSkeleton({ rows = 2 }: { rows?: number }) {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-40" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array.from({ length: rows * 2 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    </div>
  )
}

export default function About() {
  return (
    <div className="max-w-5xl mx-auto px-4 space-y-16 py-4">
      {/* 动态读取 GitHub/掘金 用户信息，单独流式加载 */}
      <Suspense fallback={<SectionSkeleton />}>
        <UserProfile />
      </Suspense>

      {/* 作品优先：先让访客看到"能做什么" */}
      <Reveal delay={0.05}>
        <Suspense fallback={<SectionSkeleton />}>
          <GithubProject />
        </Suspense>
      </Reveal>

      <Reveal delay={0.1}>
        <Suspense fallback={<SectionSkeleton />}>
          <JueJinArticles />
        </Suspense>
      </Reveal>

      {/* 技术栈放最后，权重最低 */}
      <Reveal delay={0.15}>
        <TechnologyStack></TechnologyStack>
      </Reveal>
    </div>
  )
}
