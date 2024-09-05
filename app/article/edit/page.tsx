'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from '@/components/hooks/use-toast'
import { PublishDialog } from '../components/publishDialog'
import type { PublishData } from '../components/publishDialog'
import { useRouter } from 'next/navigation'
import { BytemdEditor } from '@/components/bytemd/editor'
import { useSearchParams } from 'next/navigation'
import { useImmer } from 'use-immer'
import { PublishArticleInfo } from '@/types'

export default function PublishArticle() {
  const searchParams = useSearchParams()
  const id = searchParams.get('id') // 获取查询参数 ?id=1234

  const [articleInfo, updateArticleInfo] = useImmer<PublishArticleInfo>({
    id: '',
    title: '',
    content: '',
    category: '',
    coverImage: '',
    summary: ''
  })

  useEffect(() => {
    if (!id) {
      return
    }

    async function getData() {
      const res = await fetch(`/api/articles/details?id=${id}`).then((res) => res.json())

      if (res.code !== 0) {
        toast({ variant: 'destructive', title: '警告', description: '获取文章详情失败!' })
        return
      }

      updateArticleInfo((draft) => {
        draft.id = res.data.id
        draft.title = res.data.title || ''
        // draft.content = res.data.content || ''
        draft.category = res.data.classify || ''
        draft.coverImage = res.data.coverImage || ''
        draft.summary = res.data.summary || ''
      })
    }
    getData()
  }, [])

  const router = useRouter()

  const [publishDialogShow, setPublishDialogShow] = useState<boolean>(false)

  const handlePublish = async () => {
    setPublishDialogShow(false)

    if (!articleInfo.title) {
      toast({ title: '警告', description: '文章标题不能为空', variant: 'destructive' })
      return
    }

    if (!articleInfo.content) {
      toast({ title: '警告', description: '文章内容不能为空', variant: 'destructive' })
      return
    }

    try {
      const res = await fetch('/api/articles/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(articleInfo)
      }).then((res) => res.json())

      if (res.code === 0) {
        router.push('/articles')
        toast({ title: '文章发布成功', description: '文章发布成功!' })
      } else {
        toast({ title: '发布失败', description: '发布文章时出现错误', variant: 'destructive' })
      }
    } catch (error) {
      toast({ title: '发布失败', description: '发布文章时出现错误', variant: 'destructive' })
    }
  }

  return (
    <div className="h-[100vh] overflow-hidden">
      <header className="flex items-center justify-between border-b">
        <Input
          value={articleInfo.title}
          onChange={(e) => updateArticleInfo((d) => (d.title = e.target.value))}
          placeholder="输入文章标题..."
          className="text-xl font-bold border-none rounded-none shadow-none focus-visible:ring-0"
        />
        <Button className="rounded-none shadow-none" onClick={() => setPublishDialogShow(true)}>
          发布
        </Button>
      </header>

      <BytemdEditor
        content={articleInfo.content}
        setContent={(val) => updateArticleInfo((d) => (d.content = val))}
      ></BytemdEditor>

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
