export interface GithubPinnedRepoInfo {
  id: number
  "name": string,
  "description": string,
  "url": string,
  "stargazerCount": number,
  "forkCount": number,
  "primaryLanguage": {
    "name": string
  }
}

export async function fetchGithubPinnedRepos() {
  const query = `
  {
    user(login: "${process.env.GITHUB_USER_NAME}") {
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
              }
            }
          }
        }
      }
    }
  }
  `;

  const response = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.GITHUB_API_TOKEN}`,
    },
    body: JSON.stringify({ query }),
  }).then(res => res.json())

  const list = response?.data?.user?.pinnedItems?.edges?.map((edge: any) => edge.node) || [];
  return list as GithubPinnedRepoInfo[]
}
