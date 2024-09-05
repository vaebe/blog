'use client'

import { Icon } from '@iconify/react'
import { cn } from '@/lib/utils'

interface LoadingProps {
  isLoading: boolean
  size?: number
  className?: string
}

export function BaseLoading({ isLoading, size = 24, className }: LoadingProps) {
  if (!isLoading) return null

  return (
    <div className={cn('flex items-center justify-center py-4', className)}>
      <Icon
        icon="eos-icons:loading"
        className="animate-spin text-primary"
        width={size}
        height={size}
      />
    </div>
  )
}
