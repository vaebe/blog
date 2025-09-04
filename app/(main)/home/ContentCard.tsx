import { ReactNode } from 'react'

interface Props {
  children: ReactNode
  title: string
}

export function ContentCard({ children, title }: Props) {
  return (
    <section className="rounded-lg">
      <h2 className="text-2xl font-semibold mb-4 flex items-center border-b-2 pb-4">{title}</h2>
      {children}
    </section>
  )
}
