'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { PublishDialog } from '@/app/article/PublishDialog'
import { useRouter } from 'next/navigation'
import { BytemdEditor } from '@/components/bytemd/editor'
import { useImmer } from 'use-immer'
import { PublishArticleInfo } from '@/types'
import { HeaderComponent } from '@/app/article/Header'

export default function PublishArticle() {
  const router = useRouter()

  const [content, setContent] = useState('')

  const [articleInfo, updateArticleInfo] = useImmer<PublishArticleInfo>({
    id: '',
    title: '',
    content: '',
    classify: '',
    coverImg: '',
    summary: ''
  })

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
      const res = await fetch('/api/articles/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ...articleInfo, content })
      }).then((res) => res.json())

      if (res.code === 0) {
        router.push('/article/list')
        toast('文章发布成功!')
      } else {
        toast('发布文章时出现错误!')
      }
    } catch {
      toast('发布文章时出现错误!')
    }
  }

  return (
    <div className="h-[100vh] overflow-hidden">
      <HeaderComponent
        title={articleInfo.title}
        updateArticleInfo={updateArticleInfo}
        setPublishDialogShow={setPublishDialogShow}
        butName="发布"
      ></HeaderComponent>

      <BytemdEditor content={content} setContent={setContent}></BytemdEditor>

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
