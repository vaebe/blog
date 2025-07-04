export interface ArticleInfo {
  article_id: string
  user_id: string
  category_id: string
  tag_ids: number[]
  visible_level: number
  link_url: string
  cover_image: string
  is_gfw: number
  title: string
  brief_content: string
  is_english: number
  is_original: number
  user_index: number
  original_type: number
  original_author: string
  content: string
  ctime: string
  mtime: string
  rtime: string
  draft_id: string
  view_count: number
  collect_count: number
  digg_count: number
  comment_count: number
  hot_index: number
  is_hot: number
  rank_index: number
  status: number
  verify_status: number
  audit_status: number
  mark_content: string
  display_count: number
  is_markdown: number
  app_html_content: string
  version: number
  web_html_content: string
  meta_info: string
  catalog: string
  homepage_top_time: number
  homepage_top_status: number
  content_count: number
  read_time: string
  pics_expire_time: number
}

export interface Tag {
  id: number
  tag_id: string
  tag_name: string
  color: string
  icon: string
  back_ground: string
  show_navi: number
  ctime: number
  mtime: number
  id_type: number
  tag_alias: string
  post_article_count: number
  concern_user_count: number
}

export interface JuejinArticle {
  article_info: ArticleInfo
  tags: Tag[]
}

export interface JuejinArticlesInfo {
  count: number
  cursor: string
  data: JuejinArticle[]
  has_more: boolean
}

export async function fetchJuejinUserArticles(cursor = 0): Promise<JuejinArticlesInfo> {
  const userId = process.env.JUEJIN_USER_ID

  if (!userId) {
    throw new Error('JUEJIN_USER_ID 未配置')
  }

  const res = await fetch('https://api.juejin.cn/content_api/v1/article/query_list', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      user_id: userId,
      sort_type: 2,
      cursor: `${cursor}`
    })
  })

  if (!res.ok) {
    const errorText = await res.text()
    throw new Error(`请求掘金文章失败: ${res.status} - ${errorText}`)
  }

  return res.json()
}
