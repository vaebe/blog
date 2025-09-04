import { auth } from '@/auth'
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

export default auth((req) => {
  const token = req.auth?.accessToken
  const path = req.nextUrl.pathname

  if (token?.role !== '00') {
    if (ADMIN_APIS.some((item) => path.startsWith(item))) {
      // 如果没有访问接口的权限返回 401
      return sendJson({ code: 401, msg: '无权限' })
    }

    if (ADMIN_PAGES.some((item) => path.startsWith(item))) {
      // 如果用户没有权限访问管理页面，重定向到404页面
      const url = req.nextUrl.clone()
      url.pathname = '/404'
      return Response.redirect(url)
    }
  }
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}
