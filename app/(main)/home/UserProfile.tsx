import type { GithubUserInfo } from '@/lib/github/user-info'
import { GithubUserInfoCacheDataKey } from '@/lib/github/user-info'
import { getCacheDataByKey } from '@/lib/cache-data'
import type { JuejinUserInfo } from '@/lib/juejin/fetch-user-info'
import { fetchJuejinUserInfo } from '@/lib/juejin/fetch-user-info'
import { Hero } from '@/components/hero/hero'

const Userdescription = `
主要技术栈是 Vue 全家桶，目前也在使用 React 与 Next.js 构建现代 Web 应用。
近年来也在持续探索 AI 应用开发，包括大模型接入、AI SDK、Agent 工作流以及 AI 与前端结合的实践方向。
我会将自己的开发实践与踩坑经验整理成文章分享在掘金，同时积极参与 GitHub 开源项目。
欢迎访问我的掘金主页和 GitHub 主页，了解更多关于我的信息！`

export async function UserProfile() {
  // 两个数据源相互独立，并行获取以避免顺序 await 形成的瀑布请求
  const [githubRes, juejinRes] = await Promise.all([
    getCacheDataByKey<GithubUserInfo>({ key: GithubUserInfoCacheDataKey }).catch(() => null),
    fetchJuejinUserInfo().catch(() => null)
  ])

  const githubUserInfo: GithubUserInfo | undefined =
    githubRes?.code === 0 ? githubRes.data : undefined
  const juejinInfo: JuejinUserInfo | undefined = juejinRes ?? undefined

  // 关键数字收进 Hero 指标条，按来源分组：掘金 / GitHub
  const statGroups = [
    {
      platform: '掘金',
      icon: 'simple-icons:juejin',
      items: [
        { label: '阅读量', value: juejinInfo?.got_view_count },
        { label: '获赞', value: juejinInfo?.got_digg_count },
        { label: '文章', value: juejinInfo?.post_article_count }
      ]
    },
    {
      platform: 'GitHub',
      icon: 'mdi:github',
      items: [
        { label: '仓库', value: githubUserInfo?.public_repos },
        { label: '关注者', value: githubUserInfo?.followers },
        { label: '正在关注', value: githubUserInfo?.following }
      ]
    }
  ]

  return (
    <Hero
      login={githubUserInfo?.login}
      avatarUrl={githubUserInfo?.avatar_url}
      description={Userdescription}
      statGroups={statGroups}
    />
  )
}
