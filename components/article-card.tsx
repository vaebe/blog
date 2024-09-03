import { Article } from '@prisma/client';
import { Icon } from '@iconify/react'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { motion } from 'framer-motion'
import { getArticleDetailsUrl } from '@/lib/utils'
import Link from 'next/link'

export function ArticleCard({ article }: { article: Article }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="line-clamp-2 h-14 text-lg">
            {article.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="line-clamp-3 text-sm text-gray-600 dark:text-gray-300">
            {article.summary}
          </p>
        </CardContent>

        <CardFooter>
          <div className='w-full'>
            <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
              <span>{new Date(article.createdAt).toLocaleDateString()}</span>
              <span>5 分钟</span>
              <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                未分类
              </span>
            </div>
            <Link href={getArticleDetailsUrl(article)} target='_blank' className="mt-4 inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline">
              阅读更多 <Icon icon="ph:arrow-right-bold" className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  )
}