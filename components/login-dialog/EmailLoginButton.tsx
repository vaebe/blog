import { Icon } from '@iconify/react'
import { Button } from '@/components/ui/button'

interface Props {
  onClick: () => void
}

function EmailLoginButton({ onClick }: Props) {
  return (
    <Button className="w-full flex justify-center items-center" onClick={onClick}>
      <Icon icon="mdi:email" className="mr-2 h-5 w-5" />
      邮箱登录
    </Button>
  )
}

export { EmailLoginButton }
export default EmailLoginButton
