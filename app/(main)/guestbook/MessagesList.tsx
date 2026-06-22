import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import dayjs from 'dayjs'
import { GuestbookMessage } from '@/types'
import { MarkdownContent } from '@/lib/markdown/markdown-content'

interface MessagesListProps {
  list: GuestbookMessage[]
  loading?: boolean
}

export function MessagesList({ list, loading = false }: MessagesListProps) {
  if (loading) {
    return (
      <div className="divide-y divide-border border-y border-border">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-start gap-3 py-6 motion-reduce:animate-none">
            <div className="h-9 w-9 animate-pulse rounded-full bg-muted" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-32 animate-pulse rounded bg-muted" />
              <div className="h-3 w-full animate-pulse rounded bg-muted" />
              <div className="h-3 w-2/3 animate-pulse rounded bg-muted" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (list.length === 0) {
    return <p className="py-12 text-center text-muted-foreground">还没有留言，来抢沙发吧 👀</p>
  }

  return (
    <div className="divide-y divide-border border-y border-border">
      {list.map((message) => (
        <MessagesListItem info={message} key={message.id} />
      ))}
    </div>
  )
}

export function MessagesListItem({ info }: { info: GuestbookMessage }) {
  const name = info?.author?.name ?? '未知'
  const initial = Array.from(name)[0]?.toUpperCase() ?? '?'
  return (
    <div className="py-6">
      <div className="flex items-center gap-3">
        <Avatar className="h-9 w-9 ring-1 ring-border">
          <AvatarImage src={info?.author?.image} alt={name} />
          <AvatarFallback className="text-xs">{initial}</AvatarFallback>
        </Avatar>
        <div className="flex items-baseline gap-2">
          <span className="font-medium">{name}</span>
          <span className="text-xs text-muted-foreground">
            {dayjs(info.createdAt).locale('zh-cn').fromNow()}
          </span>
        </div>
      </div>

      <div className="mt-3 sm:pl-12">
        <MarkdownContent source={info.content} sanitize />
      </div>
    </div>
  )
}
