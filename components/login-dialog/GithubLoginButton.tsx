import { Icon } from '@iconify/react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/hooks/use-toast'
import { signIn } from 'next-auth/react'

interface Props {
  setIsLoading: (status: boolean) => void
}

function GithubLoginButton({ setIsLoading }: Props) {
  const { toast } = useToast()

  function handleGithubLogin() {
    setIsLoading(true)

    signIn('github', { redirect: false }).catch((error) => {
      setIsLoading(false)
      toast({ title: '登录失败', description: error, variant: 'destructive' })
    })
  }

  return (
    <Button
      className="w-full flex justify-center items-center dark:bg-black"
      onClick={handleGithubLogin}
    >
      <Icon icon="mdi:github" className="mr-2 h-5 w-5" />
      Github 登录
    </Button>
  )
}

export { GithubLoginButton }
export default GithubLoginButton
