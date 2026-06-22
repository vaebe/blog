'use client'

import { useImmer } from 'use-immer'
import { PublishArticleInfo } from '@/types'
import { LayoutHeader } from '@/app/article/components/header'
import { RequireAdmin } from '@/components/auth/require-admin'
import { MarkdownEditor } from '@/components/editor/markdown-editor'

interface ArticleEditorFormProps {
  initial: PublishArticleInfo
  publishButName: string
}

export function ArticleEditorForm({ initial, publishButName }: ArticleEditorFormProps) {
  const [articleInfo, updateArticleInfo] = useImmer<PublishArticleInfo>(initial)

  return (
    <RequireAdmin>
      <div className="h-screen overflow-hidden">
        <LayoutHeader
          articleInfo={articleInfo}
          updateArticleInfo={updateArticleInfo}
          publishButName={publishButName}
        />
        <MarkdownEditor
          value={articleInfo.content}
          onChange={(val) =>
            updateArticleInfo((draft) => {
              draft.content = val
            })
          }
        />
      </div>
    </RequireAdmin>
  )
}
