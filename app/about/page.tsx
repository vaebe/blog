'use client'

import { useState, useEffect } from 'react'
import { Icon } from '@iconify/react'

// 假设这些类型和函数已在其他地方定义
import { fetchJuejinArticles, fetchGithubRepos } from '@/lib/api'
import type { JuejinArticle, GithubRepo } from '@/types'

export default function AboutMe() {
  const [articles, setArticles] = useState<JuejinArticle[]>([])
  const [repos, setRepos] = useState<GithubRepo[]>([])

  useEffect(() => {
    const loadData = async () => {
      const articlesData = await fetchJuejinArticles()
      const reposData = await fetchGithubRepos()
      setArticles(articlesData)
      setRepos(reposData)
    }
    loadData()
  }, [])

  // 技术栈图标映射
  const techIcons: Record<string, string> = {
    TypeScript: 'logos:typescript-icon',
    Vue: 'logos:vue',
    NuxtJs: 'logos:nuxt',
    NextJs: 'logos:nextjs-icon',
    NestJs: 'logos:nestjs',
    Go: 'logos:go',
    Mysql: 'logos:mysql',
  }

  const techStackData = ['TypeScript', 'Vue', 'NuxtJs', 'NextJs', 'NestJs', 'Go', 'Mysql']

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
     
            <section className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg transition-all duration-300 hover:shadow-xl">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <Icon icon="mdi:account" className="mr-2 text-blue-500 dark:text-blue-400" />
                关于我
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                你好！我是vaebe，一名热衷于创造全栈开发者。我喜欢探索新技术，解决复杂问题，
                并且热衷于在掘金分享我的技术见解。在GitHub上，我积极参与开源项目，不断提升自己的编程技能。
                欢迎访问我的掘金主页和GitHub主页，了解更多关于我的信息！
              </p>
            </section>

            <section className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg transition-all duration-300 hover:shadow-xl">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <Icon icon="mdi:code-tags" className="mr-2 text-blue-500 dark:text-blue-400" />
                技术栈
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {techStackData
                  .map((tech) => (
                    <div key={tech} className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-1">
                      {techIcons[tech] ? (
                        <Icon icon={techIcons[tech]} className="mr-2 w-5 h-5" />
                      ) : (
                        <Icon icon="mdi:code-tags" className="mr-2 w-5 h-5" />
                      )}
                      <span>{tech}</span>
                    </div>
                  ))}
              </div>
            </section>

            <section className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg transition-all duration-300 hover:shadow-xl">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <Icon icon="mdi:pencil" className="mr-2 text-blue-500 dark:text-blue-400" />
                最新文章
              </h2>
              <ul className="space-y-4">
                {articles.slice(0, 5).map((article) => (
                  <li key={article.id} className="border-b border-gray-200 dark:border-gray-700 pb-2">
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-blue-500 dark:hover:text-blue-400"
                    >
                      {article.title}
                    </a>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      <Icon icon="mdi:eye" className="inline mr-1" /> {article.viewCount}
                      <Icon icon="mdi:thumb-up" className="inline mx-1 ml-3" /> {article.likeCount}
                    </p>
                  </li>
                ))}
              </ul>
            </section>

            <section className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg transition-all duration-300 hover:shadow-xl">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <Icon icon="mdi:github" className="mr-2 text-blue-500 dark:text-blue-400" />
                GitHub 项目
              </h2>
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
            </section>

            <section className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg transition-all duration-300 hover:shadow-xl">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <Icon icon="mdi:link" className="mr-2 text-blue-500 dark:text-blue-400" />
                相关链接
              </h2>
              <div className="space-y-2">
                <p className="flex items-center">
                  <Icon icon="mdi:book" className="mr-2" />
                  <a href="https://juejin.cn/user/712139266339694" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 dark:hover:text-blue-400">掘金主页</a>
                </p>
                <p className="flex items-center">
                  <Icon icon="mdi:github" className="mr-2" />
                  <a href="https://github.com/vaebe" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 dark:hover:text-blue-400">GitHub主页</a>
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}