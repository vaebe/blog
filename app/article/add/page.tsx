'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from '@/components/hooks/use-toast'
import { PublishDialog } from '../components/publishDialog'
import type { PublishData } from '../components/publishDialog'
import { useRouter } from 'next/navigation'
import { BytemdEditor } from '@/components/bytemd/editor'

export default function PublishArticle() {
  const router = useRouter()

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  const [publishDialogShow, setPublishDialogShow] = useState<boolean>(false)

  const handlePublish = async (info: PublishData) => {
    setPublishDialogShow(false)

    if (!title) {
      toast({ title: '警告', description: '文章标题不能为空', variant: 'destructive' })
      return
    }

    if (!content) {
      toast({ title: '警告', description: '文章内容不能为空', variant: 'destructive' })
      return
    }

    try {
      const res = await fetch('/api/articles/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title,
          content,
          status: 'published',
          classify: info.category,
          coverImg: info.coverImage ?? 'img',
          summary: info.summary
        })
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
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="输入文章标题..."
          className="text-xl font-bold border-none rounded-none shadow-none focus-visible:ring-0"
        />
        <Button className="rounded-none shadow-none" onClick={() => setPublishDialogShow(true)}>
          发布
        </Button>
      </header>

      <BytemdEditor content={content} setContent={setContent}></BytemdEditor>

      <PublishDialog
        isOpen={publishDialogShow}
        onClose={() => setPublishDialogShow(false)}
        onPublish={(info: PublishData) => handlePublish(info)}
      ></PublishDialog>
    </div>
  )
}
