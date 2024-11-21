'use client'

import { useRef, useEffect } from 'react'
import { Message } from 'ai/react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Loader2, User } from 'lucide-react'
import { BytemdViewer } from '@/components/bytemd/viewer'

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

interface MessageListProps {
  messages: Message[]
  chatStarted: boolean
  isLoading: boolean
}

function MessageList({ messages, chatStarted, isLoading }: MessageListProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const scrollElement = scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]')
    if (scrollElement) {
      const observer = new ResizeObserver((entries) => {
        for (const entry of entries) {
          if (entry.target === scrollElement) {
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
    <ScrollArea ref={scrollAreaRef} style={{ height: `calc(100vh - 100px)` }}>
      <div className="p-4 w-full md:w-10/12 mx-auto">
        {!chatStarted && <div className="text-center text-gray-500">开始与 AI 助手对话</div>}

        {messages.map((message) => (
          <MessageInfo key={message.id} message={message}></MessageInfo>
        ))}

        {isLoading && (
          <div className="flex justify-center items-center mt-4">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        )}
      </div>
    </ScrollArea>
  )
}

export { MessageList, AssistantMessage, UserMessage }
