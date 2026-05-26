'use client'

import dynamic from 'next/dynamic'
import plugins from '@/components/bytemd/plugins'
import './editor.scss'
import './dark-theme.scss'

// bytemd 体积较大（含 highlight.js / mermaid / katex），按需异步加载
const Viewer = dynamic(() => import('@bytemd/react').then((mod) => mod.Viewer), {
  ssr: false,
  loading: () => <div className="py-8 text-center text-gray-500 dark:text-gray-400">内容加载中...</div>
})

export function BytemdViewer({ content }: { content: string }) {
  return <Viewer value={content} plugins={plugins}></Viewer>
}
