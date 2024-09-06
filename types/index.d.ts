declare global {
  // 扩展 fetch Response 字段
  interface Response {
    code?: number
    data?: any
    msg?: string
  }
}

export interface PublishArticleInfo {
  id?: string
  title: string
  content: string
  classify: string
  coverImage: string
  summary: string
}
