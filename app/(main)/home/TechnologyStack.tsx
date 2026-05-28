import { techIcons, techStackData } from '@/lib/enums'
import { Icon } from '@iconify/react'

export function TechnologyStack() {
  // 复制一份用于无缝循环
  const items = [...techStackData, ...techStackData]

  return (
    <section>
      <h2 className="mb-7 text-2xl font-semibold tracking-tight">技术栈</h2>

      <div className="group/marquee relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]">
        <div className="flex w-max gap-3 animate-[marquee_30s_linear_infinite] group-hover/marquee:[animation-play-state:paused]">
          {items.map((tech, i) => (
            <div
              key={`${tech}-${i}`}
              className="group/chip flex shrink-0 items-center gap-2 rounded-full border border-border bg-secondary px-4 py-2 text-sm transition-all duration-200 hover:border-primary/40 hover:bg-accent"
            >
              <Icon
                icon={techIcons[tech] ? techIcons[tech] : 'mdi:code-tags'}
                className="h-4 w-4 text-muted-foreground transition-colors group-hover/chip:text-primary"
              />
              <span className="whitespace-nowrap">{tech}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
