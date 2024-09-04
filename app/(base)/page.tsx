'use client'

import { LatestArticles } from '@/app/(base)/home/latestArticles'
import { ArchiveInfo } from '@/app/(base)/home/archiveInfo'

export default function Component() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <LatestArticles></LatestArticles>
      <ArchiveInfo></ArchiveInfo>
    </main>
  )
}