import { Dispatch, SetStateAction, useState } from 'react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/hooks/use-toast'
import { useSession } from 'next-auth/react'
import { MessageInfo } from './types'
import { Icon } from '@iconify/react'
import { Textarea } from '@/components/ui/textarea'

interface AddMessageProps {
  setMessages: Dispatch<SetStateAction<MessageInfo[]>>
}

export function AddMessage({ setMessages }: AddMessageProps) {
  const [message, setMessage] = useState('')

  const { toast } = useToast()

  const { data: session, status } = useSession()

  const sendMsg = async () => {
    if (!message.trim()) {
      toast({ title: '留言失败', description: '留言内容不能为空!', variant: 'destructive' })
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
      toast({ description: res.msg, variant: 'destructive' })
      return
    }

    toast({ title: '留言成功', description: '今天天气貌似不错!' })

    setMessages((oldData) => [res.data, ...oldData])

    setMessage('')
  }

  return (
    <div className="mt-1">
      {status === 'authenticated' ? (
        <div>
          <Textarea
            placeholder="请输入您的留言"
            id="message"
            rows={6}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <div className="flex justify-end">
            <Button onClick={sendMsg} className="mt-4 mb-14">
              发送留言
            </Button>
          </div>
        </div>
      ) : (
        <Button onClick={sendMsg} className="my-4">
          <Icon icon="memory:user" className="mr-2" width="20px" />
          登录后才可以留言！
        </Button>
      )}
    </div>
  )
}
