import { SectionContainer } from './sectionContainer'
import * as React from "react"
import { Icon } from '@iconify/react'

export function RelatedLinks() {
  return (
    <SectionContainer title='相关链接' titleIcon='mdi:link'>
      <div className="space-y-2">
        <p className="flex items-center">
          <Icon icon="mdi:book" className="mr-2" />
          <a href="https://juejin.cn/user/712139266339694" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 dark:hover:text-blue-400">掘金主页</a>
        </p>
        <p className="flex items-center">
          <Icon icon="mdi:github" className="mr-2" />
          <a href="https://github.com/vaebe" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 dark:hover:text-blue-400">GitHub主页</a>
        </p>
      </div>
    </SectionContainer>
  )
}