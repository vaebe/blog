import { fetchGithubPinnedRepos, fetchGithubUserInfo } from './fetchGithubInfo'
import type { GithubPinnedRepoInfo, GithubUserInfo } from './fetchGithubInfo'
import { fetchJuejinArticles } from './fetchJuejinInfo'
import type { JuejinArticle, JuejinArticlesInfo } from './fetchJuejinInfo'

export { fetchGithubPinnedRepos, fetchGithubUserInfo, fetchJuejinArticles }

export type { JuejinArticle, JuejinArticlesInfo, GithubPinnedRepoInfo, GithubUserInfo }
