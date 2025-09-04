import { techIcons, techStackData } from '@/lib/enums'
import { Icon } from '@iconify/react'
import { ContentCard } from './ContentCard'

export function TechnologyStack() {
  return (
    <ContentCard title="技术栈">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {techStackData.map((tech) => (
          <div
            key={tech}
            className="flex items-center bg-black/5 dark:bg-white/20 rounded-lg px-3 py-1"
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
