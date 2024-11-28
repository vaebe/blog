'use client'

import { cn } from '@/lib/utils'
import { LayoutSidebar } from './components/LayoutSidebar'
import { AiSharedDataContext, defaultAiSharedData } from './components/AiSharedDataContext'
import type { AiSharedData } from './components/AiSharedDataContext'
import { useImmer } from 'use-immer'
import { useSession } from 'next-auth/react'

export default function AiLayout({ children }: { children: React.ReactNode }) {
  const [aiSharedData, setAiSharedData] = useImmer<AiSharedData>(
    JSON.parse(JSON.stringify(defaultAiSharedData.aiSharedData))
  )

  const { status } = useSession()

  return (
    <AiSharedDataContext.Provider value={{ aiSharedData, setAiSharedData }}>
      <div className={cn('flex h-screen bg-white dark:bg-black ')}>
        {status === 'authenticated' && aiSharedData.layoutSidebar && <LayoutSidebar />}

        <div className="flex-1 flex flex-col">{children}</div>
      </div>
    </AiSharedDataContext.Provider>
  )
}
