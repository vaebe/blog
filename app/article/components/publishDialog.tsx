'use client'

import { ChangeEvent } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/components/hooks/use-toast'
import { PublishArticleInfo } from '@/types'
import { Updater } from 'use-immer'

interface PublishDialogProps {
  isOpen: boolean
  articleInfo: PublishArticleInfo
  updateArticleInfo: Updater<PublishArticleInfo>
  onClose: () => void
  onPublish: () => void
}

export interface PublishData {
  category: string
  coverImage: string
  summary: string
}

const categories = ['后端', '前端', 'Android', 'iOS', '人工智能', '开发工具', '代码人生', '阅读']

export function PublishDialog({
  isOpen,
  articleInfo,
  updateArticleInfo,
  onClose,
  onPublish
}: PublishDialogProps) {
  const handlePublish = () => {
    if (!articleInfo.category) {
      toast({ variant: 'destructive', title: '警告', description: '文章分类不能为空' })
      return
    }

    if (!articleInfo.summary) {
      toast({ variant: 'destructive', title: '警告', description: '文章简介不能为空' })
      return
    }

    onPublish()
  }

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        updateArticleInfo((d) => {
          d.coverImage = reader.result as string
        })
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>发布文章</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="category">
              分类<span className="text-red-500">*</span>:
            </Label>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <Button
                  key={cat}
                  variant={articleInfo.category === cat ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => updateArticleInfo((d) => (d.category = cat))}
                >
                  {cat}
                </Button>
              ))}
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="cover">文章封面:</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer">
              {articleInfo.coverImage ? (
                <img src={articleInfo.coverImage} alt="Cover" className="max-w-full h-auto" />
              ) : (
                <label htmlFor="coverImageInput" className="cursor-pointer">
                  <div>
                    <span className="block text-2xl mb-2">+</span>
                    <span>上传封面</span>
                  </div>
                  <input
                    id="coverImageInput"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-1">
              建议尺寸: 192*128px (封面仅展示在首页信息流中)
            </p>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="summary">
              编辑摘要<span className="text-red-500">*</span>:
            </Label>
            <Textarea
              id="summary"
              value={articleInfo.summary}
              onChange={(e) => updateArticleInfo((d) => (d.summary = e.target.value))}
              placeholder="请输入文章摘要"
              rows={4}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            取消
          </Button>
          <Button onClick={handlePublish}>确定并发布</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
