import { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import './index.css'

interface Heading {
  id: string
  text: string
  level: string
}

export function Anchor({ content }: { content: string }) {
  const [headings, setHeadings] = useState<Heading[]>([])
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    if (!content) return

    // 使用 MutationObserver 监听 markdown-body 的变化
    const observer = new MutationObserver(() => {
      // 获取 h1 到 h4 标签，并为它们生成唯一的 id
      const elements: Heading[] = Array.from(
        document.querySelectorAll(
          '.markdown-body h1, .markdown-body h2, .markdown-body h3, .markdown-body h4'
        )
      ).map((elem) => {
        const element = elem as HTMLElement
        // 如果元素没有 id，则为其生成一个 id
        if (!element.id) {
          element.id = uuidv4()
        }
        return {
          id: element.id, // 直接使用或分配给标题元素
          text: element.innerText,
          level: element.tagName.toLowerCase()
        }
      })
      setHeadings(elements)

      // 使用 Intersection Observer 监听标题的可见性
      const io = new IntersectionObserver(
        (entries) => {
          const visibleEntries = entries.filter((entry) => entry.isIntersecting)
          if (visibleEntries.length > 0) {
            // 找到最靠近视口顶部的元素
            const nearestEntry = visibleEntries.reduce((nearest, entry) => {
              return entry.boundingClientRect.top < nearest.boundingClientRect.top ? entry : nearest
            })
            setActiveId(nearestEntry.target.id)
          }
        },
        { rootMargin: '0px 0px -60% 0px' }
      )

      elements.forEach((heading) => {
        const element = document.getElementById(heading.id)
        if (element) {
          io.observe(element)
        }
      })

      // 组件销毁时取消监听
      return () => {
        io.disconnect()
      }
    })

    const markdownBody = document.querySelector('.markdown-body')
    if (markdownBody) {
      observer.observe(markdownBody, { childList: true, subtree: true })
    }

    return () => {
      observer.disconnect() // 组件销毁时取消 MutationObserver
    }
  }, [content])

  const handleScroll = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="anchor">
      <ul>
        {headings.map((heading) => (
          <li
            key={heading.id}
            className={`level-${heading.level} ${activeId === heading.id ? 'active' : ''}`}
          >
            <a onClick={() => handleScroll(heading.id)}>{heading.text}</a>
          </li>
        ))}
      </ul>
    </div>
  )
}
