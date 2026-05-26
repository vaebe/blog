import { Suspense } from 'react'
import { ArticleDetail } from './ArticleDetail'

export default function Page(props: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<div className="max-w-4xl mx-auto my-2 h-64 animate-pulse motion-reduce:animate-none" />}>
      <ArticleDetail params={props.params} />
    </Suspense>
  )
}
