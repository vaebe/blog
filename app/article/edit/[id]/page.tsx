'use client'

import { useEffect, use } from 'react'
import { toast } from 'sonner'
import { BytemdEditor } from '@/components/bytemd/editor'
import { useImmer } from 'use-immer'
import { PublishArticleInfo } from '@/types'
import { HeaderComponent } from '@/app/article/Header'

export default function PublishArticle(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params)

  const [articleInfo, updateArticleInfo] = useImmer<PublishArticleInfo>({
    id: params.id,
    title: '',
    content: '',
    classify: '',
    coverImg: '',
    summary: ''
  })

  useEffect(() => {
    async function getData() {
      const res = await fetch(`/api/articles/details?id=${params.id}`).then((res) => res.json())

      if (res.code !== 0) {
        toast('获取文章详情失败!')
        return
      }

      updateArticleInfo((draft) => {
        draft.title = res.data.title || ''
        draft.classify = res.data.classify || ''
        draft.coverImg = res.data.coverImg || ''
        draft.summary = res.data.summary || ''
        draft.content = res.data.content || ''
      })
    }
    getData()
  }, [params.id, updateArticleInfo])

  return (
    <div className="h-[100vh] overflow-hidden">
      <HeaderComponent
        articleInfo={articleInfo}
        updateArticleInfo={updateArticleInfo}
        publishButName="编辑"
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
