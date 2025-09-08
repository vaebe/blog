'use client'

import { ChangeEvent, useEffect, useState } from 'react'
import Image from 'next/image'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { uploadFile } from '@/app/actions/image-kit'
import { PublishArticleInfo } from '@/types'

const CATEGORIES = ['后端', '前端', 'Android', 'iOS', '人工智能', '阅读'] as const

const formSchema = z.object({
  classify: z.string().min(1, '请选择分类'),
  summary: z.string().min(1, '请输入摘要'),
  coverImg: z.string().optional()
})

type FormValues = z.infer<typeof formSchema>

interface PublishDialogProps {
  children: React.ReactNode
  articleInfo: PublishArticleInfo
  onPublish: (data: FormValues) => void
}

export type PublishDialogRef = {
  setInitialData: (info: FormValues) => void
}

export function PublishDialog({ onPublish, children, articleInfo }: PublishDialogProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema)
  })

  const { watch, setValue, handleSubmit, reset } = form

  useEffect(() => {
    if (articleInfo) {
      reset(articleInfo)
    }
  }, [articleInfo, reset])

  const coverImg = watch('coverImg')

  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0]
      if (!file) return

      const res = await uploadFile({ file, fileName: file.name })

      if (res?.code === 0 && res.data?.url) {
        setValue('coverImg', res.data.url)
        toast.success('封面上传成功')
      } else {
        toast.error('图片上传失败')
      }
    } catch {
      toast.error('上传图片失败，请稍后重试')
    } finally {
      event.target.value = ''
    }
  }

  const onSubmit = (data: FormValues) => {
    onPublish(data)
  }

  return (
    <>
      <div onClick={() => setIsOpen(true)}>{children}</div>

      <Dialog open={isOpen} onOpenChange={() => setIsOpen(false)}>
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle>发布文章</DialogTitle>
            <DialogDescription>请填写必要信息以完成发布</DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
              {/* 分类选择 */}
              <FormField
                control={form.control}
                name="classify"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      分类<span className="text-destructive">*</span>:
                    </FormLabel>
                    <Select value={field.value} onValueChange={(value) => field.onChange(value)}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="请选择分类" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CATEGORIES.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 封面上传 */}
              <FormField
                control={form.control}
                name="coverImg"
                render={() => (
                  <FormItem>
                    <FormLabel htmlFor="coverImgInput">文章封面</FormLabel>
                    <label
                      htmlFor="coverImgInput"
                      className="flex gap-4 items-center border rounded-md cursor-pointer hover:bg-muted transition"
                    >
                      <div className="w-full min-h-[262px] h-auto border border-dashed rounded bg-muted/30 flex items-center justify-center overflow-hidden">
                        {coverImg ? (
                          <Image
                            src={coverImg}
                            alt="Cover"
                            width={192}
                            height={128}
                            className="object-cover w-full h-full"
                            priority
                          />
                        ) : (
                          <span className="text-muted-foreground">暂无封面</span>
                        )}
                      </div>
                      <input
                        id="coverImgInput"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </label>
                    <p className="text-xs text-muted-foreground mt-1">
                      建议尺寸: 192×128 px（仅在首页展示）
                    </p>
                  </FormItem>
                )}
              />

              {/* 摘要 */}
              <FormField
                control={form.control}
                name="summary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="summary">
                      编辑摘要<span className="text-destructive">*</span>:
                    </FormLabel>
                    <FormControl>
                      <Textarea {...field} id="summary" placeholder="请输入文章摘要" rows={4} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  className="cursor-pointer"
                  onClick={() => setIsOpen(false)}
                >
                  取消
                </Button>
                <Button type="submit" className="cursor-pointer">
                  确定并发布
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  )
}
