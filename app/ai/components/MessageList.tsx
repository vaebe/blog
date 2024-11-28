'use client'

import { useRef, useEffect } from 'react'
import { Message } from 'ai/react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Loader2, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Markdown } from '@/components/markdown'

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
        <Markdown>{message.content ?? ''}</Markdown>
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
  isLoading: boolean
  className?: string
}

function MessageList({ messages, isLoading, className }: MessageListProps) {
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
    <>
      {!!messages.length && (
        <ScrollArea ref={scrollAreaRef} style={{ height: `calc(100vh - 150px)`, width: '100%' }}>
          <div className={cn('w-full md:w-10/12 mx-auto', className)}>
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
      )}
    </>
  )
}

export { MessageList, AssistantMessage, UserMessage }
