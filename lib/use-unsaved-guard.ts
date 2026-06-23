import { useEffect } from 'react'

/** dirty 为 true 时,关闭/刷新页面弹浏览器原生确认，并拦截应用内锚点导航 */
export function useUnsavedGuard(dirty: boolean): void {
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!dirty) return

    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', handler)

    const clickHandler = (e: MouseEvent) => {
      if (e.defaultPrevented) return
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return

      const a = (e.target as HTMLElement).closest('a')
      if (!a) return

      const href = a.getAttribute('href')
      if (!href) return
      if (href.startsWith('#')) return
      if (a.target === '_blank') return

      // Check if external link
      try {
        const url = new URL(href, window.location.href)
        if (url.origin !== window.location.origin) return
      } catch {
        // Malformed URL — skip interception
        return
      }

      const confirmed = window.confirm('有未保存的修改，确定要离开吗？')
      if (!confirmed) {
        e.preventDefault()
        e.stopPropagation()
      }
    }

    document.addEventListener('click', clickHandler, true)

    return () => {
      window.removeEventListener('beforeunload', handler)
      document.removeEventListener('click', clickHandler, true)
    }
  }, [dirty])
}
