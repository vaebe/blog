'use client'
import { useEffect, useState } from 'react'

export function ReadingProgress() {
  const [pct, setPct] = useState(0)
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement
      const scrolled = h.scrollTop / (h.scrollHeight - h.clientHeight || 1)
      setPct(Math.min(100, Math.max(0, scrolled * 100)))
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <div className="fixed inset-x-0 top-0 z-50 h-1 bg-transparent">
      <div className="h-full bg-primary transition-[width]" style={{ width: `${pct}%` }} />
    </div>
  )
}
