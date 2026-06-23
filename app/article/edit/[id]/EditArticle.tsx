'use client'

import { useEffect, useState, use } from 'react'
import { toast } from 'sonner'
import { PublishArticleInfo } from '@/types'
import { ArticleEditorForm } from '@/app/article/components/ArticleEditorForm'

export function EditArticle({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [initial, setInitial] = useState<PublishArticleInfo | null>(null)

  useEffect(() => {
    async function getData() {
      const res = await fetch(`/api/articles/details?id=${id}`).then((r) => r.json())
      if (res.code !== 0) {
        toast('获取文章详情失败!')
        return
      }
      setInitial({
        id,
        title: res.data.title || '',
        classify: res.data.classify || '',
        coverImg: res.data.coverImg || '',
        summary: res.data.summary || '',
        content: res.data.content || ''
      })
    }
    getData()
  }, [id])

  if (!initial) return <div className="h-screen" />
  return <ArticleEditorForm publishButName="编辑" initial={initial} />
}
