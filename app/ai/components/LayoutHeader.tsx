import { OpenOrCloseSiderbarIcon } from './OpenOrCloseSiderbarIcon'
import { NewChatIcon } from './NewChatIcon'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useSession } from 'next-auth/react'
import { Icon } from '@iconify/react'
import Link from 'next/link'
import { AiSharedDataContext } from './AiSharedDataContext'
import { useContext } from 'react'

function LayoutHeader() {
  const title = `${process.env.NEXT_PUBLIC_GITHUB_USER_NAME?.toLocaleUpperCase()} AI 小助手`

  const { data: session, status } = useSession()

  const { aiSharedData } = useContext(AiSharedDataContext)

  return (
    <div className="w-full flex items-center justify-between">
      <div className="flex items-center">
        {!aiSharedData.layoutSidebar && (
          <div>
            <OpenOrCloseSiderbarIcon state={true}></OpenOrCloseSiderbarIcon>
            <NewChatIcon></NewChatIcon>
          </div>
        )}

        <h1 className="text-2xl font-bold ml-2">{title}</h1>
      </div>

      <div>
        {status === 'unauthenticated' && (
          <Link href="/login">
            <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-white dark:bg-gray-800 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300 shadow-sm hover:shadow-md">
              <Icon icon="ri:aed-line" className="mr-2 w-5 h-5" />
              登录
            </div>
          </Link>
        )}

        {status === 'authenticated' && (
          <div className="flex items-center space-x-2 cursor-pointer">
            <Avatar className="w-8 h-8">
              <AvatarImage src={session?.user?.image ?? ''} alt="user" />
              <AvatarFallback>{session?.user?.name ?? 'll'}</AvatarFallback>
            </Avatar>

            <span>{session?.user?.name ?? 'll'}</span>
          </div>
        )}
      </div>
    </div>
  )
}

export { LayoutHeader }
export default LayoutHeader
