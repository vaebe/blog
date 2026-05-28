import { Dispatch, SetStateAction, useState } from 'react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { useCurrentUser } from '@/lib/use-current-user'
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
      aria-label="留言内容"
      className="block w-full shrink-0 resize-none border-0 bg-transparent p-2 md:p-4 text-sm leading-6 text-foreground placeholder:text-muted-foreground outline-none transition-[height] will-change-[height] focus:outline-none focus:ring-0"
      placeholder="请文明留言，禁止发布敏感内容"
      rows={6}
      value={message}
      onChange={(e) => onChange(e.target.value)}
    ></textarea>
  )
}

// 留言预览组件
const MessagePreview = ({ message }: { message: string }) => {
  return (
    <div className="min-h-44">
      <BytemdViewer content={message}></BytemdViewer>
    </div>
  )
}

interface MessageControlsProps {
  messageLength: number
  messageView: boolean
  sending: boolean
  onToggleView: () => void
  onSendMsg: () => void
}

function MessageControls({
  messageLength,
  messageView,
  sending,
  onToggleView,
  onSendMsg
}: MessageControlsProps) {
  return (
    <div className="mt-2 flex items-center justify-between border-t border-border/60 px-2 pt-2.5">
      <p className="text-xs text-muted-foreground">支持 Markdown 格式</p>
      <div className="flex items-center justify-end gap-4">
        <p className="text-xs text-muted-foreground">{messageLength} / 1000</p>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={onToggleView}
                aria-label={messageView ? '关闭预览' : '预览一下'}
                className="cursor-pointer text-muted-foreground transition-colors hover:text-foreground"
              >
                <Icon icon={messageView ? 'carbon:view-off' : 'carbon:view'} width="22px" />
              </button>
            </TooltipTrigger>
            <TooltipContent>{messageView ? '关闭预览' : '预览一下'}</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={onSendMsg}
                disabled={sending}
                aria-label="发送"
                aria-busy={sending}
                className={`text-muted-foreground transition-colors hover:text-foreground ${sending ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
              >
                <Icon
                  icon={sending ? 'eos-icons:three-dots-loading' : 'streamline:send-email'}
                  width="20px"
                />
              </button>
            </TooltipTrigger>
            <TooltipContent>{sending ? '发送中…' : '发送'}</TooltipContent>
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
  const [messageView, setMessageView] = useState(false)
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const { user, isAuthenticated } = useCurrentUser()

  const sendMsg = async () => {
    // 防止快速重复点击导致重复提交
    if (sending) {
      return
    }

    if (!message.trim()) {
      toast('留言内容不能为空!')
      return
    }

    setSending(true)
    try {
      const res = await fetch('/api/guestbook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content: message
        })
      }).then((res) => res.json())

      if (res.code !== 0) {
        toast(res.msg)
        return
      }

      toast('留言成功!')

      setMessageView(false)

      setMessages((oldData) => [
        {
          ...res.data,
          author: { name: user?.name, email: user?.email, image: user?.image }
        },
        ...oldData
      ])

      setMessage('')
    } catch {
      toast('留言失败，请稍后重试')
    } finally {
      setSending(false)
    }
  }

  function messageChange(value: string) {
    if (message.length > 1000) {
      return
    }

    setMessage(value)
  }

  return (
    <div className="mb-14 mt-1">
      {isAuthenticated ? (
        <div className="group relative w-full rounded-2xl border border-border bg-card p-2 shadow-soft transition-colors focus-within:border-primary/50">
          {messageView ? (
            <MessagePreview message={message} />
          ) : (
            <MessageInput message={message} onChange={messageChange} />
          )}

          <MessageControls
            messageLength={message.length}
            messageView={messageView}
            sending={sending}
            onToggleView={() => setMessageView(!messageView)}
            onSendMsg={sendMsg}
          />
        </div>
      ) : (
        <LoginDialog>
          <Button className="my-4 cursor-pointer rounded-full px-5">
            <Icon icon="memory:user" className="mr-2" width="20px" />
            登录后才可以留言！
          </Button>
        </LoginDialog>
      )}
    </div>
  )
}

export { AddMessage }
export default AddMessage
