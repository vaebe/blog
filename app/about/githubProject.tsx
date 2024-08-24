import { SectionContainer } from './sectionContainer'
import {useState,useEffect} from "react"
import { Icon } from '@iconify/react'

import { fetchGithubRepos } from '@/lib/api'
import type { GithubRepo } from '@/types'

export function GithubProject() {
  const [repos, setRepos] = useState<GithubRepo[]>([])

  useEffect(() => {
    const loadData = async () => {

      const reposData = await fetchGithubRepos()

      setRepos(reposData)
    }
    loadData()
  }, [])
  
  return (
    <SectionContainer title='GitHub 项目' titleIcon='mdi:github'>
      <ul className="space-y-4">
        {repos.slice(0, 5).map((repo) => (
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
            <p className="text-sm text-gray-500 dark:text-gray-400">
              <Icon icon="mdi:star" className="inline mr-1" /> {repo.stars}
              <Icon icon="mdi:source-fork" className="inline mx-1 ml-3" /> {repo.forks}
            </p>
          </li>
        ))}
      </ul>
    </SectionContainer>
  )
}