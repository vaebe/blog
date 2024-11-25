'use client'

import { useState, useEffect, use } from 'react'
import { useChat } from 'ai/react'
import { MessageList } from '@/app/ai/components/MessageList'
import { AiSharedDataContext } from '@/app/ai/components/AiSharedDataContext'
import { useContext } from 'react'
import { LayoutHeader } from '@/app/ai/components/LayoutHeader'
import { StartAConversationPrompt } from '../../components/StartAConversationPrompt'
import { Sender } from '../../components/Sender'

export default function AIChatPage(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params)

  const { aiSharedData, setAiSharedData } = useContext(AiSharedDataContext)

  const { messages, input, handleInputChange, handleSubmit, isLoading, stop, append } = useChat({
    api: '/api/ai/chat',
    keepLastMessageOnError: true
  })

  const [chatStarted, setChatStarted] = useState(false)

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (input.trim()) {
      handleSubmit(e, { data: { conversationId: params.id } })
      if (!chatStarted) setChatStarted(true)
    }
  }

  useEffect(() => {
    if (aiSharedData.aiFirstMsg) {
      append(
        { content: aiSharedData.aiFirstMsg, role: 'user' },
        {
          data: { conversationId: params.id }
        }
      )
      setAiSharedData((d) => {
        d.aiFirstMsg = ''
      })
      if (!chatStarted) setChatStarted(true)
    }
  }, [aiSharedData.aiFirstMsg, append, chatStarted, setAiSharedData, params.id])

  return (
    <div className="h-screen w-full">
      <LayoutHeader></LayoutHeader>

      <StartAConversationPrompt chatStarted={chatStarted}></StartAConversationPrompt>

      <MessageList messages={messages} isLoading={isLoading}></MessageList>

      <div className="flex justify-center p-2 md:w-10/12 mx-auto">
        <Sender
          onSubmit={onSubmit}
          input={input}
          handleInputChange={handleInputChange}
          isLoading={isLoading}
          stop={stop}
        ></Sender>
      </div>
    </div>
  )
}
