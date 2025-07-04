import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import dayjs from 'dayjs'
import { GuestbookMessage } from '@/types'
import { BytemdViewer } from '@/components/bytemd/viewer'
import { Card } from '@/components/ui/card'
import { toast } from 'sonner'

interface MessagesListProps {
  list: Array<GuestbookMessage>
  setMessages: Dispatch<SetStateAction<GuestbookMessage[]>>
}

export function MessagesList({ list, setMessages }: MessagesListProps) {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await fetch(`/api/guestbook?page=1&pageSize=9999`).then((res) => res.json())

        if (res.code === 0) {
          setMessages(res.data.list)
        }
      } catch (error) {
        toast('获取留言列表失败！')
        console.error('Failed to fetch messages', error)
      } finally {
        setLoading(false)
      }
    }

    getMessages()
  }, [setMessages])

  if (loading) {
    return <div className="text-center">正在获取留言...</div>
  }

  return (
    <div className="space-y-4">
      {list.map((message) => (
        <MessagesListItem info={message} key={message.id} />
      ))}
    </div>
  )
}

export function MessagesListItem({ info }: { info: GuestbookMessage }) {
  return (
    <Card className="px-4">
      <div className="flex space-x-4">
        <Avatar>
          <AvatarImage src={info?.author?.image} alt="用户头像" />
          <AvatarFallback>{info?.author?.name}</AvatarFallback>
        </Avatar>
        <p>
          <span className="mr-2 text-lg font-medium">{info?.author?.name ?? '未知'}</span>
          <span className="text-gray-500 text-xs">
            {dayjs(info.createdAt).locale('zh-cn').fromNow()}
          </span>
        </p>
      </div>

      <BytemdViewer content={info.content}></BytemdViewer>
    </Card>
  )
}
