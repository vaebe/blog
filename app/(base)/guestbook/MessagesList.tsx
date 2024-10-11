import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import dayjs from 'dayjs'
import type { MessageInfo } from './types'
import { Button } from '@/components/ui/button'
import { Icon } from '@iconify/react'

interface MessagesListProps {
  list: MessageInfo[]
  setMessages: Dispatch<SetStateAction<MessageInfo[]>>
}

export function MessagesList({ list, setMessages }: MessagesListProps) {
  const [page, setPage] = useState(1)
  const [totalPage, setTotalPage] = useState(1)
  const [loading, setLoading] = useState(false)

  const loadMessages = async () => {
    if (totalPage < page || loading) {
      return
    }

    setLoading(true)

    setPage((prevPage) => prevPage + 1)

    const res = await fetch(`/api/guestbook?page=${page}&pageSize=${1}`).then((res) => res.json())

    if (res.code !== 0) {
      setLoading(false)
      return
    }

    setMessages([...list, ...res.data.list])

    setTotalPage(res.data.totalPages)

    setLoading(false)
  }

  useEffect(() => {
    setPage(1)
    setMessages([])
    loadMessages()
  }, [])

  return (
    <div className="space-y-2">
      {list.map((message, index) => (
        <MessagesListItem
          info={message}
          key={message.id}
          isLast={index === list.length - 1}
        ></MessagesListItem>
      ))}

      {loading && <div className="text-center">加载中...</div>}

      <div className="flex justify-center my-4">
        {totalPage > 1 && totalPage >= page && (
          <Button onClick={loadMessages} size="sm">
            <Icon icon="ic:twotone-read-more" className="mr-2" width="24px"></Icon>
            加载更多
          </Button>
        )}
      </div>
    </div>
  )
}

export function MessagesListItem({ info, isLast }: { info: MessageInfo; isLast: boolean }) {
  return (
    <>
      <div className="flex items-start">
        <Avatar className="mt-2">
          <AvatarImage src={info?.author?.image} alt="@shadcn" />
          <AvatarFallback>{info?.author?.name}</AvatarFallback>
        </Avatar>

        <div className="ml-4">
          <p>
            <span className="mr-2 text-lg font-medium">{info?.author?.name}</span>
            <span className="text-gray-500 text-xs">
              {dayjs(info.createdAt).locale('zh-cn').fromNow()}
            </span>
          </p>

          <div>{info.content}</div>
        </div>
      </div>

      {!isLast && <p className="h-[20px] w-[3px] bg-gray-200 ml-4 dark:bg-gray-800"></p>}
    </>
  )
}
