import { useEffect, useRef } from 'react'
import { toast } from 'sonner'
import { PublishArticleInfo } from '@/types'

export function draftKey(id: string | undefined): string {
  return `article-draft:${id ? id : 'new'}`
}

export function useArticleDraft(
  id: string | undefined,
  info: PublishArticleInfo,
  apply: (d: PublishArticleInfo) => void
): void {
  const key = draftKey(id)
  const restoredKey = useRef<string | null>(null)

  // 进入时尝试恢复
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (restoredKey.current === key) return
    restoredKey.current = key
    try {
      const raw = localStorage.getItem(key)
      if (!raw) return
      const draft = JSON.parse(raw) as PublishArticleInfo
      if (draft.content || draft.title) {
        toast('检测到未发布草稿', {
          action: { label: '恢复', onClick: () => apply(draft) }
        })
      }
    } catch {
      /* ignore */
    }
  }, [key, apply])

  // 防抖保存
  useEffect(() => {
    if (typeof window === 'undefined') return
    const t = setTimeout(() => {
      try {
        localStorage.setItem(key, JSON.stringify(info))
      } catch {
        /* ignore */
      }
    }, 2000)
    return () => clearTimeout(t)
  }, [key, info])
}
