import { cacheLife, cacheTag } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { GuestbookMessage } from '@/types'
import { GuestbookClient } from './GuestbookClient'
import { GUESTBOOK_CACHE_TAG } from './constants'

// 服务端取留言初始数据；写操作后由 API 调用 revalidateTag 失效。
async function getInitialMessages(): Promise<GuestbookMessage[]> {
  'use cache'
  cacheTag(GUESTBOOK_CACHE_TAG)
  cacheLife('minutes')

  try {
    const list = await prisma.message.findMany({
      include: {
        author: {
          select: { name: true, email: true, image: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 200
    })
    return list as unknown as GuestbookMessage[]
  } catch {
    return []
  }
}

export async function InitialMessages() {
  const initial = await getInitialMessages()
  return <GuestbookClient initialMessages={initial} />
}
