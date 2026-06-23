import type React from 'react'
import { toast } from 'sonner'
import { uploadFile } from '@/app/actions/image-kit'

async function uploadAndInsert(files: File[], insert: (md: string) => void) {
  for (const file of files) {
    if (!file.type.startsWith('image/')) continue
    const res = await uploadFile({ file, fileName: file.name })
    if (res?.code === 0 && res.data?.url) {
      insert(`![${file.name}](${res.data.url})\n`)
    } else {
      toast('图片上传失败，请重试!')
    }
  }
}

/** 生成编辑器 onPaste / onDrop 处理器:把图片上传到 ImageKit 后插入 Markdown */
export function createImageHandlers(insert: (md: string) => void) {
  return {
    onPaste: (e: React.ClipboardEvent) => {
      const files = Array.from(e.clipboardData?.files ?? [])
      if (files.some((f) => f.type.startsWith('image/'))) {
        e.preventDefault()
        void uploadAndInsert(files, insert)
      }
    },
    onDrop: (e: React.DragEvent) => {
      const files = Array.from(e.dataTransfer?.files ?? [])
      if (files.some((f) => f.type.startsWith('image/'))) {
        e.preventDefault()
        void uploadAndInsert(files, insert)
      }
    }
  }
}
