import { techIcons, techStackData } from '@/lib/enums'
import { Icon } from '@iconify/react'
import { ContentCard } from './ContentCard'

export function TechnologyStack() {
  return (
    <ContentCard title="技术栈" titleIcon="">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  xl:grid-cols-4 gap-4">
        {techStackData.map((tech) => (
          <div
            key={tech}
            className="flex items-center bg-black/10 dark:bg-white/10 rounded-lg px-3 py-1"
          >
            <Icon
              icon={techIcons[tech] ? techIcons[tech] : 'mdi:code-tags'}
              className="mr-2 w-5 h-5"
            />
            <span>{tech}</span>
          </div>
        ))}
      </div>
    </ContentCard>
  )
}
