'use client'

import { JueJinArticles } from './home/JueJinArticles'
import { GithubProject } from './home/githubProject'
import { UserProfile } from './home/UserProfile'
import { TechnologyStack } from './home/TechnologyStack'

export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-2 space-y-8">
      <UserProfile />

      <TechnologyStack></TechnologyStack>

      <JueJinArticles />

      <GithubProject />
    </div>
  )
}
