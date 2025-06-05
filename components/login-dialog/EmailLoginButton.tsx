import { Icon } from '@iconify/react'
import { Button } from '@/components/ui/button'

interface Props {
  onClick: () => void
}

function EmailLoginButton({ onClick }: Props) {
  return (
    <Button className="w-full flex justify-center items-center cursor-pointer" onClick={onClick}>
      <Icon icon="mdi:email" className="mr-1 h-6! w-6!" />
      邮箱登录
    </Button>
  )
}

export { EmailLoginButton }
export default EmailLoginButton
