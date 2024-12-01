import { ScrollArea } from '@/components/ui/scroll-area'
import { OpenOrCloseSiderbarIcon } from './OpenOrCloseSiderbarIcon'
import { NewChatIcon } from './NewChatIcon'
import { AiSharedDataContext } from './AiSharedDataContext'
import { useContext, useEffect, useState } from 'react'
import { getConversation } from '@/app/ai/lib/api'
import { useParams, useRouter } from 'next/navigation'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Icon } from '@iconify/react'
import { AIConversation } from '@prisma/client'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface UseShowHideRes {
  hide: () => void
  show: () => void
  toggle: (nextVisible?: boolean) => void
  visible: boolean
}

export function useShowHide(defaultVisible = false) {
  const [visible, setVisible] = useState(defaultVisible)

  const show = () => setVisible(true)
  const hide = () => setVisible(false)

  const toggle = (nextVisible?: boolean) => {
    if (typeof nextVisible !== 'undefined') {
      setVisible(nextVisible)
    } else {
      setVisible((previousVisible) => !previousVisible)
    }
  }

  return { hide, show, toggle, visible }
}

interface OperateDialogProps {
  info: AIConversation
  dialog: UseShowHideRes
}

function RemoveConversation({ info, dialog }: OperateDialogProps) {
  const { setAiSharedData, aiSharedData } = useContext(AiSharedDataContext)

  const { id } = useParams()
  const router = useRouter()

  async function remove() {
    const res = await fetch('/api/ai/conversation/delete', {
      method: 'DELETE',
      body: JSON.stringify({ id: info.id })
    }).then((res) => res.json())

    if (res.code === 0) {
      dialog.hide()

      setAiSharedData((d) => {
        d.conversationList = aiSharedData.conversationList.filter((item) => item.id !== info.id)
      })

      if (info.id === id) {
        router.push(`/ai`)
        router.refresh()
      }
    }
  }

  return (
    <Dialog onOpenChange={dialog.toggle} open={dialog.visible}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>删除聊天</DialogTitle>
          <DialogDescription>这会删除 “{info.name}”。</DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button type="button" variant="secondary" onClick={dialog.hide}>
            取消
          </Button>

          <Button onClick={remove}>确认</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function EditConversationName({ info, dialog }: OperateDialogProps) {
  const { setAiSharedData, aiSharedData } = useContext(AiSharedDataContext)

  const [name, setName] = useState(info.name)

  async function save() {
    const res = await fetch('/api/ai/conversation/update', {
      method: 'PUT',
      body: JSON.stringify({ id: info.id, name })
    }).then((res) => res.json())

    if (res.code === 0) {
      dialog.hide()

      setAiSharedData((d) => {
        d.conversationList = aiSharedData.conversationList.map((item) => {
          return item.id === info.id ? { ...item, name } : item
        })
      })
    }
  }

  return (
    <Dialog onOpenChange={dialog.toggle} open={dialog.visible}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>编辑对话名称</DialogTitle>
        </DialogHeader>

        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />

        <DialogFooter>
          <Button type="button" variant="secondary" onClick={dialog.hide}>
            取消
          </Button>

          <Button onClick={save}>确认</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function Operate({ info }: { info: AIConversation }) {
  const deleteDialog = useShowHide()
  const editDialog = useShowHide()

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Icon icon="dashicons:ellipsis" className="w-[40px] cursor-pointer"></Icon>
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          <DropdownMenuItem className="cursor-pointer" onSelect={editDialog.show}>
            <div className="flex items-center">
              <Icon icon="lucide:edit" className="w-5 h-5 mx-2" />
              <span>重命名</span>
            </div>
          </DropdownMenuItem>

          <DropdownMenuItem className="cursor-pointer" onSelect={deleteDialog.show}>
            <div className="flex items-center">
              <Icon icon="fluent:delete-12-regular" className="w-5 h-5 mx-2" />
              <span>删除</span>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <RemoveConversation info={info} dialog={deleteDialog}></RemoveConversation>

      <EditConversationName info={info} dialog={editDialog}></EditConversationName>
    </>
  )
}

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
              className={`flex items-center justify-between p-2 min-h-10 cursor-pointer rounded dark:text-white mb-1 hover:bg-black/10 dark:hover:bg-white/10 ${id === item.id ? 'bg-black/10 dark:bg-white/10' : ''}`}
              onClick={() => switchConversation(item.id)}
            >
              <p
                className=" overflow-hidden whitespace-nowrap"
                style={{ width: `calc(100% - 50px)` }}
              >
                {item.name}
              </p>
              <Operate info={item}></Operate>
            </div>
          )
        })}
      </ScrollArea>
    </div>
  )
}

export { LayoutSidebar }
export default LayoutSidebar
