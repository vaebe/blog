import { sendJson } from '@/lib/utils'
import { getArticles } from './juejin-data'
import { saveGitHubPinnedReposToCache } from '@/lib/github/pinned-repos'
import { saveGithubUserInfoToCache } from '@/lib/github/user-info'
export async function GET(req: Request) {
  const apiKey = req.headers.get('x-api-key')
  const expectedApiKey = process.env.GITHUB_REPOSITORY_API_KEY

  // 验证 API 密钥
  if (!apiKey || apiKey !== expectedApiKey) {
    return sendJson({ code: -1, msg: '无效的 API 密钥' })
  }

  try {
    console.log('开始缓存 GitHub 用户信息...')
    const githubUserInfoToCacheRes = await saveGithubUserInfoToCache()
    console.log(githubUserInfoToCacheRes, '/r/n')

    console.log('开始同步 GitHub 置顶仓库...')
    const gitHubPinnedReposToCacheRes = await saveGitHubPinnedReposToCache()
    console.log(gitHubPinnedReposToCacheRes, '/r/n')

    console.log('开始同步掘金文章...')
    const syncArticleNameList = await getArticles(0)
    console.log(syncArticleNameList, '/r/n')

    return sendJson({
      code: 0,
      msg: '同步数据成功',
      data: { syncArticleNameList, gitHubPinnedReposToCacheRes, githubUserInfoToCacheRes }
    })
  } catch (error) {
    return sendJson({ code: -1, msg: `同步数据失败：${error}` })
  }
}
