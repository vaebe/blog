import { createNeonAuth } from '@neondatabase/auth/next/server'

// Neon Auth 服务端实例：用于 RSC、Server Actions、Route Handlers 与中间件。
// baseUrl 为 Neon 控制台开通 Neon Auth 后给出的鉴权服务地址；
// cookies.secret 用于签名会话 cookie，至少 32 字符（openssl rand -base64 32）。
export const auth = createNeonAuth({
  baseUrl: process.env.NEON_AUTH_BASE_URL!,
  cookies: {
    secret: process.env.NEON_AUTH_COOKIE_SECRET!
  }
})
