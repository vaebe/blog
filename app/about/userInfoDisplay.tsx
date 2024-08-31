'use client'

import { motion } from 'framer-motion'
import { Icon } from '@iconify/react'
import { useState, useEffect } from "react"
import { fetchGithubUserInfo, fetchJuejinUserInfo } from '@/lib/api'
import type { GithubUserInfo, JuejinUserInfo } from '@/lib/api'
import { techIcons, techStackData } from '@/lib/enums'

function StatItem({ icon, label, value }: { icon: string; label: string; value: number | undefined }) {
  return (
    <div className="flex items-center space-x-2">
      <Icon icon={icon} className="w-5 h-5 text-gray-500 dark:text-gray-400" />
      <span className="text-gray-600 dark:text-gray-300">{label}:</span>
      <span className="font-semibold">{value}</span>
    </div>
  )
}

export function TechnologyStack() {
  return (
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
  )
}

export function UserProfile() {
  const [githubUserInfo, setGithubUserInfo] = useState<GithubUserInfo>()
  const [juejinUserInfo, setJuejinUserInfo] = useState<JuejinUserInfo>()

  useEffect(() => {
    const loadData = async () => {
      const userInfo = await fetchGithubUserInfo()
      setGithubUserInfo(userInfo)

      const juejin = await fetchJuejinUserInfo()
      setJuejinUserInfo(juejin)
    }
    loadData()
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg transition-all duration-300 hover:shadow-xl"
    >
      <div className="flex flex-col md:flex-row md:items-end md:space-x-6">
        <img
          src={githubUserInfo?.avatar_url}
          alt={`${githubUserInfo?.login}'s avatar`}
          className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 shadow-lg"
        />
        <div className="mt-4 md:mt-0">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white">{githubUserInfo?.login}</h2>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            你好！我是vaebe，一名全栈开发者。我喜欢探索新技术，解决复杂问题， 并且热衷于在掘金分享我的技术见解。在GitHub上，我积极参与开源项目，不断提升自己的编程技能。 欢迎访问我的掘金主页和GitHub主页，了解更多关于我的信息！
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <a href="https://github.com/vaebe" target="_blank" rel="noopener noreferrer">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center hover:text-blue-500 dark:hover:text-blue-400">
              <Icon icon="mdi:github" className="mr-2" /> GitHub
            </h3>
          </a>

          <StatItem icon="mdi:source-repository" label="仓库" value={githubUserInfo?.public_repos} />
          <StatItem icon="mdi:account-group" label="关注者" value={githubUserInfo?.followers} />
          <StatItem icon="mdi:account-multiple" label="正在关注" value={githubUserInfo?.following} />
        </div>
        <div className="space-y-4">

          <a href="https://juejin.cn/user/712139266339694" target="_blank" rel="noopener noreferrer">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center hover:text-blue-500 dark:hover:text-blue-400">
              <Icon icon="simple-icons:juejin" className="mr-2 text-blue-500" />
              掘金
            </h3>
          </a>

          <StatItem icon="mdi:file-document-outline" label="文章" value={juejinUserInfo?.post_article_count} />
          <StatItem icon="mdi:thumb-up" label="获赞" value={juejinUserInfo?.got_digg_count} />
          <StatItem icon="mdi:eye" label="阅读量" value={juejinUserInfo?.got_view_count} />
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">技能</h3>
        <TechnologyStack></TechnologyStack>
      </div>
    </motion.div>
  )
}