import { TimeInSeconds } from '../enums'
import { createCacheData, getCacheData } from '../cache-data'
import type { ApiRes } from '../utils'

const buildQuery = (username: string) => `
{
  user(login: "${username}") {
    pinnedItems(first: 6, types: [REPOSITORY]) {
      totalCount
      edges {
        node {
          ... on Repository {
            id
            name
            description
            url
            stargazerCount
            forkCount
            primaryLanguage {
              name
              color
            }
          }
        }
      }
    }
  }
}
`

export interface GithubPinnedRepoInfo {
  id: number
  name: string
  description: string
  url: string
  stargazerCount: number
  forkCount: number
  primaryLanguage: {
    name: string
    color: string
  }
}

type Edges = Record<string, string | number | GithubPinnedRepoInfo>[]

const GITHUB_GRAPHQL_URL = 'https://api.github.com/graphql'
const GITHUB_API_TOKEN = process.env.GITHUB_API_TOKEN
const GITHUB_USER_NAME = process.env.NEXT_PUBLIC_GITHUB_USER_NAME

// 获取 GitHub 置顶项目
async function getPinnedRepos(): Promise<ApiRes<GithubPinnedRepoInfo[]>> {
  if (!GITHUB_USER_NAME || !GITHUB_API_TOKEN) {
    return { code: -1, msg: 'GitHub 用户名或 token 未配置' }
  }

  try {
    const res = await fetch(GITHUB_GRAPHQL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${GITHUB_API_TOKEN}`
      },
      body: JSON.stringify({ query: buildQuery(GITHUB_USER_NAME) }),
      next: { revalidate: TimeInSeconds.oneHour } // 数据缓存一个小时
    })

    if (!res.ok) {
      const errMsg = await res.text()
      return { code: -1, msg: `获取 GitHub 仓库信息失败: ${res.statusText} - ${errMsg}` }
    }

    const dataRes = await res.json()
    const edges: Edges = dataRes?.data?.user?.pinnedItems?.edges ?? []
    const data = edges.map((edge) => edge.node as GithubPinnedRepoInfo) || []

    return { code: 0, data, msg: '获取 GitHub 置顶项目成功' }
  } catch (error) {
    return { code: -1, msg: `获取 GitHub 置顶项目失败：${error}` }
  }
}

const CacheDataKey = 'github_pinned_repos'

export async function saveGitHubPinnedReposToCache(): Promise<ApiRes> {
  try {
    const res = await getPinnedRepos()

    if (res.code !== 0) {
      return { code: -1, msg: res.msg }
    }

    const data = res.data

    if (!data || !Array.isArray(data)) {
      return { code: -1, msg: '获取 GitHub 置顶项目失败' }
    }

    return createCacheData({
      key: CacheDataKey,
      data: JSON.stringify(data),
      desc: 'GitHub 置顶项目'
    })
  } catch (error) {
    return { code: -1, msg: `保存 GitHub 置顶项目失败：${error}` }
  }
}

export async function fetchPinnedRepos(): Promise<ApiRes<GithubPinnedRepoInfo[]>> {
  try {
    const res = await getCacheData(CacheDataKey)

    if (res.code !== 0) {
      return { code: -1, msg: '获取缓存数据失败' }
    }

    const raw = res.data?.data
    if (!raw) {
      return { code: 0, data: [], msg: '缓存数据为空' }
    }

    const data = JSON.parse(raw) as GithubPinnedRepoInfo[]

    return { code: 0, data, msg: '获取缓存数据成功' }
  } catch (error) {
    return { code: -1, msg: `获取缓存数据失败：${error}` }
  }
}
