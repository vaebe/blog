'use client'

import { BytemdEditor } from '@/components/bytemd/editor'
import { useImmer } from 'use-immer'
import { PublishArticleInfo } from '@/types'
import { LayoutHeader } from '@/app/article/components/header'

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
    <div className="h-[100vh] overflow-hidden">
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
  )
}
