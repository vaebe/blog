import { Suspense } from 'react'
import { Header } from './Header'
import { GuestbookClient } from './GuestbookClient'
import { InitialMessages } from './InitialMessages'

// 外壳走 RSC，初始留言数据放在独立 Suspense 内流式注入，
// 消除原先客户端 useEffect 拉取造成的瀑布请求。
export default function GuestBook() {
  return (
    <div className="max-w-4xl mx-auto px-4">
      <Header />
      <Suspense fallback={<GuestbookClient initialMessages={[]} loading />}>
        <InitialMessages />
      </Suspense>
    </div>
  )
}
