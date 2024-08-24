'use client'

import { LatestArticles } from './latestArticles'
import { AboutMe } from './aboutMe'
import {TechnologyStack} from './technologyStack'
import {RelatedLinks} from './relatedLinks'
import {GithubProject} from './githubProject'

export default function About() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <img
              src="https://avatars.githubusercontent.com/u/52314078?v=4"
              alt="头像"
              className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-blue-500 dark:border-blue-400"
            />
            <h1 className="text-4xl font-bold mb-2">vaebe</h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">全栈开发者 & 技术爱好者</p>
          </div>

          <div className="space-y-8">
            <AboutMe></AboutMe>

            <TechnologyStack></TechnologyStack>

            <LatestArticles></LatestArticles>

            <GithubProject></GithubProject>

            <RelatedLinks></RelatedLinks>
          </div>
        </div>
      </div>
    </div>
  )
}