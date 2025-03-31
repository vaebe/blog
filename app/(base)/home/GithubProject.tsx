'use client'

import { ContentCard } from './ContentCard'
import { useState, useEffect } from 'react'
import { Icon } from '@iconify/react'
import type { GithubPinnedRepoInfo } from '@/types/github'
import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/link'
import { TimeInSeconds } from '@/lib/enums'

function NoFound() {
  return (
    <div className="text-center text-gray-500 dark:text-gray-400 py-8">No repositories found.</div>
  )
}

function LoadingComponent() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[...Array(6)].map((_, index) => (
        <div key={index}>
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-1/4" />
          {index < 2 && <div className="my-6 border-b border-gray-200 dark:border-gray-700"></div>}
        </div>
      ))}
    </div>
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

export function GithubProject() {
  const [repos, setRepos] = useState<GithubPinnedRepoInfo[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch('/api/proxy/github/pinnedRepos',{
              next: { revalidate: TimeInSeconds.oneHour } 
            }).then((res) => res.json())
            
        if (res.code === 0) {
          setRepos(res.data)
        }
      } catch (error) {
        console.error('Failed to fetch GitHub data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

  return (
    <ContentCard title="GitHub 项目">
      {isLoading ? <LoadingComponent /> : <ProjectInfo repos={repos} />}

      {repos.length === 0 && !isLoading && <NoFound />}
    </ContentCard>
  )
}
