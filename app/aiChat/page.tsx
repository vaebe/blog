'use client'

import { useState } from 'react'
import { useChat } from 'ai/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Loader2, Send, StopCircle, User } from 'lucide-react'
import { Viewer } from '@bytemd/react'
import bytemdPlugins from '@/components/bytemd/plugins'
import { Icon } from '@iconify/react'
import Link from 'next/link'

function PageHeader() {
  return (
    <div className="mb-4 flex items-center justify-between">
      <h1 className="text-2xl font-bold">
        {process.env.NEXT_PUBLIC_GITHUB_USER_NAME} blog AI 小助手
      </h1>

      <Link href="/">
        <Button size="icon">
          <Icon icon="lets-icons:refund-back" width="20px" />
        </Button>
      </Link>
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
    <div className="flex flex-col h-screen w-full mx-auto p-4 md:w-10/12">
      <PageHeader></PageHeader>

      <Card className="flex-grow mb-4">
        <ScrollArea className="h-[calc(100vh-200px)] p-4">
          {!chatStarted && <div className="text-center text-gray-500 mt-8">开始与 AI 助手对话</div>}
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start space-x-2 mb-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.role === 'assistant' && (
                <Avatar>
                  <AvatarFallback>AI</AvatarFallback>
                  <AvatarImage src="/ai-avatar.png" alt="AI Avatar" />
                </Avatar>
              )}
              <Card
                className={`max-w-[80%] ${message.role === 'user' ? 'bg-blue-100' : 'bg-gray-100'}`}
              >
                <CardContent className="px-3 py-0">
                  <Viewer value={message.content ?? ''} plugins={bytemdPlugins}></Viewer>
                </CardContent>
              </Card>
              {message.role === 'user' && (
                <Avatar>
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                  <AvatarImage src="/user-avatar.png" alt="User Avatar" />
                </Avatar>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-center items-center mt-4">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          )}
        </ScrollArea>
      </Card>
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
