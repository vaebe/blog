'use client'

import { LatestArticles } from './latestArticles'
import { RelatedLinks } from './relatedLinks'
import { GithubProject } from './githubProject'
import { UserProfile } from './userInfoDisplay'

export default function About() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <UserProfile />

        <LatestArticles />

        <GithubProject />

        <RelatedLinks />
      </div>
    </div>
  )
}
