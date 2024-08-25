import { SectionContainer } from './sectionContainer'
import { useState, useEffect } from "react"
import { Icon } from '@iconify/react'

import { fetchGithubPinnedRepos ,fetchGithubUserInfo} from '@/lib/api'
import type { GithubPinnedRepoInfo,GithubUserInfo } from '@/lib/api'

export function GithubProject() {
  const [repos, setRepos] = useState<GithubPinnedRepoInfo[]>([])
  const [githubUserInfo,setGithubUserInfo] = useState<GithubUserInfo>()

  useEffect(() => {
    const loadData = async () => {
      const reposData = await fetchGithubPinnedRepos()
      reposData && setRepos(reposData)

      const userInfo  = await fetchGithubUserInfo()
      setGithubUserInfo(userInfo)
    }
    loadData()
  }, [])

  return (
    <SectionContainer title='GitHub 项目' titleIcon='mdi:github'>
      <ul className="space-y-4">
        {repos.map((repo) => (
          <li key={repo.id} className="border-b border-gray-200 dark:border-gray-700 pb-2">
            <a
              href={repo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-500 dark:hover:text-blue-400"
            >
              {repo.name}
            </a>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {repo.description}
            </p>
            <p className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <Icon icon="mdi:star" className="inline mr-1" /> {repo.stargazerCount}
              <Icon icon="mdi:source-fork" className="inline mx-1 ml-3" /> {repo.forkCount}
            </p>
          </li>
        ))}
      </ul>
    </SectionContainer>
  )
}