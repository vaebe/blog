'use client'

import { useEffect, useState } from 'react'
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  useMotionValue,
  useSpring
} from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Icon } from '@iconify/react'
import userIcon from '@/public/user-icon.png'
import { Magnetic } from '@/components/ui/magnetic'

// 轮播职业头衔
const ROLES = ['前端工程师', 'Full-Stack Developer', 'Vue · React · Next.js', '开源爱好者']

interface HeroStat {
  label: string
  value?: number
}

interface HeroStatGroup {
  platform: string
  icon: string
  items: HeroStat[]
}

interface HeroProps {
  login?: string
  avatarUrl?: string
  description: string
  statGroups?: HeroStatGroup[]
}

export function Hero({ login, avatarUrl, description, statGroups }: HeroProps) {
  const reduce = useReducedMotion()
  const name = login ?? 'vaebe'
  const chars = Array.from(name)

  // 头衔轮播
  const [roleIdx, setRoleIdx] = useState(0)
  useEffect(() => {
    if (reduce) return
    const id = setInterval(() => setRoleIdx((i) => (i + 1) % ROLES.length), 2400)
    return () => clearInterval(id)
  }, [reduce])

  // 头像 3D 倾斜
  const tiltX = useMotionValue(0)
  const tiltY = useMotionValue(0)
  const rx = useSpring(tiltX, { stiffness: 150, damping: 12 })
  const ry = useSpring(tiltY, { stiffness: 150, damping: 12 })

  return (
    <section className="relative pt-2 md:pt-4">
      {/* 顶部行：超大名字 + 偏右的头像（不对称网格） */}
      <div className="relative grid grid-cols-12 items-end gap-4 md:gap-6">
        <h1
          className="order-2 col-span-12 font-display text-6xl leading-[0.92] tracking-tight md:order-1 md:col-span-9 md:text-7xl lg:text-[7.5rem]"
          aria-label={name}
        >
          {chars.map((c, i) => (
            <motion.span
              key={i}
              aria-hidden
              className="inline-block"
              initial={reduce ? false : { opacity: 0, y: '0.4em', filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ delay: 0.1 + i * 0.06, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              {c}
            </motion.span>
          ))}
        </h1>

        {/* 头像：3D 倾斜 + 静态轻微歪头 */}
        <motion.div
          className="order-1 col-span-12 flex justify-center [transform-style:preserve-3d] md:order-2 md:col-span-3 md:justify-end"
          style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }}
          onMouseMove={
            reduce
              ? undefined
              : (e) => {
                  const r = e.currentTarget.getBoundingClientRect()
                  const px = (e.clientX - r.left) / r.width - 0.5
                  const py = (e.clientY - r.top) / r.height - 0.5
                  tiltY.set(px * 18)
                  tiltX.set(-py * 18)
                }
          }
          onMouseLeave={() => {
            tiltX.set(0)
            tiltY.set(0)
          }}
        >
          <div className="rotate-[-3deg]">
            <Image
              src={avatarUrl ?? userIcon}
              alt={`${name} avatar`}
              width={140}
              height={140}
              priority
              unoptimized
              className="rounded-2xl shadow-soft ring-1 ring-border"
            />
          </div>
        </motion.div>
      </div>

      {/* 下方文字区：左对齐，限宽,不再居中 */}
      <div className="mt-6 max-w-xl">
        <div className="flex h-7 items-center overflow-hidden text-lg text-muted-foreground md:text-xl">
          <AnimatePresence mode="wait">
            <motion.span
              key={roleIdx}
              className="inline-flex items-center gap-2"
              initial={reduce ? false : { y: '110%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={reduce ? undefined : { y: '-110%', opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary" />
              {ROLES[roleIdx]}
            </motion.span>
          </AnimatePresence>
        </div>

        <motion.p
          className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base"
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          {description}
        </motion.p>

        <motion.div
          className="mt-5 flex flex-wrap items-center gap-3"
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.6 }}
        >
          <Magnetic>
            <Link
              href="https://github.com/vaebe"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm text-primary-foreground transition-transform hover:scale-[1.03]"
            >
              <Icon icon="mdi:github" className="h-4 w-4" /> GitHub
            </Link>
          </Magnetic>
          <Magnetic>
            <Link
              href="https://juejin.cn/user/712139266339694"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2 text-sm transition-colors hover:bg-accent"
            >
              <Icon icon="simple-icons:juejin" className="h-4 w-4" /> 掘金
            </Link>
          </Magnetic>
        </motion.div>
      </div>

      {/* 数据降级为一行朴素 byline（不再是 SaaS 指标盘）：数字承重处用墨黑加粗，标签平实 */}
      {statGroups && statGroups.length > 0 && (
        <motion.div
          className="relative mt-8 flex flex-wrap items-center gap-x-2.5 gap-y-2 border-t border-border pt-6 text-sm text-muted-foreground"
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          {statGroups.map((g, gi) => (
            <span key={g.platform} className="inline-flex flex-wrap items-center gap-x-2.5 gap-y-1">
              {gi > 0 && <span className="mx-1 hidden text-border sm:inline">/</span>}
              <Icon icon={g.icon} className="h-4 w-4 text-foreground/70" />
              {g.items.map((s, si) => (
                <span key={s.label} className="inline-flex items-center">
                  {si > 0 && <span className="mx-1.5 text-border">·</span>}
                  <span className="font-semibold text-foreground">
                    {(s.value ?? 0).toLocaleString()}
                  </span>
                  <span className="ml-1">{s.label}</span>
                </span>
              ))}
            </span>
          ))}
        </motion.div>
      )}
    </section>
  )
}
