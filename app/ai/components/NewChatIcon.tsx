import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Icon } from '@iconify/react'
import { useRouter } from 'next/navigation'

function NewChatIcon() {
  const router = useRouter()

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              router.push('/ai')
              router.refresh()
            }}
          >
            <Icon icon="hugeicons:pencil-edit-02" className="h-6 w-6"></Icon>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>新聊天</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export { NewChatIcon }
export default NewChatIcon
