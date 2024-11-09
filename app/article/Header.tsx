import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PublishArticleInfo } from '@/types'
import type { Dispatch, SetStateAction } from 'react'
import { Updater } from 'use-immer'

interface HeaderProps {
  updateArticleInfo: Updater<PublishArticleInfo>
  setPublishDialogShow: Dispatch<SetStateAction<boolean>>
  title: string
  butName: string
}

function HeaderComponent({ updateArticleInfo, setPublishDialogShow, title, butName }: HeaderProps) {
  return (
    <div className="flex items-center justify-between border-b border-b-gray-200">
      <Input
        value={title}
        onChange={(e) =>
          updateArticleInfo((d) => {
            d.title = e.target.value
          })
        }
        placeholder="输入文章标题..."
        className="bg-white text-xl text-black font-bold border-none rounded-none shadow-none ring-0 !ring-offset-0 focus-visible:ring-0"
      />
      <Button className="rounded-none shadow-none" onClick={() => setPublishDialogShow(true)}>
        {butName}
      </Button>
    </div>
  )
}

export { HeaderComponent }
export default HeaderComponent
