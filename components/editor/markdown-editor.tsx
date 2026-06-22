'use client'

import type { JSX } from 'react'
import dynamic from 'next/dynamic'
import { useTheme } from 'next-themes'
import '@uiw/react-md-editor/markdown-editor.css'
import '@uiw/react-markdown-preview/markdown.css'
import { remarkPlugins, rehypePlugins } from '@/lib/markdown/plugins'
import { createImageHandlers } from './use-image-upload'

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), {
  ssr: false,
  loading: () => (
    <div className="py-8 text-center text-gray-500 dark:text-gray-400">编辑器加载中...</div>
  )
})

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
}

export function MarkdownEditor({ value, onChange }: MarkdownEditorProps): JSX.Element {
  const { resolvedTheme } = useTheme()
  const handlers = createImageHandlers((md) => onChange((value ? value + '\n' : '') + md))
  return (
    <div data-color-mode={resolvedTheme === 'dark' ? 'dark' : 'light'}>
      <MDEditor
        value={value}
        height="calc(100vh - 60px)"
        onChange={(v) => onChange(v ?? '')}
        previewOptions={{ remarkPlugins, rehypePlugins }}
        textareaProps={{ onPaste: handlers.onPaste, onDrop: handlers.onDrop }}
      />
    </div>
  )
}
