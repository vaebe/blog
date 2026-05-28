'use client'

import { useState } from 'react'
import { AddMessage } from './AddMessage'
import { MessagesList } from './MessagesList'
import { GuestbookMessage } from '@/types'

interface GuestbookClientProps {
  initialMessages: GuestbookMessage[]
  loading?: boolean
}

export function GuestbookClient({ initialMessages, loading = false }: GuestbookClientProps) {
  const [messages, setMessages] = useState<GuestbookMessage[]>(initialMessages)

  return (
    <>
      <AddMessage setMessages={setMessages} />
      <MessagesList list={messages} loading={loading} />
    </>
  )
}
