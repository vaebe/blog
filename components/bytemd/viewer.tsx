'use client'

import { Viewer } from '@bytemd/react'
import plugins from '@/components/bytemd/plugins'
import './editor.scss'
import './dark-theme.scss'

export function BytemdViewer({ content }: { content: string }) {
  return <Viewer value={content} plugins={plugins}></Viewer>
}
