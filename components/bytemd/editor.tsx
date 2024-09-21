'use client'

import './editor.scss'
import plugins from './plugins'
import { Editor } from '@bytemd/react'
import zh_Hans from 'bytemd/locales/zh_Hans.json'

async function uploadImages(files: File[]) {
  let resultData = []

  for (const item of files) {
    const formData = new FormData()
    formData.append('file', item)
    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    })
    const data = await res.json()

    if (data?.code === 0) {
      resultData.push({
        url: data?.data,
        alt: item.name,
        title: item.name
      })
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
