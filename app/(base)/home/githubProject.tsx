'use client'

import { ContentCard } from './ContentCard'
import { useState, useEffect } from 'react'
import { Icon } from '@iconify/react'
import { motion, AnimatePresence } from 'framer-motion'
import type { GithubPinnedRepoInfo } from '@/types/github'
import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/link'

function NoFound() {
  return (
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center text-gray-500 dark:text-gray-400 py-8"
    >
      No repositories found.
    </motion.p>
  )
}

function LoadingComponent() {
  return (
    <motion.div
      key="loader"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      {[...Array(3)].map((_, index) => (
        <div key={index}>
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-1/4" />
          {index < 2 && <div className="my-6 border-b border-gray-200 dark:border-gray-700"></div>}
        </div>
      ))}
    </motion.div>
  )
}

function ProjectInfo({ repos }: { repos: GithubPinnedRepoInfo[] }) {
  return (
    <motion.ul
      key="content"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="divide-y divide-gray-200 dark:divide-gray-700"
    >
      {repos.map((repo, index) => (
        <motion.li
          key={repo.id}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="group py-4 first:pt-0 last:pb-0"
        >
          <Link
            href={repo.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block transition duration-300 ease-in-out hover:bg-black/10 dark:hover:bg-white/10 rounded p-2"
          >
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
        </motion.li>
      ))}
    </motion.ul>
  )
}

export function GithubProject() {
  const [repos, setRepos] = useState<GithubPinnedRepoInfo[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch('/api/proxy/github/pinnedRepos').then((res) => res.json())
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
    <ContentCard title="GitHub 项目" titleIcon="mdi:github">
      <AnimatePresence>
        {isLoading ? <LoadingComponent /> : <ProjectInfo repos={repos} />}
      </AnimatePresence>

      {repos.length === 0 && !isLoading && <NoFound />}
    </ContentCard>
  )
}
