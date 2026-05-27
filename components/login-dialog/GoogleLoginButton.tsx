'use client'

import { Icon } from '@iconify/react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { authClient } from '@/lib/auth/client'

interface Props {
  setIsLoading: (status: boolean) => void
}

function GoogleLoginButton({ setIsLoading }: Props) {
  function handleGoogleLogin() {
    setIsLoading(true)

    authClient.signIn
      .social({ provider: 'google', callbackURL: window.location.origin })
      .catch((error) => {
        setIsLoading(false)
        toast(`登录失败：${error}`)
      })
  }

  return (
    <Button
      variant="outline"
      className="w-full flex justify-center items-center space-x-1 cursor-pointer"
      onClick={handleGoogleLogin}
    >
      <Icon icon="logos:google-icon" className="h-5! w-5!" />

      <span className="mx-2">Google</span>
    </Button>
  )
}

export { GoogleLoginButton }
export default GoogleLoginButton
