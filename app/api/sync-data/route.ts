import { revalidateTag } from 'next/cache'
import { sendJson } from '@/lib/utils'
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

  try {
    // 三个同步任务相互独立，并行执行
    console.log('开始并行同步 GitHub 用户信息 / 置顶仓库 / 掘金文章...')
    const [githubUserInfoToCacheRes, gitHubPinnedReposToCacheRes, syncArticleNameList] =
      await Promise.all([
        saveGithubUserInfoToCache(),
        saveGitHubPinnedReposToCache(),
        getArticles(0)
      ])

    // 掘金文章已写入文章表，失效文章列表缓存
    revalidateTag(ARTICLES_CACHE_TAG, 'max')

    return sendJson({
      code: 0,
      msg: '同步数据成功',
      data: { syncArticleNameList, gitHubPinnedReposToCacheRes, githubUserInfoToCacheRes }
    })
  } catch (error) {
    console.error('同步数据失败:', error)
    return sendJson({ code: -1, msg: '同步数据失败，请稍后重试' })
  }
}
