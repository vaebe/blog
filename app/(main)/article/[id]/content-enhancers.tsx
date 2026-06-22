'use client'
import { useEffect } from 'react'
import mediumZoom from 'medium-zoom'
import { toast } from 'sonner'

export function ContentEnhancers() {
  useEffect(() => {
    const root = document.querySelector('.wmde-markdown')
    if (!root) return

    // 图片放大
    const zoom = mediumZoom(root.querySelectorAll('img'), { background: 'rgba(0,0,0,.8)' })

    // 代码块复制按钮
    const pres = Array.from(root.querySelectorAll('pre'))
    const cleanups: Array<() => void> = []
    for (const pre of pres) {
      const el = pre as HTMLElement
      el.style.position = 'relative'
      const btn = document.createElement('button')
      btn.textContent = '复制'
      btn.className =
        'absolute right-2 top-2 rounded bg-black/40 px-2 py-0.5 text-xs text-white hover:bg-black/60'
      const onClick = () => {
        const code = pre.querySelector('code')
        void navigator.clipboard.writeText((code ?? pre).innerText).then(() => toast('已复制'))
      }
      btn.addEventListener('click', onClick)
      el.appendChild(btn)
      cleanups.push(() => {
        btn.removeEventListener('click', onClick)
        btn.remove()
      })
    }

    return () => {
      zoom.detach()
      cleanups.forEach((fn) => fn())
    }
  }, [])
  return null
}
