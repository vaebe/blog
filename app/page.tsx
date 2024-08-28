'use client'

import { Icon } from '@iconify/react'
import Image from 'next/image'
import articleThumbnail from '@/public/TANSHI.jpg'
import { LatestArticles } from '@/app/home/latestArticles'

export default function Component() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <aside >
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
          <Image
            src={articleThumbnail}
            alt="作者"
            className="w-full h-48 object-cover"
          />

          <div className="p-6">
            <h2 className="text-xl font-semibold mb-2">关于我</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-4">你好，我是张三。我是一名热衷于Web开发的技术爱好者。这个博客是我分享在技术世界中的思考和经验的地方。</p>
            <div className="flex space-x-4">
              <a href="https://github.com/vaebe" className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                <span className="sr-only">GitHub</span>
                <Icon icon="mdi:github" className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
      </aside>


      <div className='my-8'></div>

      <LatestArticles></LatestArticles>
    </main>
  )
}