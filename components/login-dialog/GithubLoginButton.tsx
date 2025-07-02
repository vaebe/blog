import { Icon } from '@iconify/react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { signIn } from 'next-auth/react'

interface Props {
  setIsLoading: (status: boolean) => void
}

function GithubLoginButton({ setIsLoading }: Props) {
  function handleGithubLogin() {
    setIsLoading(true)

    signIn('github', { redirect: false }).catch((error) => {
      setIsLoading(false)
      toast(`登录失败：${error}`)
    })
  }

  return (
    <Button
      className="w-full flex justify-center items-cente space-x-1 cursor-pointer"
      onClick={handleGithubLogin}
    >
      <Icon icon="mdi:github" className="h-6! w-6!" />
      <span>Github 登录</span>
    </Button>
  )
}

export { GithubLoginButton }
export default GithubLoginButton
