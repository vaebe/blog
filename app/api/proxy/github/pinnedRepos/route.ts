import { sendJson } from '@/lib/utils'

export async function GET() {
  const query = `
  {
    user(login: "${process.env.NEXT_PUBLIC_GITHUB_USER_NAME}") {
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
                name,
                color
              }
            }
          }
        }
      }
    }
  }
  `

  try {
    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.GITHUB_API_TOKEN}`
      },
      body: JSON.stringify({ query })
    })

    if (!response.ok) {
      return sendJson({ code: -1, msg: `获取 github 仓库信息失败: ${response.statusText}` })
    }

    const res = await response.json()

    const list = res?.data?.user?.pinnedItems?.edges?.map((edge: any) => edge.node) || []

    return sendJson({ data: list })
  } catch (error) {
    return sendJson({ code: -1, msg: `获取 github 仓库信息失败:${error}` })
  }
}
