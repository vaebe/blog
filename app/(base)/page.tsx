'use client'

import { LatestArticles } from './home/latestArticles'
import { GithubProject } from './home/githubProject'
import { UserProfile } from './home/userInfoDisplay'

export default function About() {
  return (
    <div className="max-w-5xl mx-auto my-4 space-y-8">
      <UserProfile />

      <LatestArticles />

      <GithubProject />
    </div>
  )
}
