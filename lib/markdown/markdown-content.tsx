'use client'

import MarkdownPreview from '@uiw/react-markdown-preview'
import '@uiw/react-markdown-preview/markdown.css'
import { remarkPlugins, rehypePlugins, sanitizeRehypePlugins } from './plugins'

interface MarkdownContentProps {
  source: string
  /** 公开不可信内容(如留言)传 true 启用 XSS 净化 */
  sanitize?: boolean
  className?: string
}

export function MarkdownContent({ source, sanitize = false, className }: MarkdownContentProps) {
  return (
    <MarkdownPreview
      source={source}
      remarkPlugins={remarkPlugins}
      rehypePlugins={sanitize ? sanitizeRehypePlugins : rehypePlugins}
      className={className}
    />
  )
}
