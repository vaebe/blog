import { SectionContainer } from './sectionContainer'
import * as React from "react"
import { Icon } from '@iconify/react'

// 技术栈图标映射
const techIcons: Record<string, string> = {
  TypeScript: 'logos:typescript-icon',
  Vue: 'logos:vue',
  NuxtJs: 'logos:nuxt',
  NextJs: 'logos:nextjs-icon',
  NestJs: 'logos:nestjs',
  Go: 'logos:go',
  Mysql: 'logos:mysql',
}

const techStackData = ['TypeScript', 'Vue', 'NuxtJs', 'NextJs', 'NestJs', 'Go', 'Mysql']

export function TechnologyStack() {
  return (
    <SectionContainer title='技术栈' titleIcon='mdi:code-tags'>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {techStackData
          .map((tech) => (
            <div key={tech} className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-1">
              {techIcons[tech] ? (
                <Icon icon={techIcons[tech]} className="mr-2 w-5 h-5" />
              ) : (
                <Icon icon="mdi:code-tags" className="mr-2 w-5 h-5" />
              )}
              <span>{tech}</span>
            </div>
          ))}
      </div>
    </SectionContainer>
  )
}