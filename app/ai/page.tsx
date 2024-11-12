'use client'

import { useState } from 'react'
import { useChat } from 'ai/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Send, StopCircle } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { MessageList } from './components/MessageList'

function PageHeader() {
  const { data: session, status } = useSession()

  return (
    <div className="mb-4 flex items-center justify-between">
      <h1 className="text-2xl font-bold">
        {process.env.NEXT_PUBLIC_GITHUB_USER_NAME} blog AI 小助手
      </h1>

      {status === 'authenticated' && (
        <div className="flex items-center space-x-2 cursor-pointer">
          <Avatar className="w-8 h-8">
            <AvatarImage src={session?.user?.image ?? ''} alt="user" />
            <AvatarFallback>{session?.user?.name ?? 'll'}</AvatarFallback>
          </Avatar>

          <span>{session?.user?.name ?? 'll'}</span>
        </div>
      )}
    </div>
  )
}

export default function AIChatPage() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, stop } = useChat({
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
    <div className="flex flex-col h-screen w-full bg-white/10 p-4">
      <PageHeader></PageHeader>

      <MessageList
        messages={messages}
        isLoading={isLoading}
        chatStarted={chatStarted}
      ></MessageList>

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
  )
}
