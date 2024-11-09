'use client'

import { useEffect, useState } from 'react'
import { toast } from '@/components/hooks/use-toast'
import { PublishDialog } from '@/app/article/PublishDialog'
import { useRouter } from 'next/navigation'
import { BytemdEditor } from '@/components/bytemd/editor'
import { useImmer } from 'use-immer'
import { PublishArticleInfo } from '@/types'
import { HeaderComponent } from '@/app/article/Header'

export default function PublishArticle({ params }: { params: { id: string } }) {
  const [content, setContent] = useState('')

  const [articleInfo, updateArticleInfo] = useImmer<PublishArticleInfo>({
    id: params.id,
    title: '',
    content: '',
    classify: '',
    coverImage: '',
    summary: ''
  })

  useEffect(() => {
    async function getData() {
      const res = await fetch(`/api/articles/details?id=${params.id}`).then((res) => res.json())

      if (res.code !== 0) {
        toast({ variant: 'destructive', title: '警告', description: '获取文章详情失败!' })
        return
      }

      updateArticleInfo((draft) => {
        draft.title = res.data.title || ''
        draft.classify = res.data.classify || ''
        draft.coverImage = res.data.coverImage || ''
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
      toast({ title: '警告', description: '文章标题不能为空', variant: 'destructive' })
      return
    }

    if (!content) {
      toast({ title: '警告', description: '文章内容不能为空', variant: 'destructive' })
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
        toast({ title: '成功', description: '编辑成功!' })
      } else {
        toast({ title: '失败', description: '编辑文章时出现错误', variant: 'destructive' })
      }
    } catch (error) {
      toast({ title: '失败', description: '编辑文章时出现错误', variant: 'destructive' })
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
