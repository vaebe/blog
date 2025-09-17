'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog'
import { PublishArticleInfo } from '@/types'
import { PublishForm, FormValues } from './form'
import { ApiRes } from '@/lib/utils'

interface PublishDialogProps {
  children: React.ReactNode
  articleInfo: PublishArticleInfo
  onPublish: (data: FormValues) => Promise<ApiRes>
}

export function PublishDialog({ children, articleInfo, onPublish }: PublishDialogProps) {
  const [isOpen, setIsOpen] = useState(false)

  function publishArticle(data: FormValues) {
    onPublish(data).then((res) => {
      if (res.code === 0) {
        setIsOpen(false)
      }
    })
  }

  return (
    <>
      <div onClick={() => setIsOpen(true)}>{children}</div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle>发布文章</DialogTitle>
            <DialogDescription>请填写必要信息以完成发布</DialogDescription>
          </DialogHeader>

          <PublishForm
            articleInfo={articleInfo}
            onPublish={(data) => {
              publishArticle(data)
            }}
            onCancel={() => setIsOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}
