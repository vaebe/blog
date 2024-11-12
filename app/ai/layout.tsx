'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Icon } from '@iconify/react'

function Sidebar({ sidebarClose }: { sidebarClose: () => void }) {
  return (
    <div className="w-64 p-2 border-r bg-background">
      <div className="h-[7vh] flex justify-between">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" onClick={sidebarClose}>
                <Icon icon="solar:siderbar-linear" className="h-6 w-6"></Icon>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>关闭侧边栏</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon">
                <Icon icon="hugeicons:pencil-edit-02" className="h-6 w-6"></Icon>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>新聊天</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <ScrollArea className="flex-1 h-[92vh]">
        <div className="p-2 h-10 rounded text-white mb-0.5 hover:bg-white/10 cursor-pointer truncate">
          测试目录测试目录 测试目录 测试目录 测试目录
        </div>
      </ScrollArea>
    </div>
  )
}

export default function AiLayout({ children }: { children: React.ReactNode }) {
  const [showSidebar, setShowSidebar] = useState<boolean>(true)

  return (
    <div className={cn('flex h-screen')}>
      {showSidebar && (
        <Sidebar
          sidebarClose={() => {
            setShowSidebar(false)
          }}
        />
      )}

      <div className="flex-1 flex flex-col">{children}</div>
    </div>
  )
}
