'use client'

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
import { summarize, extractFirstImageUrl } from '@/lib/markdown/extract'

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
  // 用 defaultValues 在挂载时直接初始化:发布对话框每次打开都会重新挂载本组件,
  // 回填值始终最新。避免 reset() 写法下受控的 Radix Select 因字段注册时序问题
  // 吸收不到值(原写法在编辑文章时「分类」不回填)。
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      classify: articleInfo.classify || '',
      summary: articleInfo.summary || summarize(articleInfo.content),
      coverImg: articleInfo.coverImg || extractFirstImageUrl(articleInfo.content) || ''
    }
  })
  const { handleSubmit } = form

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
