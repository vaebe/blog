'use client'

import { ArticleEditorForm } from '@/app/article/components/ArticleEditorForm'

export default function PublishArticle() {
  return (
    <ArticleEditorForm
      publishButName="新增"
      initial={{ id: '', title: '', content: '', classify: '', coverImg: '', summary: '' }}
    />
  )
}
