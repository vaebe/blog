'use client'

import { useEffect, useState, use } from 'react'
import { toast } from 'sonner'
import { PublishDialog } from '@/app/article/PublishDialog'
import { useRouter } from 'next/navigation'
import { BytemdEditor } from '@/components/bytemd/editor'
import { useImmer } from 'use-immer'
import { PublishArticleInfo } from '@/types'
import { HeaderComponent } from '@/app/article/Header'

export default function PublishArticle(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params)
  const [content, setContent] = useState('')

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
      })

      setContent(res.data.content)
    }
    getData()
  }, [params.id, updateArticleInfo])

  const router = useRouter()

  const [publishDialogShow, setPublishDialogShow] = useState<boolean>(false)

  const handlePublish = async () => {
    setPublishDialogShow(false)

    if (!articleInfo.title) {
      toast('文章标题不能为空!')
      return
    }

    if (!content) {
      toast('文章内容不能为空!')
      return
    }

    try {
      const res = await fetch('/api/articles/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ...articleInfo, content })
      }).then((res) => res.json())

      if (res.code === 0) {
        router.push('/article/list')
        toast('编辑成功!')
      } else {
        toast('编辑文章时出现错误!')
      }
    } catch {
      toast('编辑文章时出现错误!')
    }
  }

  return (
    <div className="h-[100vh] overflow-hidden">
      <HeaderComponent
        title={articleInfo.title}
        updateArticleInfo={updateArticleInfo}
        setPublishDialogShow={setPublishDialogShow}
        butName="编辑"
      ></HeaderComponent>

      <BytemdEditor content={content} setContent={(val) => setContent(val)}></BytemdEditor>

      <PublishDialog
        articleInfo={articleInfo}
        updateArticleInfo={updateArticleInfo}
        isOpen={publishDialogShow}
        onClose={() => setPublishDialogShow(false)}
        onPublish={handlePublish}
      ></PublishDialog>
    </div>
  )
}
