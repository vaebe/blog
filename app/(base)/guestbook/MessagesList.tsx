import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import dayjs from 'dayjs'
import type { MessageInfo } from './types'
import { BytemdViewer } from '@/components/bytemd/viewer'

interface MessagesListProps {
  list: MessageInfo[]
  setMessages: Dispatch<SetStateAction<MessageInfo[]>>
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
        console.error('Failed to fetch messages', error)
      } finally {
        setLoading(false)
      }
    }

    getMessages()
  }, [setMessages])

  if (loading) {
    return <div className="text-center">加载中...</div>
  }

  return (
    <div className="space-y-2">
      {list.map((message, index) => (
        <MessagesListItem info={message} key={message.id} isLast={index === list.length - 1} />
      ))}
    </div>
  )
}

export function MessagesListItem({ info, isLast }: { info: MessageInfo; isLast: boolean }) {
  return (
    <>
      <div className="flex items-start">
        <Avatar className="mt-2">
          <AvatarImage src={info?.author?.image} alt="用户头像" />
          <AvatarFallback>{info?.author?.name}</AvatarFallback>
        </Avatar>

        <div className="ml-4 w-full">
          <p>
            <span className="mr-2 text-lg font-medium">{info?.author?.name ?? '未知'}</span>
            <span className="text-gray-500 text-xs">
              {dayjs(info.createdAt).locale('zh-cn').fromNow()}
            </span>
          </p>

          <BytemdViewer content={info.content} />
        </div>
      </div>

      {!isLast && <p className="h-[20px] w-[3px] bg-gray-200 ml-4 dark:bg-gray-800"></p>}
    </>
  )
}
