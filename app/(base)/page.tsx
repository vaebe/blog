'use client'

import { JueJinArticles } from './home/JueJinArticles'
import { GithubProject } from './home/githubProject'
import { UserProfile } from './home/UserProfile'
import { TechnologyStack } from './home/TechnologyStack'

export default function About() {
  return (
    <div className="max-w-5xl mx-auto my-4 space-y-8">
      <UserProfile />

      <TechnologyStack></TechnologyStack>

      <JueJinArticles />

      <GithubProject />
    </div>
  )
}
