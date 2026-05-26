import { Suspense } from 'react'
import { JueJinArticles } from './home/JueJinArticles'
import { GithubProject } from './home/GithubProject'
import { UserProfile } from './home/UserProfile'
import { TechnologyStack } from './home/TechnologyStack'
import { Skeleton } from '@/components/ui/skeleton'

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
    <div className="max-w-4xl mx-auto px-2 space-y-8">
      {/* 动态读取 GitHub/掘金 用户信息，单独流式加载 */}
      <Suspense fallback={<SectionSkeleton />}>
        <UserProfile />
      </Suspense>

      {/* 纯静态内容，立即渲染 */}
      <TechnologyStack></TechnologyStack>

      <Suspense fallback={<SectionSkeleton />}>
        <JueJinArticles />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <GithubProject />
      </Suspense>
    </div>
  )
}
