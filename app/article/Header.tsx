import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AnyObject, PublishArticleInfo } from '@/types'
import { PublishDialog } from '@/app/article/PublishDialog'
import { useRouter, usePathname } from 'next/navigation'
import { toast } from 'sonner'
import { Updater } from 'use-immer'

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

async function submitArticle(info: PublishArticleInfo, type: 'add' | 'update') {
  if (!info.title) {
    toast('文章标题不能为空!')
    return
  }

  if (!info.content) {
    toast('文章内容不能为空!')
    return
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
      return 'success'
    } else {
      toast(config.errorMsg)
    }
  } catch (error) {
    console.error(error)
    toast(config.errorMsg)
  }
}

interface HeaderProps {
  articleInfo: PublishArticleInfo
  publishButName: string
  updateArticleInfo: Updater<PublishArticleInfo>
}

function HeaderComponent({ publishButName, articleInfo, updateArticleInfo }: HeaderProps) {
  const pathName = usePathname()

  const router = useRouter()

  function onPublish(info: AnyObject) {
    const api = pathName.includes('edit')
      ? submitArticle({ ...articleInfo, ...info }, 'update')
      : submitArticle({ ...articleInfo, ...info }, 'add')

    api.then((res) => {
      if (res === 'success') {
        router.push('/article/list')
      }
    })
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

export { HeaderComponent }
export default HeaderComponent
