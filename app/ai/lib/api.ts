import { toast } from '@/components/hooks/use-toast'

// 获取 AI 对话列表
export async function getConversation() {
  try {
    const res = await fetch('/api/ai/conversation').then((res) => res.json())

    if (res.code !== 0) {
      toast({ title: '失败', description: '获取对话失败!', variant: 'destructive' })
      return []
    }
    return res.data.list ?? []
  } catch {
    toast({ title: '失败', description: '获取对话失败!', variant: 'destructive' })
    return []
  }
}
