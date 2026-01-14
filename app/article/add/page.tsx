'use client'

import { BytemdEditor } from '@/components/bytemd/editor'
import { useImmer } from 'use-immer'
import { PublishArticleInfo } from '@/types'
import { LayoutHeader } from '@/app/article/components/header'
import { RequireAdmin } from '@/components/auth/require-admin'

export default function PublishArticle() {
  const [articleInfo, updateArticleInfo] = useImmer<PublishArticleInfo>({
    id: '',
    title: '',
    content: '',
    classify: '',
    coverImg: '',
    summary: ''
  })

  return (
    <RequireAdmin>
      <div className="h-screen overflow-hidden">
        <LayoutHeader
          articleInfo={articleInfo}
          updateArticleInfo={updateArticleInfo}
          publishButName="新增"
        ></LayoutHeader>

        <BytemdEditor
          content={articleInfo.content}
          setContent={(val) =>
            updateArticleInfo((draft) => {
              draft.content = val || ''
            })
          }
        ></BytemdEditor>
      </div>
    </RequireAdmin>
  )
}
