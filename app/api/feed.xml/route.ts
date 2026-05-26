import RSS from 'rss'
import { getAllArticles } from '@/lib/articles'

export async function GET() {
  const NEXT_PUBLIC_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? ''

  const feed = new RSS({
    title: 'vaebe blog | 开发者',
    description:
      '我是 Vaebe，一名全栈开发者，专注于前端技术。我的主要技术栈是 Vue 及其全家桶，目前也在使用 React 来构建项目，比如这个博客，它使用 Next.js。',
    site_url: NEXT_PUBLIC_SITE_URL ?? '',
    feed_url: `${NEXT_PUBLIC_SITE_URL}/feed.xml`,
    language: 'zh-CN', // 网站语言代码
    image_url: `${NEXT_PUBLIC_SITE_URL}/og/opengraph-image.png` // 放一个叫 opengraph-image.png 的1200x630尺寸的图片到你的 app 目录下即可
  })

  let articles: Awaited<ReturnType<typeof getAllArticles>> = []
  try {
    articles = await getAllArticles()
  } catch {
    // 数据获取失败时返回空 feed，避免阻塞构建/请求
    articles = []
  }

  articles.forEach((post) => {
    feed.item({
      title: post.title, // 文章名
      guid: post.id, // 文章 ID
      url: `${NEXT_PUBLIC_SITE_URL}/article/${post.id}`,
      description: post.summary, // 文章的介绍
      date: new Date(post.createdAt).toISOString(), // 文章的发布时间
      enclosure: {
        url: post.coverImg ?? ''
      }
    })
  })

  return new Response(feed.xml(), {
    headers: {
      'content-type': 'application/xml'
    }
  })
}
