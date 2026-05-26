'use client'

import { useEffect, use } from 'react'
import { toast } from 'sonner'
import { BytemdEditor } from '@/components/bytemd/editor'
import { useImmer } from 'use-immer'
import { PublishArticleInfo } from '@/types'
import { LayoutHeader } from '@/app/article/components/header'
import { RequireAdmin } from '@/components/auth/require-admin'

export function EditArticle({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)

  const [articleInfo, updateArticleInfo] = useImmer<PublishArticleInfo>({
    id,
    title: '',
    content: '',
    classify: '',
    coverImg: '',
    summary: ''
  })

  useEffect(() => {
    async function getData() {
      const res = await fetch(`/api/articles/details?id=${id}`).then((res) => res.json())

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
  }, [id, updateArticleInfo])

  return (
    <RequireAdmin>
      <div className="h-screen overflow-hidden">
        <LayoutHeader
          articleInfo={articleInfo}
          updateArticleInfo={updateArticleInfo}
          publishButName="编辑"
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
