'use client'

import { useState, useRef, useEffect } from 'react'
import { useChat, Message } from 'ai/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Loader2, Send, StopCircle, User } from 'lucide-react'
import { BytemdViewer } from '@/components/bytemd/viewer'
import { useSession } from 'next-auth/react'

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

function UserMessage({ message }: { message: Message }) {
  return (
    <>
      <Card className="max-w-[80%] p-2">{message.content ?? ''}</Card>

      <Avatar>
        <AvatarFallback>
          <User className="h-4 w-4" />
        </AvatarFallback>
        <AvatarImage src="/user-avatar.png" alt="User Avatar" />
      </Avatar>
    </>
  )
}

function AssistantMessage({ message }: { message: Message }) {
  return (
    <>
      <Avatar>
        <AvatarFallback>AI</AvatarFallback>
        <AvatarImage src="/ai-avatar.png" alt="AI Avatar" />
      </Avatar>

      <Card className="max-w-[80%] p-2">
        <BytemdViewer content={message.content ?? ''}></BytemdViewer>
      </Card>
    </>
  )
}

function MessageInfo({ message }: { message: Message }) {
  return (
    <div
      key={message.id}
      className={`flex items-start space-x-2 mb-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
    >
      {message.role === 'assistant' ? (
        <AssistantMessage message={message}></AssistantMessage>
      ) : (
        <UserMessage message={message}></UserMessage>
      )}
    </div>
  )
}

function MessageList({ messages }: { messages: Message[] }) {
  return messages.map((message) => <MessageInfo key={message.id} message={message}></MessageInfo>)
}

export default function AIChatPage() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, stop } = useChat({
    api: '/api/ai/chat',
    keepLastMessageOnError: true
  })

  const [chatStarted, setChatStarted] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const [scrollHeight, setScrollHeight] = useState(0)

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (input.trim()) {
      handleSubmit(e)
      if (!chatStarted) setChatStarted(true)
    }
  }

  useEffect(() => {
    const scrollElement = scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]')
    if (scrollElement) {
      const observer = new ResizeObserver((entries) => {
        for (let entry of entries) {
          if (entry.target === scrollElement) {
            setScrollHeight(entry.target.scrollHeight)
            entry.target.scrollTop = entry.target.scrollHeight
          }
        }
      })

      observer.observe(scrollElement)

      return () => {
        observer.disconnect()
      }
    }
  }, [messages])

  return (
    <div className="flex flex-col h-screen w-full mx-auto p-4 md:w-10/12">
      <PageHeader></PageHeader>

      <Card className="flex-grow mb-4 overflow-hidden">
        <ScrollArea
          className="h-[calc(100vh-160px)]"
          ref={scrollAreaRef}
          style={{ height: `calc(100vh - 160px)`, maxHeight: `calc(100vh - 160px)` }}
        >
          <div className="p-4" style={{ minHeight: `${scrollHeight}px` }}>
            {!chatStarted && (
              <div className="text-center text-gray-500 mt-8">开始与 AI 助手对话</div>
            )}

            <MessageList messages={messages}></MessageList>

            {isLoading && (
              <div className="flex justify-center items-center mt-4">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            )}
          </div>
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
