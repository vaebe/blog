'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { Icon } from '@iconify/react'
import { useState, useEffect } from 'react'
import type { JuejinUserInfo } from '@/types/juejin'
import type { GithubUserInfo } from '@/types/github'
import Link from 'next/link'
import Image from 'next/image'
import userIcon from '@/public/user-icon.png'
import { TimeInSeconds } from '@/lib/enums'

// 社交媒体链接配置
const SOCIAL_LINKS = {
  juejin: {
    url: 'https://juejin.cn/user/712139266339694',
    icon: 'simple-icons:juejin',
    label: '掘金'
  },
  github: {
    url: 'https://github.com/vaebe',
    icon: 'mdi:github',
    label: 'GitHub'
  }
} as const

// 统计项组件
const StatItem = ({ icon, label, value }: { icon: string; label: string; value?: number }) => (
  <div className="inline-flex items-center space-x-2">
    <Icon icon={icon} className="w-5 h-5 text-gray-500 dark:text-gray-400" />
    <span className="text-gray-600 dark:text-gray-300">{label}:</span>
    <span className="font-semibold">{value ?? '-'}</span>
  </div>
)

interface SocialStatsSectionProps {
  platform: keyof typeof SOCIAL_LINKS
  stats: { icon: string; label: string; value?: number }[]
}

// 社交媒体统计区块
const SocialStatsSection = ({ platform, stats }: SocialStatsSectionProps) => (
  <div className="flex flex-col space-y-4">
    <Link href={SOCIAL_LINKS[platform].url} target="_blank" rel="noopener noreferrer">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center lg:items-start hover:text-blue-500 dark:hover:text-blue-400">
        <Icon icon={SOCIAL_LINKS[platform].icon} className="mr-2" />
        {SOCIAL_LINKS[platform].label}
      </h3>
    </Link>
    <div className="flex flex-col items-center space-y-2 sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0">
      {stats.map((stat, index) => (
        <StatItem key={index} {...stat} />
      ))}
    </div>
  </div>
)

// 加载骨架屏组件
const SkeletonStatItem = () => (
  <div className="inline-flex items-center space-x-2">
    <Skeleton className="w-6 h-6 rounded-full" />
    <Skeleton className="w-14 h-6" />
    <Skeleton className="w-8 h-6" />
  </div>
)

const UserProfileSkeleton = () => (
  <div className="space-y-8">
    <div className="flex flex-col items-center md:flex-row md:space-x-6">
      <Skeleton className="w-32 h-32 rounded-lg border-1 border-white dark:border-gray-800 shadow" />
      <div className="mt-4 md:mt-0 flex-1">
        <Skeleton className="w-48 h-8 mb-2" />
        <Skeleton className="w-full h-22" />
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {[0, 1].map((section) => (
        <div key={section} className="flex flex-col items-center lg:items-start space-y-4">
          <Skeleton className="w-30 h-7" />
          <div className="flex flex-col items-center space-y-2 sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0">
            {[0, 1, 2].map((item) => (
              <SkeletonStatItem key={item} />
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
)

// 主要用户信息组件
const UserInfo = ({
  githubUserInfo,
  description
}: {
  githubUserInfo?: GithubUserInfo
  description: string
}) => (
  <div className="flex flex-col items-center md:flex-row md:items-center md:space-x-6">
    <Image
      src={githubUserInfo?.avatar_url ?? userIcon}
      alt={`${githubUserInfo?.login}'s avatar`}
      className="w-32 h-32 rounded-lg border-1 border-white dark:border-gray-800 shadow"
      width={128}
      height={128}
      priority
      placeholder="empty"
    />
    <div>
      <h2 className="text-3xl font-bold text-center md:text-left text-gray-800 dark:text-white">
        {githubUserInfo?.login ?? 'Loading...'}
      </h2>
      <p className="text-gray-600 dark:text-gray-300 mt-1">{description}</p>
    </div>
  </div>
)

// 自定义Hook: 获取用户数据
const useUserData = () => {
  const [data, setData] = useState<{
    github?: GithubUserInfo
    juejin?: JuejinUserInfo
    isLoading: boolean
    error?: string
  }>({
    isLoading: true
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [githubRes, juejinRes] = await Promise.all([
          fetch('/api/proxy/github/userInfo', { next: { revalidate: TimeInSeconds.oneHour } }),
          fetch('/api/proxy/juejin/userInfo', { next: { revalidate: TimeInSeconds.oneHour } })
        ])

        const [githubData, juejinData] = await Promise.all([githubRes.json(), juejinRes.json()])

        setData({
          github: githubData.code === 0 ? githubData.data : undefined,
          juejin: juejinData.code === 0 ? juejinData.data : undefined,
          isLoading: false
        })
      } catch (error) {
        setData((prev) => ({
          ...prev,
          isLoading: false,
          error: 'Failed to fetch user data'
        }))
        console.error('Error fetching user data:', error)
      }
    }

    fetchData()
  }, [])

  return data
}

const Userdescription = `
我是 Vaebe，一名全栈开发者，专注于前端技术。
我的主要技术栈是 Vue 全家桶，目前也在使用 React 来构建项目，比如这个博客它使用 Next.js。
我会将自己的实践过程以文章的形式分享在掘金上，并在 GitHub上参与开源项目，不断提升自己的编程技能。
欢迎访问我的掘金主页和 GitHub主页，了解更多关于我的信息！`

// 主组件
export function UserProfile() {
  const { github: githubUserInfo, juejin: juejinUserInfo, isLoading, error } = useUserData()

  if (error) {
    return <div className="text-red-500">Error: {error}</div>
  }

  return (
    <>
      {isLoading ? (
        <UserProfileSkeleton key="skeleton" />
      ) : (
        <div key="content" className="space-y-8">
          <UserInfo githubUserInfo={githubUserInfo} description={Userdescription} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SocialStatsSection
              platform="juejin"
              stats={[
                {
                  icon: 'mdi:file-document-outline',
                  label: '文章',
                  value: juejinUserInfo?.post_article_count
                },
                { icon: 'mdi:thumb-up', label: '获赞', value: juejinUserInfo?.got_digg_count },
                { icon: 'mdi:eye', label: '阅读量', value: juejinUserInfo?.got_view_count }
              ]}
            />

            <SocialStatsSection
              platform="github"
              stats={[
                {
                  icon: 'mdi:source-repository',
                  label: '仓库',
                  value: githubUserInfo?.public_repos
                },
                { icon: 'mdi:account-group', label: '关注者', value: githubUserInfo?.followers },
                {
                  icon: 'mdi:account-multiple',
                  label: '正在关注',
                  value: githubUserInfo?.following
                }
              ]}
            />
          </div>
        </div>
      )}
    </>
  )
}
