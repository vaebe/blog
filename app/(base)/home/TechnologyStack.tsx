import { techIcons, techStackData } from '@/lib/enums'
import { Icon } from '@iconify/react'
import { ContentCard } from './ContentCard'
import { Skeleton } from '@/components/ui/skeleton'

function sss() {
  return (
    <div className="mt-8">
      <Skeleton className="w-24 h-6 mb-4" />
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[...Array(6)].map((_, index) => (
          <Skeleton key={index} className="h-8 rounded-lg" />
        ))}
      </div>
    </div>
  )
}

export function TechnologyStack() {
  return (
    <ContentCard title="技术栈" titleIcon="">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {techStackData.map((tech) => (
          <div
            key={tech}
            className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-1"
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
