// next-auth.d.ts
import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name: string | null
      email: string | null
      image: string | null
      role?: string | null // 扩展 Session 类型，添加 role 属性
    }
  }
  interface User {
    role?: string | null
  }
}
