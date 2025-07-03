import { TimeInSeconds } from '../enums'

const GITHUB_GRAPHQL_URL = 'https://api.github.com/graphql'

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

// 获取 GitHub 项目
export async function fetchPinnedRepos() {
  const username = process.env.NEXT_PUBLIC_GITHUB_USER_NAME
  const token = process.env.GITHUB_API_TOKEN

  if (!username || !token) {
    throw new Error('GitHub 用户名或 token 未配置')
  }

  const query = buildQuery(username)

  const response = await fetch(GITHUB_GRAPHQL_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ query }),
    next: { revalidate: TimeInSeconds.oneHour } // 数据缓存一个小时
  })

  if (!response.ok) {
    const errorMessage = await response.text()
    throw new Error(`获取 GitHub 仓库信息失败: ${response.statusText} - ${errorMessage}`)
  }

  const res = await response.json()

  const edges: Edges = res?.data?.user?.pinnedItems?.edges ?? []

  return edges.map((edge) => edge.node as GithubPinnedRepoInfo) || []
}
