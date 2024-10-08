'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useSession } from 'next-auth/react'
import { useToast } from '@/components/hooks/use-toast'

// 模拟 API 调用获取留言
const fetchMessages = async (page: number, limit: number) => {
  // 在实际应用中,这里应该是一个真实的 API 调用
  await new Promise((resolve) => setTimeout(resolve, 1000)) // 模拟网络延迟
  return Array.from({ length: limit }, (_, i) => ({
    id: page * limit + i + 1,
    user: `User ${page * limit + i + 1}`,
    content: `This is message ${page * limit + i + 1}`,
    createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString()
  }))
}

interface Message {
  id: number
  user: string
  content: string
  createdAt: string
}

export default function GuestBook() {
  const [messages, setMessages] = useState<Array<Message>>([])

  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(false)
  const [username, setUsername] = useState('')
  const loaderRef = useRef(null)

  // 优化: 将加载状态和消息加载逻辑合并
  const loadMessages = async () => {
    if (loading) return
    setLoading(true)
    const newMessages = await fetchMessages(page, 10)
    setMessages((prevMessages) => [...prevMessages, ...newMessages])
    setPage((prevPage) => prevPage + 1)
    setLoading(false)
  }

  loadMessages()

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMessages()
        }
      },
      { threshold: 1.0 }
    )

    if (loaderRef.current) {
      observer.observe(loaderRef.current)
    }

    return () => observer.disconnect()
  }, [loaderRef, loading])

  const { toast } = useToast()

  const { data: session } = useSession()

  const handleSubmit = async (msg: string) => {
    if (!msg.trim()) {
      toast({ title: '留言失败', description: '留言内容不能为空!', variant: 'destructive' })
      return
    }

    const res = await fetch('/api/guestbook', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        content: msg,
        userEmail: session?.user?.email
      })
    }).then((res) => res.json())

    console.log(res, '-=-=-=-=-')

    if (res.code !== 0) {
      toast({ description: res.msg, variant: 'destructive' })
      return
    }

    toast({ description: '今天的你格外迷人!' })

    setMessages((prevMessages) => [res.data, ...prevMessages])
  }

  return (
    <Card className="min-h-screen  max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 my-8">
      <Header></Header>

      <AddMessage onSubmit={handleSubmit}></AddMessage>

      <div className="space-y-4">
        {messages.map((message) => (
          <div key={message.id} className="bg-gray-100 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <p className="font-semibold">{message.user}</p>
              <p className="text-sm text-gray-500">
                {new Date(message.createdAt).toLocaleString()}
              </p>
            </div>
            <p>{message.content}</p>
          </div>
        ))}
        {loading && <div className="text-center">加载中...</div>}
        <div ref={loaderRef} />
      </div>
    </Card>
  )
}

function Header() {
  return (
    <div className="my-6">
      <h2 className="text-4xl font-bold">欢迎来到我的留言板</h2>

      <p className="w-4/12 mt-6 text-gray-500">
        在这里你可以留下一些内容、对我说的话、建议、你的想法等等一切不违反中国法律的内容!
        <br />
        然后就是你不能骂我,不然我会删🤔!
      </p>
    </div>
  )
}

function AddMessage({ onSubmit }: { onSubmit: (msg: string) => void }) {
  const [message, setMessage] = useState('')

  function sendMsg() {
    onSubmit(message)
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
