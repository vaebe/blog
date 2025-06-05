import { Icon } from '@iconify/react'
import type { JuejinUserInfo } from '@/types/juejin'
import type { GithubUserInfo } from '@/types/github'
import Link from 'next/link'
import Image from 'next/image'
import userIcon from '@/public/user-icon.png'
import { TimeInSeconds } from '@/lib/enums'

// 统计项组件
const StatItem = ({ icon, label, value }: { icon: string; label: string; value?: number }) => (
  <div className="inline-flex items-center space-x-2">
    <Icon icon={icon} className="w-5 h-5 text-gray-500 dark:text-gray-400" />
    <span className="text-gray-600 dark:text-gray-300">{label}:</span>
    <span className="font-semibold">{value ?? '-'}</span>
  </div>
)

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

interface SocialStatsSectionProps {
  platform: keyof typeof SOCIAL_LINKS
  stats: { icon: string; label: string; value?: number }[]
}

// 社交媒体统计区块
const SocialStatsSection = ({ platform, stats }: SocialStatsSectionProps) => (
  <div className="flex flex-col items-center lg:items-start space-y-4">
    <Link
      href={SOCIAL_LINKS[platform].url}
      className="flex justify-center lg:justify-items-start"
      target="_blank"
      rel="noopener noreferrer"
    >
      <h3 className="inline-flex items-center text-xl font-semibold text-gray-800 dark:text-white hover:text-blue-500 dark:hover:text-blue-400">
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

function GitHubSocialStatsSection({ info }: { info?: GithubUserInfo }) {
  return (
    <SocialStatsSection
      platform="github"
      stats={[
        {
          icon: 'mdi:source-repository',
          label: '仓库',
          value: info?.public_repos
        },
        { icon: 'mdi:account-group', label: '关注者', value: info?.followers },
        {
          icon: 'mdi:account-multiple',
          label: '正在关注',
          value: info?.following
        }
      ]}
    />
  )
}

function JuejinSocialStatsSection({ info }: { info?: JuejinUserInfo }) {
  return (
    <SocialStatsSection
      platform="juejin"
      stats={[
        {
          icon: 'mdi:file-document-outline',
          label: '文章',
          value: info?.post_article_count
        },
        { icon: 'mdi:thumb-up', label: '获赞', value: info?.got_digg_count },
        { icon: 'mdi:eye', label: '阅读量', value: info?.got_view_count }
      ]}
    />
  )
}

const Userdescription = `
我是 Vaebe，我的主要技术栈是 Vue 全家桶，目前也在使用 React 来构建项目，比如这个博客它使用 Next.js。
我会将自己的实践过程以文章的形式分享在掘金上，并在 GitHub上参与开源项目，不断提升自己的编程技能。
欢迎访问我的掘金主页和 GitHub主页，了解更多关于我的信息！`

// 主要用户信息组件
const UserInfo = ({ githubUserInfo }: { githubUserInfo?: GithubUserInfo }) => (
  <div className="flex flex-col items-center md:flex-row md:items-center md:space-x-6">
    <Image
      src={githubUserInfo?.avatar_url ?? userIcon}
      alt={`${githubUserInfo?.login}'s avatar`}
      className="rounded-lg border-1 border-white dark:border-gray-800 shadow"
      width={128}
      height={128}
      priority
    />
    <div>
      <h2 className="text-3xl font-bold text-center md:text-left text-gray-800 dark:text-white">
        {githubUserInfo?.login ?? 'Loading...'}
      </h2>
      <p className="text-gray-600 dark:text-gray-300 mt-1">{Userdescription}</p>
    </div>
  </div>
)

const fetchUserInfo = async (path: string) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/proxy/${path}/userInfo`, {
      next: { revalidate: TimeInSeconds.oneHour }
    })
    const json = await res.json()
    return json.code === 0 ? json.data : {}
  } catch {
    return {}
  }
}

interface GetDataRes {
  githubUserInfo?: GithubUserInfo
  juejinUserInfo?: JuejinUserInfo
}

export async function getData() {
  const [githubUserInfo, juejinUserInfo] = await Promise.all([
    fetchUserInfo('github'),
    fetchUserInfo('juejin')
  ])
  return { githubUserInfo, juejinUserInfo } as GetDataRes
}

export async function UserProfile() {
  const { githubUserInfo, juejinUserInfo } = await getData()

  return (
    <div key="content" className="space-y-8">
      <UserInfo githubUserInfo={githubUserInfo} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <JuejinSocialStatsSection info={juejinUserInfo}></JuejinSocialStatsSection>
        <GitHubSocialStatsSection info={githubUserInfo}></GitHubSocialStatsSection>
      </div>
    </div>
  )
}
