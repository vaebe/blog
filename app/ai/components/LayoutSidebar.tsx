import { ScrollArea } from '@/components/ui/scroll-area'
import { OpenOrCloseSiderbarIcon } from './OpenOrCloseSiderbarIcon'
import { NewChatIcon } from './NewChatIcon'

function LayoutSidebar() {
  return (
    <div className="w-64 p-2 border-r bg-background">
      <div className="h-[7vh] flex justify-between">
        <OpenOrCloseSiderbarIcon state={false}></OpenOrCloseSiderbarIcon>
        <NewChatIcon></NewChatIcon>
      </div>

      <ScrollArea className="flex-1 h-[92vh]">
        <div className="p-2 h-10 rounded text-white mb-0.5 hover:bg-white/10 cursor-pointer truncate">
          测试目录测试目录 测试目录 测试目录 测试目录
        </div>
      </ScrollArea>
    </div>
  )
}

export { LayoutSidebar }
export default LayoutSidebar
