/** @type {import('next-sitemap').IConfig} */

const { NEXT_PUBLIC_SITE_URL } = process.env

module.exports = {
  siteUrl: NEXT_PUBLIC_SITE_URL,
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  exclude: ['/api', '/api/**', '/article/add'],
  additionalPaths: async () => {
    let articles = []

    // 本地打包不会生成-因为调用接口会失败！
    try {
      const res = await fetch(`${NEXT_PUBLIC_SITE_URL}/api/articles/all`)
      const json = await res.json()
      articles = json.code === 0 ? json.data : []
    } catch {
      articles = []
    }

    const result = []

    articles.map((item) => {
      result.push({
        loc: `${NEXT_PUBLIC_SITE_URL}/article/${item.id}`, // 页面位置
        changefreq: 'daily', // 更新频率
        priority: 0.8, // 优先级
        lastmod: new Date(item.createdAt).toISOString() // 最后修改时间
      })
    })

    return result
  }
}
