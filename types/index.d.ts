export type JuejinArticle = {
  id: string;
  title: string;
  url: string;
  viewCount: number;
  likeCount: number;
}

export type GithubRepo = {
  id: number;
  name: string;
  url: string;
  description: string;
  stars: number;
  forks: number;
}