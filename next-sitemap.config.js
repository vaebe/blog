/** @type {import('next-sitemap').IConfig} */
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const NEXT_PUBLIC_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL

module.exports = {
  siteUrl: NEXT_PUBLIC_SITE_URL,
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  exclude: ['/api', '/api/**'],
  additionalPaths: async () => {
    const articles = await prisma.article.findMany({
      orderBy: { createdAt: 'desc' }
    })

    const result = []

    articles.map((item) => {
      result.push({
        loc: `${NEXT_PUBLIC_SITE_URL}/article/${item.id}`, // 页面位置
        changefreq: 'daily', // 更新频率
        priority: 0.7, // 优先级
        lastmod: new Date(item.createdAt).toISOString() // 最后修改时间
      })
    })

    return result
  }
}
