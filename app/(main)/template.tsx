'use client'

import { motion, useReducedMotion } from 'framer-motion'

// template 在每次路由切换时重新挂载，天然带来逐页入场动画（淡入 + 轻微上移）
export default function MainTemplate({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion()

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}
