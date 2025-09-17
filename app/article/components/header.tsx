import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AnyObject, PublishArticleInfo } from '@/types'
import { PublishDialog } from '@/app/article/components/publish-dialog'
import { useRouter, usePathname } from 'next/navigation'
import { toast } from 'sonner'
import { Updater } from 'use-immer'
import { ApiRes } from '@/lib/utils'

const SubmitArticleConfig = {
  add: {
    url: '/api/articles/add',
    method: 'POST',
    successMsg: '文章发布成功!',
    errorMsg: '发布文章时出现错误!'
  },
  update: {
    url: '/api/articles/update',
    method: 'PUT',
    successMsg: '编辑成功!',
    errorMsg: '编辑文章时出现错误!'
  }
}

async function submitArticle(info: PublishArticleInfo, type: 'add' | 'update'): Promise<ApiRes> {
  if (!info.title) {
    toast('文章标题不能为空!')
    return { code: -1, msg: '文章标题不能为空!' }
  }

  if (!info.content) {
    toast('文章内容不能为空!')
    return { code: -1, msg: '文章内容不能为空!' }
  }

  const config = SubmitArticleConfig[type]

  try {
    const res = await fetch(config.url, {
      method: config.method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(info)
    }).then((res) => res.json())

    if (res.code === 0) {
      toast(config.successMsg)
      return { code: 0, msg: config.successMsg }
    } else {
      toast(config.errorMsg)
      return { code: 500, msg: config.errorMsg }
    }
  } catch (error) {
    console.error(error)
    toast(config.errorMsg)
    return { code: 500, msg: config.errorMsg }
  }
}

interface HeaderProps {
  articleInfo: PublishArticleInfo
  publishButName: string
  updateArticleInfo: Updater<PublishArticleInfo>
}

function LayoutHeader({ publishButName, articleInfo, updateArticleInfo }: HeaderProps) {
  const pathName = usePathname()

  const router = useRouter()

  async function onPublish(info: AnyObject) {
    const res = pathName.includes('edit')
      ? await submitArticle({ ...articleInfo, ...info }, 'update')
      : await submitArticle({ ...articleInfo, ...info }, 'add')

    if (res.code == 0) {
      router.push('/article/list')
    }

    return res
  }

  return (
    <div className="flex items-center justify-between border-b border-b-gray-200">
      <Input
        value={articleInfo.title}
        onChange={(e) =>
          updateArticleInfo((d) => {
            d.title = e.target.value
          })
        }
        placeholder="输入文章标题..."
        className="bg-white !text-2xl text-black font-medium border-none rounded-none shadow-none ring-0 !ring-offset-0 focus-visible:ring-0"
      />

      <PublishDialog articleInfo={articleInfo} onPublish={onPublish}>
        <Button className="rounded-none shadow-none cursor-pointer">{publishButName}</Button>
      </PublishDialog>
    </div>
  )
}

export { LayoutHeader }
