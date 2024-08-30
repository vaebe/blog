'use client'
import { routerList } from '@/lib/routers'

function NavList() {
  return (
    <ul className="space-y-2">
      {
        routerList.map(item => (
          <li key={item.path}>
            <a href={item.path} className="text-gray-300 hover:text-white">{item.name}</a>
          </li>
        ))
      }
    </ul>
  )
}

export default function LayoutFooter() {

  const githubUserName = process.env.NEXT_PUBLIC_GITHUB_USER_NAME

  return (
    <footer className="bg-gray-800 dark:bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">关于</h3>
            <p className="text-gray-300">一个分享Web开发和技术见解与经验的个人博客。</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">快速链接</h3>
            <NavList></NavList>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">订阅</h3>
            <p className="text-gray-300 mb-4">及时获取我们的最新文章和新闻。</p>
            <form className="flex">
              <input type="email" placeholder="输入您的邮箱" className="flex-grow px-4 py-2 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">订阅</button>
            </form>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-center">
          <a href={`https://github.com/${githubUserName}/blog/blob/main/LICENSE`} target="_blank" rel="noopener noreferrer" className="mr-2 hover:text-blue-500 dark:hover:text-blue-400">Released under the MIT License.</a>
          <a href={`https://github.com/${githubUserName}`} target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 dark:hover:text-blue-400">Copyright © 2024-present {githubUserName}.</a>
        </div>
      </div>
    </footer>
  )
}