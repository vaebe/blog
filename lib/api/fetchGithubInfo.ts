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
                name
              }
            }
          }
        }
      }
    }
  }
  `;

  try {
    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_GITHUB_API_TOKEN}`,
      },
      body: JSON.stringify({ query }),
    }).then(res => res.json())

    const list = response?.data?.user?.pinnedItems?.edges?.map((edge: any) => edge.node) || [];
    return list as GithubPinnedRepoInfo[]
  } catch (error) {
    console.error('获取 github 仓库信息失败:', error);
  }
}

export interface GithubUserInfo {
  login: string
  id: number
  node_id: string
  avatar_url: string
  gravatar_id: string
  url: string
  html_url: string
  followers_url: string
  following_url: string
  gists_url: string
  starred_url: string
  subscriptions_url: string
  organizations_url: string
  repos_url: string
  events_url: string
  received_events_url: string
  type: string
  site_admin: boolean
  name: string
  company: string
  blog: string
  location: any
  email: any
  hireable: any
  bio: string
  twitter_username: any
  public_repos: number
  public_gists: number
  followers: number
  following: number
  created_at: string
  updated_at: string
}

export async function fetchGithubUserInfo() {
  const url = `https://api.github.com/users/${process.env.NEXT_PUBLIC_GITHUB_USER_NAME}`;

  try {
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    if (!response.ok) {
      throw new Error(`获取 GitHub 用户信息失败: ${response.statusText}`);
    }

    const userInfo = await response.json();
    return userInfo;
  } catch (error) {
    console.error('Failed to fetch user information:', error);
  }
}

