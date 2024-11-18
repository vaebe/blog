'use client'

import { useState } from 'react'
import { useChat } from 'ai/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send, StopCircle } from 'lucide-react'
import { LayoutHeader } from './components/LayoutHeader'

export default function AIChatPage() {
  const { input, handleInputChange, handleSubmit, isLoading, stop } = useChat({
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

  return (
    <div className="flex flex-col h-screen w-full bg-white/10 p-2">
      <LayoutHeader></LayoutHeader>

      <div className="w-8/12 mx-auto mt-[20%]">
        <p className="text-4xl font-bold mb-10 text-center">有什么可以帮忙的？</p>

        <form onSubmit={onSubmit} className="flex space-x-2">
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
