'use client'

import { useState, useEffect } from 'react'
import { useChat } from 'ai/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send, StopCircle } from 'lucide-react'
import { MessageList } from '@/app/ai/components/MessageList'
import { AiSharedDataContext } from '@/app/ai/components/AiSharedDataContext'
import { useContext } from 'react'
import { LayoutHeader } from '@/app/ai/components/LayoutHeader'

export default function AIChatPage() {
  const { aiSharedData } = useContext(AiSharedDataContext)

  const { messages, input, handleInputChange, handleSubmit, isLoading, stop, append } = useChat({
    api: '/api/ai/chat',
    keepLastMessageOnError: true
  })

  const [chatStarted, setChatStarted] = useState(false)

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (input.trim()) {
      handleSubmit(e)
      if (!chatStarted) setChatStarted(true)
    }
  }

  useEffect(() => {
    append({ content: aiSharedData.aiFirstMsg, role: 'user' })
  }, [])

  return (
    <div className="h-screen w-full">
      <LayoutHeader></LayoutHeader>

      <MessageList
        messages={messages}
        chatStarted={chatStarted}
        isLoading={isLoading}
      ></MessageList>

      <div className="flex justify-center p-2 md:w-10/12 mx-auto">
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
  )
}
