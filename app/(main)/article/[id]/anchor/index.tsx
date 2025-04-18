'use client'

import React, { useEffect, useState, useRef } from 'react'
import { v4 as uuidv4 } from 'uuid'
import './index.css'

interface Heading {
  id: string
  text: string
  level: string
}

interface AnchorProps {
  content: string
}

export const Anchor: React.FC<AnchorProps> = ({ content }) => {
  const [headings, setHeadings] = useState<Heading[]>([])
  const [activeId, setActiveId] = useState<string>('')
  const observerRef = useRef<IntersectionObserver | null>(null)
  const mutationObserverRef = useRef<MutationObserver | null>(null)

  useEffect(() => {
    if (!content) return

    const generateHeadings = () => {
      const elements: Heading[] = Array.from(
        document.querySelectorAll(
          '.markdown-body h1, .markdown-body h2, .markdown-body h3, .markdown-body h4'
        )
      ).map((elem) => {
        const element = elem as HTMLElement
        if (!element.id) {
          element.id = uuidv4()
        }
        return {
          id: element.id,
          text: element.innerText,
          level: element.tagName.toLowerCase()
        }
      })
      setHeadings(elements)
      observeHeadings(elements)
    }

    const observeHeadings = (elements: Heading[]) => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }

      observerRef.current = new IntersectionObserver(
        (entries) => {
          const visibleEntries = entries.filter((entry) => entry.isIntersecting)
          if (visibleEntries.length > 0) {
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
          observerRef.current?.observe(element)
        }
      })
    }

    const markdownBody = document.querySelector('.markdown-body')
    if (markdownBody) {
      mutationObserverRef.current = new MutationObserver(generateHeadings)
      mutationObserverRef.current.observe(markdownBody, { childList: true, subtree: true })
    }

    generateHeadings()

    return () => {
      observerRef.current?.disconnect()
      mutationObserverRef.current?.disconnect()
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
