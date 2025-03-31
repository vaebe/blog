import { sendJson } from '@/lib/utils'

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

async function fetchPinnedRepos() {
  const query = buildQuery(process.env.NEXT_PUBLIC_GITHUB_USER_NAME!)

  const response = await fetch(GITHUB_GRAPHQL_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.GITHUB_API_TOKEN}`
    },
    body: JSON.stringify({ query })
  })

  if (!response.ok) {
    const errorMessage = await response.text()
    throw new Error(`获取 GitHub 仓库信息失败: ${response.statusText} - ${errorMessage}`)
  }

  const res = await response.json()
  return (
    res?.data?.user?.pinnedItems?.edges?.map(
      (edge: Record<string, string | number>) => edge.node
    ) || []
  )
}

export async function GET() {
  try {
    const pinnedRepos = await fetchPinnedRepos()
    return sendJson({ data: pinnedRepos })
  } catch (error) {
    console.error(error)
    return sendJson({ code: -1, msg: '获取 GitHub 仓库信息失败!' })
  }
}
