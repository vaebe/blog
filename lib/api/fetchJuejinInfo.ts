import {getApiUrl} from '@/lib/utils'

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
  web_html_content: any
  meta_info: any
  catalog: any
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
  count: number,
  cursor: string,
  data: JuejinArticle[]
}

export async function fetchJuejinArticles() {
  const res = await fetch(getApiUrl('proxy/juejin/articles'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    }
  }).then(res => res.json())
  
  return res as any as JuejinArticlesInfo
}
