'use client'

import { useState } from 'react'
import { Header } from './Header'
import { AddMessage } from './AddMessage'
import type { MessageInfo } from './types'
import { MessagesList } from './MessagesList'

export default function GuestBook() {
  const [messages, setMessages] = useState<Array<MessageInfo>>([])

  return (
    <div className="min-h-screen max-w-4xl mx-auto px-2">
      <Header></Header>

      <AddMessage setMessages={setMessages}></AddMessage>

      <MessagesList list={messages} setMessages={setMessages}></MessagesList>
    </div>
  )
}
