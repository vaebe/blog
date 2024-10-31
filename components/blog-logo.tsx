import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import LightLogo from '@/public/light-logo.svg'
import DarkLogo from '@/public/dark-logo.svg'

function BlogLogo() {
  const { theme, systemTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  const currentTheme = theme === 'system' ? systemTheme : theme
  const logoSrc = currentTheme === 'dark' ? LightLogo : DarkLogo

  return (
    <Image
      src={logoSrc}
      alt={`${currentTheme} mode logo`}
      width={40}
      height={40}
      priority
      placeholder="empty"
    />
  )
}

export { BlogLogo }
export default BlogLogo
