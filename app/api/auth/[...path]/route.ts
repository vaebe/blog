import { auth } from '@/lib/auth/server'

// Neon Auth 鉴权代理路由：把客户端请求转发到 Neon Auth 服务。
export const { GET, POST } = auth.handler()
