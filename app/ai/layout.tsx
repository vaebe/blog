'use client'

import { cn } from '@/lib/utils'
import { LayoutSidebar } from './components/LayoutSidebar'
import { AiSharedDataContext, defaultAiSharedData } from './components/AiSharedDataContext'
import type { AiSharedData } from './components/AiSharedDataContext'
import { useImmer } from 'use-immer'
import { toast } from '@/components/hooks/use-toast'
import { useState } from 'react'
import { AIConversation } from '@prisma/client'
import { useSession } from 'next-auth/react'

export default function AiLayout({ children }: { children: React.ReactNode }) {
  const [aiSharedData, setAiSharedData] = useImmer<AiSharedData>(
    JSON.parse(JSON.stringify(defaultAiSharedData.aiSharedData))
  )

  const { status } = useSession()

  // 对话数据
  const [conversationList, setConversationList] = useState<Array<AIConversation>>([])

  async function getConversation() {
    // 用户未登录直接返回
    if (status !== 'authenticated') {
      return
    }

    try {
      const res = await fetch('/api/ai/conversation').then((res) => res.json())

      if (res.code !== 0) {
        toast({ title: '失败', description: '创建对话失败!', variant: 'destructive' })
        return
      }

      setConversationList(res.data.list)
    } catch {
      toast({ title: '失败', description: '获取对话失败!', variant: 'destructive' })
    }
  }

  return (
    <AiSharedDataContext.Provider
      value={{ aiSharedData, setAiSharedData, conversationList, getConversation }}
    >
      <div className={cn('flex h-screen bg-white dark:bg-black')}>
        {/* 用户已登录 */}
        {status === 'authenticated' && aiSharedData.layoutSidebar && <LayoutSidebar />}

        <div className="flex-1 flex flex-col">{children}</div>
      </div>
    </AiSharedDataContext.Provider>
  )
}
