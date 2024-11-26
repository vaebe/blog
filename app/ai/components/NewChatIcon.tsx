import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Icon } from '@iconify/react'
import Link from 'next/link'

function NewChatIcon() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link href="/ai">
            <Button variant="outline" size="icon">
              <Icon icon="hugeicons:pencil-edit-02" className="h-6 w-6"></Icon>
            </Button>
          </Link>
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
