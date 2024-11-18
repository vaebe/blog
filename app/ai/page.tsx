'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send } from 'lucide-react'
import { LayoutHeader } from './components/LayoutHeader'
import Link from 'next/link'

export default function AIChatPage() {
  const [text, setText] = useState('')

  return (
    <div className="flex flex-col h-screen w-full bg-white/10 p-2">
      <LayoutHeader></LayoutHeader>

      <div className="w-8/12 mx-auto mt-[20%]">
        <p className="text-4xl font-bold mb-10 text-center">有什么可以帮忙的？</p>

        <div className="flex space-x-2">
          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="在此处输入您的消息..."
            className="flex-grow"
          />
          <Link href="/ai/c/01291021">
            <Button type="submit" disabled={!text.trim()}>
              <Send className="h-4 w-4 mr-2" />
              Send
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
