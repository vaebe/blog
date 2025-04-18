import { Dispatch, SetStateAction, useState } from 'react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { useSession } from 'next-auth/react'
import { Icon } from '@iconify/react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { GuestbookMessage } from '@/types'
import { LoginDialog } from '@/components/login-dialog'
import { BytemdViewer } from '@/components/bytemd/viewer'

interface MessageInputProps {
  message: string
  onChange: (value: string) => void
}

// 留言输入组件
const MessageInput = ({ message, onChange }: MessageInputProps) => {
  return (
    <textarea
      className="block w-full shrink-0 resize-none border-0 bg-transparent p-2 md:p-4 text-sm leading-6 text-zinc-800 placeholder-zinc-400 outline-none transition-[height] will-change-[height] focus:outline-none focus:ring-0 dark:text-zinc-200 dark:placeholder-zinc-500"
      placeholder="请输入您的留言"
      rows={6}
      value={message}
      onChange={(e) => onChange(e.target.value)}
    ></textarea>
  )
}

// 留言预览组件
const MessagePreview = ({ message }: { message: string }) => {
  return (
    <div className="min-h-24">
      <BytemdViewer content={message}></BytemdViewer>
    </div>
  )
}

interface MessageControlsProps {
  messageLength: number
  messageView: boolean
  onToggleView: () => void
  onSendMsg: () => void
}

function MessageControls({
  messageLength,
  messageView,
  onToggleView,
  onSendMsg
}: MessageControlsProps) {
  return (
    <div className="flex justify-between items-center mt-2 px-2">
      <p className="text-xs text-zinc-500">支持 Markdown 格式</p>
      <div className="flex items-center justify-end">
        <p className="text-xs text-zinc-500">{messageLength} / 1000</p>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Icon
                icon={messageView ? 'carbon:view-off' : 'carbon:view'}
                onClick={onToggleView}
                className="cursor-pointer mx-4"
                width="24px"
              />
            </TooltipTrigger>
            <TooltipContent>{messageView ? '关闭预览' : '预览一下'}</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Icon
                icon="streamline:send-email"
                className="cursor-pointer"
                width="20px"
                onClick={onSendMsg}
              />
            </TooltipTrigger>
            <TooltipContent>发送</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  )
}

interface AddMessageProps {
  setMessages: Dispatch<SetStateAction<GuestbookMessage[]>>
}

function AddMessage({ setMessages }: AddMessageProps) {
  const [showLoginDialog, setShowLoginDialog] = useState<boolean>(false)

  const [messageView, setMessageView] = useState(false)
  const [message, setMessage] = useState('')
  const { data: session, status } = useSession()

  const sendMsg = async () => {
    if (!message.trim()) {
      toast('留言内容不能为空!')
      return
    }

    const res = await fetch('/api/guestbook', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        content: message,
        userEmail: session?.user?.email
      })
    }).then((res) => res.json())

    if (res.code !== 0) {
      toast(res.msg)
      return
    }

    toast('留言成功!')

    setMessageView(false)

    setMessages((oldData) => [{ ...res.data, author: session?.user }, ...oldData])

    setMessage('')
  }

  function messageChange(value: string) {
    if (message.length > 1000) {
      return
    }

    setMessage(value)
  }

  return (
    <div className="mt-1 mb-14">
      {status === 'authenticated' ? (
        <div className="group relative w-full rounded-xl p-2 bg-white dark:bg-black bg-opacity-5 shadow-xl shadow-zinc-500/10 ring-2 ring-zinc-200/30 transition-opacity">
          {messageView ? (
            <MessagePreview message={message} />
          ) : (
            <MessageInput message={message} onChange={messageChange} />
          )}

          <MessageControls
            messageLength={message.length}
            messageView={messageView}
            onToggleView={() => setMessageView(!messageView)}
            onSendMsg={sendMsg}
          />
        </div>
      ) : (
        <Button className="my-4 cursor-pointer" onClick={() => setShowLoginDialog(true)}>
          <Icon icon="memory:user" className="mr-2" width="20px" />
          登录后才可以留言！
        </Button>
      )}

      <LoginDialog isOpen={showLoginDialog} onClose={() => setShowLoginDialog(false)}></LoginDialog>
    </div>
  )
}

export { AddMessage }
export default AddMessage
