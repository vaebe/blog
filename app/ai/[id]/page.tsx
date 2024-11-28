'use client'

import { useEffect, use } from 'react'
import { useChat } from 'ai/react'
import { MessageList } from '@/app/ai/components/MessageList'
import { AiSharedDataContext } from '@/app/ai/components/AiSharedDataContext'
import { useContext } from 'react'
import { LayoutHeader } from '@/app/ai/components/LayoutHeader'
import { StartAConversationPrompt } from '@/app/ai/components/StartAConversationPrompt'
import { Sender } from '@/app/ai/components/Sender'
import { toast } from '@/components/hooks/use-toast'
import { AIMessage } from '@prisma/client'
import { useRouter } from 'next/navigation'

export default function AIChatPage(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params)

  const conversationId = params.id

  const { aiSharedData, setAiSharedData } = useContext(AiSharedDataContext)

  const { messages, input, handleSubmit, setInput, isLoading, stop, append, setMessages } = useChat(
    {
      api: '/api/ai/chat',
      keepLastMessageOnError: true
    }
  )

  const router = useRouter()

  async function setMsg() {
    try {
      const url = `/api/ai/messages/details?id=${conversationId}`
      const res = await fetch(url).then((res) => res.json())

      if (res.code !== 0) {
        toast({ title: '失败', description: '获取对象详情失败!', variant: 'destructive' })
        return
      }

      const data = res?.data ?? []

      if (!data.length) {
        router.replace('/ai')
        return
      }

      const list = data.map((item: AIMessage) => ({
        content: item.content,
        role: item.role,
        id: item.id
      }))

      setMessages(list)
    } catch {
      toast({ title: '失败', description: '获取对象详情失败!', variant: 'destructive' })
    }
  }

  // 生成对话标题
  async function generateConversationTitle() {
    try {
      const url = `/api/ai/conversation/generateTitle?conversationId=${conversationId}`
      const res = await fetch(url).then((res) => res.json())

      if (res.code !== 0) {
        return
      }

      const conversationName = res.data?.name

      setAiSharedData((d) => {
        d.conversationList = d.conversationList.map((item) => {
          if (item.id === conversationId && conversationName) {
            item.name = conversationName
          }
          return item
        })
      })
    } catch {
      console.error('生成对话标题失败!')
    }
  }

  useEffect(() => {
    if (aiSharedData.aiFirstMsg) {
      append(
        { content: aiSharedData.aiFirstMsg, role: 'user' },
        {
          data: { conversationId }
        }
      ).then(() => {
        generateConversationTitle()
      })

      setAiSharedData((d) => {
        d.aiFirstMsg = ''
      })
    } else {
      setMsg()
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onSubmit = () => {
    handleSubmit(undefined, { data: { conversationId } })
  }

  return (
    <div className="flex flex-col h-screen">
      <LayoutHeader></LayoutHeader>

      <StartAConversationPrompt chatStarted={!!messages.length}></StartAConversationPrompt>

      <MessageList messages={messages} isLoading={isLoading}></MessageList>

      <div className="flex justify-center md:w-10/12 mx-auto pb-6">
        <Sender
          onSubmit={onSubmit}
          input={input}
          isLoading={isLoading}
          stop={stop}
          setInput={setInput}
        ></Sender>
      </div>
    </div>
  )
}
