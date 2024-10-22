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
    <div className="min-h-screen max-w-5xl mx-auto my-4">
      <Header></Header>

      <AddMessage setMessages={setMessages}></AddMessage>

      <MessagesList list={messages} setMessages={setMessages}></MessagesList>
    </div>
  )
}
