import { Suspense } from 'react'
import { EditArticle } from './EditArticle'

export default function PublishArticle(props: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<div className="h-screen" />}>
      <EditArticle params={props.params} />
    </Suspense>
  )
}
