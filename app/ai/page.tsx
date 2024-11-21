'use client'

import { useState, useContext } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send } from 'lucide-react'
import { LayoutHeader } from './components/LayoutHeader'
import { toast } from '@/components/hooks/use-toast'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { AiSharedDataContext } from './components/AiSharedDataContext'

export default function AIChatPage() {
  const { setAiSharedData } = useContext(AiSharedDataContext)

  const [text, setText] = useState('')

  const { status } = useSession()
  const router = useRouter()

  async function createConversation() {
    try {
      const res = await fetch('/api/ai/conversation/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: 'New Chat' })
      }).then((res) => res.json())

      if (res.code !== 0) {
        toast({ title: '失败', description: '创建对话失败!', variant: 'destructive' })
        return
      }
      setAiSharedData((d) => {
        d.aiFirstMsg = text
      })

      router.push(`/ai/c/${res.data.id}`)
    } catch {
      toast({ title: '失败', description: '创建对话失败!', variant: 'destructive' })
    }
  }

  function onSend() {
    if (status === 'authenticated') {
      createConversation()
    }
  }

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
          <Button type="submit" disabled={!text.trim()} onClick={onSend}>
            <Send className="h-4 w-4 mr-2" />
            Send
          </Button>
        </div>
      </div>
    </div>
  )
}
