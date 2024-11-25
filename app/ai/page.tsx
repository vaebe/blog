'use client'

import { useState, useContext } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send, StopCircle } from 'lucide-react'
import { LayoutHeader } from './components/LayoutHeader'
import { toast } from '@/components/hooks/use-toast'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { AiSharedDataContext } from './components/AiSharedDataContext'
import { MessageList } from '@/app/ai/components/MessageList'
import { useChat } from 'ai/react'
import { StartAConversationPrompt } from './components/StartAConversationPrompt'

export default function AIChatPage() {
  const { setAiSharedData } = useContext(AiSharedDataContext)

  const { messages, input, handleInputChange, handleSubmit, isLoading, stop } = useChat({
    api: '/api/ai/chat',
    keepLastMessageOnError: true
  })

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
        d.aiFirstMsg = input
      })

      router.push(`/ai/c/${res.data.id}`)
    } catch {
      toast({ title: '失败', description: '创建对话失败!', variant: 'destructive' })
    }
  }

  const [chatStarted, setChatStarted] = useState(false)

  const { status } = useSession()

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!input.trim()) {
      return
    }

    if (status === 'authenticated') {
      createConversation()
      return
    } else {
      handleSubmit(e)
    }

    if (!chatStarted) setChatStarted(true)
  }

  return (
    <div className="flex flex-col h-screen w-full bg-white/10 p-2">
      <LayoutHeader></LayoutHeader>

      <div className="w-full h-full flex flex-col items-center justify-center">
        <StartAConversationPrompt chatStarted={chatStarted}></StartAConversationPrompt>
        <MessageList messages={messages} isLoading={isLoading} className="md:w-8/12"></MessageList>

        <div className="flex justify-center p-2 md:w-8/12 mx-auto">
          <form onSubmit={onSubmit} className="w-full flex space-x-2">
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder="在此处输入您的消息..."
              disabled={isLoading}
              className="flex-grow"
            />
            <Button type="submit" disabled={isLoading || !input.trim()}>
              <Send className="h-4 w-4 mr-2" />
              Send
            </Button>
            {isLoading && (
              <Button type="button" variant="outline" onClick={() => stop()}>
                <StopCircle className="h-4 w-4 mr-2" />
                Stop
              </Button>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}
