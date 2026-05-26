'use client'

import './editor.scss'
import dynamic from 'next/dynamic'
import plugins from './plugins'
import zh_Hans from 'bytemd/locales/zh_Hans.json'
import { uploadFile } from '@/app/actions/image-kit'
import { toast } from 'sonner'

// bytemd 编辑器体积较大，按需异步加载，避免进入页面初始包
const Editor = dynamic(() => import('@bytemd/react').then((mod) => mod.Editor), {
  ssr: false,
  loading: () => <div className="py-8 text-center text-gray-500 dark:text-gray-400">编辑器加载中...</div>
})

async function uploadImages(files: File[]) {
  const resultData: Record<'url' | 'alt' | 'title', string>[] = []

  for (const item of files) {
    const res = await uploadFile({ file: item, fileName: item.name })

    if (res?.code === 0) {
      console.log('res', res)
      resultData.push({
        url: res!.data?.url ?? '',
        alt: item.name,
        title: item.name
      })
    } else {
      toast('图片上传失败，请重试!')
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
