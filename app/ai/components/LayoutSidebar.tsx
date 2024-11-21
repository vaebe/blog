import { ScrollArea } from '@/components/ui/scroll-area'
import { OpenOrCloseSiderbarIcon } from './OpenOrCloseSiderbarIcon'
import { NewChatIcon } from './NewChatIcon'
import { AiSharedDataContext } from './AiSharedDataContext'
import { useContext, useEffect } from 'react'

function LayoutSidebar() {
  const { conversationList, getConversation } = useContext(AiSharedDataContext)

  useEffect(() => {
    getConversation()
  }, [])

  return (
    <div className="w-64 p-2 border-r bg-background">
      <div className="h-[7vh] flex justify-between">
        <OpenOrCloseSiderbarIcon state={false}></OpenOrCloseSiderbarIcon>
        <NewChatIcon></NewChatIcon>
      </div>

      <ScrollArea className="flex-1 h-[92vh]">
        {conversationList.map((item) => {
          return (
            <div
              key={item.id}
              className="p-2 h-10 rounded text-white mb-0.5 hover:bg-white/10 cursor-pointer truncate"
            >
              {item.name}
            </div>
          )
        })}
      </ScrollArea>
    </div>
  )
}

export { LayoutSidebar }
export default LayoutSidebar
