import { Dispatch, SetStateAction, useState } from 'react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/hooks/use-toast'
import { useSession } from 'next-auth/react'
import { MessageInfo } from './types'

interface AddMessageProps {
  setMessages: Dispatch<SetStateAction<MessageInfo[]>>
}

export function AddMessage({ setMessages }: AddMessageProps) {
  const [message, setMessage] = useState('')

  const { toast } = useToast()

  const { data: session } = useSession()

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

    toast({ title: '留言成功', description: '今天的你格外迷人!' })

    setMessages((oldData) => [res.data, ...oldData])

    setMessage('')
  }

  return (
    <div className="mt-1">
      <textarea
        id="message"
        rows={3}
        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
        placeholder="请输入您的留言"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <div className="flex justify-end">
        <Button onClick={sendMsg} className="my-4">
          发送留言
        </Button>
      </div>
    </div>
  )
}
