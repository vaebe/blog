'use client'

import { useState } from 'react'
import { Header } from './Header'
import { AddMessage } from './AddMessage'
import { MessagesList } from './MessagesList'
import { GuestbookMessage } from '@/types'

export default function GuestBook() {
  const [messages, setMessages] = useState<Array<GuestbookMessage>>([])

  return (
    <div className="max-w-4xl mx-auto px-2">
      <Header></Header>

      <AddMessage setMessages={setMessages}></AddMessage>

      <MessagesList list={messages} setMessages={setMessages}></MessagesList>
    </div>
  )
}
