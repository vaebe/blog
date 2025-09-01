import { sendJson } from '@/lib/utils'
import { getArticles } from './juejin-data'
import { saveGitHubPinnedReposToCache } from '@/lib/github/fetch-pinned-repos'

export async function GET(req: Request) {
  const apiKey = req.headers.get('x-api-key')
  const expectedApiKey = process.env.GITHUB_REPOSITORY_API_KEY

  // 验证 API 密钥
  if (!apiKey || apiKey !== expectedApiKey) {
    return sendJson({ code: -1, msg: '无效的 API 密钥' })
  }

  try {
    await saveGitHubPinnedReposToCache()
    const syncArticleNameList = await getArticles(0)

    console.log(syncArticleNameList)

    return sendJson({ data: syncArticleNameList, msg: '同步掘金文章成功' })
  } catch (error) {
    return sendJson({ code: -1, msg: `同步掘金文章失败：${error}` })
  }
}
