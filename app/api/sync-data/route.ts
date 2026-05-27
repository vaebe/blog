import { revalidateTag } from 'next/cache'
import { sendJson } from '@/lib/utils'
import type { ApiRes } from '@/lib/utils'
import { getArticles } from './juejin-data'
import { saveGitHubPinnedReposToCache } from '@/lib/github/pinned-repos'
import { saveGithubUserInfoToCache } from '@/lib/github/user-info'
import { ARTICLES_CACHE_TAG } from '@/lib/articles'

export async function GET(req: Request) {
  const apiKey = req.headers.get('x-api-key')
  const expectedApiKey = process.env.GITHUB_REPOSITORY_API_KEY

  // 验证 API 密钥
  if (!apiKey || apiKey !== expectedApiKey) {
    return sendJson({ code: -1, msg: '无效的 API 密钥' })
  }

  console.log('开始并行同步 GitHub 用户信息 / 置顶仓库 / 掘金文章...')

  // 三个任务相互独立，用 allSettled 保证任一失败不掩盖其它任务的结果
  const [githubUserInfoSettled, pinnedReposSettled, articlesSettled] = await Promise.allSettled([
    saveGithubUserInfoToCache(),
    saveGitHubPinnedReposToCache(),
    getArticles(0)
  ])

  const failures: string[] = []

  // GitHub 用户信息缓存（子任务自身吞错并返回 code，需显式校验）
  let githubUserInfoToCacheRes: ApiRes
  if (githubUserInfoSettled.status === 'fulfilled') {
    githubUserInfoToCacheRes = githubUserInfoSettled.value
    if (githubUserInfoToCacheRes.code !== 0) {
      failures.push(`GitHub 用户信息：${githubUserInfoToCacheRes.msg}`)
    }
  } else {
    githubUserInfoToCacheRes = { code: -1, msg: String(githubUserInfoSettled.reason) }
    failures.push(`GitHub 用户信息：${githubUserInfoSettled.reason}`)
  }

  // GitHub 置顶仓库缓存
  let gitHubPinnedReposToCacheRes: ApiRes
  if (pinnedReposSettled.status === 'fulfilled') {
    gitHubPinnedReposToCacheRes = pinnedReposSettled.value
    if (gitHubPinnedReposToCacheRes.code !== 0) {
      failures.push(`GitHub 置顶仓库：${gitHubPinnedReposToCacheRes.msg}`)
    }
  } else {
    gitHubPinnedReposToCacheRes = { code: -1, msg: String(pinnedReposSettled.reason) }
    failures.push(`GitHub 置顶仓库：${pinnedReposSettled.reason}`)
  }

  // 掘金文章（getArticles 失败时抛错）
  let syncArticleNameList: string[] = []
  if (articlesSettled.status === 'fulfilled') {
    syncArticleNameList = articlesSettled.value
  } else {
    failures.push(`掘金文章：${articlesSettled.reason}`)
  }

  // 文章数据可能已变更，失效文章列表缓存
  revalidateTag(ARTICLES_CACHE_TAG, 'max')

  const data = { syncArticleNameList, gitHubPinnedReposToCacheRes, githubUserInfoToCacheRes }

  // 有任一子任务失败则如实返回，避免「谎报成功」
  if (failures.length > 0) {
    console.error('同步数据存在失败项:', failures)
    return sendJson({ code: -1, msg: `部分同步失败：${failures.join('；')}`, data })
  }

  return sendJson({ code: 0, msg: '同步数据成功', data })
}
