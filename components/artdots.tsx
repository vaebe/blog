'use client' // 声明为客户端组件

import { useRef, useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { useTheme } from 'next-themes'

// 动态导入 react-p5，以避免在服务器端渲染时报错
const Sketch = dynamic(() => import('react-p5'), { ssr: false })

const SCALE = 200
const LENGTH = 10
const SPACING = 15

let w = typeof window !== 'undefined' ? window.innerWidth : 0
let h = typeof window !== 'undefined' ? window.innerHeight : 0
let offsetY = typeof window !== 'undefined' ? window.scrollY : 0

function getForceOnPoint(x: number, y: number, z: number, noise: any) {
  return (noise(x / SCALE, y / SCALE, z) - 0.5) * 2 * Math.PI
}

const Artdots = ({ className }: { className?: string }) => {
  const { theme } = useTheme()
  const [points, setPoints] = useState<{ x: number; y: number; opacity: number }[]>([])
  const existingPoints = useRef(new Set<string>())
  const p5Instance = useRef<any>(null)

  const addPoints = () => {
    const newPoints: { x: number; y: number; opacity: number }[] = []
    for (let x = -SPACING / 2; x < w + SPACING; x += SPACING) {
      for (let y = -SPACING / 2; y < h + offsetY + SPACING; y += SPACING) {
        const id = `${x}-${y}`
        if (existingPoints.current.has(id)) continue
        existingPoints.current.add(id)
        newPoints.push({ x, y, opacity: Math.random() * 0.5 + 0.5 })
      }
    }
    setPoints((prev) => [...prev, ...newPoints])
  }

  const setup = (p5: any, canvasParentRef: any) => {
    p5Instance.current = p5
    p5.createCanvas(w, h).parent(canvasParentRef)
    p5.noFill()
    p5.noiseSeed(Date.now())
    addPoints()
  }

  const draw = (p5: any) => {
    // 根据主题设置背景和线条颜色
    const backgroundColor = theme === 'dark' ? '#000000' : '#ffffff'
    const strokeColor = theme === 'dark' ? [50, 56, 56] : [204, 204, 204]

    p5.background(backgroundColor)
    const t = Date.now() / 10000

    points.forEach((p) => {
      const { x, y, opacity } = p
      const rad = getForceOnPoint(x, y, t, p5.noise)
      const length = (p5.noise(x / SCALE, y / SCALE, t * 2) + 0.5) * LENGTH
      const nx = x + p5.cos(rad) * length
      const ny = y + p5.sin(rad) * length
      p5.stroke(...strokeColor, (Math.abs(p5.cos(rad)) * 0.8 + 0.2) * opacity * 255)
      p5.circle(nx, ny - offsetY, 1)
    })
  }

  useEffect(() => {
    const handleResize = () => {
      w = window.innerWidth
      h = window.innerHeight
      if (p5Instance.current) {
        p5Instance.current.resizeCanvas(w, h)
        addPoints()
      }
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return <Sketch className={className} setup={setup} draw={draw} />
}

export default Artdots
export { Artdots }
