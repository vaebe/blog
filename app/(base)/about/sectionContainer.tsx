import * as React from "react"
import { Icon } from '@iconify/react'

interface SectionContainerProps {
  children: React.ReactNode
  title: string
  titleIcon: string
}

export function SectionContainer({ children, title, titleIcon }: SectionContainerProps) {
  return (
    <section className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg transition-all duration-300 hover:shadow-xl">
      <h2 className="text-2xl font-semibold mb-4 flex items-center">
        <Icon icon={titleIcon} className="mr-2 text-blue-500 dark:text-blue-400" />
        {title}
      </h2>
      {children}
    </section>
  );
}