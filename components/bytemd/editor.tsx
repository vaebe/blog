'use client'

import './editor.scss'
import plugins from './plugins'
import { Editor } from '@bytemd/react'
import zh_Hans from 'bytemd/locales/zh_Hans.json'
import { imagekitUploadFile } from '@/lib/imagekit'
import { toast } from '@/components/hooks/use-toast'

async function uploadImages(files: File[]) {
  const resultData: Record<'url' | 'alt' | 'title', string>[] = []

  for (const item of files) {
    const res = await imagekitUploadFile({ file: item, fileName: item.name })

    if (res?.code === 0) {
      console.log('res', res)
      resultData.push({
        url: res?.data.url,
        alt: item.name,
        title: item.name
      })
    } else {
      toast({ variant: 'destructive', title: '警告', description: '图片上传失败，请重试!' })
    }
  }

  return resultData
}

interface BytemdEditorProps {
  content: string
  setContent: (content: string) => void
}

export function BytemdEditor({ content, setContent }: BytemdEditorProps) {
  return (
    <Editor
      value={content}
      locale={zh_Hans}
      plugins={plugins}
      onChange={(v) => {
        setContent(v)
      }}
      uploadImages={uploadImages}
    />
  )
}
