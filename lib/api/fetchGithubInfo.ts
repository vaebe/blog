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
  try {
    const res = await fetch('http://localhost:3000/api/proxy/github/pinnedRepos')

    if (res.ok) {
      const list = await res.json()

      console.log(list, '-=-=-=-')
      return list
    }

    return []
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
  try {
    const res = await fetch('http://localhost:3000/api/proxy/github/userInfo')

    if (res.ok) {
      const userInfo = await res.json();
      return userInfo;
    }

    return {}
  } catch (error) {
    console.error('Failed to fetch user information:', error);
  }
}

