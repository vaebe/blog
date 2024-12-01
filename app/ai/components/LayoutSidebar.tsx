import { ScrollArea } from '@/components/ui/scroll-area'
import { OpenOrCloseSiderbarIcon } from './OpenOrCloseSiderbarIcon'
import { NewChatIcon } from './NewChatIcon'
import { AiSharedDataContext } from './AiSharedDataContext'
import { useContext, useEffect } from 'react'
import { getConversation } from '@/app/ai/lib/api'
import { useParams, useRouter } from 'next/navigation'

function LayoutSidebar() {
  const { setAiSharedData, aiSharedData } = useContext(AiSharedDataContext)

  useEffect(() => {
    getConversation().then((res) => {
      setAiSharedData((d) => {
        d.conversationList = res
      })
    })
  }, [setAiSharedData])

  const { id } = useParams()

  const router = useRouter()
  function switchConversation(id: string) {
    router.push(`/ai/${id}`)
  }

  return (
    <div className="w-64 p-2 border-r bg-background">
      <div className="h-[7vh] flex justify-between">
        <OpenOrCloseSiderbarIcon state={false}></OpenOrCloseSiderbarIcon>
        <NewChatIcon></NewChatIcon>
      </div>

      <ScrollArea className="flex-1 h-[92vh]">
        {aiSharedData.conversationList.map((item) => {
          return (
            <div
              key={item.id}
              className={`p-2 h-10 rounded dark:text-white mb-0.5 hover:bg-black/10 dark:hover:bg-white/10 cursor-pointer truncate ${id === item.id ? 'bg-black/10 dark:bg-white/10' : ''}`}
              onClick={() => switchConversation(item.id)}
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
