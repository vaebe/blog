import { ContentCard } from './ContentCard'
import { Icon } from '@iconify/react'
import Link from 'next/link'
import type { GithubPinnedRepoInfo } from '@/lib/github/pinned-repos'
import { GitHubPinnedReposCacheDataKey } from '@/lib/github/pinned-repos'
import { getCacheDataByKey } from '@/lib/cache-data'
import { TimeInSeconds } from '@/lib/enums'

function NoFound() {
  return (
    <div className="text-center text-gray-500 dark:text-gray-400 py-8">No repositories found.</div>
  )
}

function ProjectInfo({ repos }: { repos: GithubPinnedRepoInfo[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {repos.map((repo) => (
        <div
          key={repo.id}
          className="hover:bg-black/10 dark:hover:bg-white/10 rounded p-2 transition duration-300 ease-in-out"
        >
          <Link href={repo.url} target="_blank" rel="noopener noreferrer">
            <h3 className="text-lg font-semibold mb-2 transition duration-300">{repo.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
              {repo.description || 'No description available'}
            </p>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 space-x-4">
              <span className="flex items-center">
                <Icon icon="mdi:star" className="w-4 h-4 mr-1 text-yellow-500" />
                {repo.stargazerCount}
              </span>
              <span className="flex items-center">
                <Icon icon="mdi:source-fork" className="w-4 h-4 mr-1 text-green-500" />
                {repo.forkCount}
              </span>
              {repo.primaryLanguage && (
                <span className="flex items-center">
                  <span
                    className="w-3 h-3 rounded-full mr-1"
                    style={{ backgroundColor: repo.primaryLanguage.color }}
                  ></span>
                  {repo.primaryLanguage.name}
                </span>
              )}
            </div>
          </Link>
        </div>
      ))}
    </div>
  )
}

export async function GithubProject() {
  let repos: GithubPinnedRepoInfo[] = []

  try {
    const res = await getCacheDataByKey<GithubPinnedRepoInfo[]>({
      key: GitHubPinnedReposCacheDataKey,
      next: { revalidate: TimeInSeconds.oneHour }
    })

    if (res.code === 0 && res.data) {
      repos = res.data
    }
  } catch {
    repos = []
  }

  return (
    <ContentCard title="GitHub">
      {repos.length === 0 ? <NoFound /> : <ProjectInfo repos={repos} />}
    </ContentCard>
  )
}
