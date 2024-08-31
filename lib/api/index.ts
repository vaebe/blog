import { fetchGithubPinnedRepos, fetchGithubUserInfo } from './fetchGithubInfo'
import type { GithubPinnedRepoInfo, GithubUserInfo } from './fetchGithubInfo'
import { fetchJuejinArticles, fetchJuejinUserInfo } from './fetchJuejinInfo'
import type { JuejinArticle, JuejinArticlesInfo, JuejinUserInfo } from './fetchJuejinInfo'

export { fetchGithubPinnedRepos, fetchGithubUserInfo, fetchJuejinArticles, fetchJuejinUserInfo }

export type { JuejinArticle, JuejinArticlesInfo, GithubPinnedRepoInfo, GithubUserInfo, JuejinUserInfo }
