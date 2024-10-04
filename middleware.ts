import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

const ADMIN_PAGES = ['/article/add']
const ADMIN_APIS = [
  '/api/articles/delete',
  '/api/articles/add',
  '/api/articles/update',
  '/api/user'
]
const ADMIN_PATH_ALL = [...ADMIN_PAGES, ...ADMIN_APIS]

export default withAuth(
  function middleware(req) {
    console.log('request:', req.method, req.url)

    const token = req.nextauth.token
    const pathname = req.nextUrl.pathname
    if (ADMIN_PATH_ALL.some((item) => pathname.startsWith(item)) && token?.role !== '00') {
      // 如果用户没有权限访问管理页面，重定向到404页面 而不是
      return NextResponse.rewrite(new URL('/404', req.url))
    }
  },
  {
    callbacks: {
      authorized: function ({ token, req }) {
        // 这里返回 false 会到登录页面可以做额外的鉴权
        return true
      }
    }
  }
)

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)']
}
