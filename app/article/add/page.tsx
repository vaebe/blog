'use client'

import { BytemdEditor } from '@/components/bytemd/editor'
import { useImmer } from 'use-immer'
import { PublishArticleInfo } from '@/types'
import { HeaderComponent } from '@/app/article/Header'

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
      <HeaderComponent
        articleInfo={articleInfo}
        updateArticleInfo={updateArticleInfo}
        publishButName="新增"
      ></HeaderComponent>

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
