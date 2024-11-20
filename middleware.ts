import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'
import { sendJson } from '@/lib/utils'

const ADMIN_PAGES = ['/article/add', '/article/edit']

const ADMIN_APIS = [
  '/api/articles/delete',
  '/api/articles/add',
  '/api/articles/update',
  '/api/user',
  '/api/imagekit/getFileInfoByHash',
  '/api/imagekit/getToken'
]

// 用户登录后可以访问的 api
const USER_APIS = ['/api/conversation']

export default withAuth(
  function middleware(req) {
    console.log('request:', req.method, req.url)

    const token = req.nextauth.token
    const path = req.nextUrl.pathname

    // 用户无权访问返回 401
    if (!token && USER_APIS.some((item) => path.startsWith(item))) {
      return sendJson({ code: 401, msg: '无权限' })
    }

    if (token?.role !== '00') {
      if (ADMIN_APIS.some((item) => path.startsWith(item))) {
        // 如果没有访问接口的权限返回 401
        return sendJson({ code: 401, msg: '无权限' })
      }

      if (ADMIN_PAGES.some((item) => path.startsWith(item))) {
        // 如果用户没有权限访问管理页面，重定向到404页面
        const url = req.nextUrl.clone()
        url.pathname = '/404'
        return NextResponse.rewrite(url)
      }
    }
  },
  {
    callbacks: {
      authorized: function () {
        // 这里返回 false 会到登录页面可以做额外的鉴权
        return true
      }
    }
  }
)

export const config = {
  matcher: [
    // 匹配页面路由
    '/((?!_next/static|_next/image|.*\\.png$).*)',
    // 匹配 API 路由
    '/api/:path*'
  ]
}
