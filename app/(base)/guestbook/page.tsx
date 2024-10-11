'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Header } from './Header'
import { AddMessage } from './AddMessage'
import type { MessageInfo } from './types'
import { MessagesList } from './MessagesList'

export default function GuestBook() {
  const [messages, setMessages] = useState<Array<MessageInfo>>([])

  return (
    <Card className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 my-8">
      <Header></Header>

      <AddMessage setMessages={setMessages}></AddMessage>

      <MessagesList list={messages} setMessages={setMessages}></MessagesList>
    </Card>
  )
}
