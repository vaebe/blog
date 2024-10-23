import * as React from 'react'
import { Icon } from '@iconify/react'

interface Props {
  children: React.ReactNode
  title: string
  titleIcon: string
}

export function ContentCard({ children, title, titleIcon }: Props) {
  return (
    <section className="rounded-lg">
      <h2 className="text-2xl font-semibold mb-4 flex items-center border-b-4 pb-4">
        <Icon icon={titleIcon} className="mr-2 text-blue-500 dark:text-blue-400" />
        {title}
      </h2>
      {children}
    </section>
  )
}
