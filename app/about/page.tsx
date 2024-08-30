'use client'

import { useState, useEffect } from "react"
import { fetchGithubUserInfo } from '@/lib/api'
import type { GithubUserInfo } from '@/lib/api'
import { LatestArticles } from './latestArticles'
import { AboutMe } from './aboutMe'
import { TechnologyStack } from './technologyStack'
import { RelatedLinks } from './relatedLinks'
import { GithubProject } from './githubProject'

export default function About() {
  const [githubUserInfo, setGithubUserInfo] = useState<GithubUserInfo>()

  useEffect(() => {
    const loadData = async () => {
      const userInfo = await fetchGithubUserInfo()
      setGithubUserInfo(userInfo)
    }
    loadData()
  }, [])
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <div className="text-center mb-12">
          <img
            src={githubUserInfo?.avatar_url}
            alt="头像"
            className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-blue-500 dark:border-blue-400"
          />
          <h1 className="text-4xl font-bold mb-2">{githubUserInfo?.login}</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">{githubUserInfo?.bio}</p>
        </div>

        <AboutMe></AboutMe>

        <TechnologyStack></TechnologyStack>

        <LatestArticles></LatestArticles>

        <GithubProject></GithubProject>

        <RelatedLinks></RelatedLinks>
      </div>
    </div>
  )
}