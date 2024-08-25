import { fetchGithubPinnedRepos, fetchGithubUserInfo } from './fetchGithubInfo'
import type { GithubPinnedRepoInfo, GithubUserInfo } from './fetchGithubInfo'
import { fetchJuejinArticles } from './fetchJuejinArticles'
import type { JuejinArticle, JuejinArticlesInfo } from './fetchJuejinArticles'

export { fetchGithubPinnedRepos, fetchGithubUserInfo, fetchJuejinArticles }

export type { JuejinArticle, JuejinArticlesInfo, GithubPinnedRepoInfo, GithubUserInfo }
