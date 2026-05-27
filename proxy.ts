import { auth } from '@/lib/auth/server'

// Neon Auth 中间件：仅对管理页面要求「已登录」，未登录跳转首页。
// 管理员（role==='00'）判定下沉到服务端：
//   - 管理接口 /api/articles/{add,update,delete} 由各自的 requireAdmin() 校验并返回 401/403；
//   - 管理页面的非管理员拦截由客户端 <RequireAdmin> 处理（数据安全由接口保证）。
export default auth.middleware({ loginUrl: '/' })

export const config = {
  matcher: ['/article/add/:path*', '/article/edit/:path*']
}
