'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { DialogFooter } from '@/components/ui/dialog'
import { Form } from '@/components/ui/form'
import { PublishArticleInfo } from '@/types'
import { FormCategoryField } from './form-category-field'
import { FormCoverUpload } from './form-cover-upload'
import { FormSummaryField } from './form-summary-field'

const formSchema = z.object({
  classify: z.string().min(1, '请选择分类'),
  summary: z.string().min(1, '请输入摘要'),
  coverImg: z.string().optional()
})

export type FormValues = z.infer<typeof formSchema>

interface PublishFormProps {
  articleInfo: PublishArticleInfo
  onPublish: (data: FormValues) => void
  onCancel: () => void
}

export function PublishForm({ articleInfo, onPublish, onCancel }: PublishFormProps) {
  const form = useForm<FormValues>({ resolver: zodResolver(formSchema) })
  const { handleSubmit, reset } = form

  useEffect(() => {
    if (articleInfo) reset(articleInfo)
  }, [articleInfo, reset])

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onPublish)} className="grid gap-4 py-4">
        <FormCategoryField control={form.control} />
        <FormCoverUpload control={form.control} />
        <FormSummaryField control={form.control} />

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            取消
          </Button>
          <Button type="submit">确定并发布</Button>
        </DialogFooter>
      </form>
    </Form>
  )
}
